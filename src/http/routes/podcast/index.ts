import { FastifyInstance } from 'fastify'
import { createPodcastHandler } from './create'
import { authMiddleware } from '../../../middlewares/auth'
import { findPodcastByUserId } from './listEpisodesByUserId'
import { findPodcastById } from './findByPodcastId'
import { searchPodcast } from './searchPodcast'
import { handleUpdatePodcast } from './update'

export async function podcastHandler(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', createPodcastHandler)
  app.get('/', findPodcastByUserId)
  app.get('/:podcastId', findPodcastById)
  app.get('/search/:search', searchPodcast)
  app.patch('/:podcastId', handleUpdatePodcast)
}
