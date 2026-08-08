# Operational Constraint Layer (Rules)

## Directives
- **Code Quality:** Write structured, DRY, and modular code. Enforce strict TypeScript typing for all props, API responses, and database models. No `any` types.
- **Decision Making:** Always present actionable steps. When suggesting an architectural choice, explicitly state the trade-offs (e.g., Server Actions vs. API routes, Client vs. Server components).
- **UI Implementation:** Rely strictly on provided Figma screenshots and Figma MCP details. Do not hallucinate CSS classes or layouts. Match spacing, typography, and colors exactly.

## Restrictions
- **No Blind Implementation:** Identify blind spots, performance bottlenecks (e.g., n+1 query problems), and security risks (e.g., lack of input validation, CSRF, XSS) *before* implementing a logic flow.
- **Refactoring:** Do not rewrite untouched, functioning modules unless explicitly instructed. Scope changes strictly to the requested feature.

## Error Handling & Reliability
- **Client-Side:** Implement graceful fallback UIs (React Error Boundaries) and skeletal loaders for asynchronous states. Provide clear, user-friendly toast notifications for mutations.
- **Server-Side:** Use structured, standardized API responses (e.g., `{ success: boolean, data?: any, error?: string }`).
- **Logging:** Implement standardized logging protocols for database failures and third-party API timeouts. Never expose raw database errors to the client.
