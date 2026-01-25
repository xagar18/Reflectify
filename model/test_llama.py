from transformers import pipeline
import torch
from config import MODEL_NAME, HUGGINGFACE_TOKEN, SYSTEM_PROMPT

print("🚀 Loading Llama 3.2 3B Instruct...")
print("⏳ First run will download ~6–7 GB. This is NORMAL.")

generator = pipeline(
    "text-generation",
    model=MODEL_NAME,
    token=HUGGINGFACE_TOKEN,
    torch_dtype=torch.float16,
    device_map="auto"
)

print("✅ Model loaded successfully!\n")

user_input = "I feel overwhelmed and mentally exhausted from everything."

messages = [
    {"role": "system", "content": SYSTEM_PROMPT},
    {"role": "user", "content": user_input}
]

response = generator(
    messages,
    max_new_tokens=150,
    temperature=0.7,
    do_sample=True
)

print("👤 User:", user_input)
print("🤖 Reflectify:", response[0]["generated_text"][-1]["content"])
