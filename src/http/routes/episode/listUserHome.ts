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
      episode: {
        select: {
          id: true,
          description: true,
          title: true,
          categories: true,
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
      },
    },
  })

  const lastEpisodes = await prisma.episode.findMany({
    select: {
      id: true,
      description: true,
      title: true,
      categories: true,
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
