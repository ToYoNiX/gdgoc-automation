import express from "express"
import pino from "pino";

import type { process_parameters } from "./common/types.js";
import recordsRouter from "./routes/recordsRouter.js";

const app = express();
const logger = pino();
let processes = new Map<string, process_parameters>();

processes.set("1", {
	"name": "hamasa",
	"length": 10,
	"downloaded": 1
})

app.use(express.json())
app.use(express.urlencoded())

// Routes
app.use("/records", recordsRouter);

export default app
export { logger, processes }
