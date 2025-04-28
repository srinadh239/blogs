import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApolloClient } from '@vue/apollo-composable';
import { useAuthStore } from './auth';
import { supabase } from '@/lib/supabase';
import gql from 'graphql-tag';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useBlogStore = defineStore('blog', () => {
  const { client } = useApolloClient();
  const authStore = useAuthStore();
  const posts = ref<BlogPost[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const GET_ALL_POSTS = gql`
    query GetAllPosts {
      getAllBlogPosts {
        id
        title
        content
        authorId
        createdAt
        updatedAt
      }
    }
  `;

  const GET_MY_POSTS = gql`
    query GetMyPosts {
      getMyBlogPosts {
        id
        title
        content
        authorId
        createdAt
        updatedAt
      }
    }
  `;

  const CREATE_POST = gql`
    mutation CreatePost($title: String!, $content: String!) {
      createBlogPost(title: $title, content: $content) {
        id
        title
        content
        authorId
        createdAt
        updatedAt
      }
    }
  `;

  const UPDATE_POST = gql`
    mutation UpdatePost($id: String!, $title: String!, $content: String!) {
      updateBlogPost(id: $id, title: $title, content: $content) {
        id
        title
        content
        authorId
        createdAt
        updatedAt
      }
    }
  `;

  const DELETE_POST = gql`
    mutation DeletePost($id: String!) {
      deleteBlogPost(id: $id)
    }
  `;

  async function fetchAllPosts() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await client.query({
        query: GET_ALL_POSTS,
      });
      posts.value = data.getAllBlogPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyPosts() {
    if (!authStore.isAuthenticated) {
      error.value = 'You must be logged in to view your posts';
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const { data } = await client.query({
        query: GET_MY_POSTS,
        context: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      });
      posts.value = data.getMyBlogPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createPost(title: string, content: string) {
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to create a post');
    }

    loading.value = true;
    error.value = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const { data } = await client.mutate({
        mutation: CREATE_POST,
        variables: { title, content },
        context: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      });

      const newPost = {
        id: data.createBlogPost.id,
        title: data.createBlogPost.title,
        content: data.createBlogPost.content,
        authorId: data.createBlogPost.authorId,
        createdAt: new Date(data.createBlogPost.createdAt),
        updatedAt: new Date(data.createBlogPost.updatedAt),
      };

      posts.value = [newPost, ...posts.value];
      return newPost;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updatePost(id: string, title: string, content: string) {
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to update a post');
    }

    loading.value = true;
    error.value = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      const { data } = await client.mutate({
        mutation: UPDATE_POST,
        variables: { id, title, content },
        context: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      });

      const updatedPost = {
        id: data.updateBlogPost.id,
        title: data.updateBlogPost.title,
        content: data.updateBlogPost.content,
        authorId: data.updateBlogPost.authorId,
        createdAt: new Date(data.updateBlogPost.createdAt),
        updatedAt: new Date(data.updateBlogPost.updatedAt),
      };

      posts.value = posts.value.map(post => 
        post.id === id ? updatedPost : post
      );
      return updatedPost;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deletePost(id: string) {
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to delete a post');
    }

    loading.value = true;
    error.value = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No access token found');
      }

      await client.mutate({
        mutation: DELETE_POST,
        variables: { id },
        context: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      });
      posts.value = posts.value.filter(post => post.id !== id);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    posts,
    loading,
    error,
    fetchAllPosts,
    fetchMyPosts,
    createPost,
    updatePost,
    deletePost,
  };
}); 