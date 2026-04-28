import { useEffect, useState } from "react";
import type { Session } from "./types";
import { loadSession } from "./auth";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import TodoApp from "./components/TodoApp";
import "./App.css";

type Theme = "light" | "dark";

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem("todo-app.theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("todo-app.theme", theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  const handleLogout = () => setSession(null);

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      {!session && <LoginPage onLogin={setSession} />}

      {session && session.role === "admin" && (
        <AdminPanel session={session} onLogout={handleLogout} />
      )}

      {session && session.role !== "admin" && (
        <TodoApp session={session} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
