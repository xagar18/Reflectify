# 🌿 Reflectify — AI-Powered Self-Reflection & Journaling Platform

> A full-stack AI companion for mindful self-reflection, emotional journaling, and personal growth — powered by **LLaMA-4** on Google Cloud Vertex AI.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Features](#-features)
5. [Project Structure](#-project-structure)
6. [Database Schema](#-database-schema)
7. [API Endpoints](#-api-endpoints)
8. [Frontend Components](#-frontend-components)
9. [AI / Model Layer](#-ai--model-layer)
10. [Authentication Flow](#-authentication-flow)
11. [State Management](#-state-management)
12. [Environment Variables](#-environment-variables)
13. [Installation & Setup](#-installation--setup)
14. [Running the Application](#-running-the-application)
15. [Deployment](#-deployment)
16. [Screenshots / UI Flow](#-screenshots--ui-flow)

---

## 🌐 Project Overview

**Reflectify** is a full-stack web application that provides users with an AI-powered conversational companion designed for **self-reflection, emotional journaling, and mindful conversations**. The platform allows users to have meaningful conversations with an empathetic AI assistant that adapts its responses based on the user's emotional state, personal context, and conversation history.

### Key Highlights

- **Three-Tier Architecture** — React Frontend + Express.js Backend + Python AI Model Server
- **LLaMA-4 Scout 17B** model deployed on Google Cloud Vertex AI for intelligent, empathetic responses
- **Multi-Auth System** — Email/Password, Google OAuth 2.0, GitHub OAuth
- **Guest Access** — Non-authenticated users get 7 free reflections per 6-hour window
- **Global Context System** — Persistent user context (name, preferences, etc.) injected into every AI conversation for personalized responses
- **Real-Time Conversations** — Chat-style UI with typing indicators, lazy-loaded message history, and auto-generated conversation titles
- **Dark/Light/System Theme** — Full theme support across the entire application
- **Voice Input** — Speech-to-text using the Web Speech API
- **File Attachments** — Image and document file attachment support in messages
- **Intent Matching** — Pre-defined responses for common patterns (greetings, crisis situations) before hitting the LLM

---

## 🛠 Tech Stack

### Frontend

| Technology              | Version | Purpose                                       |
| ----------------------- | ------- | --------------------------------------------- |
| **React**               | 19.1.1  | UI library (latest with concurrent features)  |
| **TypeScript**          | ~5.9.3  | Type-safe JavaScript                          |
| **Vite**                | 7.1.7   | Build tool & dev server (fast HMR)            |
| **Tailwind CSS**        | 4.1.14  | Utility-first CSS framework (v4, Vite plugin) |
| **Zustand**             | 5.0.9   | Lightweight state management                  |
| **React Router**        | 7.9.4   | Client-side routing                           |
| **Axios**               | 1.12.2  | HTTP client for API calls                     |
| **React Hook Form**     | 7.65.0  | Form handling                                 |
| **Zod**                 | 4.1.12  | Schema validation                             |
| **@react-oauth/google** | 0.13.4  | Google OAuth integration                      |
| **Lucide React**        | 0.546.0 | Icon library                                  |
| **React Hot Toast**     | 2.6.0   | Toast notifications                           |
| **React Spinners**      | 0.17.0  | Loading spinners (BeatLoader)                 |
| **React Icons**         | 5.5.0   | Additional icon library                       |
| **clsx**                | 2.1.1   | Conditional className utility                 |

### Backend

| Technology              | Version | Purpose                                     |
| ----------------------- | ------- | ------------------------------------------- |
| **Node.js**             | —       | JavaScript runtime                          |
| **Express.js**          | 5.1.0   | Web framework (v5, latest)                  |
| **TypeScript**          | —       | Type-safe server code                       |
| **Prisma ORM**          | 7.3.0   | Database ORM with type-safe queries         |
| **PostgreSQL**          | —       | Relational database (hosted on Aiven Cloud) |
| **JSON Web Tokens**     | 9.0.2   | Authentication tokens                       |
| **bcryptjs**            | 3.0.2   | Password hashing (10 salt rounds)           |
| **Nodemailer**          | 7.0.9   | Email service (SMTP via Gmail)              |
| **Google Auth Library** | 10.5.0  | Google OAuth token verification             |
| **Cookie Parser**       | 1.4.7   | Cookie-based session management             |
| **CORS**                | 2.8.5   | Cross-origin resource sharing               |
| **tsx**                 | 4.21.0  | TypeScript execution (no compile step)      |
| **Nodemon**             | 3.1.10  | Hot-reload during development               |
| **pg**                  | 8.17.2  | PostgreSQL driver with SSL support          |
| **@prisma/adapter-pg**  | 7.3.0   | Prisma PostgreSQL adapter                   |

### AI / Model Server

| Technology                     | Version | Purpose                                       |
| ------------------------------ | ------- | --------------------------------------------- |
| **Python**                     | 3.x     | AI model server runtime                       |
| **FastAPI**                    | latest  | High-performance Python API framework         |
| **Uvicorn**                    | latest  | ASGI server for FastAPI                       |
| **Google Cloud Vertex AI**     | —       | LLaMA-4 model hosting & inference             |
| **LLaMA-4 Scout 17B Instruct** | —       | Large Language Model for empathetic responses |
| **Requests**                   | latest  | HTTP client for Vertex AI API calls           |
| **python-dotenv**              | latest  | Environment variable management               |

### Database & Cloud Services

| Service                    | Purpose                                             |
| -------------------------- | --------------------------------------------------- |
| **Aiven Cloud PostgreSQL** | Managed PostgreSQL database with SSL                |
| **Google Cloud Vertex AI** | LLM model deployment & inference                    |
| **Google OAuth 2.0**       | Social authentication                               |
| **GitHub OAuth**           | Social authentication                               |
| **Gmail SMTP**             | Transactional emails (verification, password reset) |

### Dev Tools

| Tool               | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **ESLint**         | Code linting with React Hooks & Refresh plugins |
| **Prettier**       | Code formatting with Tailwind CSS plugin        |
| **TypeScript**     | Static type checking across frontend & backend  |
| **Prisma Migrate** | Database migration management                   |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                             │
│  React 19 + TypeScript + Tailwind CSS + Zustand                     │
│  Port: 5173 (dev)                                                   │
└────────────────────┬───────────────────────┬────────────────────────┘
                     │  REST API (Axios)     │  REST API (Fetch)
                     │  with Cookies         │
                     ▼                       ▼
┌────────────────────────────┐   ┌───────────────────────────────────┐
│     BACKEND (Express.js)   │   │     MODEL SERVER (FastAPI)        │
│     Port: 4000             │   │     Port: 8001                    │
│                            │   │                                   │
│  • Auth (JWT + Cookies)    │   │  • Intent Matching (intents.json) │
│  • Chat CRUD               │   │  • LLaMA-4 Prompt Building       │
│  • Global Context CRUD     │   │  • Vertex AI API Calls            │
│  • Email Service (SMTP)    │   │  • Response Cleaning/Formatting   │
│  • Prisma ORM              │   │                                   │
└────────────┬───────────────┘   └──────────────┬────────────────────┘
             │                                  │
             ▼                                  ▼
┌────────────────────────────┐   ┌───────────────────────────────────┐
│  PostgreSQL (Aiven Cloud)  │   │  Google Cloud Vertex AI           │
│  • Users                   │   │  • LLaMA-4 Scout 17B Instruct    │
│  • Conversations           │   │  • Dedicated Endpoint             │
│  • Messages                │   │                                   │
│  • Global Context          │   │                                   │
└────────────────────────────┘   └───────────────────────────────────┘
```

### Request Flow (User sends a message)

1. **User** types a message in the React frontend
2. **Frontend** sends the message + conversation context + global context to the **Model Server** (`POST /api/v1/reflect`)
3. **Model Server** first checks for **intent matches** in `intents.json` (greetings, crisis keywords, etc.)
4. If no intent match, the Model Server builds a **LLaMA-4 prompt** with system instructions, global context, conversation history, and the user's message
5. The prompt is sent to **Google Cloud Vertex AI** for inference
6. The raw LLM response is **cleaned** (remove special tokens, artifacts, formatting) and returned
7. **Frontend** displays the bot response with a typing indicator animation
8. If the user is **authenticated**, both the user message and bot response are **saved to the database** via the Backend (`POST /api/v1/chat/conversations/:id/messages/bulk`)

---

## ✨ Features

### 1. AI-Powered Conversations

- Empathetic, conversational AI responses powered by LLaMA-4 Scout 17B
- Context-aware — maintains conversation history (last 10 messages)
- Personalized — uses global context (user's name, preferences, occupation, etc.)
- Natural language — trained to respond like a caring friend, not a therapy bot
- Practical advice — provides actionable suggestions, not just "breathing exercises"

### 2. Authentication System

- **Email/Password Registration** with email verification via verification token
- **Email/Password Login** with bcrypt password comparison
- **Google OAuth 2.0** — one-click sign-in using `@react-oauth/google`
- **GitHub OAuth** — redirect-based OAuth flow with code exchange
- **JWT-based Sessions** — 10-day expiry, stored in HTTP-only cookies
- **Secure Cookie Configuration** — `httpOnly`, `secure` (production), `sameSite` (none/lax)
- **Guest Access** — use the app without signing up (7 messages per 6-hour window)

### 3. Email Services

- **Account Verification** — styled HTML email with verification link
- **Password Reset** — styled HTML email with 48-hour expiry reset link
- **SMTP via Gmail** — using Nodemailer with app-specific password
- **Branded Templates** — dark-themed email templates with Reflectify branding and emerald accent colors

### 4. Conversation Management

- **Create** new conversations (reflections)
- **Auto-title Generation** — first 5 words of the first user message become the title
- **Rename** conversations inline in the sidebar
- **Delete** individual conversations (cascade deletes messages)
- **Delete All** conversations at once
- **Lazy Loading** — conversation list loads titles only; messages loaded on demand when opened
- **Persistent Storage** — authenticated users save to PostgreSQL; guests use localStorage

### 5. Global Context System

- **Personal Context** — store key-value pairs about the user (name, age, occupation, etc.)
- **Categories** — organize context by category (personal, professional, preferences, health)
- **AI Integration** — context is formatted and injected into every LLM prompt as "User Info"
- **Auto-Sync** — user's name is automatically added to global context on login
- **CRUD** — create, read, update (upsert), soft-delete via `isActive` flag
- **Settings UI** — manage context items in the Settings → AI Context tab

### 6. Guest Rate Limiting

- **7 messages per 6-hour window** for non-authenticated users
- **LocalStorage tracking** — message timestamps stored client-side
- **Dynamic Banner** — shows remaining messages, time until reset, and sign-in prompt
- **Three states**: Normal (shows remaining count), Running Low (≤2 remaining, amber warning), Limit Reached (emerald pause message with countdown)

### 7. Theme System

- **Dark Mode** — dark-gray (`bg-gray-950`) backgrounds with emerald accents
- **Light Mode** — light-gray (`bg-gray-50`) backgrounds with emerald accents
- **System Mode** — follows OS preference via `prefers-color-scheme` media query
- **Persistent** — theme choice saved in localStorage (`reflectify-theme-option`)
- **Applied everywhere** — every component has conditional `theme === "dark"` styling

### 8. Voice Input

- **Speech-to-Text** using the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Continuous mode** — keeps listening until manually stopped
- **Interim results** — shows real-time transcription as user speaks
- **Auto-restart** — reconnects if recognition ends unexpectedly
- **Visual indicator** — animated pulsing microphone icon when active
- **Graceful fallback** — hides voice button if browser doesn't support it

### 9. File Attachments

- **Multi-file picker** with accept filter for images, PDFs, Word docs, text files
- **Image preview thumbnails** with remove button
- **File metadata display** — name and formatted size (KB/MB)
- **Contextual AI responses** — different replies for images vs. documents

### 10. Settings Panel

- **4-tab modal** accessible from Profile Menu → Settings
- **General** — theme selection (dark/light/system) with visual card pickers
- **AI Context** — CRUD for global context items with key/value/category fields
- **Privacy** — toggles for Save History, Share Analytics, Show Online Status; "Clear All Data" danger button
- **Language** — 10 language options (en, es, fr, de, zh, ja, ar, hi, pt, ru) as selectable cards
- **Keyboard shortcut** — Escape key closes the modal

### 11. Intent Matching (Pre-LLM)

- **intents.json** — pre-defined patterns and responses for common inputs
- **Three-pass matching**:
  1. **Exact match** — case-insensitive normalized comparison
  2. **Fuzzy match** — substring containment with ≥70% length similarity
  3. **Critical keyword match** — safety-critical intents (e.g., suicide/self-harm keywords)
- **Random response selection** — picks randomly from multiple responses per intent
- **Bypass LLM** — returns instantly without hitting Vertex AI for matched intents

### 12. Sidebar & Navigation

- **Collapsible sidebar** — 264px wide, toggleable with Panel icon
- **Mobile responsive** — backdrop overlay on smaller screens
- **Chat search** — filter conversations by title
- **Collapsible sections** — "Your chats" section with toggle
- **Profile Menu** — user avatar, Settings, and Logout
- **Glass-morphism** — `backdrop-blur-md` with semi-transparent background

### 13. Production Deployment

- **Static file serving** — Express serves the Vite-built frontend in production
- **Catch-all route** — SPA fallback for client-side routing
- **Combined build script** — single `npm run build` at the root installs all deps and builds

---

## 📁 Project Structure

```
Reflectify/
├── package.json                    # Root package.json (build & start scripts)
├── README.md                       # This file
│
├── backend/                        # Express.js API Server
│   ├── index.ts                    # App entry — Express setup, CORS, routes, static serving
│   ├── package.json                # Backend dependencies & scripts
│   ├── tsconfig.json               # TypeScript config (ES2022, NodeNext modules)
│   ├── prisma-client.ts            # Prisma Client with pg adapter & SSL configuration
│   ├── prisma.config.ts            # Prisma CLI configuration
│   ├── .env                        # Environment variables (secrets)
│   ├── .env.example                # Environment variables template
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts      # Auth logic: register, login, Google/GitHub OAuth,
│   │   │                           #   profile, logout, forgot/reset password, verify email
│   │   ├── chat.controller.ts      # Chat CRUD: create, get, update, delete conversations,
│   │   │                           #   add single/bulk messages, auto-title generation
│   │   └── globalContext.controller.ts  # Global context CRUD: get, set (upsert), delete,
│   │                                    #   format for AI consumption
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts      # JWT middleware: isLoggedIn (optional), authenticateToken (required)
│   │
│   ├── routes/
│   │   ├── auth.routes.ts          # Auth routes (/api/v1/user/*)
│   │   ├── chat.routes.ts          # Chat routes (/api/v1/chat/*)
│   │   └── globalContext.routes.ts # Global context routes (/api/v1/global-context/*)
│   │
│   ├── services/
│   │   └── mailservice.ts          # Nodemailer SMTP email sender
│   │
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (User, Conversation, Message, GlobalContext)
│   │   └── migrations/             # 6 migration files (init → global context)
│   │
│   └── utils/                      # Utility functions (empty, reserved)
│
├── frontend/                       # React + Vite SPA
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Frontend dependencies & scripts
│   ├── vite.config.ts              # Vite config (React + Tailwind CSS v4 plugins)
│   ├── tsconfig.json               # TypeScript project references
│   ├── tsconfig.app.json           # App-specific TS config
│   ├── tsconfig.node.json          # Node-specific TS config
│   ├── eslint.config.js            # ESLint config
│   ├── .prettierrc                 # Prettier config (Tailwind plugin)
│   ├── .env                        # Frontend env vars (VITE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID)
│   │
│   └── src/
│       ├── main.tsx                # Entry — GoogleOAuthProvider + BrowserRouter + App
│       ├── App.tsx                 # Routes: /, /login, /register, /forgot-password,
│       │                           #   /reset-password/:token, /verify-account/:token, /oauth-success
│       ├── App.css                 # Global styles
│       ├── index.css               # Tailwind imports
│       │
│       ├── pages/
│       │   ├── Home.tsx            # Main app page — sidebar, chat area, message input,
│       │   │                       #   welcome screen, guest banner, settings modal
│       │   └── OAuthSuccess.tsx    # OAuth callback handler — fetches profile & redirects
│       │
│       ├── components/
│       │   ├── ChatArea.tsx        # Scrollable message list with auto-scroll, typing indicator,
│       │   │                       #   image/file attachment rendering
│       │   ├── ChatRow.tsx         # Sidebar chat item with inline rename, delete actions
│       │   ├── ChatItem.tsx        # Simple chat item (legacy, with context menu)
│       │   ├── Sidebar.tsx         # Collapsible sidebar: branding, new chat, search, chat list,
│       │   │                       #   profile menu, glass-morphism UI
│       │   ├── MessageInput.tsx    # Message composer: text input, file attachments, voice input
│       │   │                       #   (Web Speech API), send button
│       │   ├── Settings.tsx        # 4-tab settings modal: General (theme), AI Context,
│       │   │                       #   Privacy (toggles + clear data), Language (10 options)
│       │   ├── ProfileMenu.tsx     # User avatar dropdown: Settings & Logout actions
│       │   ├── GuestLimitBanner.tsx # Rate limit banner for guests (remaining msgs, countdown)
│       │   ├── Login.tsx           # Sign-in page: email/password, Google OAuth, GitHub OAuth,
│       │   │                       #   guest access, split-layout design
│       │   ├── Register.tsx        # Sign-up page: name/email/password with strength indicator,
│       │   │                       #   6-criteria validation, Google/GitHub OAuth
│       │   ├── Forgot.tsx          # Forgot password page: email input, sends reset link
│       │   ├── ResetPassword.tsx   # Reset password page: new password with strength validation
│       │   └── VerifyAccount.tsx   # Email verification page: one-click verify button
│       │
│       ├── services/
│       │   ├── chatService.ts      # API client for chat CRUD (conversations + messages)
│       │   ├── modelService.ts     # API client for AI model server (/api/v1/reflect)
│       │   ├── globalContextService.ts  # API client for global context CRUD + AI formatting
│       │   ├── guestRateLimitService.ts # Client-side rate limiter (7 msgs / 6 hrs, localStorage)
│       │   └── dataSyncService.ts  # Reserved for future data sync features
│       │
│       ├── zustand/
│       │   └── store.ts            # Zustand store: auth state, theme, language, privacy,
│       │                           #   settings modal, global context refresh trigger
│       │
│       └── types/
│           └── speech-recognition.d.ts  # TypeScript declarations for Web Speech API
│
├── model/                          # Python AI Model Server
│   ├── api.py                      # FastAPI app: /api/v1/reflect, /health, /api/v1/intents,
│   │                               #   /api/v1/test-intent endpoints, CORS middleware
│   ├── config.py                   # Configuration: Vertex AI settings, system prompt,
│   │                               #   model parameters, port
│   ├── QwenHandler.py            # Qwen handler: prompt building with special tokens,
│   │                               #   RunPod REST API calls, response cleaning
│   ├── intent_matcher.py           # Intent matching: 3-pass matching (exact, fuzzy, critical),
│   │                               #   loads intents.json, random response selection
│   ├── remove_duplicates.py        # Utility: remove duplicate intents from intents.json
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Model server env vars
│   └── .env.example                # Template for model env vars
│
└── traning-data/                   # Training Data Utilities
    ├── intents.json                # Intent patterns and responses (used at runtime)
    ├── intents_converted.json      # Converted intents format
    ├── convert_to_intents.py       # Script to convert training data to intents format
    └── fix_json.py                 # Script to fix/validate JSON data
```

---

## 🗄 Database Schema

The application uses **PostgreSQL** with **Prisma ORM**. The database is hosted on **Aiven Cloud** with SSL encryption.

### Entity-Relationship Diagram

```
┌──────────────────────────────┐
│            User              │
├──────────────────────────────┤
│ id          String (CUID) PK│
│ name        String           │
│ phone       String?          │
│ email       String (UNIQUE)  │
│ password    String           │
│ isVerified  Boolean (false)  │
│ verificationToken  String?   │
│ passwordResetToken  String?  │
│ passwordResetExpiry DateTime?│
│ createdAt   DateTime (now)   │
│ updatedAt   DateTime (now)   │
├──────────────────────────────┤
│ conversations → Conversation[]│
│ globalContexts → GlobalContext[]│
└──────────┬──────────┬────────┘
           │          │
     ┌─────┘          └─────────┐
     ▼                          ▼
┌──────────────────────┐  ┌──────────────────────────┐
│    Conversation      │  │     GlobalContext         │
├──────────────────────┤  ├──────────────────────────┤
│ id     String (CUID) │  │ id       String (CUID)   │
│ title  String?       │  │ key      String           │
│ status Enum (active/ │  │ value    String (Text)    │
│        archived)     │  │ category String?          │
│ userId String (FK)   │  │ isActive Boolean (true)   │
│ createdAt DateTime   │  │ userId   String (FK)      │
│ updatedAt DateTime   │  │ createdAt DateTime        │
├──────────────────────┤  │ updatedAt DateTime        │
│ messages → Message[] │  ├──────────────────────────┤
│ user → User          │  │ @@unique([userId, key])   │
│ @@index([userId])    │  │ @@index([userId])         │
└──────────┬───────────┘  │ @@index([category])       │
           │              └──────────────────────────┘
           ▼
┌──────────────────────┐
│       Message        │
├──────────────────────┤
│ id             String│
│ content        Text  │
│ role           Enum  │
│   (user/assistant)   │
│ conversationId String│
│ createdAt   DateTime │
├──────────────────────┤
│ conversation →       │
│   Conversation       │
│ @@index              │
│  ([conversationId])  │
│ @@index([createdAt]) │
└──────────────────────┘
```

### Enums

| Enum                 | Values               | Used In               |
| -------------------- | -------------------- | --------------------- |
| `MessageRole`        | `user`, `assistant`  | `Message.role`        |
| `ConversationStatus` | `active`, `archived` | `Conversation.status` |

### Key Relationships

- **User → Conversation**: One-to-Many (a user has many conversations). Cascade delete.
- **User → GlobalContext**: One-to-Many (a user has many context items). Cascade delete. Unique on `(userId, key)`.
- **Conversation → Message**: One-to-Many (a conversation has many messages). Cascade delete.

### Migrations History

| Migration                               | Description                                   |
| --------------------------------------- | --------------------------------------------- |
| `20251016171117_init`                   | Initial schema — User model                   |
| `20251016180800_phone_removed`          | Removed phone field from User                 |
| `20251016181023_phone_added`            | Re-added phone as optional field              |
| `20251017153014_changed_pass_reset_exp` | Changed password reset expiry field type      |
| `20260125201311_add_chat_conversations` | Added Conversation, Message models with enums |
| `20260128124333_add_global_context`     | Added GlobalContext model                     |

---

## 🔌 API Endpoints

### Base URL: `http://localhost:4000`

### Authentication Routes (`/api/v1/user`)

| Method | Endpoint                     | Middleware   | Description                                                                                              |
| ------ | ---------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/v1/user/register`      | `isLoggedIn` | Register new user (name, email, password). Sends verification email.                                     |
| `POST` | `/api/v1/user/login`         | `isLoggedIn` | Login with email/password. Returns JWT cookie. Checks if already logged in.                              |
| `POST` | `/api/v1/user/google-auth`   | —            | Google OAuth login/register. Accepts Google access token.                                                |
| `GET`  | `/auth/github`               | —            | Redirects to GitHub OAuth authorization page.                                                            |
| `GET`  | `/auth/github/callback`      | —            | GitHub OAuth callback. Exchanges code for token, creates/finds user, sets cookie, redirects to frontend. |
| `GET`  | `/api/v1/user/profile`       | `isLoggedIn` | Get authenticated user's profile (id, name, email, phone, isVerified, timestamps).                       |
| `POST` | `/api/v1/user/logout`        | —            | Clear auth cookie and logout.                                                                            |
| `POST` | `/api/v1/user/frgt`          | —            | Send password reset email with 48-hour expiry token.                                                     |
| `POST` | `/api/v1/user/res/:token`    | —            | Reset password using token. Validates token & expiry, hashes new password.                               |
| `GET`  | `/api/v1/user/verify/:token` | —            | Verify email using verification token. Sets `isVerified = true`.                                         |

### Chat Routes (`/api/v1/chat`) — All require `authenticateToken`

| Method   | Endpoint                                       | Description                                                                                        |
| -------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `POST`   | `/conversations`                               | Create a new conversation (optional title, defaults to "New Reflection").                          |
| `GET`    | `/conversations`                               | Get all conversations for the user (titles only, no messages — for fast sidebar loading).          |
| `GET`    | `/conversations/:id`                           | Get a single conversation with all messages (ordered by `createdAt` ascending).                    |
| `PUT`    | `/conversations/:id`                           | Update conversation title.                                                                         |
| `DELETE` | `/conversations/:id`                           | Delete conversation (cascade deletes all messages).                                                |
| `DELETE` | `/conversations`                               | Delete ALL conversations for the user.                                                             |
| `POST`   | `/conversations/:conversationId/messages`      | Add a single message to a conversation.                                                            |
| `POST`   | `/conversations/:conversationId/messages/bulk` | Add multiple messages at once (user + assistant pair). Auto-updates title from first user message. |

### Global Context Routes (`/api/v1/global-context`) — All require `authenticateToken`

| Method   | Endpoint | Description                                                                                                                     |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/`      | Get all active global context items for the user (ordered by `updatedAt` desc).                                                 |
| `POST`   | `/`      | Add or update (upsert) a global context item. Requires `key` (alphanumeric, underscore, dash) and `value`. Optional `category`. |
| `DELETE` | `/:key`  | Soft-delete a global context item (sets `isActive = false`).                                                                    |

### Model Server Routes (`http://localhost:8001`)

| Method | Endpoint                          | Description                                                                                                    |
| ------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/v1/reflect`                 | Generate an AI reflection response. Accepts `message`, optional `context[]`, optional `global_context` string. |
| `GET`  | `/health`                         | Health check endpoint. Returns `{"status": "healthy"}`.                                                        |
| `GET`  | `/api/v1/intents`                 | List all loaded intents with patterns and response counts.                                                     |
| `POST` | `/api/v1/test-intent?message=...` | Test if a message matches any intent pattern.                                                                  |

---

## 🧩 Frontend Components

### Pages

| Component      | Route            | Description                                                                                                                                                                      |
| -------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Home`         | `/`              | Main application page. Contains sidebar, chat area, message input, welcome screen, guest banner, and settings modal. Manages all chat state, lazy loading, and AI communication. |
| `OAuthSuccess` | `/oauth-success` | OAuth callback handler. Fetches user profile using the cookie set by backend, then redirects to home. Shows loading spinner during fetch.                                        |

### Authentication Components

| Component       | Route                    | Key Features                                                                                                                                                                                                                      |
| --------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Login`         | `/login`                 | Split-layout design (branding left, form right). Email/password login, Google OAuth, GitHub OAuth, "Continue as guest" option. Gmail-only email validation.                                                                       |
| `Register`      | `/register`              | Split-layout design. Name, email, password registration. Real-time **password strength indicator** with 6 criteria (≥8 chars, lowercase, uppercase, number, special char, no 3 consecutive identical chars). Google/GitHub OAuth. |
| `Forgot`        | `/forgot-password`       | Split-layout design. Email input to send password reset link.                                                                                                                                                                     |
| `ResetPassword` | `/reset-password/:token` | Split-layout design. New password + confirm password with strength validation. Uses URL token parameter.                                                                                                                          |
| `VerifyAccount` | `/verify-account/:token` | Minimal centered layout. One-click "Verify Account" button. Uses URL token parameter.                                                                                                                                             |

### Chat Components

| Component      | Purpose              | Key Features                                                                                                                                                                                                                                               |
| -------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ChatArea`     | Message display area | Auto-scroll to bottom; loading spinner; empty state; image attachment rendering with click-to-open; file attachment display; animated typing indicator (3 bouncing dots); dark/light theme styling.                                                        |
| `MessageInput` | Message composer bar | Text input with Enter-to-send; multi-file picker (images, PDFs, docs); image preview thumbnails; voice input via Web Speech API with continuous mode, interim results, auto-restart, and animated pulse indicator; send button disabled when empty/typing. |
| `Sidebar`      | Navigation sidebar   | 264px collapsible sidebar; glass-morphism (`backdrop-blur-md`); "+ New Reflection" button; search filter for chats; collapsible "Your chats" section; mobile backdrop overlay; `ProfileMenu` at bottom for authenticated users.                            |
| `ChatRow`      | Sidebar chat item    | Click to select; inline rename (auto-focus input); hover-reveal Pencil/Trash icons; active state with emerald highlight.                                                                                                                                   |
| `ChatItem`     | Legacy chat item     | Three-dot context menu on hover (Rename, Pin, Delete).                                                                                                                                                                                                     |

### UI Components

| Component          | Purpose                  | Key Features                                                                                                                                                                                                    |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Settings`         | Settings modal (4 tabs)  | **General**: theme picker (Light/Dark/System). **AI Context**: CRUD for key-value context items. **Privacy**: toggles + "Clear All Data" danger zone. **Language**: 10-language grid selector. Escape-to-close. |
| `ProfileMenu`      | User avatar dropdown     | Circular avatar with user's initial; opens upward; Settings and Logout menu items; click-outside-to-close.                                                                                                      |
| `GuestLimitBanner` | Guest rate limit display | Three states: normal (shows count), running low (amber warning), limit reached (emerald pause with countdown). Auto-refreshes every 60 seconds.                                                                 |

---

## 🤖 AI / Model Layer

### System Prompt

The AI is configured with a detailed system prompt that instructs it to:

- Act as **"Reflectify"** — a friendly emotional companion and journaling assistant
- Be **natural and conversational** — talk like a caring friend, NOT a therapy bot
- **Adapt response length** — short for greetings, longer for emotional topics
- Give **practical advice** — real actionable suggestions, not just breathing exercises
- Use **simple formatting** — bullet points (•) for lists, short paragraphs
- Answer personal questions directly from User Info (global context)
- **Avoid**: robotic breathing countdowns, therapy speak, grounding techniques, being preachy

### LLaMA-4 Prompt Format

The handler builds prompts using LLaMA-4's special token format:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
{system_prompt}

User Info:
{global_context}
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
{previous_user_message}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
{previous_assistant_response}
<|eot_id|>
<|start_header_id|>user<|end_header_id|>
{current_user_message}
<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>
```

### Model Parameters

| Parameter               | Default | Description                                         |
| ----------------------- | ------- | --------------------------------------------------- |
| `MAX_TOKENS`            | 512     | Maximum response length                             |
| `TEMPERATURE`           | 0.7     | Creativity/randomness (0=deterministic, 1=creative) |
| `TOP_P`                 | 0.9     | Nucleus sampling threshold                          |
| `CONTEXT_MESSAGE_LIMIT` | 10      | Max conversation history messages sent to the model |

### Intent Matching Pipeline

Before calling the LLM, the system checks for pre-defined intent matches:

1. **Exact Match** — case-insensitive normalized comparison of the full input
2. **Fuzzy Match** — substring containment check with ≥70% length similarity ratio
3. **Critical Keyword Match** — safety-critical patterns (e.g., "kill myself", "want to die") that trigger immediate pre-defined crisis responses

If any match is found, the pre-defined response is returned **instantly** without calling Vertex AI, saving latency and API costs.

### Response Cleaning

The `QwenHandler.py` performs extensive response post-processing:

- Cuts off at any "user" turn marker leaked into the response
- Removes all LLaMA special tokens (`<|eot_id|>`, `<|end_of_text|>`, etc.)
- Removes `<|...|>` patterns via regex
- Strips "Prompt:" and "Output:" prefixes
- Removes standalone "user"/"assistant" words
- Converts markdown bullets (`*`, `-`) to clean bullets (`•`)
- Removes stray number artifacts
- Cleans up excessive whitespace

---

## 🔐 Authentication Flow

### Email/Password Registration

```
User fills form → POST /api/v1/user/register
  → Validate fields (name, email, password)
  → Check if user exists
  → Hash password (bcrypt, 10 rounds)
  → Generate verification token (crypto.randomBytes(32))
  → Create user in DB (isVerified = false)
  → Send verification email via SMTP
  → Return success
```

### Email Verification

```
User clicks email link → GET /api/v1/user/verify/:token
  → Find user by verificationToken
  → Set isVerified = true, clear verificationToken
  → Redirect to login
```

### Email/Password Login

```
User fills form → POST /api/v1/user/login
  → Check cookies (if already logged in, return user data)
  → Validate fields
  → Find user by email
  → Check isVerified (must be true)
  → Compare password (bcrypt)
  → Generate JWT (10-day expiry)
  → Set HTTP-only cookie
  → Return user data (id, name, email)
```

### Google OAuth

```
User clicks "Continue with Google" → @react-oauth/google popup
  → Get Google access token
  → POST /api/v1/user/google-auth with token
  → Verify token via Google OAuth2Client
  → Fetch user info from Google API
  → Find or create user (auto-verified, no password)
  → Generate JWT, set cookie
  → Return user data
```

### GitHub OAuth

```
User clicks "Continue with GitHub" → GET /auth/github
  → Redirect to github.com/login/oauth/authorize
  → User authorizes → GitHub redirects to /auth/github/callback?code=...
  → Exchange code for access token
  → Fetch GitHub profile & primary email
  → Find or create user (auto-verified, no password)
  → Generate JWT, set cookie
  → Redirect to /oauth-success
  → OAuthSuccess component fetches profile & redirects to home
```

### Password Reset

```
User enters email → POST /api/v1/user/frgt
  → Find user by email
  → Generate reset token (crypto.randomBytes(32))
  → Save token + 48-hour expiry in DB
  → Send reset email via SMTP
  → User clicks email link → /reset-password/:token
  → User enters new password → POST /api/v1/user/res/:token
  → Validate token & expiry
  → Hash new password, clear reset token
  → Redirect to login
```

### Middleware

| Middleware          | Behavior                                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `isLoggedIn`        | **Optional auth** — if JWT cookie exists, verifies and attaches `req.user`. If not, sets `req.user = null` and continues. Never returns 401. |
| `authenticateToken` | **Required auth** — if JWT cookie exists, verifies and attaches `req.user`. If not, returns 401 Unauthorized.                                |

---

## 📦 State Management

The application uses **Zustand** for global state management. The store is defined in `frontend/src/zustand/store.ts`.

### Store Shape

```typescript
interface AuthState {
  userData: any | null; // Current user data (id, name, email)
  isAuthenticated: boolean; // Authentication flag
  themeOption: ThemeOption; // User's preference: "dark" | "light" | "system"
  theme: Theme; // Applied theme: "dark" | "light"
  language: Language; // Current language code (en, es, fr, etc.)
  privacySettings: PrivacySettings; // { saveHistory, shareAnalytics, showOnlineStatus }
  isSettingsOpen: boolean; // Settings modal visibility
  globalContextVersion: number; // Counter to trigger global context refresh
}
```

### Store Actions

| Action                               | Description                                                                |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `auth(data)`                         | Set user data, mark authenticated, auto-add user name to global context    |
| `getProfile()`                       | Fetch user profile from backend (`GET /api/v1/user/profile`), update state |
| `logout()`                           | Call logout API, clear state, clear localStorage                           |
| `toggleTheme()`                      | Toggle between dark and light                                              |
| `setThemeOption(option)`             | Set theme to dark/light/system, persist to localStorage                    |
| `setLanguage(language)`              | Set language, persist to localStorage                                      |
| `setPrivacySettings(settings)`       | Partial update privacy settings, persist to localStorage                   |
| `openSettings()` / `closeSettings()` | Toggle settings modal; closing also bumps `globalContextVersion`           |
| `refreshGlobalContext()`             | Increment `globalContextVersion` to trigger re-fetch                       |

### Persisted State (localStorage)

| Key                         | Value                                  |
| --------------------------- | -------------------------------------- |
| `reflectify-theme-option`   | `"dark"` / `"light"` / `"system"`      |
| `reflectify-language`       | Language code (e.g., `"en"`)           |
| `reflectify-privacy`        | JSON privacy settings object           |
| `reflectify-chats`          | JSON array of chats (guest users only) |
| `reflectify-active-chat-id` | Active chat ID string                  |
| `reflectify-sidebar-open`   | Boolean sidebar state                  |
| `reflectify-guest-usage`    | Guest rate limit timestamps            |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=4000
NODE_ENV=development                          # "development" | "production"
FRONTEND_URL=http://localhost:5173            # Frontend URL for CORS & email links

# Database
DATABASE_URL=postgres://user:pass@host:port/db?sslmode=require

# Authentication
JWT_SECRET=your-jwt-secret-key                # Secret for signing JWT tokens

# Email (SMTP via Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password          # Gmail App Password (not regular password)
SMTP_FROM=your-email@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Model Server (`model/.env`)

```env
# Vertex AI Configuration
PROJECT_ID=your-gcp-project-id
REGION=us-central1
ENDPOINT_ID=mg-endpoint-xxxx-xxxx-xxxx
DEDICATED_DOMAIN=mg-endpoint-xxxx.us-central1-PROJECT_ID.prediction.vertexai.goog

# Model Parameters
CONTEXT_MESSAGE_LIMIT=10                      # Max conversation history messages
MAX_TOKENS=256                                # Max response tokens
TEMPERATURE=0.7                               # Response creativity (0-1)
TOP_P=0.9                                     # Nucleus sampling threshold

# Server
PORT=8001
```

---

## ⚙ Installation & Setup

### Prerequisites

- **Node.js** v18+ and **npm**
- **Python** 3.9+
- **PostgreSQL** database (or Aiven Cloud account)
- **Google Cloud** account with Vertex AI access (for LLaMA-4)
- **Google OAuth** credentials (Google Cloud Console)
- **GitHub OAuth** app (GitHub Developer Settings)
- **Gmail** account with App Password enabled (for email services)
- **gcloud CLI** installed and authenticated (for Vertex AI access tokens)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/reflectify.git
cd reflectify
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, SMTP credentials,
# Google OAuth, and GitHub OAuth credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to inspect the database
npx prisma studio
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo 'VITE_BACKEND_URL="http://localhost:4000"' > .env
echo 'VITE_GOOGLE_CLIENT_ID=your-google-client-id' >> .env
```

### 4. Model Server Setup

```bash
cd model

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Vertex AI project ID, endpoint ID, etc.

# Authenticate gcloud CLI
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

---

## 🚀 Running the Application

### Development Mode (3 terminals)

**Terminal 1 — Backend** (Port 4000):

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend** (Port 5173):

```bash
cd frontend
npm run dev
```

**Terminal 3 — Model Server** (Port 8001):

```bash
cd model
source venv/bin/activate
python api.py
# or: uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

### Production Build

From the root directory:

```bash
# Build everything (installs deps + builds frontend)
npm run build

# Start the production server
npm start
```

This runs the Express server which serves the built frontend as static files. In production mode:

- Express serves `frontend/dist/` as static assets
- All non-API routes fall back to `index.html` for client-side routing
- Cookies use `secure: true` and `sameSite: "none"`

---

## 🌍 Deployment

### Deployment Checklist

1. **Database**: Set up a production PostgreSQL instance (Aiven Cloud recommended)
2. **Backend**: Deploy Express server (e.g., Railway, Render, AWS EC2)
   - Set all environment variables
   - Run `npx prisma migrate deploy` to apply migrations
   - Set `NODE_ENV=production`
3. **Frontend**: Built and served by the backend in production
   - Update `VITE_BACKEND_URL` to production API URL before building
4. **Model Server**: Deploy FastAPI server (e.g., separate VM, Cloud Run)
   - Ensure `gcloud` CLI is authenticated on the server
   - Update the model API URL in `frontend/src/services/modelService.ts`
5. **OAuth**: Update redirect URLs in Google Console and GitHub OAuth settings
6. **CORS**: Update `origin` in `backend/index.ts` to include the production domain

---

## 📸 Screenshots / UI Flow

### Authentication Flow

```
Landing (Welcome Screen) → Sign Up → Email Verification → Sign In → Home
                          ↗ Google OAuth ↘
                          ↗ GitHub OAuth  ↘ → OAuth Success → Home
                          → Continue as Guest → Home (limited)
```

### Main App Flow

```
Home Page
├── Welcome Screen (no chats)
│   └── "Start a new reflection" button
│
├── Chat View
│   ├── Sidebar (left)
│   │   ├── Reflectify branding
│   │   ├── "+ New Reflection" button
│   │   ├── Search bar
│   │   ├── Chat list (ChatRow items)
│   │   └── Profile Menu (avatar → Settings / Logout)
│   │
│   ├── Chat Area (center)
│   │   ├── Message bubbles (user = emerald, bot = gray)
│   │   ├── Typing indicator (animated dots)
│   │   └── Auto-scroll to bottom
│   │
│   └── Message Input (bottom)
│       ├── Attachment button (📎)
│       ├── Text input (Enter to send)
│       ├── Voice button (🎤)
│       └── Send button (➤)
│
├── Settings Modal
│   ├── General (theme picker)
│   ├── AI Context (key-value CRUD)
│   ├── Privacy (toggles + clear data)
│   └── Language (10-language grid)
│
└── Guest Banner (top, for non-authenticated users)
    ├── Normal: "X of 7 reflections available"
    ├── Running Low: "Only X left" (amber)
    └── Limit Reached: "Pause" + countdown (emerald)
```

---

## 👨‍💻 Author

Built as a Full-Stack Web Application project demonstrating:

- Modern React 19 with TypeScript
- Express.js 5 REST API with Prisma ORM
- AI/ML integration with Google Cloud Vertex AI and LLaMA-4
- Multi-provider OAuth authentication (Google + GitHub)
- Real-time conversational UI with voice input
- Comprehensive state management with Zustand
- Responsive design with Tailwind CSS v4

---

## 📄 License

ISC
