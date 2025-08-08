// CATCH ASYNC ERRORS IN EXPRESS WITHOUT USING TRY/CATCH BLOCK
require("express-async-errors");

import express from "express";
import { rootRouter } from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cookieSession from "cookie-session";

const app = express();

app.use(express.json());
app.set("trust proxy", true); // Trust the first proxy (for secure cookies in production)
app.use(
  cookieSession({
    signed: false, // Disable signing for simplicity
    secure: process.env.NODE_ENV !== "test", // Use secure cookies in production
  })
);

// Entry point for the application
app.use("/api/orders", rootRouter);

// 404 Not Found handler
app.use((_, res) => {
  return res.status(404).json({ message: "Route Not Found" });
});

// Centralized error handling middleware
app.use(errorMiddleware);

export { app };
