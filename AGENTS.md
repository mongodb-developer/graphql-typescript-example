# AGENTS.md - AI Agent Context for GraphQL with MongoDB Example

This document provides comprehensive context about the project for AI agents and assistants working with this codebase.

## Project Overview

**Name:** GraphQL with MongoDB Example  
**Type:** GraphQL API Server  
**Purpose:** A full-stack GraphQL API with persistent data storage, supporting complete CRUD operations for user management.

## Technology Stack

### Core Technologies
- **Runtime:** Node.js (v16+)
- **Language:** TypeScript 5.3.3
- **API Layer:** GraphQL with Apollo Server 4.10.0
- **Web Framework:** Express 4.18.2
- **Database:** MongoDB 6.20.0
- **Development Tool:** tsx 4.20.6 (TypeScript execution)

### Key Dependencies
- `@apollo/server` - GraphQL server implementation
- `graphql` - GraphQL query language
- `express` - HTTP server framework
- `mongodb` - MongoDB native driver
- `cors` - Cross-Origin Resource Sharing middleware
- `body-parser` - Request body parsing
- `dotenv` - Environment variable management

## Project Architecture

### Directory Structure
```
src/
├── database/
│   ├── connection.ts      # MongoDB connection singleton
│   └── userService.ts     # User data access layer (DAO pattern)
├── resolvers/
│   └── index.ts          # GraphQL resolvers
├── schema/
│   └── typeDefs.ts       # GraphQL type definitions
├── types/
│   └── index.ts          # TypeScript interfaces
└── index.ts              # Application entry point
```

### Architecture Pattern
- **Layered Architecture:**
  - Presentation Layer: GraphQL resolvers
  - Service Layer: UserService (business logic + data access)
  - Data Layer: MongoDB connection management

## Core Components

### 1. Server Entry Point (`src/index.ts`)
- Initializes MongoDB connection
- Creates database indexes
- Sets up Apollo Server with Express
- Provides `/graphql` endpoint for GraphQL operations
- Provides `/health` endpoint for health checks
- Implements graceful shutdown on SIGINT/SIGTERM

**Key Functions:**
- `startServer()` - Async initialization and startup

### 2. Database Connection (`src/database/connection.ts`)
**Pattern:** Singleton pattern for database connection

**Exports:**
- `connectToDatabase()` - Establishes MongoDB connection, returns Db instance
- `getDatabase()` - Returns existing Db instance (throws if not connected)
- `closeDatabase()` - Closes connection and cleans up

**State:**
- `db: Db | null` - Database instance
- `client: MongoClient | null` - MongoDB client

### 3. User Service (`src/database/userService.ts`)
**Pattern:** Data Access Object (DAO)

**Class:** `UserService`
- **Collection:** `users` collection in MongoDB
- **Document Interface:** `UserDocument` (internal MongoDB representation)

**Methods:**
- `getAllUsers()` - Fetch all users
- `getUserById(id)` - Fetch single user by MongoDB ObjectId
- `createUser(input)` - Insert new user
- `updateUser(input)` - Update existing user
- `deleteUser(id)` - Remove user
- `createIndexes()` - Initialize database indexes
- `toUser(doc)` - Private helper to convert MongoDB document to GraphQL User type

**Indexes:**
- `email` - Unique index (prevents duplicate emails)
- `createdAt` - Descending index (for sorting)

### 4. GraphQL Schema (`src/schema/typeDefs.ts`)

**Type:** `User`
```graphql
type User {
  id: ID!           # MongoDB ObjectId as string
  name: String!
  email: String!
  age: Int          # Optional
  createdAt: String! # ISO 8601 date string
}
```

**Queries:**
- `users: [User!]!` - Returns all users
- `user(id: ID!): User` - Returns single user or null

**Mutations:**
- `createUser(name: String!, email: String!, age: Int): User!`
- `updateUser(id: ID!, name: String, email: String, age: Int): User`
- `deleteUser(id: ID!): Boolean!`

### 5. Resolvers (`src/resolvers/index.ts`)
- Direct mapping to UserService methods
- Each resolver creates a new UserService instance
- Minimal business logic (service layer handles this)

### 6. TypeScript Types (`src/types/index.ts`)

**Interfaces:**
- `User` - GraphQL User type representation
- `CreateUserInput` - Input for creating users
- `UpdateUserInput` - Input for updating users

## Database Schema

### Collection: `users`

**Document Structure:**
```typescript
{
  _id: ObjectId,           // MongoDB primary key
  name: string,            // User's full name
  email: string,           // Unique email address
  age?: number,            // Optional age
  createdAt: Date          // Timestamp of creation
}
```

