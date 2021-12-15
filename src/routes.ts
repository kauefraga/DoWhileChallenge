import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const routes = Router()

const prisma = new PrismaClient()

routes.get('/', (req, res) => { res.json({ message: "Hello world!" }) })

routes.get('/getNewsletter', async ({ params }, response) => {
  const allPosts = await prisma.post.findMany({})
  // use `console.dir` to print nested objects
  console.dir(allPosts, { depth: null })
})

routes.post('/saveNewsletter', async (request, response) => {
  const { subject, body } = request.body

  if (subject && body) return response.status(400)

  const newPost = await prisma.post.create({
    data: { subject, body }
  })

  return response.status(200).json({
    message: 'Now, you can find your post searching by id/subject',
    id: newPost.id,
    subject
  })
})

export default routes
