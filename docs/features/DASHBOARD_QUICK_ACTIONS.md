# Dashboard Quick Actions & Widget Customization

## Overview

The Dashboard module provides a comprehensive overview of user activities with quick action shortcuts and customizable widgets. This implementation enables users to perform common tasks quickly and personalize their dashboard experience.

## Features

### 1. Quick Actions

Quick actions provide one-click access to common tasks directly from the dashboard:

#### Log Expense
- **Purpose**: Submit expense reports for approval
- **Fields**: Description, Amount, Date, Category, Merchant, Notes
- **Database**: Inserts into `financial_transactions` table
- **Categories**: Meals, Travel, Accommodation, Equipment, Supplies, Software, Other

#### Book Travel
- **Purpose**: Submit travel requests for approval
- **Fields**: Destination, Purpose, Travel Type, Departure/Return Dates, Notes
- **Database**: Inserts into `travel_itineraries` table
- **Types**: Flight, Train, Car, Accommodation, Other

#### Create Task
- **Purpose**: Add tasks to personal to-do list
- **Fields**: Title, Description, Priority, Status, Due Date
- **Database**: Inserts into `project_tasks` table
- **Priorities**: Low, Medium, High, Urgent
- **Statuses**: To Do, In Progress, Blocked, Completed

#### Upload File
- **Purpose**: Upload files to workspace storage
- **Fields**: File, Category, Description
- **Storage**: Supabase Storage bucket `files`
- **Database**: Inserts into `files` table
- **Categories**: Documents, Contracts, Riders, Tech Specs, Call Sheets, Media, Reports, Other

### 2. Widget Customization

Users can customize their dashboard by enabling/disabling widgets:

#### Available Widgets
1. **My Tasks** - Personal task management
2. **My Agenda** - Upcoming events and calendar
3. **My Jobs** - Active production assignments
4. **My Assets** - Equipment and asset tracking
5. **My Expenses** - Financial transaction history
6. **My Reports** - Report templates and analytics

#### Widget Management Features
- Enable/disable widgets
- Visual indicators for active widgets
- Position tracking (future: drag-and-drop reordering)
- Reset to default configuration
- Per-user customization

### 3. Real-time Dashboard Stats

The dashboard displays real-time statistics:
- **Tasks Due Today**: Count of tasks with today's due date
- **Upcoming Events**: Count of future events
- **Active Jobs**: Count of active personnel assignments
- **Pending Expenses**: Count of submitted/pending expense reports

## Technical Implementation

### Database Schema

#### user_dashboard_widgets Table
```sql
CREATE TABLE user_dashboard_widgets (
    id TEXT PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Components

#### Core Components
- `DashboardOverviewTab` - Main dashboard view
- `LogExpenseDialog` - Expense submission form
- `BookTravelDialog` - Travel request form
- `CreateTaskDialog` - Task creation form
- `UploadFileDialog` - File upload form
- `WidgetCustomizationDialog` - Widget management panel

#### Hooks
- `useDashboardWidgets` - Widget state management
- `useMyTasks` - Task data with real-time updates
- `useMyAgenda` - Event data with real-time updates
- `useMyJobs` - Job assignment data
- `useMyExpenses` - Expense data

### Features

#### Toast Notifications
All quick actions use the toast notification system for user feedback:
- Success messages with detailed information
- Error messages with helpful descriptions
- Non-intrusive UI pattern

#### Real-time Updates
The dashboard uses Supabase real-time subscriptions to automatically update when:
- New tasks are created
- Events are added/modified
- Expenses are submitted
- Jobs are assigned
- Files are uploaded

#### Data Refresh
Quick action success callbacks trigger data refresh to ensure the dashboard shows the latest information immediately.

## Usage

### For Users

#### Accessing Quick Actions
1. Navigate to Dashboard → Overview tab
2. Locate the "Quick Actions" card
3. Click any action button to open the dialog
4. Fill in the required fields
5. Submit the form
6. Receive instant feedback via toast notification

#### Customizing Widgets
1. Navigate to Dashboard → Overview tab
2. Locate the "Customize Dashboard" card
3. Click "Manage All" to open the customization dialog
4. Toggle widgets on/off using switches
5. Click "Reset to Defaults" to restore original configuration

### For Developers

#### Adding a New Quick Action

1. Create a new dialog component in `src/components/dashboard/quick-actions/`:
```tsx
export function NewActionDialog({ 
  open, 
  onOpenChange, 
  workspaceId, 
  userId, 
  onSuccess 
}: NewActionDialogProps) {
  // Implementation
}
```

2. Add to `quick-actions/index.ts`:
```tsx
export { NewActionDialog } from './new-action-dialog'
```

3. Import and add to `DashboardOverviewTab`:
```tsx
import { NewActionDialog } from "./quick-actions"

