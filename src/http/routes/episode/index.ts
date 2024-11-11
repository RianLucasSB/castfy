import { FastifyInstance } from 'fastify'
import { createEpisodeHandler } from './create'
import { authMiddleware } from '../../../middlewares/auth'
import { handleUploadAudio } from './uploadAudio'
import { handleFindOneEpisode } from './findOne'
import { handlePlayAudio } from './play'
import { handleFindAllEpisode } from './findAll'
import { handleListUserHome } from './listUserHome'
import { handleMarkAsFavorite } from './markAsFavorite'
import { handleUnmarkAsFavorite } from './unmarkAsFavorite'
import { handleDeleteEpisode } from './delete'
import { handleUpdateEpisode } from './update'
import { searchEpisode } from './search'

export async function episodeHandler(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', createEpisodeHandler)
  app.post('/audio', handleUploadAudio)
  app.post('/favorite/:episodeId', handleMarkAsFavorite)
  app.delete('/favorite/:episodeId', handleUnmarkAsFavorite)
  app.delete('/:episodeId', handleDeleteEpisode)
  app.get('/', handleFindAllEpisode)
  app.get('/:episodeId', handleFindOneEpisode)
  app.get('/play/:audioFileId', handlePlayAudio)
  app.get('/list', handleListUserHome)

  app.get('/search/:search', searchEpisode)

  app.patch('/:episodeId', handleUpdateEpisode)
}
