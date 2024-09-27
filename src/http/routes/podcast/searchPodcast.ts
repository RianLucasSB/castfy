import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

export async function searchPodcast(req: FastifyRequest, res: FastifyReply) {
  const paramsObj = z.object({
    search: z.string(),
  })

  const { search } = paramsObj.parse(req.params)

  const podcasts = await prisma.podcast.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  })

  res.status(201).send(podcasts)
}
