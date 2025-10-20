# COMPLETE 12-LAYER IMPLEMENTATION CHECKLIST
**Dragonfly26.00 - Zero-Tolerance Full-Stack Validation**

**Date:** 2025-10-20  
**Total Files:** 217  
**Total Layers:** 12  
**Overall Grade:** B+ (86.17/100)

---

## 📊 EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| Total Files Audited | 217 |
| Perfect Files (A+) | 0 |
| Passing Files (A-B) | 158 |
| Failing Files (C-F) | 63 |
| Total Violations | 1850 |

### Layer Compliance Summary

| Layer | Score | Status |
|-------|-------|--------|
| 1. UI Components | 100.0/100 | ✅ Excellent |
| 2. Data Hooks | 86.6/100 | ⚠️ Needs Work |
| 3. Database Schema | 86.2/100 | ⚠️ Needs Work |
| 4. RLS Policies | 79.9/100 | ❌ Critical |
| 5. Internationalization | 98.9/100 | ✅ Excellent |
| 6. Accessibility | 85.2/100 | ⚠️ Needs Work |
| 7. Realtime | 50.0/100 | ❌ Critical |
| 8. Storage | 91.1/100 | ✅ Good |
| 9. Edge Functions | 81.2/100 | ⚠️ Needs Work |
| 10. Authentication | 64.9/100 | ❌ Critical |
| 11. API Routes | 85.8/100 | ⚠️ Needs Work |
| 12. Type Safety | 72.3/100 | ❌ Critical |

---

## 🎯 ZERO-TOLERANCE STANDARDS

Each file must achieve:
- **Layer 1-6:** ≥90% (Core functionality)
- **Layer 5:** ≥95% (i18n is critical)
- **Layer 7-12:** ≥80% (Enhanced features)
- **Overall:** ≥95% for A+ certification

---

## 📋 FILE-BY-FILE CHECKLIST

### ACCESS MODULE (1 files)

#### 🟠 access-tab.tsx
**Overall Score:** 80.0/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/access-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for access |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for access |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Storage] File handling without storage integration
8. [Edge Functions] No edge functions for access
9. [Authentication] No authentication integration
10. [API Routes] No API routes for access
11. [Type Safety] 2 'any' types found
12. [Type Safety] Functions without return type annotations


---


### ACCOUNT MODULE (1 files)

#### 🟡 account-tab.tsx
**Overall Score:** 84.5/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/account-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for account |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for account |
| 12. Type Safety | 70/100 | ⚠️ | Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for account
7. [Authentication] No authentication integration
8. [API Routes] No API routes for account
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### ACTIVITY MODULE (1 files)

#### 🟠 activity-tab.tsx
**Overall Score:** 71.5/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/activity-tab.tsx`  
**Violations:** 13

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 15/100 | ❌ | No data hook integration; No Supabase client; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for activity |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for activity |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No data hook integration
2. [Data Hooks] No Supabase client
3. [Data Hooks] No error handling
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Storage] File handling without storage integration
9. [Edge Functions] No edge functions for activity
10. [Authentication] No authentication integration
11. [API Routes] No API routes for activity
12. [Type Safety] 4 'any' types found
13. [Type Safety] Functions without return type annotations


---


### ADMIN MODULE (1 files)

#### 🟢 admin-overview-tab.tsx
**Overall Score:** 93.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/admin-overview-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 40/100 | ❌ | 3 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Type Safety] 3 'any' types found
4. [Type Safety] Component without typed props
5. [Type Safety] Functions without return type annotations


---


### ANALYTICS MODULE (10 files)

#### 🟠 analytics-comparisons-tab.tsx
**Overall Score:** 78.3/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-comparisons-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for comparisons |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for comparisons |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for comparisons |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for comparisons |
| 12. Type Safety | 100/100 | ✅ | None |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for comparisons
3. [RLS Policies] No RLS policies found for comparisons
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for comparisons
6. [Authentication] No authentication integration
7. [API Routes] No API routes for comparisons


---

#### 🟠 analytics-custom-views-tab.tsx
**Overall Score:** 74.2/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-custom-views-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for custom-views |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for custom-views |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for custom-views |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for custom-views |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for custom-views
3. [RLS Policies] No RLS policies found for custom-views
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for custom-views
8. [Authentication] No authentication integration
9. [API Routes] No API routes for custom-views
10. [Type Safety] 2 'any' types found
11. [Type Safety] Functions without return type annotations


---

#### 🟡 analytics-data-sources-tab.tsx
**Overall Score:** 86.4/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-data-sources-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for data-sources |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for data-sources |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for data-sources
6. [Authentication] No authentication integration
7. [API Routes] No API routes for data-sources
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟢 analytics-forecasting-tab.tsx
**Overall Score:** 90.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-forecasting-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for forecasting |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for forecasting |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for forecasting
4. [Authentication] No authentication integration
5. [API Routes] No API routes for forecasting
6. [Type Safety] Functions without return type annotations


---

#### 🟠 analytics-metrics-library-tab.tsx
**Overall Score:** 76.2/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-metrics-library-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for metrics-library |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for metrics-library |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for metrics-library |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for metrics-library |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for metrics-library
3. [RLS Policies] No RLS policies found for metrics-library
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for metrics-library
7. [Authentication] No authentication integration
8. [API Routes] No API routes for metrics-library
9. [Type Safety] 2 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟢 analytics-overview-tab.tsx
**Overall Score:** 93.5/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-overview-tab.tsx`  
**Violations:** 3

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Type Safety] Functions without return type annotations


---

#### 🟢 analytics-performance-tab.tsx
**Overall Score:** 92.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-performance-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for performance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for performance |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for performance
3. [Authentication] No authentication integration
4. [API Routes] No API routes for performance
5. [Type Safety] Functions without return type annotations


---

#### 🟠 analytics-pivot-tables-tab.tsx
**Overall Score:** 76.6/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-pivot-tables-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for pivot-tables |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for pivot-tables |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for pivot-tables |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for pivot-tables |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for pivot-tables
3. [RLS Policies] No RLS policies found for pivot-tables
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for pivot-tables
7. [Authentication] No authentication integration
8. [API Routes] No API routes for pivot-tables
9. [Type Safety] Functions without return type annotations


---

#### 🟢 analytics-realtime-tab.tsx
**Overall Score:** 92.6/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-realtime-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for realtime |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for realtime |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for realtime
4. [API Routes] No API routes for realtime
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟠 analytics-trends-tab.tsx
**Overall Score:** 78.1/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/analytics/analytics-trends-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for trends |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for trends |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for trends |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for trends |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for trends
3. [RLS Policies] No RLS policies found for trends
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for trends
6. [Authentication] No authentication integration
7. [API Routes] No API routes for trends
8. [Type Safety] Functions without return type annotations


---


### API MODULE (1 files)

#### 🟡 api-tokens-tab.tsx
**Overall Score:** 84.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/api-tokens-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tokens |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tokens |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for tokens
7. [Authentication] No authentication integration
8. [API Routes] No API routes for tokens
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---


### APPEARANCE MODULE (1 files)

#### 🔴 appearance-tab.tsx
**Overall Score:** 68.8/100 (F)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/appearance-tab.tsx`  
**Violations:** 15

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for appearance |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for appearance |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for appearance |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for appearance |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Database Schema] No database tables found for appearance
4. [RLS Policies] No RLS policies found for appearance
5. [Internationalization] Potential hardcoded JSX text (7 instances)
6. [Accessibility] Buttons may be missing aria-label
7. [Accessibility] Limited semantic HTML/ARIA roles
8. [Accessibility] Click handlers without keyboard support
9. [Realtime] No realtime subscriptions
10. [Storage] File handling without storage integration
11. [Edge Functions] No edge functions for appearance
12. [API Routes] No API routes for appearance
13. [Type Safety] 1 'any' types found
14. [Type Safety] Component without typed props
15. [Type Safety] Functions without return type annotations


---


### ASSETS MODULE (5 files)

#### 🟢 assets-advances-tab.tsx
**Overall Score:** 91.8/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-advances-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for advances |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for advances |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for advances
3. [Authentication] No authentication integration
4. [API Routes] No API routes for advances
5. [Type Safety] 1 'any' types found
6. [Type Safety] Component without typed props
7. [Type Safety] Functions without return type annotations


---

#### 🟢 assets-approvals-tab.tsx
**Overall Score:** 90.8/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-approvals-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for approvals |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for approvals |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Internationalization] Potential hardcoded JSX text (6 instances)
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for approvals
4. [Authentication] No authentication integration
5. [API Routes] No API routes for approvals
6. [Type Safety] 1 'any' types found
7. [Type Safety] Component without typed props
8. [Type Safety] Functions without return type annotations


---

#### 🟡 assets-maintenance-tab.tsx
**Overall Score:** 89.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-maintenance-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for maintenance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for maintenance |
| 12. Type Safety | 60/100 | ❌ | 9 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Click handlers without keyboard support
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for maintenance
4. [Authentication] No authentication integration
5. [API Routes] No API routes for maintenance
6. [Type Safety] 9 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 assets-overview-tab.tsx
**Overall Score:** 92.0/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-overview-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (10 instances) |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 60/100 | ❌ | 10 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Internationalization] Potential hardcoded JSX text (10 instances)
3. [Realtime] No realtime subscriptions
4. [Type Safety] 10 'any' types found
5. [Type Safety] Functions without return type annotations


---

#### 🟡 assets-tracking-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/assets-tracking-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tracking |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tracking |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for tracking
4. [Authentication] No authentication integration
5. [API Routes] No API routes for tracking
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---


### AUTOMATIONS MODULE (1 files)

#### 🔴 automations-tab.tsx
**Overall Score:** 69.1/100 (F)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/automations-tab.tsx`  
**Violations:** 14

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for automations |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for automations |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for automations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for automations |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Database Schema] No database tables found for automations
4. [RLS Policies] No RLS policies found for automations
5. [Internationalization] Potential hardcoded JSX text (7 instances)
6. [Accessibility] Buttons may be missing aria-label
7. [Accessibility] Limited semantic HTML/ARIA roles
8. [Accessibility] Click handlers without keyboard support
9. [Realtime] No realtime subscriptions
10. [Edge Functions] No edge functions for automations
11. [Authentication] No authentication integration
12. [API Routes] No API routes for automations
13. [Type Safety] 1 'any' types found
14. [Type Safety] Functions without return type annotations


---


### BASIC MODULE (1 files)

#### 🟡 basic-info-tab.tsx
**Overall Score:** 84.5/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/basic-info-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for info |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for info |
| 12. Type Safety | 70/100 | ⚠️ | Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for info
7. [Authentication] No authentication integration
8. [API Routes] No API routes for info
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### BILLING MODULE (1 files)

#### 🟡 billing-tab.tsx
**Overall Score:** 87.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/billing-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (8 instances) |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for billing |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for billing |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Internationalization] Potential hardcoded JSX text (8 instances)
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for billing
7. [API Routes] No API routes for billing
8. [Type Safety] 4 'any' types found
9. [Type Safety] Functions without return type annotations


---


### CATALOG MODULE (1 files)

