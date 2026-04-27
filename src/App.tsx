import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
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
  const [dragId, setDragId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Tracks an in-progress drag so the checkbox onChange guard fires correctly
  // even after dragEnd clears dragId.
  const isDraggingRef = useRef(false);

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
    // Suppress toggle if the mouse-up was the end of a drag operation.
    if (isDraggingRef.current) return;
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

  const reorderTodos = (draggedId: number, targetId: number) => {
    const draggedTodo = todos.find((t) => t.id === draggedId);
    setTodos((current) => {
      const from = current.findIndex((t) => t.id === draggedId);
      const to = current.findIndex((t) => t.id === targetId);
      if (from === -1 || to === -1 || from === to) return current;
      const result = [...current];
      const [item] = result.splice(from, 1);
      result.splice(to, 0, item);
      return result;
    });
    if (draggedTodo) {
      setAnnouncement(`Moved "${draggedTodo.text}" to a new position.`);
    }
  };

  const moveTodo = (id: number, direction: "up" | "down") => {
    const todo = todos.find((t) => t.id === id);
    setTodos((current) => {
      const index = current.findIndex((t) => t.id === id);
      const next = direction === "up" ? index - 1 : index + 1;
      if (next < 0 || next >= current.length) return current;
      const result = [...current];
      const [item] = result.splice(index, 1);
      result.splice(next, 0, item);
      return result;
    });
    if (todo) {
      setAnnouncement(`Moved "${todo.text}" ${direction}.`);
    }
  };

  const handleItemKeyDown = (e: KeyboardEvent<HTMLLIElement>, id: number) => {
    // Keyboard reorder is only meaningful on the unfiltered list.
    if (filter !== "all") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveTodo(id, "up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveTodo(id, "down");
    }
  };

  return (
    <main className="app-shell">
      {/* Live region announces drag/keyboard reorder results to screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
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
            visibleTodos.map((todo, index) => (
              <li
                key={todo.id}
                role="listitem"
                tabIndex={0}
                aria-label={`${todo.text}, item ${index + 1} of ${visibleTodos.length}${todo.completed ? ", completed" : ""}`}
                aria-grabbed={dragId === todo.id ? true : undefined}
                className={[
                  todo.completed ? "is-completed" : "",
                  dragId === todo.id ? "is-dragging" : "",
                  dropTargetId === todo.id && dragId !== todo.id
                    ? "is-drop-target"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable={filter === "all"}
                onDragStart={() => {
                  isDraggingRef.current = true;
                  setDragId(todo.id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setDropTargetId(null);
                  // Delay clearing so any synthetic click fired after dragEnd
                  // is still suppressed in toggleTodo.
                  setTimeout(() => {
                    isDraggingRef.current = false;
                  }, 0);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => {
                  if (dragId !== null && dragId !== todo.id) {
                    setDropTargetId(todo.id);
                  }
                }}
                onDragLeave={(e) => {
                  // Only clear when leaving the <li> itself, not a child element.
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDropTargetId(null);
                  }
                }}
                onDrop={() => {
                  if (dragId !== null) {
                    reorderTodos(dragId, todo.id);
                    setDropTargetId(null);
                  }
                }}
                onKeyDown={(e) => handleItemKeyDown(e, todo.id)}
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
