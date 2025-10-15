# Files Module Implementation Guide

## Quick Start

### 1. Run the Migration

```bash
# Apply the new migration
supabase migration up

# Or if using direct psql
psql -h your-db-host -d your-database -f supabase/migrations/080_files_enterprise_optimization.sql
```

### 2. Set Up Scheduled Tasks

Add to your cron/scheduler (recommended: Supabase Edge Functions or pg_cron):

```sql
-- Daily cleanup at 2 AM
SELECT cron.schedule('cleanup-expired-files', '0 2 * * *', 'SELECT cleanup_expired_files()');

-- Hourly lock cleanup
SELECT cron.schedule('cleanup-expired-locks', '0 * * * *', 'SELECT auto_release_expired_locks()');

-- Archive old audit logs monthly
SELECT cron.schedule('archive-audit-logs', '0 0 1 * *', $$
  INSERT INTO file_audit_logs_archive 
  SELECT * FROM file_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM file_audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
$$);
```

### 3. Configure Default Storage Quotas

```sql
-- Set default quotas for existing workspaces
INSERT INTO workspace_storage_quotas (workspace_id, storage_limit_bytes, bandwidth_limit_bytes)
SELECT 
  id,
  107374182400, -- 100GB
  214748364800  -- 200GB/month
FROM workspaces
ON CONFLICT (workspace_id) DO NOTHING;
```

## Frontend Integration Examples

### Chunked Upload (Large Files)

```typescript
// hooks/use-chunked-upload.ts
import { useState } from 'react';

interface ChunkedUploadOptions {
  file: File;
  workspaceId: string;
  folderId?: string;
  chunkSize?: number; // Default: 5MB
  onProgress?: (progress: number) => void;
}

export function useChunkedUpload() {
  const [progress, setProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const upload = async ({
    file,
    workspaceId,
    folderId,
    chunkSize = 5 * 1024 * 1024, // 5MB chunks
    onProgress
  }: ChunkedUploadOptions) => {
    const totalChunks = Math.ceil(file.size / chunkSize);

    // 1. Create upload session
    const { data: session } = await fetch('/api/files/upload/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspace_id: workspaceId,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: file.type,
        total_chunks: totalChunks,
        chunk_size_bytes: chunkSize,
        folder_id: folderId
      })
    }).then(r => r.json());

    setSessionId(session.id);

    // 2. Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunk_number', String(i + 1));

      await fetch(`/api/files/upload/chunk/${session.id}`, {
        method: 'POST',
        body: formData
      });

      const currentProgress = Math.round(((i + 1) / totalChunks) * 100);
      setProgress(currentProgress);
      onProgress?.(currentProgress);
    }

    // 3. Complete upload
    const { data: fileId } = await fetch(`/api/files/upload/complete/${session.id}`, {
      method: 'POST'
    }).then(r => r.json());

    return fileId;
  };

  return { upload, progress, sessionId };
}
```

### Real-Time Presence

