import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'

export async function handleFindUserFavoriteEpisodes(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const userId = req.headers.userId as string

  const userFavorites = await prisma.favoritesEpisodesOnUsers.findMany({
    where: {
      userId,
    },
    include: {
      episode: true,
    },
  })

  return res.send(userFavorites)
}
