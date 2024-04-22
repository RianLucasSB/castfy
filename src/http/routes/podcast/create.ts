import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export async function createPodcastHandler(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const podcastBody = z.object({
    name: z.string(),
    description: z.string(),
  })

  const { description, name } = podcastBody.parse(req.body)

  const userId = req.headers.userId

  if (!userId) return

  const createdPodcast = await prisma.podcast.create({
    data: {
      description,
      name,
      userId: userId as string,
    },
  })

  res.status(201).send({
    podcastId: createdPodcast.id,
  })
}
