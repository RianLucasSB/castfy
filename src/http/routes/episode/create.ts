import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { s3Client } from '../../../lib/s3'
import { Upload } from '@aws-sdk/lib-storage'

export async function createEpisodeHandler(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const parts = req.parts()

  const episodeBody = z.object({
    fileId: z.string(),
    title: z.string(),
    description: z.string(),
  })

  let imageId = ''

  const body: Record<string, unknown> = {}

  for await (const part of parts) {
    if (part.type === 'file') {
      const file = part
      const uploadImageToS3 = new Upload({
        client: s3Client,
        leavePartsOnError: false,
        params: {
          Bucket: process.env.AWS_BUCKET,
          Key: file?.filename,
          Body: file?.file,
          ContentType: 'image/png',
        },
      })

      const uploadedImage = await uploadImageToS3.done()

      const imageFile = await prisma.image.create({
        data: {
          url: uploadedImage.Location as string,
          key: uploadedImage.Key as string,
          name: file?.filename as string,
        },
      })

      imageId = imageFile.id
    } else {
      body[part.fieldname] = part.value
    }
  }

  const { description, fileId, title } = episodeBody.parse(body)

  const userId = req.headers.userId

  if (!userId) return

  const podcast = await prisma.podcast.findUnique({
    where: { userId: userId as string },
  })

  if (!podcast) return

  const audioFile = await prisma.audioFile.findUnique({
    where: {
      id: fileId,
    },
  })

  if (!audioFile) return

  const createdEpisode = await prisma.episode.create({
    data: {
      description,
      title,
      podcastId: podcast.id,
      audioFileId: audioFile.id,
      imageId,
    },
  })

  res.status(201).send({
    episodeId: createdEpisode.id,
  })
}