#### 🟢 catalog-tab.tsx
**Overall Score:** 91.8/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/catalog-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for catalog |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for catalog |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Click handlers without keyboard support
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for catalog
4. [API Routes] No API routes for catalog
5. [Type Safety] 5 'any' types found
6. [Type Safety] Functions without return type annotations


---


### CERTIFICATIONS MODULE (1 files)

#### 🟡 certifications-tab.tsx
**Overall Score:** 86.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/certifications-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for certifications |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for certifications |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for certifications
6. [Authentication] No authentication integration
7. [API Routes] No API routes for certifications
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---


### CHECKLIST MODULE (1 files)

#### 🟡 checklist-templates-tab.tsx
**Overall Score:** 89.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/checklist-templates-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for templates |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for templates |
| 12. Type Safety | 40/100 | ❌ | 5 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for templates
5. [API Routes] No API routes for templates
6. [Type Safety] 5 'any' types found
7. [Type Safety] Component without typed props
8. [Type Safety] Functions without return type annotations


---


### COMPANIES MODULE (11 files)

#### 🟡 companies-bids-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-bids-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for bids |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for bids |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for bids
4. [Authentication] No authentication integration
5. [API Routes] No API routes for bids
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 companies-companies-compliance-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-compliance-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for companies-compliance |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for companies-compliance |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for companies-compliance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for companies-compliance |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for companies-compliance
3. [RLS Policies] No RLS policies found for companies-compliance
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for companies-compliance
6. [Authentication] No authentication integration
7. [API Routes] No API routes for companies-compliance
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 companies-companies-invoices-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-invoices-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for companies-invoices |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for companies-invoices |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for companies-invoices |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for companies-invoices |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for companies-invoices
3. [RLS Policies] No RLS policies found for companies-invoices
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for companies-invoices
6. [Authentication] No authentication integration
7. [API Routes] No API routes for companies-invoices
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 companies-companies-reviews-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-reviews-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for companies-reviews |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for companies-reviews |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for companies-reviews |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for companies-reviews |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for companies-reviews
3. [RLS Policies] No RLS policies found for companies-reviews
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for companies-reviews
6. [Authentication] No authentication integration
7. [API Routes] No API routes for companies-reviews
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 companies-companies-work-orders-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-companies-work-orders-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for companies-work-orders |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for companies-work-orders |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for companies-work-orders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for companies-work-orders |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for companies-work-orders
3. [RLS Policies] No RLS policies found for companies-work-orders
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for companies-work-orders
6. [Authentication] No authentication integration
7. [API Routes] No API routes for companies-work-orders
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 companies-contacts-tab.tsx
**Overall Score:** 87.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-contacts-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for contacts |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for contacts |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for contacts
5. [Authentication] No authentication integration
6. [API Routes] No API routes for contacts
7. [Type Safety] 5 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 companies-deliverables-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-deliverables-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for deliverables |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for deliverables |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for deliverables
4. [Authentication] No authentication integration
5. [API Routes] No API routes for deliverables
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 companies-documents-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-documents-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for documents |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for documents |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for documents
5. [Authentication] No authentication integration
6. [API Routes] No API routes for documents
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 companies-organizations-tab.tsx
**Overall Score:** 89.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-organizations-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for organizations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for organizations |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for organizations
4. [Authentication] No authentication integration
5. [API Routes] No API routes for organizations
6. [Type Safety] 5 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 companies-scopes-of-work-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-scopes-of-work-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for scopes-of-work |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for scopes-of-work |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for scopes-of-work |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for scopes-of-work |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for scopes-of-work
3. [RLS Policies] No RLS policies found for scopes-of-work
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for scopes-of-work
6. [Authentication] No authentication integration
7. [API Routes] No API routes for scopes-of-work
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 companies-subcontractor-profile-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/companies/companies-subcontractor-profile-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for subcontractor-profile |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for subcontractor-profile |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for subcontractor-profile
5. [Authentication] No authentication integration
6. [API Routes] No API routes for subcontractor-profile
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---


### COMPETITIONS MODULE (1 files)

#### 🟠 competitions-tab.tsx
**Overall Score:** 72.0/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/competitions-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for competitions |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for competitions |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for competitions |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for competitions |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for competitions
3. [RLS Policies] No RLS policies found for competitions
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Storage] File handling without storage integration
9. [Edge Functions] No edge functions for competitions
10. [API Routes] No API routes for competitions
11. [Type Safety] 6 'any' types found
12. [Type Safety] Functions without return type annotations


---


### CONNECTIONS MODULE (1 files)

#### 🟡 connections-tab.tsx
**Overall Score:** 84.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/connections-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for connections |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for connections |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for connections
8. [API Routes] No API routes for connections
9. [Type Safety] 5 'any' types found
10. [Type Safety] Functions without return type annotations


---


### COUNTS MODULE (1 files)

#### 🟡 counts-tab.tsx
**Overall Score:** 87.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/counts-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for counts |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for counts |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Click handlers without keyboard support
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for counts
5. [Authentication] No authentication integration
6. [API Routes] No API routes for counts
7. [Type Safety] 4 'any' types found
8. [Type Safety] Functions without return type annotations


---


### CREATE MODULE (1 files)

#### 🟠 create-tab.tsx
**Overall Score:** 73.3/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/members/create-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 15/100 | ❌ | No data hook integration; No Supabase client; No loading state |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (8 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for create |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No data hook integration
2. [Data Hooks] No Supabase client
3. [Data Hooks] No loading state
4. [Internationalization] Potential hardcoded JSX text (8 instances)
5. [Accessibility] Buttons may be missing aria-label
6. [Accessibility] Limited semantic HTML/ARIA roles
7. [Accessibility] Click handlers without keyboard support
8. [Realtime] No realtime subscriptions
9. [Storage] File handling without storage integration
10. [Edge Functions] No edge functions for create
11. [Type Safety] 1 'any' types found
12. [Type Safety] Functions without return type annotations


---


### CUSTOM MODULE (1 files)

#### 🟠 custom-statuses-tab.tsx
**Overall Score:** 75.8/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/custom-statuses-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for statuses |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for statuses |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for statuses |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for statuses |
| 12. Type Safety | 40/100 | ❌ | 3 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for statuses
2. [RLS Policies] No RLS policies found for statuses
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for statuses
7. [Authentication] No authentication integration
8. [API Routes] No API routes for statuses
9. [Type Safety] 3 'any' types found
10. [Type Safety] Component without typed props
11. [Type Safety] Functions without return type annotations


---


### DASHBOARD MODULE (11 files)

#### 🟠 dashboard-my-advances-tab.tsx
**Overall Score:** 76.7/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-advances-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-advances |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-advances |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-advances |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-advances |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-advances
3. [RLS Policies] No RLS policies found for my-advances
4. [Internationalization] Potential hardcoded JSX text (7 instances)
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for my-advances
8. [API Routes] No API routes for my-advances
9. [Type Safety] 2 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-agenda-tab.tsx
**Overall Score:** 79.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-agenda-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-agenda |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-agenda |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-agenda |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-agenda |
| 12. Type Safety | 60/100 | ❌ | 7 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-agenda
3. [RLS Policies] No RLS policies found for my-agenda
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for my-agenda
6. [API Routes] No API routes for my-agenda
7. [Type Safety] 7 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-assets-tab.tsx
**Overall Score:** 76.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-assets-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-assets |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-assets |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-assets |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-assets |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-assets
3. [RLS Policies] No RLS policies found for my-assets
4. [Internationalization] Potential hardcoded JSX text (6 instances)
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for my-assets
8. [API Routes] No API routes for my-assets
9. [Type Safety] 3 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-expenses-tab.tsx
**Overall Score:** 79.7/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-expenses-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-expenses |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-expenses |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-expenses |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-expenses |
| 12. Type Safety | 70/100 | ⚠️ | 4 'any' types found |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-expenses
3. [RLS Policies] No RLS policies found for my-expenses
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for my-expenses
6. [API Routes] No API routes for my-expenses
7. [Type Safety] 4 'any' types found


---

#### 🟠 dashboard-my-files-tab.tsx
**Overall Score:** 75.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-files-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-files |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-files |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-files |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-files |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-files
3. [RLS Policies] No RLS policies found for my-files
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for my-files
8. [API Routes] No API routes for my-files
9. [Type Safety] 3 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-jobs-tab.tsx
**Overall Score:** 75.7/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-jobs-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-jobs |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-jobs |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-jobs |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-jobs |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-jobs
3. [RLS Policies] No RLS policies found for my-jobs
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for my-jobs
8. [API Routes] No API routes for my-jobs
9. [Type Safety] 2 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-orders-tab.tsx
**Overall Score:** 77.7/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-orders-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-orders |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-orders |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-orders |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-orders |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-orders
3. [RLS Policies] No RLS policies found for my-orders
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for my-orders
7. [API Routes] No API routes for my-orders
8. [Type Safety] 2 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-reports-tab.tsx
**Overall Score:** 75.7/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-reports-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-reports |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-reports |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-reports |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-reports |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-reports
3. [RLS Policies] No RLS policies found for my-reports
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for my-reports
8. [API Routes] No API routes for my-reports
9. [Type Safety] 2 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-tasks-tab.tsx
**Overall Score:** 79.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-tasks-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-tasks |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-tasks |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-tasks |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-tasks |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-tasks
3. [RLS Policies] No RLS policies found for my-tasks
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for my-tasks
6. [API Routes] No API routes for my-tasks
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 dashboard-my-travel-tab.tsx
**Overall Score:** 78.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-my-travel-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for my-travel |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for my-travel |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for my-travel |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for my-travel |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for my-travel
3. [RLS Policies] No RLS policies found for my-travel
4. [Internationalization] Potential hardcoded JSX text (7 instances)
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for my-travel
7. [API Routes] No API routes for my-travel
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 dashboard-overview-tab.tsx
**Overall Score:** 89.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/dashboard/dashboard-overview-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Type Safety] 3 'any' types found
6. [Type Safety] Functions without return type annotations


---


### DISCUSSIONS MODULE (1 files)

#### 🟡 discussions-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/discussions-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for discussions |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for discussions |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for discussions
7. [API Routes] No API routes for discussions
8. [Type Safety] 6 'any' types found
9. [Type Safety] Functions without return type annotations


---


### EMERGENCY MODULE (1 files)

#### 🟡 emergency-tab.tsx
**Overall Score:** 84.5/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/emergency-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for emergency |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for emergency |
| 12. Type Safety | 70/100 | ⚠️ | Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for emergency
7. [Authentication] No authentication integration
8. [API Routes] No API routes for emergency
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### ENDORSEMENTS MODULE (1 files)

#### 🟠 endorsements-tab.tsx
**Overall Score:** 78.0/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/endorsements-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for endorsements |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for endorsements |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for endorsements |
| 12. Type Safety | 60/100 | ❌ | 7 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for endorsements
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for endorsements
8. [Authentication] No authentication integration
9. [API Routes] No API routes for endorsements
10. [Type Safety] 7 'any' types found
11. [Type Safety] Functions without return type annotations


---


### EVENTS MODULE (16 files)

