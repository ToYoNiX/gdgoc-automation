import { getTokenStatus } from "../services/youtubeService.js";

export default function youtubeStatus(): JSX.Element {
  const { connected, expiresIn } = getTokenStatus();

  return (
    <div
      id="youtube-status"
      hx-get="/records/youtube/status"
      hx-target="#youtube-status"
      hx-trigger="every 30s"
      hx-swap="outerHTML"
    >
      {connected ? (
        <div class="yt-connected">
          <span class="yt-connected-label">
            ✓ YouTube connected — expires in {expiresIn}
          </span>
          <form method="POST" action="/records/youtube/revoke">
            <button type="submit" class="btn btn-outline small">Regenerate</button>
          </form>
        </div>
      ) : (
        <a href="/records/youtube/auth" class="btn btn-youtube disconnected">
          Connect YouTube
        </a>
      )}
    </div>
  );
}
