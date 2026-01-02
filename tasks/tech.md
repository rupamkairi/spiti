# Tech Stack

This project utilizes a modern full-stack web development approach, incorporating the following key technologies:

## Frontend

- **React**: A declarative, component-based JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **TypeScript**: A superset of JavaScript that adds static typing, enhancing code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **DaisyUI**: A Tailwind CSS component library for creating beautiful and responsive UI elements.
- **TanStack Router**: A powerful and flexible routing library for React applications.
- **Tiptap**: A headless editor framework for building rich text editors.

## Backend & Database

- **Convex**: A full-stack development platform that provides a real-time backend and database. It handles data storage, real-time updates, and serverless functions.
- **Convex Auth**: Authentication solution for Convex.
- **TypeScript**: Used for defining backend functions and schema, ensuring type safety across the entire application.

## Development Tools

- **ESLint**: A pluggable linter tool for identifying and reporting on patterns found in JavaScript/TypeScript code.
- **Prettier**: An opinionated code formatter that ensures consistent code style.
- **npm-run-all2**: A CLI tool to run multiple npm scripts in parallel or sequentially.

## Project Structure Highlights

The project follows a well-organized structure for both the frontend and backend:

### Frontend (`src/`)

- **`routes/`**: Defines the application's routing structure using TanStack Router, including nested routes and dynamic segments.
  - **`__root.tsx`**: The root layout component.
  - **`auth/`**: Authentication routes (Login).
- **`components/`**: Houses reusable UI components, categorized by their function (e.g., `cards`, `editors`, `ui`).
- **`main.tsx`**: The entry point for the React application, setting up the Router and Convex provider.

### Backend (`convex/`)

- **`auth.config.ts`, `auth.ts`**: Configuration and implementation for authentication.
- **`functions/`**: Contains Convex serverless functions, organized by domain (e.g., `folder.ts`, `item.ts`, `user.ts`).
- **`schema.ts`**: Defines the database schema for Convex.
- **`http.ts`**: Handles HTTP API endpoints.

This project is a small application designed for personal use, focusing on saving and sharing notes, photos, and other memories.