#### 🟡 events-activities-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-activities-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for activities |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for activities |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for activities
4. [Authentication] No authentication integration
5. [API Routes] No API routes for activities
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 events-all-events-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-all-events-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for all-events |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for all-events |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for all-events |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for all-events |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for all-events
3. [RLS Policies] No RLS policies found for all-events
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for all-events
6. [Authentication] No authentication integration
7. [API Routes] No API routes for all-events
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 events-blocks-tab.tsx
**Overall Score:** 83.9/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-blocks-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for blocks |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for blocks |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for blocks |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for blocks
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for blocks
5. [Authentication] No authentication integration
6. [API Routes] No API routes for blocks
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 events-bookings-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-bookings-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for bookings |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for bookings |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for bookings
4. [Authentication] No authentication integration
5. [API Routes] No API routes for bookings
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-calendar-tab.tsx
**Overall Score:** 87.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-calendar-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for calendar |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for calendar |
| 12. Type Safety | 60/100 | ❌ | 8 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for calendar
5. [Authentication] No authentication integration
6. [API Routes] No API routes for calendar
7. [Type Safety] 8 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 events-equipment-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-equipment-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for equipment |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for equipment |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for equipment
4. [Authentication] No authentication integration
5. [API Routes] No API routes for equipment
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-incidents-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-incidents-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for incidents |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for incidents |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for incidents
4. [Authentication] No authentication integration
5. [API Routes] No API routes for incidents
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-internal-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-internal-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for internal |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for internal |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for internal
4. [Authentication] No authentication integration
5. [API Routes] No API routes for internal
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-itineraries-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-itineraries-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for itineraries |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for itineraries |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for itineraries
4. [Authentication] No authentication integration
5. [API Routes] No API routes for itineraries
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-rehearsals-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-rehearsals-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for rehearsals |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for rehearsals |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for rehearsals
4. [Authentication] No authentication integration
5. [API Routes] No API routes for rehearsals
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 events-reservations-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-reservations-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for reservations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for reservations |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for reservations
4. [Authentication] No authentication integration
5. [API Routes] No API routes for reservations
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 events-run-of-show-tab.tsx
**Overall Score:** 74.5/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-run-of-show-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for run-of-show |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for run-of-show |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for run-of-show |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for run-of-show |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for run-of-show
3. [RLS Policies] No RLS policies found for run-of-show
4. [Internationalization] Potential hardcoded JSX text (6 instances)
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for run-of-show
8. [Authentication] No authentication integration
9. [API Routes] No API routes for run-of-show
10. [Type Safety] 6 'any' types found
11. [Type Safety] Functions without return type annotations


---

#### 🟠 events-shipping-receiving-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-shipping-receiving-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for shipping-receiving |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for shipping-receiving |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for shipping-receiving |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for shipping-receiving |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for shipping-receiving
3. [RLS Policies] No RLS policies found for shipping-receiving
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for shipping-receiving
6. [Authentication] No authentication integration
7. [API Routes] No API routes for shipping-receiving
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 events-tab.tsx
**Overall Score:** 82.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/events-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for events |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for events |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for events
8. [Authentication] No authentication integration
9. [API Routes] No API routes for events
10. [Type Safety] 4 'any' types found
11. [Type Safety] Functions without return type annotations


---

#### 🟡 events-tours-tab.tsx
**Overall Score:** 80.5/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-tours-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for tours |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tours |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tours |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for tours
3. [Internationalization] Potential hardcoded JSX text (6 instances)
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for tours
7. [Authentication] No authentication integration
8. [API Routes] No API routes for tours
9. [Type Safety] 5 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 events-trainings-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/events/events-trainings-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for trainings |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for trainings |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for trainings |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for trainings |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for trainings
3. [RLS Policies] No RLS policies found for trainings
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for trainings
6. [Authentication] No authentication integration
7. [API Routes] No API routes for trainings
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---


### FAVORITES MODULE (1 files)

#### 🟠 favorites-tab.tsx
**Overall Score:** 74.5/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/favorites-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for favorites |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for favorites |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for favorites |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for favorites |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for favorites
2. [RLS Policies] No RLS policies found for favorites
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for favorites
8. [Authentication] No authentication integration
9. [API Routes] No API routes for favorites
10. [Type Safety] 2 'any' types found
11. [Type Safety] Functions without return type annotations


---


### FILES MODULE (10 files)

#### 🟠 files-all-documents-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-all-documents-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for all-documents |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for all-documents |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for all-documents |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for all-documents |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for all-documents
3. [RLS Policies] No RLS policies found for all-documents
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for all-documents
7. [Authentication] No authentication integration
8. [API Routes] No API routes for all-documents
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟡 files-archive-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-archive-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for archive |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for archive |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for archive
5. [Authentication] No authentication integration
6. [API Routes] No API routes for archive
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 files-call-sheets-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-call-sheets-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for call-sheets |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for call-sheets |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for call-sheets |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for call-sheets |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for call-sheets
3. [RLS Policies] No RLS policies found for call-sheets
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for call-sheets
7. [Authentication] No authentication integration
8. [API Routes] No API routes for call-sheets
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟡 files-contracts-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-contracts-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for contracts |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for contracts |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for contracts
5. [Authentication] No authentication integration
6. [API Routes] No API routes for contracts
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 files-insurance-permits-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-insurance-permits-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for insurance-permits |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for insurance-permits |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for insurance-permits |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for insurance-permits |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for insurance-permits
3. [RLS Policies] No RLS policies found for insurance-permits
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for insurance-permits
7. [Authentication] No authentication integration
8. [API Routes] No API routes for insurance-permits
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 files-media-assets-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-media-assets-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for media-assets |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for media-assets |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for media-assets |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for media-assets |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for media-assets
3. [RLS Policies] No RLS policies found for media-assets
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for media-assets
7. [Authentication] No authentication integration
8. [API Routes] No API routes for media-assets
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟠 files-production-reports-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-production-reports-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for production-reports |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for production-reports |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for production-reports |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for production-reports |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for production-reports
3. [RLS Policies] No RLS policies found for production-reports
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for production-reports
7. [Authentication] No authentication integration
8. [API Routes] No API routes for production-reports
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟡 files-riders-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-riders-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for riders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for riders |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for riders
5. [Authentication] No authentication integration
6. [API Routes] No API routes for riders
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 files-shared-tab.tsx
**Overall Score:** 87.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-shared-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for shared |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for shared |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for shared
5. [Authentication] No authentication integration
6. [API Routes] No API routes for shared
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 files-tech-specs-tab.tsx
**Overall Score:** 75.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/files/files-tech-specs-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for tech-specs |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for tech-specs |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tech-specs |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tech-specs |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for tech-specs
3. [RLS Policies] No RLS policies found for tech-specs
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for tech-specs
7. [Authentication] No authentication integration
8. [API Routes] No API routes for tech-specs
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---


### FINANCE MODULE (18 files)

