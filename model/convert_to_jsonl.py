import json

with open('intents.json', 'r') as f:
    data = json.load(f)

intents = data['intents']

with open('intents.jsonl', 'w') as f:
    for intent in intents:
        f.write(json.dumps(intent, ensure_ascii=False) + '\n')
