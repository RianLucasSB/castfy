import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { badRequest } from '../../../presentation/helpers/http-helpers'
import { MissingParamError } from '../../../presentation/errors/missing-param-error'
import { s3Client } from '../../../lib/s3'

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

  const { Body } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Key: 'SÉRGIO SACANI + PHOENIX - Flow #345.mp3',
    }),
  )

  return res.send(Body?.transformToWebStream())
}
