<template>
  <div class="blog-post-form">
    <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required :disabled="loading" />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea id="content" v-model="content" required :disabled="loading" rows="10"></textarea>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="button-group">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post' }}
        </button>
        <button type="button" @click="$emit('cancel')" :disabled="loading">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'

const props = defineProps<{
  post?: {
    id: string
    title: string
    content: string
  }
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'saved'): void
}>()

const blogStore = useBlogStore()
const title = ref('')
const content = ref('')
const loading = ref(false)
const error = ref('')

const isEditing = computed(() => !!props.post)

onMounted(() => {
  if (props.post) {
    title.value = props.post.title
    content.value = props.post.content
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isEditing.value && props.post) {
      await blogStore.updatePost(props.post.id, title.value, content.value)
    } else {
      await blogStore.createPost(title.value, content.value)
    }
    emit('saved')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.blog-post-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 200px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button[type='submit'] {
  background-color: #4caf50;
  color: white;
}

button[type='button'] {
  background-color: #f44336;
  color: white;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #f44336;
  margin: 1rem 0;
}
</style>
