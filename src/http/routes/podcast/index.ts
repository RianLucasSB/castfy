import { FastifyInstance } from 'fastify'
import { createPodcastHandler } from './create'
import { authMiddleware } from '../../../middlewares/auth'

export async function podcastHandler(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', createPodcastHandler)
}
