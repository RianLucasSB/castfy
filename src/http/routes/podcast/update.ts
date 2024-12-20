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
  const episodeBody = z.object({
    name: z.string(),
    description: z.string(),
  })

  const editedPodcast = episodeBody.parse(req.body)

  const userId = req.headers.userId as string

  const podcast = await prisma.podcast.findUnique({
    where: { userId },
  })

  if (!podcast)
    return badRequest(
      new InvalidParamError('User with id' + userId + ' has no podcast'),
    )

  if (podcast?.userId !== userId) {
    return forbidden(new ForbiddenError(`Cant edit another user podcast!`))
  }

  const updatedPodcast = await prisma.podcast.update({
    where: { id: podcast.id },
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
