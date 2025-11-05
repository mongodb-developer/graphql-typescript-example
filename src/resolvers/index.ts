import { UserService } from '../database/userService';
import { User, CreateUserInput, UpdateUserInput } from '../types';

export const resolvers = {
  Query: {
    // Get all users
    users: async (): Promise<User[]> => {
      const userService = new UserService();
      return await userService.getAllUsers();
    },

    // Get a single user by ID
    user: async (_: unknown, { id }: { id: string }): Promise<User | null> => {
      const userService = new UserService();
      return await userService.getUserById(id);
    },
  },

  Mutation: {
    // Create a new user
    createUser: async (
      _: unknown,
      { name, email, age }: CreateUserInput
    ): Promise<User> => {
      const userService = new UserService();
      return await userService.createUser({ name, email, age });
    },

    // Update an existing user
    updateUser: async (
      _: unknown,
      { id, name, email, age }: UpdateUserInput
    ): Promise<User | null> => {
      const userService = new UserService();
      return await userService.updateUser({ id, name, email, age });
    },

    // Delete a user
    deleteUser: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
      const userService = new UserService();
      return await userService.deleteUser(id);
    },
  },
};
