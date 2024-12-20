import { ServerError } from '../errors/server-error'
import { type HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  }
}

export const notFound = (error: Error): HttpResponse => {
  return {
    statusCode: 404,
    body: error,
  }
}

export const forbidden = (error: Error): HttpResponse => {
  return {
    statusCode: 403,
    body: error,
  }
}

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(),
  }
}

export const ok = (data: unknown): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  }
}
