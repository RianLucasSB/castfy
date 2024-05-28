import z from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'
import { Gender } from '@prisma/client'
import jwt from 'jsonwebtoken'

export async function handleSignUp(req: FastifyRequest, res: FastifyReply) {
  const signUpBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    birthDate: z.coerce.date().refine((data) => data < new Date(), {
      message: 'Start date must be in the past',
    }),
    gender: z.nativeEnum(Gender),
  })

  const { name, email, password, gender, birthDate } = signUpBody.parse(
    req.body,
  )

  const hashedPassword = await bcrypt.hash(password, 8)

  const created = await prisma.user.create({
    data: {
      email,
      name,
      gender,
      birthDate,
      password: hashedPassword,
    },
  })

  const token = jwt.sign(created.id, process.env.JWT_PASS ?? '')

  return res.status(201).send({
    id: created.id,
    token,
  })
}
