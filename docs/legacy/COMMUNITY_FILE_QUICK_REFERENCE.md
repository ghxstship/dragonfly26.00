# Community File Collaboration - Quick Reference

**Quick guide for developers implementing file collaboration features**

---

## Common Operations

### 1. Upload File with Community Sharing

```typescript
// Upload file to Supabase Storage
const { data: fileData, error: uploadError } = await supabase.storage
  .from('documents')
  .upload(`${workspaceId}/${fileName}`, file);

// Create file record
const { data: fileRecord } = await supabase.from('files').insert({
  workspace_id: workspaceId,
  name: fileName,
  type: file.type,
  storage_path: fileData.path,
  size_bytes: file.size,
  community_visibility: 'workspace', // or 'private', 'connections', 'community'
  uploaded_by: currentUserId
}).select().single();

// Log activity
await supabase.rpc('log_file_activity', {
  p_file_id: fileRecord.id,
  p_activity_type: 'uploaded'
});
```

### 2. Share File with User

```typescript
// Grant permission
await supabase.from('file_permissions').insert({
  file_id: fileId,
  user_id: recipientUserId,
  permission_level: 'editor', // 'viewer', 'commenter', 'editor', 'owner'
  can_download: true,
  can_share: false,
  expires_at: null // or Date for temporary access
});

// Notify user (implement notification system)
// await notifyUser(recipientUserId, 'file_shared', fileId);
```

### 3. Generate Public Share Link

```typescript
// Generate secure link
const { data: token } = await supabase.rpc('generate_file_share_link', {
  p_file_id: fileId
});

// Optionally set expiration and password
await supabase.from('files').update({
  community_visibility: 'link_shared',
  share_link_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  share_link_password: await hashPassword('secret123')
}).eq('id', fileId);

// Return shareable URL
const shareUrl = `${appUrl}/files/shared/${token}`;
```

### 4. Add Comment to File

```typescript
await supabase.from('file_comments').insert({
  file_id: fileId,
  user_id: currentUserId,
  content: commentText,
  annotation_type: 'general', // or 'text_selection', 'area', 'point'
  mentions: mentionedUserIds // array of UUIDs
});
```

### 5. Check User Permission

```typescript
const { data: hasPermission } = await supabase.rpc('check_file_permission', {
  p_file_id: fileId,
  p_user_id: currentUserId,
  p_required_permission: 'editor' // 'viewer', 'commenter', 'editor', 'owner'
});

if (!hasPermission) {
  throw new Error('Insufficient permissions');
}
```

### 6. Lock File for Editing

```typescript
// Acquire lock
const { data: lock } = await supabase.from('file_locks').insert({
  file_id: fileId,
  user_id: currentUserId,
  lock_type: 'write', // 'read', 'write', 'exclusive'
  expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  auto_release: true
}).select().single();

// Edit file...

// Release lock when done
await supabase.from('file_locks').update({
  released_at: new Date()
}).eq('id', lock.id);
```

### 7. Start Workflow

```typescript
// Initiate approval workflow
const { data: instanceId } = await supabase.rpc('initiate_file_workflow', {
  p_file_id: fileId,
  p_workflow_id: workflowId
});

// Approve a step (as approver)
await supabase.rpc('approve_workflow_step', {
  p_instance_id: instanceId,
  p_step_number: 1,
  p_decision: 'approved', // or 'rejected'
  p_comments: 'Approved with minor changes'
});
```

### 8. Connect External Storage

```typescript
// After OAuth flow, save tokens
await supabase.from('external_storage_connections').insert({
  workspace_id: workspaceId,
  user_id: currentUserId,
  provider: 'dropbox', // 'google_drive', 'box', 'onedrive'
  access_token: encryptedAccessToken,
  refresh_token: encryptedRefreshToken,
  token_expires_at: tokenExpiry,
  provider_account_id: accountId,
  provider_email: userEmail,
  auto_sync_enabled: true
});

// Queue file for sync
await supabase.from('file_sync_queue').insert({
  file_id: fileId,
  connection_id: connectionId,
  sync_direction: 'upload', // 'download', 'bidirectional'
  priority: 5
});
```

### 9. Create Folder

```typescript
const { data: folder } = await supabase.from('file_folders').insert({
  workspace_id: workspaceId,
  name: folderName,
  description: 'Optional description',
  parent_folder_id: parentId || null,
  color: '#4ECDC4',
  community_visibility: 'workspace',
  created_by: currentUserId
}).select().single();
```

