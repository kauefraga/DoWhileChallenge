import { User } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

class LoginController {
  static async handler(
    request: Request,
    response: Response,
  ) {
    const { email, password }: User = request.body;

    if (!(email && password)) {
      response.status(400).json({ error: 'Please enter a email and password.' });
    }

    const user: User | any = await prisma.user.findUnique({ where: { email } });

    const validatePassword = await bcrypt.compare(password, user.password);

    if (user && validatePassword) {
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        { expiresIn: 60 * 60 * 12 }, // 12 hours
      );

      user.token = token;

      response.status(200).json(user);
    }

    response.status(400).json({ error: 'Invalid Credentials' });
  }
}

export default LoginController;
