import { processes } from "../store/processes.js";
import type { process_parameters } from "../common/types.js";

function badge(status: process_parameters["status"]): JSX.Element {
  switch (status) {
    case "downloading": return <span class="badge badge-downloading">Downloading</span>;
    case "uploading":   return <span class="badge badge-uploading">Uploading</span>;
    case "done":        return <span class="badge badge-done">Done</span>;
    case "failed":      return <span class="badge badge-failed">Failed</span>;
  }
}

function jobCard(id: string, params: process_parameters): JSX.Element {
  const dl = params.length > 0
    ? Math.min(100, Math.floor((params.downloaded / params.length) * 100))
    : 0;
  const ul = params.length > 0
    ? Math.min(100, Math.floor((params.uploaded / params.length) * 100))
    : 0;

  const canDelete = params.status === "done" || params.status === "failed";

  return (
    <div class="job-card" id={`process-${id}`}>
      <div class="job-header">
        <span class="video-title">{params.name}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          {badge(params.status)}
          {canDelete && (
            <button
              hx-delete={`/records/${id}`}
              hx-target={`#process-${id}`}
              hx-swap="delete"
              class="btn btn-outline small"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div class="progress-row">
        <span class="progress-label">Download</span>
        <div class="progress-track">
          <div class="progress-fill fill-download" style={`width:${dl}%`} />
        </div>
        <span class="progress-percent">{dl}%</span>
      </div>
      <div class="progress-row">
        <span class="progress-label">Upload</span>
        <div class="progress-track">
          <div class="progress-fill fill-upload" style={`width:${ul}%`} />
        </div>
        <span class="progress-percent">{ul}%</span>
      </div>
    </div>
  );
}

export default function progress(): JSX.Element {
  const jobs = Array.from(processes.entries());

  return (
    <div
      id="progress"
      hx-get="/records/progress"
      hx-target="#progress"
      hx-trigger="every 5s"
      hx-swap="outerHTML"
    >
      {jobs.length > 0 && (
        <div class="queue-section">
          <div class="queue-label">Queue</div>
          <div class="queue-list">
            {jobs.map(([id, params]) => jobCard(id, params))}
          </div>
        </div>
      )}
    </div>
  );
}
