# Community File Collaboration - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COMMUNITY MODULE                              │
│                   (Social + File Collaboration)                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
          ┌─────────▼─────────┐         ┌──────────▼─────────┐
          │  Social Features   │         │  File Collab       │
          │  (Existing)        │         │  (New)             │
          ├────────────────────┤         ├────────────────────┤
          │ • Posts            │         │ • File Sharing     │
          │ • Connections      │         │ • Permissions      │
          │ • Events           │         │ • Comments         │
          │ • Discussions      │         │ • Workflows        │
          │ • Showcase         │         │ • External Sync    │
          └────────────────────┘         └────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      Database Layer            │
                    │      (PostgreSQL)              │
                    └────────────────────────────────┘
```

## Database Schema Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CORE LAYER                                  │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐                │
│  │ files  │  │ profiles │  │  auth  │  │workspace│                 │
│  └────────┘  └──────────┘  └────────┘  └─────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                     COLLABORATION LAYER                              │
│  ┌───────────────┐  ┌──────────────┐  ┌────────────────┐          │
│  │file_permissions│  │file_comments │  │file_activities │          │
│  └───────────────┘  └──────────────┘  └────────────────┘          │
│                                                                      │
│  ┌─────────────┐  ┌─────────────────┐  ┌──────────────────┐       │
│  │file_folders │  │file_favorites   │  │file_collaboration│       │
│  │             │  │                 │  │    _sessions     │       │
│  └─────────────┘  └─────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                     INTEGRATION LAYER                                │
│  ┌──────────────────┐  ┌───────────────┐  ┌─────────────┐         │
│  │external_storage  │  │file_sync_queue│  │file_locks   │         │
│  │  _connections    │  │               │  │             │         │
│  └──────────────────┘  └───────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                      WORKFLOW LAYER                                  │
│  ┌───────────────┐  ┌──────────────────┐  ┌───────────────────┐   │
│  │file_workflows │  │file_workflow_    │  │file_workflow_     │   │
│  │               │  │   instances      │  │   approvals       │   │
│  └───────────────┘  └──────────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                       UTILITY LAYER                                  │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐            │
│  │smart_folders │  │file_templates│  │file_tag_presets│            │
│  └──────────────┘  └─────────────┘  └────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

## File Sharing Flow

```
┌──────────┐                                              ┌──────────┐
│  Owner   │                                              │Recipient │
└────┬─────┘                                              └────▲─────┘
     │                                                          │
     │ 1. Share file with user                                 │
     │    (permission_level: 'editor')                         │
     ├──────────────────────────────────────┐                  │
     │                                      │                  │
     ▼                                      ▼                  │
┌─────────┐                          ┌──────────────┐         │
│  files  │──────────────────────────│file_permissions│───────┤
└─────────┘                          └──────────────┘         │
     │                                      │                  │
     │ 2. Log activity                     │ 3. Check access  │
     │                                      │                  │
     ▼                                      ▼                  │
┌──────────────┐                    ┌────────────────┐        │
│file_activities│                   │check_file_     │        │
└──────────────┘                    │  permission()  │────────┘
                                    └────────────────┘
                                           │
                                    4. Grant access
```

## Permission Hierarchy

```
                    ┌─────────┐
                    │  Owner  │ (Full control)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │ Editor  │ (Can edit, comment, view)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │Commenter│ (Can comment, view)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │ Viewer  │ (Can view only)
                    └─────────┘
```

## External Storage Integration

```
┌──────────────────────────────────────────────────────────────┐
│                    Dragonfly Community                        │
│                    (Central Platform)                         │
└───────────┬────────────────────────────┬─────────────────────┘
            │                            │
     ┌──────▼──────┐            ┌────────▼────────┐
     │OAuth Connect│            │  Sync Queue     │
     └──────┬──────┘            └────────┬────────┘
            │                            │
     ┌──────▼─────────────────────────────▼──────┐
     │   external_storage_connections            │
     │   (Tokens, Metadata, Settings)            │
     └───────────────────┬───────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │ Dropbox │    │  Drive  │    │   Box   │
    └─────────┘    └─────────┘    └─────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                ┌────────▼────────┐
                │  file_sync_queue│
                │  (Bidirectional) │
                └─────────────────┘
```

## Workflow Execution Flow

```
┌──────────┐                                           ┌──────────┐
│Initiator │                                           │Approver 1│
└────┬─────┘                                           └────▲─────┘
     │                                                       │
     │ 1. Start workflow on file                            │
     ├───────────────────────────────┐                      │
     │                               │                      │
     ▼                               ▼                      │
┌─────────┐                   ┌──────────────┐             │
│  files  │                   │file_workflows│             │
└─────────┘                   └──────────────┘             │
     │                               │                      │
     │                               │                      │
     │         2. Create instance    │                      │
     │         ┌─────────────────────┘                      │
     │         │                                            │
     ▼         ▼                                            │
┌────────────────────┐                                     │
│file_workflow_      │                                     │
│   instances        │─────────────────────────────────────┤
└────────────────────┘         3. Request approval         │
     │                                                      │
     │                                                      │
     │         4. Approve/Reject    ┌─────────────────────┐│
     │         ┌────────────────────│Approver 2           ││
     │         │                    └─────────────────────┘│
     ▼         ▼                                            │
