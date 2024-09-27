import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function findPodcastByUserId(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userId = req.headers.userId as string
  if (!userId) return

  const podcast = await prisma.podcast.findUnique({
    where: {
      userId,
    },
    include: {
      episodes: true,
    },
  })

  res.status(201).send(podcast)
}
