# Community Skool Optimization - Quick Reference

## 🚀 Quick Start

### 1. Apply Migrations
```bash
# Run in order
psql -f supabase/migrations/073_community_skool_optimization.sql
psql -f supabase/migrations/074_community_skool_seed_data.sql
```

### 2. Setup Workspace
```sql
-- Complete setup for a workspace
SELECT setup_community('workspace-uuid');
```

### 3. Award Points
```sql
-- User likes a post (automatic via trigger)
INSERT INTO post_reactions (post_id, user_id, type)
VALUES ('post-uuid', 'user-uuid', 'like');
-- Author automatically gets +1 point and level recalculated
```

## 📊 Key Queries

### Get User Stats
```sql
SELECT get_member_stats('workspace-uuid', 'user-uuid');
```

### Leaderboard (Top 100)
```sql
SELECT * FROM community_leaderboard
WHERE workspace_id = 'workspace-uuid'
ORDER BY current_rank
LIMIT 100;
```

### Check Course Access
```sql
SELECT can_access_course('user-uuid', 'course-uuid');
```

## 🎯 Level Thresholds (Skool-Compatible)

| Level | Points | Default Name |
|-------|--------|--------------|
| 1 | 0 | Newcomer |
| 2 | 5 | Member |
| 3 | 20 | Active |
| 4 | 65 | Contributor |
| 5 | 155 | Expert |
| 6 | 500 | Leader |
| 7 | 2,015 | Champion |
| 8 | 8,015 | Master |
| 9 | 33,015 | Legend |

## 📋 Common Operations

### Create Channel
```sql
INSERT INTO community_channels (workspace_id, name, slug, description, icon, min_level_required)
VALUES ('ws-uuid', 'VIP', 'vip', 'VIP members only', '💎', 5);
```

### Create Level-Gated Course
```sql
UPDATE courses 
SET access_level = 'level_based', required_level = 3
WHERE id = 'course-uuid';
```

### Add Poll to Post
```sql
UPDATE community_posts
SET 
  poll_options = '["Option A", "Option B", "Option C"]'::jsonb,
  poll_expires_at = NOW() + INTERVAL '7 days'
WHERE id = 'post-uuid';
```

### Pin Post
```sql
UPDATE community_posts
SET is_pinned = true
WHERE id = 'post-uuid';
```

## 🔄 Real-time Subscriptions

```typescript
// Leaderboard updates
supabase
  .channel('leaderboard')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'community_member_levels',
    filter: `workspace_id=eq.${workspaceId}`
  }, handleLeaderboardUpdate)
  .subscribe();
```

## 📈 Key Features

- ✅ Points awarded automatically via triggers
- ✅ Level calculated on every point change
- ✅ Leaderboard ranks auto-updated
- ✅ Course progress auto-calculated
- ✅ Full audit trail in point_transactions
- ✅ Skool import ready

---

**See full docs:** `COMMUNITY_SKOOL_OPTIMIZATION.md`
