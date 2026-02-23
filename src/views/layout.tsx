export default function layout(
  title: string,
  content: JSX.Element,
  authenticated: boolean = false,
): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GDGoC MUST: {title}</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js" />
      </head>
      <body>
        {authenticated && (
          <form method="POST" action="/logout">
            <button type="submit">Logout</button>
          </form>
        )}
        {content}
      </body>
    </html>
  );
}
