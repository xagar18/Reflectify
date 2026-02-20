"""
RunPod Qwen Handler for Reflectify
Uses RunPod vLLM OpenAI-compatible endpoint
"""

import requests
from typing import List, Dict
from config import (
    RUNPOD_URL,
    SYSTEM_PROMPT,
    CONTEXT_MESSAGE_LIMIT,
    MAX_TOKENS,
    TEMPERATURE,
    TOP_P,
    USE_INTENT_MATCHING
)
from intent_matcher import get_intent_response


def reflect(user_input: str, context: List[Dict[str, str]] = None, global_context: str = "") -> str:
    """
    Generate a reflection response using RunPod Qwen model.

    Args:
        user_input: The user's message
        context: Previous conversation messages
        global_context: User's global context (name, preferences, etc.)

    Returns:
        The assistant's response
    """

    # 1️⃣ Intent matching (unchanged)
    if USE_INTENT_MATCHING:
        intent_response = get_intent_response(user_input)
        if intent_response:
            print("📋 Using predefined response from intents.json")
            return intent_response

    # 2️⃣ Build system prompt (unchanged)
    system_content = SYSTEM_PROMPT
    if global_context and global_context.strip():
        system_content += f"\n\nUser Info:\n{global_context}"

    # 3️⃣ Prepare trimmed conversation history
    context_messages = []
    if context:
        recent_context = (
            context[-CONTEXT_MESSAGE_LIMIT:]
            if len(context) > CONTEXT_MESSAGE_LIMIT
            else context
        )

        for msg in recent_context:
            if msg.get("content", "").strip():
                context_messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "").strip()
                })

    # 4️⃣ Build OpenAI-style messages
    messages = []

    # System message first
    messages.append({
        "role": "system",
        "content": system_content
    })

    # Add conversation history
    messages.extend(context_messages)

    # Add current user message
    messages.append({
        "role": "user",
        "content": user_input.strip()
    })

    # 5️⃣ Build payload for vLLM
    payload = {
        "model": "Qwen/Qwen2.5-14B-Instruct",
        "messages": messages,
        "max_tokens": MAX_TOKENS,
        "temperature": TEMPERATURE,
        "top_p": TOP_P
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer EMPTY"
    }

    print(f"📝 Sending {len(messages)} messages to RunPod")

    # 6️⃣ Call RunPod
    try:
        response = requests.post(
            RUNPOD_URL,
            headers=headers,
            json=payload,
            timeout=120
        )

        if response.status_code == 200:
            result = response.json()

            if "choices" in result and len(result["choices"]) > 0:
                assistant_response = result["choices"][0]["message"]["content"].strip()

                if not assistant_response:
                    assistant_response = "I'm here to listen. Tell me more about what's on your mind."

                return assistant_response
            else:
                print(f"⚠️ Unexpected response format: {result}")
                return "I'm here to listen. Could you tell me more?"
        else:
            print(f"❌ RunPod error: {response.status_code} - {response.text}")
            return "I'm having trouble connecting right now. Please try again."

    except requests.exceptions.Timeout:
        print("❌ Request timeout")
        return "The response took too long. Please try again."
    except Exception as e:
        print(f"❌ Error calling RunPod: {e}")
        return "Something went wrong. Please try again."
