#!/usr/bin/env python3
"""
Remove mock data arrays from community tab components.
These components use useState with hardcoded mock data arrays.
"""

import re
from pathlib import Path

def remove_useState_mock_arrays(content):
    """Remove useState declarations with large mock data arrays."""
    
    # Pattern: const [stateName, setStateName] = useState<Type>([...large array...])
    # We want to convert to: const [stateName, setStateName] = useState<Type>([])
    
    # Find useState with array initialization
    pattern = r'(const \[\w+, \w+\] = useState<[^>]+>\(\[)\s*\{[\s\S]*?\}\s*,?\s*\](\))'
    
    # Replace with empty array
    content = re.sub(pattern, r'\1]\2', content)
    
    # Also handle simpler arrays without types
    pattern2 = r'(const \[\w+, \w+\] = useState\(\[)\s*\{[\s\S]*?\}\s*,?\s*\](\))'
    content = re.sub(pattern2, r'\1]\2', content)
    
    return content

def main():
    community_dir = Path('src/components/community')
    
    files_to_fix = [
        'activity-tab.tsx',
        'competitions-tab.tsx',
        'connections-tab.tsx',
        'discussions-tab.tsx',
        'events-tab.tsx',
        'news-tab.tsx',
        'showcase-tab.tsx',
        'studios-tab.tsx',
    ]
    
    for filename in files_to_fix:
        filepath = community_dir / filename
        if not filepath.exists():
            print(f"Skipping {filename} - not found")
            continue
            
        print(f"Processing {filename}...")
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Check if file has mock data
        if 'useState' in content and re.search(r'useState.*\[\s*\{', content):
            new_content = remove_useState_mock_arrays(content)
            
            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"  ✓ Updated {filename}")
            else:
                print(f"  - No changes needed for {filename}")
        else:
            print(f"  - No mock data found in {filename}")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
