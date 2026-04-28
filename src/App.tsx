import { useState } from "react";
import type { Session } from "./types";
import { loadSession } from "./auth";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import TodoApp from "./components/TodoApp";
import "./App.css";

function App() {
  const [session, setSession] = useState<Session | null>(loadSession);

  const handleLogout = () => setSession(null);

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  if (session.role === "admin") {
    return <AdminPanel session={session} onLogout={handleLogout} />;
  }

  return <TodoApp session={session} onLogout={handleLogout} />;
}

export default App;
