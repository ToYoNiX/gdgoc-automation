export default function login(error?: string): JSX.Element {
  return (
    <div class="card form-card">
      <form method="POST" action="/login">
        <div class="field-group">
          <label class="field-label" for="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter username"
            autocomplete="username"
            required
          />
        </div>
        <div class="field-group">
          <label class="field-label" for="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter password"
            autocomplete="current-password"
            required
          />
        </div>
        {error ? <p class="error-msg">{error}</p> : ""}
        <button type="submit" class="btn btn-primary" style="margin-top: 1.25rem;">Sign In</button>
      </form>
    </div>
  );
}