### 10. Batch Operations

```typescript
// Move multiple files
const { data: count } = await supabase.rpc('batch_move_files', {
  p_file_ids: selectedFileIds,
  p_target_folder_id: targetFolderId
});

// Tag multiple files
await supabase.rpc('batch_tag_files', {
  p_file_ids: selectedFileIds,
  p_tags: ['important', 'q1-2025']
});

// Share with multiple users
await supabase.rpc('batch_share_files', {
  p_file_ids: selectedFileIds,
  p_user_ids: recipientUserIds,
  p_permission_level: 'viewer'
});
```

---

## Real-time Subscriptions

### Subscribe to File Changes

```typescript
const channel = supabase
  .channel(`file:${fileId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'files',
    filter: `id=eq.${fileId}`
  }, (payload) => {
    console.log('File updated:', payload.new);
    updateFileInUI(payload.new);
  })
  .subscribe();
```

### Subscribe to Comments

```typescript
const channel = supabase
  .channel(`file:${fileId}:comments`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'file_comments',
    filter: `file_id=eq.${fileId}`
  }, (payload) => {
    addCommentToUI(payload.new);
  })
  .subscribe();
```

### Subscribe to Collaboration Sessions

```typescript
const channel = supabase
  .channel(`file:${fileId}:collab`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'file_collaboration_sessions',
    filter: `file_id=eq.${fileId}`
  }, (payload) => {
    updateActiveCollaborators(payload.new);
  })
  .subscribe();
```

---

## Queries

### Get Files with Full Details

```typescript
const { data: files } = await supabase
  .from('files')
  .select(`
    *,
    uploader:profiles!uploaded_by(first_name, last_name, avatar_url),
    folder:file_folders(id, name, path),
    permissions:file_permissions(count),
    comments:file_comments(count),
    favorites:file_favorites(count)
  `)
  .eq('workspace_id', workspaceId)
  .eq('status', 'active')
  .order('updated_at', { ascending: false });
```

### Get File Activity History

```typescript
const { data: activities } = await supabase
  .from('file_activities')
  .select(`
    *,
    user:profiles(first_name, last_name, avatar_url)
  `)
  .eq('file_id', fileId)
  .order('created_at', { ascending: false })
  .limit(50);
```

### Get Shared Files

```typescript
const { data: sharedFiles } = await supabase
  .from('file_permissions')
  .select(`
    *,
    file:files(
      *,
      uploader:profiles(first_name, last_name, avatar_url)
    )
  `)
  .eq('user_id', currentUserId)
  .order('created_at', { ascending: false });
```

### Get Files in Folder

```typescript
const { data: files } = await supabase
  .from('files')
  .select('*')
  .eq('folder_id', folderId)
  .eq('status', 'active')
  .order('name');

const { data: subfolders } = await supabase
  .from('file_folders')
  .select('*')
  .eq('parent_folder_id', folderId)
  .order('name');
```

### Search Files

```typescript
const { data: results } = await supabase
  .from('files')
  .select('*')
  .textSearch('search_vector', searchQuery, {
    type: 'websearch',
    config: 'english'
  })
  .eq('workspace_id', workspaceId)
  .eq('status', 'active')
  .limit(20);
```

### Get Workflow Status

```typescript
const { data: instance } = await supabase
  .from('file_workflow_instances')
  .select(`
    *,
    workflow:file_workflows(*),
    approvals:file_workflow_approvals(
      *,
      approver:profiles(first_name, last_name, avatar_url)
    ),
    file:files(name, type)
  `)
  .eq('id', instanceId)
  .single();
```

---

## Error Handling

### Check Before Operations

```typescript
// Check if file exists and user has access
const { data: file, error } = await supabase
  .from('files')
  .select('*')
  .eq('id', fileId)
  .single();

if (error || !file) {
  throw new Error('File not found');
}

// Check permission
const hasAccess = await supabase.rpc('check_file_permission', {
  p_file_id: fileId,
  p_user_id: currentUserId,
  p_required_permission: 'editor'
});

if (!hasAccess) {
  throw new Error('Insufficient permissions');
}

// Check if locked
const { data: locks } = await supabase
  .from('file_locks')
  .select('*')
  .eq('file_id', fileId)
  .is('released_at', null);

