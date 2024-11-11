import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import {
  badRequest,
  forbidden,
} from '../../../presentation/helpers/http-helpers'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { s3Client } from '../../../lib/s3'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { ForbiddenError } from '../../../presentation/errors/forbidden'

export async function handleDeleteEpisode(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    episodeId: z.string(),
  })

  const { episodeId } = paramsObj.parse(req.params)

  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      audioFile: { select: { key: true } },
      image: { select: { key: true } },
      podcast: { select: { userId: true } },
    },
  })

  const userId = req.headers.userId as string

  if (episode?.podcast.userId !== userId) {
    return forbidden(new ForbiddenError(`Cant delete another user podcast!`))
  }

  if (!episode)
    return badRequest(new InvalidParamError('episode id' + episodeId))

  await s3Client.send(
    new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET as string,
      Delete: {
        Objects: [{ Key: episode.image?.key }, { Key: episode.audioFile?.key }],
      },
    }),
  )

  await Promise.all([
    await prisma.episode.delete({
      where: {
        id: episode.id,
      },
    }),
    await prisma.image.delete({
      where: {
        id: episode?.imageId,
      },
    }),
    await prisma.audioFile.delete({
      where: {
        id: episode?.audioFileId,
      },
    }),
  ])

  return res.status(204).send()
}
