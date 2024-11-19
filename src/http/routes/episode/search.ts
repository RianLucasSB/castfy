import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { Category } from '@prisma/client'

export async function searchEpisode(req: FastifyRequest, res: FastifyReply) {
  const paramsObj = z.object({
    search: z.string(),
  })

  const queryObj = z.object({
    categories: z.array(z.nativeEnum(Category)).or(z.nativeEnum(Category)),
  })

  let { categories } = queryObj.parse(req.query)

  const { search } = paramsObj.parse(req.params)

  if (categories && categories.length > 0) {
    if (!(categories instanceof Array)) {
      categories = new Array(categories)
    }
    const podcasts = await prisma.episode.findMany({
      where: {
        title: {
          contains: search,
          mode: 'insensitive',
        },
        categories: {
          hasSome: categories,
        },
      },
    })
    return res.status(201).send(podcasts)
  }

  const podcasts = await prisma.episode.findMany({
    where: {
      title: {
        contains: search,
        mode: 'insensitive',
      },
    },
  })

  res.status(201).send(podcasts)
}
