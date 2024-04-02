import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = fastify()

server.register(multipart, {
  limits: {
    fileSize: 1024000000,
  },
})

server.register(authHandler, { prefix: '/auth' })

server.register(fileHandler, { prefix: '/file' })

server.listen({ port }).then((port) => {
  console.log(`Running at: ${port}`)
})
