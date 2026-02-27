# Reflectify Model API

Powered by **RunPod Qwen** on RunPod.

## Quick Start

```bash
cd model
source venv/bin/activate
python3 api.py
```

API runs at `http://localhost:8001`

---

## Full Setup (First Time)

### 1. Install Dependencies

```bash
cd model
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Install & Authenticate Google Cloud CLI

```bash
# Install gcloud CLI
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh

# Login with your Google account
~/google-cloud-sdk/bin/gcloud auth login
```

### 3. Configure .env

Copy `.env.example` to `.env` and update values (see below).

---

## 🔄 After Redeploying Model (IMPORTANT!)

When you undeploy and redeploy the model on Vertex AI, you'll get a **NEW ENDPOINT**.

### What Changes After Redeploy:

| Value              | Changes?   | Where to Find                        |
| ------------------ | ---------- | ------------------------------------ |
| `PROJECT_ID`       | ❌ No      | Same project                         |
| `REGION`           | ❌ No      | Same region                          |
| `ENDPOINT_ID`      | ✅ **YES** | Vertex AI Console → Endpoints        |
| `DEDICATED_DOMAIN` | ✅ **YES** | Vertex AI Console → Endpoint Details |

### How to Update After Redeploy:

1. **Go to Vertex AI Console:**

   ```
   https://console.cloud.google.com/vertex-ai/online-prediction/endpoints?project=YOUR_PROJECT_ID
   ```

2. **Click on your new endpoint** and find:
   - **Endpoint ID:** `mg-endpoint-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
   - **Dedicated DNS:** Click "Sample Request" → Look for the domain

3. **Update `.env`:**

   ```env
   ENDPOINT_ID=mg-endpoint-YOUR-NEW-ENDPOINT-ID
   DEDICATED_DOMAIN=mg-endpoint-YOUR-NEW-ENDPOINT-ID.us-central1-PROJECT_ID.prediction.vertexai.goog
   ```

4. **Restart the server:**

   ```bash
   # Kill old server
   pkill -f "python3 api.py"

   # Start new
   source venv/bin/activate && python3 api.py
   ```

---

## .env Configuration

```env
# Vertex AI Configuration
PROJECT_ID=10304563589
REGION=us-central1
ENDPOINT_ID=mg-endpoint-XXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
DEDICATED_DOMAIN=mg-endpoint-XXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX.us-central1-10304563589.prediction.vertexai.goog

# Model Parameters
CONTEXT_MESSAGE_LIMIT=10    # Max conversation history
MAX_TOKENS=256              # Max response length
TEMPERATURE=0.7             # Creativity (0.0-1.0)
TOP_P=0.9                   # Nucleus sampling

# Server Config
PORT=8001
```

---

## API Endpoints

### POST /api/v1/reflect

Generate a reflection response.

**Request:**

```json
{
  "message": "I had a stressful day today",
  "context": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "global_context": "User name: John\nAge: 25"
}
```

**Response:**

```json
{
  "response": "That can be really tough. What was the most overwhelming part of your day?",
  "debug_info": {
    "context_messages_count": 2,
    "global_context_length": 25,
    "has_global_context": true
  }
}
```

### GET /health

Health check endpoint.

```json
{ "status": "healthy" }
```

---

## Architecture

```
Frontend (React) :5173
    ↓
Backend (Express) :4000
    ↓
Model API (FastAPI) :8001  ← This server
    ↓
RunPod
    ↓
Qwen
```

---

## Troubleshooting

### "Failed to get access token"

```bash
~/google-cloud-sdk/bin/gcloud auth login
```

### "Connection refused" / "Endpoint not found"

- Check if endpoint is deployed in Vertex AI Console
- Verify `ENDPOINT_ID` and `DEDICATED_DOMAIN` in `.env`

### "Model is slow to respond"

- First request after deployment takes ~30s (cold start)
- Subsequent requests are faster (~2-5s)

### Check if endpoint is active

```bash
curl -s -H "Authorization: Bearer $(~/google-cloud-sdk/bin/gcloud auth print-access-token)" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/endpoints/ENDPOINT_ID" \
  | grep -i "deployedModels"
```
