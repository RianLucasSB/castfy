import fastify from 'fastify'
import multipart from '@fastify/multipart'
import cors from '@fastify/cors'
import { authHandler } from './routes/auth'
import { fileHandler } from './routes/file'
import { episodeHandler } from './routes/episode'
import { podcastHandler } from './routes/podcast'
require('dotenv').config()

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080
const host = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0'

const server = fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
})

server.register(multipart, {
  limits: {
    fileSize: 1024000000,
  },
})

server.register(authHandler, { prefix: '/auth' })

server.register(fileHandler, { prefix: '/file' })

server.register(episodeHandler, { prefix: '/episode' })

server.register(podcastHandler, { prefix: '/podcast' })

server.listen({ port, host }).then((port) => {
  console.log(`Running at: ${port}`)
})
