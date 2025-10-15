# Recommended Tab Structure for People Module

## Overview

After implementing enterprise-grade HR workflows (scheduling, approvals, performance management, etc.), certain features deserve dedicated top-level tabs to improve UX without creating redundancy.

## Recommended: 2 New Tabs (Minimum)

### 1. Schedule Tab ⭐⭐⭐

**Justification:**
- **Different workflow**: Operational scheduling vs. administrative HR
- **Different users**: Operations managers, shift supervisors, employees (not just HR)
- **High frequency**: Daily/hourly interactions (clock in/out, check schedule, swap shifts)
- **Real-time operations**: "Who's working now?" not "Who was hired when?"
- **Industry standard**: Deputy, Homebase, Connecteam all make scheduling primary navigation

**What goes here:**
```
Schedule
├─ Calendar (weekly/monthly view)
├─ Today's Shifts
│  └─ Who's working now
├─ Open Shifts
│  └─ Available to claim
├─ Swap Requests
│  └─ Pending approval
├─ Time Clock
│  └─ Clock in/out interface
├─ My Availability
│  └─ Set available hours
└─ Templates
   └─ Create/manage shift templates
```

**Why NOT a subtab of People:**
- People module = HR admin context (hiring, onboarding, reviews)
- Schedule = operations context (daily staffing, time tracking)
- Different permission model (all employees see schedule, not all see HR data)
- Different update frequency (schedule changes hourly, personnel changes rarely)

---

### 2. Approvals Tab ⭐⭐⭐

**Justification:**
- **Cross-cutting feature**: Spans multiple modules (PTO, timesheets, expenses, shifts, documents)
- **Inbox paradigm**: Users need ONE place to see all pending items requiring action
- **Reduces friction**: No hunting through different modules
- **Manager workflow**: Managers approve many types of requests daily
- **Industry standard**: Rippling, HiBob, BambooHR all have dedicated approval centers

**What goes here:**
```
Approvals
├─ Pending (requires my approval)
│  ├─ PTO Requests (5)
│  ├─ Timesheets (12)
│  ├─ Shift Swaps (3)
│  ├─ Expense Reports (2)
│  └─ Documents (1)
├─ My Requests (I submitted)
│  ├─ Pending (3)
│  ├─ Approved (15)
│  └─ Denied (1)
├─ Team Requests (my team submitted)
└─ History
   └─ All past approvals
```

**Why NOT scattered across modules:**
- Cognitive load: Checking 5 different places for pending approvals
- Missed approvals: Items get lost in module navigation
- Turnaround time: Centralized queue = faster processing
- Better UX: Clear action items vs. buried in module sections

---

## Optional: My Team Tab (Manager-Focused)

**Justification:**
- **Role-based view**: Dedicated manager dashboard
- **Aggregated data**: Cross-module information about direct reports
- **Modern HR pattern**: Lattice, 15Five, Culture Amp center on team management

**What goes here:**
```
My Team
├─ Team Overview
│  ├─ Direct reports list
│  ├─ Team org chart
│  └─ Quick stats
├─ Performance
│  ├─ Upcoming reviews
│  ├─ Goals progress
│  ├─ Recent feedback
│  └─ 1:1 meeting schedule
├─ Time & Attendance
│  ├─ Team schedule
│  ├─ PTO calendar
│  ├─ Pending timesheet approvals
│  └─ Compliance alerts
└─ Team Actions
   ├─ Schedule 1:1
   ├─ Give feedback
   ├─ Approve time
   └─ Start review
```

**When to add:**
- Phase 2 (after Schedule + Approvals)
- If manager adoption is high
- If team management is a primary use case

**Alternative:**
- Could be a dashboard widget/view rather than full tab
- Could be role-based home screen for managers

---

## What Should Stay in People Module

### As Subtabs or Sections

**Performance** (subtab within People)
- Less frequent access than scheduling
- Natural context: employee profile → performance history
- Opening a review = opening employee context

**Documents** (subtab or profile section)
- Supporting feature, not primary workflow
- Could be profile section: "Employee Name → Documents"
- Or workspace-level document library

**Benefits** (subtab within People)
- Enrollment happens 1-2x per year
- Configuration is infrequent
- Natural fit within employee profile

**Onboarding** (subtab/filtered view)
- Temporary state for new hires
- Could be dashboard widget: "5 employees onboarding"
- Or filtered view in People: "Status = Onboarding"

**Training/Certifications** (profile section)
- Tied to employee skills/qualifications
- Natural part of employee record

---

## Complete Recommended Structure