**Indexes:**
1. `{ email: 1 }` - Unique ascending index on email
2. `{ createdAt: -1 }` - Descending index for chronological queries

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017?appName=devrel-graphql`)

### Optional
- `DB_NAME` - Database name (default: `graphql_example`)
- `PORT` - Server port (default: `3000`)

### Configuration
Environment variables are loaded via `dotenv` package from `.env` file (not committed to git).

## Development Commands

```bash
npm run dev          # Start development server with tsx
npm run dev:watch    # Start dev server with auto-reload
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled production build
npm run watch        # Watch mode for TypeScript compilation
```

## API Endpoints

- **GraphQL Playground:** `http://localhost:3000/graphql`
- **Health Check:** `http://localhost:3000/health`

## Common Patterns & Conventions

### 1. ObjectId Handling
- MongoDB uses `ObjectId` type for `_id` field
- GraphQL exposes this as `ID!` type (string representation)
- UserService handles conversion: `new ObjectId(id)` and `_id.toString()`
- Invalid ObjectId strings are caught and return `null` or `false`

### 2. Error Handling
- Database connection errors are thrown and cause server shutdown
- Invalid ObjectId errors are caught and return null/false gracefully
- Duplicate email errors will throw due to unique index

### 3. Date Handling
- MongoDB stores dates as `Date` objects
- GraphQL returns ISO 8601 strings via `toISOString()`

### 4. Service Layer Pattern
- Each resolver creates a new `UserService` instance
- UserService retrieves database via `getDatabase()`
- Separation of concerns: resolvers handle GraphQL, service handles data

### 5. Type Safety
- TypeScript strict mode enabled
- Internal `UserDocument` interface for MongoDB
- Public `User` interface for GraphQL
- Conversion via `toUser()` method

## Important Notes for AI Agents

### When Modifying the Codebase:

1. **Adding New Fields to User:**
   - Update `UserDocument` interface in `userService.ts`
   - Update `User` type in `typeDefs.ts`
   - Update `User` interface in `types/index.ts`
   - Update `toUser()` method in `userService.ts`
   - Update relevant Input types if needed
   - Consider adding database migration for existing documents

2. **Adding New Entities:**
   - Create new service class in `database/`
   - Add collection type definition
   - Create GraphQL types in `typeDefs.ts`
   - Add resolvers in `resolvers/index.ts`
   - Create TypeScript interfaces in `types/index.ts`
   - Initialize indexes in server startup

3. **Database Operations:**
   - Always use UserService methods, never direct collection access in resolvers
   - ObjectId validation is handled in UserService
   - Consider unique constraints when modifying schemas

4. **Error Handling:**
   - UserService catches ObjectId errors and returns null/false
   - Unique constraint violations will throw MongoDB errors
   - Connection errors should be fatal (server shutdown)

5. **Testing:**
   - MongoDB must be running locally or accessible via MONGODB_URI
   - Use GraphQL Playground for manual testing
   - Bruno collection exists in `bruno/` directory for API testing

### Current State:
- The project is fully functional with basic CRUD operations
- Graceful shutdown is implemented
- Database indexes are automatically created on startup
- TypeScript compilation outputs to `dist/` directory
- Production build uses compiled JavaScript from `dist/`

### Known Limitations:
- No authentication/authorization
- No input validation beyond TypeScript types
- No pagination for `users` query
- No field-level resolvers (all fields resolved automatically)
- No DataLoader (no N+1 query optimization)
- No subscription support
- Email uniqueness enforced at database level only

### Build Output:
- Compiled JavaScript: `dist/`
- Source maps: `*.js.map`
- Type declarations: `*.d.ts` and `*.d.ts.map`

## GraphQL Operations Reference

### Query Examples:
```graphql
# Get all users
query {
  users {
    id
    name
    email
    age
    createdAt
  }
}

# Get single user
query {
  user(id: "507f1f77bcf86cd799439011") {
    id
    name
    email
  }
}
```

### Mutation Examples:
```graphql
# Create user
mutation {
  createUser(name: "John Doe", email: "john@example.com", age: 30) {
    id
    name
    email
    createdAt
  }
}

# Update user
mutation {
  updateUser(id: "507f1f77bcf86cd799439011", name: "Jane Doe") {
    id
    name
    email
  }
}

# Delete user
mutation {
  deleteUser(id: "507f1f77bcf86cd799439011")
}
```

## Additional Resources

- **README.md** - User-facing documentation with setup instructions
- **MONGODB_SETUP.md** - Detailed MongoDB installation and setup guide
- **bruno/** - API test collection for Bruno API client
- **tsconfig.json** - TypeScript compiler configuration

## Version Information

- **Node.js Target:** ES2020
- **Module System:** CommonJS
- **TypeScript Target:** ES2020
- **Strict Mode:** Enabled

---

*This document is intended for AI agents and should be kept in sync with major architectural changes to the codebase.*

