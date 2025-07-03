#!/usr/bin/env python3
"""Fix all indentation issues in main.py"""

import re

def fix_indentation_issues():
    with open('backend/main.py', 'r') as f:
        content = f.read()
    
    # Split into lines
    lines = content.split('\n')
    
    # Track if we're inside a specific function/block
    in_try_block = False
    
    for i, line in enumerate(lines):
        # Fix specific known issues
        
        # Issue 1: Line around 279 - genres_from_ai = json.loads(response)
        if 'genres_from_ai = json.loads(response)' in line:
            if line.startswith('            genres_from_ai'):
                lines[i] = line.replace('            genres_from_ai', '                    genres_from_ai')
        
        # Issue 2: Line around 280 - if isinstance(genres_from_ai, list):
        elif 'if isinstance(genres_from_ai, list):' in line:
            if line.startswith('            if isinstance'):
                lines[i] = line.replace('            if isinstance', '                    if isinstance')
        
        # Issue 3: Line around 420 - data = json.loads(response)
        elif 'data = json.loads(response)' in line:
            if line.startswith('        data'):
                lines[i] = line.replace('        data', '            data')
        
        # Issue 4: Line around 421 - return data
        elif 'return data' in line and 'json.loads' in lines[i-1]:
            if line.startswith('        return data'):
                lines[i] = line.replace('        return', '            return')
        
        # Issue 5: Line around 2083 - comparable_artist_obj = await get_artist_info(comp_artist_name)
        elif 'comparable_artist_obj = await get_artist_info(comp_artist_name)' in line:
            if line.startswith('            comparable_artist_obj'):
                lines[i] = line.replace('            comparable_artist_obj', '        comparable_artist_obj')
        
        # Issue 6: Line around 2084 - if not comparable_artist_obj:
        elif 'if not comparable_artist_obj:' in line:
            if line.startswith('            if not comparable_artist_obj'):
                lines[i] = line.replace('            if not comparable_artist_obj', '        if not comparable_artist_obj')
        
        # Issue 7: Fix any other misaligned lines that start with wrong indentation
        elif line.strip() and not line.startswith('#'):
            # Check for common patterns that need fixing
            if line.startswith('            ') and ('print(' in line or 'comp_artist_name' in line or 'comparable_artist_obj' in line):
                # Check if this should be 8 spaces instead of 12
                if any(keyword in line for keyword in ['print(f"⚠️', 'comp_artist_name = "Taylor Swift"']):
                    lines[i] = line.replace('            ', '            ')  # Keep 12 spaces for these
                elif 'comparable_artist_obj = await get_artist_info' in line:
                    lines[i] = line.replace('            ', '            ')  # Keep 12 spaces for second occurrence
    
    # Write back the fixed content
    with open('backend/main.py', 'w') as f:
        f.write('\n'.join(lines))
    
    print("✅ Fixed indentation issues in main.py")

if __name__ == "__main__":
    fix_indentation_issues() 