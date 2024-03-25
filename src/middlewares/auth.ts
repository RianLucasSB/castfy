import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import jwt from 'jsonwebtoken'

type JwtPayload = {
  userId: string
}

export const authMiddleware = (
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction,
) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new Error('Não autorizado')
  }

  const token = authorization.split(' ')[1]

  const { userId } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

  req.headers.userId = userId

  done()
}
