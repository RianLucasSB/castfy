import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { s3Client } from '../../../lib/s3'
import { Upload } from '@aws-sdk/lib-storage'

export async function createPodcastHandler(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const parts = req.parts()

  const podcastBody = z.object({
    name: z.string(),
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

  const { description, name } = podcastBody.parse(body)

  const userId = req.headers.userId

  if (!userId) return

  const createdPodcast = await prisma.podcast.create({
    data: {
      description,
      name,
      userId: userId as string,
      imageId,
    },
  })

  res.status(201).send({
    podcastId: createdPodcast.id,
  })
}
