import { FastifyInstance } from 'fastify'
import { createEpisodeHandler } from './create'

export async function episodeHandler(app: FastifyInstance) {
  app.post('/', createEpisodeHandler)
}
