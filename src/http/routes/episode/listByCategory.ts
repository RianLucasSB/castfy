import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { Category } from '@prisma/client'

export async function handleListByCategory(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsBody = z.object({
    categories: z.array(z.nativeEnum(Category)),
  })

  const { categories } = paramsBody.parse(req.query)

  const episodes = await prisma.episode.findMany({
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
    where: {
      categories: {
        hasSome: categories,
      },
    },
  })

  return res.send(episodes)
}
