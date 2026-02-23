import express from "express";
import pino from "pino";
import "dotenv/config";
import recordsRouter from "./routes/recordsRouter.js";

const app = express();

export const logger = pino();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/records", recordsRouter);

export default app;