@echo off
echo 🚀 Reflectify Model Setup for Windows
echo ======================================
echo.

cd /d "%~dp0"

echo 📦 Step 1: Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ❌ Failed to create virtual environment. Please install Python properly.
    pause
    exit /b 1
)

echo ✅ Virtual environment created successfully!
echo.

echo 🔧 Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ Failed to activate virtual environment.
    pause
    exit /b 1
)

echo ✅ Virtual environment activated!
echo.

echo 📥 Step 3: Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo ✅ All dependencies installed successfully!
echo.

echo 📝 Step 4: Setup complete!
echo.
echo 🎯 To run the server in the future:
echo   1. cd model
echo   2. call venv\Scripts\activate.bat
echo   3. python -m uvicorn api:app --host 0.0.0.0 --port 8001
echo.
echo 🛑 To deactivate: deactivate
echo.
echo ⚠️  IMPORTANT: Create a .env file with your HUGGINGFACE_TOKEN
echo.

pause
