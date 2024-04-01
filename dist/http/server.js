'use strict'
const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const fastify_1 = __importDefault(require('fastify'))
const auth_1 = require('../middlewares/auth')
const auth_2 = require('./routes/auth')
const file_1 = require('./routes/file')
const server = (0, fastify_1.default)()
server.register(auth_2.authHandler, { prefix: '/auth' })
server.addHook('preHandler', auth_1.authMiddleware)
server.register(file_1.fileHandler, { prefix: '/file' })
server.listen({ port: 3333 }).then((port) => {
  console.log(`Running at: ${port}`)
})
