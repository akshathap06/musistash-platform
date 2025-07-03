#!/usr/bin/env python3
"""Fix indentation issues in main.py"""

import re

# Read the file
with open('backend/main.py', 'r') as f:
    content = f.read()

# Fix the specific indentation issues
lines = content.split('\n')

# Fix line 279: genres_from_ai = json.loads(response)
if len(lines) > 278 and 'genres_from_ai = json.loads(response)' in lines[278]:
    lines[278] = lines[278].replace('            genres_from_ai', '                    genres_from_ai')

# Fix line 280: if isinstance(genres_from_ai, list):
if len(lines) > 279 and 'if isinstance(genres_from_ai, list):' in lines[279]:
    lines[279] = lines[279].replace('            if isinstance', '                    if isinstance')

# Fix line around 420: data = json.loads(response)
for i, line in enumerate(lines):
    if 'data = json.loads(response)' in line and line.startswith('        data'):
        lines[i] = line.replace('        data', '            data')
    elif 'return data' in line and line.startswith('        return data'):
        lines[i] = line.replace('        return', '            return')

# Write the fixed content back
with open('backend/main.py', 'w') as f:
    f.write('\n'.join(lines))

print("✅ Fixed indentation issues in main.py") 