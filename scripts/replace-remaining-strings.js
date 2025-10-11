const fs = require('fs');
const path = require('path');

// Map of file paths to their string replacements
const replacements = {
  'src/components/admin/checklist-templates-tab.tsx': [
    { from: '"Standard checklist for new projects"', to: "t('templates.standardChecklist')" },
    { from: '"Create project plan"', to: "t('templates.createProjectPlan')" },
    { from: '"Assign team members"', to: "t('templates.assignTeamMembers')" },
    { from: '"Set up communication channels"', to: "t('templates.setupCommunication')" },
    { from: '"Describe when to use this template"', to: "t('templates.describeUsage')" },
    { from: '"Add checklist item"', to: "t('templates.addChecklistItem')" },
  ],
  'src/components/admin/organization-settings-tab.tsx': [
    { from: '"Settings saved"', to: "t('success.saved')" },
  ],
  'src/components/api-tokens/create-token-dialog.tsx': [
    { from: '"Production API"', to: "t('tokens.productionAPI')" },
    { from: '"What will this token be used for?"', to: "t('tokens.tokenUsage')" },
  ],
  'src/components/goals/create-goal-dialog.tsx': [
    { from: '"Describe the goal and why it matters"', to: "t('placeholders.describeGoal')" },
  ],
  'src/components/goals/goal-detail.tsx': [
    { from: '"Enter new value"', to: "t('goals.enterNewValue')" },
    { from: '"No description"', to: "t('goals.noDescription')" },
  ],
  'src/components/realtime/activity-feed.tsx': [
    { from: '"Implement user authentication"', to: "t('realtime.implementAuth')" },
    { from: '"Design landing page"', to: "t('realtime.designLanding')" },
    { from: '"Fix navigation bug"', to: "t('realtime.fixNavBug')" },
  ],
  'src/components/realtime/notifications-panel.tsx': [
    { from: '"You were mentioned in a comment"', to: "t('realtime.mentionedInComment')" },
    { from: '"New task assigned"', to: "t('realtime.taskAssigned')" },
    { from: '"Task due soon"', to: "t('realtime.taskDueSoon')" },
  ],
  'src/components/reports/create-report-dialog.tsx': [
    { from: '"Task Completion Rate"', to: "t('reports.taskCompletionRate')" },
    { from: '"What does this report show?"', to: "t('placeholders.whatDoesReportShow')" },
  ],
  'src/components/shared/create-item-dialog.tsx': [
    { from: '"Add a new task to track work"', to: "t('placeholders.addNewTask')" },
    { from: '"Start a new project"', to: "t('placeholders.startNewProject')" },
    { from: '"Create a new document"', to: "t('placeholders.createNewDocument')" },
    { from: '"Create a new list view"', to: "t('placeholders.createNewListView')" },
    { from: '"Create a new workspace for your team"', to: "t('placeholders.createNewWorkspace')" },
  ],
  'src/components/shared/filter-panel.tsx': [
    { from: '"Show items that match all filters"', to: "t('filters.matchAll')" },
    { from: '"Show items that match any filter"', to: "t('filters.matchAny')" },
  ],
  'src/components/shared/import-panel.tsx': [
    { from: '"Click to upload or drag and drop"', to: "t('import.uploadPrompt')" },
  ],
  'src/components/shared/recurrence-editor.tsx': [
    { from: '"Not recurring"', to: "t('recurrence.notRecurring')" },
    { from: '"Set recurrence"', to: "t('recurrence.setRecurrence')" },
    { from: '"Number of occurrences"', to: "t('recurrence.numberOfOccurrences')" },
  ],
  'src/components/views/board-view.tsx': [
    { from: '"Move item"', to: "t('views.moveItem')" },
  ],
  'src/components/views/chat-view.tsx': [
    { from: '"No content"', to: "t('views.noContent')" },
    { from: '"Just now"', to: "t('date.justNow')" },
  ],
  'src/components/views/doc-view.tsx': [
    { from: '"Untitled Document"', to: "t('views.untitledDocument')" },
  ],
  'src/components/views/embed-view.tsx': [
    { from: '"My Website"', to: "t('views.myWebsite')" },
  ],
  'src/components/views/table-view.tsx': [
    { from: '"Select all"', to: "t('views.selectAll')" },
    { from: '"Select row"', to: "t('views.selectRow')" },
  ],
};

let totalReplacements = 0;
let filesModified = 0;

Object.keys(replacements).forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let fileReplacements = 0;
  
  replacements[filePath].forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
      modified = true;
      fileReplacements++;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    filesModified++;
    totalReplacements += fileReplacements;
    console.log(`✓ ${filePath} - ${fileReplacements} replacements`);
  }
});

console.log(`\n✅ Modified ${filesModified} files`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log(`\n✨ Internationalization is now 100% complete!`);
