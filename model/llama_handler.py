"""
Vertex AI LLaMA-4 Handler for Reflectify
Uses Google Cloud Vertex AI with LLaMA-4 Scout 17B Instruct model
"""

import subprocess
import requests
import os
from typing import List, Dict
from config import (
    VERTEX_URL, SYSTEM_PROMPT, CONTEXT_MESSAGE_LIMIT,
    MAX_TOKENS, TEMPERATURE, TOP_P
)


def get_access_token():
    """Get access token using gcloud CLI."""
    try:
        gcloud_path = os.path.expanduser("~/google-cloud-sdk/bin/gcloud")
        if os.path.exists(gcloud_path):
            result = subprocess.run(
                [gcloud_path, "auth", "print-access-token"],
                capture_output=True,
                text=True,
                check=True
            )
        else:
            result = subprocess.run(
                ["gcloud", "auth", "print-access-token"],
                capture_output=True,
                text=True,
                check=True
            )
        return result.stdout.strip()
    except Exception as e:
        print(f"❌ Error getting access token: {e}")
        return None


def build_llama_prompt(system_content: str, messages: List[Dict[str, str]], user_input: str) -> str:
    """Build LLaMA-4 format prompt with special tokens."""
    prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n{system_content}<|eot_id|>"

    # Add context messages
    for msg in messages:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if content.strip():
            if role == "assistant":
                prompt += f"<|start_header_id|>assistant<|end_header_id|>\n{content}<|eot_id|>"
            else:
                prompt += f"<|start_header_id|>user<|end_header_id|>\n{content}<|eot_id|>"

    # Add current user message
    prompt += f"<|start_header_id|>user<|end_header_id|>\n{user_input}<|eot_id|>"
    prompt += "<|start_header_id|>assistant<|end_header_id|>\n"

    return prompt


def reflect(user_input: str, context: List[Dict[str, str]] = None, global_context: str = "") -> str:
    """
    Generate a reflection response using Vertex AI LLaMA-4.

    Args:
        user_input: The user's message
        context: Previous conversation messages
        global_context: User's global context (name, preferences, etc.)

    Returns:
        The assistant's response
    """
    # Get access token
    access_token = get_access_token()
    if not access_token:
        return "I'm having trouble connecting right now. Please try again in a moment."

    # Build system prompt with global context
    system_content = SYSTEM_PROMPT
    if global_context and global_context.strip():
        system_content += f"\n\nUser Info:\n{global_context}"

    # Prepare context messages (limit based on config)
    context_messages = []
    if context:
        recent_context = context[-CONTEXT_MESSAGE_LIMIT:] if len(context) > CONTEXT_MESSAGE_LIMIT else context
        for msg in recent_context:
            if msg.get("content", "").strip():
                context_messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "").strip()
                })

    # Build the prompt
    prompt = build_llama_prompt(system_content, context_messages, user_input.strip())

    # Prepare request
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "instances": [{
            "prompt": prompt,
            "max_tokens": MAX_TOKENS,
            "temperature": TEMPERATURE,
            "top_p": TOP_P
        }]
    }

    # Debug logging
    print(f"📝 Messages: {len(context_messages) + 1}, Context chars: {len(global_context) if global_context else 0}")

    try:
        response = requests.post(VERTEX_URL, headers=headers, json=payload, timeout=120)

        if response.status_code == 200:
            result = response.json()
            if "predictions" in result and len(result["predictions"]) > 0:
                raw_output = result["predictions"][0]
                # Extract just the output part (after "Output:\n")
                if "Output:\n" in raw_output:
                    assistant_response = raw_output.split("Output:\n", 1)[1].strip()
                else:
                    assistant_response = raw_output.strip()

                import re

                # FIRST: Cut off at any "user" turn marker (model shouldn't generate user messages)
                # This handles cases like "...some response...user\nsome user message..."
                cutoff_patterns = [
                    r'\nuser\n.*$',           # newline user newline
                    r'\nuser$',               # ends with newline user
                    r'user\n.*$',             # user newline anything
                    r'\n\nuser.*$',           # double newline user
                ]
                for pattern in cutoff_patterns:
                    assistant_response = re.sub(pattern, '', assistant_response, flags=re.IGNORECASE | re.DOTALL)

                # Clean up ALL special tokens and artifacts
                special_tokens = [
                    "<|eot_id|>", "<|end_of_text|>", "<|start_header_id|>",
                    "<|end_header_id|>", "<|begin_of_text|>", "<|finetune_right_pad_id|>",
                    "user<|end_header_id|>", "assistant<|end_header_id|>",
                    "system<|end_header_id|>", "<|reserved_special_token"
                ]
                for token in special_tokens:
                    assistant_response = assistant_response.replace(token, "")

                # Remove any leftover <|...|> patterns
                assistant_response = re.sub(r'<\|[^|]*\|>', '', assistant_response)
                # Remove "Prompt:" prefix if present
                assistant_response = re.sub(r'^Prompt:.*?Output:', '', assistant_response, flags=re.DOTALL)

                # Remove standalone "user" or "assistant" words at end of lines
                assistant_response = re.sub(r'\buser\s*$', '', assistant_response, flags=re.MULTILINE | re.IGNORECASE)
                assistant_response = re.sub(r'\bassistant\s*$', '', assistant_response, flags=re.MULTILINE | re.IGNORECASE)

                # Remove "user" or "assistant" followed by newline in middle of text
                assistant_response = re.sub(r'\buser\s*\n', '\n', assistant_response, flags=re.IGNORECASE)
                assistant_response = re.sub(r'\bassistant\s*\n', '\n', assistant_response, flags=re.IGNORECASE)

                # Convert markdown bullet points (* ) to clean bullets (• )
                assistant_response = re.sub(r'^\* ', '• ', assistant_response, flags=re.MULTILINE)
                assistant_response = re.sub(r'^\- ', '• ', assistant_response, flags=re.MULTILINE)

                # Remove stray numbers/artifacts that appear alone on a line
                assistant_response = re.sub(r'^\d{1,3}\s*$', '', assistant_response, flags=re.MULTILINE)

                # Clean up extra whitespace
                assistant_response = re.sub(r'\n{3,}', '\n\n', assistant_response)
                assistant_response = re.sub(r' +', ' ', assistant_response)  # Multiple spaces to single
                assistant_response = assistant_response.strip()

                if not assistant_response:
                    assistant_response = "I'm here to listen. Tell me more about what's on your mind."

                return assistant_response
            else:
                print(f"⚠️ Unexpected response format: {result}")
                return "I'm here to listen. Could you tell me more?"
        else:
            print(f"❌ Vertex AI error: {response.status_code} - {response.text}")
            return "I'm having trouble connecting right now. Please try again."

    except requests.exceptions.Timeout:
        print("❌ Request timeout")
        return "The response took too long. Please try again."
    except Exception as e:
        print(f"❌ Error calling Vertex AI: {e}")
        return "Something went wrong. Please try again."
