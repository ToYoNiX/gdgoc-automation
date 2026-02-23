import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { createWriteStream, mkdirSync } from "fs";
import { logger } from "../app.js";
import type { process_parameters } from "../common/types.js";
import { processes } from "../store/processes.js";
import { uploadVideo } from "./youtubeService.js";

export async function download(name: string, url: string): Promise<void> {
  mkdirSync("downloads", { recursive: true });

  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 30_000,
  });

  const id: string = uuidv4();
  const filePath = join("downloads", `${id}_${name}.mp4`);
  const writer = createWriteStream(filePath);
  const contentLength = response.headers["content-length"];

  let parameters: process_parameters = {
    name,
    filePath,
    length: contentLength ? parseInt(contentLength, 10) : 0,
    downloaded: 0,
    uploaded: 0,
  };

  processes.set(id, parameters);

  response.data.on("data", (chunk: Buffer) => {
    parameters.downloaded += chunk.length;
    processes.set(id, parameters);
  });

  logger.info(`${filePath} download started`);

  await new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.pipe(writer);
  });

  logger.info(`${filePath} download complete, starting upload`);
  processes.set(id, parameters);

  await uploadVideo(id, parameters);
}