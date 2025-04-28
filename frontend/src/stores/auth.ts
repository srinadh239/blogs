import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  async function signUp(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      user.value = data.user;
      return data;
    } catch (err: any) {
      if (err.message.includes('User already registered')) {
        error.value = 'This email is already registered. Please sign in instead.';
      } else if (err.message.includes('Password should be at least 6 characters')) {
        error.value = 'Password must be at least 6 characters long.';
      } else {
        error.value = err.message || 'An error occurred during sign up.';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      user.value = data.user;
      return data;
    } catch (err: any) {
      if (err.message.includes('Email not confirmed')) {
        error.value = 'Email not confirmed. Please check your email for the confirmation link.';
      } else if (err.message.includes('Invalid login credentials')) {
        error.value = 'Invalid email or password. Please try again.';
      } else {
        error.value = err.message || 'An error occurred during sign in.';
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resendConfirmationEmail(email: string) {
    loading.value = true;
    error.value = null;
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (resendError) throw resendError;
      return true;
    } catch (err: any) {
      error.value = err.message || 'An error occurred while resending the confirmation email.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function signOut() {
    loading.value = true;
    error.value = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      // Clear the user state
      user.value = null;
      
      // Clear any stored data
      localStorage.removeItem('supabase.auth.token');
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'An error occurred during sign out.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getCurrentUser() {
    loading.value = true;
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session?.user) {
        user.value = session.user;
      } else {
        user.value = null;
      }
    } catch (err: any) {
      error.value = err.message || 'An error occurred while fetching user data.';
      user.value = null;
    } finally {
      loading.value = false;
    }
  }

  // Initialize auth state
  getCurrentUser();

  // Subscribe to auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      user.value = session.user;
    } else if (event === 'SIGNED_OUT') {
      user.value = null;
    } else if (event === 'TOKEN_REFRESHED' && session?.user) {
      user.value = session.user;
    }
  });

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    resendConfirmationEmail,
  };
}); 