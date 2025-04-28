# Blog Platform Frontend

A modern blog platform built with Vue 3, TypeScript, and Vite. This frontend application provides a user-friendly interface for creating, reading, and managing blog posts.

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, and delete blog posts
- Real-time notifications for new posts
- Responsive design
- Modern UI with smooth transitions

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Pinia for state management
- Vue Router
- Supabase for real-time features
- Apollo Client for GraphQL

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
VITE_GRAPHQL_URL=your_graphql_endpoint
```

## Project Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Development

The development server will start at `http://localhost:5173` by default.

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

### Type Support

For TypeScript support in `.vue` files, we use `vue-tsc` for type checking. Make sure to have the TypeScript Vue Plugin (Volar) installed in your IDE.

## Project Structure

```
src/
├── components/     # Vue components
├── stores/        # Pinia stores
├── views/         # Page components
├── router/        # Vue Router configuration
├── lib/           # Utility functions and configurations
└── graphql/       # GraphQL queries and mutations
```

## License

MIT
