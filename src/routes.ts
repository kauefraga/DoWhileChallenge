import { Router } from 'express'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import auth from './middleware/auth'

const routes = Router()

const prisma = new PrismaClient()


routes.get('/', (req, res) => { res.json('Hello world!') })

routes.post('/register', async (request, response) => {
  const { name, email, password }: User = request.body

  if (!(name && email && password)) {
    return response.status(400).json({
      error: 'Please enter a name, email and password.'
    })
  }

  const isUserAlreadyRegistered = await prisma.user.findUnique({
    where: { email }
  })

  if (isUserAlreadyRegistered) {
    return response.status(409).json({
      error: 'User Already Exist. Please Login.'
    })
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
    { expiresIn: 60 * 60 * 12 } // 12 hours
  )

  user.token = token

  return response.status(201).json(user)
})

routes.post('/login', async (request, response) => {
  const { email, password }: User = request.body

  if (!(email && password)) {
    response.status(400).json({ error: 'Please enter a email and password.' })
  }

  const user: User | any = await prisma.user.findUnique({ where: { email } })

  const validatePassword = await bcrypt.compare(password, user.password)

  if (user && validatePassword) {
    const token = jwt.sign(
      { user_id: user.id, email },
      process.env.TOKEN_KEY,
      { expiresIn: 60 * 60 * 12 } // 12 hours
    )

    user.token = token

    response.status(200).json(user)
  }

  response.status(400).json({ error: 'Invalid Credentials' })
})

routes.get('/welcome', auth, (request, response) => {
  return response.json({
    message: '🔥 Welcome! Congrats to sign up! 🔥',
    isAuthenticated: true
  })
})

export default routes
