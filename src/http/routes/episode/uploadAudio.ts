import { FastifyReply, FastifyRequest } from 'fastify'
import { s3Client } from '../../../lib/s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Stream, pipeline } from 'stream'
import { promisify } from 'util'
import { BadRequestError } from '../../../presentation/errors/bad-request-error'
import { prisma } from '../../../lib/prisma'
const pipelineAsync = promisify(pipeline)

export async function handleUploadAudio(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const upload = await req.file()

  const pass = new Stream.PassThrough()

  if (!upload) {
    return new BadRequestError('Missing audio file')
  }

  const { file, filename } = upload

  const uploadToS3 = new Upload({
    client: s3Client,
    leavePartsOnError: false,
    params: {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      Body: pass,
      ContentType: 'audio/mp3',
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
  })

  uploadToS3.on('httpUploadProgress', (progress) => {
    console.log('progress', progress)
  })

  pipelineAsync(file, pass)

  const uploadedFile = await uploadToS3.done()

  const createdFile = await prisma.audioFile.create({
    data: {
      key: uploadedFile.Key!,
      name: filename,
      url: uploadedFile.Location!,
    },
  })

  res.status(201).send(createdFile)
}
