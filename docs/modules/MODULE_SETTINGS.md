# Settings Module

**Consolidated from**: SETTINGS_MODULE_IMPLEMENTATION.md, SETTINGS_REFACTOR_COMPLETE.md  
**Status**: ✅ Complete - All 6 tabs implemented  
**Last Updated**: October 13, 2025

---

## Overview

Organization and user settings management with 6 contextual tabs for configuration and preferences.

---

## Module Configuration

- **Module ID**: `settings`
- **Scope**: Mixed (Organization & User level)
- **Tabs**: 6
- **Default View**: Custom (no standard views)
- **Icon**: `Settings`
- **Color**: `#64748b`
- **Access**: Available to all users (some tabs restricted by role)

---

## Tabs

### 1. Appearance
**Slug**: `appearance`  
**Scope**: User-level  
**Purpose**: MySpace-style UI customization

**Features**:
- Theme mode selection (Light/Dark/System)
- Accent color customization with preset themes
- Custom background image support
- Custom CSS injection for advanced personalization
- Animation and particle effects toggles
- Preview functionality for backgrounds

**Component**: `src/components/settings/appearance-tab.tsx`

---

### 2. Integrations
**Slug**: `integrations`  
**Scope**: Organization & User level  
**Purpose**: Third-party service connections

**Features**:
- Organization-level integrations (Slack, Zapier, Dropbox, etc.)
- Personal integrations (Gmail, Google Calendar, Airtable, etc.)
- Tabbed view to filter by scope (All/Organization/Personal)
- Connection management (configure, disconnect)
- Integration marketplace-style cards with status badges
- OAuth flow support

**Component**: `src/components/settings/integrations-tab.tsx`

**Integration Categories**:
- Communication: Slack, Microsoft Teams, Discord
- Productivity: Google Workspace, Microsoft 365
- Storage: Dropbox, Google Drive, OneDrive
- Automation: Zapier, Make, n8n
- Development: GitHub, GitLab, Jira

---

### 3. Automations
**Slug**: `automations`  
**Scope**: Workspace-level  
**Purpose**: Workflow automation management

**Features**:
- Create, edit, and delete automations
- Enable/disable automations with toggle switches
- Trigger configuration (schedule, events, conditions)
- Action configuration (email, Slack, webhooks, etc.)
- Automation statistics and run history
- Visual status indicators (Active/Paused)

**Component**: `src/components/settings/automations-tab.tsx`

**Trigger Types**:
- Schedule (cron-style)
- Event-based (status change, assignment, etc.)
- Condition-based (budget threshold, date approaching, etc.)

**Action Types**:
- Send email notification
- Post to Slack channel
- Create task/event
- Update field
- Trigger webhook
- Run custom script

---

### 4. Account
**Slug**: `account`  
**Scope**: User-level  
**Purpose**: Personal account management

**Features**:
- Profile information (name, email, phone)
- Address management
- Profile picture upload
- Security settings (password change, 2FA)
- Data export functionality
- Account deletion with confirmation dialog

**Component**: `src/components/settings/account-tab.tsx`

---

### 5. Team
**Slug**: `team`  
**Scope**: Organization-level  
**Purpose**: Team member management  
**Access**: Admin and above

**Features**:
- Team member directory with avatars
- Role management (Owner, Admin, Member, Guest)
- Member invitation system
- Status tracking (Active, Pending, Suspended)
- Bulk member management
- Role permission descriptions

**Component**: `src/components/settings/team-tab.tsx`

**Roles**:
- **Owner**: Full control, billing access
- **Admin**: User management, settings
- **Member**: Standard access
- **Guest**: Limited read-only access

---

### 6. Billing
**Slug**: `billing`  
**Scope**: Organization-level  
**Purpose**: Subscription and payment management  
**Access**: Owner and Admin

**Features**:
- Current plan overview with usage stats
- Payment method management
- Plan comparison and upgrade flow
- Billing history with invoice downloads
- Usage tracking (team members, storage)
- Upgrade/downgrade dialogs with confirmation

