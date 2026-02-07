import express from "express"
import axios from "axios";
import pino from "pino";
import { v4 as uuidv4 } from 'uuid';
import { join } from "path";
import { createWriteStream, mkdirSync } from "fs";


import index from "./views/index"
import progress from "./views/progress"

const app = express();
const logger = pino();

app.use(express.json())
app.use(express.urlencoded())

// Process data
interface process_parameters {
	"name": string,
	"length": number,
	"downloaded": number,
}

// Video Downlaod Process Array
let processes = new Map<string, process_parameters>();

// Create the download folder
mkdirSync("downloads", { recursive: true });

// Surve landing page
app.get("/", (req, res) => {
	res.send(index(processes));
})

app.post("/download", async (req, res) => {
	const name: string = req.body.name;
	const url: string = req.body.url;

	if (!url) {
		res.send(index(processes, "URL is Invalid!"));
	}

	try {
		const response = await axios({
			method: "GET",
			url,
			responseType: "stream",
			timeout: 30_000
		});

		const id:string = uuidv4();

		const filePath = join("downloads", `${name}.mp4`);
		const writer = createWriteStream(filePath);

		let parameters:process_parameters = {
			"name": name,
			"length": parseInt(response.headers["content-length"], 10),
			"downloaded": 0,
		};

		processes.set(id, parameters);

		response.data.on("data", (chunk: Buffer) => {
			parameters["downloaded"] += chunk.length;
			processes.set(id, parameters);
		});

		logger.info(`${filePath} downloading started`);

		writer.on("finish", () => {
			logger.info(`${filePath} downloaded`);
		});

		writer.on("error", (err) => {
			logger.error(`${filePath} couldn't download | ${err}`);
		});

		response.data.pipe(writer);
		res.redirect("/");
	} catch (err) {
		logger.error(`axois failed to download ${name} | ${err}`);
	}
})

app.get("/progress", (req, res) => {
	res.send(progress("test"));
})

app.listen(3000, () => {
	logger.info("listenning at port 3000");
})
