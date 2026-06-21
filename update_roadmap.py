import json
import re

with open('links.json', 'r') as f:
    links = json.load(f)

with open('leetcode-tracker-frontend/src/data/roadmapData.js', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_problem(match):
    original = match.group(0)
    title_with_diff = match.group(1)
    
    # Extract base name
    base_name = re.sub(r'\s*\((Easy|Medium|Hard)\)$', '', title_with_diff, flags=re.IGNORECASE).strip()
    
    # Try exact match or base match
    url = links.get(base_name) or links.get(title_with_diff)
    
    if url:
        return f"{{ title: '{title_with_diff}', link: '{url}' }}"
    
    return original

def replace_problems_array(match):
    array_content = match.group(1)
    # replace single-quoted strings inside this array
    new_array = re.sub(r"'([^']+)'", replace_problem, array_content)
    return f"problems: [{new_array}]"

new_content = re.sub(r"problems:\s*\[([\s\S]*?)\]", replace_problems_array, content)

with open('leetcode-tracker-frontend/src/data/roadmapData.js', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Updated roadmapData.js successfully!")
