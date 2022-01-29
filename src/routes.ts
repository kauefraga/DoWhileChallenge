import 'dotenv/config'
import { Router } from 'express'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const routes = Router()

const prisma = new PrismaClient()

routes.get('/', (req, res) => { res.json({ message: 'Hello world!' }) })

routes.post('/register', async (request, response) => {
  const { name, email, password }: User = request.body

  if (!(name && email && password)) {
    return response.status(400).json({
      message: 'Please enter a name, email and password.'
    })
  }

  const isUserAlreadyRegistered = await prisma.user.findUnique({
    where: { email }
  })

  if (isUserAlreadyRegistered) {
    return response.status(409).json('User Already Exist. Please Login.')
  }

  const encryptedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword
    }
  })

  const token = jwt.sign(
    { user_id: user.id, email },
    process.env.TOKEN_KEY,
    { expiresIn: "2h" }
  )

  user.token = token

  return response.status(201).json({
    message: 'User successfully created',
    user
  })
})

export default routes
