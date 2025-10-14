# I18N Remediation Checklist

**Status Tracking Document**  
**Created**: October 14, 2025  
**Target Completion**: 4 weeks

---

## Phase 1: CRITICAL (P0) - 24 Files

### Admin Components (10 files)

- [ ] **api-tokens-tab.tsx**
  - Line 97: `"Token revoked"` → `t('admin.tokens.revoked')`
  - Line 106: `"Token deleted"` → `t('admin.tokens.deleted')`
  - Line 115: `"Token copied"` → `t('admin.tokens.copied')`
  - **Action**: Add `const t = useTranslations('admin')` at top
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **automations-tab.tsx**
  - Line 17: → `t('admin.automations.welcomeEmailDesc')`
  - Line 25: → `t('admin.automations.milestoneNotifyDesc')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **billing-tab.tsx**
  - Line 85: → `t('success.invoiceCreated')`
  - Line 90: → `t('success.invoiceUpdated')`
  - Line 95: → `t('success.invoiceDeleted')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **integrations-tab.tsx**
  - Line 14: → `t('admin.integrations.slackDesc')`
  - Line 30: → `t('admin.integrations.stripeDesc')`
  - Line 37: → `t('admin.integrations.quickbooksDesc')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **members-management-tab.tsx**
  - Line 137: → `t('success.invitationSent')`
  - Line 148: → `t('success.memberRemoved')`
  - Line 168: → `t('success.memberAdded')`
  - Line 173: → `t('success.memberUpdated')`
  - Line 211: → `t('success.roleUpdated')`
  - Line 212: → `t('success.roleUpdatedDesc')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **plugins-tab.tsx**
  - Line 55: → `t('admin.plugins.advancedAnalyticsDesc')`
  - Line 67: → `t('admin.plugins.timeTrackingDesc')`
  - Line 79: → `t('admin.plugins.customFieldsDesc')`
  - Line 120: → `t('success.pluginInstalled')`
  - Line 131: → `t('success.pluginUninstalled')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **recurrence-rules-tab.tsx**
  - Line 53: → `t('admin.recurrence.weeklyTeamSyncDesc')`
  - Line 69: → `t('admin.recurrence.quarterlyReviewDesc')`
  - Line 96: → `t('success.ruleDeleted')`
  - Line 210: → `t('placeholders.ruleDescription')`
  - Line 265: → `t('success.ruleSaved')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **security-tab.tsx**
  - Line 47-50: Mock data - move to translation or remove
  - Line 56: → `t('success.securitySettingsUpdated')`
  - Line 63: → `t('success.exportStarted')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **templates-tab.tsx**
  - Line 14: → `t('admin.templates.checklistsDesc')`
  - Line 28: → `t('admin.templates.projectsDesc')`
  - Line 35: → `t('admin.templates.workflowsDesc')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **webhooks-tab.tsx**
  - Line 57: → `t('admin.webhooks.events.projectCreatedDesc')`
  - Line 58: → `t('admin.webhooks.events.projectUpdatedDesc')`
  - Line 59: → `t('admin.webhooks.events.projectDeletedDesc')`
  - Line 60: → `t('admin.webhooks.events.memberAddedDesc')`
  - Line 61: → `t('admin.webhooks.events.memberRemovedDesc')`
  - Line 62: → `t('admin.webhooks.events.eventCreatedDesc')`
  - Line 63: → `t('admin.webhooks.events.taskCompletedDesc')`
  - Line 64: → `t('admin.webhooks.events.invoicePaidDesc')`
  - Line 116: → `t('success.webhookDeleted')`
  - Line 128: → `t('success.webhookDisabled')` / `t('success.webhookEnabled')`
  - Line 136: → `t('success.secretCopied')`
  - Line 372: → `t('success.webhookSaved')`
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

### Shared Components (9 files)

