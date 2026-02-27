# Reflectify Backend API Documentation

## Base URL

```
http://localhost:4000
```

## Table of Contents

- [Authentication](#authentication)
- [Chat & Conversations](#chat--conversations)
- [Global Context](#global-context)

---

## Authentication

All authentication endpoints are available under both `/api/v1/user` and `/auth` prefixes.

### Register User

**POST** `/api/v1/user/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": { ... }
}
```

---

### Login User

**POST** `/api/v1/user/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

**Note:** JWT token is also set as an HTTP-only cookie.

---

### Google Authentication

**POST** `/api/v1/user/google-auth`

Authenticate using Google OAuth.

**Request Body:**

```json
{
  "credential": "google_oauth_credential"
}
```

**Response:**

```json
{
  "message": "Authentication successful",
  "user": { ... },
  "token": "jwt_token_here"
}
```

---

### GitHub Authentication

**GET** `/api/v1/user/github`

Redirects to GitHub OAuth page for authentication.

---

### GitHub Callback

**GET** `/api/v1/user/github/callback`

GitHub OAuth callback endpoint. Handles the OAuth response from GitHub.

**Query Parameters:**

- `code` - Authorization code from GitHub

---

### Get Profile

**GET** `/api/v1/user/profile`

Get the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    ...
  }
}
```

---

### Logout User

**POST** `/api/v1/user/logout`

Logout the current user and clear authentication cookies.

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

### Forgot Password

**POST** `/api/v1/user/frgt`

Request a password reset link.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset link sent to your email"
}
```

---

### Reset Password

**POST** `/api/v1/user/res/:token`

Reset password using the token received via email.

**URL Parameters:**

- `token` - Password reset token

**Request Body:**

```json
{
  "password": "new_password123"
}
```

**Response:**

```json
{
  "message": "Password reset successful"
}
```

---

### Verify User

**GET** `/api/v1/user/verify/:token`

Verify user account using the verification token sent via email.

**URL Parameters:**

- `token` - Account verification token

**Response:**

```json
{
  "message": "Account verified successfully"
}
```

---

## Chat & Conversations

All chat endpoints require authentication via JWT token.

**Base Path:** `/api/v1/chat`

**Authentication Required:** All routes require a valid JWT token in the Authorization header or cookie.

### Create Conversation

**POST** `/api/v1/chat/conversations`

Create a new conversation.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "My Conversation",
  "messages": []
}
```

**Response:**

```json
{
  "id": "conversation_id",
  "title": "My Conversation",
  "userId": "user_id",
  "createdAt": "2026-02-21T00:00:00.000Z",
  "updatedAt": "2026-02-21T00:00:00.000Z"
}
```

---

### Get All Conversations

**GET** `/api/v1/chat/conversations`

Get all conversations for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "conversation_id",
    "title": "My Conversation",
    "userId": "user_id",
    "createdAt": "2026-02-21T00:00:00.000Z",
    "updatedAt": "2026-02-21T00:00:00.000Z",
    "messages": []
  }
]
```

---

### Get Conversation by ID

**GET** `/api/v1/chat/conversations/:id`

Get a specific conversation by ID.

**URL Parameters:**

- `id` - Conversation ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "id": "conversation_id",
  "title": "My Conversation",
  "userId": "user_id",
  "messages": [
    {
      "id": "message_id",
      "role": "user",
      "content": "Hello!",
      "createdAt": "2026-02-21T00:00:00.000Z"
    }
  ],
  "createdAt": "2026-02-21T00:00:00.000Z",
  "updatedAt": "2026-02-21T00:00:00.000Z"
}
```

---

### Update Conversation

**PUT** `/api/v1/chat/conversations/:id`

Update a conversation's title or other details.

**URL Parameters:**

- `id` - Conversation ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "Updated Conversation Title"
}
```

**Response:**

```json
{
  "id": "conversation_id",
  "title": "Updated Conversation Title",
  "userId": "user_id",
  "createdAt": "2026-02-21T00:00:00.000Z",
  "updatedAt": "2026-02-21T00:00:00.000Z"
}
```

---

### Delete Conversation

**DELETE** `/api/v1/chat/conversations/:id`

Delete a specific conversation.

**URL Parameters:**

- `id` - Conversation ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Conversation deleted successfully"
}
```

---

### Delete All Conversations

**DELETE** `/api/v1/chat/conversations`

Delete all conversations for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "All conversations deleted successfully",
  "count": 5
}
```

---

### Add Message to Conversation

**POST** `/api/v1/chat/conversations/:conversationId/messages`

Add a single message to a conversation.

**URL Parameters:**

- `conversationId` - Conversation ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "role": "user",
  "content": "Hello, how are you?"
}
```

**Response:**

```json
{
  "id": "message_id",
  "conversationId": "conversation_id",
  "role": "user",
  "content": "Hello, how are you?",
  "createdAt": "2026-02-21T00:00:00.000Z"
}
```

---

### Add Multiple Messages (Bulk)

**POST** `/api/v1/chat/conversations/:conversationId/messages/bulk`

Add multiple messages to a conversation at once.

**URL Parameters:**

