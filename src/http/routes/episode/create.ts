import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function createEpisodeHandler(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const episodeBody = z.object({
    fileId: z.string(),
    title: z.string(),
    description: z.string(),
  })

  const { description, fileId, title } = episodeBody.parse(req.body)

  const userId = req.headers.userId

  if (!userId) return

  const podcast = await prisma.podcast.findUnique({
    where: { userId: userId as string },
  })

  if (!podcast) return

  const createdEpisode = await prisma.episode.create({
    data: {
      description,
      title,
      podcastId: podcast?.id,
      fileId,
    },
  })

  res.status(201).send({
    episodeId: createdEpisode.id,
  })
}
