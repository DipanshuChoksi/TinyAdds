import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import emotionRoutes from "./routes/emotion.routes.js";
import adminEmotionRoutes from "./routes/adminEmotion.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientPostRoutes from "./routes/clientPost.routes.js";
import { config } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app: Application = express();

// Middleware
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check / root route

// Routes
app.use("/api/emotions", emotionRoutes);
app.use("/api/admin/emotions", adminEmotionRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/client/posts", clientPostRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
