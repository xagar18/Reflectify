from transformers import pipeline
import torch
from config import MODEL_NAME, HUGGINGFACE_TOKEN, SYSTEM_PROMPT, CONTEXT_MESSAGE_LIMIT
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
            device=device
        )
        print("✅ Llama model ready.")
    return generator

def reflect(user_input: str, context: List[Dict[str, str]] = None, global_context: str = "") -> str:
    gen = get_generator()

    # Build system prompt - keep it simple for 1B model
    system_content = SYSTEM_PROMPT

    # Add global context if available
    if global_context and global_context.strip():
        system_content += f"\n\nUser Info:\n{global_context}"

    # Build messages
    messages = [
        {"role": "system", "content": system_content}
    ]

    # Add context messages (limit based on env config)
    if context:
        recent_context = context[-CONTEXT_MESSAGE_LIMIT:] if len(context) > CONTEXT_MESSAGE_LIMIT else context
        for msg in recent_context:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if content and content.strip():
                messages.append({
                    "role": "assistant" if role == "assistant" else "user",
                    "content": content.strip()
                })

    # Add current user message
    messages.append({"role": "user", "content": user_input.strip()})

    # Debug logging
    print(f"📝 Messages: {len(messages)}, Context chars: {len(global_context) if global_context else 0}")

    # Generate with parameters tuned for short, focused responses
    response = gen(
        messages,
        max_new_tokens=60,
        temperature=0.5,
        top_p=0.85,
        do_sample=True,
        repetition_penalty=1.2,
        pad_token_id=gen.tokenizer.eos_token_id
    )

    # Extract the assistant's response
    generated = response[0]["generated_text"]

    # Get the last message (assistant's response)
    if isinstance(generated, list):
        assistant_response = generated[-1].get("content", "")
    else:
        # Fallback parsing if format is different
        assistant_response = str(generated)

    # Clean up the response
    assistant_response = assistant_response.strip()

    # If empty, provide a fallback
    if not assistant_response:
        assistant_response = "I'm here to listen. Tell me more about what's on your mind."

    return assistant_response
