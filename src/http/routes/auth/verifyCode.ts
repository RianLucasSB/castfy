import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function handleVerifyCode(req: FastifyRequest, res: FastifyReply) {
  const forgotPasswordBody = z.object({
    userId: z.string(),
    code: z.string().length(6),
  })

  const { code, userId } = forgotPasswordBody.parse(req.params)

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const resetAccountToken = await prisma.verifyCode.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!resetAccountToken?.expires) {
    throw new Error('Invalid code')
  }

  const hasExpired = new Date().getTime() > resetAccountToken?.expires

  if (hasExpired) {
    throw new Error('Code expired')
  }

  const matchCode = await bcrypt.compare(code, resetAccountToken.code)

  if (!matchCode) {
    throw new Error('Invalid credentials')
  }
  const token = jwt.sign(userId, process.env.JWT_PASS ?? '')

  res.status(201).send({
    token,
  })
}
