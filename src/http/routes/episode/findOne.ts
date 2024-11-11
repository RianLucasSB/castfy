import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'
import { badRequest } from '../../../presentation/helpers/http-helpers'
import { InvalidParamError } from '../../../presentation/errors/invalid-param-error'

export async function handleFindOneEpisode(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsObj = z.object({
    episodeId: z.string(),
  })

  const { episodeId } = paramsObj.parse(req.params)

  const episode = await prisma.episode.findUnique({ where: { id: episodeId } })

  if (!episode)
    return badRequest(new InvalidParamError('episode id' + episodeId))

  const imageFile = await prisma.image.findUnique({
    where: { id: episode?.imageId },
  })

  const audioFile = await prisma.audioFile.findUnique({
    where: { id: episode?.audioFileId },
  })

  const podcast = await prisma.podcast.findUnique({
    where: { id: episode?.podcastId },
  })

  const podcastImage = await prisma.image.findUnique({
    where: { id: podcast?.imageId },
  })

  return res.send({
    title: episode?.title,
    description: episode?.description,
    audioUrl: audioFile?.url,
    imageUrl: imageFile?.url,
    categories: episode.categories,
    podcast: {
      name: podcast?.name,
      imageUrl: podcastImage?.url,
      description: podcast?.description,
    },
  })
}
