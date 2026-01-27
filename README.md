# Reflectify 🌟

An AI-powered emotional intelligence chat application that provides empathetic conversations and reflective experiences. Built with modern web technologies and advanced language models for meaningful human-AI interactions.

## ✨ What is Reflectify?

Reflectify is a sophisticated chat application designed to:
- **Foster Emotional Intelligence**: AI-powered conversations that acknowledge and explore feelings
- **Provide Safe Space**: A judgment-free environment for self-reflection
- **Offer Contextual Support**: Intelligent responses based on emotional context
- **Ensure Privacy**: Secure, user-controlled data management
- **Enable Personal Growth**: Through guided reflective conversations

## 🏗️ Architecture

Reflectify is a full-stack application with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     AI Model    │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Express.js    │    │ • FastAPI       │
│ • TypeScript    │    │ • PostgreSQL    │    │ • Llama 3.1     │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • PyTorch       │
│ • Zustand       │    │ • Prisma ORM    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Overview

- **Frontend**: Modern React SPA with real-time chat interface
- **Backend**: RESTful API server with authentication and data persistence
- **AI Model**: Llama 3.1-powered emotional intelligence service

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **PostgreSQL** 12+ database
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reflectify
```

### 2. Environment Setup

Create environment files for each component:

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/reflectify_db"
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_REFRESH_SECRET="your_super_secret_refresh_key_here"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
PORT=4000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

#### Model (.env)
```env
HUGGINGFACE_TOKEN=your_huggingface_token_here
HOST=0.0.0.0
PORT=8001
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb reflectify_db

# Or use Prisma Postgres (cloud database)
npx prisma platform login
npx prisma postgres create
```

### 4. Install Dependencies

#### Backend
```bash
cd backend
npm install
npm run generate  # Generate Prisma client
npx prisma migrate dev --name init
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### AI Model
```bash
cd ../model
# Windows
setup.bat
# Linux/Mac
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 5. Start All Services

#### Terminal 1: AI Model Server
```bash
cd model
source venv/bin/activate  # Windows: venv\Scripts\activate
python -m uvicorn api:app --host 0.0.0.0 --port 8001
```

#### Terminal 2: Backend API Server
```bash
cd backend
npm run dev
```

#### Terminal 3: Frontend Development Server
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **AI Model API**: http://localhost:8001
- **Database GUI**: `npx prisma studio` (http://localhost:5555)

## 📜 Available Scripts

### Root Level Scripts
```bash
npm run build    # Build all components for production
npm run start    # Start backend in production mode
```

### Frontend Scripts
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Code linting
```

### Backend Scripts
```bash
cd backend
npm run dev      # Development with nodemon
npm start        # Production server
npm run generate # Generate Prisma client
```

### Model Scripts
```bash
cd model
python -m uvicorn api:app --reload    # Development server
python test_llama.py                  # Test model loading
python test_gpu.py                    # Test GPU availability
```

## 🔧 Configuration

### Authentication Setup

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4000/api/v1/auth/google/callback`
   - `https://yourdomain.com/api/v1/auth/google/callback`

#### Email Service (Optional)
For password reset functionality:
1. Use Gmail with app passwords
2. Or configure SMTP settings in backend `.env`

