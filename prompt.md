# Restaurant Management System Frontend

This is a **new frontend project** for a Restaurant Management System.

Thoroughly read and understand the `prompt.md` file before starting the implementation.

Treat `prompt.md` as the **primary source of truth** for the product requirements, features, screens, user flows, application structure, and UI expectations.

---

# Objective

Build a **new React frontend application from scratch** based on the requirements in `prompt.md`.

The goal is to create a complete frontend that visually represents the full **Restaurant Management System administration experience** described in `prompt.md`.

**This task is strictly focused on frontend UI/UX implementation.**

The implementation should focus on creating a polished, cohesive, production-quality restaurant management interface using static/mock data where necessary.

---

# Restaurant Management System Structure

This application is a **Restaurant Management System** designed for business owners who may operate one or multiple restaurants under a single business.

A business owner should be able to:

* Register and manage their business.
* Add and manage multiple restaurants under that business.
* Switch between restaurants and manage each restaurant independently.

Each restaurant has its own restaurant-specific data and configuration, including:

* Cuisines
* Menus
* Menu categories
* Menu items
* Tables
* Restaurant settings
* Opening hours
* Orders
* Employees

The UI should clearly reflect this ownership hierarchy:

```text
Business
└── Restaurants
    ├── Restaurant A
    │   ├── Cuisines
    │   ├── Menus
    │   ├── Categories
    │   ├── Menu Items
    │   └── Tables
    └── Restaurant B
        ├── Cuisines
        ├── Menus
        ├── Categories
        ├── Menu Items
        └── Tables
```

### Restaurant Table QR Codes

Each restaurant can contain multiple tables. Every table must have its own **unique QR code associated with both the restaurant and that specific table**.

For example:

```text
Downtown Branch
├── Table 01 → Unique QR Code
├── Table 02 → Unique QR Code
├── Table 03 → Unique QR Code
└── VIP 01   → Unique QR Code
```

When a customer scans a table QR code, the system should be able to identify:

* The restaurant the customer is visiting.
* The specific table from which the QR code was scanned.

The customer can then view that restaurant's menu and place an order associated with the identified table.

For this task, only the **management-side UI and mock interactions** for QR generation, display, regeneration, downloading, and printing need to be represented. Customer-facing ordering functionality will be implemented separately.

---

# 1. Create a New Project

Create this application as a **new React project from scratch**.

Before implementation:

* Thoroughly read `prompt.md`
* Understand the required product structure and user flows
* Plan the application navigation and routing
* Define a reusable layout and component structure
* Define consistent design tokens, typography, spacing, and visual patterns
* Organize the project for maintainability and scalability

Do not assume that any previous UI, layout, component, styling system, or project structure already exists.

Create all required screens, layouts, components, forms, dialogs, tables, cards, navigation, and interactions needed to represent the product described in this prompt.

---

# 2. Implement the Product Requirements

Use the requirements in `prompt.md` to determine what needs to be created for the application.

The goal is to make the UI fully represent the product described in `prompt.md`, including the business-level and restaurant-level management workflows.

Create a consistent design language across the entire application and ensure all screens feel like parts of the same production-quality SaaS product.

---

# 3. UI-Only Implementation

This task is about **visual and interactive frontend implementation only**.

Use static/mock data directly in the UI wherever data is required to demonstrate the screens.

The purpose is to make the application **look and behave like a complete restaurant management product from the user's perspective**, without implementing the underlying backend.

---

# 4. Technology Requirements

Build the project using:

* React
* TypeScript
* Vite
* Mantine UI
* React Hook Form
* Zod
* Zustand
* TanStack Query
* React Router

Use the **latest stable versions** of the selected libraries and tools available at the time of implementation.

### React Requirements

