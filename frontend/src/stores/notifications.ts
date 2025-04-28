import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './auth';

interface Notification {
  id: string;
  type: 'new_post';
  message: string;
  postId: string;
  createdAt: Date;
  read: boolean;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const channel = ref<any>(null);
  const authStore = useAuthStore();
  const isSubscribed = ref(false);

  // Subscribe to new blog posts
  const subscribeToNewPosts = () => {
    if (isSubscribed.value) {
      return;
    }

    if (channel.value) {
      supabase.removeChannel(channel.value);
    }

    channel.value = supabase
      .channel('blog_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'blog_posts',
          filter: 'author_id=neq.' + authStore.user?.id,
        },
        (payload) => {
          const newPost = payload.new;
          addNotification({
            id: crypto.randomUUID(),
            type: 'new_post',
            message: `New blog post: ${newPost.title}`,
            postId: newPost.id,
            createdAt: new Date(),
            read: false,
          });
        }
      )
      .subscribe((status) => {
        isSubscribed.value = status === 'SUBSCRIBED';
      });

    return () => {
      if (channel.value) {
        supabase.removeChannel(channel.value);
        channel.value = null;
        isSubscribed.value = false;
      }
    };
  };

  const addNotification = (notification: Notification) => {
    notifications.value.unshift(notification);
    unreadCount.value++;
  };

  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      unreadCount.value--;
    }
  };

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.read = true;
    });
    unreadCount.value = 0;
  };

  const clearNotifications = () => {
    notifications.value = [];
    unreadCount.value = 0;
  };

  // Watch for auth state changes
  const unsubscribe = authStore.$subscribe((mutation, state) => {
    if (state.user && !isSubscribed.value) {
      subscribeToNewPosts();
    } else if (!state.user) {
      if (channel.value) {
        supabase.removeChannel(channel.value);
        channel.value = null;
        isSubscribed.value = false;
      }
      clearNotifications();
    }
  });

  // Cleanup on store destruction
  onUnmounted(() => {
    unsubscribe();
    if (channel.value) {
      supabase.removeChannel(channel.value);
      channel.value = null;
      isSubscribed.value = false;
    }
  });

  return {
    notifications,
    unreadCount,
    subscribeToNewPosts,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}); 