export default function layout(title: string, content: JSX.Element): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GDGoC MUST: {title}</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js" />
      </head>
      <body>{content}</body>
    </html>
  );
}