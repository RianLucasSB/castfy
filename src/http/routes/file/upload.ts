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
    leavePartsOnError: false, // optional manually handle dropped parts
    params: {
      Bucket: process.env.AWS_BUCKET, // whatever your bucket is in S3
      Key: data?.filename, // file name
      Body: pass, // Body is stream which enables streaming
      ContentType: 'audio/mp3',
    },
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
  })

  uploadToS3.on('httpUploadProgress', (progress) => {
    console.log('progress', progress)
  })

  pipelineAsync(data!.file, pass)

  await uploadToS3.done()

  res.status(201).send('upload successfull')
}
