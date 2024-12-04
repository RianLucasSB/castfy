import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { Category } from '@prisma/client'

export async function searchEpisode(req: FastifyRequest, res: FastifyReply) {
  const queryObj = z.object({
    categories: z
      .union([z.nativeEnum(Category), z.array(z.nativeEnum(Category))])
      .optional(),
    search: z.string().optional(),
  })

  let { categories, search } = queryObj.parse(req.query)

  if (categories && categories.length > 0) {
    if (!(categories instanceof Array)) {
      categories = new Array(categories)
    }
    const episodes = await prisma.episode.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
        categories: {
          hasSome: categories,
        },
      },
      include: {
        image: {
          select: {
            url: true,
          },
        },
      },
    })
    return res.status(201).send(episodes)
  }

  const episodes = await prisma.episode.findMany({
    where: {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
    include: {
      image: {
        select: {
          url: true,
        },
      },
    },
  })

  res.status(201).send(episodes)
}
