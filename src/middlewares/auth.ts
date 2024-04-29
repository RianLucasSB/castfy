import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import jwt from 'jsonwebtoken'
import { ServerError } from '../presentation/errors/server-error'

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

  const userId = jwt.verify(token, process.env.JWT_PASS ?? '')
  if (!userId) return new ServerError()
  req.headers.userId = userId as string

  done()
}
