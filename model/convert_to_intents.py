import json
import re

# Load the emotional dataset
with open('emotional_dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define categories with exact or partial match patterns
# Order matters - more specific patterns should come first
categories = [
    ("suicide", ["kill myself", "ending my life", "better off without me", "can't take this pain", "disappear"]),
    ("lonely", ["lonely", "don't have anyone to talk", "disconnected from everyone", "alone even when"]),
    ("stressed-exams", ["exam", "prepared for my exams"]),
    ("stressed-work", ["because of work", "job is making", "workload is too much"]),
    ("stressed-project", ["project deadline", "project is stressing", "project is not going"]),
    ("burned-out", ["burned out", "mentally exhausted"]),
    ("anxious", ["anxious all the time"]),
    ("scared-future", ["scared about my future"]),
    ("scared-failing", ["scared of failing"]),
    ("scared-talking", ["scared to talk to people"]),
    ("not-good-enough", ["not good enough"]),
    ("comparing", ["comparing myself"]),
    ("tired", ["empty and tired", "emotionally tired"]),
    ("low-motivation", ["don't feel motivated"]),
    ("pressure", ["pressured", "expectations"]),
    ("misunderstood", ["nobody understands"]),
    ("overwhelmed", ["overwhelmed"]),
    ("giving-up", ["giving up"]),
    ("frustrated", ["frustrated"]),
    ("confidence", ["confident"]),
    ("lost", ["lost in life"]),
    ("sad", ["sad for no reason"]),
    ("stressed-general", ["stressed", "stressful"]),
    ("goodbye", ["bye", "goodbye", "see you", "leaving", "talk to you later", "logging off", "catch you", "good night", "that's all for now", "i'm done talking", "i have to go"]),
    ("thanks", ["thank you", "thanks"]),
    ("greeting", ["^hi$", "^hello$", "^hey$", "^good morning$", "^good afternoon$", "^good evening$"]),
    ("how-are-you", ["how are you"]),
    ("casual", ["what's up", "nothing much", "i'm fine", "i'm okay", "just checking"]),
    ("conversation", ["can we talk", "are you there"]),
    ("unclear", ["^uh$", "^\\?+$", "i don't know"]),
]

# Group entries by category
intents_dict = {}

for entry in data:
    input_text = entry['input_text']
    output_text = entry['output_text']

    # Extract the user message (remove "User: " prefix and "\nAssistant:" suffix)
    match = re.match(r"User: (.+?)\nAssistant:", input_text, re.DOTALL)
    if match:
        user_message = match.group(1).strip()
    else:
        continue

    # Find the category for this message
    found_category = "default"
    user_message_lower = user_message.lower()

    for category, keywords in categories:
        for keyword in keywords:
            # Check if keyword is a regex pattern (starts with ^)
            if keyword.startswith("^"):
                if re.match(keyword, user_message_lower):
                    found_category = category
                    break
            else:
                if keyword in user_message_lower:
                    found_category = category
                    break
        if found_category != "default":
            break

    # Add to intents dict
    if found_category not in intents_dict:
        intents_dict[found_category] = {"patterns": [], "responses": []}

    if user_message not in intents_dict[found_category]["patterns"]:
        intents_dict[found_category]["patterns"].append(user_message)

    if output_text not in intents_dict[found_category]["responses"]:
        intents_dict[found_category]["responses"].append(output_text)

# Convert to intents format
intents = {"intents": []}

for tag, content in intents_dict.items():
    intent = {
        "tag": tag,
        "patterns": content["patterns"],
        "responses": content["responses"]
    }
    intents["intents"].append(intent)

# Save to intents.json
with open('intents.json', 'w', encoding='utf-8') as f:
    json.dump(intents, f, indent=2, ensure_ascii=False)

print(f"Converted {len(data)} entries into {len(intents['intents'])} intents")
for intent in intents['intents']:
    print(f"  - {intent['tag']}: {len(intent['patterns'])} patterns, {len(intent['responses'])} responses")
