import fastify from 'fastify'
import { authMiddleware } from '../middlewares/auth'
import { auth } from './routes/auth'

const server = fastify()

server.register(auth, { prefix: '/auth' })

server.addHook('preHandler', authMiddleware)

server.listen({ port: 3333 }).then((port) => {
  console.log(`Running at: ${port}`)
})
