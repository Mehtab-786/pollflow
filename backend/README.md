# 🗳️ PollFlow Backend

The backend engine for **PollFlow**, a real-time polling and quiz platform. Built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and **Socket.io**.

---

## 🌟 Key Features

- 🔐 **Secure Authentication**: JWT-based authentication using access & refresh tokens stored in HTTP-only cookies or Authorization headers.
- 📊 **Poll & Quiz Management**: Create and manage polls with single/multiple-choice questions, required fields, and expiration dates.
- 🛡️ **Flexible Voting Modes**: Supports both `AUTHENTICATED` (strict 1 vote per user) and `ANONYMOUS` response modes.
- ⚡ **Real-Time Live Analytics**: Socket.io room-based subscriptions allow creators to see incoming votes in real time without refreshing.
- 🏎️ **Optimized Resource Usage**: Zero socket overhead for voters. Events are broadcasted strictly to active creator rooms post-database transaction.
- 🧱 **Strictly Typed & Validated**: End-to-end TypeScript types, Joi schema request validation, and Prisma schema safety.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Runtime & Language** | Node.js (v20+), TypeScript |
| **Web Framework** | Express 5 |
| **Real-time Engine** | Socket.io 4 |
| **Database & ORM** | PostgreSQL 17, Prisma ORM |
| **Validation & Auth** | Joi, JSON Web Token (JWT), bcrypt |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma                 # Database schema definitions
├── src/
│   ├── app.ts                        # Express application & middleware setup
│   ├── server.ts                     # HTTP & Socket.io server bootstrap
│   ├── common/                       # Shared utilities, configs & middlewares
│   │   ├── config/                   # Database (Prisma) configuration
│   │   ├── middlewares/              # Auth, validation, and error middlewares
│   │   └── utils/                    # JWT, API error, and response helpers
│   ├── modules/                      # Domain-driven feature modules
│   │   ├── auth/                     # Auth routes, controller, service & DTOs
│   │   ├── poll/                     # Poll CRUD, analytics & socket handlers
│   │   │   ├── poll.controller.ts
│   │   │   ├── poll.routes.ts
│   │   │   ├── poll.service.ts
│   │   │   └── poll.socket.ts        # Creator room join/leave logic
│   │   └── response/                 # Voting ingestion & broadcast
│   │       ├── response.controller.ts
│   │       ├── response.routes.ts
│   │       ├── response.service.ts
│   │       └── response.socket.ts    # Real-time event dispatcher
│   └── realtime/
│       └── socket.ts                 # Socket.io gateway & handshake auth
├── docker-compose.yml                # Local PostgreSQL database container
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **Docker Desktop** (for running local PostgreSQL)

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your configuration:
```bash
cp .env.example .env
```

Example `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polling_db"
CORS_ORIGIN="http://localhost:5173"

# JWT Secrets
JWT_ACCESS_TOKEN="your_access_token_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_TOKEN="your_refresh_token_secret"
JWT_REFRESH_EXPIRES_IN="7d"
```

### 3. Start PostgreSQL with Docker
Start the database service:
```bash
docker compose up -d
```

### 4. Apply Database Migrations
Generate Prisma client and apply schema migrations:
```bash
npx prisma db push
# or if using migrations:
# npx prisma migrate dev
```

### 5. Run the Server
```bash
# Development (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```
The server will start at `http://localhost:5000`.

---

## 📡 API Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Log in and receive tokens | No |
| `POST` | `/logout` | Invalidate current session | Yes |

---

### 📊 Polls (`/api/v1/polls`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/` | Create a new poll/quiz | Yes |
| `GET` | `/` | Get all published public polls | No |
| `GET` | `/me` | Get polls created by logged-in user | Yes |
| `GET` | `/:id` | Get poll details by ID | Optional |
| `POST` | `/:id/publish` | Publish an expired poll | Yes (Creator only) |
| `GET` | `/:id/analytics` | Get baseline poll statistics & vote counts | Yes (Creator only) |

---

### 🗳️ Responses / Voting (`/api/v1/polls`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/:pollId/response` | Submit answers to a poll | Conditional (`AUTHENTICATED` vs `ANONYMOUS`) |

**Sample Request Body:**
```json
{
  "answers": [
    {
      "questionId": "c9e78263-d14f-4eb8-b99b-0a06df5c7601",
      "optionId": "9fa802cf-8d19-4b67-ba71-61cfb36e0d9b"
    }
  ]
}
```

---

## ⚡ Real-Time WebSocket Architecture

PollFlow uses **Socket.io** with a room-based pub/sub architecture. Only creators viewing the analytics dashboard connect to WebSockets, saving significant server bandwidth.

### 1. Connection & Handshake Authentication
When connecting, the client passes their access token in `auth.token` or via cookies:
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  auth: {
    token: "<CREATOR_ACCESS_TOKEN>"
  }
});
```

### 2. Client-to-Server Events
| Event | Payload | Description |
| :--- | :--- | :--- |
| `join_poll_analytics` | `{ pollId: string }` | Joins room `poll:<pollId>:analytics` (verifies ownership). |
| `leave_poll_analytics` | `{ pollId: string }` | Leaves room `poll:<pollId>:analytics`. |

### 3. Server-to-Client Events
| Event | Payload | Description |
| :--- | :--- | :--- |
| `poll:analytics_update` | `{ pollId, totalResponsesIncrement, answers, timestamp }` | Fired when a voter submits an answer for this poll. |

**Sample Real-Time Payload:**
```json
{
  "pollId": "c4d32a1e-8e42-4217-a068-d06efd8d73b2",
  "totalResponsesIncrement": 1,
  "answers": [
    {
      "questionId": "q1-uuid",
      "optionId": "opt1-uuid"
    }
  ],
  "timestamp": "2026-09-16T00:30:00.000Z"
}
```

---

## 🧪 Scripts

- `npm run dev`: Starts the development server using `tsx watch`.
- `npm run build`: Compiles TypeScript files into `./dist` via `tsc`.
- `npm start`: Runs the compiled production code.
