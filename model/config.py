import os
from dotenv import load_dotenv

load_dotenv()

# Using 1B model to fit entirely in GTX 1650's 4GB VRAM for faster inference
MODEL_NAME = "meta-llama/Llama-3.2-1B-Instruct"
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# Context message limit for conversation history
CONTEXT_MESSAGE_LIMIT = int(os.getenv("CONTEXT_MESSAGE_LIMIT", "10"))

# Keep the system prompt simple and direct for 1B model
SYSTEM_PROMPT = """You are Reflectify, a supportive emotional companion.

Rules:
- Keep responses SHORT (1-2 sentences max)
- If user asks about themselves (name, age, etc.), answer directly from User Info
- Be warm but concise
- Don't over-explain or ramble"""