#### 🟠 finance-accounts-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-accounts-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for accounts |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for accounts |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for accounts |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for accounts |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for accounts
3. [RLS Policies] No RLS policies found for accounts
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for accounts
6. [Authentication] No authentication integration
7. [API Routes] No API routes for accounts
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟢 finance-approvals-tab.tsx
**Overall Score:** 94.0/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-approvals-tab.tsx`  
**Violations:** 4

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for approvals |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for approvals |
| 12. Type Safety | 70/100 | ⚠️ | 3 'any' types found |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for approvals
3. [API Routes] No API routes for approvals
4. [Type Safety] 3 'any' types found


---

#### 🟡 finance-budgets-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-budgets-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for budgets |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for budgets |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for budgets
4. [Authentication] No authentication integration
5. [API Routes] No API routes for budgets
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-cash-flow-tab.tsx
**Overall Score:** 89.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-cash-flow-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for cash-flow |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for cash-flow |
| 12. Type Safety | 60/100 | ❌ | 19 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for cash-flow
4. [Authentication] No authentication integration
5. [API Routes] No API routes for cash-flow
6. [Type Safety] 19 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-expenses-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-expenses-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for expenses |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for expenses |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for expenses
4. [Authentication] No authentication integration
5. [API Routes] No API routes for expenses
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-forecasts-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-forecasts-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for forecasts |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for forecasts |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for forecasts
4. [Authentication] No authentication integration
5. [API Routes] No API routes for forecasts
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-gl-codes-tab.tsx
**Overall Score:** 83.9/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-gl-codes-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for gl-codes |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for gl-codes |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for gl-codes |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for gl-codes
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for gl-codes
5. [Authentication] No authentication integration
6. [API Routes] No API routes for gl-codes
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-invoices-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-invoices-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for invoices |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for invoices |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for invoices
4. [Authentication] No authentication integration
5. [API Routes] No API routes for invoices
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-overview-tab.tsx
**Overall Score:** 89.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-overview-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 60/100 | ❌ | 15 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Realtime] No realtime subscriptions
4. [Authentication] No authentication integration
5. [Type Safety] 15 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-payments-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-payments-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for payments |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for payments |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for payments
4. [Authentication] No authentication integration
5. [API Routes] No API routes for payments
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-payroll-tab.tsx
**Overall Score:** 83.9/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-payroll-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for payroll |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for payroll |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for payroll |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for payroll
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for payroll
5. [Authentication] No authentication integration
6. [API Routes] No API routes for payroll
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-policies-tab.tsx
**Overall Score:** 87.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-policies-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for policies |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for policies |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for policies
5. [Authentication] No authentication integration
6. [API Routes] No API routes for policies
7. [Type Safety] 6 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-reconciliation-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-reconciliation-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for reconciliation |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for reconciliation |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for reconciliation
4. [Authentication] No authentication integration
5. [API Routes] No API routes for reconciliation
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-revenue-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-revenue-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for revenue |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for revenue |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for revenue
4. [Authentication] No authentication integration
5. [API Routes] No API routes for revenue
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-scenarios-tab.tsx
**Overall Score:** 90.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-scenarios-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for scenarios |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for scenarios |
| 12. Type Safety | 70/100 | ⚠️ | 5 'any' types found |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for scenarios
4. [Authentication] No authentication integration
5. [API Routes] No API routes for scenarios
6. [Type Safety] 5 'any' types found


---

#### 🟠 finance-taxes-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-taxes-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for taxes |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for taxes |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for taxes |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for taxes |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for taxes
3. [RLS Policies] No RLS policies found for taxes
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for taxes
6. [Authentication] No authentication integration
7. [API Routes] No API routes for taxes
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-transactions-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-transactions-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for transactions |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for transactions |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for transactions
4. [Authentication] No authentication integration
5. [API Routes] No API routes for transactions
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 finance-variance-tab.tsx
**Overall Score:** 84.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/finance/finance-variance-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 60/100 | ❌ | No data hook integration |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for variance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for variance |
| 12. Type Safety | 80/100 | ⚠️ | 2 'any' types found |


**Action Items:**
1. [Data Hooks] No data hook integration
2. [Accessibility] Buttons may be missing aria-label
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for variance
5. [Authentication] No authentication integration
6. [API Routes] No API routes for variance
7. [Type Safety] 2 'any' types found


---


### HEALTH MODULE (1 files)

#### 🟡 health-tab.tsx
**Overall Score:** 88.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/health-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for health |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for health |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for health
5. [Authentication] No authentication integration
6. [API Routes] No API routes for health
7. [Type Safety] 1 'any' types found
8. [Type Safety] Component without typed props
9. [Type Safety] Functions without return type annotations


---


### HISTORY MODULE (1 files)

#### 🟡 history-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/history-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for history |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for history |
| 12. Type Safety | 60/100 | ❌ | 9 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for history
6. [Authentication] No authentication integration
7. [API Routes] No API routes for history
8. [Type Safety] 9 'any' types found
9. [Type Safety] Functions without return type annotations


---


### INSIGHTS MODULE (10 files)

#### 🟢 insights-benchmarks-tab.tsx
**Overall Score:** 92.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-benchmarks-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for benchmarks |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for benchmarks |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for benchmarks
3. [Authentication] No authentication integration
4. [API Routes] No API routes for benchmarks
5. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-intelligence-feed-tab.tsx
**Overall Score:** 88.4/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-intelligence-feed-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for intelligence-feed |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for intelligence-feed |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for intelligence-feed
5. [Authentication] No authentication integration
6. [API Routes] No API routes for intelligence-feed
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-key-results-tab.tsx
**Overall Score:** 88.2/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-key-results-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for key-results |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for key-results |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for key-results
5. [Authentication] No authentication integration
6. [API Routes] No API routes for key-results
7. [Type Safety] 2 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-objectives-tab.tsx
**Overall Score:** 86.2/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-objectives-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for objectives |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for objectives |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for objectives
6. [Authentication] No authentication integration
7. [API Routes] No API routes for objectives
8. [Type Safety] 2 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-overview-tab.tsx
**Overall Score:** 89.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-overview-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Authentication] No authentication integration
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-priorities-tab.tsx
**Overall Score:** 87.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-priorities-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for priorities |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for priorities |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Internationalization] Potential hardcoded JSX text (7 instances)
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for priorities
6. [Authentication] No authentication integration
7. [API Routes] No API routes for priorities
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 insights-progress-tracking-tab.tsx
**Overall Score:** 78.1/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-progress-tracking-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for progress-tracking |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for progress-tracking |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for progress-tracking |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for progress-tracking |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for progress-tracking
3. [RLS Policies] No RLS policies found for progress-tracking
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for progress-tracking
6. [Authentication] No authentication integration
7. [API Routes] No API routes for progress-tracking
8. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-recommendations-tab.tsx
**Overall Score:** 86.2/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-recommendations-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for recommendations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for recommendations |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for recommendations
6. [Authentication] No authentication integration
7. [API Routes] No API routes for recommendations
8. [Type Safety] 2 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-reviews-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-reviews-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for reviews |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for reviews |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for reviews
6. [Authentication] No authentication integration
7. [API Routes] No API routes for reviews
8. [Type Safety] 4 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 insights-success-metrics-tab.tsx
**Overall Score:** 80.3/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/insights/insights-success-metrics-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for success-metrics |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for success-metrics |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for success-metrics |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for success-metrics |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for success-metrics
2. [RLS Policies] No RLS policies found for success-metrics
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for success-metrics
5. [Authentication] No authentication integration
6. [API Routes] No API routes for success-metrics
7. [Type Safety] Functions without return type annotations


---


### INTEGRATIONS MODULE (1 files)

#### 🟡 integrations-tab.tsx
**Overall Score:** 80.3/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/integrations-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for integrations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for integrations |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Storage] File handling without storage integration
8. [Edge Functions] No edge functions for integrations
9. [Authentication] No authentication integration
10. [API Routes] No API routes for integrations
11. [Type Safety] Functions without return type annotations


---


### INVENTORY MODULE (1 files)

#### 🟡 inventory-tab.tsx
**Overall Score:** 87.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/inventory-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for inventory |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for inventory |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Click handlers without keyboard support
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for inventory
5. [Authentication] No authentication integration
6. [API Routes] No API routes for inventory
7. [Type Safety] 4 'any' types found
8. [Type Safety] Functions without return type annotations


---


### INVITE MODULE (1 files)

#### 🟠 invite-tab.tsx
**Overall Score:** 72.5/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/members/invite-tab.tsx`  
**Violations:** 13

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 0/100 | ❌ | No data hook integration; No Supabase client; No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (8 instances) |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for invite |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for invite |
| 12. Type Safety | 70/100 | ⚠️ | Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No data hook integration
2. [Data Hooks] No Supabase client
3. [Data Hooks] No loading state
4. [Data Hooks] No error handling
5. [Internationalization] Potential hardcoded JSX text (8 instances)
6. [Accessibility] Buttons may be missing aria-label
7. [Accessibility] Limited semantic HTML/ARIA roles
8. [Realtime] No realtime subscriptions
9. [Edge Functions] No edge functions for invite
10. [Authentication] No authentication integration
11. [API Routes] No API routes for invite
12. [Type Safety] Component without typed props
13. [Type Safety] Functions without return type annotations


---


### JOBS MODULE (15 files)

#### 🟡 jobs-active-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-active-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for active |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for active |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for active
4. [Authentication] No authentication integration
5. [API Routes] No API routes for active
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-archived-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-archived-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for archived |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for archived |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for archived
4. [Authentication] No authentication integration
5. [API Routes] No API routes for archived
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-checklists-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-checklists-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for checklists |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for checklists |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for checklists
4. [Authentication] No authentication integration
5. [API Routes] No API routes for checklists
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-completed-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-completed-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for completed |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for completed |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for completed
4. [Authentication] No authentication integration
5. [API Routes] No API routes for completed
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-dispatch-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-dispatch-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for dispatch |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for dispatch |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for dispatch
4. [Authentication] No authentication integration
5. [API Routes] No API routes for dispatch
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-estimates-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-estimates-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for estimates |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for estimates |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for estimates
4. [Authentication] No authentication integration
5. [API Routes] No API routes for estimates
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 jobs-jobs-compliance-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-jobs-compliance-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for jobs-compliance |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for jobs-compliance |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for jobs-compliance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for jobs-compliance |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for jobs-compliance
3. [RLS Policies] No RLS policies found for jobs-compliance
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for jobs-compliance
6. [Authentication] No authentication integration
7. [API Routes] No API routes for jobs-compliance
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 jobs-jobs-invoices-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-jobs-invoices-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for jobs-invoices |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for jobs-invoices |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for jobs-invoices |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for jobs-invoices |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for jobs-invoices
3. [RLS Policies] No RLS policies found for jobs-invoices
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for jobs-invoices
6. [Authentication] No authentication integration
7. [API Routes] No API routes for jobs-invoices
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-offers-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-offers-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for offers |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for offers |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for offers
4. [Authentication] No authentication integration
5. [API Routes] No API routes for offers
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 jobs-overview-tab.tsx
**Overall Score:** 91.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-overview-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Authentication] No authentication integration
4. [Type Safety] 1 'any' types found
5. [Type Safety] Functions without return type annotations


---

#### 🟠 jobs-pipeline-tab.tsx
**Overall Score:** 77.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-pipeline-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for pipeline |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for pipeline |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for pipeline |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for pipeline |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for pipeline
3. [RLS Policies] No RLS policies found for pipeline
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for pipeline
6. [Authentication] No authentication integration
7. [API Routes] No API routes for pipeline
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-recruiting-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-recruiting-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for recruiting |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for recruiting |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for recruiting
4. [Authentication] No authentication integration
5. [API Routes] No API routes for recruiting
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-rfps-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-rfps-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for rfps |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for rfps |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for rfps
4. [Authentication] No authentication integration
5. [API Routes] No API routes for rfps
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 jobs-shortlists-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-shortlists-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for shortlists |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for shortlists |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for shortlists |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for shortlists |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for shortlists
3. [RLS Policies] No RLS policies found for shortlists
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for shortlists
6. [Authentication] No authentication integration
7. [API Routes] No API routes for shortlists
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 jobs-work-orders-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/jobs/jobs-work-orders-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for work-orders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for work-orders |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for work-orders
4. [Authentication] No authentication integration
5. [API Routes] No API routes for work-orders
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---


### LISTS MODULE (1 files)

#### 🟢 lists-tab.tsx
**Overall Score:** 90.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/lists-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for lists |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for lists |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for lists
4. [Authentication] No authentication integration
5. [API Routes] No API routes for lists
6. [Type Safety] 4 'any' types found
7. [Type Safety] Functions without return type annotations


---


### LOCATIONS MODULE (9 files)

#### 🟡 locations-access-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-access-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for access |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for access |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for access
4. [Authentication] No authentication integration
5. [API Routes] No API routes for access
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 locations-bim-models-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-bim-models-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for bim-models |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for bim-models |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for bim-models
4. [Authentication] No authentication integration
5. [API Routes] No API routes for bim-models
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 locations-coordination-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-coordination-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for coordination |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for coordination |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for coordination
4. [Authentication] No authentication integration
5. [API Routes] No API routes for coordination
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 locations-directory-tab.tsx
**Overall Score:** 77.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-directory-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for directory |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for directory |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for directory |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for directory |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for directory
3. [RLS Policies] No RLS policies found for directory
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for directory
6. [Authentication] No authentication integration
7. [API Routes] No API routes for directory
8. [Type Safety] 6 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 locations-logistics-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-logistics-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for logistics |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for logistics |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for logistics
4. [Authentication] No authentication integration
5. [API Routes] No API routes for logistics
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 locations-site-maps-tab.tsx
**Overall Score:** 85.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-site-maps-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for site-maps |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for site-maps |
| 12. Type Safety | 60/100 | ❌ | 8 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for site-maps
6. [Authentication] No authentication integration
7. [API Routes] No API routes for site-maps
8. [Type Safety] 8 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 locations-spatial-features-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-spatial-features-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for spatial-features |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for spatial-features |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for spatial-features |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for spatial-features |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for spatial-features
3. [RLS Policies] No RLS policies found for spatial-features
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for spatial-features
6. [Authentication] No authentication integration
7. [API Routes] No API routes for spatial-features
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 locations-utilities-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-utilities-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for utilities |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for utilities |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for utilities
4. [Authentication] No authentication integration
5. [API Routes] No API routes for utilities
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 locations-warehousing-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/locations/locations-warehousing-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for warehousing |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for warehousing |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for warehousing |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for warehousing |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for warehousing
3. [RLS Policies] No RLS policies found for warehousing
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for warehousing
6. [Authentication] No authentication integration
7. [API Routes] No API routes for warehousing
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---


### MEMBERS MODULE (1 files)

#### 🟡 members-management-tab.tsx
**Overall Score:** 83.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/members-management-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for management |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for management |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Internationalization] Potential hardcoded JSX text (7 instances)
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for management
8. [Authentication] No authentication integration
9. [API Routes] No API routes for management
10. [Type Safety] 1 'any' types found
11. [Type Safety] Functions without return type annotations


---


### NEWS MODULE (1 files)

#### 🟡 news-tab.tsx
**Overall Score:** 80.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/news-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for news |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for news |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for news |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for news
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for news
7. [Authentication] No authentication integration
8. [API Routes] No API routes for news
9. [Type Safety] 4 'any' types found
10. [Type Safety] Functions without return type annotations


---


### ORDERS MODULE (1 files)