```typescript
// components/files/file-presence-indicator.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserPresence {
  user_id: string;
  activity_type: 'viewing' | 'editing' | 'commenting';
  color_code: string;
}

export function FilePresenceIndicator({ fileId }: { fileId: string }) {
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to presence changes
    const channel = supabase.channel(`file:${fileId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_presence',
        filter: `file_id=eq.${fileId}`
      }, (payload) => {
        // Update active users list
        fetchActiveUsers();
      })
      .subscribe();

    // Initial fetch
    fetchActiveUsers();

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      supabase.from('file_presence').upsert({
        file_id: fileId,
        user_id: userId,
        activity_type: 'viewing',
        last_heartbeat: new Date().toISOString()
      });
    }, 30000);

    return () => {
      channel.unsubscribe();
      clearInterval(heartbeat);
    };
  }, [fileId]);

  const fetchActiveUsers = async () => {
    const { data } = await supabase
      .from('file_presence')
      .select('user_id, activity_type, color_code')
      .eq('file_id', fileId)
      .gte('last_heartbeat', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    
    setActiveUsers(data || []);
  };

  return (
    <div className="flex -space-x-2">
      {activeUsers.map(user => (
        <div
          key={user.user_id}
          className="w-8 h-8 rounded-full border-2 border-white"
          style={{ backgroundColor: user.color_code }}
          title={user.activity_type}
        />
      ))}
    </div>
  );
}
```

### Storage Quota Display

```typescript
// components/settings/storage-quota-card.tsx
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function StorageQuotaCard({ workspaceId }: { workspaceId: string }) {
  const [quota, setQuota] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchQuota();

    // Subscribe to realtime updates
    const channel = supabase.channel('storage_quota')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'workspace_storage_quotas',
        filter: `workspace_id=eq.${workspaceId}`
      }, (payload) => {
        setQuota(payload.new);
      })
      .subscribe();

    return () => { channel.unsubscribe(); };
  }, [workspaceId]);

  const fetchQuota = async () => {
    const { data } = await supabase
      .from('workspace_storage_quotas')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();
    
    setQuota(data);
  };

  if (!quota) return null;

  const storagePercent = (quota.storage_used_bytes / quota.storage_limit_bytes) * 100;
  const bandwidthPercent = (quota.bandwidth_used_bytes / quota.bandwidth_limit_bytes) * 100;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Storage & Bandwidth</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Storage</span>
            <span>{formatBytes(quota.storage_used_bytes)} / {formatBytes(quota.storage_limit_bytes)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${storagePercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(storagePercent, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Bandwidth (This Month)</span>
            <span>{formatBytes(quota.bandwidth_used_bytes)} / {formatBytes(quota.bandwidth_limit_bytes)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${bandwidthPercent > 90 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(bandwidthPercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {quota.current_file_count.toLocaleString()} files
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### File Request Public Form

```typescript
// app/file-requests/[token]/page.tsx
export default async function FileRequestPage({ params }: { params: { token: string } }) {
  const supabase = createClient();
  
  const { data: request } = await supabase
    .from('file_requests')
    .select('*')
    .eq('request_token', params.token)
    .eq('status', 'active')
    .single();

  if (!request || (request.expires_at && new Date(request.expires_at) < new Date())) {
    return <div>This file request has expired or is no longer available.</div>;
  }

  const handleSubmit = async (formData: FormData) => {
    'use server';
    
    const files = formData.getAll('files') as File[];
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;

    for (const file of files) {
      // Upload file
      const { data: uploadedFile } = await supabase.storage
        .from('documents')
        .upload(`${request.workspace_id}/${request.folder_id}/${file.name}`, file);

      // Create file record
      const { data: fileRecord } = await supabase
        .from('files')
        .insert({
          workspace_id: request.workspace_id,
          folder_id: request.folder_id,
          name: file.name,
          type: file.type,
          storage_path: uploadedFile.path,
          size_bytes: file.size,
          uploaded_by: null // Anonymous upload
        })
        .select()
        .single();

      // Record submission
      await supabase.from('file_request_submissions').insert({
        file_request_id: request.id,
        file_id: fileRecord.id,
        submitter_email: email,
        submitter_name: name,
        submission_message: message
      });
    }

    // Update file count
    await supabase.rpc('increment', {
      table_name: 'file_requests',
      row_id: request.id,
      column_name: 'current_file_count',
      value: files.length
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
      {request.description && <p className="text-gray-600 mb-6">{request.description}</p>}
      
      <form action={handleSubmit} className="space-y-4">
        {request.require_email && (
          <>
            <input type="email" name="email" placeholder="Your email" required className="w-full px-3 py-2 border rounded" />
            <input type="text" name="name" placeholder="Your name" className="w-full px-3 py-2 border rounded" />
          </>
        )}
        
        <textarea name="message" placeholder="Message (optional)" className="w-full px-3 py-2 border rounded" rows={3} />
        
        <input 
          type="file" 
          name="files" 
          multiple 
          required
          accept={request.allowed_file_types?.join(',')}
          className="w-full"
        />
        
        {request.custom_message && (
          <div className="text-sm text-gray-600 italic">{request.custom_message}</div>
        )}
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Upload Files
        </button>
      </form>
    </div>
  );
}
```

## API Route Examples

### Trash Operations

```typescript
// app/api/files/[id]/trash/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('move_file_to_trash', {
    p_file_id: params.id
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc('restore_file_from_trash', {
    p_file_id: params.id
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
```

### Storage Quota Check

```typescript
// app/api/files/check-quota/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { workspace_id, file_size } = await request.json();
  const supabase = createClient();
  
  const { data: hasQuota } = await supabase.rpc('check_storage_quota', {
    p_workspace_id: workspace_id,
    p_file_size_bytes: file_size
  });

  if (!hasQuota) {
    return NextResponse.json(
      { error: 'Storage quota exceeded' }, 
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

## Worker/Background Job Examples

### Preview Generation Worker

```typescript
// workers/preview-generator.ts
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

async function processPreviewQueue() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

  while (true) {
    // Get next item from queue
    const { data: queueItem } = await supabase
      .from('file_preview_queue')
      .select('*, files(*)')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (!queueItem) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      continue;
    }

    try {
      // Update status to processing
      await supabase
        .from('file_preview_queue')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .eq('id', queueItem.id);

      // Download file
      const { data: fileBlob } = await supabase.storage
        .from('documents')
        .download(queueItem.files.storage_path);

      let previewUrl: string;

      // Generate preview based on type
      if (queueItem.files.type.startsWith('image/')) {
        const preview = await generateImagePreview(fileBlob, queueItem.preview_type);
        previewUrl = await uploadPreview(supabase, preview, queueItem);
      } else if (queueItem.files.type === 'application/pdf') {
        const preview = await generatePDFPreview(fileBlob, queueItem.preview_type);
        previewUrl = await uploadPreview(supabase, preview, queueItem);
      }

      // Update file with preview URL
      await supabase
        .from('files')
        .update({ preview_url: previewUrl })
        .eq('id', queueItem.file_id);

      // Mark as completed
      await supabase
        .from('file_preview_queue')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', queueItem.id);

    } catch (error) {
      // Handle failure
      await supabase
        .from('file_preview_queue')
        .update({ 
          status: 'failed', 
          error_message: error.message,
          retry_count: queueItem.retry_count + 1
        })
        .eq('id', queueItem.id);
    }
  }
}

async function generateImagePreview(blob: Blob, type: string): Promise<Buffer> {
  const buffer = await blob.arrayBuffer();
  const sizes = { thumbnail: 200, small: 400, medium: 800, large: 1600 };
  const size = sizes[type] || 400;

  return sharp(Buffer.from(buffer))
    .resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}

// Start worker
processPreviewQueue();
```

### OCR Processing Worker

```typescript
// workers/ocr-processor.ts
import Tesseract from 'tesseract.js';

async function processOCRQueue() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

  while (true) {
    const { data: extraction } = await supabase
      .from('file_content_extraction')
      .select('*, files(*)')
      .eq('extraction_type', 'ocr')
      .eq('processing_status', 'pending')
      .limit(1)
      .single();

    if (!extraction) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      continue;
    }

    try {
      await supabase
        .from('file_content_extraction')
        .update({ processing_status: 'processing' })
        .eq('id', extraction.id);

      // Download file
      const { data: fileBlob } = await supabase.storage
        .from('documents')
        .download(extraction.files.storage_path);

      // Perform OCR
      const { data: { text, confidence, langs } } = await Tesseract.recognize(fileBlob);

      // Update extraction record
      await supabase
        .from('file_content_extraction')
        .update({
          extracted_text: text,
          confidence_score: confidence,
          language_detected: langs[0],
          processing_status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', extraction.id);

      // Update file search vector
      await supabase.rpc('update_file_search_vector', {
        p_file_id: extraction.file_id
      });

    } catch (error) {
      await supabase
        .from('file_content_extraction')
        .update({
          processing_status: 'failed',
          error_message: error.message
        })
        .eq('id', extraction.id);
    }
  }
}

processOCRQueue();
```

## Testing

### Unit Tests

```typescript
// __tests__/files/chunked-upload.test.ts
import { describe, it, expect } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';

describe('Chunked Upload', () => {
  it('should create upload session', async () => {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('file_upload_sessions')
      .insert({
        workspace_id: 'test-workspace',
        file_name: 'large-file.mp4',
        file_size_bytes: 1073741824, // 1GB
        mime_type: 'video/mp4',
        total_chunks: 200,
        chunk_size_bytes: 5242880, // 5MB
        uploaded_by: 'test-user'
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.status).toBe('uploading');
  });

  it('should enforce storage quota', async () => {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    
    const { data: hasQuota } = await supabase.rpc('check_storage_quota', {
      p_workspace_id: 'test-workspace',
      p_file_size_bytes: 999999999999999 // Huge file
    });

    expect(hasQuota).toBe(false);
  });
});
```

## Deployment Checklist

- [ ] Run migration `080_files_enterprise_optimization.sql`
- [ ] Configure pg_cron or Edge Function schedulers
- [ ] Set up preview generation worker
- [ ] Set up OCR processing worker  
- [ ] Configure default storage quotas
- [ ] Test chunked upload with large file
- [ ] Test file trash and recovery
- [ ] Verify realtime presence updates
- [ ] Test Adobe CC OAuth flow (if applicable)
- [ ] Set up monitoring alerts for quota limits
- [ ] Configure audit log archival
- [ ] Test file request public forms
- [ ] Verify RLS policies

## Monitoring Queries

```sql
-- Check storage usage across workspaces
SELECT 
  w.name,
  q.storage_used_bytes / 1024 / 1024 / 1024 AS gb_used,
  q.storage_limit_bytes / 1024 / 1024 / 1024 AS gb_limit,
  ROUND((q.storage_used_bytes::numeric / q.storage_limit_bytes) * 100, 2) AS percent_used
FROM workspace_storage_quotas q
JOIN workspaces w ON w.id = q.workspace_id
ORDER BY percent_used DESC;

-- Active upload sessions
SELECT COUNT(*) FROM file_upload_sessions WHERE status = 'uploading';

-- Pending preview generation
SELECT COUNT(*) FROM file_preview_queue WHERE status = 'pending';

-- Recent audit trail
SELECT * FROM file_audit_logs 
WHERE compliance_relevant = true 
ORDER BY created_at DESC 
LIMIT 100;
```

## Support

For questions or issues:
- Check the main documentation: `docs/FILES_ENTERPRISE_OPTIMIZATION.md`
- Review migration file: `supabase/migrations/080_files_enterprise_optimization.sql`
- Database schema reference: Supabase Studio
