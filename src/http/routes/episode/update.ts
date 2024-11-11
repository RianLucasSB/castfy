import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import {
  badRequest,
  forbidden,
} from '../../../presentation/helpers/http-helpers'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'
import { ForbiddenError } from '../../../presentation/errors/forbidden'
import { Category } from '@prisma/client'

export async function handleUpdateEpisode(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    episodeId: z.string(),
  })

  const episodeBody = z.object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.nativeEnum(Category)),
  })

  const editedEpisode = episodeBody.parse(req.body)

  const { episodeId } = paramsObj.parse(req.params)

  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      podcast: { select: { userId: true } },
    },
  })

  if (!episode)
    return badRequest(new InvalidParamError('episode id' + episodeId))

  const userId = req.headers.userId as string

  if (episode?.podcast.userId !== userId) {
    return forbidden(new ForbiddenError(`Cant edit another user podcast!`))
  }

  const updatedEpisode = await prisma.episode.update({
    where: { id: episodeId },
    data: {
      title: editedEpisode.title,
      categories: editedEpisode.categories,
      description: editedEpisode.description,
    },
    include: {
      image: true,
      audioFile: true,
    },
  })

  return res.status(201).send({
    title: updatedEpisode?.title,
    description: updatedEpisode?.description,
    imageUrl: updatedEpisode.image?.url,
    categories: episode.categories,
  })
}
