# Reflectify Frontend

A modern React-based chat application frontend with emotional AI support, built with TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Features

- **Real-time Chat Interface**: Modern chat UI with message bubbles and typing indicators
- **Emotional AI Integration**: Connects to AI model for contextual emotional responses
- **Authentication**: JWT-based authentication with Google OAuth support
- **Data Synchronization**: Advanced sync system handling local/server data discrepancies
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Offline Support**: Graceful handling of network interruptions
- **Theme Support**: Dark/light mode toggle
- **Privacy Controls**: User data persistence settings

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Backend server** running (see backend README)
- **AI Model server** running (see model README)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm run build:check  # Type check + build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatArea.tsx    # Main chat display
│   │   ├── ChatItem.tsx    # Individual chat item
│   │   ├── MessageInput.tsx # Message input component
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Main chat interface
│   │   ├── Login.tsx       # Authentication
│   │   └── ...
│   ├── services/           # API services
│   │   ├── chatService.ts  # Chat API calls
│   │   ├── modelService.ts # AI model API calls
│   │   └── dataSyncService.ts # Data synchronization
│   ├── zustand/            # State management
│   │   └── store.ts        # Global state store
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | - |

### Build Configuration

The app uses Vite for building. Configuration can be modified in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})
```

## 🔐 Authentication

The app supports two authentication methods:

1. **Email/Password**: Traditional authentication
2. **Google OAuth**: Social login (requires Google client ID)

## 💾 Data Management

### Local Storage
- User preferences (theme, sidebar state)
- Non-authenticated user chats

### Server Storage (Authenticated Users)
- User accounts and sessions
- Chat conversations and messages
- Privacy settings

### Synchronization
- Automatic conflict resolution
- Offline queue for failed operations
- Real-time sync status indicators

## 🎨 Theming

The app supports both light and dark themes:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for extended use

Theme preference is saved locally and synced across sessions.

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoint-based layouts**
- **Touch-friendly interactions**
- **Optimized for all screen sizes**

## 🔍 Development Guidelines

### Code Style
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Component Patterns
- Functional components with hooks
- Custom hooks for shared logic
- Consistent naming conventions
- Prop validation with TypeScript

### State Management
- **Zustand** for global state
- **React hooks** for local state
- **Optimistic updates** for better UX

## 🐛 Troubleshooting

### Common Issues

**Build fails with type errors:**
```bash
npm run build:check
# Fix TypeScript errors
```

**API connection issues:**
- Ensure backend server is running on port 4000
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend

**Styling issues:**
```bash
npm run lint
# Check for Tailwind CSS class conflicts
```

### Development Tips

- Use React DevTools for component debugging
- Enable "Paint flashing" in Chrome DevTools to identify re-renders
- Use the network tab to monitor API calls
- Check browser console for error messages

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Setup for Production

Ensure these environment variables are set in your deployment platform:

```env
VITE_API_URL=https://your-api-domain.com
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## 📄 License

This project is part of the Reflectify application. See the main project README for license information.

---

**Happy coding! 🎉**

For backend setup, see [Backend README](../backend/README.md)
For AI model setup, see [Model README](../model/README.md)