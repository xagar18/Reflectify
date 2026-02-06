import json
import re

# Read the file
with open('emotional_dataset.json', 'r', encoding='utf-8') as f:
    content = f.read()

# The file has a valid array but then extra objects appended outside
# Find the position of the last ]
# But since it's malformed, let's parse it manually

# Remove the trailing ]
if content.endswith(']'):
    content = content[:-1]

# Now, split by '}\n' or something, but it's tricky because of newlines.

# Use regex to find all objects
objects = re.findall(r'\{[^}]*\}', content)

# Now, create the list
data = []
for obj in objects:
    data.append(json.loads(obj))

# Write back as proper JSON
with open('emotional_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Fixed JSON file")