- [ ] **activity-feed.tsx**
  - Line 87: → `t('errors.loadActivityFeedFailed')`
  - **Action**: Add `useTranslations('shared')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **agenda-tab-content.tsx**
  - Line 80: → `t('errors.loadAgendaFailed')`
  - Line 109: → `t('errors.updateTaskFailed')`
  - **Action**: Add `useTranslations('shared')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **comments-section.tsx**
  - Line 99: → `t('errors.loadCommentsFailed')`
  - Line 195: → `t('success.commentAdded')`
  - Line 201: → `t('errors.addCommentFailed')`
  - **Action**: Add `useTranslations('comments')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **crud-drawer.tsx** 
  - Line 299: → `t('placeholders.startDate')`
  - Line 306: → `t('placeholders.endDate')`
  - Line 419: → `t('placeholders.selectUser')`
  - Line 470: → `t('common.fileAttached')`
  - Line 605: → `t('placeholders.calculatedValue')`
  - Line 691: → `t('placeholders.selectTimezone')`
  - Line 711: → `t('placeholders.selectCountry')`
  - **Action**: Add `useTranslations()` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **enhanced-table-view.tsx**
  - Line 66: → `t('common.selectAll')` (aria-label)
  - Line 73: → `t('common.selectRow')` (aria-label)
  - **Action**: Add `useTranslations('common')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **files-tab-content.tsx**
  - Line 78: → `t('errors.loadFilesFailed')`
  - Line 141: → `t('success.fileUploaded')`
  - Line 147: → `t('errors.uploadFileFailed')`
  - Line 181: → `t('success.fileDeleted')`
  - Line 187: → `t('errors.deleteFileFailed')`
  - **Action**: Add `useTranslations('shared')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **notifications-tab-content.tsx**
  - Line 71: → `t('errors.loadNotificationsFailed')`
  - Line 145: → `t('errors.markNotificationReadFailed')`
  - Line 167: → `t('success.allNotificationsMarkedRead')`
  - Line 173: → `t('errors.markAllReadFailed')`
  - **Action**: Add `useTranslations('notifications')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **tasks-tab-content.tsx**
  - Line 60: → `t('errors.loadTasksFailed')`
  - Line 124: → `t('errors.updateTaskFailed')`
  - **Action**: Add `useTranslations('shared')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **time-tracker.tsx**
  - Line 133: → `t('success.timeTrackingStarted')`
  - Line 139: → `t('errors.startTimerFailed')`
  - Line 184: → `t('success.timeEntrySaved')`
  - Line 190: → `t('errors.stopTimerFailed')`
  - Line 257: → `t('success.manualTimeEntrySaved')`
  - Line 263: → `t('errors.addTimeEntryFailed')`
  - Line 286: → `t('success.timeEntryRemoved')`
  - Line 292: → `t('errors.deleteEntryFailed')`
  - Line 321: → `t('placeholders.whatWorkingOn')`
  - **Action**: Add `useTranslations('shared')` hook
  - **Owner**: _____________
  - **ETA**: _____________

### Reports Components (4 files)

- [ ] **reports-custom-builder-tab.tsx**
  - Line 62: → `t('placeholders.enterReportName')`
  - **Action**: Add `useTranslations('reports')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **reports-executive-tab.tsx**
  - Line 22: → `t('reports.executive.quarterlyReviewDesc')`
  - Line 31: → `t('reports.executive.financialPerformanceDesc')`
  - **Action**: Add `useTranslations('reports')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **reports-page-content.tsx**
  - Line 18: → `t('reports.weeklyTaskTrendsDesc')`
  - Line 37: → `t('reports.statusBreakdownDesc')`
  - **Action**: Add `useTranslations('reports')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **reports-templates-tab.tsx**
  - Line 30: → `t('reports.templates.complianceDesc')`
  - Line 48: → `t('reports.templates.customerSatisfactionDesc')`
  - Line 57: → `t('reports.templates.projectProgressDesc')`
  - **Action**: Add `useTranslations('reports')` hook
  - **Owner**: _____________
  - **ETA**: _____________

### Other (2 files)

- [ ] **realtime/activity-feed.tsx**
  - Lines 45, 56, 67: Mock data - move to translation or remove
  - **Action**: Add `useTranslations('realtime')` hook
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **api-tokens/api-tokens-page-content.tsx**
  - Line 16: Mock data - move to translation or remove
  - **Action**: Add `useTranslations('admin')` hook
  - **Owner**: _____________
  - **ETA**: _____________

**Phase 1 Progress**: 0/24 ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ (0%)

---

## Phase 2: HIGH (P1) - 50+ Files

### Analytics Module (11 files)

- [ ] **analytics-overview-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit for hardcoded strings
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-performance-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-trends-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-comparisons-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-forecasting-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-realtime-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-pivot-tables-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-metrics-library-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-custom-views-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **analytics-data-sources-tab.tsx**
  - **Action**: Add `useTranslations('analytics')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **Remaining analytics files...**
  - **Owner**: _____________
  - **ETA**: _____________

### Insights Module (16 files)

- [ ] **insights-overview-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-objectives-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-key-results-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-progress-tracking-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-success-metrics-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-priorities-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-intelligence-feed-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-recommendations-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-benchmarks-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **insights-reviews-tab.tsx**
  - **Action**: Add `useTranslations('insights')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **Remaining insights files... (6 more)**
  - **Owner**: _____________
  - **ETA**: _____________

