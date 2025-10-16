const fs = require('fs');

const fixes = [
  {
    file: 'src/components/admin/billing-tab.tsx',
    replacements: [
      {
        from: `{t('admin.billingTab.storage'
                        </div>`,
        to: `{t('admin.billingTab.storage')}
              </div>`
      },
      {
        from: `{t('admin.billingTab.bandwidth'
                        </div>`,
        to: `{t('admin.billingTab.bandwidth')}
              </div>`
      }
    ]
  },
  {
    file: 'src/components/admin/checklist-templates-tab.tsx',
    replacements: [
      {
        from: `{index === newTemplate.items.length - 1 && (
                        </div>
                    )`,
        to: `{index === newTemplate.items.length - 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = [...newTemplate.items]
                              newItems.push({ text: "", completed: false })
                              setNewTemplate({ ...newTemplate, items: newItems })
                            }}
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    ))`
      }
    ]
  },
  {
    file: 'src/components/admin/integrations-tab.tsx',
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
    file: 'src/components/companies/companies-bids-tab.tsx',
    replacements: [
      {
        from: `<CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleId}
        tabSlug={tabSlug}
        workspaceId={workspaceId}
        onSuccess={(item) => {
          console.log("Created item:", item)
        }}
      />`,
        to: ''
      },
      {
        from: `import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"`,
        to: ''
      },
      {
        from: `const [createDialogOpen, setCreateDialogOpen] = useState(false)`,
        to: ''
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
      console.log(`  No changes needed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log(`\nFixed ${totalFixed} files`);
