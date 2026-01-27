# Reflectify AI Model Server

A FastAPI-based AI model server using Llama 3.1 for emotional intelligence and reflective conversations. Provides contextual AI responses for the Reflectify chat application.

## 🚀 Features

- **Llama 3.1 Integration**: Advanced language model for emotional AI
- **FastAPI Framework**: High-performance async API server
- **GPU/CPU Support**: Automatic hardware detection and optimization
- **Contextual Responses**: Emotion-aware conversation handling
- **Health Monitoring**: Built-in health checks and metrics
- **Error Handling**: Robust error recovery and logging
- **Security**: Input validation and rate limiting
- **Docker Support**: Containerized deployment ready

## 🛠️ Tech Stack

- **Python 3.8+** - Runtime environment
- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **Llama 3.1** - Language model via transformers
- **PyTorch** - Deep learning framework
- **Hugging Face Transformers** - Model loading and inference
- **Pydantic** - Data validation
- **python-multipart** - File upload handling

## 📋 Prerequisites

- **Python 3.8 or higher**
- **Git** for version control
- **Hugging Face account** (for model access)
- **GPU recommended** (NVIDIA with CUDA for best performance)

### Hardware Requirements

**Minimum (CPU-only):**
- 8GB RAM
- 4-core CPU
- 10GB free disk space

**Recommended (GPU):**
- 16GB+ RAM
- NVIDIA GPU with 8GB+ VRAM
- CUDA 11.8+ compatible
- 20GB+ free disk space

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd <project-directory>/model
```

### 2. Environment Setup

Create a `.env` file in the `model/` directory:

```env
# Required: Hugging Face API token for model access
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Optional: Server configuration
HOST=0.0.0.0
PORT=8001
WORKERS=1
```

### 3. Automated Setup (Windows)

```cmd
# Run the automated setup script
setup.bat
```

This script will:
- Create Python virtual environment
- Install all dependencies
- Set up the environment
- Provide instructions for running the server

### 4. Manual Setup (Linux/Mac)

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Get Hugging Face Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Create an account or sign in
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token to your `.env` file

### 6. Run the Server

#### Development Mode
```bash
# Activate virtual environment first
source venv/bin/activate  # Windows: venv\Scripts\activate

# Start server
python -m uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

#### Production Mode
```bash
# Using uvicorn directly
uvicorn api:app --host 0.0.0.0 --port 8001 --workers 4

# Or using gunicorn (Linux/Mac)
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

## 📜 Available Scripts

```bash
# Development
python -m uvicorn api:app --reload    # Auto-reload on changes
python api.py                         # Direct Python execution

# Production
uvicorn api:app --workers 4           # Multi-worker production
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker  # Linux/Mac

# Testing
python test_llama.py                  # Test Llama model loading
python test_gpu.py                    # Test GPU availability
```

## 🏗️ Project Structure

```
model/
├── api.py                    # FastAPI application and endpoints
├── config.py                 # Configuration and environment variables
├── llama_handler.py          # Llama model wrapper and inference logic
├── requirements.txt          # Python dependencies
├── setup.bat                # Windows setup script
├── test_llama.py            # Model loading test
├── test_gpu.py              # GPU detection test
├── .env                     # Environment variables (create this)
├── .gitignore              # Git ignore rules
└── README.md               # This documentation
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `HUGGINGFACE_TOKEN` | Hugging Face API token | Yes | - |
| `HOST` | Server host | No | `0.0.0.0` |
| `PORT` | Server port | No | `8001` |
| `WORKERS` | Number of worker processes | No | `1` |

### Model Configuration

The model is configured in `config.py`:

```python
MODEL_CONFIG = {
    "model_name": "meta-llama/Llama-3.1-8B-Instruct",
    "max_tokens": 512,
    "temperature": 0.7,
    "top_p": 0.9,
    "device": "auto",  # auto, cpu, or cuda
}
```

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

### AI Reflection
```http
POST /api/v1/reflect
Content-Type: application/json

{
  "message": "I'm feeling overwhelmed with work",
  "context": "User is sharing work stress"
}
```

Response:
```json
{
  "response": "I hear that work can feel overwhelming sometimes. It's completely valid to feel this way when there's a lot on your plate. Would you like to talk about what's contributing to this feeling?",
  "emotion_detected": "stress",
  "confidence": 0.89
}
```

### Interactive API Documentation

When the server is running, visit:
- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

## 🎯 AI Model Details

### Llama 3.1 8B Instruct

- **Size**: 8 billion parameters
- **Context Window**: 128K tokens
- **Training Data**: Diverse internet text
- **Fine-tuning**: Instruction following and safety alignment
- **Capabilities**: Emotional intelligence, contextual understanding, empathetic responses

