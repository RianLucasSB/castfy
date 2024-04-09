import fastify from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080

const server = fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
})

server.register(multipart, {
  limits: {
    fileSize: 1024000000,
  },
})

server.register(authHandler, { prefix: '/auth' })

server.register(fileHandler, { prefix: '/file' })

server.listen({ port, host: '0.0.0.0' }).then((port) => {
  console.log(`Running at: ${port}`)
})
