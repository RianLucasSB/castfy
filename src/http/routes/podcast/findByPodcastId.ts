import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function findPodcastById(req: FastifyRequest, res: FastifyReply) {
  const paramsObj = z.object({
    podcastId: z.string(),
  })

  const { podcastId } = paramsObj.parse(req.params)

  const podcast = await prisma.podcast.findUnique({
    where: {
      id: podcastId,
    },
    include: {
      episodes: true,
    },
  })

  if (!podcast) {
    res.status(404).send('Podcast not found')
  }

  res.status(201).send(podcast)
}