if (locks && locks.length > 0 && locks[0].user_id !== currentUserId) {
  throw new Error(`File is locked by another user until ${locks[0].expires_at}`);
}
```

---

## Best Practices

### 1. Always Log Activities
```typescript
// After any significant file operation
await supabase.rpc('log_file_activity', {
  p_file_id: fileId,
  p_activity_type: 'downloaded',
  p_details: { size: fileSize, format: fileFormat }
});
```

### 2. Update View/Download Counts
```typescript
// When file is accessed
await supabase.from('files').update({
  view_count: supabase.raw('view_count + 1'),
  last_accessed_at: new Date()
}).eq('id', fileId);
```

### 3. Clean Up Expired Items
```typescript
// Periodically or via cron job
await supabase.rpc('auto_release_expired_locks');

// Remove expired permissions
await supabase.from('file_permissions').delete()
  .lt('expires_at', new Date())
  .not('expires_at', 'is', null);
```

### 4. Use Transactions for Complex Operations
```typescript
// Use Supabase Edge Function for complex multi-table operations
// that need to be atomic
```

### 5. Optimize Queries
```typescript
// Use select() to only fetch needed fields
const { data } = await supabase
  .from('files')
  .select('id, name, type, size_bytes')
  .limit(100);

// Use indexes (already created in migrations)
// Use materialized view for analytics
const { data } = await supabase
  .from('file_analytics')
  .select('*');
```

---

## Security Checklist

- [ ] Always check `check_file_permission()` before operations
- [ ] Encrypt sensitive data (OAuth tokens, passwords)
- [ ] Validate file types and sizes on upload
- [ ] Sanitize user input (file names, comments)
- [ ] Use HTTPS for all file transfers
- [ ] Implement rate limiting for downloads
- [ ] Audit log all sensitive operations
- [ ] Regular security reviews of RLS policies
- [ ] Monitor for suspicious activity patterns

---

## Common Patterns

### File Preview Component
```typescript
const FilePreview = ({ fileId }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    loadFile();
  }, [fileId]);

  const loadFile = async () => {
    const { data } = await supabase
      .from('files')
      .select('*, uploader:profiles(*)')
      .eq('id', fileId)
      .single();
    
    setFile(data);
    
    // Get preview URL from storage
    if (data.preview_url) {
      setPreviewUrl(data.preview_url);
    } else {
      const { data: signedUrl } = await supabase.storage
        .from('documents')
        .createSignedUrl(data.storage_path, 3600);
      setPreviewUrl(signedUrl.signedUrl);
    }
  };

  return (
    <div className="file-preview">
      {file && (
        <>
          <img src={previewUrl} alt={file.name} />
          <FileMetadata file={file} />
          <FileActions fileId={fileId} />
        </>
      )}
    </div>
  );
};
```

### Permission Badge Component
```typescript
const PermissionBadge = ({ fileId, userId }) => {
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    checkPermission();
  }, [fileId, userId]);

  const checkPermission = async () => {
    const { data } = await supabase
      .from('file_permissions')
      .select('permission_level')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .single();
    
    setPermission(data?.permission_level);
  };

  const badges = {
    owner: { icon: '👑', label: 'Owner', color: 'gold' },
    editor: { icon: '✏️', label: 'Can Edit', color: 'blue' },
    commenter: { icon: '💬', label: 'Can Comment', color: 'green' },
    viewer: { icon: '👁️', label: 'View Only', color: 'gray' }
  };

  const badge = badges[permission];

  return badge ? (
    <span className={`badge badge-${badge.color}`}>
      {badge.icon} {badge.label}
    </span>
  ) : null;
};
```

---

## Troubleshooting

### Files Not Appearing
- Check `status = 'active'`
- Verify workspace_id filter
- Check RLS policies
- Verify user has access

### Permissions Not Working
- Check `check_file_permission()` function
- Verify permission hasn't expired
- Check workspace membership
- Review RLS policies

### Search Not Finding Files
- Ensure `search_vector` is populated (trigger should handle this)
- Try refreshing: `REFRESH MATERIALIZED VIEW file_search_view`
- Check full-text search syntax

### External Sync Failing
- Verify OAuth tokens haven't expired
- Check `file_sync_queue` for error messages
- Ensure external storage connection is active
- Review provider API limits

---

**Need Help?** See full documentation in `COMMUNITY_FILE_COLLABORATION_OPTIMIZATION.md`
