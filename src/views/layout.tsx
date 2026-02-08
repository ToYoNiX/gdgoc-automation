export default function layout(
  title: string,
  content: JSX.Element,
): JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>GDGoC MUST: {title}</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
      </head>
      <body>{content}</body>
    </html>
  );
}
