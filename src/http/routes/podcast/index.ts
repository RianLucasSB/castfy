import { FastifyInstance } from 'fastify'
import { createPodcastHandler } from './create'

export async function podcastHandler(app: FastifyInstance) {
  app.post('/', createPodcastHandler)
}
