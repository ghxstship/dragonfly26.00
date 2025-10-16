const fs = require('fs');

const fixes = [
  {
    file: 'src/components/admin/billing-tab.tsx',
    replacements: [
      {
        from: `{t('admin.billingTab.nextBilling'
                        </div>`,
        to: `{t('admin.billingTab.nextBilling')}
              </div>`
      }
    ]
  },
  {
    file: 'src/components/admin/checklist-templates-tab.tsx',
    replacements: [
      {
        from: `))
                        </div>

                  
                </div>`,
        to: `})}
                  </div>
                </div>`
      }
    ]
  },
  {
    file: 'src/components/admin/integrations-tab.tsx',
    replacements: [
      {
        from: `</Badge>
                        </div>
                    <CardDescription>{integration.description}</CardDescription>`,
        to: `</Badge>
                      </div>
                      <CardDescription>{integration.description}</CardDescription>`
      }
    ]
  },
  {
    file: 'src/components/admin/members-management-tab.tsx',
    replacements: [
      {
        from: `return (
    <div className="space-y-6">
      {

      {/* Stats */}`,
        to: `return (
    <div className="space-y-6">
      {/* Stats */}`
      }
    ]
  },
  {
    file: 'src/components/admin/organization-settings-tab.tsx',
    replacements: [
      {
        from: `return (
    <div className="space-y-6">
      {

      <Card>`,
        to: `return (
    <div className="space-y-6">
      <Card>`
      }
    ]
  }
];

let totalFixed = 0;

fixes.forEach(({ file, replacements }) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      totalFixed++;
      console.log(`✓ Fixed: ${file}`);
    } else {
      console.log(`  No changes: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error: ${file}:`, error.message);
  }
});

console.log(`\nFixed ${totalFixed} files`);
