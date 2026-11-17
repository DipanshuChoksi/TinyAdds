import { config } from "./config/index.js";
import { connectDB } from "./config/database.js";
import app from "./app.js";

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
