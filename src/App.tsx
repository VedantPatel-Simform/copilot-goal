import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todo-app.todos";

const initialTodos: Todo[] = [
  { id: 1, text: "Plan the day", completed: true },
  { id: 2, text: "Build the todo app", completed: false },
];

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "number" &&
    typeof obj.text === "string" &&
    typeof obj.completed === "boolean"
  );
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialTodos;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isTodo)) {
      return parsed;
    }
    // Stored value is malformed; clear it and fall back to defaults.
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore parse/storage errors and fall back to defaults.
  }
  return initialTodos;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (typeof window === "undefined" || !("localStorage" in window)) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Ignore persistence failures so the UI remains usable.
    }
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) {
      return;
    }

    setTodos((currentTodos) => [
      {
        id: Date.now(),
        text: trimmedTodo,
        completed: false,
      },
      ...currentTodos,
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  return (
    <main className="app-shell">
      <section className="todo-app" aria-labelledby="todo-title">
        <header className="todo-header">
          <p className="eyebrow">Minimal todo</p>
          <h1 id="todo-title">Tasks for today</h1>
          <p className="subtitle">
            A simple React + TypeScript todo list with clean, focused controls.
          </p>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="new-todo">
            New todo
          </label>
          <input
            id="new-todo"
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a task"
            autoComplete="off"
          />
          <button type="submit">Add</button>
        </form>

        <div className="todo-meta" aria-live="polite">
          <span>{remainingCount} remaining</span>
          <span>{completedCount} completed</span>
        </div>

        <div className="todo-filters" role="tablist" aria-label="Todo filters">
          {(["all", "active", "completed"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={option === filter ? "is-active" : ""}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <ul className="todo-list" aria-label="Todo items">
          {visibleTodos.length === 0 ? (
            <li className="empty-state">No todos for this filter.</li>
          ) : (
            visibleTodos.map((todo) => (
              <li
                key={todo.id}
                className={todo.completed ? "is-completed" : ""}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button type="button" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="todo-footer">
          <button
            type="button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </footer>
      </section>
    </main>
  );
}

export default App;
