import layout from "./layout.js";

export default function login(error?: string): JSX.Element {
  return layout(
    "Login",
    <div id="login">
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error ? <div>{error}</div> : ""}
      </form>
    </div>,
  );
}
