# Storage Buckets Setup - Required

⚠️ **IMPORTANT**: Storage buckets cannot be created via SQL migrations. You must create them manually.

## Required Immediate Setup

### 1. Create Avatars Bucket (REQUIRED FOR ONBOARDING)

**Via Supabase Dashboard:**
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **YES** (must be public)
   - **File size limit**: 5 MB (5242880 bytes)
   - **Allowed MIME types**: image/jpeg, image/png, image/webp, image/gif

### 2. Configure Bucket Policies

After creating the bucket, set up the following RLS policies:

**Policy 1: Allow authenticated users to upload their own avatar**
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Allow authenticated users to update their own avatar**
```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 3: Allow authenticated users to delete their own avatar**
```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 4: Allow public read access**
```sql
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## Additional Buckets (Optional - Create as needed)

### Logos
- **Name**: `logos`
- **Public**: Yes
- **Limit**: 5MB
- **Types**: image/jpeg, image/png, image/svg+xml, image/webp

### Documents
- **Name**: `documents`
- **Public**: No
- **Limit**: 50MB
- **Types**: PDF, Word, Excel, PowerPoint, Text, CSV

### Media
- **Name**: `media`
- **Public**: No
- **Limit**: 500MB
- **Types**: Images, Video (MP4, MOV), Audio (MP3, WAV)

### Project Files
- **Name**: `project-files`
- **Public**: No
- **Limit**: 100MB

### Event Assets
- **Name**: `event-assets`
- **Public**: No
- **Limit**: 500MB

## Verification

To verify the avatars bucket is set up correctly:

1. Try uploading an avatar during onboarding
2. Check that the file appears in: **Storage > avatars > {user-id}/**
3. Verify the public URL is accessible

## Troubleshooting

**"Bucket not found" error:**
- Ensure the `avatars` bucket exists
- Check the bucket name is exactly `avatars` (lowercase, no spaces)

**"Permission denied" error:**
- Ensure RLS policies are created as shown above
- Verify the bucket is set to **Public**

**Upload succeeds but image doesn't show:**
- Check the bucket is set to **Public**
- Verify the public URL is correct
- Check browser console for CORS errors

---

**Priority**: Create the `avatars` bucket immediately to fix the onboarding profile upload issue.
