import { User } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import prisma from '../prisma';
import CreateUser from '../services/CreateUser';
import PrismaUsersRepository from '../repositories/prisma/PrismaUsersRepository';

class RegisterController {
  static async handler(
    request: Request,
    response: Response,
  ) {
    const { name, email, password }: User = request.body;

    const prismaUsersRepository = new PrismaUsersRepository();
    const createUser = new CreateUser(prismaUsersRepository);

    if (!(name && email && password)) {
      return response.status(400).json({
        error: 'Please enter a name, email and password.',
      });
    }

    const isUserAlreadyRegistered = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserAlreadyRegistered) {
      return response.status(409).json({
        error: 'User Already Exist. Please Login.',
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user: User | any = await createUser.execute({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    user.id = randomUUID();

    user.token = jwt.sign(
      { user_id: user.id, email },
      process.env.TOKEN_KEY,
      { expiresIn: 60 * 60 * 12 }, // 12 hours
    );

    return response.status(201).json(user);
  }
}

export default RegisterController;
