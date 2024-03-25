import fastify from 'fastify'
import { authMiddleware } from '../middlewares/auth'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'

const server = fastify()

server.register(authHandler, { prefix: '/auth' })

server.addHook('preHandler', authMiddleware)

server.register(fileHandler, { prefix: '/file' })

server.listen({ port: 3333 }).then((port) => {
  console.log(`Running at: ${port}`)
})
