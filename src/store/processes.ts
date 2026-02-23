import type { process_parameters } from "../common/types.js";

export const processes = new Map<string, process_parameters>();

processes.set("1", {
	"name": "hamasa",
	"filePath": "test.mp4",
	"length": 10,
	"downloaded": 4,
	"uploaded": 0,
})