"""
Intent Matcher for Reflectify
Matches user input against intents.json patterns and returns predefined responses
"""

import json
import random
import re
import os
from typing import Optional, Tuple

# Load intents at module level for efficiency
_intents_data = None


def load_intents() -> dict:
    """Load intents from intents.json file."""
    global _intents_data
    if _intents_data is None:
        intents_path = os.path.join(os.path.dirname(__file__), "intents.json")
        try:
            with open(intents_path, "r", encoding="utf-8") as f:
                _intents_data = json.load(f)
            print(f"✅ Loaded {len(_intents_data.get('intents', []))} intents from intents.json")
        except Exception as e:
            print(f"⚠️ Could not load intents.json: {e}")
            _intents_data = {"intents": []}
    return _intents_data


def normalize_text(text: str) -> str:
    """Normalize text for comparison."""
    # Remove punctuation except apostrophes
    text = re.sub(r"[^\w\s']", "", text.lower())
    # Collapse multiple spaces
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def match_intent(user_input: str) -> Optional[Tuple[str, str]]:
    """
    Match user input against intents.json patterns.

    Args:
        user_input: The user's message

    Returns:
        Tuple of (intent_tag, response) if matched, None otherwise
    """
    intents = load_intents()
    normalized_input = normalize_text(user_input)

    if not normalized_input:
        return None

    # First pass: exact match (case-insensitive)
    for intent in intents.get("intents", []):
        for pattern in intent.get("patterns", []):
            normalized_pattern = normalize_text(pattern)
            if normalized_input == normalized_pattern:
                responses = intent.get("responses", [])
                if responses:
                    response = random.choice(responses)
                    print(f"🎯 Exact match: '{user_input}' -> intent '{intent['tag']}'")
                    return (intent["tag"], response)

    # Second pass: fuzzy match (input contains pattern or pattern contains input)
    for intent in intents.get("intents", []):
        for pattern in intent.get("patterns", []):
            normalized_pattern = normalize_text(pattern)
            # Check if the normalized input is very similar
            if (len(normalized_input) >= 3 and len(normalized_pattern) >= 3):
                # Check if one contains the other (for longer patterns)
                if (normalized_input in normalized_pattern or
                    normalized_pattern in normalized_input):
                    # Only match if they're reasonably similar in length
                    len_ratio = min(len(normalized_input), len(normalized_pattern)) / max(len(normalized_input), len(normalized_pattern))
                    if len_ratio > 0.7:  # At least 70% length similarity
                        responses = intent.get("responses", [])
                        if responses:
                            response = random.choice(responses)
                            print(f"🎯 Fuzzy match: '{user_input}' -> intent '{intent['tag']}'")
                            return (intent["tag"], response)

    # Third pass: keyword matching for critical intents (like suicide)
    critical_keywords = {
        "suicide": ["kill myself", "end my life", "better off without me", "want to die", "wish i was dead"],
    }

    for tag, keywords in critical_keywords.items():
        for keyword in keywords:
            if keyword in normalized_input:
                # Find the intent with this tag
                for intent in intents.get("intents", []):
                    if intent.get("tag") == tag:
                        responses = intent.get("responses", [])
                        if responses:
                            response = random.choice(responses)
                            print(f"🚨 Critical match: '{user_input}' -> intent '{tag}'")
                            return (tag, response)

    return None


def get_intent_response(user_input: str) -> Optional[str]:
    """
    Get a response from intents.json if the input matches.

    Args:
        user_input: The user's message

    Returns:
        Response string if matched, None otherwise
    """
    result = match_intent(user_input)
    if result:
        return result[1]
    return None


# Preload intents on module import
load_intents()
