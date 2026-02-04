# Reflectify Backend

Express.js API server with PostgreSQL, JWT authentication, and chat functionality.

## 🚀 Features

- 🔐 **JWT Authentication** - Secure token-based auth with refresh tokens
- 🔑 **Google OAuth** - Social login integration
- 💾 **PostgreSQL** - Reliable data persistence with Prisma ORM
- 💬 **Chat API** - CRUD operations for conversations and messages
- 👤 **Global Context** - Store user preferences for AI personalization
- 📧 **Email Services** - Password reset and account verification
- 🛡️ **Security** - CORS, input validation, password hashing

## 🛠️ Tech Stack

| Technology  | Purpose           |
| ----------- | ----------------- |
| Node.js     | Runtime           |
| Express.js  | Web Framework     |
| PostgreSQL  | Database          |
| Prisma      | ORM               |
| JWT         | Authentication    |
| bcryptjs    | Password Hashing  |
| Nodemailer  | Email Services    |
| Google Auth | OAuth Integration |

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE reflectify;
```

### 3. Environment Setup

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/reflectify

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email (optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start Server

```bash
npm run dev
```

Server runs on: http://localhost:4000

## 📁 Project Structure

```
backend/
├── controllers/         # Route handlers
│   ├── auth.controller.ts      # Auth logic
│   ├── chat.controller.ts      # Chat logic
│   └── globalContext.controller.ts
│
├── routes/              # API routes
│   ├── auth.routes.ts          # /api/v1/user/*
│   ├── chat.routes.ts          # /api/v1/chat/*
│   └── globalContext.routes.ts # /api/v1/global-context/*
│
├── middlewares/         # Middleware
│   └── auth.middleware.ts      # JWT verification
│
├── prisma/              # Database
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration files
│
├── services/            # Business logic
│   └── mailservice.ts          # Email sending
│
├── index.ts             # Entry point
├── prisma-client.ts     # Prisma client
└── package.json
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/v1/user/register`        | Register new user      |
| POST   | `/api/v1/user/login`           | Login user             |
| POST   | `/api/v1/user/logout`          | Logout user            |
| GET    | `/api/v1/user/profile`         | Get user profile       |
| POST   | `/api/v1/user/forgot-password` | Request password reset |
| POST   | `/api/v1/user/reset-password`  | Reset password         |
| GET    | `/api/v1/user/verify/:token`   | Verify email           |
| GET    | `/auth/google`                 | Google OAuth login     |

### Chat

| Method | Endpoint                                  | Description         |
| ------ | ----------------------------------------- | ------------------- |
| GET    | `/api/v1/chat/conversations`              | List conversations  |
| POST   | `/api/v1/chat/conversations`              | Create conversation |
| GET    | `/api/v1/chat/conversations/:id`          | Get conversation    |
| DELETE | `/api/v1/chat/conversations/:id`          | Delete conversation |
| POST   | `/api/v1/chat/conversations/:id/messages` | Add message         |
| PUT    | `/api/v1/chat/conversations/:id/messages` | Update messages     |

### Global Context

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/v1/global-context` | Get user context    |
| PUT    | `/api/v1/global-context` | Update user context |

## 🗃️ Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String?
  name          String?
  isVerified    Boolean  @default(false)
  googleId      String?
  conversations Conversation[]
  globalContext GlobalContext?
}

model Conversation {
  id        String    @id @default(uuid())
  title     String?
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String       @id @default(uuid())
  content        String
  role           String       // "user" or "assistant"
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  createdAt      DateTime     @default(now())
}

model GlobalContext {
  id      String @id @default(uuid())
  userId  String @unique
  user    User   @relation(fields: [userId], references: [id])
  context String @default("")
}
```

## 🔧 Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run start        # Start production server
npm run generate     # Generate Prisma client
npx prisma migrate dev    # Run migrations
npx prisma studio    # Open Prisma Studio (DB GUI)
```

## 🔐 Authentication Flow

1. User registers/logs in → Server returns JWT tokens
2. Frontend stores tokens in cookies
3. Each request includes JWT in Authorization header
4. Middleware verifies token and attaches user to request
5. Refresh token used to get new access token when expired

## 🌐 CORS Configuration

Backend allows requests from:

- `http://localhost:5173` (Frontend dev)
- Production frontend URL (configured in `.env`)

## 🚀 Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Set `NODE_ENV=production` in backend
3. Backend serves frontend static files from `frontend/dist/`
4. Single deployment serves both frontend and API
