<template>
  <div class="notification-bell">
    <button class="bell-button" @click="toggleDropdown">
      <span class="bell-icon">🔔</span>
      <span v-if="notificationsStore.unreadCount > 0" class="notification-badge">{{ notificationsStore.unreadCount }}</span>
    </button>

    <div v-if="showDropdown" class="notification-dropdown">
      <div class="notification-header">
        <h3>Notifications</h3>
        <button v-if="notificationsStore.notifications.length > 0" @click="markAllAsRead" class="mark-all-read">
          Mark all as read
        </button>
      </div>

      <div v-if="notificationsStore.notifications.length === 0" class="no-notifications">No notifications</div>

      <div v-else class="notification-list">
        <div
          v-for="notification in notificationsStore.notifications"
          :key="notification.id"
          :class="['notification-item', { unread: !notification.read }]"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <p class="notification-message">{{ notification.message }}</p>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'

const router = useRouter()
const notificationsStore = useNotificationsStore()
const showDropdown = ref(false)
const unsubscribe = ref<(() => void) | null>(null)

onMounted(() => {
  const cleanup = notificationsStore.subscribeToNewPosts()
  if (cleanup) {
    unsubscribe.value = cleanup
  }
})

watch(() => notificationsStore.unreadCount, (newCount) => {
  // Count changed
})

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value()
  }
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleNotificationClick = (notification: any) => {
  notificationsStore.markAsRead(notification.id)
  if (notification.type === 'new_post') {
    router.push(`/blog?post=${notification.postId}`)
  }
  showDropdown.value = false
}

const markAllAsRead = () => {
  notificationsStore.markAllAsRead()
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.bell-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
}

.bell-icon {
  font-size: 1.5rem;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: 1.5rem;
  text-align: center;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.notification-header h3 {
  margin: 0;
  font-size: 1rem;
}

.mark-all-read {
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  font-size: 0.875rem;
}

.no-notifications {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.unread {
  background-color: #e3f2fd;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.notification-message {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  font-weight: bold;
}

.notification-time {
  font-size: 0.75rem;
  color: #666;
}
</style>
