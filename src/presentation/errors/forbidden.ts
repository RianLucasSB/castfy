export class ForbiddenError extends Error {
  constructor(message: string) {
    super(`Forbidden resource: ${message}`)
    this.name = 'InvalidParamError'
  }
}
