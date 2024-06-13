import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function handleListUserHome(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userId = req.headers.userId as string

  const userFavorites = await prisma.favoritesEpisodesOnUsers.findMany({
    where: {
      userId,
    },
    select: {
      episode: true,
    },
  })

  const lastEpisodes = await prisma.episode.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  })

  return res.send({
    lastEpisodes,
    favorites: userFavorites.map((e) => {
      return e.episode
    }),
  })
}
