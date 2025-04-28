<template>
  <div class="create-post">
    <h1>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h1>
    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          v-model="title"
          required
          :disabled="loading"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea
          id="content"
          v-model="content"
          required
          :disabled="loading"
          class="form-textarea"
          rows="10"
        ></textarea>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="button-group">
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Post') }}
        </button>
        <button type="button" @click="handleCancel" :disabled="loading" class="cancel-button">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog'

interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: Date
}

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

const title = ref('')
const content = ref('')
const loading = ref(false)
const error = ref('')

const postId = computed(() => route.query.post as string)
const isEditing = computed(() => !!postId.value)

onMounted(async () => {
  if (isEditing.value) {
    await loadPost()
  }
})

const loadPost = async () => {
  try {
    const post = blogStore.posts.find(p => p.id === postId.value)
    if (post) {
      title.value = post.title
      content.value = post.content
    } else {
      error.value = 'Post not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load post'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isEditing.value) {
      await blogStore.updatePost(postId.value, title.value, content.value)
    } else {
      await blogStore.createPost(title.value, content.value)
    }
    router.push('/blog')
  } catch (err: any) {
    error.value = err.message || 'Failed to save post. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/blog')
}
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.post-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.error-message {
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #c62828;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 