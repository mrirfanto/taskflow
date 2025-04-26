# TaskFlow - Task Management Dashboard

## 🧾 Project Brief

> Hello! I'm the founder of a growing SaaS startup, and I’m looking to build a modern **Task Management Dashboard** called **TaskFlow**.  
> TaskFlow is a productivity tool designed to help teams manage tasks efficiently using a dashboard, kanban board, and calendar views.  
> We’ll be using **Supabase with PostgreSQL** as the backend platform — handling authentication, data storage, and real-time features. The frontend should be clean, responsive, and interactive, resembling high-quality SaaS products like Linear, Notion, or Trello.
> This project will be an excellent showcase of your ability to build full-stack, production-grade applications using modern tools and best practices.

---

## 🧱 Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form + Zod** – for form handling and validation
- **@dnd-kit/core** – drag & drop support for Kanban
- **Supabase + PostgreSQL** – full backend stack (auth, data, storage)
- **Lucide Icons**

---

## 📄 Pages & Features

| Page         | Description                                     |
| ------------ | ----------------------------------------------- |
| `/login`     | Auth form with Supabase integration             |
| `/register`  | Signup with email and password                  |
| `/dashboard` | Stats cards, recent activity, task trends chart |
| `/kanban`    | Board with task columns and draggable cards     |
| `/calendar`  | Monthly calendar view of tasks and events       |
| `/profile`   | User profile form with update capability        |
| `404`        | Custom not-found page                           |

## ✅ Todo / Checkpoints

### Phase 1: Setup & Boilerplate

- [x] Initialize project with Next.js 14 and TypeScript
- [x] Install and configure Tailwind, shadcn/ui, Lucide
- [x] Set up global layout
- [x] Create feature-based folder structure
- [x] Create UI for `/login` and `/register` pages
- [x] Setup react-hook-form