#### 🟡 orders-tab.tsx
**Overall Score:** 86.2/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/orders-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for orders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for orders |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for orders
6. [Authentication] No authentication integration
7. [API Routes] No API routes for orders
8. [Type Safety] 2 'any' types found
9. [Type Safety] Functions without return type annotations


---


### ORGANIZATION MODULE (2 files)

#### 🟡 organization-settings-tab.tsx
**Overall Score:** 89.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/organization-settings-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (12 instances) |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for settings |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for settings |
| 12. Type Safety | 50/100 | ❌ | 2 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Internationalization] Potential hardcoded JSX text (12 instances)
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for settings
6. [API Routes] No API routes for settings
7. [Type Safety] 2 'any' types found
8. [Type Safety] Component without typed props
9. [Type Safety] Functions without return type annotations


---

#### 🟡 organization-tab.tsx
**Overall Score:** 84.6/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/organization-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for organization |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for organization |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for organization
7. [Authentication] No authentication integration
8. [API Routes] No API routes for organization
9. [Type Safety] 1 'any' types found
10. [Type Safety] Functions without return type annotations


---


### PEOPLE MODULE (9 files)

#### 🟢 people-applicants-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-applicants-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for applicants |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for applicants |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for applicants
3. [Authentication] No authentication integration
4. [API Routes] No API routes for applicants
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 people-assignments-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-assignments-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for assignments |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for assignments |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for assignments
3. [Authentication] No authentication integration
4. [API Routes] No API routes for assignments
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 people-onboarding-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-onboarding-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for onboarding |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for onboarding |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for onboarding
3. [Authentication] No authentication integration
4. [API Routes] No API routes for onboarding
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 people-openings-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-openings-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for openings |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for openings |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for openings
3. [Authentication] No authentication integration
4. [API Routes] No API routes for openings
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 people-personnel-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-personnel-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for personnel |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for personnel |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for personnel
3. [Authentication] No authentication integration
4. [API Routes] No API routes for personnel
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 people-scheduling-tab.tsx
**Overall Score:** 89.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-scheduling-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for scheduling |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for scheduling |
| 12. Type Safety | 60/100 | ❌ | 11 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Click handlers without keyboard support
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for scheduling
4. [Authentication] No authentication integration
5. [API Routes] No API routes for scheduling
6. [Type Safety] 11 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 people-teams-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-teams-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for teams |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for teams |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for teams
3. [Authentication] No authentication integration
4. [API Routes] No API routes for teams
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 people-timekeeping-tab.tsx
**Overall Score:** 80.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-timekeeping-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for timekeeping |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for timekeeping |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for timekeeping |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for timekeeping |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for timekeeping
2. [RLS Policies] No RLS policies found for timekeeping
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for timekeeping
5. [Authentication] No authentication integration
6. [API Routes] No API routes for timekeeping
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟢 people-training-tab.tsx
**Overall Score:** 92.0/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/people/people-training-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for training |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for training |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for training
3. [Authentication] No authentication integration
4. [API Routes] No API routes for training
5. [Type Safety] 2 'any' types found
6. [Type Safety] Functions without return type annotations


---


### PERFORMANCE MODULE (1 files)

#### 🟡 performance-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/performance-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for performance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for performance |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for performance
6. [Authentication] No authentication integration
7. [API Routes] No API routes for performance
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---


### PLUGINS MODULE (1 files)

#### 🟠 plugins-tab.tsx
**Overall Score:** 70.3/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/plugins-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for plugins |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for plugins |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for plugins |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for plugins |
| 12. Type Safety | 90/100 | ✅ | Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Database Schema] No database tables found for plugins
4. [RLS Policies] No RLS policies found for plugins
5. [Accessibility] Buttons may be missing aria-label
6. [Accessibility] Limited semantic HTML/ARIA roles
7. [Accessibility] Click handlers without keyboard support
8. [Realtime] No realtime subscriptions
9. [Edge Functions] No edge functions for plugins
10. [Authentication] No authentication integration
11. [API Routes] No API routes for plugins
12. [Type Safety] Functions without return type annotations


---


### PROCUREMENT MODULE (11 files)

#### 🟢 procurement-agreements-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-agreements-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for agreements |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for agreements |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for agreements
3. [Authentication] No authentication integration
4. [API Routes] No API routes for agreements
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 procurement-audits-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-audits-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for audits |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for audits |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for audits
3. [Authentication] No authentication integration
4. [API Routes] No API routes for audits
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 procurement-fulfillment-tab.tsx
**Overall Score:** 80.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-fulfillment-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for fulfillment |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for fulfillment |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for fulfillment |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for fulfillment |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for fulfillment
2. [RLS Policies] No RLS policies found for fulfillment
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for fulfillment
5. [Authentication] No authentication integration
6. [API Routes] No API routes for fulfillment
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟢 procurement-line-items-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-line-items-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for line-items |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for line-items |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for line-items
3. [Authentication] No authentication integration
4. [API Routes] No API routes for line-items
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 procurement-matching-tab.tsx
**Overall Score:** 88.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-matching-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (20 instances) |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for matching |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for matching |
| 12. Type Safety | 60/100 | ❌ | 9 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Internationalization] Potential hardcoded JSX text (20 instances)
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for matching
5. [Authentication] No authentication integration
6. [API Routes] No API routes for matching
7. [Type Safety] 9 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟠 procurement-orders-dashboard-tab.tsx
**Overall Score:** 77.8/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-orders-dashboard-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for orders-dashboard |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for orders-dashboard |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Buttons may be missing aria-label |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for orders-dashboard |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for orders-dashboard |
| 12. Type Safety | 60/100 | ❌ | 17 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for orders-dashboard
2. [RLS Policies] No RLS policies found for orders-dashboard
3. [Accessibility] Buttons may be missing aria-label
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for orders-dashboard
6. [Authentication] No authentication integration
7. [API Routes] No API routes for orders-dashboard
8. [Type Safety] 17 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟢 procurement-orders-tab.tsx
**Overall Score:** 92.1/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-orders-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for orders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for orders |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Edge Functions] No edge functions for orders
3. [Authentication] No authentication integration
4. [API Routes] No API routes for orders
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟢 procurement-overview-tab.tsx
**Overall Score:** 93.6/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-overview-tab.tsx`  
**Violations:** 4

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Realtime] No realtime subscriptions
2. [Authentication] No authentication integration
3. [Type Safety] 1 'any' types found
4. [Type Safety] Functions without return type annotations


---

#### 🟡 procurement-procurement-approvals-tab.tsx
**Overall Score:** 80.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-procurement-approvals-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 50/100 | ❌ | No database tables found for procurement-approvals |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for procurement-approvals |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for procurement-approvals |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for procurement-approvals |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Database Schema] No database tables found for procurement-approvals
2. [RLS Policies] No RLS policies found for procurement-approvals
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for procurement-approvals
5. [Authentication] No authentication integration
6. [API Routes] No API routes for procurement-approvals
7. [Type Safety] 1 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 procurement-receiving-tab.tsx
**Overall Score:** 80.8/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-receiving-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for receiving |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (14 instances) |
| 6. Accessibility | 60/100 | ❌ | Buttons may be missing aria-label; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for receiving |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for receiving |
| 12. Type Safety | 60/100 | ❌ | 7 'any' types found; Functions without return type annotations |


**Action Items:**
1. [RLS Policies] No RLS policies found for receiving
2. [Internationalization] Potential hardcoded JSX text (14 instances)
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for receiving
7. [Authentication] No authentication integration
8. [API Routes] No API routes for receiving
9. [Type Safety] 7 'any' types found
10. [Type Safety] Functions without return type annotations


---

#### 🟡 procurement-requisitions-tab.tsx
**Overall Score:** 86.1/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/procurement/procurement-requisitions-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for requisitions |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for requisitions |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for requisitions |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [RLS Policies] No RLS policies found for requisitions
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for requisitions
4. [Authentication] No authentication integration
5. [API Routes] No API routes for requisitions
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---


### PRODUCTS MODULE (1 files)

#### 🟡 products-tab.tsx
**Overall Score:** 82.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/products-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for products |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for products |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for products
8. [Authentication] No authentication integration
9. [API Routes] No API routes for products
10. [Type Safety] 3 'any' types found
11. [Type Safety] Functions without return type annotations


---


### PROFESSIONAL MODULE (1 files)

#### 🟡 professional-tab.tsx
**Overall Score:** 86.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/professional-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for professional |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for professional |
| 12. Type Safety | 60/100 | ❌ | 6 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for professional
6. [Authentication] No authentication integration
7. [API Routes] No API routes for professional
8. [Type Safety] 6 'any' types found
9. [Type Safety] Functions without return type annotations


---


### PROJECTS MODULE (11 files)

#### 🟡 projects-activations-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-activations-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for activations |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for activations |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for activations
4. [Authentication] No authentication integration
5. [API Routes] No API routes for activations
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-compliance-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-compliance-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for compliance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for compliance |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for compliance
4. [Authentication] No authentication integration
5. [API Routes] No API routes for compliance
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-costs-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-costs-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for costs |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for costs |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for costs
4. [Authentication] No authentication integration
5. [API Routes] No API routes for costs
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-milestones-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-milestones-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for milestones |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for milestones |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for milestones
4. [Authentication] No authentication integration
5. [API Routes] No API routes for milestones
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 projects-overview-tab.tsx
**Overall Score:** 91.3/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-overview-tab.tsx`  
**Violations:** 5

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Authentication] No authentication integration
4. [Type Safety] 1 'any' types found
5. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-productions-tab.tsx
**Overall Score:** 89.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-productions-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for productions |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for productions |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for productions
4. [Authentication] No authentication integration
5. [API Routes] No API routes for productions
6. [Type Safety] 5 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 projects-projects-checklists-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-projects-checklists-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for projects-checklists |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for projects-checklists |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for projects-checklists |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for projects-checklists |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for projects-checklists
3. [RLS Policies] No RLS policies found for projects-checklists
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for projects-checklists
6. [Authentication] No authentication integration
7. [API Routes] No API routes for projects-checklists
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 projects-projects-work-orders-tab.tsx
**Overall Score:** 77.9/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-projects-work-orders-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for projects-work-orders |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for projects-work-orders |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for projects-work-orders |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for projects-work-orders |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for projects-work-orders
3. [RLS Policies] No RLS policies found for projects-work-orders
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for projects-work-orders
6. [Authentication] No authentication integration
7. [API Routes] No API routes for projects-work-orders
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-safety-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-safety-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for safety |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for safety |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for safety
4. [Authentication] No authentication integration
5. [API Routes] No API routes for safety
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 projects-schedule-tab.tsx
**Overall Score:** 88.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-schedule-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 80/100 | ⚠️ | Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for schedule |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Click handlers without keyboard support
3. [Realtime] No realtime subscriptions
4. [Authentication] No authentication integration
5. [API Routes] No API routes for schedule
6. [Type Safety] 5 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 projects-tasks-tab.tsx
**Overall Score:** 90.9/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/projects/projects-tasks-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tasks |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Authentication] No authentication integration
4. [API Routes] No API routes for tasks
5. [Type Safety] 1 'any' types found
6. [Type Safety] Functions without return type annotations


---


