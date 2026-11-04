import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import emotionRoutes from "./routes/emotion.routes.js";
import adminEmotionRoutes from "./routes/adminEmotion.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientPostRoutes from "./routes/clientPost.routes.js";
import { config } from "./config/index.js";
import countryRoutes from "./routes/country.routes.js";
import adminCountryRoutes from "./routes/adminCountry.routes.js";
import stateRoutes from "./routes/state.routes.js";
import adminStateRoutes from "./routes/adminState.routes.js";
import cityRoutes from "./routes/city.routes.js";
import adminCityRoutes from "./routes/adminCity.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminContactRoutes from "./routes/adminContact.routes.js";
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

app.use("/api/countries", countryRoutes);
app.use("/api/admin/countries", adminCountryRoutes);

app.use("/api/states", stateRoutes);
app.use("/api/admin/states", adminStateRoutes);

app.use("/api/cities", cityRoutes);
app.use("/api/admin/cities", adminCityRoutes);

app.use("/api/contacts", contactRoutes);
app.use("/api/admin/contacts", adminContactRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
