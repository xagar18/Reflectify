# Reflectify Frontend

Modern React chat interface for the Reflectify AI companion app.

## 🚀 Features

- 💬 **Real-time Chat** - Smooth chat interface with typing indicators
- 🎨 **Modern UI** - Tailwind CSS with dark/light theme
- 🔐 **Authentication** - Login, Register, Google OAuth
- 📱 **Responsive** - Works on desktop and mobile
- 💾 **State Management** - Zustand for global state
- ⚡ **Fast** - Vite for instant HMR

## 🛠️ Tech Stack

| Technology      | Purpose          |
| --------------- | ---------------- |
| React 19        | UI Framework     |
| TypeScript      | Type Safety      |
| Vite            | Build Tool       |
| Tailwind CSS    | Styling          |
| Zustand         | State Management |
| React Router    | Routing          |
| Axios           | HTTP Client      |
| React Hot Toast | Notifications    |

## 📋 Prerequisites

- Node.js 18+
- Backend server running on `:4000`
- Model API running on `:8001`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create `.env` file:

```env
VITE_API_URL=http://localhost:4000
VITE_MODEL_URL=http://localhost:8001
```

### 3. Run Development Server

```bash
npm run dev
```

Open: http://localhost:5173

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ChatArea.tsx     # Chat message display
│   │   ├── MessageInput.tsx # Input with attachments
│   │   ├── Sidebar.tsx      # Conversation list
│   │   ├── Login.tsx        # Login form
│   │   ├── Register.tsx     # Registration form
│   │   └── Settings.tsx     # User settings
│   │
│   ├── pages/           # Page components
│   │   ├── Home.tsx         # Main chat page
│   │   └── OAuthSuccess.tsx # OAuth callback
│   │
│   ├── services/        # API services
│   │   ├── chatService.ts       # Chat API calls
│   │   ├── modelService.ts      # AI model calls
│   │   └── globalContextService.ts
│   │
│   ├── zustand/         # State management
│   │   └── store.ts         # Global store
│   │
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
│
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## 🎨 Key Components

### ChatArea

Displays chat messages with:

- User/bot message bubbles
- Markdown-like formatting (bullet points, line breaks)
- Typing indicator
- Auto-scroll to latest message

### MessageInput

Input field with:

- Multi-line support
- File attachments
- Voice input (speech-to-text)
- Send button

### Sidebar

Conversation management:

- List of conversations
- Create new chat
- Delete conversations
- Search/filter

## 🔧 Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 API Integration

The frontend connects to:

| Service | URL                    | Purpose               |
| ------- | ---------------------- | --------------------- |
| Backend | `:4000/api/v1/*`       | Auth, Chat, User data |
| Model   | `:8001/api/v1/reflect` | AI responses          |

## 🎯 Environment Variables

| Variable         | Description     | Default                 |
| ---------------- | --------------- | ----------------------- |
| `VITE_API_URL`   | Backend API URL | `http://localhost:4000` |
| `VITE_MODEL_URL` | Model API URL   | `http://localhost:8001` |

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚀 Production Build

```bash
npm run build
```

Output is in `dist/` folder. Serve with any static file server.
