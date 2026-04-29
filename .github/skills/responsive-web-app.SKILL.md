---
name: responsive-web-app
description: Use this skill when asked to review, improve, or implement responsive design, CSS layouts, or web accessibility (A11y) in React/TypeScript projects.
---

# Responsive Web App Skill

You are an expert in modern CSS, Responsive Design, and Web Accessibility. When this skill is activated, follow these rigorous standards to ensure components are visually consistent and accessible across all devices.

## Core Directives

### 1. Layout & Component Structure

- **Semantic HTML:** Always prefer `<header>`, `<main>`, `<nav>`, and `<section>` over generic `<div>` tags.
- **Modern Layouts:** Use **CSS Grid** for page-level layouts and **Flexbox** for component-level alignment.
- **Units:** Strictly use relative units (`rem`, `em`, `%`, `vw`, `vh`). Flag any hardcoded `px` values for layout-critical elements as a "Layout Debt."

### 2. The Responsiveness Checklist

When reviewing or writing code, ensure the following breakpoints are addressed:

- **Mobile (320px - 480px):** Single column, stacked elements, touch-friendly targets (min 44x44px).
- **Tablet (768px - 1024px):** Adjusted margins, potential grid-column shifts.
- **Desktop (1024px+):** Full layout with optimized white space.
- **Prevention:** Explicitly check for `overflow-x: hidden` issues or horizontal scrolling on mobile.

### 3. Accessibility (A11y) Standards

- **Form Integrity:** Every input must have a corresponding `<label>` or `aria-label`.
- **Keyboard Navigation:** All interactive elements must have visible `:focus` states.
- **Contrast:** Ensure text-to-background contrast ratios meet WCAG AA standards.
- **Imagery:** Provide descriptive `alt` text for informative images; use `alt=""` for purely decorative ones.

## Workflow Instructions

1. **Analyze:** Use `view` to read the current component and its CSS/Tailwind classes.
2. **Evaluate:** Compare the code against the checklist above.
3. **Propose/Apply:** Use `edit` to refactor the code. When providing fixes, prioritize Tailwind or CSS Module solutions that maintain project consistency.

## Completion Criteria

- Component is fully responsive across all major breakpoints without horizontal overflow.
- Interactive elements are keyboard-navigable and accessible to screen readers.
- Layout logic is fluid (relative units) rather than fixed.

## Example Triggers

- "Review this component for responsiveness."
- "Suggest improvements for mobile layout."
- "Check accessibility of the login form."
