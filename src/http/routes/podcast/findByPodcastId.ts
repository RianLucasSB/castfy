import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { notFound } from '../../../presentation/helpers/http-helpers'
import { BadRequestError } from '../../../presentation/errors/bad-request-error'

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
    return res
      .status(404)
      .send(notFound(new BadRequestError(`Podcast não encontrado`)))
  }

  const podcastImage = await prisma.image.findUnique({
    where: { id: podcast.imageId },
  })

  const episodes = await Promise.all(
    podcast.episodes.map(async (episode) => {
      const image = await prisma.image.findUnique({
        where: { id: episode.imageId },
      })

      return {
        imageUrl: image?.url,
        ...episode,
      }
    }),
  )

  res.status(201).send({
    id: podcast.id,
    description: podcast.description,
    createdAt: podcast.createdAt,
    ownerId: podcast.userId,
    imageUrl: podcastImage?.url,
    name: podcast.name,
    episodes,
  })
}