### Settings Module (7 files)

- [ ] **settings/profile-page.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/account-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/appearance-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/billing-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/team-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/automations-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

- [ ] **settings/integrations-tab.tsx**
  - **Action**: Add `useTranslations('settings')` + audit
  - **Owner**: _____________
  - **ETA**: _____________

### Dashboard Module (12 files)

- [ ] **All dashboard tab components**
  - **Action**: Add `useTranslations('dashboard')` + audit each
  - **Owner**: _____________
  - **ETA**: _____________

**Phase 2 Progress**: 0/50+ ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ (0%)

---

## Phase 3: MEDIUM (P2) - 50+ Files

### Community Module (8 files)
### Marketplace Module (13 files)
### Profile Module (12 files)
### Views Module (21 files)
### Members Module (5 files)
### Webhooks Module (4 files)
### Plugins Module (3 files)
### Automations Module (3 files)
### Mobile Module (2 files)
### Finance Module (1 file)

**Phase 3 Progress**: 0/50+ ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ (0%)

---

## Translation Keys Creation

### New Translation Files Needed

- [ ] Update `src/i18n/messages/en.json` with new keys
- [ ] Run `node scripts/update-all-translations.js` to propagate
- [ ] Verify all 20 language files updated

### Key Structure to Add

```json
{
  "admin": {
    "tokens": { /* 3 keys */ },
    "automations": { /* 2 keys */ },
    "billing": { /* ... */ },
    "integrations": { /* ... */ },
    "plugins": { /* ... */ },
    "recurrence": { /* ... */ },
    "security": { /* ... */ },
    "templates": { /* ... */ },
    "webhooks": {
      "events": { /* 8 keys */ }
    }
  },
  "shared": {
    "activity": { /* ... */ },
    "agenda": { /* ... */ },
    "files": { /* ... */ },
    "tasks": { /* ... */ },
    "timeTracking": { /* ... */ }
  },
  "errors": {
    "loadFailed": "Failed to load {resource}",
    "updateFailed": "Failed to update {resource}",
    "deleteFailed": "Failed to delete {resource}",
    "addFailed": "Failed to add {resource}"
  },
  "success": {
    "created": "{resource} created successfully",
    "updated": "{resource} updated successfully",
    "deleted": "{resource} deleted successfully",
    "added": "{resource} added successfully"
  },
  "placeholders": {
    "startDate": "Start date",
    "endDate": "End date",
    "selectUser": "Select user",
    "selectTimezone": "Select timezone",
    "selectCountry": "Select country",
    "enterReportName": "Enter report name",
    "whatWorkingOn": "What are you working on?",
    "ruleDescription": "Brief description of this rule"
  }
}
```

---

## Testing Checklist

### Per-Component Testing
- [ ] Switch to Spanish - verify all text translated
- [ ] Switch to Chinese - verify all text translated
- [ ] Switch to Arabic - verify all text translated (RTL)
- [ ] Test all toast messages
- [ ] Test all form placeholders
- [ ] Test all error states
- [ ] Test all success states

### Automated Testing
- [ ] Run `node scripts/find-hardcoded-strings.js` - should return 0 results
- [ ] Run TypeScript compiler - no i18n errors
- [ ] Run ESLint - no missing translation warnings

---

## Completion Criteria

✅ **PHASE 1 COMPLETE** when:
- All 24 P0 files have i18n hooks
- All hardcoded user-facing strings removed
- All toast messages internationalized
- Manual testing passed in 3 languages

✅ **PHASE 2 COMPLETE** when:
- All 50+ P1 files have i18n hooks
- All module components audited
- Translation keys added for all new strings

✅ **PHASE 3 COMPLETE** when:
- All remaining files have i18n hooks
- Zero hardcoded strings detected by automation
- Full testing in all 20 languages passed

✅ **PROJECT COMPLETE** when:
- Zero-tolerance audit passes with 100%
- CI/CD checks implemented
- Documentation updated
- Team trained on i18n best practices

---

**Last Updated**: October 14, 2025  
**Overall Progress**: 0/120+ files (0%)
