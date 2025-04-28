<template>
  <div class="sign-in">
    <h2>Sign In</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          :disabled="loading"
        />
      </div>
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <div v-if="error.includes('Email not confirmed')" class="error-actions">
          <p class="error-help">
            Please check your email for the confirmation link. If you haven't received it or it has expired, you can request a new one.
          </p>
          <button 
            type="button" 
            @click="handleResendConfirmation" 
            :disabled="loading || resendLoading"
            class="resend-button"
          >
            {{ resendLoading ? 'Sending...' : 'Resend Confirmation Email' }}
          </button>
        </div>
      </div>
      <div class="button-group">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const resendLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.signIn(email.value, password.value)
    // Get the redirect path from the query parameters
    const redirectPath = route.query.redirect as string
    router.push(redirectPath || '/')
  } catch (err: any) {
    // Handle specific error cases
    if (err.message.includes('Email not confirmed')) {
      error.value = 'Email not confirmed. Please check your email for the confirmation link.'
    } else if (err.message.includes('Invalid login credentials')) {
      error.value = 'Invalid email or password. Please try again.'
    } else {
      error.value = err.message || 'An error occurred during sign in. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const handleResendConfirmation = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address first.'
    return
  }

  resendLoading.value = true
  error.value = ''

  try {
    await authStore.resendConfirmationEmail(email.value)
    error.value = 'Confirmation email has been resent. Please check your inbox.'
  } catch (err: any) {
    error.value = err.message || 'Failed to resend confirmation email. Please try again.'
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
.sign-in {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
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

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
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

.error-help {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.error-actions {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resend-button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.resend-button:hover {
  background-color: #1976D2;
}

.resend-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  justify-content: center;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
