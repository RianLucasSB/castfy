import { FastifyInstance } from 'fastify'
import { handleDownloadFile } from './download'
import { authMiddleware } from '../../../middlewares/auth'

export async function fileHandler(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware)

  app.post('/', async () => {})
  app.get('/:fileId', handleDownloadFile)
}
