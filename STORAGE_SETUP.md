# Storage Buckets Setup - Required

⚠️ **IMPORTANT**: Storage buckets cannot be created via SQL migrations.

## ✅ Good News: RLS Policies Already Applied!

The storage RLS (Row Level Security) policies are **already in your database** via migration `009_storage_layer.sql`. You just need to create the actual buckets.

## 🚀 Automated Setup (Recommended)

Run the automated setup script to create all buckets at once:

### Step 1: Get Your Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Copy your **service_role key** (keep it secret!)

### Step 2: Run the Setup Script

```bash
# Set environment variables
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the script (it will use NEXT_PUBLIC_SUPABASE_URL from .env)
node scripts/setup-storage-buckets.js
```

The script will create all 8 buckets with proper MIME type restrictions:
- ✅ avatars (JPEG, PNG, WebP, GIF)
- ✅ logos (JPEG, PNG, SVG, WebP)
- ✅ documents (PDF, Office docs, Text, CSV)
- ✅ media (Images, Video, Audio)
- ✅ project-files (PDF, ZIP, Images, Office docs)
- ✅ event-assets (Images, Video, PDF)
- ✅ contracts (PDF, Word docs)
- ✅ reports (PDF, Excel, CSV)

---

## 📱 Manual Setup (Alternative)

If you prefer to create buckets manually:

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

**✅ RLS Policies**: Already applied via migrations! No manual SQL needed.

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
