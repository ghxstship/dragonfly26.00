# Files Module Quick Reference

## Key Functions

### Storage & Quotas
```sql
-- Check if upload is allowed
SELECT check_storage_quota('workspace-id', 52428800); -- 50MB

-- Update quota usage
SELECT update_workspace_storage_usage('workspace-id');

-- Get quota details
SELECT * FROM workspace_storage_quotas WHERE workspace_id = 'workspace-id';
```

### Trash Operations
```sql
-- Move to trash
SELECT move_file_to_trash('file-id');

-- Restore from trash
SELECT restore_file_from_trash('file-id');

-- List trash
SELECT * FROM file_trash WHERE restore_available = true;
```

### Chunked Uploads
```sql
-- Create session
INSERT INTO file_upload_sessions (workspace_id, file_name, file_size_bytes, total_chunks, chunk_size_bytes, uploaded_by)
VALUES ('workspace-id', 'video.mp4', 1073741824, 200, 5242880, auth.uid());

-- Complete upload
SELECT complete_chunked_upload('session-id');
```

### File Permissions
```sql
-- Check permission
SELECT check_file_permission('file-id', 'user-id', 'editor');

-- Grant permission
INSERT INTO file_permissions (file_id, user_id, permission_level, granted_by)
VALUES ('file-id', 'user-id', 'editor', auth.uid());

-- Batch share
SELECT batch_share_files(
  ARRAY['file-id-1', 'file-id-2']::UUID[],
  ARRAY['user-id-1', 'user-id-2']::UUID[],
  'viewer'
);
```

### Audit & Activity
```sql
-- Log audit event
SELECT log_file_audit('file-id', 'download', '{"ip": "1.2.3.4"}'::jsonb, true);

-- View audit log
SELECT * FROM file_audit_logs 
WHERE file_id = 'file-id' 
ORDER BY created_at DESC;

-- Compliance events
SELECT * FROM file_audit_logs 
WHERE compliance_relevant = true 
  AND created_at > NOW() - INTERVAL '30 days';
```

### Cache & Performance
```sql
-- Update cache stats
SELECT update_file_cache_stats('file-id', 250); -- 250ms access time

-- Get cache recommendations
SELECT * FROM file_cache_statistics 
WHERE should_cache = true 
ORDER BY cache_priority DESC;
```

### Maintenance
```sql
-- Daily cleanup
SELECT cleanup_expired_files();

-- Release expired locks
SELECT auto_release_expired_locks();
```

---

## Important Tables

### Core Files
- `files` - Main file records
- `file_versions` - Version history
- `file_folders` - Folder structure
- `file_categories` - File categories

### Collaboration
- `file_permissions` - Access control
- `file_comments` - Comments
- `file_activities` - Activity log
- `file_presence` - Real-time presence
- `file_collaboration_sessions` - Active sessions

### Storage & Sync
- `workspace_storage_quotas` - Quotas
- `file_upload_sessions` - Chunked uploads
- `external_storage_connections` - External providers
- `user_sync_preferences` - Sync settings

### Workflows
- `file_workflows` - Workflow definitions
- `file_workflow_instances` - Active workflows
- `file_locks` - File locks
- `file_conflicts` - Conflicts

### Advanced
- `file_trash` - Deleted files
- `file_audit_logs` - Audit trail
- `file_content_extraction` - OCR results
- `file_cache_statistics` - Performance data
- `file_encryption_metadata` - Encryption info
- `adobe_cc_integrations` - Adobe CC

---

## Common Queries

### Storage Usage by Workspace
```sql
SELECT 
  w.name,
  q.storage_used_bytes / 1024 / 1024 / 1024 AS gb_used,
  q.storage_limit_bytes / 1024 / 1024 / 1024 AS gb_limit,
  q.current_file_count,
  ROUND((q.storage_used_bytes::numeric / q.storage_limit_bytes) * 100, 2) AS percent_used
FROM workspace_storage_quotas q
JOIN workspaces w ON w.id = q.workspace_id
ORDER BY percent_used DESC;
```

### Active Collaborators
```sql
SELECT 
  p.user_id,
  u.email,
  p.activity_type,
  p.last_heartbeat
FROM file_presence p
JOIN auth.users u ON u.id = p.user_id
WHERE p.file_id = 'file-id'
  AND p.last_heartbeat > NOW() - INTERVAL '5 minutes';
```

### Files Expiring Soon
```sql
SELECT 
  id,
  name,
  expires_at,
  expiration_action,
  EXTRACT(DAY FROM expires_at - NOW()) AS days_until_expiry
FROM files
WHERE expires_at IS NOT NULL
  AND expires_at > NOW()
  AND expires_at < NOW() + INTERVAL '7 days'
  AND status = 'active'
ORDER BY expires_at;
```

### Most Downloaded Files
```sql
SELECT 
  f.id,
  f.name,
  COUNT(fd.id) AS download_count,
  MAX(fd.created_at) AS last_download
FROM files f
JOIN file_downloads fd ON fd.file_id = f.id
WHERE f.workspace_id = 'workspace-id'
  AND fd.created_at > NOW() - INTERVAL '30 days'
GROUP BY f.id, f.name
ORDER BY download_count DESC
LIMIT 10;
```

### Files by Access Pattern
```sql
SELECT 
  access_pattern,
  COUNT(*) AS file_count,
  ROUND(AVG(access_frequency), 2) AS avg_frequency,
  ROUND(AVG(average_access_time_ms), 2) AS avg_time_ms
FROM file_cache_statistics
WHERE workspace_id = 'workspace-id'
GROUP BY access_pattern
ORDER BY avg_frequency DESC;
```

