import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  sessionSecret: string;
  clientOrigin: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  adminEmails: string[];
}

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/tinyadds";
const port = parseInt(process.env.PORT || "5000", 10);
const nodeEnv = process.env.NODE_ENV || "development";
const sessionSecret = process.env.SESSION_SECRET || (nodeEnv === "production" ? "" : "tinyadds-development-session-secret-change-me");
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);

if (nodeEnv === "production" && sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters in production");
}

export const config: Config = {
  port: isNaN(port) ? 5000 : port,
  mongoUri,
  nodeEnv,
  sessionSecret,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number.isNaN(smtpPort) ? 587 : smtpPort,
  smtpUser: process.env.SMTP_USER || "",
  smtpPassword: process.env.SMTP_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "",
  adminEmails: (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
};

