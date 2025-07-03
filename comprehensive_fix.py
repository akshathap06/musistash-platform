#!/usr/bin/env python3
"""Comprehensive fix for indentation issues in main.py"""

# Read the file
with open('backend/main.py', 'r') as f:
    lines = f.readlines()

# Fix all indentation issues
for i, line in enumerate(lines):
    # Fix line 279: genres_from_ai = json.loads(response)
    if 'genres_from_ai = json.loads(response)' in line and line.startswith('            genres_from_ai'):
        lines[i] = line.replace('            genres_from_ai', '                    genres_from_ai')
    
    # Fix line 280: if isinstance(genres_from_ai, list):
    elif 'if isinstance(genres_from_ai, list):' in line and line.startswith('            if isinstance'):
        lines[i] = line.replace('            if isinstance', '                    if isinstance')
    
    # Fix data = json.loads(response)
    elif 'data = json.loads(response)' in line and line.startswith('        data'):
        lines[i] = line.replace('        data', '            data')
    
    # Fix return data
    elif 'return data' in line and line.startswith('        return data'):
        lines[i] = line.replace('        return', '            return')
    
    # Fix line 2083: comparable_artist_obj = await get_artist_info(comp_artist_name)
    elif 'comparable_artist_obj = await get_artist_info(comp_artist_name)' in line and line.startswith('            comparable_artist_obj'):
        lines[i] = line.replace('            comparable_artist_obj', '        comparable_artist_obj')
    
    # Fix line 2084: if not comparable_artist_obj:
    elif 'if not comparable_artist_obj:' in line and line.startswith('            if not comparable_artist_obj'):
        lines[i] = line.replace('            if not comparable_artist_obj', '        if not comparable_artist_obj')
    
    # Fix line 2085: print(f"⚠️ Comparable artist not found: {comp_artist_name}, using fallback")
    elif 'print(f"⚠️ Comparable artist not found:' in line and line.startswith('            print'):
        lines[i] = line.replace('            print', '            print')
    
    # Fix line 2086: comp_artist_name = "Taylor Swift"
    elif 'comp_artist_name = "Taylor Swift"' in line and line.startswith('            comp_artist_name'):
        lines[i] = line.replace('            comp_artist_name', '            comp_artist_name')
    
    # Fix line 2087: comparable_artist_obj = await get_artist_info(comp_artist_name)
    elif 'comparable_artist_obj = await get_artist_info(comp_artist_name)' in line and line.startswith('            comparable_artist_obj'):
        lines[i] = line.replace('            comparable_artist_obj', '            comparable_artist_obj')

# Write the fixed content back
with open('backend/main.py', 'w') as f:
    f.writelines(lines)

print("✅ Fixed all indentation issues in main.py") 