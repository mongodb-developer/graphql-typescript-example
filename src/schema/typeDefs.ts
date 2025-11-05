export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    updateUser(id: ID!, name: String, email: String, age: Int): User
    deleteUser(id: ID!): Boolean!
  }
`;
