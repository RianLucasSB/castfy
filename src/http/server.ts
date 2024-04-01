import fastify from 'fastify'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = fastify()

server.register(authHandler, { prefix: '/auth' })

server.register(fileHandler, { prefix: '/file' })

server.listen({ port, host: '0.0.0.0' }).then((port) => {
  console.log(`Running at: ${port}`)
})
