import json

# Load the JSON data
with open('emotional_dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove duplicates based on input_text, keeping the first occurrence
unique_data = []
seen = set()
for item in data:
    input_text = item['input_text']
    if input_text not in seen:
        seen.add(input_text)
        unique_data.append(item)

# Save the unique data back
with open('emotional_dataset.json', 'w', encoding='utf-8') as f:
    json.dump(unique_data, f, indent=2, ensure_ascii=False)

print(f"Removed duplicates. Now {len(unique_data)} unique entries.")
