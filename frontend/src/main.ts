import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ApolloClient, createHttpLink, InMemoryCache, from, ApolloLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { supabase } from '@/lib/supabase'
import { onError } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/utilities'

import App from './App.vue'
import router from './router'

import './assets/main.css'

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  if (networkError) console.error(`[Network error]: ${networkError}`)
})

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:3200/graphql',
})

// Auth link to add token to requests
const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
      }
      forward(operation).subscribe(observer)
    })
  })
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
    },
  },
})

// Create the app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Provide Apollo client
app.provide(DefaultApolloClient, apolloClient)

// Mount the app
app.mount('#app')
