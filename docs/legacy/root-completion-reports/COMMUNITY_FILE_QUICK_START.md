# Community File Collaboration - Quick Start Guide

**Get started with file collaboration features in 5 minutes**

---

## 🚀 Quick Implementation

### 1. Add File Sharing to Any Component

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileShareDialog } from '@/components/files/file-share-dialog'
import { Share2 } from 'lucide-react'

function MyComponent({ fileId, fileName }: { fileId: string, fileName: string }) {
  const [showShare, setShowShare] = useState(false)

  return (
    <>
      <Button onClick={() => setShowShare(true)}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <FileShareDialog
        fileId={fileId}
        fileName={fileName}
        open={showShare}
        onOpenChange={setShowShare}
      />
    </>
  )
}
```

---

### 2. Add Comments to Files

```tsx
import { FileCommentsPanel } from '@/components/files/file-comments-panel'

function FileViewer({ fileId }: { fileId: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* File preview */}
      <div className="col-span-2">
        {/* Your file preview here */}
      </div>

      {/* Comments sidebar */}
      <FileCommentsPanel fileId={fileId} className="col-span-1" />
    </div>
  )
}
```

---

### 3. Show Activity Timeline

```tsx
import { FileActivityTimeline } from '@/components/files/file-activity-timeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function FileDetails({ fileId }: { fileId: string }) {
  return (
    <Tabs defaultValue="activity">
      <TabsList>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="activity">
        <FileActivityTimeline fileId={fileId} />
      </TabsContent>

      <TabsContent value="details">
        {/* File metadata */}
      </TabsContent>
    </Tabs>
  )
}
```

---

### 4. Attach Files to Posts

```tsx
import { useState } from 'react'
import { FileAttachmentButton } from '@/components/files/file-attachment-button'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function CreatePost() {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const handleSubmit = async () => {
    // Upload files and create post
    console.log('Post content:', content)
    console.log('Attached files:', files)
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />

      <div className="flex items-center justify-between">
        <FileAttachmentButton
          onFilesSelected={setFiles}
          maxFiles={5}
          acceptedTypes="image/*,.pdf,.doc,.docx"
        />

        <Button onClick={handleSubmit}>
          Post
        </Button>
      </div>
    </div>
  )
}
```

---

## 🎣 Using Hooks

### Check User Permission

```tsx
import { useCheckFilePermission } from '@/hooks/use-file-collaboration'

function FileActions({ fileId }: { fileId: string }) {
  const { hasPermission, loading } = useCheckFilePermission(fileId, 'editor')

  if (loading) return <div>Checking permissions...</div>

  return (
    <>
      {hasPermission ? (
        <Button>Edit File</Button>
      ) : (
        <Button disabled>View Only</Button>
      )}
    </>
  )
}
```

---

### Get File Permissions

```tsx
import { useFilePermissions } from '@/hooks/use-file-collaboration'

