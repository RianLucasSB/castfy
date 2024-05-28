import { FastifyInstance } from 'fastify'
import { handleSignUp } from './sign-up'
import { handleSignIn } from './sign-in'
import { handleForgotPassword } from './forgot-password'
import { handleResetPassword } from './reset-password'
import { handleVerifyCode } from './verifyCode'
import { authMiddleware } from '../../../middlewares/auth'

export async function authHandler(app: FastifyInstance) {
  app.post('/sign-up', handleSignUp)
  app.post('/sign-in', handleSignIn)
  app.post('/forgot-password', handleForgotPassword)
  app.post('/verify-code/:userId/:code', handleVerifyCode)
  app.route({
    handler: handleResetPassword,
    method: 'POST',
    url: '/reset-password',
    preHandler: authMiddleware,
  })
}