// Add state
const [newActionOpen, setNewActionOpen] = useState(false)

// Add to quickActions array
{ label: "New Action", icon: IconName, color: "text-color", action: () => setNewActionOpen(true) }

// Add dialog component
<NewActionDialog
  open={newActionOpen}
  onOpenChange={setNewActionOpen}
  workspaceId={workspaceId}
  userId={userId}
  onSuccess={handleRefresh}
/>
```

#### Adding a New Widget

1. Update the `DEFAULT_WIDGETS` array in `use-dashboard-widgets.ts`:
```tsx
{ id: '7', name: 'New Widget', type: 'new-widget', position: 6, enabled: false }
```

2. Add widget metadata to `DashboardOverviewTab`:
```tsx
const widgetTypes = [
  // ...existing widgets
  { id: 7, name: "New Widget", icon: IconName, color: "bg-color-500", route: `/workspace/${workspaceId}/dashboard/new-widget` },
]
```

3. Add icon and color mappings in `WidgetCustomizationDialog`:
```tsx
const widgetIcons = {
  // ...existing
  'new-widget': IconName,
}

const widgetColors = {
  // ...existing
  'new-widget': 'bg-color-500',
}
```

## Database Migrations

Required migration: `065_user_dashboard_widgets.sql`

To apply:
```bash
supabase db push
```

Or manually:
```sql
\i supabase/migrations/065_user_dashboard_widgets.sql
```

## Security

### Row Level Security (RLS)
All dashboard data is protected with RLS policies:
- Users can only view their own widgets
- Users can only insert/update/delete their own widgets
- Workspace isolation is enforced
- Auth checks use `auth.uid()`

### Data Validation
- Form validation on client-side
- Database constraints enforce data integrity
- Type safety with TypeScript
- Error handling with try-catch blocks

## Performance

### Optimizations
- Real-time subscriptions minimize polling
- Indexed database queries
- Component-level loading states
- Optimistic UI updates
- Lazy loading of dialog content

### Best Practices
- Minimize re-renders with proper state management
- Use React hooks for data fetching
- Cache data where appropriate
- Debounce user actions
- Show loading states

## Future Enhancements

### Planned Features
- [ ] Drag-and-drop widget reordering
- [ ] Widget-specific settings (refresh rate, filters, etc.)
- [ ] Quick action templates/favorites
- [ ] Bulk actions from dashboard
- [ ] Dashboard export/import
- [ ] Mobile-optimized quick actions
- [ ] Keyboard shortcuts
- [ ] Dashboard themes
- [ ] Widget collaboration (share configurations)
- [ ] Advanced analytics widgets

### Enhancement Ideas
- Dashboard presets (Manager, Artist, Admin, etc.)
- AI-powered action suggestions
- Voice-activated quick actions
- Dashboard automation rules
- Custom widget creation
- Third-party widget integrations

## Troubleshooting

### Common Issues

#### Widgets not saving
- Check if user is authenticated
- Verify workspace_id is valid
- Check browser console for RLS errors
- Ensure migration 065 is applied

#### Quick actions failing
- Verify all required fields are filled
- Check database table exists
- Confirm user has necessary permissions
- Review Supabase logs for errors

#### Real-time updates not working
- Check Supabase real-time is enabled
- Verify WebSocket connection
- Check browser console for errors
- Ensure RLS policies allow reading

## Testing

### Manual Testing Checklist
- [ ] Log expense with all fields
- [ ] Book travel with dates
- [ ] Create task with due date
- [ ] Upload file successfully
- [ ] Enable/disable widgets
- [ ] Reset widgets to defaults
- [ ] Verify real-time updates
- [ ] Check toast notifications
- [ ] Test error scenarios
- [ ] Verify mobile responsiveness

### Automated Testing
```bash
# Run component tests
npm test -- dashboard

# Run E2E tests
npm run test:e2e -- dashboard
```

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check Supabase logs
4. Contact development team

## License

This implementation is part of the Dragonfly26 project and follows the project's licensing terms.
