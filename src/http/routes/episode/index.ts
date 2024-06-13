import { FastifyInstance } from 'fastify'
import { createEpisodeHandler } from './create'
import { authMiddleware } from '../../../middlewares/auth'
import { handleUploadAudio } from './uploadAudio'
import { handleFindOneEpisode } from './findOne'
import { handlePlayAudio } from './play'
import { handleFindAllEpisode } from './findAll'
import { handleListUserHome } from './listUserHome'
import { handleMarkAsFavorite } from './markAsFavorite'

export async function episodeHandler(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', createEpisodeHandler)
  app.post('/audio', handleUploadAudio)
  app.post('/favorite/:episodeId', handleMarkAsFavorite)

  app.get('/', handleFindAllEpisode)
  app.get('/:episodeId', handleFindOneEpisode)
  app.get('/play/:audioFileId', handlePlayAudio)
  app.get('/list', handleListUserHome)
}
