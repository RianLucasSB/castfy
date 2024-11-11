import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import {
  badRequest,
  forbidden,
} from '../../../presentation/helpers/http-helpers'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { ForbiddenError } from '../../../presentation/errors/forbidden'

export async function handleUpdatePodcast(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    podcastId: z.string(),
  })

  const episodeBody = z.object({
    name: z.string(),
    description: z.string(),
  })

  const editedPodcast = episodeBody.parse(req.body)

  const { podcastId } = paramsObj.parse(req.params)

  const podcast = await prisma.podcast.findUnique({
    where: { id: podcastId },
  })

  if (!podcast)
    return badRequest(new InvalidParamError('Podcast id' + podcastId))

  const userId = req.headers.userId as string

  if (podcast?.userId !== userId) {
    return forbidden(new ForbiddenError(`Cant edit another user podcast!`))
  }

  const updatedPodcast = await prisma.podcast.update({
    where: { id: podcastId },
    data: {
      name: editedPodcast.name,
      description: editedPodcast.description,
    },
    include: {
      image: true,
    },
  })

  return res.status(201).send({
    name: updatedPodcast?.name,
    description: updatedPodcast?.description,
    imageUrl: updatedPodcast.image?.url,
  })
}
