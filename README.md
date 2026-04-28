# Copilot Todo App

A minimal, role-based **Todo** web application built with **React 19**, **TypeScript**, and **Vite**. It supports two roles — **admin** and **user** — and persists all data entirely in the browser's `localStorage` with no backend required.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Development Server](#development-server)
   - [Build for Production](#build-for-production)
   - [Preview Production Build](#preview-production-build)
   - [Linting](#linting)
5. [Default Credentials](#default-credentials)
6. [Architecture & Data Flow](#architecture--data-flow)
7. [Components](#components)
   - [App](#app)
   - [LoginPage](#loginpage)
   - [AdminPanel](#adminpanel)
   - [TodoApp](#todoapp)
8. [Data Model](#data-model)
9. [Auth Module](#auth-module)
10. [localStorage Keys](#localstorage-keys)
11. [Theme Support](#theme-support)
12. [Known Limitations](#known-limitations)

---

## Features

- **Authentication** — Login with username and password; session is persisted across page refreshes.
- **Role-based routing** — Admin users land on the Admin Panel; regular users land on the Todo App.
- **Admin Panel** — Create and delete regular user accounts.
- **Todo App** — Add, toggle, filter (All / Active / Completed), and delete todos. Todos are stored per user.
- **Light / Dark theme** — One-click toggle that respects the OS preference on first load.
- **No backend** — All state lives in `localStorage`; the app works fully offline.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | [React 19](https://react.dev/) |
| Language | [TypeScript ~6](https://www.typescriptlang.org/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Linting | [ESLint 9](https://eslint.org/) with `typescript-eslint` and `eslint-plugin-react-hooks` |
| Styling | Plain CSS (`App.css`, `index.css`) |
| Persistence | Browser `localStorage` |

---

## Project Structure

```
copilot-goal/
├── public/                 # Static assets served as-is
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx  # Admin UI: create & delete users
│   │   ├── LoginPage.tsx   # Login form
│   │   └── TodoApp.tsx     # Per-user todo list
│   ├── assets/             # Images / SVGs imported by components
│   ├── App.css             # Application-level styles
│   ├── App.tsx             # Root component — session routing & theme
│   ├── auth.ts             # Auth helpers: users & session via localStorage
│   ├── index.css           # Global reset / base styles
│   ├── main.tsx            # React entry point
│   └── types.ts            # Shared TypeScript types
├── index.html              # Vite HTML entry point
├── package.json
├── tsconfig.json           # TypeScript project references root
├── tsconfig.app.json       # TS config for src/
├── tsconfig.node.json      # TS config for Vite config file
├── vite.config.ts          # Vite configuration
└── eslint.config.js        # ESLint flat config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9 (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/VedantPatel-Simform/copilot-goal.git
cd copilot-goal

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Vite starts a local dev server (default: `http://localhost:5173`) with Hot Module Replacement (HMR) enabled.

### Build for Production

```bash
npm run build
```

TypeScript is compiled first (`tsc -b`), then Vite bundles everything into the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can verify the production build before deploying.

### Linting

```bash
npm run lint
```

Runs ESLint across all TypeScript and TSX source files.

---

## Default Credentials

The admin account is hardcoded in `src/auth.ts` and cannot be deleted.

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |

Regular user accounts are created by the admin through the Admin Panel. There are no default regular user accounts.

> **Security note:** Passwords are stored in plain text in `localStorage`. This is intentional for a client-only demo. Do **not** use real passwords with this application.

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────┐
│                  App.tsx                     │
│  - Holds session state & theme state         │
│  - Reads session from localStorage on mount  │
│  - Routes to LoginPage / AdminPanel / TodoApp│
└────────────┬────────────────────────┬────────┘
             │ no session             │ session
             ▼                        ▼
       ┌──────────┐      ┌──────────────────────────────┐
       │LoginPage │      │ role === "admin"?             │
       │          │      │   yes → AdminPanel            │
       │ calls    │      │   no  → TodoApp               │
       │ findUser │      └──────────────────────────────┘
       └──────────┘
```

1. On load, `App` reads the persisted `Session` from `localStorage`.
2. If no session exists, `LoginPage` is shown.
3. After a successful login, `LoginPage` calls `onLogin(session)` which lifts the session up to `App`.
4. `App` renders `AdminPanel` for `role === "admin"` and `TodoApp` for all other roles.
5. Both `AdminPanel` and `TodoApp` call `onLogout()` when the user signs out, which clears the session and returns to `LoginPage`.

---

## Components

### App

**File:** `src/App.tsx`

The root component. Responsibilities:

- Bootstraps the `Session` from `localStorage` via `loadSession()`.
- Manages the active `Theme` (`"light"` | `"dark"`), persisting it to `localStorage` and applying it as a `data-theme` attribute on `<html>`.
- Renders a floating theme-toggle button (🌙 / ☀️) on every screen.
- Conditionally renders `LoginPage`, `AdminPanel`, or `TodoApp` based on the current session state.

**Props:** none (root component)

**Key state:**

| State | Type | Description |
|---|---|---|
| `session` | `Session \| null` | The active logged-in user session |
| `theme` | `"light" \| "dark"` | Current UI theme |

---

### LoginPage

**File:** `src/components/LoginPage.tsx`

A controlled login form. Responsibilities:

- Accepts a `username` and `password` input.
- On submit, calls `findUser()` from `auth.ts` to validate credentials.
- On success, creates a `Session`, persists it with `saveSession()`, and calls `onLogin(session)`.
- Displays an inline error message on invalid credentials.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `onLogin` | `(session: Session) => void` | Callback invoked with the new session on successful login |

---

### AdminPanel

**File:** `src/components/AdminPanel.tsx`

The admin dashboard. Responsibilities:

- Loads the list of regular users from `localStorage` on mount.
- Provides a **Create User** form (username + password). Validates uniqueness and prevents reusing the reserved `"admin"` username.
- Displays all existing users in a list, each with a **Delete** button.
- Calls `clearSession()` and `onLogout()` when the admin signs out.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `session` | `Session` | The current admin session (used to display the signed-in username) |
| `onLogout` | `() => void` | Callback invoked after the session is cleared |

**Key state:**

| State | Type | Description |
|---|---|---|
| `users` | `User[]` | The list of regular user accounts |
| `form` | `{ username: string; password: string }` | Controlled inputs for the create-user form |
| `formError` | `string` | Validation error displayed below the form |
| `successMsg` | `string` | Success message shown after user creation |

---

### TodoApp

**File:** `src/components/TodoApp.tsx`

The per-user todo list. Responsibilities:

- Loads todos for the current user from `localStorage` on mount (falls back to two seed todos on first use).
- Persists the todo list back to `localStorage` on every change (skipping the initial render to avoid an unnecessary write).
- Supports **Add**, **Toggle** (complete / incomplete), and **Delete** actions on individual todos.
- Provides **Clear completed** to batch-delete all completed todos.
- Offers three filter views: **All**, **Active** (incomplete), **Completed**.
- Displays live counts of remaining and completed items.
- Calls `clearSession()` and `onLogout()` when the user signs out.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `session` | `Session` | The current user session (used for the storage key and greeting) |
| `onLogout` | `() => void` | Callback invoked after the session is cleared |

**Key state:**

| State | Type | Description |
|---|---|---|
| `todos` | `Todo[]` | Full list of todos for the current user |
| `newTodo` | `string` | Controlled value of the "Add a task" input |
| `filter` | `"all" \| "active" \| "completed"` | Currently active filter tab |

**Derived state (via `useMemo`):**

| Variable | Description |
|---|---|
| `visibleTodos` | Filtered subset of `todos` based on the active `filter` |
| `remainingCount` | Number of incomplete todos |
| `completedCount` | Number of completed todos |

---

## Data Model

**File:** `src/types.ts`

```ts
/** Possible roles a user account can have. */
type UserRole = "admin" | "user";

/** A user account stored in localStorage. */
type User = {
  id: number;        // Unique numeric ID (Date.now() for created users, 0 for admin)
  username: string;
  password: string;  // Plain text — demo only, never use real passwords
  role: UserRole;
};

/** The active session stored in localStorage after login. */
type Session = {
  userId: number;
  username: string;
  role: UserRole;
};
```

A `Todo` type is defined locally inside `TodoApp.tsx` because it is only used there:

```ts
type Todo = {
  id: number;       // Unique numeric ID (Date.now())
  text: string;     // The todo description
  completed: boolean;
};
```

---

## Auth Module

**File:** `src/auth.ts`

All authentication and session logic lives here. The module exposes the following:

| Export | Signature | Description |
|---|---|---|
| `USERS_KEY` | `string` | `localStorage` key for the users array |
| `SESSION_KEY` | `string` | `localStorage` key for the active session |
| `loadUsers` | `() => User[]` | Reads and validates the users array from `localStorage` |
| `saveUsers` | `(users: User[]) => void` | Serialises and writes the users array to `localStorage` |
| `findUser` | `(username, password) => User \| null` | Validates credentials against the hardcoded admin and the stored users |
| `loadSession` | `() => Session \| null` | Reads and validates the active session from `localStorage` |
| `saveSession` | `(session: Session) => void` | Writes the session to `localStorage` |
| `clearSession` | `() => void` | Removes the session from `localStorage` |

The hardcoded `ADMIN_USER` (`id: 0`, `username: "admin"`, `role: "admin"`) is checked first inside `findUser` before querying stored users. It is never written to `localStorage` and cannot be deleted.

---

## localStorage Keys

| Key | Written by | Content |
|---|---|---|
| `auth-app.users` | `saveUsers()` | JSON array of `User` objects (regular users only) |
| `auth-app.session` | `saveSession()` | JSON object of the active `Session` |
| `todo-app.todos.<userId>` | `TodoApp` effect | JSON array of `Todo` objects for a specific user |
| `todo-app.theme` | `App` effect | `"light"` or `"dark"` |

---

## Theme Support

`App.tsx` manages a `theme` state variable (`"light"` | `"dark"`). On every change it:

1. Sets `document.documentElement.setAttribute("data-theme", theme)` so CSS can use `[data-theme="dark"]` selectors.
2. Persists the choice to `localStorage` under the key `todo-app.theme`.

On the very first load, the app reads the user's OS preference via `window.matchMedia("(prefers-color-scheme: dark)")` and falls back to `"light"` if the API is unavailable.

The floating toggle button (rendered by `App` on top of every screen) switches between 🌙 (switch to dark) and ☀️ (switch to light).

---

## Known Limitations

- **No real security.** Passwords are stored in plain text in `localStorage`. This is acceptable only for a local demo or prototype.
- **No server or API.** All data lives in the current browser's `localStorage`. Data is not shared between browsers, devices, or private-browsing sessions.
- **Single admin account.** The admin username and password are hardcoded in `src/auth.ts`. To change them, edit the `ADMIN_USER` constant.
- **No password change UI.** Users cannot update their own passwords through the interface.
- **No tests.** There is currently no automated test suite. Behaviour is verified manually.
