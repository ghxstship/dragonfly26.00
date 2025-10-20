# EDGE FUNCTIONS QUICK REFERENCE
**Dragonfly26.00 - Developer Guide**

---

## 🚀 QUICK START

### Available Functions

| Function | Endpoint | Purpose |
|----------|----------|---------|
| **data-export** | `/functions/v1/data-export` | Export any table to CSV/JSON |
| **bulk-operations** | `/functions/v1/bulk-operations` | Bulk insert/update/delete/upsert |
| **analytics-processor** | `/functions/v1/analytics-processor` | Process analytics metrics |
| **report-generator** | `/functions/v1/report-generator` | Generate comprehensive reports |
| **notification-sender** | `/functions/v1/notification-sender` | Send multi-channel notifications |
| **file-processor** | `/functions/v1/file-processor` | Process files (compress/convert/scan) |
| **data-sync** | `/functions/v1/data-sync` | Sync/migrate/backup/restore data |
| **automation-engine** | `/functions/v1/automation-engine` | Execute automations |
| **ai-assistant** | `/functions/v1/ai-assistant` | AI-powered assistance |

---

## 📝 USAGE EXAMPLES

### 1. Export Data

```typescript
// Export projects to CSV
const response = await fetch('/functions/v1/data-export', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    table: 'projects',
    filters: { status: 'active' },
    format: 'csv'
  })
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'projects.csv';
a.click();
```

### 2. Bulk Operations

```typescript
// Bulk insert tasks
const response = await fetch('/functions/v1/bulk-operations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    operation: 'insert',
    table: 'tasks',
    records: [
      { title: 'Task 1', status: 'pending', project_id: '123' },
      { title: 'Task 2', status: 'pending', project_id: '123' }
    ]
  })
});

const result = await response.json();
console.log(`Inserted ${result.count} records`);
```

### 3. Process Analytics

```typescript
// Get project performance analytics
const response = await fetch('/functions/v1/analytics-processor', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    metric: 'project_performance',
    dateRange: {
      start: '2025-01-01',
      end: '2025-01-31'
    },
    filters: { department: 'engineering' }
  })
});

const analytics = await response.json();
```

### 4. Generate Report

```typescript
// Generate executive summary
const response = await fetch('/functions/v1/report-generator', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reportType: 'executive_summary',
    parameters: {
      dateRange: {
        start: '2025-01-01',
        end: '2025-01-31'
      }
    }
  })
});

const report = await response.json();
```

### 5. Send Notification

```typescript
// Send email notification
const response = await fetch('/functions/v1/notification-sender', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'email',
    recipients: ['user-id-1', 'user-id-2'],
    subject: 'Project Update',
    message: 'Your project has been approved',
    priority: 'normal'
  })
});
```

### 6. Process File

```typescript
// Generate thumbnail
const response = await fetch('/functions/v1/file-processor', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    operation: 'thumbnail',
    filePath: 'uploads/image.jpg',
    bucket: 'files',
    options: {
      width: 200,
      height: 200
    }
  })
});
```

### 7. Sync Data

```typescript
// Backup table
const response = await fetch('/functions/v1/data-sync', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    operation: 'backup',
    source: {
      table: 'projects'
    },
    options: {
      includeRelations: true
    }
  })
});
```

### 8. Execute Automation

```typescript
// Run automation
const response = await fetch('/functions/v1/automation-engine', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    automationId: 'auto-123',
    trigger: { type: 'record_created', table: 'projects' },
    conditions: [
      { table: 'projects', field: 'budget', operator: 'greater_than', value: 100000 }
    ],
    action: {
      type: 'send_notification',
      parameters: {
        recipient_id: 'manager-id',
        subject: 'High-value project',
        message: 'New project with budget > $100k'
      }
    }
  })
});
```

### 9. AI Assistant

```typescript
// Chat with AI
const response = await fetch('/functions/v1/ai-assistant', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    operation: 'chat',
    query: 'What are my top 5 projects by budget?',
    context: {
      module: 'projects',
      current_view: 'overview'
    }
  })
});

const aiResponse = await response.json();
```

---

## 🔧 CUSTOM HOOK

```typescript
// hooks/use-edge-function.ts
import { useAuth } from '@/hooks/use-auth';

export function useEdgeFunction(functionName: string) {
  const { session } = useAuth();
  
  const execute = async (params: any) => {
    const response = await fetch(`/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      throw new Error(`Edge function error: ${response.statusText}`);
    }
    
    return response.json();
  };
  
  return { execute };
}

// Usage in component
const { execute } = useEdgeFunction('data-export');

const handleExport = async () => {
  try {
    const result = await execute({
      table: 'projects',
      format: 'csv'
    });
    console.log('Export complete:', result);
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

---

## 🔒 SECURITY

All edge functions:
- ✅ Require authentication (Bearer token)
- ✅ Enforce RLS policies
- ✅ Validate user permissions
- ✅ Log all operations
- ✅ Use HTTPS encryption

---

## 📊 MONITORING

### Check Function Status

```bash
# List all functions
supabase functions list

# View function logs
supabase functions logs data-export --tail

# Check function metrics
supabase functions stats data-export
```

---

## 🚨 ERROR HANDLING

All functions return consistent error format:

```json
{
  "error": "Error message here"
}
```

Handle errors in your code:

```typescript
const response = await fetch('/functions/v1/data-export', { ... });

if (!response.ok) {
  const error = await response.json();
  console.error('Function error:', error.error);
  // Handle error appropriately
}
```

---

## 📚 FULL DOCUMENTATION

See `docs/EDGE_FUNCTIONS_ARCHITECTURE_2025_01_20.md` for complete documentation.

---

**Last Updated:** January 20, 2025  
**Version:** 1.0
