import nodemailer from "nodemailer";
import { config } from "../config/index.js";
import { AppError } from "./errors.js";

export async function sendPasswordOtp(email: string, otp: string): Promise<void> {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPassword || !config.emailFrom) {
    throw new AppError("Password reset email is not configured on the server", 503, "EMAIL_NOT_CONFIGURED");
  }
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPassword },
  });
  await transporter.sendMail({
    from: config.emailFrom,
    to: email,
    subject: "TinyAdds password reset code",
    text: `Your TinyAdds verification code is ${otp}. It expires in 10 minutes.`,
  });
}
