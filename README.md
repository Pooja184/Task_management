# 🗂️ Task Management System

A full-stack Task Management application that allows users to create, assign, track, and manage tasks with real-time updates.

Built using **React, Node.js, Express, Prisma (MongoDB), JWT authentication, and Socket.io**.

---

## 🚀 Features

### Authentication & Users
- User registration and login
- JWT authentication using **HTTP-only cookies**
- Secure logout
- Update profile (name, email, password with confirmation)
- All users summary with task statistics

### Tasks
- Create, update, and delete tasks
- Assign tasks to users
- Task status management (Todo, InProgress, Review, Completed)
- Task priority management (Low, Medium, High, Urgent)
- Views:
  
  - Profile
  - All Tasks
  - My Tasks (created by user)
  - Assigned To Me
  - Overdue Tasks

### Advanced Features
- Filtering by **Status** and **Priority**
- Sorting by **Due Date**
- Real-time updates using **Socket.io**
- Responsive UI

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Socket.io Client

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- MongoDB
- JWT (JSON Web Tokens)
- Socket.io
- bcryptjs

---

### API Contract (Key Endpoints)
Authentication
  - POST /api/auth/register – Register a new user
  - POST /api/auth/login – Login user
  - POST /api/auth/logout – Logout user
  - GET /api/auth/profile – Get current user profile
  - PUT /api/auth/profile – Update user profile
  - GET /api/users/summary – User task statistics

Tasks

  - POST /api/task/add-task – Create a task
  - GET /api/task/get-tasks – Get all tasks
  - GET /api/task/my-tasks – Tasks created by logged-in user
  - GET /api/task/assigned-to-me – Tasks assigned to logged-in user
  - GET /api/task/overdue – Overdue tasks
  - PATCH /api/task/:taskId/status – Update task status
  - DELETE /api/task/:id – Delete task

---

---
🧱 Architecture Overview & Design Decisions
Database (MongoDB)

Flexible schema for evolving requirements
Prisma MongoDB connector provides type safety
Easy to scale and maintain

Prisma ORM
Strong typing and schema validation
Clean relation handling
_count used for efficient aggregations

JWT Authentication
Stateless and scalable
Stored in secure HTTP-only cookies
Easy to integrate with frontend and backend

Frontend Architecture

Context API for authentication state
Reusable components (TaskCard, Sidebar)
Hooks for Socket and API usage

---

---
Real-Time Functionality (Socket.io)

Socket.io is used to provide live updates across users.
Implemented Events
task-status-updated
task-deleted

---

---
Trade-offs & Assumptions

  - Filtering and sorting are handled on the frontend for simplicity
  - Email verification is not implemented (can be added later)
  - Role-based access control is not included
  - Socket.io is used only where real-time updates add value

---
## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone <(https://github.com/Pooja184/Task_management.git)>
cd task-management

cd backend
npm install

create .env
npx prisma generate
npm run dev

//frontend
cd frontend
npm install
create .env
npm run dev



