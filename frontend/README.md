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

## 🧪 Testing

This project uses Cypress for E2E testing with **19 major test cases** covering core functionality.

### Prerequisites

- Backend server running on `:4000`
- Model API running on `:8001`
- Frontend dev server running on `:5173`

### Running Tests

```bash
# Start the dev server in one terminal
npm run dev

# Open Cypress Test Runner (interactive) in another terminal
npm run cy:open

# Or run all tests headlessly
npm run cy:run

# Run specific test suite
npm run test:e2e
```

### 📊 Test Results Summary

| Test Suite     | Total Tests | Passing   | Failing | Status        |
| -------------- | ----------- | --------- | ------- | ------------- |
| Authentication | 5           | 5 ✅      | 0       | 100% Pass     |
| Components     | 7           | 7 ✅      | 0       | 100% Pass     |
| Home Page      | 4           | 4 ✅      | 0       | 100% Pass     |
| Settings       | 3           | 3 ✅      | 0       | 100% Pass     |
| **TOTAL**      | **19**      | **19 ✅** | **0**   | **100% Pass** |

### 📋 Test Documentation

For detailed test case documentation including:

- Complete test descriptions
- Test data and preconditions
- Expected results
- Step-by-step test flows
- Known limitations and future improvements

See **[TEST_README.md](TEST_README.md)** for comprehensive test documentation.

---

## � Screenshot Locations

All test screenshots are saved in: `cypress/screenshots/all-tests/`

**Test Results (19 screenshots):**

- All authentication flows working perfectly ✅
- Guest user experience fully functional ✅
- Component rendering and interactions working ✅
- Mobile responsiveness implemented ✅
- Profile and settings access verified ✅

## 🎯 Key Findings

### ✅ **Working Features**

- Complete authentication UI flows (login/register/guest access)
- Guest user limitations and prompts
- Form validation and error handling
- Component rendering and interactions
- Mobile responsive design
- Profile menu and settings access
- Sidebar functionality for all user states

### 📝 **Test Coverage**

- **100% Pass Rate** - All 19 test cases passing
- **Comprehensive Coverage** - Authentication, components, home page, and settings
- **Cross-Platform** - Desktop and mobile viewport testing
- **User State Testing** - Guest and authenticated user flows
- **Error Handling** - Form validation and edge cases

For detailed test case documentation, see **[TEST_README.md](TEST_README.md)**.

**Note:** Chat functionality tests are excluded as requested. Total test coverage focuses on essential user flows and UI components.

## 🚀 Production Build

```bash
npm run build
```

Output is in `dist/` folder. Serve with any static file server.
