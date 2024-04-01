import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { badRequest } from '../../../presentation/helpers/http-helpers'
import { MissingParamError } from '../../../presentation/errors/missing-param-error'
import console from 'node:console'

export async function handleDownloadFile(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    fileId: z.string(),
  })

  const { fileId } = paramsObj.parse(req.params)

  if (!fileId) {
    return badRequest(new MissingParamError('fileId'))
  }

  // todo Get from database

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID as string,
      secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: process.env.REGION as string,
  })

  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Key: 'HpT-399_nextjs.mp3',
    }),
  )

  console.log('aoooo')

  return res.send(Body?.transformToWebStream())
}
