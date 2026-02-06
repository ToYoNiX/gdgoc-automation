const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Single variable to track everything
// -1 = no download, 0-100 = downloading, 101 = done, -2 = error
let downloadProgress = -1;

// Serve main page
app.get("/", (req, res) => {
	if (downloadProgress >= 0 && downloadProgress <= 100) return res.redirect("/progress");
	res.sendFile(__dirname + "/views/index.html");
});

// Start download
app.post("/download", async (req, res) => {
	const { url } = req.body;

	if (!url) return res.status(400).send("URL is required");

	downloadProgress = 0; // start downloading

	fs.mkdirSync("downloads", { recursive: true });
	const filePath = path.join("downloads", "output.mp4");

	try {
		const response = await axios({
			method: "GET",
			url,
			responseType: "stream",
			timeout: 30_000,
		});

		const totalLength = parseInt(response.headers["content-length"], 10);
		let downloaded = 0;

		const writer = fs.createWriteStream(filePath);

		response.data.on("data", (chunk) => {
			downloaded += chunk.length;
			if (totalLength) {
				downloadProgress = Math.floor((downloaded / totalLength) * 100);
			}
		});

		response.data.pipe(writer);

		writer.on("finish", () => {
			downloadProgress = 101; // done
		});

		writer.on("error", (err) => {
			console.error("Write error:", err);
			downloadProgress = -2; // error
		});

		// Return initial progress div
		res.send(`
      <div id="progress-container"
	   hx-get="/progress"
	   hx-trigger="every 2s"
	   hx-swap="outerHTML">
	Download starting...
      </div>
    `);
	} catch (err) {
		console.error("Download error:", err);
		downloadProgress = -2; // error
		res.send(`
      <div>
	Error starting download
	<form hx-post="/download" hx-target="#focus" hx-swap="innerHTML">
	  <input type="text" name="url" placeholder="url" id="url">
	  <button type="submit">Start Download</button>
	</form>
      </div>
    `);
	}
});

// Progress endpoint
app.get("/progress", (req, res) => {
	if (downloadProgress >= 0 && downloadProgress <= 100) {
		// downloading
		res.send(`
      <div id="progress-container"
	   hx-get="/progress"
	   hx-trigger="every 2s"
	   hx-swap="outerHTML">
	Downloading... ${downloadProgress}%
      </div>
    `);
	} else if (downloadProgress === 101) {
		// done
		downloadProgress = -1; // reset
		res.send(`
      <div>
	<form hx-post="/download" hx-target="#focus" hx-swap="innerHTML">
	  <input type="text" name="url" placeholder="url" id="url">
	  <button type="submit">Start Download</button>
	</form>
	<p>Download completed successfully!</p>
      </div>
    `);
	} else if (downloadProgress === -2) {
		// error
		downloadProgress = -1; // reset
		res.send(`
      <div>
	<form hx-post="/download" hx-target="#focus" hx-swap="innerHTML">
	  <input type="text" name="url" placeholder="url" id="url">
	  <button type="submit">Start Download</button>
	</form>
	<p>Error during download</p>
      </div>
    `);
	} else {
		// no download
		res.sendFile(__dirname + "/views/index.html");
	}
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

