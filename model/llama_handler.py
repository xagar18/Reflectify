from transformers import pipeline
import torch
from config import MODEL_NAME, HUGGINGFACE_TOKEN, SYSTEM_PROMPT
from typing import List, Dict

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

def reflect(user_input: str, context: List[Dict[str, str]] = None, global_context: str = "") -> str:
    gen = get_generator()

    # Build system prompt with global context integrated
    system_content = SYSTEM_PROMPT

    # Add global context if available - integrate directly into system prompt
    if global_context and global_context.strip():
        system_content += f"\n\nIMPORTANT - USER'S PERSONAL INFORMATION (use this to personalize responses):\n{global_context}"

    # Build messages with system prompt
    messages = [
        {"role": "system", "content": system_content}
    ]

    # Add context messages (previous conversation)
    if context:
        for msg in context:
            messages.append({
                "role": msg["role"] if msg["role"] != "assistant" else "assistant",
                "content": msg["content"]
            })

    # Add current user message
    messages.append({"role": "user", "content": user_input})

    response = gen(
        messages,
        max_new_tokens=100,
        temperature=0.6,
        do_sample=True,
        pad_token_id=gen.tokenizer.eos_token_id
    )

    return response[0]["generated_text"][-1]["content"]