- `conversationId` - Conversation ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    },
    {
      "role": "assistant",
      "content": "Hi there! How can I help you?"
    }
  ]
}
```

**Response:**

```json
{
  "count": 2,
  "messages": [
    {
      "id": "message_id_1",
      "conversationId": "conversation_id",
      "role": "user",
      "content": "Hello!",
      "createdAt": "2026-02-21T00:00:00.000Z"
    },
    {
      "id": "message_id_2",
      "conversationId": "conversation_id",
      "role": "assistant",
      "content": "Hi there! How can I help you?",
      "createdAt": "2026-02-21T00:00:00.000Z"
    }
  ]
}
```

---

## Global Context

Global context allows storing key-value pairs associated with the authenticated user.

**Base Path:** `/api/v1/global-context`

**Authentication Required:** All routes require a valid JWT token.

### Get All Global Context Items

**GET** `/api/v1/global-context`

Get all global context items for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
[
  {
    "id": "context_id",
    "userId": "user_id",
    "key": "theme",
    "value": "dark",
    "createdAt": "2026-02-21T00:00:00.000Z",
    "updatedAt": "2026-02-21T00:00:00.000Z"
  }
]
```

---

### Add/Update Global Context Item

**POST** `/api/v1/global-context`

Add a new global context item or update an existing one.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "key": "theme",
  "value": "dark"
}
```

**Response:**

```json
{
  "id": "context_id",
  "userId": "user_id",
  "key": "theme",
  "value": "dark",
  "createdAt": "2026-02-21T00:00:00.000Z",
  "updatedAt": "2026-02-21T00:00:00.000Z"
}
```

---

### Delete Global Context Item

**DELETE** `/api/v1/global-context/:key`

Delete a specific global context item by key.

**URL Parameters:**

- `key` - The key of the context item to delete

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Global context item deleted successfully"
}
```

---

## Authentication & Authorization

### JWT Token

Most endpoints require a valid JWT token for authentication. The token can be provided in two ways:

1. **Authorization Header:**

   ```
   Authorization: Bearer <jwt_token>
   ```

2. **HTTP-only Cookie:**
   The token is automatically set as a cookie named `token` upon successful login/registration.

### Protected Routes

The following routes require authentication:

- All `/api/v1/chat/*` endpoints
- All `/api/v1/global-context/*` endpoints
- `/api/v1/user/profile`

### Public Routes

The following routes do NOT require authentication:

- `/api/v1/user/register`
- `/api/v1/user/login`
- `/api/v1/user/google-auth`
- `/api/v1/user/github`
- `/api/v1/user/github/callback`
- `/api/v1/user/logout`
- `/api/v1/user/frgt`
- `/api/v1/user/res/:token`
- `/api/v1/user/verify/:token`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Invalid request data",
  "details": "..."
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "..."
}
```

---

## Environment Variables

Required environment variables:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## CORS Configuration

The API accepts requests from the frontend URL specified in the `FRONTEND_URL` environment variable.

**Allowed Methods:** GET, POST, PUT, DELETE

**Credentials:** Enabled

**Allowed Headers:** Content-Type, Authorization

---

## Notes

- All timestamps are in ISO 8601 format
- All routes use JSON for request and response bodies
- Rate limiting may apply to prevent abuse
- The API supports both guest and authenticated users (with different limitations)

---

## Quick Reference - All Endpoints

### Authentication Endpoints (`/api/v1/user` or `/auth`)

| Method | Endpoint           | Description                    | Auth Required |
| ------ | ------------------ | ------------------------------ | ------------- |
| POST   | `/register`        | Register a new user            | No            |
| POST   | `/login`           | Login with credentials         | No            |
| POST   | `/google-auth`     | Authenticate with Google OAuth | No            |
| GET    | `/github`          | Redirect to GitHub OAuth       | No            |
| GET    | `/github/callback` | GitHub OAuth callback          | No            |
| GET    | `/profile`         | Get user profile               | Yes           |
| POST   | `/logout`          | Logout current user            | No            |
| POST   | `/frgt`            | Request password reset         | No            |
| POST   | `/res/:token`      | Reset password with token      | No            |
| GET    | `/verify/:token`   | Verify user account            | No            |

### Chat & Conversation Endpoints (`/api/v1/chat`)

| Method | Endpoint                                       | Description                   | Auth Required |
| ------ | ---------------------------------------------- | ----------------------------- | ------------- |
| POST   | `/conversations`                               | Create a new conversation     | Yes           |
| GET    | `/conversations`                               | Get all user conversations    | Yes           |
| GET    | `/conversations/:id`                           | Get specific conversation     | Yes           |
| PUT    | `/conversations/:id`                           | Update conversation details   | Yes           |
| DELETE | `/conversations/:id`                           | Delete a conversation         | Yes           |
| DELETE | `/conversations`                               | Delete all conversations      | Yes           |
| POST   | `/conversations/:conversationId/messages`      | Add a message to conversation | Yes           |
| POST   | `/conversations/:conversationId/messages/bulk` | Add multiple messages         | Yes           |

### Global Context Endpoints (`/api/v1/global-context`)

| Method | Endpoint | Description                  | Auth Required |
| ------ | -------- | ---------------------------- | ------------- |
| GET    | `/`      | Get all global context items | Yes           |
| POST   | `/`      | Add or update context item   | Yes           |
| DELETE | `/:key`  | Delete a context item        | Yes           |

### Summary

**Total Endpoints:** 22

- **Authentication:** 10 endpoints
- **Chat & Conversations:** 8 endpoints
- **Global Context:** 3 endpoints
- **Public (No Auth):** 9 endpoints
- **Protected (Auth Required):** 12 endpoints
