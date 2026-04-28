import { useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "../types";
import { findUser, saveSession } from "../auth";

type Props = {
  onLogin: (session: Session) => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = findUser(username.trim(), password);
    if (!user) {
      setError("Invalid username or password.");
      return;
    }
    const session: Session = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };
    saveSession(session);
    onLogin(session);
  };

  return (
    <main className="app-shell">
      <section className="auth-panel" aria-labelledby="login-title">
        <header className="todo-header">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in</h1>
          <p className="subtitle">
            Default admin credentials: <strong>admin</strong> /{" "}
            <strong>admin123</strong>
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
