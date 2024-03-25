import { FastifyInstance } from 'fastify'
import { handleSignUp } from './sign-up'
import { handleSignIn } from './sign-in'

export async function authHandler(app: FastifyInstance) {
  app.post('/sign-up', handleSignUp)
  app.post('/sign-in', handleSignIn)
}