### Pending Workflows
```sql
SELECT 
  fi.id,
  f.name AS file_name,
  fw.name AS workflow_name,
  fi.current_step,
  fi.status,
  fi.started_at
FROM file_workflow_instances fi
JOIN files f ON f.id = fi.file_id
JOIN file_workflows fw ON fw.id = fi.workflow_id
WHERE fi.status IN ('pending', 'in_progress')
  AND f.workspace_id = 'workspace-id'
ORDER BY fi.started_at;
```

### Failed Uploads
```sql
SELECT 
  id,
  file_name,
  file_size_bytes / 1024 / 1024 AS mb_size,
  chunks_uploaded || '/' || total_chunks AS progress,
  created_at,
  expires_at
FROM file_upload_sessions
WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## API Patterns

### Pre-upload Check
```typescript
// Check quota before upload
const canUpload = await supabase.rpc('check_storage_quota', {
  p_workspace_id: workspaceId,
  p_file_size_bytes: file.size
});

if (!canUpload.data) {
  throw new Error('Storage quota exceeded');
}
```

### Chunked Upload Flow
```typescript
// 1. Create session
const session = await supabase.from('file_upload_sessions').insert({
  workspace_id: workspaceId,
  file_name: file.name,
  file_size_bytes: file.size,
  total_chunks: Math.ceil(file.size / CHUNK_SIZE),
  chunk_size_bytes: CHUNK_SIZE,
  uploaded_by: userId
}).select().single();

// 2. Upload chunks
for (let i = 0; i < totalChunks; i++) {
  const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  await uploadChunk(session.data.id, i + 1, chunk);
}

// 3. Complete
const fileId = await supabase.rpc('complete_chunked_upload', {
  p_session_id: session.data.id
});
```

### Real-time Presence
```typescript
// Update heartbeat every 30s
setInterval(async () => {
  await supabase.from('file_presence').upsert({
    file_id: fileId,
    user_id: userId,
    activity_type: 'editing',
    last_heartbeat: new Date().toISOString()
  });
}, 30000);

// Subscribe to changes
supabase.channel(`file:${fileId}`)
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'file_presence',
    filter: `file_id=eq.${fileId}`
  }, handlePresenceChange)
  .subscribe();
```

---

## RLS Policies

All tables have Row-Level Security enabled. Key patterns:

### Workspace-based Access
```sql
CREATE POLICY "workspace_access" ON table_name FOR ALL
USING (workspace_id IN (
  SELECT w.id FROM workspaces w
  INNER JOIN organization_members om ON w.organization_id = om.organization_id
  WHERE om.user_id = auth.uid()
));
```

### File Permission Check
```sql
CREATE POLICY "file_access" ON table_name FOR ALL
USING (check_file_permission(file_id, auth.uid(), 'viewer'));
```

### User-owned Data
```sql
CREATE POLICY "own_data" ON table_name FOR ALL
USING (user_id = auth.uid());
```

---

## Performance Tips

1. **Use partial indexes** - Queries on `status = 'active'` use optimized indexes
2. **Batch operations** - Use `batch_*` functions for multiple files
3. **Cache results** - File permissions are cached, query once
4. **Async workers** - Preview/OCR processing runs in background
5. **Quota triggers** - Storage updates automatically, no manual calculation needed

---

## Troubleshooting

### Upload Fails
```sql
-- Check quota
SELECT * FROM workspace_storage_quotas WHERE workspace_id = 'workspace-id';

-- Check expired sessions
SELECT * FROM file_upload_sessions 
WHERE status = 'failed' AND uploaded_by = auth.uid()
ORDER BY created_at DESC;
```

### Permission Denied
```sql
-- Check file permission
SELECT check_file_permission('file-id', auth.uid(), 'viewer');

-- List user permissions
SELECT * FROM file_permissions WHERE user_id = auth.uid();
```

### Slow Queries
```sql
-- Check cache stats
SELECT * FROM file_cache_statistics 
WHERE should_cache = false AND access_frequency > 20;

-- Missing indexes (check EXPLAIN output)
EXPLAIN ANALYZE SELECT * FROM files WHERE workspace_id = 'workspace-id';
```

---

## Environment Variables

Required for full functionality:

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_KEY=eyJxxx... # Server-side only

# Adobe CC (optional)
ADOBE_CLIENT_ID=xxx
ADOBE_CLIENT_SECRET=xxx
ADOBE_REDIRECT_URI=https://yourdomain.com/api/adobe/callback

# Workers
PREVIEW_WORKER_ENABLED=true
OCR_WORKER_ENABLED=true
```

---

## Migration Checklist

- [ ] Run `080_files_enterprise_optimization.sql`
- [ ] Initialize default quotas for workspaces
- [ ] Set up scheduled tasks (cleanup, locks)
- [ ] Deploy preview generation worker
- [ ] Deploy OCR processing worker
- [ ] Configure Adobe CC OAuth (if needed)
- [ ] Test chunked upload
- [ ] Test trash/recovery
- [ ] Verify RLS policies
- [ ] Monitor storage usage
- [ ] Set up alerts for quota limits

---

## Key Metrics to Monitor

- Storage usage per workspace (alert at 90%)
- Bandwidth usage per workspace (alert at 90%)
- Failed upload sessions (alert if > 5% failure rate)
- Pending preview queue size (alert if > 100 items)
- Pending OCR queue size (alert if > 50 items)
- Active collaboration sessions
- Audit log volume (archive monthly)

---

## Support Resources

- **Main Docs:** `docs/FILES_ENTERPRISE_OPTIMIZATION.md`
- **Implementation:** `docs/FILES_IMPLEMENTATION_GUIDE.md`
- **Migration:** `supabase/migrations/080_files_enterprise_optimization.sql`
- **Summary:** `FILES_MODULE_OPTIMIZATION_SUMMARY.md`
