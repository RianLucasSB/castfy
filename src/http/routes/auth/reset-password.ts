import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function handleResetPassword(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const resetPasswordBody = z.object({
    password: z.string(),
  })

  const { password } = resetPasswordBody.parse(req.body)

  const userId = req.headers.userId

  const hashedPassword = await bcrypt.hash(password, 8)
  const created = await prisma.user.update({
    where: { id: userId as string },
    data: {
      password: hashedPassword,
    },
  })

  const token = jwt.sign({ userId: created.id }, process.env.JWT_PASS ?? '', {
    expiresIn: '7d',
  })

  return res.status(201).send({
    id: created.id,
    token,
  })
}
