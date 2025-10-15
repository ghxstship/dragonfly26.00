/**
 * Mock data for testing file collaboration features
 * Used for development and testing before database is fully populated
 */

export const mockFiles = [
  {
    id: "file-1",
    workspace_id: "workspace-1",
    name: "Production Budget 2025.xlsx",
    description: "Annual production budget breakdown",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    file_type: "report",
    storage_path: "workspace-1/reports/budget-2025.xlsx",
    size_bytes: 524288,
    community_visibility: "workspace",
    share_link: null,
    download_count: 12,
    view_count: 45,
    uploaded_by: "user-1",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    tags: ["budget", "finance", "2025"],
    folder_id: "folder-1",
    external_storage_provider: "supabase",
    sync_status: "synced"
  },
  {
    id: "file-2",
    workspace_id: "workspace-1",
    name: "Stage Design.pdf",
    description: "Final stage design for summer tour",
    type: "application/pdf",
    file_type: "drawing",
    storage_path: "workspace-1/designs/stage-design.pdf",
    size_bytes: 2097152,
    community_visibility: "connections",
    share_link: "abc123def456",
    download_count: 8,
    view_count: 23,
    uploaded_by: "user-2",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    tags: ["design", "stage", "tour"],
    folder_id: "folder-2",
    external_storage_provider: "dropbox",
    external_storage_id: "dbx:12345",
    sync_status: "synced"
  },
  {
    id: "file-3",
    workspace_id: "workspace-1",
    name: "Vendor Contract - Sound Co.docx",
    description: "Service agreement with sound equipment vendor",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file_type: "contract",
    storage_path: "workspace-1/contracts/vendor-sound-co.docx",
    size_bytes: 102400,
    community_visibility: "private",
    share_link: null,
    download_count: 3,
    view_count: 7,
    uploaded_by: "user-1",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    tags: ["contract", "legal", "vendor"],
    folder_id: "folder-3",
    external_storage_provider: "supabase",
    sync_status: "synced"
  }
]

