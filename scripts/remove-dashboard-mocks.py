#!/usr/bin/env python3
"""
Remove mock data from dashboard tab components.
Converts: `data.length > 0 ? realData : mockData` to just `realData`
"""

import re
import sys
from pathlib import Path

def remove_mock_data(content):
    """Remove mock data arrays and fallback logic."""
    
    # Pattern 1: Remove mock data variable declarations (const mockXYZ = [...])
    # Matches from 'const mock' to the closing bracket and comma/semicolon
    content = re.sub(
        r'  const mock\w+ = \[[\s\S]*?\n  \]',
        '',
        content,
        flags=re.MULTILINE
    )
    
    # Pattern 2: Convert ternary fallback to just use real data
    # From: `xyz.length > 0 ? xyz.map(...) : mockXyz`
    # To: `xyz.map(...)`
    content = re.sub(
        r'(\w+)\.length > 0 \? ([\s\S]*?)\]\) : mock\w+',
        r'\2])',
        content
    )
    
    # Pattern 3: Also handle stats pattern in overview
    # From: `stats.length > 0 ? stats.map(...) : mockStats`
    content = re.sub(
        r'(\w+)\.length > 0 \? (.*?) : mock\w+',
        r'\2',
        content
    )
    
    # Remove blank lines left behind
    content = re.sub(r'\n\n\n+', '\n\n', content)
    
    return content

def main():
    dashboard_dir = Path('src/components/dashboard')
    
    files_to_fix = [
        'dashboard-my-advances-tab.tsx',
        'dashboard-my-assets-tab.tsx',
        'dashboard-my-expenses-tab.tsx',
        'dashboard-my-files-tab.tsx',
        'dashboard-my-orders-tab.tsx',
        'dashboard-my-reports-tab.tsx',
        'dashboard-my-travel-tab.tsx',
        'dashboard-overview-tab.tsx',
    ]
    
    for filename in files_to_fix:
        filepath = dashboard_dir / filename
        if not filepath.exists():
            print(f"Skipping {filename} - not found")
            continue
            
        print(f"Processing {filename}...")
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        new_content = remove_mock_data(content)
        
        if content != new_content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"  ✓ Updated {filename}")
        else:
            print(f"  - No changes needed for {filename}")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
