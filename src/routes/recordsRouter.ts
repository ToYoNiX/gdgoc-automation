import express from "express";
import { getIndex, getProgress, downloadVideo } from "../controllers/recordsController.js";
import { redirectToGoogle, handleGoogleCallback, handleRevoke, getStatus } from "../controllers/youtubeController.js";

const recordRouter = express.Router();

recordRouter.get("/", getIndex);
recordRouter.get("/progress", getProgress);
recordRouter.post("/download", downloadVideo);
recordRouter.get("/youtube/auth", redirectToGoogle);
recordRouter.get("/youtube/callback", handleGoogleCallback);
recordRouter.post("/youtube/revoke", handleRevoke);
recordRouter.get("/youtube/status", getStatus);

export default recordRouter;