* Use **React + TypeScript** as the frontend foundation.
* Use **Vite** as the development and build tool.
* Use **Mantine UI** as the primary UI component library and design system.
* Use Mantine's built-in layout components, responsive props, theme system, Styles API, and component customization capabilities for styling and responsive design.
* Use **CSS Modules or plain CSS only where custom styling is needed beyond Mantine's built-in capabilities**.
* Configure a centralized Mantine theme for colors, typography, spacing, border radii, shadows, breakpoints, and reusable component defaults so the product has a consistent visual identity.
* Use Mantine utilities such as notifications, modals, drawers, tooltips, menus, badges, tables, inputs, and layout primitives where appropriate instead of recreating common UI patterns from scratch.
* Use **React Hook Form** for form state and form handling.
* Use **Zod** for reusable schemas, validation rules, and type-safe form validation.
* Integrate React Hook Form and Zod using the appropriate resolver pattern.
* Integrate Mantine inputs with React Hook Form using direct registration where supported and `Controller` where a controlled component requires it.
* Use **Zustand** for shared client-side/application state that genuinely needs to exist outside individual components.
* Use **TanStack Query** for API/server state, including fetching, caching, synchronization, loading states, mutations, invalidation, and error handling.
* Use **React Router** for application navigation, nested layouts, and feature routing.
* Prefer function components and React hooks.
* Keep local UI state local when it does not need to be shared globally.
* Do not duplicate API/server state inside Zustand when TanStack Query is responsible for that data.
* Use static/mock data where data is required to demonstrate the UI during this frontend-only phase.
* Follow modern React and TypeScript best practices.

Keep the implementation focused strictly on frontend UI/UX.

---

# 5. Clean Architecture and Maintainable Folder Structure

The React project must follow a **clean, scalable, feature-based architecture** with a clear separation of responsibilities. The codebase should be easy to understand, extend, test, and maintain as the Restaurant Management System grows.

Do not place unrelated components, hooks, schemas, stores, API logic, models, and utilities into large global folders. Prefer **feature ownership** so that restaurant, menu, order, employee, table, analytics, and settings functionality remain isolated and easy to evolve independently.

Use a structure similar to the following:

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   ├── query-client/
│   └── config/
│
├── components/
│   └── shared/          # genuinely reusable application components
│
├── theme/
│   ├── theme.ts         # Mantine theme configuration
│   └── component-defaults.ts
│
├── layouts/
│   ├── admin-layout/
│   ├── kitchen-layout/
│   └── auth-layout/
│
├── features/
│   ├── dashboard/
│   ├── restaurants/
│   ├── menu/
│   ├── tables/
│   ├── orders/
│   ├── kitchen/
│   ├── employees/
│   ├── analytics/
│   └── settings/
│
├── hooks/
├── lib/
├── stores/
├── types/
├── mocks/
├── assets/
├── App.tsx
└── main.tsx
```

Each feature should own the code that belongs to that feature. A feature may use a structure such as:

```text
features/restaurants/
├── pages/
├── components/
├── api/
├── hooks/
├── schemas/
├── stores/
├── types/
├── utils/
└── routes.tsx
```

### Architecture Rules

* Organize the application primarily by **business feature/domain**, not only by technical file type.
* Keep feature-specific components, types, schemas, API functions, hooks, mock data, state, and utilities inside their feature.
* Keep truly application-wide providers, router configuration, query configuration, and global app configuration inside `app/`.
* Keep Mantine theme configuration and product-wide design tokens centralized in `theme/`.
* Use Mantine components directly for common UI primitives instead of maintaining a separate copied UI-component library.
* Keep Mantine theme configuration centralized so colors, typography, spacing, radii, shadows, breakpoints, and component defaults stay consistent across the application.
* Create shared wrappers around Mantine components only when they add meaningful application-wide behavior or consistent product-specific defaults; avoid unnecessary wrapper components.
* Use `components/shared/` only for genuinely reusable application-level components used by multiple features.
* Keep application shell/layout concerns separate from business features.
* Use React function components and hooks.
* Use route-based code splitting/lazy loading for major features where appropriate.
* Keep page components responsible for orchestration and reusable presentational components focused on UI.
* Keep components small and focused on a single responsibility.
* Avoid tightly coupling one feature directly to another feature's internal implementation.
* Avoid circular dependencies.
* Use strongly typed TypeScript interfaces/types instead of untyped objects.
* Keep validation schemas close to the feature that owns them.
* Use **React Hook Form + Zod** for forms instead of hand-written form state and duplicated validation logic.
* Use **TanStack Query** for remote/server state and API synchronization.
* Keep query keys, query functions, and mutation functions organized consistently within feature API layers.
* Use **Zustand** only for shared client-side state such as selected restaurant context, UI preferences, or cross-page workflow state where local component state is insufficient.
* Do not mirror TanStack Query server data into Zustand unless there is a clear architectural reason.
* Keep local component state local when possible.
* Keep mock data separate from presentation components so it can later be replaced by real API data with minimal UI changes.
* Define clear API/data-access boundaries even when mock implementations are used during this UI-only phase.
* Keep routing definitions close to their respective features where practical while maintaining a clear top-level router configuration.
* Keep naming conventions consistent across files, folders, components, hooks, stores, schemas, types, API functions, and routes.
* Do not create unnecessary abstractions, generic base components, or wrapper layers unless they provide clear reuse and maintainability benefits.

The architecture should make it straightforward to replace mock data with backend APIs later without requiring major changes to the UI components.

---

# 6. Restaurant Management UI

The UI should cover the restaurant management experience described in `prompt.md`.

Include appropriate screens for:

### Dashboard

* Business overview
* Restaurant overview
* Revenue
* Orders
* Restaurant performance
* Popular menu items
* Sales trends
* Recent activity

### Restaurants

* Restaurant list
* Restaurant details
* Create restaurant
* Edit restaurant
* Restaurant settings
* Opening hours

### Menu

* Categories
* Cuisines
* Menu items
* Create menu item
* Edit menu item
* Item details
* Availability
* Add-ons/customizations

### Tables

* Table list
* Table creation
* Table editing
* Table status
* QR code display
* QR code regeneration
* QR code download/print

### Orders

* Order list
* Order details
* Live orders
* Order status
* Order history
* Kitchen order queue

### Employees

* Employee list
* Employee details
* Add employee
* Edit employee
* Roles
* Permissions

### Analytics

* Revenue
* Order volume
* Popular items
* Sales trends
* Restaurant comparison

### Settings

* Restaurant information
* Contact information
* Opening hours
* General settings
* Ordering settings
* QR ordering settings

---

# 7. Restaurant Switcher

The UI should support multiple restaurants under a single business.

Provide a clear restaurant selector, for example:

```text
ABC Restaurant Group

