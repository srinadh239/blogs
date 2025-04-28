<template>
  <div class="blog-post-list">
    <div v-if="loading" class="loading">Loading posts...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="no-posts">No posts found.</div>
    <div v-else class="posts">
      <article v-for="post in posts" :key="post.id" class="post">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.createdAt) }}</span>
          <span v-if="isAuthor(post)" class="post-actions">
            <button @click="$emit('edit', post)" class="edit-button">Edit</button>
            <button @click="handleDelete(post)" class="delete-button">Delete</button>
          </span>
        </div>
        <div class="post-content">{{ post.content }}</div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  posts: Array<{
    id: string
    title: string
    content: string
    authorId: string
    createdAt: Date
    updatedAt: Date
  }>
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'edit', post: any): void
}>()

const blogStore = useBlogStore()
const authStore = useAuthStore()

const isAuthor = (post: any) => {
  return authStore.user?.id === post.authorId
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleDelete = async (post: any) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await blogStore.deletePost(post.id)
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }
}
</script>

<style scoped>
.blog-post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error,
.no-posts {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}

.post {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.post-title {
  margin: 0 0 1rem;
  color: #333;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #2196f3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.post-content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
