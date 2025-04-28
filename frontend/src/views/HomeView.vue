<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <div class="home">
    <h1>Welcome to the Blog Platform</h1>
    <p class="description">
      Share your thoughts and read posts from other users.
    </p>
    <div class="actions">
      <template v-if="!isAuthenticated">
        <router-link to="/signin" class="secondary-button">Sign In</router-link>
        <router-link to="/signup" class="secondary-button">Sign Up</router-link>
      </template>
      <template v-else="isAuthenticated">
        <router-link to="/blog" class="primary-button">Go to Blog</router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-button,
.secondary-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.primary-button {
  background-color: #4CAF50;
  color: white;
}

.primary-button:hover {
  background-color: #45a049;
}

.secondary-button {
  background-color: #2196F3;
  color: white;
}

.secondary-button:hover {
  background-color: #1976D2;
}
</style>
