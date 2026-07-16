# 🚀 Innovest Backend Server

Welcome to the backend server for **Innovest**—a secure, modular, and real-time platform connecting entrepreneurs and investors. Innovest simplifies the investment process by managing project creation, investment proposals, expressions of interest, community pages, communications, and progress tracking, completely eliminating payment processing overhead from the initial negotiation phases.

---

## 📋 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Project Structure](#-project-structure)
5. [Environment Variables](#-environment-variables)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Database & Validation System](#-database--validation-system)
8. [Getting Started](#-getting-started)
9. [Scripts & Testing](#-scripts--testing)

---

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Permissions are strictly enforced based on roles (`SUPER_ADMIN`, `ADMIN`, `ENTREPRENEUR`, and `INVESTOR`) using middleware checks.
- **Project & Proposal Lifecycle:** Complete workflow for submitting, reviewing, approving, rejecting, and tracking projects and associated investment proposals.
- **Community Platform:** Users can join communities, create pages/posts, approve pending join requests, and interact inside dedicated groups.
- **Engagement Features:** Support for page likes/dislikes and threaded/nested comments.
- **Real-Time Integration:** Leverages **Socket.IO** for real-time notifications and join request workflows.
- **Notification System:** Built-in notifications to keep entrepreneurs, investors, and admins updated on actions (e.g., status changes, new messages, join approvals).
- **Email Dispatching:** Integrates **Nodemailer** for authentication verification and password recovery flows.
- **Strict Input Validation:** Integrates **Joi** validations on incoming payloads to ensure data integrity.

---

## 🛠️ Tech Stack

- **Core Framework:** Node.js, Express
- **Database:** MongoDB, Mongoose (with unique validators and migrate-mongo)
- **Real-Time:** Socket.IO
- **Security & Utilities:** JSON Web Token (JWT), Bcrypt, Helmet, Cookie-Parser, Multer (for multipart uploads), UUID, Validator
- **Testing:** Jest, MongoDB Memory Server (`mongodb-memory-server`)
- **Linting & Formatting:** ESLint, Prettier

---

## 📐 Architecture Overview

The repository adopts a strict modular and layered separation of concerns pattern:

```
[Client App] <---> [Socket.IO / Express Server (app.js)]
                               |
                        [Middlewares] (JWT, Role check, Permissions check, Ownership check)
                               |
                         [Modules Wrapper] (Bundles routing modules)
                               |
                          [Controllers] (Handles HTTP requests/responses)
                               |
                           [Services] (Orchestrates business logic & notifications)
                               |
                            [DAOs] (Data Access Objects database query layer)
                               |
                        [Mongoose Models] <---> [MongoDB]
```

---

## 📂 Project Structure

```bash
├── app.js                    # Server entry point, middlewares registration, and Socket.IO hooks
├── config/                   # Configuration files (database, socket setup)
│   ├── db.js                 # MongoDB connection logic
│   └── socket.js             # Socket.IO wrapper & initialization
├── common/                   # Shared architectural logic
│   ├── daos/                 # Data Access Objects (direct database access)
│   └── dtos/                 # Data Transfer Objects (shape validation and schema wrappers)
├── controllers/              # Request & response handlers
├── db/                       # Database models and Joi validation schemas
│   ├── models/               # Mongoose schemas & models (User, Admin, Community, Project, etc.)
│   └── validators/           # Joi schemas matching request payloads
├── middlewares/              # Express middlewares (auth, permissions, roles, ownership validation)
├── modules/                  # Bundled Express module routers
├── routes/                   # Subdivided route definitions (Express routers)
├── seed/                     # Seeders for test database seeding
├── tests/                    # Automated testing suite
├── package.json              # App scripts and dependencies configuration
└── README.md                 # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following variables (refer to `.env.example`):

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port the Express server will listen on. | `8000` |
| `NODE_ENV` | Application environment mode (`development`, `production`). | `development` |
| `MONGO_URI` | MongoDB connection connection string. | `mongodb://localhost:27017/innovest` |
| `JWT_SECRET_KEY` | Secret key used for JWT signing and verification. | *Required* |
| `EMAIL_USER` | SMTP username / email address used by Nodemailer. | *Optional* |
| `EMAIL_PASS` | SMTP password / app-specific password used by Nodemailer. | *Optional* |

---

## 🔗 API Endpoints Reference

### 1. Authentication & Users (`/api/register`, `/api/login`, etc.)
- **POST** `/api/register` - Registers a new user.
- **POST** `/api/login` - Logs in a user and returns a session cookie / JWT token.
- **GET** `/api/verify` - Verifies current user authorization token.
- **GET** `/api/pending-users` - Lists users awaiting registration approval (Admin only).
- **PUT** `/api/approve-user/:user_id` - Approves a pending user (Admin only).
- **PUT** `/api/reject-user/:user_id` - Rejects/deletes a pending user registration (Admin only).
- **POST** `/api/forgot-password` - Sends password reset link/OTP to user email.
- **POST** `/api/reset-password` - Resets user password using reset token.
- **GET** `/api/search` - Searches registered users.
- **GET** `/api/` - List all users (RBAC protected).
- **GET** `/api/:id` - Fetch user details by ID.
- **PUT** `/api/:id` - Update user details.
- **DELETE** `/api/:id` - Delete user account (Admin only).

### 2. Admin Operations (`/api/`)
- **POST** `/api/register` - Registers a new admin.
- **POST** `/api/login` - Admin login.
- **GET** `/api/logout` - Admin logout.
- **POST** `/api/` - Super admin creates a new admin.
- **GET** `/api/search` - Searches admins.
- **PUT** `/api/:id` - Updates admin properties (requires ownership / permission checks).
- **DELETE** `/api/:id` - Removes admin (requires ownership / permission checks).
- **GET** `/api/` - Lists all admins.
- **GET** `/api/:id` - Gets admin by ID.

### 3. Community Operations (`/api/community`)
- **GET** `/api/community/search` - Search communities.
- **POST** `/api/community` - Creates a new community (Admin only).
- **PUT** `/api/community/:community_id` - Updates community properties (Admin only).
- **DELETE** `/api/community/:community_id` - Deletes a community (Admin only).
- **GET** `/api/community/name/:community_name` - Retrieves a community by name.
- **GET** `/api/community/:community_id` - Retrieves a community by ID.
- **GET** `/api/community` - Lists all active communities.

### 4. Community Users (`/api/community`)
- **GET** `/api/community/users/pending-users` - Lists users pending community join approval.
- **POST** `/api/community/:community_id/join` - Submits a join request to a community.
- **GET** `/api/community/:community_id/approve-user/:user_id` - Approves user membership (Admin only).
- **DELETE** `/api/community/:community_id/reject-user/:user_id` - Rejects user membership request (Admin only).
- **DELETE** `/api/community/:community_id/users/:user_id` - Removes a user from a community (Admin only).
- **GET** `/api/community/:communityId/users` - Gets all users in a community.

### 5. Community Pages & Posts (`/api/community`)
- **GET** `/api/community/community-pages/pending-pages` - Gets pages pending approval.
- **GET** `/api/community/pages/search-pages` - Search within community pages.
- **GET** `/api/community/:community_id/pages` - Gets all pages for a specific community.
- **POST** `/api/community/:community_id` - Creates a new page within a community.
- **PUT** `/api/community/:community_id/:page_id` - Updates a community page.
- **DELETE** `/api/community/:community_id/:page_id` - Deletes a community page.
- **GET** `/api/community/:community_id/:page_id` - Gets page by ID.
- **POST** `/api/community/:community_id/approve/:page_id` - Approves a page/post (Admin only).
- **POST** `/api/community/:community_id/reject/:page_id` - Rejects a page/post (Admin only).

### 6. Project & Proposal Operations (`/api/`)
- **GET** `/api/fields` - List all projects grouped/filtered by field.
- **POST** `/api/` - Adds a new entrepreneur project.
- **PUT** `/api/:project_id` - Updates project details.
- **DELETE** `/api/:project_id` - Deletes project.
- **GET** `/api/` - Lists all projects.
- **GET** `/api/:project_id` - Gets project by ID.
- **GET** `/api/user/:user_id` - Get all projects owned by a user.
- **GET** `/api/status/under-review` - Get projects currently under review (Admin only).
- **PUT** `/api/approve/:project_id` - Approves project (Admin only).
- **PUT** `/api/reject/:project_id` - Rejects project (Admin only).

### 7. Post Engagement (`/api/comment` & `/api/like`)
- **POST** `/api/comment/:page_id` - Add comment to page/post.
- **GET** `/api/comment/:page_id` - Fetch all comments for a page/post.
- **PUT** `/api/comment/:comment_id` - Update a comment.
- **DELETE** `/api/comment/:comment_id` - Delete a comment.
- **POST** `/api/like/:page_id` - Likes a page/post.
- **DELETE** `/api/like/:page_id/:like_id` - Dislikes/removes like from a page/post.
- **GET** `/api/like/:page_id/likes` - Fetch likes for a page/post.

---

## 💾 Database & Validation System

### Mongoose Models
- **Admin (`adminModel.js`):** Fields for admin name, email, credentials, roles, and administrative permissions.
- **User (`userModel.js`):** Fields for basic info, registration status (`approved`, `pending`, `rejected`), role, permissions, and professional profile.
- **Project (`projectModel.js`):** Fields describing name, scope, budget, status (`approved`, `pending`, `rejected`), owner reference, and category fields.
- **Community (`communityModel.js`):** Name, description, active member list, and metadata.
- **Page (`pageModel.js` / `communityPagesModel.js`):** Custom structured pages inside communities with status, author reference, body, and files.
- **Comment & Like:** Reference target pages, timestamps, and active user references.
- **Investment / Proposal / Feedback:** Handles investor expressions of interest, proposal metadata, and status hooks without transaction details.

### Validation
Each database model corresponds to a **Joi validation schema** located in `db/validators/` to ensure incoming data conforms strictly to field schemas before entering the business layer.

---

## 🚀 Getting Started

### 1. Clone & Pre-requisites
Ensure you have **Node.js (v18+)** and **MongoDB** installed and running on your system.

### 2. Install Dependencies
Run the following command in the root folder:
```bash
npm install
```

### 3. Setup Environment
Copy `.env.example` to `.env` and adjust the variables to fit your environment:
```bash
cp .env.example .env
```

### 4. Running the Application
To run the server in **development mode** (uses nodemon):
```bash
npm start
```
The server will boot up and should output:
```
server running in development mode on port 8000
MongoDB connected successfully
```

---

## 🧪 Scripts & Testing

Inside `package.json`, the following scripts are available:

- **Run Server:** `npm start`
- **Lint Codebase:** `npm run lint`
- **Auto-format Code:** `npm run format`
- **Run Test Suite:** `npm run test`

The test suite runs using **Jest** and operates on a mock database through **MongoDB Memory Server**, guaranteeing your actual database stays pristine during tests.
