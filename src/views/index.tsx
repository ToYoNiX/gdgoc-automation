import progress from "./progress";

interface process_parameters {
	"name": string,
	"length": number,
	"downloaded": number,
}

export default function index(processes: Map<string, process_parameters>) {
  return (
    <html lang="en">
      <head>
        <title>Simple Video Automation Tool</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
      </head>
      <body>
        <div id="focus">
          <form hx-post="/download" hx-target="#focus" hx-swap="innerHTML">
            <input type="text" name="name" placeholder="name" id="name" />
            <input type="text" name="url" placeholder="url" id="url" />
            <button type="submit">Start Download</button>
          </form>
        </div>
        <div>
          {Array.from(processes.entries()).map(([key, values]) => progress(values))}
        </div>
      </body>
    </html>
  );
}
