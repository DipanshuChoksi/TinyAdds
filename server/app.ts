import express, { type Application, type Request, type Response } from "express";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check / root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "TinyAdds API is running",
  });
});

export default app;
