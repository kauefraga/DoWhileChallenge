import prisma from '../../prisma';
import { CreateUserData, UsersRepository } from '../UsersRepository';

class PrismaUsersRepository implements UsersRepository {
  // eslint-disable-next-line class-methods-use-this
  async create(data: CreateUserData) {
    await prisma.user.create({
      data,
    });
  }
}

export default PrismaUsersRepository;
