import json

# Read the JSONL file
with open('intents.jsonl', 'r') as f:
    lines = f.readlines()

# Process each line
new_lines = []
for line in lines:
    obj = json.loads(line.strip())
    # Remove 'tag', rename 'patterns' to 'input', 'responses' to 'output'
    new_obj = {
        'input': obj['patterns'],
        'output': obj['responses']
    }
    new_lines.append(json.dumps(new_obj, ensure_ascii=False))

# Write back to the file
with open('intents.jsonl', 'w') as f:
    for line in new_lines:
        f.write(line + '\n')
