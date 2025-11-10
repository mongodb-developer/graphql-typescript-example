# GraphQL with MongoDB Example

A GraphQL API built with Node.js, TypeScript, Apollo Server 4, Express, and MongoDB. This project demonstrates full CRUD operations with persistent data storage, proper error handling, and graceful shutdown mechanisms.

## Features

- ✅ **TypeScript** - Full type safety with TypeScript 5.3.3
- ✅ **GraphQL API** - Apollo Server 4.10.0 with Express integration
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete with complete validation
- ✅ **MongoDB Integration** - MongoDB 6.20.0 with native driver
- ✅ **Health Check Endpoint** - Monitor server status at `/health`
- ✅ **Graceful Shutdown** - Proper cleanup of database connections on SIGINT/SIGTERM
- ✅ **Database Indexes** - Automatic index creation for optimal performance
- ✅ **Singleton Pattern** - Efficient database connection management
- ✅ **Service Layer Architecture** - Clean separation of concerns with DAO pattern
- ✅ **Environment Configuration** - Flexible configuration via `.env` file
- ✅ **API Testing Suite** - Bruno API collection for comprehensive testing

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [GraphQL Schema](#graphql-schema)
- [Example Queries and Mutations](#example-queries-and-mutations)
- [Project Structure](#project-structure)
- [Database](#database)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Additional Documentation](#additional-documentation)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (installed and running)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# 3. Create .env file with MongoDB connection
echo "MONGODB_URI=mongodb://localhost:27017" > .env

# 4. Start development server
npm run dev:watch

# 5. Open GraphQL Playground
# Visit http://localhost:3000/graphql in your browser
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Make sure MongoDB is running:**
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data/directory
```

3. **Configure environment variables:**
Create a `.env` file in the root directory (required for MongoDB connection):
```env
# Required
MONGODB_URI=mongodb://localhost:27017

# Optional (defaults shown)
DB_NAME=graphql_example
APP_NAME=devrel-graphql
PORT=3000
```

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (required)
- `DB_NAME` - Database name (optional, default: `graphql_example`)
- `APP_NAME` - Application name for MongoDB connection identification (optional, default: `devrel-graphql`)
- `PORT` - Server port (optional, default: `3000`)

**Note:** The `APP_NAME` is used by MongoDB for connection identification and monitoring purposes. It helps track which application is making connections in MongoDB logs and monitoring tools.

## Running the Server

### Development Mode
Start the server with tsx for fast TypeScript execution:
```bash
npm run dev
```

### Development Mode with Auto-Reload
Automatically restart the server when files change:
```bash
npm run dev:watch
```

### Production Mode
Build and run the compiled JavaScript:
```bash
# Build the TypeScript code
npm run build

# Start the server
npm start
```

The server will start at `http://localhost:3000/graphql` and initialize:
- MongoDB connection with automatic retry
- Database indexes (email uniqueness, createdAt sorting)
- GraphQL playground interface
- Health check endpoint

## API Endpoints

- **GraphQL Playground**: `http://localhost:3000/graphql`
- **Health Check**: `http://localhost:3000/health`

## GraphQL Schema

### Types

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  createdAt: String!
}
```

### Queries

```graphql
# Get all users
users: [User!]!

# Get a specific user by ID
user(id: ID!): User
```

### Mutations

```graphql
# Create a new user
createUser(name: String!, email: String!, age: Int): User!

# Update an existing user
updateUser(id: ID!, name: String, email: String, age: Int): User

# Delete a user
deleteUser(id: ID!): Boolean!
```

## Example Queries and Mutations

### Get All Users
```graphql
query {
  users {
    id
    name
    email
    age
    createdAt
  }
}
```

### Get Single User
```graphql
query {
  user(id: "MONGODB_OBJECT_ID") {
    id
    name
    email
    age
    createdAt
  }
}
```

**Note:** Replace `MONGODB_OBJECT_ID` with an actual MongoDB ObjectId (24-character hex string). You can get IDs from the `users` query.

### Create User
```graphql
mutation {
  createUser(name: "Alice Williams", email: "alice@example.com", age: 25) {
    id
    name
    email
    age
    createdAt
  }
}
```

### Update User
```graphql
mutation {
  updateUser(id: "MONGODB_OBJECT_ID", name: "John Updated", age: 31) {
    id
    name
    email
    age
    createdAt
  }
}
```

### Delete User
```graphql
mutation {
  deleteUser(id: "MONGODB_OBJECT_ID")
}
```

## Project Structure

```
graphql_example/
├── src/
│   ├── database/
│   │   ├── connection.ts      # MongoDB connection singleton
│   │   └── userService.ts     # User data access layer (DAO pattern)
│   ├── resolvers/
│   │   └── index.ts           # GraphQL resolvers
│   ├── schema/
│   │   └── typeDefs.ts        # GraphQL type definitions
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── index.ts               # Server entry point
├── bruno/                      # Bruno API testing collection
│   ├── bruno.json
│   ├── Create User.bru
│   ├── Get Users.bru
│   ├── Get Single User.bru
│   ├── Update Single User.bru
│   └── Delete Single User.bru
├── dist/                       # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── AGENTS.md                   # AI agent context and documentation
├── MONGODB_SETUP.md            # Detailed MongoDB setup guide
└── README.md
```

### Architecture Pattern

This project follows a **layered architecture**:
- **Presentation Layer:** GraphQL resolvers handle API requests
- **Service Layer:** UserService manages business logic and data access
- **Data Layer:** MongoDB connection singleton manages database connections

### Key Design Patterns
- **Singleton Pattern:** Database connection management
- **DAO Pattern:** UserService acts as Data Access Object
- **Service Layer Pattern:** Clear separation between GraphQL and database logic

## Database

The application uses MongoDB for persistent data storage. The database is automatically initialized when the server starts, including index creation for optimal performance.

### Collections

#### `users` Collection

**Document Structure:**
```javascript
{
  _id: ObjectId,           // MongoDB primary key (exposed as 'id' in GraphQL)
  name: String,            // User's full name (required)
  email: String,           // User's email (required, unique)
  age: Number,             // User's age (optional)
  createdAt: Date          // Timestamp of creation (auto-generated)
}
```

**Indexes:**
1. `{ email: 1 }` - Unique ascending index for email uniqueness validation
2. `{ createdAt: -1 }` - Descending index for efficient chronological queries

**Index Benefits:**
- Email uniqueness is enforced at the database level
- Fast lookups by email
- Efficient sorting and filtering by creation date

## Development

### Watch Mode
To automatically recompile TypeScript on file changes:
```bash
npm run watch
```

## Available Scripts

- `npm run dev` - Start development server with tsx
- `npm run dev:watch` - Start development server with auto-reload on file changes
- `npm run build` - Compile TypeScript to JavaScript in `dist/` directory
- `npm start` - Run compiled production server from `dist/`
- `npm run watch` - Watch TypeScript files and recompile on changes

## Technologies Used

### Core Technologies
- **Node.js** (v16+) - JavaScript runtime environment
- **TypeScript** (5.3.3) - Typed superset of JavaScript
- **Apollo Server** (4.10.0) - GraphQL server implementation
- **Express** (4.18.2) - Minimal web framework for Node.js
- **GraphQL** (16.8.1) - Query language for APIs
- **MongoDB** (6.20.0) - NoSQL document database

### Development Tools
- **tsx** (4.20.6) - TypeScript execution and development tool
- **dotenv** - Environment variable management
- **Bruno** - API testing and documentation

### Middleware & Utilities
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Request body parsing middleware

## Testing

This project includes a comprehensive API testing suite using [Bruno](https://www.usebruno.com/), an open-source API client.

### Bruno Collection

The `bruno/` directory contains pre-configured API tests for all operations:
- **Get Users** - Query all users
- **Get Single User** - Query user by ID
- **Create User** - Create new user with validation
- **Update Single User** - Update existing user
- **Delete Single User** - Delete user by ID

To use the Bruno collection:
1. Install Bruno from [usebruno.com](https://www.usebruno.com/)
2. Open Bruno and load the collection from the `bruno/` directory
3. Ensure the server is running on `http://localhost:3000`
4. Execute requests directly from Bruno

## Error Handling

The API implements comprehensive error handling:
- **Invalid ObjectId:** Returns `null` for queries, `false` for deletions
- **Duplicate Email:** MongoDB throws error due to unique index
- **Missing Required Fields:** GraphQL validation prevents invalid requests
- **Connection Errors:** Server logs errors and implements graceful shutdown

## Known Limitations

- No authentication or authorization implemented
- No input validation beyond TypeScript types
- No pagination for the `users` query (returns all records)
- No DataLoader implementation (potential N+1 query issues in complex schemas)
- No GraphQL subscriptions support

## Additional Documentation

- **[AGENTS.md](./AGENTS.md)** - Comprehensive AI agent context and architectural documentation

## Author

[Nic Raboy](https://nraboy.com)

## License

ISC

