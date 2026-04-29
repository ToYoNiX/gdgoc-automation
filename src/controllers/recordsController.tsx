import type { Request, Response } from 'express';
import layout from "../views/layout.js";
import progress from "../views/progress.js";
import index from "../views/index.js";
import { logger } from "../app.js";
import { download, deleteProcess } from "../services/recordsService.js";

export function getProgress(req: Request, res: Response) {
  return res.send(progress());
}

export function getIndex(req: Request, res: Response) {
  return res.send(layout("Records Dashboard", index(),
    <form method="POST" action="/logout">
      <button type="submit" class="btn btn-outline small">Logout</button>
    </form>
  ));
}

export function downloadVideo(req: Request, res: Response) {
  const name: string = req.body.name?.trim() ?? "";
  const url: string = req.body.url?.trim() ?? "";

  if (!url || !name) {
    return res.status(400).send("Both name and url are required");
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).send("Invalid URL provided");
  }

  const safeName = name.replace(/[^a-zA-Z0-9_\-]/g, "_");
  const description: string = req.body.description?.trim() ?? "";
  const visibility = (req.body.visibility ?? "unlisted") as "public" | "private" | "unlisted";
  const categoryId = "27";
  const tags: string[] = (req.body.tags ?? "")
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  logger.info(`Queued "${safeName}" from ${url} [${visibility}]`);
  download(safeName, url, description, visibility, categoryId, tags).catch((err: unknown) => {
    logger.error(`Failed to process "${safeName}" | ${err}`);
  });

  return res.send(index());
}

export function deleteVideo(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  try {
    deleteProcess(id);
    logger.info(`Deleted process ${id}`);
    return res.send("");
  } catch (err) {
    logger.error(`Failed to delete process ${id} | ${err}`);
    return res.status(404).send("Not found");
  }
}
