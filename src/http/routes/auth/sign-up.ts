import z from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function handleSignUp(req: FastifyRequest, res: FastifyReply) {
  const signUpBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = signUpBody.parse(req.body)

  const hashedPassword = await bcrypt.hash(password, 8)

  const created = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  return res.status(201).send(created)
}
