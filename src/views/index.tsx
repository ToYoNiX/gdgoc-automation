import progress from "./progress.js";
import youtubeStatus from "./youtubeStatus.js";

export default function index(): JSX.Element {
  return (
    <div id="index">
      <div class="card form-card">
        {youtubeStatus()}

        <form hx-post="/records/download" hx-target="#index" hx-swap="outerHTML">
          <div class="form-grid">
            <div class="field-group full-width">
              <label class="field-label" for="url">Source URL</label>
              <input
                type="text"
                name="url"
                id="url"
                placeholder="https://..."
                autocomplete="off"
                required
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label" for="name">Video Title</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter video title"
                autocomplete="off"
                required
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label" for="description">Description</label>
              <textarea name="description" id="description" placeholder="Describe your video..." />
            </div>

            <div class="field-group full-width">
              <label class="field-label" for="visibility">Visibility</label>
              <select name="visibility" id="visibility">
                <option value="private">Private</option>
                <option value="unlisted" selected>Unlisted</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div class="field-group full-width">
              <label class="field-label" for="tags">Tags</label>
              <input
                type="text"
                name="tags"
                id="tags"
                placeholder="tag1, tag2, tag3"
                autocomplete="off"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-outline">Add to queue</button>
        </form>
      </div>

      {progress()}
    </div>
  );
}
