# Reflectify Model Setup

## Prerequisites
- Python 3.8 or higher
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>/model
```

### 2. Create Virtual Environment & Install Dependencies

#### Windows:
```cmd
setup.bat
```
This script will:
- Create a virtual environment (`venv/`)
- Activate it automatically
- Install all required packages
- Show you how to run the server

#### Linux/Mac:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the `model/` directory:
```
HUGGINGFACE_TOKEN=your_huggingface_token_here
```

### 4. Run the Server

#### Windows:
```cmd
call venv\Scripts\activate.bat
python -m uvicorn api:app --host 0.0.0.0 --port 8001
```

#### Linux/Mac:
```bash
source venv/bin/activate
python -m uvicorn api:app --host 0.0.0.0 --port 8001
```

## Troubleshooting

### PATH Warnings on Windows
If you see warnings like:
```
WARNING: The scripts ... are installed in 'C:\Users\...\AppData\Local\...' which is not on PATH
```

**Solution:** Always activate the virtual environment before installing packages:
```cmd
call venv\Scripts\activate.bat
pip install -r requirements.txt
```

### Virtual Environment Not Created
The `venv/` folder is ignored by Git (as it should be). You must create it locally:
```cmd
python -m venv venv
```

### Python Not Found
Make sure Python is installed and added to your system PATH.

## API Endpoints
- `GET /health` - Health check
- `POST /api/v1/reflect` - Get AI reflection

## Notes
- First API call takes ~1-2 minutes to load the model
- Subsequent calls are faster (~10-30 seconds on CPU)
- The model runs on CPU by default (GPU recommended for better performance)