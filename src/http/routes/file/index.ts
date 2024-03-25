import { FastifyInstance } from 'fastify'
import { handleDownloadFile } from './download'

export async function fileHandler(app: FastifyInstance) {
  app.post('/', async () => {})
  app.get('/:fileId', handleDownloadFile)
}
