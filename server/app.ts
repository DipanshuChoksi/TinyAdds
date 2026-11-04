import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import emotionRoutes from "./routes/emotion.routes.js";
import adminEmotionRoutes from "./routes/adminEmotion.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientPostRoutes from "./routes/clientPost.routes.js";
import adminPostRoutes from "./routes/adminPost.routes.js";
import { config } from "./config/index.js";
import countryRoutes from "./routes/country.routes.js";
import adminCountryRoutes from "./routes/adminCountry.routes.js";
import stateRoutes from "./routes/state.routes.js";
import adminStateRoutes from "./routes/adminState.routes.js";
import cityRoutes from "./routes/city.routes.js";
import adminCityRoutes from "./routes/adminCity.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminContactRoutes from "./routes/adminContact.routes.js";
import cmsRoutes from "./routes/cms.routes.js";
import adminCmsRoutes from "./routes/adminCms.routes.js";
import adminUserRoutes from "./routes/adminUser.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app: Application = express();
const clientOrigins = config.clientOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);
if (config.nodeEnv === "development") {
	clientOrigins.push("http://localhost:3001", "http://127.0.0.1:3001");
}

// Middleware
app.use(cors({ origin: clientOrigins, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check / root route

// Routes
app.use("/api/emotions", emotionRoutes);
app.use("/api/admin/emotions", adminEmotionRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/client/posts", clientPostRoutes);
app.use("/api/admin/posts", adminPostRoutes);

app.use("/api/countries", countryRoutes);
app.use("/api/admin/countries", adminCountryRoutes);

app.use("/api/states", stateRoutes);
app.use("/api/admin/states", adminStateRoutes);

app.use("/api/cities", cityRoutes);
app.use("/api/admin/cities", adminCityRoutes);

app.use("/api/contacts", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);

app.use("/api/cms", cmsRoutes);
app.use("/api/admin/cms", adminCmsRoutes);

app.use("/api/admin/users", adminUserRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
