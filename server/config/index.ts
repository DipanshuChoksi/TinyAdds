import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  nodeEnv: string;
}

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/tinyadds";
const port = parseInt(process.env.PORT || "5000", 10);
const nodeEnv = process.env.NODE_ENV || "development";

export const config: Config = {
  port: isNaN(port) ? 5000 : port,
  mongoUri,
  nodeEnv,
};

