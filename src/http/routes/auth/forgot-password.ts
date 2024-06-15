import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma'
import { transporter } from '../../../lib/nodemailer'
import moment from 'moment'

export async function handleForgotPassword(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const forgotPasswordBody = z.object({
    email: z.string().email(),
  })

  const { email } = forgotPasswordBody.parse(req.body)

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const code = Math.round(Math.random() * (999999 - 100000) + 100000).toString()
  const expires = moment(new Date()).add('5', 'minutes').toDate().getTime()

  const hashedCode = await bcrypt.hash(code, 8)

  const userVerifyCode = await prisma.verifyCode.findUnique({
    where: { userId: user.id },
  })

  if (!userVerifyCode) {
    await prisma.verifyCode.create({
      data: {
        code: hashedCode,
        expires,
        userId: user.id,
      },
    })

    transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: 'rianlucas2014@gmail.com',
      // to: user.email,
      subject: 'Forgot password',
      text: `Codigo para recuperar senha: ${code}`,
    })

    return res.status(201).send({
      email: user.email,
    })
  }

  await prisma.verifyCode.update({
    where: { userId: user.id },
    data: {
      code: hashedCode,
      expires,
    },
  })

  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: user.email,
    subject: 'Forgot password',
    text: `Codigo para recuperar senha: ${code}`,
  })

  return res.status(201).send({
    id: user.id,
    email: user.email,
  })
}
