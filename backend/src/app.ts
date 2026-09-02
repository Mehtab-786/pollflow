import express from "express";
import type { Request, Response } from "express";
import { errorHandler } from "./common/middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes.js";


const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Express inbuilt middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/auth", authRouter);


// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;

