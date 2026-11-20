import nodemailer from "nodemailer";
import { config } from "../config/index.js";
import { AppError } from "./errors.js";

type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) {
    throw new AppError("Email is not configured on the server", 503, "EMAIL_NOT_CONFIGURED");
  }
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPassword },
  });
  await transporter.sendMail({
    from: config.emailFrom,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });
}