# Reflectify Backend

A robust Node.js/Express API server with PostgreSQL database, JWT authentication, and comprehensive chat functionality. Built with modern JavaScript, Prisma ORM, and secure authentication patterns.

## 🚀 Features

- **RESTful API**: Well-structured endpoints for chat operations
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Google OAuth**: Social login integration
- **PostgreSQL Database**: Reliable data persistence with Prisma ORM
- **Email Services**: Password reset and account verification
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Cross-origin resource sharing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Structured error responses
- **Database Migrations**: Version-controlled schema changes

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM and migration tool
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email services
- **Google Auth Library** - OAuth integration
- **Cookie Parser** - HTTP cookie handling
- **CORS** - Cross-origin support

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ database
- **Git** for version control

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL and create database
createdb reflectify_db

# Or use your preferred method to create a PostgreSQL database
```

#### Option B: Prisma Postgres (Cloud)

```bash
# Use Prisma's cloud database service
npx prisma platform login
npx prisma postgres create
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reflectify_db"

# JWT Secrets (generate random strings)
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_REFRESH_SECRET="your_super_secret_refresh_key_here"

# Email Configuration (for password reset)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"
EMAIL_FROM="noreply@reflectify.com"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Server Configuration
PORT=4000
NODE_ENV="development"
```

### 4. Database Migration

```bash
# Generate Prisma client
npm run generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)
npm start            # Production start
npm run generate     # Generate Prisma client

# Database
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create and apply migrations
npx prisma db push   # Push schema changes (dev only)
npx prisma db seed   # Seed database

# Testing
npm test             # Run tests (when implemented)
```

## 🏗️ Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection wrapper
├── controllers/
│   ├── auth.controller.js # Authentication logic
│   └── chat.controller.js # Chat operations
├── middlewares/
│   └── auth.middleware.js # JWT authentication middleware
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── routes/
│   ├── auth.routes.js     # Authentication endpoints
│   └── chat.routes.js     # Chat endpoints
├── services/
│   └── mailservice.js     # Email sending service
├── utils/                 # Utility functions
├── index.js              # Application entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

| Variable               | Description                  | Required | Default       |
| ---------------------- | ---------------------------- | -------- | ------------- |
| `DATABASE_URL`         | PostgreSQL connection string | Yes      | -             |
| `JWT_SECRET`           | JWT signing secret           | Yes      | -             |
| `JWT_REFRESH_SECRET`   | Refresh token secret         | Yes      | -             |
| `EMAIL_USER`           | SMTP email username          | No       | -             |
| `EMAIL_PASS`           | SMTP email password          | No       | -             |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | No       | -             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   | No       | -             |
| `PORT`                 | Server port                  | No       | `4000`        |
| `NODE_ENV`             | Environment mode             | No       | `development` |

### Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts with authentication
- **Conversation**: Chat conversations
- **Message**: Individual chat messages

See `prisma/schema.prisma` for the complete schema definition.

## 🔐 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint           | Description            | Auth Required |
| ------ | ------------------ | ---------------------- | ------------- |
| POST   | `/register`        | User registration      | No            |
| POST   | `/login`           | User login             | No            |
| POST   | `/logout`          | User logout            | Yes           |
| POST   | `/refresh`         | Refresh access token   | Yes           |
| POST   | `/verify-email`    | Verify email address   | No            |
| POST   | `/forgot-password` | Request password reset | No            |
| POST   | `/reset-password`  | Reset password         | No            |
| GET    | `/google`          | Google OAuth login     | No            |
| GET    | `/google/callback` | Google OAuth callback  | No            |

### Chat (`/api/v1/chat`)

| Method | Endpoint                           | Description               | Auth Required |
| ------ | ---------------------------------- | ------------------------- | ------------- |
| GET    | `/conversations`                   | Get user conversations    | Yes           |
| POST   | `/conversations`                   | Create new conversation   | Yes           |
| GET    | `/conversations/:id`               | Get specific conversation | Yes           |
| PUT    | `/conversations/:id`               | Update conversation title | Yes           |
| DELETE | `/conversations/:id`               | Delete conversation       | Yes           |
| DELETE | `/conversations`                   | Delete all conversations  | Yes           |
| POST   | `/conversations/:id/messages`      | Add single message        | Yes           |
| POST   | `/conversations/:id/messages/bulk` | Add multiple messages     | Yes           |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Short-lived access tokens with refresh tokens
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Request sanitization and validation
- **Rate Limiting**: Protection against brute force attacks
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Protection**: Input sanitization

## 📧 Email Configuration

For password reset functionality, configure SMTP settings:

```env
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_password"  # Use app passwords for Gmail
EMAIL_FROM="noreply@reflectify.com"
```

### Gmail App Passwords

1. Enable 2FA on your Google account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in `EMAIL_PASS`

## 🔑 Authentication Flow

### Traditional Login

1. User provides email/password
2. Server validates credentials
3. JWT access token and refresh token issued
4. Access token used for API requests
5. Refresh token used to get new access tokens

### Google OAuth

1. User clicks Google login
2. Redirected to Google OAuth
3. Google returns authorization code
4. Server exchanges code for user info
5. User account created/found in database
6. JWT tokens issued

## 🗄️ Database Management

### Migrations

```bash
# Create new migration
npx prisma migrate dev --name descriptive_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Database GUI

```bash
npx prisma studio
```

Opens a web interface at `http://localhost:5555` for database management.

### Backup/Restore

```bash
# Backup
pg_dump reflectify_db > backup.sql

# Restore
psql reflectify_db < backup.sql
```

## 🧪 Testing

### Manual Testing

Use tools like Postman or Insomnia to test API endpoints:

1. **Authentication flow**
2. **Chat operations**
3. **Error handling**

### Automated Testing

```bash
# Run tests (when implemented)
npm test

# With coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, random JWT secrets
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Test all endpoints

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

**Database connection fails:**

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U username -d reflectify_db
```

**Prisma client issues:**

```bash
# Regenerate Prisma client
npm run generate

# Reset database
npx prisma migrate reset
```

**Port already in use:**

```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

**JWT token errors:**

- Verify `JWT_SECRET` is set
- Check token expiration times
- Ensure tokens aren't corrupted

### Logs and Debugging

```bash
# View application logs
tail -f logs/app.log

# Debug mode
DEBUG=* npm run dev
```

## 📊 Monitoring

### Health Checks

The API includes health check endpoints:

- `GET /health` - Basic health check

### Performance

- Monitor database query performance
- Set up response time alerts
- Track error rates by endpoint

## 🤝 API Documentation

### Request/Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Authentication Headers

Include JWT token in requests:

```
Authorization: Bearer <your_jwt_token>
```

## 🔄 Data Flow

1. **Client Request** → Express middleware (CORS, auth, validation)
2. **Controller** → Business logic and database operations
3. **Prisma ORM** → SQL queries to PostgreSQL
4. **Response** → Formatted JSON back to client

## 📈 Scaling Considerations

- **Database Indexing**: Add indexes for frequently queried fields
- **Caching**: Implement Redis for session/token caching
- **Load Balancing**: Use nginx or cloud load balancers
- **Database Replication**: Set up read replicas for high traffic
- **CDN**: Use for static assets and file uploads

## 🤝 Contributing

1. Follow existing code patterns
2. Add proper error handling
3. Update API documentation
4. Test thoroughly before committing
5. Use meaningful commit messages

## 📄 License

This project is part of the Reflectify application. See the main project README for license information.

---

**Happy coding! 🎉**

For frontend setup, see [Frontend README](../frontend/README.md)
For AI model setup, see [Model README](../model/README.md)
