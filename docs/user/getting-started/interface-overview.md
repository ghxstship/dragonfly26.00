# 🖥️ Interface Overview

[← Back to User Documentation](../README.md)

---

## Understanding the Dragonfly Interface

Dragonfly's interface is designed for intuitive navigation while providing powerful features.

---

## Main Interface Elements

### Top Navigation Bar

The top bar is always visible and provides global navigation:

**Left Side:**
- **🏠 Logo/Home Button** - Click to return to Dashboard
- **📍 Breadcrumbs** - Shows your current location (e.g., Projects > Feature Film > Budget)
- **🔍 Module Navigator** - Access all 20 modules

**Center:**
- Context-dependent tools and filters for current view

**Right Side:**
- **⌘ Quick Search** (Cmd/Ctrl + K) - Search everything
- **➕ Quick Create** - Create new items quickly
- **🔔 Notifications** - Alerts and updates (red badge shows unread count)
- **👤 Profile Menu** - Settings, profile, logout

### Left Sidebar (Collapsible)

Quick access to modules and navigation:

**Module Icons:**
- Dashboard
- Projects  
- Events
- People
- Assets
- Locations
- Files
- Finance
- Procurement
- Jobs
- Companies
- Community
- Marketplace
- Resources
- Reports
- Analytics
- Insights

**Additional Sections:**
- ⭐ **Favorites** - Items you've starred
- 🕐 **Recent** - Recently viewed items
- 🏢 **Workspaces** - Switch between workspaces (multi-tenant)

**Sidebar Controls:**
- Click ≡ hamburger icon to collapse/expand
- Hover over icons when collapsed to see labels
- Width adjusts automatically on mobile

### Main Content Area

The central workspace where all content displays:

**Tab Navigation:**
- Tabs show different views within a module
- Example: Projects → Productions | Departments | Tasks | Schedule
- Active tab is highlighted
- Scroll horizontally if many tabs

**View Toolbar:**
- **View Selector** - Switch between List, Board, Calendar, etc.
- **Filter** - Filter displayed data
- **Sort** - Sort data by various criteria
- **Search** - Search within current view
- **Actions** - Bulk actions, export, settings

**Data Display:**
- Content shown in selected view type
- Responsive - adapts to screen size
- Empty states show helpful guidance when no data

**Action Buttons:**
- Usually in top-right of content area
- Primary action (e.g., "+ New Production") most prominent
- Secondary actions in dropdown menus

### Bottom Bar (Context-Dependent)

Appears when relevant:
- Selection count when items selected
- Bulk action buttons
- Status indicators
- Real-time sync status

---

## Common UI Patterns

### Cards

Used throughout Dragonfly to display individual items:

**Card Components:**
- **Thumbnail/Icon** - Visual identifier
- **Title** - Main identifier
- **Metadata** - Key information (date, status, assignee, etc.)
- **Actions** - Quick action buttons (•••)
- **Status Indicators** - Colored badges or icons

**Card Interactions:**
- **Click anywhere** - Open detail view
- **Right-click** - Context menu
- **Hover** - Show additional options
- **Drag** - Reorder or move (in Board view)

### Lists

Tabular data display:

**List Features:**
- **Headers** - Click to sort
- **Checkboxes** - Select multiple items
- **Row Actions** - Hover to reveal
- **Inline Editing** - Double-click cells (where enabled)
- **Expandable Rows** - Click arrow to expand details

**List Customization:**
- Show/hide columns
- Reorder columns (drag headers)
- Adjust column width
- Save custom views

### Modals & Dialogs

Overlay windows for focused tasks:

**Types:**
- **Forms** - Create or edit items
- **Confirmations** - Confirm destructive actions
- **Details** - View item details
- **Pickers** - Select from options

**Interaction:**
- **Esc key** - Close modal
- **Click outside** - Close (usually)
- **Tab** - Navigate fields
- **Enter** - Submit form

### Dropdowns & Menus

**Dropdown Types:**
- **Select dropdowns** - Choose one option
- **Multi-select** - Choose multiple options
- **Date pickers** - Select dates
- **Time pickers** - Select times
- **Action menus** - List of actions (•••)

**Keyboard Navigation:**
- ↑ ↓ arrows to navigate
- Enter to select
- Type to filter options
- Esc to close

### Status Badges

Color-coded badges show status at a glance:

**Common Colors:**
- 🟢 **Green** - Complete, Active, Approved
- 🔵 **Blue** - In Progress, Pending Review
- 🟡 **Yellow** - Warning, At Risk, Tentative
- 🔴 **Red** - Overdue, Error, Cancelled
- ⚫ **Gray** - Inactive, Draft, Archived

### Progress Indicators

Visual feedback for ongoing processes:

**Types:**
- **Progress Bars** - Show completion percentage
- **Spinners** - Loading data
- **Skeletons** - Placeholder while loading
- **Indeterminate** - Activity in progress

---

## Navigation Patterns

### Breadcrumbs

Shows your location in the hierarchy:

```
Projects > Feature Film Production > Budget > Above the Line
```

