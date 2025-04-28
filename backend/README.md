# Blog Platform Backend

A robust backend service for the blog platform, built with NestJS and GraphQL. This service handles user authentication, blog post management, and real-time notifications.

## Features

- User authentication and authorization
- GraphQL API for blog posts
- Real-time notifications using Supabase
- TypeScript for type safety
- PostgreSQL database integration

## Tech Stack

- NestJS
- GraphQL with Apollo Server
- TypeScript
- PostgreSQL
- Supabase for real-time features
- JWT for authentication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

## API Documentation

The GraphQL API is available at `/graphql` when the server is running. You can use the GraphQL Playground to explore the API schema and test queries.

### Main Queries

- `posts`: Get all blog posts
- `post(id: ID!)`: Get a specific blog post
- `myPosts`: Get posts created by the current user

### Main Mutations

- `createPost(input: CreatePostInput!)`: Create a new blog post
- `updatePost(id: ID!, input: UpdatePostInput!)`: Update an existing post
- `deletePost(id: ID!)`: Delete a blog post

## Project Structure

```
src/
├── auth/           # Authentication related code
├── blog/           # Blog post related code
├── users/          # User management
├── notifications/  # Real-time notifications
└── common/         # Shared utilities and types
```

## Development

The development server will start at `http://localhost:3000` by default.

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

MIT