**Component**: `src/components/settings/billing-tab.tsx`

**Plans**:
- **Free**: Basic features, 5 team members
- **Pro**: $10/user/month, advanced features
- **Business**: $25/user/month, enterprise features
- **Enterprise**: Custom pricing, dedicated support

---

## Database Schema

### Organization Settings
```sql
organization_settings
├── organization_id (uuid, pk, fk)
├── feature_flags (jsonb)
├── limits (jsonb)
├── integrations (jsonb)
├── automations_enabled (boolean)
└── updated_at (timestamptz)
```

### User Preferences
```sql
user_preferences
├── user_id (uuid, pk, fk)
├── theme (text)
├── accent_color (text)
├── background_image (text)
├── custom_css (text)
├── animations_enabled (boolean)
└── updated_at (timestamptz)
```

---

## Routing Integration

### Standard Module Tab System
Settings uses the standardized `ModuleTab` system introduced in the refactor.

**Tab Registry**: `src/lib/modules/tabs-registry.ts`
```typescript
{
  module_slug: 'settings',
  tabs: [
    {
      slug: 'appearance',
      label: 'Appearance',
      icon: 'Palette',
      default_view: 'custom',
      color: '#f59e0b'
    },
    // ... other tabs
  ]
}
```

**Component Registry**: `src/lib/settings-tab-components.tsx`
```typescript
export function getSettingsTabComponent(tabSlug: string) {
  const components = {
    'appearance': AppearanceTab,
    'integrations': IntegrationsTab,
    'automations': AutomationsTab,
    'account': AccountTab,
    'team': TeamTab,
    'billing': BillingTab,
  }
  return components[tabSlug]
}
```

---

## UI Components

### New Components Created

#### Separator
**File**: `src/components/ui/separator.tsx`
- Horizontal and vertical dividers
- Based on Radix UI Separator

#### Alert Dialog
**File**: `src/components/ui/alert-dialog.tsx`
- Confirmation dialogs for destructive actions
- Based on Radix UI Alert Dialog

---

## Dependencies

### Added Packages
```json
{
  "@radix-ui/react-alert-dialog": "^1.0.5"
}
```

**Installation**: `npm install`

---

## Sidebar Integration

Settings link updated in sidebar:
- **File**: `src/components/layout/sidebar.tsx`
- **Link**: `/workspace/[workspaceId]/settings/appearance`
- **Active state**: Highlights when on any settings route

---

## Design Philosophy

### Principles
- **User-centric**: Individual user preferences and account management
- **Organization-aware**: Distinguishes between personal and organization settings
- **Modern UX**: Clean, intuitive interface with clear visual hierarchy
- **Customizable**: MySpace-style personalization for power users
- **Professional**: Enterprise-grade features (automations, integrations)

### Visual Consistency
- Card-based layouts
- Consistent form patterns
- Clear section headers
- Helpful descriptions and hints
- Visual feedback for actions

---

## Key Features by Tab

| Tab | Scope | Key Features |
|-----|-------|-------------|
| **Appearance** | User | Theme, colors, backgrounds, custom CSS, animations |
| **Integrations** | Org & User | Connection management, OAuth, marketplace UI |
| **Automations** | Workspace | Trigger/action workflows, stats dashboard |
| **Account** | User | Profile, security, data export, deletion |
| **Team** | Organization | Member directory, roles, invitations, status |
| **Billing** | Organization | Plans, payments, invoices, usage tracking |

---

## Next Steps

1. **Backend Integration**: Connect to Supabase for data persistence
2. **OAuth Flows**: Implement actual integration OAuth flows
3. **Stripe Integration**: Add billing management with Stripe
4. **Automation Engine**: Implement automation execution engine
5. **Custom CSS**: Add CSS validation and sandboxing
6. **2FA**: Implement two-factor authentication

---

## Status

✅ **Complete** - All 6 settings tabs implemented with full UI and ready for backend integration.

