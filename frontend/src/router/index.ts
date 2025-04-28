import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import SignIn from '@/components/auth/SignIn.vue'
import SignUp from '@/components/auth/SignUp.vue'
import BlogView from '@/views/BlogView.vue'
import CreatePostView from '@/views/CreatePostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      meta: { requiresGuest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
      meta: { requiresGuest: true },
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: { requiresAuth: true },
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: CreatePostView,
      meta: { requiresAuth: true },
    },
  ]
})

// Create a function to handle auth state
const handleAuthState = async () => {
  try {
    const authStore = useAuthStore()
    await authStore.getCurrentUser()
  } catch (error) {
    console.error('Error initializing auth state:', error)
  }
}

// Initialize auth state when the app starts
// handleAuthState()

router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()
    
    // If the route requires guest access and user is authenticated
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/')
      return
    }

    // If the route requires auth and user is not authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      // Store the intended destination
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
      return
    }

    next()
  } catch (error) {
    console.error('Navigation error:', error)
    next('/')
  }
})

export default router