[ Downtown Branch ▾ ]
```

The selected restaurant should be visually obvious.

When the user switches restaurants, the displayed UI should visually update to represent the selected restaurant.

This only needs to be demonstrated through frontend/mock state.

---

# 8. Kitchen UI

Create a kitchen-focused interface for staff.

The UI should prioritize speed and readability.

Display:

* Order number
* Table
* Ordered items
* Quantities
* Special instructions
* Time elapsed
* Order status

Provide visual actions such as:

* Start Preparing
* Mark Ready
* View Order

Use clear status indicators and visual hierarchy for active orders.

---

# 9. Forms

Where forms are required, use:

**React Hook Form + Zod + Mantine UI**

Examples:

* Restaurant form
* Menu category form
* Cuisine form
* Menu item form
* Table form
* Employee form
* Restaurant settings form

Forms should visually demonstrate:

* Validation
* Error states
* Required fields
* Disabled states
* Loading states
* Success feedback

The underlying persistence logic is not required.

---

# 10. UI/UX Quality

The final UI should look like a polished, production-quality **restaurant management SaaS platform** with a **modern, simple, and elegant visual experience**.

The interface should be designed primarily for **business users**, including restaurant owners, managers, and staff. It must be easy to understand and navigate without requiring technical knowledge or unnecessary training.

The design should favor **clarity, simplicity, and usability over visual complexity**. Avoid cluttered screens, excessive decoration, unnecessary animations, and confusing navigation patterns.

### UI/UX Design Principles

* Use a clean, modern, and elegant visual style.
* Keep screens simple and focused on the user's primary task.
* Make important actions immediately visible and easy to understand.
* Use clear page titles, section headings, labels, helper text, and action names.
* Maintain a predictable navigation structure throughout the application.
* Keep common business workflows accessible with as few steps as reasonably possible.
* Use familiar interaction patterns so business users can quickly understand how the system works.
* Clearly distinguish primary, secondary, destructive, and disabled actions.
* Use progressive disclosure for advanced settings instead of showing too many options at once.
* Avoid overwhelming users with unnecessary information.
* Use whitespace effectively to separate content and improve readability.
* Use consistent spacing, typography, icons, button styles, cards, tables, forms, and status indicators.
* Use meaningful icons together with labels where an icon alone may be unclear.
* Provide clear feedback after user actions through loading indicators, success messages, errors, confirmations, and toast notifications.
* Use confirmation dialogs for destructive or important actions.
* Design useful empty states that explain what the user can do next.
* Keep forms logically grouped and easy to scan.
* Clearly indicate required fields, validation errors, disabled states, and loading states.
* Make search, filtering, sorting, pagination, and common table actions easy to discover.
* Use readable status badges and visual indicators for orders, tables, menu availability, employees, and restaurants.
* Make the currently selected business/restaurant context obvious throughout restaurant-specific screens.
* Maintain accessibility through sufficient contrast, keyboard-friendly interactions, clear focus states, and understandable labels.
* Use Mantine components and accessibility behaviors consistently, while customizing the theme so the product does not look like an unmodified default component library.

Prioritize:

* Modern visual design
* Simple and elegant interfaces
* Easy-to-understand business workflows
* Intuitive navigation
* Consistent spacing
* Strong visual hierarchy
* Clean typography
* Consistent component usage
* Responsive layouts
* Accessible interactions
* Professional dashboard design
* Clear empty states
* Loading states
* Error states
* Confirmation dialogs
* Toast notifications
* Search and filtering
* Pagination
* Status badges
* Responsive tables

Use **Mantine UI** as the foundation for the design system. Build a customized Mantine theme and use its component APIs, responsive layout system, style props, Styles API, and composable primitives to create a cohesive product rather than relying on default component appearances. Keep the visual system modern, lightweight, professional, and appropriate for a restaurant-management business product.

Prefer Mantine components such as `AppShell`, `NavLink`, `Card`, `Paper`, `Stack`, `Group`, `Grid`, `SimpleGrid`, `Table`, `Tabs`, `Modal`, `Drawer`, `Menu`, `Badge`, `Button`, `ActionIcon`, `Select`, `TextInput`, `NumberInput`, `Textarea`, `Switch`, `SegmentedControl`, `Tooltip`, and notifications where appropriate. Do not force a component into the UI when a simpler Mantine primitive provides a clearer experience.

Use **CSS Modules or plain CSS sparingly** for complex product-specific styling that cannot be expressed cleanly through Mantine's theme, component props, style props, or Styles API.

---

# 11. Responsive Design

The management interface should work well on:

* Desktop
* Laptop
* Tablet

Ensure that:

* Tables remain usable on smaller screens
* Navigation adapts appropriately
* Dialogs work on mobile
* Forms remain accessible
* Cards resize correctly
* Dashboard layouts adapt to different screen sizes
* Management workflows remain easy to use on smaller screens

---

# 12. Mock Data

Use realistic static/mock data wherever required to make the UI feel complete.

For example:

```text
Restaurants
- Downtown Branch
- Colombo City Branch
- Negombo Branch

