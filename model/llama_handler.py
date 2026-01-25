from transformers import pipeline
import torch
from config import MODEL_NAME, HUGGINGFACE_TOKEN, SYSTEM_PROMPT

generator = None

def get_generator():
    global generator
    if generator is None:
        print("🔁 Initializing Llama model (one-time load)...")
        generator = pipeline(
            "text-generation",
            model=MODEL_NAME,
            token=HUGGINGFACE_TOKEN,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        print("✅ Llama model ready.")
    return generator

def reflect(user_input: str) -> str:
    gen = get_generator()
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_input}
    ]

    response = gen(
        messages,
        max_new_tokens=120,
        temperature=0.6,
        do_sample=True
    )

    return response[0]["generated_text"][-1]["content"]