### Option A: Conservative (2 new tabs)

```
Navigation
├─ Dashboard
├─ People
│  ├─ Overview (employee list)
│  ├─ Teams
│  ├─ Onboarding (filtered view)
│  ├─ Performance
│  │  ├─ Reviews
│  │  ├─ Goals
│  │  └─ Feedback
│  └─ Documents
├─ Schedule ✨ NEW
│  ├─ Calendar
│  ├─ Open Shifts
│  ├─ Swap Requests
│  ├─ Availability
│  └─ Time Clock
├─ Approvals ✨ NEW
│  ├─ Pending
│  ├─ My Requests
│  └─ History
├─ [Other modules...]
└─ Settings
```

### Option B: Manager-Focused (3 new tabs)

```
Navigation
├─ Dashboard
├─ My Team ✨ NEW (managers only)
│  ├─ Overview
│  ├─ Performance
│  ├─ Schedule
│  └─ Actions
├─ People (HR admins)
│  ├─ Overview
│  ├─ Onboarding
│  ├─ Benefits
│  └─ Documents
├─ Schedule ✨ NEW
├─ Approvals ✨ NEW
└─ [Other modules...]
```

---

## Implementation Priority

### Phase 1 (Launch)
✅ **Schedule tab** - Biggest operational improvement  
✅ **Approvals tab** - Biggest friction reduction

**Impact:**
- Reduces clicks by 60% for common operations
- Improves approval turnaround time
- Better separation of operational vs. administrative tasks
- Matches mental model from competitor platforms

### Phase 2 (If Validated)
🔄 **My Team tab** - Only if manager usage is high

**Validation criteria:**
- 30%+ users are people managers
- Managers log in daily (vs. weekly)
- Manager-specific features are heavily used

---

## Decision Matrix

| Feature | Separate Tab? | Reason |
|---------|---------------|--------|
| **Shift Scheduling** | ✅ YES | Different workflow, users, frequency |
| **Approvals** | ✅ YES | Cross-cutting, high-frequency, reduces friction |
| **My Team** | 🤔 MAYBE | Depends on manager usage patterns |
| **Performance** | ❌ NO | Part of employee lifecycle, lower frequency |
| **Documents** | ❌ NO | Supporting feature, profile context better |
| **Benefits** | ❌ NO | Infrequent access, profile context better |
| **Onboarding** | ❌ NO | Temporary state, filterable view works |
| **PTO** | ❌ NO | Accessible via Approvals + employee profile |

---

## UX Benefits Summary

**With Schedule + Approvals tabs:**

✅ **Reduced cognitive load** - Clear separation of operations vs. admin  
✅ **Faster task completion** - No hunting for pending items  
✅ **Role-based clarity** - Operations, managers, HR each have primary workflows  
✅ **Fewer clicks** - 2-3 clicks vs. 5-7 for common tasks  
✅ **Better context** - Scheduling = now/today, People = lifecycle/history  
✅ **Matches expectations** - Aligns with competitor platforms  

---

## Mobile Considerations

**Bottom navigation (mobile):**
```
┌─────────┬──────────┬──────────┬──────────┬──────────┐
│  Home   │ Schedule │ Approvals│  People  │   More   │
└─────────┴──────────┴──────────┴──────────┴──────────┘
```

**Schedule and Approvals are high-value on mobile:**
- Clock in/out on-the-go
- Check today's schedule
- Approve requests anywhere
- Swap shifts from mobile

---

## Analytics to Track

After implementing:

1. **Tab usage frequency** - Which tabs get most traffic?
2. **Task completion time** - How long to approve a request?
3. **Click depth** - How many clicks to complete common tasks?
4. **User satisfaction** - NPS for schedule/approvals features
5. **Mobile vs. desktop** - Usage patterns by device

**Target metrics:**
- 70%+ of operational tasks via Schedule tab
- 80%+ of approvals via Approvals tab
- <30s average approval time (down from 2-3 minutes)
- <3 clicks to complete common tasks

---

## Conclusion

**Minimum Recommendation: Add 2 tabs**
1. Schedule (operations)
2. Approvals (cross-cutting)

These provide the most value with minimal complexity, align with industry standards, and match user mental models. The "My Team" tab can be evaluated in Phase 2 based on actual usage patterns.

**Why these deserve separate tabs:**
- High frequency, different workflows
- Different user personas
- Cross-cutting functionality
- Matches competitor UX patterns
- Reduces cognitive load and friction

**Implementation is straightforward:**
- No schema changes needed
- Just routing and view organization
- Can be feature-flagged for gradual rollout