### Performance Expectations

**CPU-only (Intel i7/AMD Ryzen 7):**
- Model load time: 2-3 minutes
- Response time: 30-60 seconds per message
- Memory usage: 8-12GB RAM

**GPU (NVIDIA RTX 3060+):**
- Model load time: 30-60 seconds
- Response time: 5-15 seconds per message
- Memory usage: 6-8GB VRAM + 4GB RAM

## 🐛 Troubleshooting

### Common Issues

**"CUDA out of memory"**
```
Solution: Reduce model size or use CPU
# In config.py, change device to "cpu"
DEVICE = "cpu"
```

**"Model loading failed"**
```
Check:
1. Valid Hugging Face token
2. Sufficient disk space (20GB+)
3. Stable internet connection
4. Correct permissions
```

**"Port already in use"**
```bash
# Find process using port 8001
lsof -i :8001
# Kill the process
kill -9 <PID>
```

**Slow responses on CPU**
```
Expected behavior. Consider:
1. Using a smaller model
2. GPU acceleration
3. Response caching
4. Background processing
```

### Testing Scripts

```bash
# Test GPU availability
python test_gpu.py

# Test model loading
python test_llama.py

# Test API endpoints
curl -X GET http://localhost:8001/health
```

### Logs and Debugging

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
python -m uvicorn api:app --log-level debug

# View logs
tail -f /var/log/reflectify/model.log
```

## 🚀 Deployment

### Production Checklist

- [ ] Set production environment variables
- [ ] Use strong Hugging Face token
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Configure log rotation
- [ ] Set up automatic restarts
- [ ] Test with production load

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

EXPOSE 8001

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8001"]
```

Build and run:
```bash
docker build -t reflectify-model .
docker run -p 8001:8001 --env-file .env reflectify-model
```

### Cloud Deployment

**Recommended platforms:**
- **AWS EC2** with GPU instances (P3, G4dn)
- **Google Cloud AI** with A100 GPUs
- **Azure ML** with NVIDIA VMs
- **Hugging Face Spaces** (free tier available)

## 🔒 Security Considerations

- **API Key Protection**: Never commit Hugging Face tokens
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Built-in request rate limiting
- **HTTPS**: Use HTTPS in production
- **Access Control**: Configure firewall rules
- **Monitoring**: Log suspicious activities

## 📊 Monitoring and Metrics

### Health Endpoints

- `GET /health` - Overall health status
- `GET /metrics` - Prometheus metrics (if enabled)

### Key Metrics to Monitor

- Response time per request
- Model inference time
- Memory usage (RAM/VRAM)
- Error rate by endpoint
- Token usage statistics

## 🔄 Model Updates

### Updating Llama Model

```bash
# Pull latest model version
# Edit config.py with new model name
MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct-v2"

# Restart server
# Model will auto-download on next startup
```

### Performance Optimization

1. **Quantization**: Reduce model precision for faster inference
2. **Caching**: Cache frequent responses
3. **Batch Processing**: Process multiple requests together
4. **Model Distillation**: Use smaller distilled models

## 🤝 Integration

### With Frontend

The model server integrates with the React frontend through the model service:

```typescript
// frontend/src/services/modelService.ts
const response = await fetch('http://localhost:8001/api/v1/reflect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
});
```

### With Backend

The backend can proxy requests or call the model server directly for server-side processing.

## 📚 Advanced Usage

### Custom Prompts

Modify `llama_handler.py` to customize the AI personality and response style:

```python
SYSTEM_PROMPT = """
You are an empathetic AI companion focused on emotional intelligence.
Always respond with:
1. Acknowledgment of feelings
2. Gentle exploration questions
3. Supportive suggestions
"""
```

### Model Fine-tuning

For custom emotional responses:

1. Prepare training data (conversations)
2. Use Hugging Face PEFT for efficient fine-tuning
3. Deploy fine-tuned model
4. Update configuration

## 🆘 Support

### Getting Help

1. Check the troubleshooting section above
2. Review server logs for error messages
3. Test with the provided test scripts
4. Check Hugging Face model status

### Common Support Questions

**Q: Model takes too long to load**
A: This is normal for large models. Use GPU for faster loading.

**Q: Out of memory errors**
A: Reduce batch size or use CPU mode for smaller models.

**Q: Poor response quality**
A: Adjust temperature and top_p parameters in config.py

## 📄 License

This project is part of the Reflectify application. See the main project README for license information.

---

**Happy reflecting! 🌟**

For frontend setup, see [Frontend README](../frontend/README.md)
For backend setup, see [Backend README](../backend/README.md)
