# Copilot Instructions

This repository is a small React + TypeScript todo app. Keep changes simple, typed, and easy to follow.

- Always use TypeScript.
- Use proper TypeScript types for props, state, event handlers, and returned values when they are not obvious from context.
- Avoid `any`, unsafe type assertions, and non-null assertions unless there is no reasonable alternative.
- Prefer small, focused components and functions.
- Use early returns whenever they make control flow clearer.
- Avoid anti-patterns such as duplicated state, unnecessary effects, prop drilling when a local solution is enough, and over-abstraction.
- Keep the UI simple, clean, and responsive.
- Favor semantic HTML and accessible interactions, including labels, buttons, keyboard support, and meaningful empty states.
- Keep styling restrained and consistent with the existing app. Do not add unnecessary visual complexity.
- Prefer immutable updates and clear derived state instead of mutating data in place.
- Use React best practices for a small app: local state first, minimal hooks, and no extra dependencies unless they solve a real problem.
- Match the existing code style and keep diffs focused on the task.

For todo-list features specifically:

- Model todos with an explicit type or interface.
- Keep create, toggle, filter, and delete logic straightforward.
- Keep form inputs controlled.
- Preserve source-of-truth state and compute filtered or derived views from it.
- Handle empty, loading, and error states simply if they exist.

When in doubt, choose the smallest change that is correct, readable, and easy to maintain.