import { UsersRepository } from '../repositories/UsersRepository';

interface CreateUserRequest {
  name?: string,
  email: string,
  password: string
}

class CreateUser {
  private usersRepository: UsersRepository;

  constructor(
    usersRepository: UsersRepository,
  ) {
    this.usersRepository = usersRepository;
  }

  async execute({ name, email, password }: CreateUserRequest) {
    await this.usersRepository.create({
      name,
      email,
      password,
    });
  }
}

export default CreateUser;
