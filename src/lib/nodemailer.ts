import * as nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  secure: false,
  service: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
})
