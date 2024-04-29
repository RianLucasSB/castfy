import { FastifyReply, FastifyRequest } from 'fastify'
import { s3Client } from '../../../lib/s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Stream, pipeline } from 'stream'
import { promisify } from 'util'
const pipelineAsync = promisify(pipeline)

export async function handleUploadFile(req: FastifyRequest, res: FastifyReply) {
  const data = await req.file()

  const pass = new Stream.PassThrough()

  const uploadToS3 = new Upload({
    client: s3Client,
    leavePartsOnError: false,
    params: {
      Bucket: process.env.AWS_BUCKET,
      Key: data?.filename,
      Body: pass,
      ContentType: 'audio/mp3',
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
  })

  uploadToS3.on('httpUploadProgress', (progress) => {
    console.log('progress', progress)
  })

  pipelineAsync(data!.file, pass)

  res.status(201).send('upload successfull')
}
