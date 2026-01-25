#!/bin/bash

# Reflectify Model Server Launcher
echo "Starting Reflectify Model Server..."
echo "API will be available at: http://localhost:8001"
echo "Loading Llama 3.2 3B model (first run takes ~1 minute)..."
echo ""

cd /home/sagar/Desktop/CodeHub/FULL\ STACK/Reflectify/model
nohup /bin/python3 -m uvicorn api:app --host 0.0.0.0 --port 8001 > server.log 2>&1 &

echo "Model server started in background!"
echo "Check server.log for any issues"
echo "To stop: pkill -f uvicorn"
echo ""
