# Technical Architecture

## Technology Standard
- **Frontend Client:** Next.js (App Router), React, Tailwind CSS. Focus on Server Components (RSC) for performance, Client Components only where interactivity is required.
- **Database / Backend:** MongoDB (with Mongoose or Prisma ORM), Next.js API Routes (or Server Actions for mutations).
- **Authentication:** NextAuth.js (Session-based or JWT depending on scaling needs).
- **Infrastructure:** Vercel (Hosting, Edge Functions), MongoDB Atlas (Database), AWS S3/Uploadthing (Media Storage).

## Directory Structure (Strict Adherence Required)
```text
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── (storefront)/   # Public-facing e-commerce routes
│   │   ├── (admin)/        # Protected admin panel routes
│   │   └── api/            # RESTful API endpoints
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Atomic design elements (Buttons, Inputs - e.g., shadcn/ui)
│   │   ├── layout/         # Header, Footer, Sidebar
│   │   └── features/       # Complex, domain-specific components (e.g., CartDrawer)
│   ├── lib/                # Utility functions, database connection, constants
│   ├── models/             # MongoDB Schemas/Prisma schema
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Global state management (Zustand/Context)
│   └── types/              # TypeScript interfaces and type definitions
```
