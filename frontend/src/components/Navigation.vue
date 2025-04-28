<template>
  <nav class="navigation">
    <div class="nav-brand">
      <router-link to="/">Blog Platform</router-link>
    </div>
    <div class="nav-links">
      <template v-if="isAuthenticated">
        <!-- <router-link to="/blog">Blog</router-link> -->
        <NotificationBell />
        <button @click="handleSignOut" class="sign-out" :disabled="loading">
          {{ loading ? 'Signing out...' : 'Sign Out' }}
        </button>
      </template>
      <template v-else>
        <router-link to="/signin">Sign In</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import NotificationBell from './notifications/NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Watch for auth state changes
watch(isAuthenticated, (newValue) => {
  // If user is not authenticated and on a protected route, redirect to sign in
  if (!newValue && router.currentRoute.value.meta.requiresAuth) {
    router.push('/signin')
  }
  // If user is authenticated and on a guest route, redirect to home
  if (newValue && router.currentRoute.value.meta.requiresGuest) {
    router.push('/')
  }
})

const handleSignOut = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    await authStore.signOut()
    router.push('/signin')
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #444;
}

.sign-out {
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-out:hover {
  background-color: #444;
}

.sign-out:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
