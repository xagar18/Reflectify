from transformers import pipeline
import torch
from config import MODEL_NAME, HUGGINGFACE_TOKEN, SYSTEM_PROMPT

generator = None

def get_generator():
    global generator
    if generator is None:
        print("🔁 Initializing Llama model (one-time load)...")

        # Check CUDA availability
        if torch.cuda.is_available():
            print(f"🎮 Using GPU: {torch.cuda.get_device_name(0)}")
            print(f"📊 VRAM Available: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
            device = 0  # Force GPU only
        else:
            print("⚠️ CUDA not available, using CPU")
            device = -1  # CPU fallback

        generator = pipeline(
            "text-generation",
            model=MODEL_NAME,
            token=HUGGINGFACE_TOKEN,
            torch_dtype=torch.float16,
            device=device  # Force specific device instead of auto
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
