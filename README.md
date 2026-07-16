# 🚀 Innovest - Full-Stack Investment & Collaboration Platform

Innovest is a secure, modular, and real-time platform designed to connect **Entrepreneurs** and **Investors**. It streamlines the investment lifecycle—from project creation and proposal drafting to community collaboration and real-time chat—while leaving transactions and payments out of the initial negotiation phase to ensure compliance and simplicity.

---

## 📋 Table of Contents
1. [✨ Key Features](#-key-features)
2. [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
3. [📐 Architecture Overview](#-architecture-overview)
4. [📂 Directory Layout](#-directory-layout)
5. [⚙️ Environment Configuration](#%EF%B8%8F-environment-configuration)
6. [🚀 Getting Started](#-getting-started)
7. [🔗 Key API Reference](#-key-api-reference)
8. [🧪 Testing & Quality Assurance](#-testing--quality-assurance)

---

## ✨ Key Features

### 👤 Role-Based Access Control (RBAC)
- Dedicated views and capabilities for **Super Admin**, **Admin**, **Entrepreneur**, and **Investor**.
- Secure middleware checks protecting route endpoints and sockets.

### 💡 Project & Proposal Lifecycle
- **Entrepreneurs** can list projects, define budgets, categories, and business goals.
- **Investors** can browse projects, submit expressions of interest (EOI), and send investment proposals.
- Automated moderation pipeline: admins approve/reject projects and proposals before they are made public.

### 👥 Communities & Collaboration Hub
- Discussion groups, forums, and pages filtered by tags or fields.
- Admin-gated approval system for community membership and pending posts.
- Threaded comments and real-time likes/dislikes on community pages.

### 💬 Real-Time Chat & Communications
- Direct messaging (DMs) between entrepreneurs, investors, and admins.
- Dynamic online/offline statuses and real-time typing indicators.
- Instant, persistent notification system powered by **Socket.IO**.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework:** React 19, Vite 8
- **Routing:** React Router Dom v7
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **API Client:** Axios
- **Real-Time:** Socket.IO Client

### Server (Backend)
- **Runtime & Framework:** Node.js, Express
- **Database:** MongoDB, Mongoose ORM
- **Real-Time:** Socket.IO
- **Security:** JSON Web Tokens (JWT), Bcrypt (password hashing), Helmet, Cookie-Parser
- **Validation:** Joi (strict payload validation)
- **Testing:** Jest, MongoDB Memory Server

---

## 📐 Architecture Overview

Innovest uses a clean, decoupled client-server architecture:

```
                  ┌──────────────────────┐
                  │   React Client App   │
                  └──────────┬───────────┘
                             │
            HTTP Rest APIs   │   Socket.IO Sockets
            & JWT Cookies    │   (Real-Time Events)
                             ▼
                  ┌──────────────────────┐
                  │ Express Node Server  │
                  └──────────┬───────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Middlewares  │      │ Controllers  │      │  Services    │
│ (Auth & RBAC)│      │ (HTTP Hooks) │      │ (Biz Logic)  │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │ DAOs / Models│
                                            └──────┬───────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │ MongoDB Atlas│
                                            └──────────────┘
```

---

## 📂 Directory Layout

```bash
Innovest/
├── client/                     # Frontend React SPA
│   ├── src/
│   │   ├── config/             # Connection configurations (API endpoints)
│   │   ├── features/           # Feature-based folders (events, community, messaging)
│   │   └── pages/              # Page layouts (landing, dashboard, explore, messaging)
│   ├── vite.config.js          # Vite build & plugin configuration
│   └── package.json
├── server/                     # Backend Node.js REST & WS server
│   ├── config/                 # DB and socket configuration
│   ├── controllers/            # Route controllers
│   ├── db/                     # Mongoose schemas & Joi validation schemas
│   ├── middlewares/            # RBAC and JWT validation middlewares
│   ├── routes/                 # Express route entry points
│   ├── tests/                  # Jest integration & unit test suite
│   ├── app.js                  # Main server entrypoint
│   └── package.json
├── package.json                # Root monorepo scripts runner
└── README.md                   # Main documentation
```

---

## ⚙️ Environment Configuration

### Backend Setup
Create a `server/.env` file with the following variables (refer to `server/.env.example`):
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/Innovest
JWT_SECRET_KEY=your_super_secret_jwt_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
```

### Frontend Setup
Vite automatically loads environment variables starting with `VITE_`. If you need to override the default backend URL (`http://localhost:8000`), create a `client/.env` file:
```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Getting Started

Follow these steps to run the complete workspace locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or a MongoDB Atlas URI)

### 1. Installation
In the root directory, run the installer script to download all dependencies for the root, frontend, and backend:
```bash
npm run install-all
```

### 2. Run in Development Mode
To boot up both the **React frontend** and **Express backend** concurrently using a single terminal command:
```bash
npm run dev
```
- **Frontend** runs at: `http://localhost:5173`
- **Backend API** runs at: `http://localhost:8000`

---

## 🔗 Key API Reference

| Method | Endpoint | Description | Access Control |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/register` | User/Admin Registration | Public |
| **POST** | `/api/login` | User/Admin Authentication | Public |
| **GET** | `/api/pending-users` | Users awaiting registration | Admins Only |
| **POST** | `/api/community` | Create a new community group | Admins Only |
| **POST** | `/api/community/:id/join`| Join a community | Approved Members |
| **POST** | `/api/events` | Create platform-wide alert event | Super Admin / Admin |
| **POST** | `/api/comment/:id` | Add comments on posts | Registered Users |

---

## 🧪 Testing & Quality Assurance

To run tests and check code quality across the workspace:

- **Run Server Tests:** `npm run test:server` (Uses Jest and `mongodb-memory-server`)
- **Lint Client:** `npm run lint:client` (Uses Oxlint)
- **Lint Server:** `npm run lint:server` (Uses ESLint)
