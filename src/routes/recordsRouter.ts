import express from "express"
import { index, getProgress, downloadVideo } from "../controllers/recordsController.js";

const recordRouter = express.Router()

recordRouter.get("/", index);
recordRouter.get("/progress", getProgress);
recordRouter.post("/download", downloadVideo);

export default recordRouter