**Using Breadcrumbs:**
- Click any level to navigate there
- See full path to current view
- Orient yourself in deep hierarchies

### Back Button

Browser back button works as expected:
- Returns to previous view
- Preserves scroll position
- Maintains filter/search state

### Deep Linking

Every view has a unique URL:
- Copy URL to share specific view
- Bookmark frequently used views
- URLs include filters and search

---

## View Types Explained

### List View 📋

Traditional table/list format:

**Best For:**
- Scanning many items
- Comparing data across columns
- Sorting and filtering
- Exporting data

**Features:**
- Column sorting
- Inline editing
- Bulk selection
- Pagination or infinite scroll

### Card View 🎴

Grid of visual cards:

**Best For:**
- Visual identification (photos/thumbnails)
- Quick overview
- Touch-friendly interface
- Visual organization

**Features:**
- Adjustable card size
- Grid layout
- Image previews
- Drag-and-drop

### Board View 📊

Kanban-style columns:

**Best For:**
- Workflow management
- Status tracking
- Visual workflow
- Drag-and-drop organization

**Features:**
- Customizable columns
- Drag between columns
- WIP limits (optional)
- Swimlanes (grouping)

### Calendar View 📅

Month, week, or day calendar:

**Best For:**
- Time-based data
- Scheduling
- Finding availability
- Seeing timeline

**Views:**
- Month - Full month view
- Week - 7-day week
- Day - Hour-by-hour
- Agenda - List by date

### Timeline View 🗓️

Gantt-style timeline:

**Best For:**
- Project planning
- Dependencies
- Resource allocation
- Long-term scheduling

**Features:**
- Zoom in/out
- Drag to adjust dates
- Dependency lines
- Milestone markers

### Map View 🗺️

Geographic map display:

**Best For:**
- Locations module
- Venue finding
- Geographic planning
- Route planning

**Features:**
- Interactive map
- Markers for items
- Clustering
- Directions

### Chart View 📈

Data visualizations:

**Best For:**
- Analytics
- Trends
- Comparisons
- Reports

**Chart Types:**
- Bar charts
- Line charts
- Pie charts
- Area charts

### Gallery View 🖼️

Image-focused grid:

**Best For:**
- Photos and images
- Visual assets
- Portfolio view
- Media libraries

**Features:**
- Large image previews
- Lightbox view
- Slideshow mode
- Download original

---

## Responsive Design

Dragonfly adapts to your device:

### Desktop (>1024px)
- Full interface with sidebar
- Multi-column layouts
- Hover interactions
- Keyboard shortcuts

### Tablet (768px - 1024px)
- Collapsible sidebar
- 2-column layouts
- Touch-optimized
- Simplified some views

### Mobile (<768px)
- Bottom navigation
- Single column
- Full-screen modals
- Swipe gestures
- Simplified interface

---

## Accessibility Features

Dragonfly is designed for accessibility:

### Keyboard Navigation
- ⭾ Tab - Navigate elements
- ↑ ↓ ← → - Navigate lists/menus
- Enter - Activate/submit
- Esc - Close/cancel
- Space - Select/toggle

### Screen Reader Support
- Semantic HTML structure
- ARIA labels
- Alt text on images
- Descriptive link text
- Form labels

### Visual Accessibility
- High contrast mode
- Adjustable text size
- Color-blind friendly palettes
- Focus indicators
- Clear error messages

### Customization
- Adjust text size in settings
- Enable reduced motion
- High contrast mode
- Keyboard-only navigation

---

## Customization Options

### Theme
- Light mode (default)
- Dark mode
- High contrast mode
- Auto (follows system)

### Density
- Comfortable (default) - More spacing
- Compact - More items on screen
- Cozy - Balance

### Language
- 20 languages supported
- Changes entire interface
- Preserves data language

### Layout
- Sidebar position (left/right)
- Sidebar width
- Default view types
- Dashboard layout

---

## Tips for Efficient Navigation

### Use Keyboard Shortcuts
- **Cmd/Ctrl + K** - Quick search/command palette
- **Cmd/Ctrl + /** - Show all shortcuts
- **G then D** - Go to Dashboard
- **G then P** - Go to Projects
- **/** - Focus search
- **N** - Create new item

### Pin Frequently Used Items
- Star items to add to Favorites
- Favorites appear in sidebar
- Quick access from any module

### Use Quick Create
- **+ button** in top-right
- Create without navigating to module
- Recently used items show first
- Keyboard shortcut: Cmd/Ctrl + N

### Master Search
- **Global search** - Searches everything (Cmd/Ctrl + K)
- **Module search** - Searches current module only
- Use filters to narrow results
- Save common searches

### Save Custom Views
- Create filtered/sorted views
- Save for quick access
- Share views with team
- Set default view per module

---

## Next Steps

- ✅ [Learn Basic Concepts](basic-concepts.md)
- ✅ [Try Common Tasks](../guides/common-tasks.md)
- ✅ [Explore Keyboard Shortcuts](../features/keyboard-shortcuts.md)

[← Back to Getting Started](../getting-started/)
