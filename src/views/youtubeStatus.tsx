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
        <span>
          ✓ YouTube connected — expires in {expiresIn}
          <form method="POST" action="/records/youtube/revoke">
            <button type="submit">Regenerate</button>
          </form>
        </span>
      ) : (
        <a href="/records/youtube/auth">Connect YouTube</a>
      )}
    </div>
  );
}