export const mockFilePermissions = [
  {
    id: "perm-1",
    file_id: "file-1",
    user_id: "user-2",
    permission_level: "editor",
    can_download: true,
    can_share: false,
    expires_at: null,
    granted_by: "user-1",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "perm-2",
    file_id: "file-1",
    user_id: "user-3",
    permission_level: "viewer",
    can_download: true,
    can_share: false,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    granted_by: "user-1",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "perm-3",
    file_id: "file-2",
    user_id: "user-1",
    permission_level: "commenter",
    can_download: true,
    can_share: true,
    expires_at: null,
    granted_by: "user-2",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockFileComments = [
  {
    id: "comment-1",
    file_id: "file-1",
    user_id: "user-2",
    parent_comment_id: null,
    content: "Great work on the budget breakdown! The Q2 numbers look solid.",
    mentions: [],
    annotation_type: "general",
    annotation_data: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment-2",
    file_id: "file-1",
    user_id: "user-1",
    parent_comment_id: "comment-1",
    content: "Thanks! I think we can optimize Q3 even further.",
    mentions: ["user-2"],
    annotation_type: "general",
    annotation_data: null,
    is_resolved: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comment-3",
    file_id: "file-2",
    user_id: "user-3",
    parent_comment_id: null,
    content: "Can we adjust the lighting rig position on page 3?",
    mentions: ["user-2"],
    annotation_type: "area",
    annotation_data: { page: 3, x: 100, y: 200, width: 150, height: 100 },
    is_resolved: true,
    resolved_by: "user-2",
    resolved_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockFileActivities = [
  {
    id: "activity-1",
    file_id: "file-1",
    workspace_id: "workspace-1",
    user_id: "user-1",
    activity_type: "created",
    details: {},
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "activity-2",
    file_id: "file-1",
    workspace_id: "workspace-1",
    user_id: "user-2",
    activity_type: "viewed",
    details: {},
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "activity-3",
    file_id: "file-1",
    workspace_id: "workspace-1",
    user_id: "user-1",
    activity_type: "shared",
    details: { sharedWith: "user-2", permissionLevel: "editor" },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "activity-4",
    file_id: "file-1",
    workspace_id: "workspace-1",
    user_id: "user-2",
    activity_type: "downloaded",
    details: {},
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "activity-5",
    file_id: "file-1",
    workspace_id: "workspace-1",
    user_id: "user-2",
    activity_type: "commented",
    details: {},
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "activity-6",
    file_id: "file-2",
    workspace_id: "workspace-1",
    user_id: "user-2",
    activity_type: "synced",
    details: { provider: "dropbox" },
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
]

export const mockFileFolders = [
  {
    id: "folder-1",
    workspace_id: "workspace-1",
    name: "Financial Reports",
    description: "Budget reports and financial documents",
    color: "#4CAF50",
    parent_folder_id: null,
    path: "/Financial Reports",
    depth: 0,
    community_visibility: "workspace",
    file_count: 5,
    total_size_bytes: 2621440,
    created_by: "user-1",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "folder-2",
    workspace_id: "workspace-1",
    name: "Design Files",
    description: "Stage designs, technical drawings, and renderings",
    color: "#2196F3",
    parent_folder_id: null,
    path: "/Design Files",
    depth: 0,
    community_visibility: "connections",
    file_count: 12,
    total_size_bytes: 25165824,
    created_by: "user-2",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "folder-3",
    workspace_id: "workspace-1",
    name: "Contracts",
    description: "Legal agreements and contracts",
    color: "#FF9800",
    parent_folder_id: null,
    path: "/Contracts",
    depth: 0,
    community_visibility: "private",
    file_count: 8,
    total_size_bytes: 819200,
    created_by: "user-1",
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockExternalStorageConnections = [
  {
    id: "conn-1",
    workspace_id: "workspace-1",
    user_id: "user-2",
    provider: "dropbox",
    provider_account_id: "dbx:12345",
    provider_email: "user2@example.com",
    auto_sync_enabled: true,
    sync_interval_minutes: 15,
    last_sync_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    sync_status: "active",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "conn-2",
    workspace_id: "workspace-1",
    user_id: "user-1",
    provider: "google_drive",
    provider_account_id: "gd:67890",
    provider_email: "user1@example.com",
    auto_sync_enabled: true,
    sync_interval_minutes: 30,
    last_sync_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    sync_status: "active",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockCollaborationSessions = [
  {
    id: "session-1",
    file_id: "file-1",
    user_id: "user-2",
    session_type: "editing",
    cursor_position: { line: 42, column: 15 },
    last_heartbeat: new Date(Date.now() - 30 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: "session-2",
    file_id: "file-1",
    user_id: "user-3",
    session_type: "viewing",
    cursor_position: null,
    last_heartbeat: new Date(Date.now() - 45 * 1000).toISOString(),
    is_active: true,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
]

export const mockSmartFolders = [
  {
    id: "smart-1",
    workspace_id: "workspace-1",
    user_id: "user-1",
    name: "Recent PDFs",
    description: "All PDF files from the last 30 days",
    icon: "FileText",
    color: "#E91E63",
    filter_criteria: {
      fileTypes: ["application/pdf"],
      dateRange: { field: "created_at", days: 30 }
    },
    sort_order: { field: "created_at", direction: "desc" },
    is_pinned: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "smart-2",
    workspace_id: "workspace-1",
    user_id: "user-1",
    name: "Shared with Me",
    description: "Files others have shared with me",
    icon: "Users",
    color: "#9C27B0",
    filter_criteria: {
      sharedWith: "user-1"
    },
    sort_order: { field: "updated_at", direction: "desc" },
    is_pinned: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockFileFavorites = [
  {
    id: "fav-1",
    file_id: "file-1",
    user_id: "user-1",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "fav-2",
    file_id: "file-2",
    user_id: "user-2",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Enterprise Features - Migration 080

export const mockStorageQuotas = [
  {
    id: "quota-1",
    workspace_id: "workspace-1",
    storage_limit_bytes: 107374182400, // 100GB
    storage_used_bytes: 45674291200, // 42.5GB (~43%)
    bandwidth_limit_bytes: 214748364800, // 200GB/month
    bandwidth_used_bytes: 85899345920, // 80GB (~40%)
    bandwidth_reset_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    file_count_limit: 1000000,
    current_file_count: 4523,
    version_retention_days: 90,
    trash_retention_days: 30,
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

export const mockTrashedFiles = [
  {
    id: "trash-1",
    file_id: "file-deleted-1",
    original_folder_id: "folder-1",
    original_path: "/Financial Reports/Old Budget.xlsx",
    deleted_by: "user-1",
    deleted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    auto_delete_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    restore_available: true,
    file: {
      id: "file-deleted-1",
      name: "Old Budget 2024.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size_bytes: 256000
    }
  },
  {
    id: "trash-2",
    file_id: "file-deleted-2",
    original_folder_id: "folder-2",
    original_path: "/Design Files/Draft Stage Plan.pdf",
    deleted_by: "user-2",
    deleted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    auto_delete_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    restore_available: true,
    file: {
      id: "file-deleted-2",
      name: "Draft Stage Plan.pdf",
      type: "application/pdf",
      size_bytes: 1524000
    }
  }
]

export const mockFilePresence = [
  {
    id: "presence-1",
    file_id: "file-1",
    user_id: "user-2",
    activity_type: "editing",
    cursor_position: { line: 15, column: 8 },
    color_code: "#4CAF50",
    last_heartbeat: new Date(Date.now() - 15 * 1000).toISOString(),
    session_started_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    user: {
      first_name: "Sarah",
      last_name: "Johnson",
      avatar_url: null
    }
  },
  {
    id: "presence-2",
    file_id: "file-1",
    user_id: "user-3",
    activity_type: "viewing",
    cursor_position: null,
    color_code: "#2196F3",
    last_heartbeat: new Date(Date.now() - 25 * 1000).toISOString(),
    session_started_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    user: {
      first_name: "Mike",
      last_name: "Chen",
      avatar_url: null
    }
  }
]

export const mockFileBookmarks = [
  {
    id: "bookmark-1",
    user_id: "user-1",
    file_id: "file-1",
    folder_id: null,
    bookmark_type: "file",
    custom_name: "Q1 Budget Reference",
    notes: "Check this for quarterly planning",
    sort_order: 0,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "bookmark-2",
    user_id: "user-1",
    file_id: null,
    folder_id: "folder-2",
    bookmark_type: "folder",
    custom_name: "Important Designs",
    notes: null,
    sort_order: 1,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export const mockFileAuditLogs = [
  {
    id: "audit-1",
    file_id: "file-1",
    folder_id: null,
    workspace_id: "workspace-1",
    user_id: "user-1",
    user_email: "user1@example.com",
    action_type: "create",
    action_details: { file_name: "Production Budget 2025.xlsx" },
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0...",
    compliance_relevant: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "audit-2",
    file_id: "file-1",
    folder_id: null,
    workspace_id: "workspace-1",
    user_id: "user-2",
    user_email: "user2@example.com",
    action_type: "download",
    action_details: {},
    ip_address: "192.168.1.101",
    compliance_relevant: true,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "audit-3",
    file_id: "file-1",
    folder_id: null,
    workspace_id: "workspace-1",
    user_id: "user-1",
    user_email: "user1@example.com",
    action_type: "share",
    action_details: { shared_with: "user-2", permission_level: "editor" },
    ip_address: "192.168.1.100",
    compliance_relevant: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]
