import fastify from 'fastify'
import { authMiddleware } from '../middlewares/auth'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = fastify()

server.register(authHandler, { prefix: '/auth' })

server.addHook('preHandler', authMiddleware)

server.register(fileHandler, { prefix: '/file' })

server.listen({ port }).then((port) => {
  console.log(`Running at: ${port}`)
})
