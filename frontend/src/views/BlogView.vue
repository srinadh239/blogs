<template>
  <div class="blog-view">
    <div class="blog-header">
      <h1>Blog</h1>
      <button v-if="isAuthenticated" @click="router.push('/create-post')" class="create-button">
        Create New Post
      </button>
    </div>

    <div class="blog-content">
      <div class="blog-tabs">
        <button :class="{ active: activeTab === 'all' }" @click="handleTabChange('all')">
          All Posts
        </button>
        <button
          v-if="isAuthenticated"
          :class="{ active: activeTab === 'my' }"
          @click="handleTabChange('my')"
        >
          My Posts
        </button>
      </div>

      <BlogPostList
        :posts="blogStore.posts"
        :loading="blogStore.loading"
        :error="blogStore.error"
        @edit="handleEditPost"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'
import BlogPostList from '@/components/blog/BlogPostList.vue'

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
}

const router = useRouter()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const activeTab = ref<'all' | 'my'>('all')
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  await fetchPosts()
})

const fetchPosts = async () => {
  if (activeTab.value === 'all') {
    await blogStore.fetchAllPosts()
  } else {
    await blogStore.fetchMyPosts()
  }
}

const handleTabChange = async (tab: 'all' | 'my') => {
  activeTab.value = tab
  await fetchPosts()
}

const handleEditPost = (post: Post) => {
  router.push(`/create-post?post=${post.id}`)
}
</script>

<style scoped>
.blog-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-button {
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #45a049;
}

.blog-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.blog-tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.blog-tabs button.active {
  color: #2196f3;
  border-bottom-color: #2196f3;
}

.blog-tabs button:hover {
  color: #2196f3;
}
</style>