### PURCHASES MODULE (1 files)

#### 🟠 purchases-tab.tsx
**Overall Score:** 74.2/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/purchases-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for purchases |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for purchases |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for purchases |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for purchases |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for purchases
3. [RLS Policies] No RLS policies found for purchases
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for purchases
8. [Authentication] No authentication integration
9. [API Routes] No API routes for purchases
10. [Type Safety] 2 'any' types found
11. [Type Safety] Functions without return type annotations


---


### RECURRENCE MODULE (1 files)

#### 🟡 recurrence-rules-tab.tsx
**Overall Score:** 81.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/recurrence-rules-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (11 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for rules |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for rules |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Internationalization] Potential hardcoded JSX text (11 instances)
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Edge Functions] No edge functions for rules
9. [Authentication] No authentication integration
10. [API Routes] No API routes for rules
11. [Type Safety] 1 'any' types found
12. [Type Safety] Functions without return type annotations


---


### REPORTS MODULE (9 files)

#### 🟡 reports-archived-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-archived-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for archived |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for archived |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for archived
4. [Authentication] No authentication integration
5. [API Routes] No API routes for archived
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟡 reports-compliance-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-compliance-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for compliance |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for compliance |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for compliance
4. [Authentication] No authentication integration
5. [API Routes] No API routes for compliance
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟠 reports-custom-builder-tab.tsx
**Overall Score:** 77.5/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-custom-builder-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for custom-builder |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for custom-builder |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for custom-builder |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for custom-builder |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for custom-builder
3. [RLS Policies] No RLS policies found for custom-builder
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for custom-builder
6. [Authentication] No authentication integration
7. [API Routes] No API routes for custom-builder
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 reports-executive-tab.tsx
**Overall Score:** 83.7/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-executive-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for executive |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for executive |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for executive |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for executive
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for executive
5. [Authentication] No authentication integration
6. [API Routes] No API routes for executive
7. [Type Safety] 2 'any' types found
8. [Type Safety] Functions without return type annotations


---

#### 🟡 reports-exports-tab.tsx
**Overall Score:** 81.9/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-exports-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for exports |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for exports |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for exports |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for exports
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for exports
6. [Authentication] No authentication integration
7. [API Routes] No API routes for exports
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟡 reports-operational-tab.tsx
**Overall Score:** 89.9/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-operational-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for operational |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for operational |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for operational
4. [Authentication] No authentication integration
5. [API Routes] No API routes for operational
6. [Type Safety] 1 'any' types found
7. [Type Safety] Functions without return type annotations


---

#### 🟢 reports-overview-tab.tsx
**Overall Score:** 91.5/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-overview-tab.tsx`  
**Violations:** 4

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 90/100 | ✅ | 1 'any' types found |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Authentication] No authentication integration
4. [Type Safety] 1 'any' types found


---

#### 🟢 reports-scheduled-tab.tsx
**Overall Score:** 90.7/100 (A)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-scheduled-tab.tsx`  
**Violations:** 6

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 100/100 | ✅ | None |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for scheduled |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Authentication] No authentication integration
4. [API Routes] No API routes for scheduled
5. [Type Safety] 2 'any' types found
6. [Type Safety] Functions without return type annotations


---

#### 🟡 reports-templates-tab.tsx
**Overall Score:** 89.7/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/reports/reports-templates-tab.tsx`  
**Violations:** 7

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 100/100 | ✅ | None |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for templates |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for templates |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Realtime] No realtime subscriptions
3. [Edge Functions] No edge functions for templates
4. [Authentication] No authentication integration
5. [API Routes] No API routes for templates
6. [Type Safety] 2 'any' types found
7. [Type Safety] Functions without return type annotations


---


### RESOURCES MODULE (7 files)

#### 🟡 resources-courses-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-courses-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for courses |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for courses |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for courses
6. [Authentication] No authentication integration
7. [API Routes] No API routes for courses
8. [Type Safety] 5 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 resources-glossary-tab.tsx
**Overall Score:** 72.0/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-glossary-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for glossary |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for glossary |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for glossary |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for glossary |
| 12. Type Safety | 60/100 | ❌ | 8 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for glossary
3. [RLS Policies] No RLS policies found for glossary
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Edge Functions] No edge functions for glossary
9. [Authentication] No authentication integration
10. [API Routes] No API routes for glossary
11. [Type Safety] 8 'any' types found
12. [Type Safety] Functions without return type annotations


---

#### 🟡 resources-grants-tab.tsx
**Overall Score:** 86.0/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-grants-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for grants |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for grants |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for grants
6. [Authentication] No authentication integration
7. [API Routes] No API routes for grants
8. [Type Safety] 5 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 resources-guides-tab.tsx
**Overall Score:** 74.0/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-guides-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for guides |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for guides |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for guides |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for guides |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for guides
3. [RLS Policies] No RLS policies found for guides
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for guides
8. [Authentication] No authentication integration
9. [API Routes] No API routes for guides
10. [Type Safety] 5 'any' types found
11. [Type Safety] Functions without return type annotations


---

#### 🟡 resources-library-tab.tsx
**Overall Score:** 82.4/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-library-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for library |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for library |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for library |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for library
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Realtime] No realtime subscriptions
5. [Edge Functions] No edge functions for library
6. [Authentication] No authentication integration
7. [API Routes] No API routes for library
8. [Type Safety] 1 'any' types found
9. [Type Safety] Functions without return type annotations


---

#### 🟠 resources-publications-tab.tsx
**Overall Score:** 74.0/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-publications-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for publications |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for publications |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for publications |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for publications |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for publications
3. [RLS Policies] No RLS policies found for publications
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for publications
8. [Authentication] No authentication integration
9. [API Routes] No API routes for publications
10. [Type Safety] 5 'any' types found
11. [Type Safety] Functions without return type annotations


---

#### 🟠 resources-troubleshooting-tab.tsx
**Overall Score:** 72.0/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/resources/resources-troubleshooting-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for troubleshooting |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for troubleshooting |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for troubleshooting |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for troubleshooting |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for troubleshooting
3. [RLS Policies] No RLS policies found for troubleshooting
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Realtime] No realtime subscriptions
7. [Storage] File handling without storage integration
8. [Edge Functions] No edge functions for troubleshooting
9. [Authentication] No authentication integration
10. [API Routes] No API routes for troubleshooting
11. [Type Safety] 5 'any' types found
12. [Type Safety] Functions without return type annotations


---


### REVIEWS MODULE (1 files)

#### 🟡 reviews-tab.tsx
**Overall Score:** 89.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/reviews-tab.tsx`  
**Violations:** 8

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for reviews |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for reviews |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Internationalization] Potential hardcoded JSX text (6 instances)
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Edge Functions] No edge functions for reviews
5. [Authentication] No authentication integration
6. [API Routes] No API routes for reviews
7. [Type Safety] 4 'any' types found
8. [Type Safety] Functions without return type annotations


---


### ROLES MODULE (1 files)

#### 🟡 roles-permissions-tab.tsx
**Overall Score:** 82.8/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/roles-permissions-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (9 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for permissions |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for permissions |
| 12. Type Safety | 60/100 | ❌ | 2 'any' types found; Component without typed props |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Internationalization] Potential hardcoded JSX text (9 instances)
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Edge Functions] No edge functions for permissions
9. [API Routes] No API routes for permissions
10. [Type Safety] 2 'any' types found
11. [Type Safety] Component without typed props


---


### SALES MODULE (1 files)

#### 🟡 sales-tab.tsx
**Overall Score:** 80.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/sales-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for sales |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for sales |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for sales |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for sales
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for sales
7. [Authentication] No authentication integration
8. [API Routes] No API routes for sales
9. [Type Safety] 4 'any' types found
10. [Type Safety] Functions without return type annotations


---


### SECURITY MODULE (1 files)

#### 🟡 security-tab.tsx
**Overall Score:** 85.5/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/security-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for security |
| 10. Authentication | 100/100 | ✅ | None |
| 11. API Routes | 85/100 | ✅ | No API routes for security |
| 12. Type Safety | 50/100 | ❌ | 2 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for security
7. [API Routes] No API routes for security
8. [Type Safety] 2 'any' types found
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### SERVICES MODULE (1 files)

#### 🟡 services-tab.tsx
**Overall Score:** 81.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/services-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (9 instances) |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for services |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for services |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Internationalization] Potential hardcoded JSX text (9 instances)
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Storage] File handling without storage integration
8. [Edge Functions] No edge functions for services
9. [Authentication] No authentication integration
10. [API Routes] No API routes for services
11. [Type Safety] 3 'any' types found
12. [Type Safety] Functions without return type annotations


---


### SHOP MODULE (1 files)

#### 🟡 shop-tab.tsx
**Overall Score:** 84.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/shop-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for shop |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for shop |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for shop
7. [Authentication] No authentication integration
8. [API Routes] No API routes for shop
9. [Type Safety] 3 'any' types found
10. [Type Safety] Functions without return type annotations


---


### SHOWCASE MODULE (1 files)

#### 🟠 showcase-tab.tsx
**Overall Score:** 76.0/100 (C+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/showcase-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for showcase |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for showcase |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for showcase |
| 12. Type Safety | 60/100 | ❌ | 5 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [RLS Policies] No RLS policies found for showcase
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Storage] File handling without storage integration
8. [Edge Functions] No edge functions for showcase
9. [Authentication] No authentication integration
10. [API Routes] No API routes for showcase
11. [Type Safety] 5 'any' types found
12. [Type Safety] Functions without return type annotations


---


### SOCIAL MODULE (1 files)

#### 🟡 social-tab.tsx
**Overall Score:** 88.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/social-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for social |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for social |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for social
5. [Authentication] No authentication integration
6. [API Routes] No API routes for social
7. [Type Safety] 1 'any' types found
8. [Type Safety] Component without typed props
9. [Type Safety] Functions without return type annotations


---


### SPOTLIGHT MODULE (1 files)

