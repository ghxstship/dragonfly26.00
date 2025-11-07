#!/usr/bin/env node

/**
 * Setup Storage Buckets Script
 * Creates required storage buckets in Supabase
 * 
 * Usage:
 *   node scripts/setup-storage-buckets.js
 * 
 * Required Environment Variables:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Your service role key (from dashboard)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Error: Missing required environment variables')
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nYou can find these in your Supabase Dashboard:')
  console.error('  Settings > API > URL and service_role key')
  process.exit(1)
}

const buckets = [
  {
    id: 'avatars',
    name: 'avatars',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ]
  },
  {
    id: 'logos',
    name: 'logos',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp'
    ]
  },
  {
    id: 'documents',
    name: 'documents',
    public: false,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ]
  },
  {
    id: 'media',
    name: 'media',
    public: false,
    fileSizeLimit: 52428800, // 50MB (can be increased to 500MB via Dashboard)
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ]
  },
  {
    id: 'project-files',
    name: 'project-files',
    public: false,
    fileSizeLimit: 52428800, // 50MB (can be increased to 100MB via Dashboard)
    allowedMimeTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },
  {
    id: 'event-assets',
    name: 'event-assets',
    public: false,
    fileSizeLimit: 52428800, // 50MB (can be increased to 500MB via Dashboard)
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'application/pdf'
    ]
  },
  {
    id: 'contracts',
    name: 'contracts',
    public: false,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  {
    id: 'reports',
    name: 'reports',
    public: false,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
  }
]

async function createBucket(bucket) {
  try {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY
      },
      body: JSON.stringify({
        id: bucket.id,
        name: bucket.name,
        public: bucket.public,
        file_size_limit: bucket.fileSizeLimit,
        allowed_mime_types: bucket.allowedMimeTypes
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Created bucket: ${bucket.name}`)
      return { success: true, bucket: bucket.name, created: true }
    } else if (response.status === 409) {
      console.log(`ℹ️  Bucket already exists: ${bucket.name}`)
      return { success: true, bucket: bucket.name, exists: true }
    } else {
      const error = await response.text()
      // Check if error message indicates duplicate
      if (error.includes('already exists') || error.includes('Duplicate')) {
        console.log(`ℹ️  Bucket already exists: ${bucket.name}`)
        return { success: true, bucket: bucket.name, exists: true }
      }
      console.error(`❌ Failed to create bucket ${bucket.name}:`, error)
      return { success: false, bucket: bucket.name, error }
    }
  } catch (error) {
    console.error(`❌ Error creating bucket ${bucket.name}:`, error.message)
    return { success: false, bucket: bucket.name, error: error.message }
  }
}

async function setupBuckets() {
  console.log('🚀 Setting up Supabase Storage Buckets...\n')
  console.log(`Project URL: ${SUPABASE_URL}\n`)

  const results = []

  for (const bucket of buckets) {
    const result = await createBucket(bucket)
    results.push(result)
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n📊 Summary:')
  const created = results.filter(r => r.created).length
  const existing = results.filter(r => r.exists).length
  const failed = results.filter(r => !r.success).length

  console.log(`  ✅ Successfully created: ${created}`)
  console.log(`  ℹ️  Already existed: ${existing}`)
  console.log(`  ❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('\n⚠️  Some buckets failed to create. Check the errors above.')
    console.log('You may need to create them manually via Supabase Dashboard.')
    process.exit(1)
  }

  console.log('\n✨ Storage setup complete!')
  console.log('\n📝 Note: RLS policies are already applied via migrations.')
  console.log('   If you ran the migrations, storage security is configured.')
}

setupBuckets()
