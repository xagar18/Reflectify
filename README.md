# Reflectify 🌟

An AI-powered emotional companion and journaling app that provides empathetic conversations for self-reflection. Powered by **Vertex AI LLaMA-4 Scout 17B** on Google Cloud.

## ✨ Features

- 💬 **AI Chat Companion** - Natural, empathetic conversations
- 📝 **Journaling Support** - Reflect on thoughts and feelings
- 🔐 **Secure Authentication** - JWT + Google OAuth
- 🌓 **Dark/Light Theme** - Beautiful responsive UI
- 👤 **Global Context** - AI remembers your preferences
- 🚀 **Cloud AI** - Powered by Vertex AI (no local GPU needed)

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │     Backend     │     │    Model API    │
│    (React)      │◄───►│   (Node.js)     │◄───►│    (Python)     │
│    :5173        │     │    :4000        │     │    :8001        │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │   Vertex AI     │
                                               │  Google Cloud   │
                                               │ LLaMA-4 Scout   │
                                               └─────────────────┘
```

| Component | Tech Stack                              | Port |
| --------- | --------------------------------------- | ---- |
| Frontend  | React 19, TypeScript, Tailwind, Zustand | 5173 |
| Backend   | Express.js, Prisma, PostgreSQL, JWT     | 4000 |
| Model API | FastAPI, Python, Vertex AI              | 8001 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 12+
- Google Cloud account with Vertex AI enabled

### 1. Clone & Install

```bash
git clone <repository-url>
cd Reflectify

# Install all dependencies
npm install           # Root dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../model && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

### 2. Setup Environment Files

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/reflectify
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

**Model** (`model/.env`):

```env
PROJECT_ID=your-gcp-project-id
REGION=us-central1
ENDPOINT_ID=mg-endpoint-xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
DEDICATED_DOMAIN=mg-endpoint-xxxxx.us-central1-PROJECT_ID.prediction.vertexai.goog
MAX_TOKENS=512
TEMPERATURE=0.7
```

### 3. Setup Google Cloud Auth

```bash
# Install gcloud CLI (if not installed)
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh

# Login
~/google-cloud-sdk/bin/gcloud auth login
```

### 4. Run All Services

```bash
# Terminal 1 - Model API
cd model && source venv/bin/activate && python3 api.py

# Terminal 2 - Backend
cd backend && npm run dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

### 5. Open App

Visit: http://localhost:5173

## 📁 Project Structure

```
Reflectify/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── zustand/      # State management
│   └── package.json
│
├── backend/           # Express.js backend
│   ├── controllers/      # Route handlers
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth middleware
│   ├── prisma/           # Database schema
│   └── package.json
│
├── model/             # Python AI API
│   ├── api.py            # FastAPI server
│   ├── config.py         # Configuration
│   ├── llama_handler.py  # Vertex AI handler
│   └── requirements.txt
│
└── README.md          # This file
```

## 🔄 After Redeploying Vertex AI Model

When you redeploy the model on Vertex AI, update `model/.env`:

1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai/online-prediction/endpoints)
2. Get new `ENDPOINT_ID` and `DEDICATED_DOMAIN`
3. Update `model/.env`
4. Restart model server

See `model/README.md` for detailed instructions.

## 🛠️ Development

### Run Tests

```bash
cd backend && npm test
cd frontend && npm test
```

### Database Migrations

```bash
cd backend && npx prisma migrate dev
```

### Build for Production

```bash
cd frontend && npm run build
```

## 📄 License

MIT License

## 👤 Author

Built with ❤️ for mental wellness and self-reflection.
