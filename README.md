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

### 🔐 Auth & User Management (`/api/user`)
| Method | Endpoint | Description | Access Control | Security / Validation |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/user/register` | Register new user account | Public | Joi Validated + Rate Limited (10/15m) |
| **POST** | `/api/user/login` | Authenticate user session | Public | Joi Validated + Rate Limited (10/15m) |
| **POST** | `/api/user/refresh-token` | Issue new access token | Public (Cookie) | Validates HTTP-only Refresh Token |
| **GET** | `/api/user/logout` | Terminate session & clear cookies | Authenticated | Clears Access & Refresh Cookies |
| **GET** | `/api/user/verify` | Verify current session state | Authenticated | JWT Cookie / Header Check |
| **GET** | `/api/user/pending-users` | Fetch users awaiting admin approval | Admins Only | RBAC Check |
| **PUT** | `/api/user/approve-user/:user_id` | Approve user registration | Admins Only | RBAC Check + Email Notification |
| **PUT** | `/api/user/reject-user/:user_id` | Reject user registration | Admins Only | RBAC Check |
| **GET** | `/api/user/investors` | List all verified platform investors | Authenticated | Role Check |
| **GET** | `/api/user/me/stats` | Get user dashboard metrics | Authenticated | User Scoped |
| **PUT** | `/api/user/:id` | Update user profile | Owner / Admin | Joi Validated + Permission Check |

### 🛡️ Admin Operations (`/api/admin`)
| Method | Endpoint | Description | Access Control | Security / Validation |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/admin/register` | Register new admin account | Public | Joi Validated + Rate Limited (10/15m) |
| **POST** | `/api/admin/login` | Authenticate admin | Public | Joi Validated + Rate Limited (10/15m) |
| **POST** | `/api/admin` | Create admin user | Super Admin | Joi Validated |
| **GET** | `/api/admin` | List all system admins | Admin / Super Admin | RBAC Check |

### 💼 Projects & Proposals (`/api/projects`)
| Method | Endpoint | Description | Access Control | Security / Validation |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/projects` | List all published projects | Authenticated | JWT Guarded |
| **POST** | `/api/projects` | Create a new investment project | Entrepreneur | Joi Validated Payload |
| **PUT** | `/api/projects/:project_id` | Update project details | Project Owner | Joi Validated Payload |
| **GET** | `/api/projects/status/under-review` | View pending projects | Admin / Super Admin | Moderation Queue |
| **PUT** | `/api/projects/approve/:project_id` | Approve pending project | Admin / Super Admin | Admin Workflow |
| **POST** | `/api/projects/:project_id/interest` | Express investment interest | Investor | Investor Role Guard |

### 💬 Community & Direct Messaging (`/api/community`, `/api/messages`)
| Method | Endpoint | Description | Access Control | Security / Validation |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/community` | List all active communities | Authenticated | JWT Guarded |
| **POST** | `/api/community` | Create a community | Admin / Super Admin | Joi Validated |
| **GET** | `/api/messages/contacts` | Get user message contacts | Authenticated | User Scoped |
| **GET** | `/api/messages/conversation/:user_id` | Load chat history | Authenticated | DM Security |
| **POST** | `/api/messages` | Send direct message | Authenticated | Joi Validated |

---

## 🧪 Testing & Quality Assurance

To run tests and check code quality across the workspace:

- **Run Server Tests:** `npm run test:server` (Uses Jest and `mongodb-memory-server`)
- **Lint Client:** `npm run lint:client` (Uses Oxlint)
- **Lint Server:** `npm run lint:server` (Uses ESLint)
