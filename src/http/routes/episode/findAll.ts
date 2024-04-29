import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function handleFindAllEpisode(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const episodes = await prisma.episode.findMany({
    select: {
      id: true,
      description: true,
      title: true,
      podcast: {
        select: {
          description: true,
          id: true,
          image: {
            select: {
              url: true,
            },
          },
        },
      },
      image: {
        select: {
          url: true,
        },
      },
    },
  })

  return res.send(episodes)
}
