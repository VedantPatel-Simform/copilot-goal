import { useState } from "react";
import type { FormEvent } from "react";
import type { Session, User } from "../types";
import { loadUsers, saveUsers, clearSession } from "../auth";

type Props = {
  session: Session;
  onLogout: () => void;
};

type NewUserForm = {
  username: string;
  password: string;
};

const EMPTY_FORM: NewUserForm = { username: "", password: "" };

export default function AdminPanel({ session, onLogout }: Props) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccessMsg("");

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      setFormError("Both username and password are required.");
      return;
    }

    const existing = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (existing || username.toLowerCase() === "admin") {
      setFormError("A user with that username already exists.");
      return;
    }

    const newUser: User = {
      id: Date.now(),
      username,
      password,
      role: "user",
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    setUsers(updated);
    setForm(EMPTY_FORM);
    setSuccessMsg(`User "${username}" created successfully.`);
  };

  const handleDelete = (id: number) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    setUsers(updated);
    setSuccessMsg("");
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <main className="app-shell">
      <section className="auth-panel admin-panel" aria-labelledby="admin-title">
        <header className="page-nav">
          <div className="todo-header" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Admin panel</p>
            <h1 id="admin-title">Manage users</h1>
          </div>
          <div className="nav-actions">
            <span className="nav-user">Signed in as {session.username}</span>
            <button type="button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        <section aria-labelledby="create-user-title">
          <h2 id="create-user-title" className="section-title">
            Create user
          </h2>
          <form className="auth-form" onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="new-username">Username</label>
                <input
                  id="new-username"
                  type="text"
                  value={form.username}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, username: e.target.value }));
                    setFormError("");
                    setSuccessMsg("");
                  }}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="new-password">Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    setFormError("");
                    setSuccessMsg("");
                  }}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button type="submit" className="btn-primary form-row-btn">
                Create
              </button>
            </div>

            {formError && (
              <p className="auth-error" role="alert">
                {formError}
              </p>
            )}
            {successMsg && (
              <p className="auth-success" role="status">
                {successMsg}
              </p>
            )}
          </form>
        </section>

        <section aria-labelledby="user-list-title">
          <h2 id="user-list-title" className="section-title">
            Users
          </h2>

          {users.length === 0 ? (
            <p className="empty-state-text">No users yet. Create one above.</p>
          ) : (
            <ul className="user-list" aria-label="User accounts">
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  <span className="user-name">{user.username}</span>
                  <span className="user-role">{user.role}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    aria-label={`Delete user ${user.username}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