#### 🟠 spotlight-tab.tsx
**Overall Score:** 72.4/100 (C)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/spotlight-tab.tsx`  
**Violations:** 12

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 50/100 | ❌ | No database tables found for spotlight |
| 4. RLS Policies | 40/100 | ❌ | No RLS policies found for spotlight |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for spotlight |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for spotlight |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Database Schema] No database tables found for spotlight
3. [RLS Policies] No RLS policies found for spotlight
4. [Accessibility] Buttons may be missing aria-label
5. [Accessibility] Limited semantic HTML/ARIA roles
6. [Accessibility] Click handlers without keyboard support
7. [Realtime] No realtime subscriptions
8. [Edge Functions] No edge functions for spotlight
9. [Authentication] No authentication integration
10. [API Routes] No API routes for spotlight
11. [Type Safety] 1 'any' types found
12. [Type Safety] Functions without return type annotations


---


### STUDIOS MODULE (1 files)

#### 🟡 studios-tab.tsx
**Overall Score:** 82.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/community/studios-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for studios |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for studios |
| 12. Type Safety | 60/100 | ❌ | 4 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Storage] File handling without storage integration
7. [Edge Functions] No edge functions for studios
8. [Authentication] No authentication integration
9. [API Routes] No API routes for studios
10. [Type Safety] 4 'any' types found
11. [Type Safety] Functions without return type annotations


---


### TAGS MODULE (1 files)

#### 🟡 tags-tab.tsx
**Overall Score:** 87.8/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/tags-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tags |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tags |
| 12. Type Safety | 40/100 | ❌ | 9 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Limited semantic HTML/ARIA roles
2. [Realtime] No realtime subscriptions
3. [Storage] File handling without storage integration
4. [Edge Functions] No edge functions for tags
5. [Authentication] No authentication integration
6. [API Routes] No API routes for tags
7. [Type Safety] 9 'any' types found
8. [Type Safety] Component without typed props
9. [Type Safety] Functions without return type annotations


---


### TEAM MODULE (1 files)

#### 🟡 team-tab.tsx
**Overall Score:** 83.1/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/settings/team-tab.tsx`  
**Violations:** 11

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (7 instances) |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for team |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for team |
| 12. Type Safety | 80/100 | ⚠️ | 1 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Internationalization] Potential hardcoded JSX text (7 instances)
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Accessibility] Click handlers without keyboard support
6. [Realtime] No realtime subscriptions
7. [Edge Functions] No edge functions for team
8. [Authentication] No authentication integration
9. [API Routes] No API routes for team
10. [Type Safety] 1 'any' types found
11. [Type Safety] Functions without return type annotations


---


### TEMPLATES MODULE (1 files)

#### 🟡 templates-tab.tsx
**Overall Score:** 87.3/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/templates-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (9 instances) |
| 6. Accessibility | 85/100 | ⚠️ | Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for templates |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for templates |
| 12. Type Safety | 60/100 | ❌ | 1 'any' types found; Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Internationalization] Potential hardcoded JSX text (9 instances)
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Realtime] No realtime subscriptions
4. [Storage] File handling without storage integration
5. [Edge Functions] No edge functions for templates
6. [Authentication] No authentication integration
7. [API Routes] No API routes for templates
8. [Type Safety] 1 'any' types found
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### TRACKING MODULE (1 files)

#### 🟡 tracking-tab.tsx
**Overall Score:** 84.0/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/assets/tracking-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for tracking |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for tracking |
| 12. Type Safety | 60/100 | ❌ | 16 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Accessibility] Buttons may be missing aria-label
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for tracking
7. [Authentication] No authentication integration
8. [API Routes] No API routes for tracking
9. [Type Safety] 16 'any' types found
10. [Type Safety] Functions without return type annotations


---


### TRAVEL MODULE (1 files)

#### 🟡 travel-tab.tsx
**Overall Score:** 84.5/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/profile/travel-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 100/100 | ✅ | None |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 45/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 60/100 | ❌ | File handling without storage integration |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for travel |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for travel |
| 12. Type Safety | 70/100 | ⚠️ | Component without typed props; Functions without return type annotations |


**Action Items:**
1. [Accessibility] Buttons may be missing aria-label
2. [Accessibility] Limited semantic HTML/ARIA roles
3. [Accessibility] Click handlers without keyboard support
4. [Realtime] No realtime subscriptions
5. [Storage] File handling without storage integration
6. [Edge Functions] No edge functions for travel
7. [Authentication] No authentication integration
8. [API Routes] No API routes for travel
9. [Type Safety] Component without typed props
10. [Type Safety] Functions without return type annotations


---


### VENDORS MODULE (1 files)

