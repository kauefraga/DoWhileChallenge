import express from 'express'
import { PrismaClient } from '@prisma/client'
import routes from './routes'

const app = express()

const prisma = new PrismaClient()

app.use(routes)

app.listen(3333, () => {
  console.log('[server] Running on http://localhost:3333')
})