function PermissionsList({ fileId }: { fileId: string }) {
  const { permissions, loading, error } = useFilePermissions(fileId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading permissions</div>

  return (
    <div>
      <h3>People with access ({permissions.length})</h3>
      {permissions.map((perm) => (
        <div key={perm.id}>
          {perm.user.first_name} {perm.user.last_name} - {perm.permission_level}
        </div>
      ))}
    </div>
  )
}
```

---

### Get Comments

```tsx
import { useFileComments } from '@/hooks/use-file-collaboration'

function CommentCount({ fileId }: { fileId: string }) {
  const { comments, loading } = useFileComments(fileId)

  if (loading) return <span>...</span>

  return (
    <span>
      {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
    </span>
  )
}
```

---

### Show Active Collaborators

```tsx
import { useFileCollaboration } from '@/hooks/use-file-collaboration'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function ActiveUsers({ fileId }: { fileId: string }) {
  const { sessions, loading } = useFileCollaboration(fileId)

  if (loading || sessions.length === 0) return null

  return (
    <div className="flex -space-x-2">
      {sessions.map((session) => (
        <Avatar key={session.id} className="border-2 border-background">
          <AvatarImage src={session.user?.avatar_url} />
          <AvatarFallback>
            {session.user?.first_name?.[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {sessions.length} {sessions.length === 1 ? 'person' : 'people'} viewing
      </span>
    </div>
  )
}
```

---

## 🛠️ Helper Functions

### Generate Share Link

```tsx
import { generateFileShareLink } from '@/hooks/use-file-collaboration'
import { Button } from '@/components/ui/button'

async function handleCreateLink(fileId: string) {
  const link = await generateFileShareLink(fileId)
  if (link) {
    const fullUrl = `${window.location.origin}/files/shared/${link}`
    await navigator.clipboard.writeText(fullUrl)
    console.log('Link copied:', fullUrl)
  }
}

// Usage
<Button onClick={() => handleCreateLink(fileId)}>
  Create Share Link
</Button>
```

---

### Log Activity

```tsx
import { logFileActivity } from '@/hooks/use-file-collaboration'

// Log when user downloads a file
async function handleDownload(fileId: string) {
  await logFileActivity(fileId, 'downloaded', {
    device: 'desktop',
    fileSize: 1024000
  })

  // Proceed with download...
}

// Log when user views a file
async function handleView(fileId: string) {
  await logFileActivity(fileId, 'viewed')
}
```

---

### Add Permission

```tsx
import { addFilePermission } from '@/hooks/use-file-collaboration'

async function shareWithUser(fileId: string, userId: string) {
  try {
    await addFilePermission(fileId, userId, 'editor', {
      canDownload: true,
      canShare: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    console.log('File shared successfully')
  } catch (error) {
    console.error('Error sharing file:', error)
  }
}
```

---

### Add Comment

```tsx
import { addFileComment } from '@/hooks/use-file-collaboration'

async function postComment(fileId: string, text: string) {
  try {
    await addFileComment(fileId, text, {
      mentions: ['user-id-1', 'user-id-2'],
      annotationType: 'general'
    })
    console.log('Comment added')
  } catch (error) {
    console.error('Error adding comment:', error)
  }
}

// Reply to a comment
async function replyToComment(fileId: string, parentId: string, text: string) {
  try {
    await addFileComment(fileId, text, {
      parentCommentId: parentId
    })
    console.log('Reply added')
  } catch (error) {
    console.error('Error replying:', error)
  }
}
```

---

## 📦 Complete Example: File Card

```tsx
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileShareDialog } from '@/components/files/file-share-dialog'
import { 
  useFilePermissions, 
  useFileComments,
  useFileCollaboration 
} from '@/hooks/use-file-collaboration'
import { Share2, MessageCircle, Download, Eye } from 'lucide-react'

interface FileCardProps {
  file: {
    id: string
    name: string
    size_bytes: number
    view_count: number
    download_count: number
    community_visibility: string
  }
}

export function FileCard({ file }: FileCardProps) {
  const [showShare, setShowShare] = useState(false)
  
  const { permissions } = useFilePermissions(file.id)
  const { comments } = useFileComments(file.id)
  const { sessions } = useFileCollaboration(file.id)

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{file.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatSize(file.size_bytes)}
              </p>
            </div>
            <Badge variant="outline">
              {file.community_visibility}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {file.view_count}
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {file.download_count}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {comments.length}
            </div>
          </div>

          {sessions.length > 0 && (
            <div className="mt-2 text-sm text-muted-foreground">
              {sessions.length} {sessions.length === 1 ? 'person' : 'people'} viewing
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowShare(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share {permissions.length > 0 && `(${permissions.length})`}
          </Button>
        </CardFooter>
      </Card>

      <FileShareDialog
        fileId={file.id}
        fileName={file.name}
        open={showShare}
        onOpenChange={setShowShare}
      />
    </>
  )
}
```

---

## 🧪 Testing with Mock Data

```tsx
import {
  mockFiles,
  mockFilePermissions,
  mockFileComments,
  mockFileActivities
} from '@/lib/mock-data/file-collaboration-mock'

// Use in development
function FileList() {
  const files = mockFiles // Replace with real data later

  return (
    <div className="grid gap-4">
      {files.map(file => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  )
}
```

---

## 🎨 Styling Examples

### Custom Activity Timeline

```tsx
<FileActivityTimeline 
  fileId={fileId} 
  className="h-[400px] overflow-y-auto border rounded-lg p-4"
/>
```

### Sidebar Comments

```tsx
<div className="grid grid-cols-4 gap-4">
  <div className="col-span-3">
    {/* Main content */}
  </div>
  <FileCommentsPanel 
    fileId={fileId} 
    className="col-span-1 sticky top-4 h-fit"
  />
</div>
```

---

## 🔗 Common Patterns

### File Browser with Actions

```tsx
function FileBrowser({ workspaceId }: { workspaceId: string }) {
  const { data: files, loading } = useModuleData('files', 'all-documents', workspaceId)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* File list */}
      <div className="col-span-2">
        {files.map(file => (
          <FileCard 
            key={file.id} 
            file={file}
            onClick={() => setSelectedFile(file.id)}
          />
        ))}
      </div>

      {/* Details panel */}
      {selectedFile && (
        <div className="col-span-1 space-y-4">
          <FileActivityTimeline fileId={selectedFile} />
          <FileCommentsPanel fileId={selectedFile} />
        </div>
      )}
    </div>
  )
}
```

---

## 📝 Best Practices

### 1. Always Check Permissions

```tsx
const { hasPermission } = useCheckFilePermission(fileId, 'editor')

if (hasPermission) {
  // Show edit button
}
```

### 2. Log Important Activities

```tsx
// After download
await logFileActivity(fileId, 'downloaded')

// After share
await logFileActivity(fileId, 'shared', { sharedWith: userId })
```

### 3. Handle Errors Gracefully

```tsx
try {
  await addFilePermission(fileId, userId, 'viewer')
} catch (error) {
  console.error('Failed to share file:', error)
  // Show error toast to user
}
```

### 4. Use Real-time Features

All hooks automatically subscribe to real-time updates - no extra code needed!

```tsx
// This automatically updates when permissions change
const { permissions } = useFilePermissions(fileId)
```

---

## 🚨 Common Issues

### Issue: "Function check_file_permission not found"
**Solution:** Run migrations 072 and 073 first

### Issue: "Cannot read property 'first_name' of null"
**Solution:** Add null checks for user data

```tsx
{permission.user?.first_name || 'Unknown User'}
```

### Issue: Real-time not updating
**Solution:** Check Supabase real-time is enabled for your tables

---

## ✅ Quick Checklist

Before deploying:
- [ ] Migrations 072 and 073 applied
- [ ] RLS policies enabled
- [ ] Real-time subscriptions working
- [ ] Helper functions accessible
- [ ] Components imported correctly
- [ ] Mock data for testing
- [ ] Error handling in place
- [ ] Loading states implemented

---

**Need more help?** Check the full documentation:
- `COMMUNITY_FILE_COLLABORATION_OPTIMIZATION.md`
- `COMMUNITY_FILE_QUICK_REFERENCE.md`
- `COMMUNITY_FILE_ARCHITECTURE.md`

**Ready to deploy!** 🎉