#### 🟡 vendors-tab.tsx
**Overall Score:** 85.2/100 (B+)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/marketplace/vendors-tab.tsx`  
**Violations:** 10

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 85/100 | ⚠️ | No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 90/100 | ⚠️ | Potential hardcoded JSX text (6 instances) |
| 6. Accessibility | 65/100 | ❌ | Buttons may be missing aria-label; Limited semantic HTML/ARIA roles |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for vendors |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 85/100 | ✅ | No API routes for vendors |
| 12. Type Safety | 70/100 | ⚠️ | 2 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No error handling
2. [Internationalization] Potential hardcoded JSX text (6 instances)
3. [Accessibility] Buttons may be missing aria-label
4. [Accessibility] Limited semantic HTML/ARIA roles
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for vendors
7. [Authentication] No authentication integration
8. [API Routes] No API routes for vendors
9. [Type Safety] 2 'any' types found
10. [Type Safety] Functions without return type annotations


---


### WEBHOOKS MODULE (1 files)

#### 🟡 webhooks-tab.tsx
**Overall Score:** 84.2/100 (B)  
**File Path:** `/Users/julianclarkson/Documents/Dragonfly26.00/src/components/admin/webhooks-tab.tsx`  
**Violations:** 9

| Layer | Score | Status | Violations |
|-------|-------|--------|------------|
| 1. UI Components | 100/100 | ✅ | None |
| 2. Data Hooks | 70/100 | ⚠️ | No loading state; No error handling |
| 3. Database Schema | 100/100 | ✅ | None |
| 4. RLS Policies | 100/100 | ✅ | None |
| 5. Internationalization | 100/100 | ✅ | None |
| 6. Accessibility | 65/100 | ❌ | Limited semantic HTML/ARIA roles; Click handlers without keyboard support |
| 7. Realtime | 50/100 | ❌ | No realtime subscriptions |
| 8. Storage | 100/100 | ✅ | None |
| 9. Edge Functions | 80/100 | ✅ | No edge functions for webhooks |
| 10. Authentication | 60/100 | ❌ | No authentication integration |
| 11. API Routes | 100/100 | ✅ | None |
| 12. Type Safety | 60/100 | ❌ | 3 'any' types found; Functions without return type annotations |


**Action Items:**
1. [Data Hooks] No loading state
2. [Data Hooks] No error handling
3. [Accessibility] Limited semantic HTML/ARIA roles
4. [Accessibility] Click handlers without keyboard support
5. [Realtime] No realtime subscriptions
6. [Edge Functions] No edge functions for webhooks
7. [Authentication] No authentication integration
8. [Type Safety] 3 'any' types found
9. [Type Safety] Functions without return type annotations


---


---

## 🚨 PRIORITY REMEDIATION MATRIX

### Critical (Must Fix - Blocking Production)

1. **appearance-tab.tsx** - 68.8/100 (15 violations)
2. **automations-tab.tsx** - 69.1/100 (14 violations)
3. **plugins-tab.tsx** - 70.3/100 (12 violations)
4. **activity-tab.tsx** - 71.5/100 (13 violations)
5. **competitions-tab.tsx** - 72.0/100 (12 violations)
6. **resources-glossary-tab.tsx** - 72.0/100 (12 violations)
7. **resources-troubleshooting-tab.tsx** - 72.0/100 (12 violations)
8. **spotlight-tab.tsx** - 72.4/100 (12 violations)
9. **invite-tab.tsx** - 72.5/100 (13 violations)
10. **create-tab.tsx** - 73.3/100 (12 violations)
11. **resources-guides-tab.tsx** - 74.0/100 (11 violations)
12. **resources-publications-tab.tsx** - 74.0/100 (11 violations)
13. **analytics-custom-views-tab.tsx** - 74.2/100 (11 violations)
14. **purchases-tab.tsx** - 74.2/100 (11 violations)
15. **favorites-tab.tsx** - 74.5/100 (11 violations)
16. **events-run-of-show-tab.tsx** - 74.5/100 (11 violations)
17. **dashboard-my-files-tab.tsx** - 75.5/100 (10 violations)
18. **dashboard-my-jobs-tab.tsx** - 75.7/100 (10 violations)
19. **dashboard-my-reports-tab.tsx** - 75.7/100 (10 violations)
20. **custom-statuses-tab.tsx** - 75.8/100 (11 violations)
21. **files-all-documents-tab.tsx** - 75.9/100 (10 violations)
22. **files-call-sheets-tab.tsx** - 75.9/100 (10 violations)
23. **files-insurance-permits-tab.tsx** - 75.9/100 (10 violations)
24. **files-media-assets-tab.tsx** - 75.9/100 (10 violations)
25. **files-production-reports-tab.tsx** - 75.9/100 (10 violations)
26. **files-tech-specs-tab.tsx** - 75.9/100 (10 violations)
27. **showcase-tab.tsx** - 76.0/100 (12 violations)
28. **analytics-metrics-library-tab.tsx** - 76.2/100 (10 violations)
29. **dashboard-my-assets-tab.tsx** - 76.5/100 (10 violations)
30. **analytics-pivot-tables-tab.tsx** - 76.6/100 (9 violations)
31. **dashboard-my-advances-tab.tsx** - 76.7/100 (10 violations)
32. **jobs-pipeline-tab.tsx** - 77.5/100 (9 violations)
33. **locations-directory-tab.tsx** - 77.5/100 (9 violations)
34. **reports-custom-builder-tab.tsx** - 77.5/100 (9 violations)
35. **dashboard-my-orders-tab.tsx** - 77.7/100 (9 violations)
36. **procurement-orders-dashboard-tab.tsx** - 77.8/100 (9 violations)
37. **companies-companies-compliance-tab.tsx** - 77.9/100 (9 violations)
38. **companies-companies-invoices-tab.tsx** - 77.9/100 (9 violations)
39. **companies-companies-reviews-tab.tsx** - 77.9/100 (9 violations)
40. **companies-companies-work-orders-tab.tsx** - 77.9/100 (9 violations)
41. **companies-scopes-of-work-tab.tsx** - 77.9/100 (9 violations)
42. **events-all-events-tab.tsx** - 77.9/100 (9 violations)
43. **events-shipping-receiving-tab.tsx** - 77.9/100 (9 violations)
44. **events-trainings-tab.tsx** - 77.9/100 (9 violations)
45. **finance-accounts-tab.tsx** - 77.9/100 (9 violations)
46. **finance-taxes-tab.tsx** - 77.9/100 (9 violations)
47. **jobs-jobs-compliance-tab.tsx** - 77.9/100 (9 violations)
48. **jobs-jobs-invoices-tab.tsx** - 77.9/100 (9 violations)
49. **jobs-shortlists-tab.tsx** - 77.9/100 (9 violations)
50. **locations-spatial-features-tab.tsx** - 77.9/100 (9 violations)
51. **locations-warehousing-tab.tsx** - 77.9/100 (9 violations)
52. **projects-projects-checklists-tab.tsx** - 77.9/100 (9 violations)
53. **projects-projects-work-orders-tab.tsx** - 77.9/100 (9 violations)
54. **endorsements-tab.tsx** - 78.0/100 (11 violations)
55. **analytics-trends-tab.tsx** - 78.1/100 (8 violations)
56. **insights-progress-tracking-tab.tsx** - 78.1/100 (8 violations)
57. **analytics-comparisons-tab.tsx** - 78.3/100 (7 violations)
58. **dashboard-my-travel-tab.tsx** - 78.9/100 (9 violations)
59. **dashboard-my-agenda-tab.tsx** - 79.5/100 (8 violations)
60. **dashboard-my-expenses-tab.tsx** - 79.7/100 (7 violations)
61. **dashboard-my-tasks-tab.tsx** - 79.9/100 (8 violations)
62. **access-tab.tsx** - 80.0/100 (12 violations)

### High Priority (Should Fix - Quality Issues)

1. **news-tab.tsx** - 80.0/100 (10 violations)
2. **sales-tab.tsx** - 80.0/100 (10 violations)
3. **people-timekeeping-tab.tsx** - 80.1/100 (8 violations)
4. **procurement-fulfillment-tab.tsx** - 80.1/100 (8 violations)
5. **procurement-procurement-approvals-tab.tsx** - 80.1/100 (8 violations)
6. **integrations-tab.tsx** - 80.3/100 (11 violations)
7. **insights-success-metrics-tab.tsx** - 80.3/100 (7 violations)
8. **events-tours-tab.tsx** - 80.5/100 (10 violations)
9. **procurement-receiving-tab.tsx** - 80.8/100 (10 violations)
10. **services-tab.tsx** - 81.0/100 (12 violations)
11. **recurrence-rules-tab.tsx** - 81.1/100 (12 violations)
12. **reports-exports-tab.tsx** - 81.9/100 (9 violations)
13. **events-tab.tsx** - 82.0/100 (11 violations)
14. **studios-tab.tsx** - 82.0/100 (11 violations)
15. **products-tab.tsx** - 82.0/100 (11 violations)
16. **resources-library-tab.tsx** - 82.4/100 (9 violations)
17. **roles-permissions-tab.tsx** - 82.8/100 (11 violations)
18. **members-management-tab.tsx** - 83.1/100 (11 violations)
19. **team-tab.tsx** - 83.1/100 (11 violations)
20. **reports-executive-tab.tsx** - 83.7/100 (8 violations)

### Medium Priority (Nice to Fix - Enhancement)

29 files in this category

---

## 📈 LAYER-SPECIFIC REMEDIATION

### Layer 2: Data Hooks (86.6/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 168

**Top Files Needing Work:**
1. api-tokens-tab.tsx - No loading state, No error handling
2. automations-tab.tsx - No loading state, No error handling
3. billing-tab.tsx - No error handling
4. members-management-tab.tsx - No loading state, No error handling
5. plugins-tab.tsx - No loading state, No error handling
6. recurrence-rules-tab.tsx - No loading state, No error handling
7. roles-permissions-tab.tsx - No loading state, No error handling
8. security-tab.tsx - No loading state, No error handling
9. webhooks-tab.tsx - No loading state, No error handling
10. analytics-comparisons-tab.tsx - No error handling

---

### Layer 3: Database Schema (86.2/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 61

**Top Files Needing Work:**
1. automations-tab.tsx - No database tables found for automations
2. custom-statuses-tab.tsx - No database tables found for statuses
3. plugins-tab.tsx - No database tables found for plugins
4. analytics-comparisons-tab.tsx - No database tables found for comparisons
5. analytics-custom-views-tab.tsx - No database tables found for custom-views
6. analytics-metrics-library-tab.tsx - No database tables found for metrics-library
7. analytics-pivot-tables-tab.tsx - No database tables found for pivot-tables
8. analytics-trends-tab.tsx - No database tables found for trends
9. competitions-tab.tsx - No database tables found for competitions
10. companies-companies-compliance-tab.tsx - No database tables found for companies-compliance

---

### Layer 4: RLS Policies (79.9/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 74

**Top Files Needing Work:**
1. automations-tab.tsx - No RLS policies found for automations
2. custom-statuses-tab.tsx - No RLS policies found for statuses
3. plugins-tab.tsx - No RLS policies found for plugins
4. analytics-comparisons-tab.tsx - No RLS policies found for comparisons
5. analytics-custom-views-tab.tsx - No RLS policies found for custom-views
6. analytics-metrics-library-tab.tsx - No RLS policies found for metrics-library
7. analytics-pivot-tables-tab.tsx - No RLS policies found for pivot-tables
8. analytics-trends-tab.tsx - No RLS policies found for trends
9. competitions-tab.tsx - No RLS policies found for competitions
10. news-tab.tsx - No RLS policies found for news

---

### Layer 6: Accessibility (85.2/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 102

**Top Files Needing Work:**
1. admin-overview-tab.tsx - Limited semantic HTML/ARIA roles
2. api-tokens-tab.tsx - Limited semantic HTML/ARIA roles, Click handlers without keyboard support
3. automations-tab.tsx - Limited semantic HTML/ARIA roles
4. billing-tab.tsx - Limited semantic HTML/ARIA roles
5. checklist-templates-tab.tsx - Limited semantic HTML/ARIA roles, Click handlers without keyboard support
6. custom-statuses-tab.tsx - Limited semantic HTML/ARIA roles, Click handlers without keyboard support
7. integrations-tab.tsx - Limited semantic HTML/ARIA roles
8. invite-tab.tsx - Limited semantic HTML/ARIA roles
9. members-management-tab.tsx - Limited semantic HTML/ARIA roles, Click handlers without keyboard support
10. organization-settings-tab.tsx - Limited semantic HTML/ARIA roles, Click handlers without keyboard support

---

### Layer 7: Realtime (50.0/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 221

**Top Files Needing Work:**
1. admin-overview-tab.tsx - No realtime subscriptions
2. api-tokens-tab.tsx - No realtime subscriptions
3. automations-tab.tsx - No realtime subscriptions
4. billing-tab.tsx - No realtime subscriptions
5. checklist-templates-tab.tsx - No realtime subscriptions
6. custom-statuses-tab.tsx - No realtime subscriptions
7. integrations-tab.tsx - No realtime subscriptions
8. invite-tab.tsx - No realtime subscriptions
9. members-management-tab.tsx - No realtime subscriptions
10. organization-settings-tab.tsx - No realtime subscriptions

---

### Layer 8: Storage (91.1/100)

**Status:** ⚠️ Needs Minor Fixes  
**Files Affected:** 49

**Top Files Needing Work:**
1. organization-tab.tsx - File handling without storage integration
2. templates-tab.tsx - File handling without storage integration
3. counts-tab.tsx - File handling without storage integration
4. inventory-tab.tsx - File handling without storage integration
5. activity-tab.tsx - File handling without storage integration
6. competitions-tab.tsx - File handling without storage integration
7. connections-tab.tsx - File handling without storage integration
8. events-tab.tsx - File handling without storage integration
9. news-tab.tsx - File handling without storage integration
10. showcase-tab.tsx - File handling without storage integration

---

### Layer 9: Edge Functions (81.2/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 208

**Top Files Needing Work:**
1. api-tokens-tab.tsx - No edge functions for tokens
2. automations-tab.tsx - No edge functions for automations
3. billing-tab.tsx - No edge functions for billing
4. checklist-templates-tab.tsx - No edge functions for templates
5. custom-statuses-tab.tsx - No edge functions for statuses
6. integrations-tab.tsx - No edge functions for integrations
7. invite-tab.tsx - No edge functions for invite
8. members-management-tab.tsx - No edge functions for management
9. organization-settings-tab.tsx - No edge functions for settings
10. organization-tab.tsx - No edge functions for organization

---

### Layer 10: Authentication (64.9/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 194

**Top Files Needing Work:**
1. api-tokens-tab.tsx - No authentication integration
2. automations-tab.tsx - No authentication integration
3. billing-tab.tsx - No authentication integration
4. custom-statuses-tab.tsx - No authentication integration
5. integrations-tab.tsx - No authentication integration
6. invite-tab.tsx - No authentication integration
7. members-management-tab.tsx - No authentication integration
8. organization-tab.tsx - No authentication integration
9. plugins-tab.tsx - No authentication integration
10. recurrence-rules-tab.tsx - No authentication integration

---

### Layer 11: API Routes (85.8/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 209

**Top Files Needing Work:**
1. api-tokens-tab.tsx - No API routes for tokens
2. automations-tab.tsx - No API routes for automations
3. billing-tab.tsx - No API routes for billing
4. checklist-templates-tab.tsx - No API routes for templates
5. custom-statuses-tab.tsx - No API routes for statuses
6. integrations-tab.tsx - No API routes for integrations
7. invite-tab.tsx - No API routes for invite
8. members-management-tab.tsx - No API routes for management
9. organization-settings-tab.tsx - No API routes for settings
10. organization-tab.tsx - No API routes for organization

---

### Layer 12: Type Safety (72.3/100)

**Status:** ❌ Needs Major Fixes  
**Files Affected:** 220

**Top Files Needing Work:**
1. admin-overview-tab.tsx - 3 'any' types found, Component without typed props, Functions without return type annotations
2. api-tokens-tab.tsx - 1 'any' types found, Functions without return type annotations
3. automations-tab.tsx - 1 'any' types found, Component without typed props, Functions without return type annotations
4. billing-tab.tsx - Component without typed props, Functions without return type annotations
5. checklist-templates-tab.tsx - 5 'any' types found, Component without typed props, Functions without return type annotations
6. custom-statuses-tab.tsx - 3 'any' types found, Component without typed props, Functions without return type annotations
7. integrations-tab.tsx - 1 'any' types found, Component without typed props, Functions without return type annotations
8. invite-tab.tsx - 4 'any' types found, Functions without return type annotations
9. members-management-tab.tsx - 1 'any' types found, Functions without return type annotations
10. organization-settings-tab.tsx - 2 'any' types found, Component without typed props, Functions without return type annotations


---

## 🎯 COMPLETION TARGETS

### Phase 1: Critical Fixes (Week 1-2)
- [ ] Fix all files scoring < 80/100
- [ ] Address all Layer 5 (i18n) violations
- [ ] Fix all Layer 1 (UI) critical issues

### Phase 2: Quality Improvements (Week 3-4)
- [ ] Bring all files to ≥85/100
- [ ] Address all Layer 2 (Data Hooks) issues
- [ ] Fix all Layer 6 (Accessibility) violations

### Phase 3: Enhancement (Week 5-6)
- [ ] Bring all files to ≥90/100
- [ ] Address Layer 7 (Realtime) gaps
- [ ] Fix Layer 10 (Auth) integration issues

### Phase 4: Excellence (Week 7-8)
- [ ] Achieve ≥95/100 on all files
- [ ] Zero violations across all layers
- [ ] Production certification

---

## 🏆 CERTIFICATION CRITERIA

For **A+ (100% Production Ready)** certification, the application must achieve:

- ✅ All 221 files scoring ≥95/100
- ✅ Zero critical violations
- ✅ Layer 1-6 at 100%
- ✅ Layer 7-12 at ≥90%
- ✅ Full i18n coverage (Layer 5: 100%)
- ✅ Full accessibility compliance (Layer 6: 100%)
- ✅ Complete Supabase integration (Layers 2-4: 100%)
- ✅ Type safety throughout (Layer 12: ≥95%)

**Current Status:** ⚠️ IN PROGRESS

---

## 📊 PROGRESS TRACKING

| Milestone | Target | Current | Status |
|-----------|--------|---------|--------|
| Files ≥95% | 221 | 0 | ⏳ |
| Files ≥90% | 221 | 158 | ⏳ |
| Files ≥80% | 221 | 158 | ⏳ |
| Zero Violations | 0 | 1850 | ⏳ |

---

**Last Updated:** 2025-10-20T12:38:45.150Z  
**Next Audit:** Scheduled after Phase 1 completion  
**Maintained By:** Dragonfly26.00 Development Team
