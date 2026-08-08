# Product Requirements Document (PRD)

## What to Build
A premium, high-fidelity e-commerce web application designed with a 1:1 UI/UX adherence to Apple's website aesthetic, combined with a comprehensive, secure Admin Panel for backend store management. The system will initially mirror the target UI exactly, with modular architecture allowing for seamless visual modifications later. 

## Targeted Users
1. **End Consumers:** Users expecting a highly responsive, visually rich, and frictionless shopping and checkout experience.
2. **Store Administrators:** Internal users requiring a high-density, data-rich dashboard to manage inventory, track orders, and monitor system health.

## Features
### Client-Facing Application
- **Figma-Synchronized UI:** 1:1 implementation of the provided Figma designs (starting with the Header), utilizing Figma MCP context.
- **Product Showcase:** High-performance image loading, smooth scroll animations, and interactive product variants.
- **Cart & Checkout Flow:** Persistent cart state, guest vs. authenticated checkout, and secure payment gateway integration.
- **User Accounts:** Order history, profile management, and saved payment/shipping details.

### Admin Panel
- **Authentication & RBAC:** Secure, role-based access control (Admin vs. Manager vs. User).
- **Inventory Management:** CRUD operations for products, variants, pricing, and stock levels.
- **Order Processing:** Real-time order tracking, status updates (Pending, Shipped, Delivered), and transaction logs.
- **Analytics Dashboard:** Revenue overviews, top-selling items, and user activity metrics.
