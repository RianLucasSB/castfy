import { FastifyReply, FastifyRequest } from 'fastify'
import { s3Client } from '../../../lib/s3'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { badRequest } from '../../../presentation/helpers/http-helpers'
import { MissingParamError } from '../../../presentation/errors/missing-param-error'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function handlePlayAudio(req: FastifyRequest, res: FastifyReply) {
  const paramsObj = z.object({
    audioFileId: z.string(),
  })

  const { audioFileId } = paramsObj.parse(req.params)

  if (!audioFileId) {
    return badRequest(new MissingParamError('audioFileId'))
  }

  const audioFile = await prisma.audioFile.findUnique({
    where: { id: audioFileId },
  })

  const { Body: audioStream } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Key: audioFile?.key,
    }),
  )
  return res.send(audioStream?.transformToWebStream())
}
