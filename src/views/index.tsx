import progress from "./progress";

export default function index(processes: string[]) {
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
        {processes.map((process) => progress(process))}
        <div></div>
      </body>
    </html>
  );
}
