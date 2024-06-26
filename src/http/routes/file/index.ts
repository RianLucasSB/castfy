import { FastifyInstance } from 'fastify'
import { handleDownloadFile } from './download'
import { handleUploadFile } from './upload'

export async function fileHandler(app: FastifyInstance) {
  // app.addHook('preHandler', authMiddleware)

  app.post('/upload', handleUploadFile)
  app.get('/:fileId', handleDownloadFile)
}
