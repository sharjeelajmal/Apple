# Implementation Phases

*Note: Do not proceed to the next phase until the current phase is fully verified and marked complete in Memory.md.*

## Phase 1: Core Setup
- Initialize Next.js repository with TypeScript and Tailwind CSS.
- Configure absolute imports (`@/*`), ESLint, and Prettier rules.
- Establish robust MongoDB connection utility.
- Setup environment variable validation.

## Phase 2: Authentication & Admin Foundation
- Implement NextAuth.js with Credentials and OAuth providers.
- Develop Role-Based Access Control (RBAC) middleware to protect `/admin` routes.
- Build the core scaffolding for the Admin Panel (Sidebar, Layout, basic Dashboard view).
- Define base MongoDB schemas (User, Product, Order).

## Phase 3: Application UI (E-commerce Flow)
- *Triggered via Figma MCP inputs:* Build the exact 1:1 Apple-style Header.
- Develop Product Listing and Product Detail pages with optimized image handling (`next/image`).
- Implement global Cart state (Zustand or Context API).
- Build the Checkout UI (excluding payment gateway integration).

## Phase 4: Integration & Deployment Scripting
- Integrate Payment Gateway (e.g., Stripe) with webhook handling.
- Finalize Admin Panel data mutations (Inventory sync).
- Setup automated CI/CD pipelines via Vercel.
- Conduct Lighthouse performance audits and optimize LCP/CLS metrics.
