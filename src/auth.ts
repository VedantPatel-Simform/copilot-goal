import type { User, Session } from "./types";

export const USERS_KEY = "auth-app.users";
export const SESSION_KEY = "auth-app.session";

// The admin account is hardcoded and cannot be deleted.
// Default credentials: username "admin", password "admin123".
const ADMIN_USER: User = {
  id: 0,
  username: "admin",
  password: "admin123",
  role: "admin",
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.username === "string" &&
    typeof obj.password === "string" &&
    (obj.role === "admin" || obj.role === "user")
  );
}

/** Returns all non-admin users stored in localStorage. */
export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isUser)) return parsed;
  } catch {
    // Ignore parse/storage errors.
  }
  return [];
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // Ignore persistence failures.
  }
}

/** Returns the matching user or null if credentials are invalid. */
export function findUser(username: string, password: string): User | null {
  if (
    username === ADMIN_USER.username &&
    password === ADMIN_USER.password
  ) {
    return ADMIN_USER;
  }
  const users = loadUsers();
  return users.find((u) => u.username === username && u.password === password) ?? null;
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as Record<string, unknown>).userId === "number" &&
      typeof (parsed as Record<string, unknown>).username === "string" &&
      ((parsed as Record<string, unknown>).role === "admin" ||
        (parsed as Record<string, unknown>).role === "user")
    ) {
      return parsed as Session;
    }
  } catch {
    // Ignore errors.
  }
  return null;
}

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore persistence failures.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore errors.
  }
}