┌────────────────────┐                                     │
│file_workflow_      │                                     │
│   approvals        │─────────────────────────────────────┘
└────────────────────┘         5. Next step or complete
```

## Real-time Collaboration

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ User A  │  │ User B  │  │ User C  │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     │ Open file  │            │
     ├────────────┼────────────┼──────────────┐
     │            │            │              │
     │            │ Open file  │              │
     │            ├────────────┼──────────────┤
     │            │            │              │
     ▼            ▼            ▼              ▼
┌────────────────────────────────────────────────┐
│     file_collaboration_sessions                 │
│  ┌─────────────────────────────────────────┐   │
│  │ A: editing @ line 10, col 5             │   │
│  │ B: viewing @ page 2                     │   │
│  │ C: offline                              │   │
│  └─────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
     │            │            │
     │ Heartbeat  │ Heartbeat  │
     ├────────────┼────────────┤
     │            │            │
     │ Cursor     │ Cursor     │
     │ update     │ update     │
     │            │            │
     ▼            ▼            ▼
  ┌──────────────────────────────┐
  │  Real-time UI Updates        │
  │  (Supabase Subscriptions)    │
  └──────────────────────────────┘
```

## Smart Folder Query Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ 1. Create/Execute smart folder
     │
     ▼
┌─────────────┐
│smart_folders│
│             │
│ Criteria:   │
│ • file_type │
│ • tags      │
│ • date_range│
│ • shared    │
└─────┬───────┘
      │ 2. Execute dynamic query
      │
      ▼
┌──────────────────────────────────┐
│ execute_smart_folder_query()     │
│                                  │
│ SELECT * FROM files              │
│ WHERE                            │
│   type IN (criteria.fileTypes)   │
│   AND tags && criteria.tags      │
│   AND created_at > criteria.start│
│ ORDER BY criteria.sortField      │
└──────┬───────────────────────────┘
       │ 3. Return matching files
       │
       ▼
┌────────────────┐
│  [File List]   │
│  • File A      │
│  • File D      │
│  • File G      │
└────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────────────┐
│                   Application Layer                   │
│         (UI checks, input validation)                 │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│                  RLS Policy Layer                     │
│   • Workspace isolation                              │
│   • Permission validation                            │
│   • Visibility checks                                │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│               Helper Functions Layer                  │
│   • check_file_permission()                          │
│   • log_file_activity()                              │
└───────────────────┬──────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────┐
│                  Database Layer                       │
│   • Foreign key constraints                          │
│   • Check constraints                                │
│   • Unique constraints                               │
└──────────────────────────────────────────────────────┘
```

## Data Flow: Upload to Share

```
1. Upload File
   ┌─────────────┐
   │ User uploads│──────────────┐
   │   file.pdf  │              │
   └─────────────┘              │
                                ▼
                        ┌──────────────┐
                        │Storage Bucket│
                        │(Supabase)    │
                        └───────┬──────┘
                                │
2. Create Record                ▼
   ┌────────────────────────────────┐
   │ INSERT INTO files (            │
   │   workspace_id,                │
   │   name: 'file.pdf',            │
   │   storage_path: 'ws/file.pdf', │
   │   uploaded_by: user_id,        │
   │   community_visibility: 'private'│
   │ )                              │
   └───────────┬────────────────────┘
               │
3. Log Activity │
               ▼
   ┌────────────────────────┐
   │ log_file_activity(     │
   │   file_id,             │
   │   'uploaded'           │
   │ )                      │
   └───────────┬────────────┘
               │
4. Share File  │
               ▼
   ┌─────────────────────────┐
   │ INSERT INTO             │
   │ file_permissions (      │
   │   file_id,              │
   │   user_id: recipient,   │
   │   permission: 'viewer'  │
   │ )                       │
   └───────────┬─────────────┘
               │
5. Notify      │
               ▼
   ┌─────────────────────────┐
   │ Recipient receives      │
   │ notification & access   │
   └─────────────────────────┘
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────────┐
│          Query Optimization              │
├─────────────────────────────────────────┤
│ 1. Strategic Indexes                    │
│    • B-tree: IDs, foreign keys          │
│    • GIN: full-text search, arrays      │
│    • Partial: WHERE status = 'active'   │
│                                         │
│ 2. Materialized Views                   │
│    • file_analytics (pre-aggregated)    │
│    • file_search_view (with joins)      │
│                                         │
│ 3. Function Optimization                │
│    • SECURITY DEFINER for permission    │
│    • Batch operations (reduce RTT)      │
│                                         │
│ 4. Efficient RLS                        │
│    • Use indexed columns in policies    │
│    • Avoid complex subqueries           │
└─────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. **Additive, Not Destructive**
- All changes are additive to existing schema
- No breaking changes to current functionality
- Backward compatible

### 2. **Security First**
- RLS on all tables
- Permission checks before operations
- Audit trail for compliance

### 3. **Performance Aware**
- Strategic indexing
- Materialized views for analytics
- Batch operations support

### 4. **Developer Friendly**
- Helper functions for common tasks
- Clear naming conventions
- Comprehensive documentation

### 5. **Enterprise Ready**
- Workflow automation
- External integrations
- Audit logging
- Fine-grained permissions

---

## Integration Points

### With Existing Modules

```
Community Posts ──┐
                  ├──► files (attached_file_ids)
Profiles ─────────┤
                  ├──► file_permissions
Workspace ────────┤
                  ├──► file_folders
                  │
Auth ─────────────┴──► All file operations
```

### External Systems

```
Dropbox API ───┐
               ├──► external_storage_connections
Google Drive ──┤
               ├──► file_sync_queue ──► Background Jobs
Box.com ───────┤
               ├──► files (external_storage_id)
OneDrive ──────┘
```

---

This architecture provides a **solid foundation** for enterprise-grade file collaboration while maintaining the social networking features that make the Community module unique.
