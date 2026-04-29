export default function layout(
  title: string,
  content: JSX.Element,
  action?: JSX.Element,
): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <title>GDGoC MUST — {title}</title>
        <link rel="stylesheet" href="/style.css" />
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js" />
      </head>
      <body>
        <div class="app-container">
          <div class="page-header">
            <h1>GDGoC Records Upload Tool</h1>
            {action ?? ""}
          </div>
          {content}
        </div>
      </body>
    </html>
  );
}
