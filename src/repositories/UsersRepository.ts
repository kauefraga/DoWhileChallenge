/* eslint-disable no-unused-vars */
export interface CreateUserData {
  name?: string;
  email: string;
  password: string;
}

export interface UsersRepository {
  create(data: CreateUserData): Promise<void>
}
