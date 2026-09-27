# Senior-Level Next.js Architecture & Design System

Refactor the project like a **senior-level production Next.js developer**.

Do not change the existing UI, content, functionality, or responsive behavior. Improve only the architecture, maintainability, reusability, and code quality.

## 1. Project Structure

Keep a clean, scalable structure similar to:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── [routes]/
│
├── components/
│   ├── ui/              # Generic reusable UI
│   ├── layout/          # Header, Footer, Navigation
│   ├── shared/          # Reusable business/UI sections
│   └── pages/           # Page-specific components
│       └── PageName/
│           ├── Hero/
│           │   └── Hero.tsx
│           ├── Features/
│           │   └── Features.tsx
│           └── PageName.tsx
│
├── lib/                 # Utilities, helpers, integrations
├── hooks/               # Reusable custom hooks
├── types/               # Shared TypeScript types
├── constants/           # Static constants/config
├── data/                # Static/mock page data
└── styles/              # Additional global styling if required
```

Use the structure only where it adds value. Do not create unnecessary folders.

---

## 2. Component Architecture

Every meaningful section should be a separate component.

Use:

```text
Page
 ├── Section
 │    ├── Sub-component
 │    └── Reusable UI
 └── Section
```

Extract reusable components when they are genuinely reusable.

Examples:

```text
Button
Container
Section
Heading
Card
Badge
Input
Modal
Header
Footer
```

Avoid creating components for trivial one-line elements without a real reuse or responsibility benefit.

---

## 3. Global CSS / Design Tokens

First inspect `globals.css` and existing theme files.

Reuse existing tokens.

Only create missing tokens.

Global CSS should contain the project's semantic design tokens:

```css
:root {
  /* Colors */
  --color-background: ...;
  --color-foreground: ...;
  --color-primary: ...;
  --color-primary-hover: ...;
  --color-secondary: ...;
  --color-muted: ...;
  --color-border: ...;

  /* Typography */
  --font-sans: ...;
  --font-heading: ...;

  /* Radius */
  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  /* Shadows */
  --shadow-sm: ...;
  --shadow-md: ...;
  --shadow-lg: ...;

  /* Spacing */
  --spacing-section: ...;
  --spacing-container: ...;
}
```

Do not duplicate tokens that already exist.

---

## 4. Typography

Typography must be centralized.

Control globally:

- font family
- font size
- font weight
- line height
- letter spacing
- text colors

Use semantic typography utilities/classes instead of repeating raw values throughout components.

---

## 5. Colors & Visual Styling

No unnecessary hardcoded colors inside components.

Avoid:

```tsx
style={{ color: "#fff" }}
```

and avoid repeatedly writing raw colors in CSS.

Use semantic global variables/classes.

The same rule applies to:

- backgrounds
- borders
- shadows
- gradients
- hover states
- focus states
- active states

---

# 6. tailwind.config.ts

If the project uses Tailwind, keep `tailwind.config.ts` clean and intentional.

It should primarily define the connection between Tailwind utilities and the project's design tokens.

Include only things that genuinely belong in Tailwind configuration:

### Content paths

Ensure Tailwind scans all relevant source files:

```ts
content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
```

### Theme tokens

Map Tailwind utilities to CSS variables:

```ts
theme: {
  extend: {
    colors: {
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      primary: {
        DEFAULT: "var(--color-primary)",
        hover: "var(--color-primary-hover)",
      },
      border: "var(--color-border)",
      muted: "var(--color-muted)",
    },

    fontFamily: {
      sans: ["var(--font-sans)"],
      heading: ["var(--font-heading)"],
    },

    borderRadius: {
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
    },

    boxShadow: {
      sm: "var(--shadow-sm)",
      md: "var(--shadow-md)",
      lg: "var(--shadow-lg)",
    },
  },
}
```

Do not put large amounts of raw design values directly into `tailwind.config.ts` if they should be globally themeable.

Do not create duplicate Tailwind values when CSS variables already represent the design token.

If the project uses **Tailwind v4**, first inspect the existing setup because Tailwind v4 commonly uses CSS-first configuration and may not require a traditional `tailwind.config.ts`.

---

# 7. Next.js Best Practices

Follow modern Next.js architecture:

- Use Server Components by default.
- Add `"use client"` only when client-side functionality is required.
- Keep business logic out of UI components.
- Keep reusable logic in `lib/` or custom hooks.
- Keep shared types in `types/`.
- Keep static configuration/constants outside components.
- Use proper `next/image` for images.
- Use `next/link` for internal navigation.
- Avoid unnecessary client-side state.
- Avoid unnecessary `useEffect`.
- Avoid prop drilling where better composition is possible.
- Keep page files small and focused.

---

# 8. TypeScript

Write production-quality TypeScript.

Avoid:

```ts
any;
```

unless there is a legitimate unavoidable reason.

Prefer:

```ts
type
interface
generics
discriminated unions
```

Use explicit types for component props and shared data.

---

# 9. Styling Rules

Components should primarily contain:

```text
Structure
Content
Logic
Composition
Reusable class names
```

Design decisions should come from:

```text
Global CSS
Design tokens
Tailwind utilities
Reusable UI components
```

Do not scatter design values throughout the project.

---

# 10. Final Quality Check

Before finishing, verify:

- UI remains visually identical.
- No unnecessary inline styling.
- No unnecessary hardcoded colors.
- Typography is centralized.
- Design tokens are reusable.
- Tailwind configuration is clean.
- No duplicate tokens.
- Components are properly separated.
- Reusable components are actually reusable.
- Pages remain easy to extend.
- TypeScript is clean.
- Responsive behavior is preserved.
- Server/Client boundaries are correct.
- No unnecessary dependencies or abstractions were introduced.

**Think like a senior engineer building a codebase that another developer will maintain for years—not like someone simply cleaning up CSS.**