### Hugging Face Setup
1. Create account at [Hugging Face](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create token with "Read" permissions
4. Add to model `.env` file

## 🎯 Key Features

### Emotional AI Conversations
- Context-aware responses based on user emotions
- Empathetic and supportive dialogue
- Reflective conversation guidance

### Advanced Data Management
- **Conflict Resolution**: Automatic sync between local and server data
- **Offline Support**: Queue operations when offline
- **Privacy Controls**: User-managed data persistence
- **Real-time Sync**: Live synchronization indicators

### Security & Privacy
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure API endpoints

### User Experience
- **Responsive Design**: Works on all devices
- **Dark/Light Themes**: User preference saving
- **Real-time Updates**: Live typing indicators
- **Lazy Loading**: Efficient conversation loading
- **Intuitive UI**: Clean, modern interface

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM:

- **User**: Account information and authentication
- **Conversation**: Chat conversations with metadata
- **Message**: Individual chat messages with roles

## 🔌 API Architecture

### RESTful Endpoints
- **Authentication**: `/api/v1/auth/*`
- **Chat Operations**: `/api/v1/chat/*`
- **Health Checks**: `/health`

### AI Integration
- **Model Server**: Dedicated FastAPI service
- **Health Monitoring**: Automatic model status checks
- **Fallback Handling**: Graceful degradation

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in all environments
- [ ] Use strong, random JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Test all integrations

### Recommended Deployment Stack

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or cloud VM
- **Database**: Supabase, PlanetScale, or managed PostgreSQL
- **AI Model**: AWS EC2 with GPU, Google Cloud AI, or Hugging Face Spaces

### Docker Support

Each component includes Docker support for containerized deployment.

## 🧪 Testing

### Manual Testing
1. Test user registration and login
2. Create conversations and send messages
3. Test AI responses for emotional content
4. Verify data persistence and sync
5. Test offline/online scenarios

### API Testing
```bash
# Test backend API
curl -X GET http://localhost:4000/health

# Test model API
curl -X GET http://localhost:8001/health
```

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**
- Check port availability (4000, 5173, 8001)
- Verify environment variables
- Check database connectivity

**AI model issues:**
- Ensure Hugging Face token is valid
- Check available disk space (20GB+ needed)
- Verify GPU/CPU compatibility

**Database errors:**
- Run `npx prisma migrate deploy`
- Check database credentials
- Verify PostgreSQL is running

**Build failures:**
- Clear node_modules and reinstall
- Check Node.js and Python versions
- Verify all dependencies are installed

### Getting Help

1. Check component-specific READMEs
2. Review server logs for error details
3. Test individual components in isolation
4. Check GitHub issues for known problems

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Follow existing code patterns
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed
- Respect the architectural patterns

## 📊 Performance

### Expected Performance

**Development Environment:**
- Frontend: < 100ms response times
- Backend: < 200ms API response times
- AI Model: 5-60 seconds per response (GPU/CPU)

**Production Optimizations:**
- Database indexing and query optimization
- Redis caching for sessions
- CDN for static assets
- Load balancing for high traffic

## 🔒 Security

### Implemented Security Measures

- **Authentication**: JWT with secure secrets
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted passwords and tokens
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS**: Configured allowed origins
- **HTTPS**: SSL/TLS encryption in production

### Security Best Practices

- Never commit secrets to version control
- Use environment variables for configuration
- Regularly update dependencies
- Monitor for security vulnerabilities
- Implement proper logging without exposing sensitive data

## 📈 Roadmap

### Planned Features

- [ ] Voice input/output support
- [ ] Multi-language support
- [ ] Advanced emotion analytics
- [ ] Group conversations
- [ ] Integration with mental health resources
- [ ] Mobile applications (React Native)
- [ ] Advanced AI model customization

### Technical Improvements

- [ ] GraphQL API implementation
- [ ] Real-time WebSocket support
- [ ] Advanced caching strategies
- [ ] Microservices architecture
- [ ] Automated testing suite

## 📄 License

This project is licensed under the MIT License. See individual component READMEs for more details.

## 🙏 Acknowledgments

- **Meta** for Llama 3.1 model
- **Hugging Face** for model hosting and transformers library
- **Open source community** for the amazing tools and libraries

## 📞 Support

For support and questions:

- Check the [Issues](https://github.com/yourusername/reflectify/issues) page
- Review component-specific documentation
- Join our community discussions

---

**Built with ❤️ for emotional intelligence and meaningful conversations**

Ready to start your reflective journey? Follow the setup instructions above and begin exploring the power of AI-assisted emotional intelligence! 🌟