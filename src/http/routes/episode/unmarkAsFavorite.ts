import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { BadRequestError } from '../../../presentation/errors/bad-request-error'
import { prisma } from '../../../lib/prisma'

export async function handleUnmarkAsFavorite(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    episodeId: z.string(),
  })

  const { episodeId } = paramsObj.parse(req.params)

  if (!episodeId) {
    throw new BadRequestError('Id do episódio inválido')
  }

  const episode = await prisma.episode.findUnique({ where: { id: episodeId } })

  if (!episode) {
    throw new BadRequestError(`Episódio não encontrado com id ${episodeId}`)
  }

  const userId = req.headers.userId as string

  await prisma.favoritesEpisodesOnUsers.delete({
    where: {
      userId_episodeId: {
        episodeId,
        userId,
      },
    },
  })

  return res.status(204).send()
}
