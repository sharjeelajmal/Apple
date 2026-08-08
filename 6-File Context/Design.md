# Design System & Constraints

## Design System
- **Paradigm:** Utility-first via Tailwind CSS. Custom CSS should be avoided unless dealing with complex animations not suited for Tailwind.
- **Aesthetic Target:** Apple website UI (Minimalist, high contrast, precise typography, ample whitespace).

## Styling Directives
- **Primary Palette:** `#0f172a` (Slate) for dark mode/contrasts, `#ffffff` for primary backgrounds. Use standardized Tailwind color scales.
- **Typography:** Ensure pixel-perfect font sizing, line-heights, and tracking as defined in the Figma MCP. Fallback to `Inter` or standard sans-serif stacks if custom fonts are pending.
- **Animations:** Use Framer Motion or pure CSS for smooth, subtle transitions (e.g., header blur effects, cart drawer slides). Avoid jarring or overly aggressive animations.

## Components
- Must be strictly modular.
- Must be accessible (ARIA compliant): Include `aria-labels`, `role` attributes, and ensure keyboard navigability for interactive elements like modals and drop-downs.
- UI components should follow modern workflows (consider integrating Radix UI primitives or shadcn/ui for accessible, unstyled foundation if applicable).