Orders
- #1024
- #1025
- #1026

Tables
- Table 01
- Table 02
- Table 03
- VIP 01

Menu Categories
- Starters
- Main Course
- Burgers
- Pizza
- Desserts
- Beverages
```

Mock data should only exist to demonstrate the UI.

---

# 13. Important Constraints

**This is a UI/UX implementation task only.**

Do:

* Read `prompt.md` thoroughly
* Use the latest stable React version
* Use TypeScript
* Use Vite
* Use Mantine UI as the primary UI component library and design system
* Use Mantine's theme, responsive props, layout primitives, style props, and Styles API for styling and responsive layouts
* Use CSS Modules or plain CSS only when custom styling is genuinely needed beyond Mantine
* Use React Hook Form for form management
* Use Zod for schemas and validation
* Use Zustand for shared client-side state where appropriate
* Use TanStack Query for API/server state and asynchronous data workflows
* Use React Router for application navigation
* Use realistic mock data
* Create all required screens
* Make the UI responsive
* Maintain visual consistency
* Follow modern React and TypeScript best practices
* Follow the clean, feature-based architecture defined in this prompt
* Keep the folder structure scalable and maintainable
* Keep API/server state and client UI state clearly separated
* Keep business-specific logic out of shared UI primitives

---

**Read `prompt.md` first, understand the product requirements and system structure, and then build the new frontend application from scratch.**

The priority is a **polished, cohesive, production-quality React frontend** that feels like a complete modern restaurant management SaaS platform.

Focus on the **restaurant/business management experience for now**. Customer-facing ordering and customer menu functionality will be implemented separately at a later stage.
