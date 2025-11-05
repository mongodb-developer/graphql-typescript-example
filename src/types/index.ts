export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  age?: number;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  age?: number;
}
