import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";
import { createWriteStream, mkdirSync, unlinkSync } from "fs";
import { logger } from "../app.js";
import type { process_parameters } from "../common/types.js";
import { processes } from "../store/processes.js";
import { uploadVideo } from "./youtubeService.js";

export function deleteProcess(id: string): void {
  const parameters = processes.get(id);
  if (!parameters) throw new Error(`Process ${id} not found`);
  processes.delete(id);
  try {
    unlinkSync(parameters.filePath);
  } catch {
    // file may already be gone
  }
}

export async function download(
  name: string,
  url: string,
  description: string,
  visibility: "public" | "private" | "unlisted",
  categoryId: string,
  tags: string[],
): Promise<void> {
  mkdirSync("downloads", { recursive: true });

  const id = uuidv4();
  const filePath = join("downloads", `${id}_${name}.mp4`);

  const parameters: process_parameters = {
    name,
    filePath,
    length: 0,
    downloaded: 0,
    uploaded: 0,
    description,
    visibility,
    categoryId,
    tags,
    status: "downloading",
  };

  processes.set(id, parameters);

  const response = await axios({
    method: "GET",
    url,
    responseType: "stream",
    timeout: 30_000,
  });

  const contentLength = response.headers["content-length"];
  parameters.length = contentLength ? parseInt(contentLength, 10) : 0;
  processes.set(id, parameters);

  const writer = createWriteStream(filePath);

  response.data.on("data", (chunk: Buffer) => {
    parameters.downloaded += chunk.length;
    processes.set(id, parameters);
  });

  logger.info(`"${name}" download started`);

  await new Promise<void>((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.pipe(writer);
  });

  logger.info(`"${name}" download complete, starting upload`);

  parameters.status = "uploading";
  processes.set(id, parameters);

  try {
    await uploadVideo(id, parameters);
  } catch (err) {
    logger.error(`Upload failed for "${name}" | ${err}`);
    parameters.status = "failed";
    processes.set(id, parameters);
  }
}
