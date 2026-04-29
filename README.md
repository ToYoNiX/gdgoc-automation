# GDGoC Records Upload Tool

A self-hosted web app for downloading session recordings from a URL and uploading them directly to a YouTube channel. Built for GDG on Campus MUST.

## Motivation

After each event, session recordings are hosted on Bevy at sizes that make downloading them locally painful — especially in Egypt where internet connections are metered and quota is a real constraint. Re-uploading from a personal machine would burn through that quota fast.

This tool is designed to run on a cloud server where bandwidth is unlimited and cheap. The server does the heavy lifting — downloads the recording and pushes it straight to YouTube — while the user just submits a URL and walks away.

## How it works

1. Paste the source video URL and fill in the metadata (title, description, visibility, tags)
2. The server downloads the video to disk in the background and then uploads it to YouTube via the Data API v3
3. A live queue on the dashboard tracks each job through its stages: **Downloading → Uploading → Done**
4. If the upload fails (e.g. YouTube not connected, token expired), the job turns **Failed** — delete it, fix the issue, and resubmit
5. Once a job is **Done**, click **Delete** to remove the local file and clear it from the queue

## Tech stack

- **Runtime** — Node.js + TypeScript
- **Framework** — Express 5
- **UI** — Server-side JSX (`@kitajs/html`) + HTMX for reactive updates
- **YouTube** — Google APIs Node.js client (OAuth 2.0)
- **Logging** — Pino
- **Deployment** — Docker + Docker Compose

---

## Prerequisites

- Node.js >= 14
- A Google Cloud project with the **YouTube Data API v3** enabled
- OAuth 2.0 credentials (type: **Web application**) from Google Cloud Console

---

## Environment variables

Create a `.env` file at the project root:

```env
APP_USERNAME=admin
APP_PASSWORD=yourpassword

YOUTUBE_CREDENTIALS={"web":{"client_id":"...","client_secret":"...","redirect_uris":["http://localhost:3000/records/youtube/callback"]}}

# Optional
PORT=3000
HTTPS=false
```

### `YOUTUBE_CREDENTIALS`

This is the raw JSON from the credentials file you download from Google Cloud Console — the one that starts with `{"web": ...}`. Paste it as a single line.

Make sure the **Authorized redirect URI** in your Google Cloud app matches:
- Local: `http://localhost:3000/records/youtube/callback`
- Production: `https://yourdomain.com/records/youtube/callback`

---

## Running locally

```bash
npm install
npm run dev
```

The app starts on `http://localhost:3000`.

## Building for production

```bash
npm run build
npm start
```

## Running with Docker

```bash
docker compose up -d
```

The `credentials/` folder is mounted as a volume so the YouTube token persists across container restarts.

The `downloads/` folder is intentionally **not** a volume. If a container is removed while a download is in progress or stuck, any partially downloaded files are automatically cleaned up with it — no manual intervention needed.

To build and push a Docker image manually:

```bash
docker build -t gdgoc-automation .
```

A GitHub Actions workflow automatically builds and pushes a signed image to GHCR on every push to `main`.

---

## Usage

1. Log in with the username and password from your `.env`
2. Connect your YouTube account via **Connect YouTube** and complete the OAuth flow — **do this before submitting any jobs**
3. Fill in the form — source URL, title, description, visibility, and optional tags
4. Click **Add to queue** — the job appears in the queue immediately and the download starts in the background
5. Watch the status update live every 5 seconds: **Downloading → Uploading → Done**
6. Once **Done**, click **Delete** to remove the local file and clear the job from the queue
7. If a job shows **Failed** (e.g. YouTube was not connected or the token expired), delete it, resolve the issue, and resubmit

---

## Project structure

```
src/
  app.ts                  # Express setup, middleware, routing
  server.ts               # HTTP server + graceful shutdown
  common/types.ts         # Shared TypeScript types
  controllers/            # Request handlers
  middleware/auth.ts      # Session-based auth guard
  routes/recordsRouter.ts # /records routes
  services/
    recordsService.ts     # Download logic, process tracking
    youtubeService.ts     # YouTube OAuth + upload
  store/processes.ts      # In-memory job map
  views/                  # JSX server-side templates
  static/style.css        # Stylesheet
credentials/              # YouTube OAuth token (gitignored)
downloads/                # Temporary video files (gitignored)
```

---

## Notes

- The process list is in-memory — it resets on server restart
- All videos are uploaded under the **Education** category (YouTube category ID 27)
- Set `HTTPS=true` when running behind a reverse proxy that terminates TLS, so session cookies are marked `Secure`
