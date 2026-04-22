---
applyTo: "src/components/**/*.tsx"
---

# Frontend Instructions

This scope applies to React component files in the frontend. Keep component code simple, typed, and easy to maintain.

- Use TypeScript in every component file.
- Prefer explicit props, event, and state types when they are not obvious from context.
- Keep components small and focused on one responsibility.
- Use early returns to simplify conditional rendering.
- Avoid unnecessary abstraction, duplicated state, and overuse of effects.
- Derive values from existing state instead of storing redundant state.
- Keep JSX semantic and accessible: use buttons for actions, labels for inputs, and meaningful text for empty states.
- Keep the UI simple and consistent with the existing app.
- Prefer local component state unless shared state is clearly needed.
- Use immutable updates and clear, predictable data flow.
- Add comments only when they clarify non-obvious logic.

For todo-related UI, keep create, edit, toggle, filter, and delete flows straightforward and readable.
