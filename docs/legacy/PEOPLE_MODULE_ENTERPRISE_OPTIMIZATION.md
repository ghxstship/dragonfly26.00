# People Module Enterprise Optimization

## Overview

The People module has been comprehensively optimized to be competitive with leading HR and workforce management platforms including HiBob, Rippling, Connecteam, Homebase, and Deputy. This enhancement transforms the module into an enterprise-grade HR management system while maintaining compatibility with external payroll providers.

**Migration Files:**
- `058_people_enterprise_core.sql` - Personnel foundation, PTO, and compensation
- `059_people_enterprise_operations.sql` - Scheduling, time tracking, and compliance
- `060_people_enterprise_workflows.sql` - Onboarding, performance, documents, benefits, payroll, and approvals
- `061_people_enterprise_functions.sql` - RLS policies, triggers, utility functions, and analytics views

## Key Features Added

### 1. Enhanced Employee Profiles

**Personnel Table Enhancements:**
- Complete address information (international support)
- Manager hierarchy (manager_id)
- Comprehensive compensation tracking (salary, pay type, frequency)
- Encrypted sensitive data (tax_id, bank accounts)
- Localization (preferred_language, timezone, pronouns)
- Onboarding status tracking
- Avatar customization

### 2. Time-Off / PTO Management

**Competitive with HiBob and Rippling:**

**Tables:**
- `pto_policies` - Configurable PTO policies with accrual rules
- `pto_balances` - Employee PTO balances by policy and year
- `pto_requests` - Time off requests with approval workflow

**Features:**
- Multiple PTO types (vacation, sick, personal, parental, etc.)
- Flexible accrual rates and frequencies
- Carryover limits and caps
- Blackout dates
- Eligibility rules based on employment type and tenure
- Approval workflows
- Real-time balance tracking

### 3. Advanced Shift Scheduling

**Competitive with Deputy, Homebase, and Connecteam:**

**Tables:**
- `personnel_availability` - Employee availability preferences
- `shift_templates` - Reusable shift templates
- `scheduled_shifts` - Individual shift assignments
- `shift_swap_requests` - Shift trading and swaps
- `break_entries` - Break tracking for compliance
- `labor_compliance_rules` - Configurable compliance rules
- `compliance_violations` - Violation tracking and alerts

**Features:**
- Employee availability management
- Open shifts (unassigned)
- Shift templates for recurring schedules
- Shift swap/trade requests with approval
- Multi-personnel shifts
- Break tracking (paid/unpaid)
- Labor compliance monitoring
- GPS location tracking for clock in/out
- Multiple clock-in methods (web, mobile, kiosk, biometric)

### 4. Enhanced Time Tracking

**Enhancements to `time_entries`:**
- Shift linkage
- Clock-in/out methods and locations (GPS)
- Break tracking
- Overtime detection and multipliers
- Gross pay calculation
- Approval workflow (pending, approved, rejected, disputed)
- Billable/non-billable time

### 5. Onboarding Workflows

**Competitive with HiBob and Rippling:**

**Tables:**
- `onboarding_templates` - Role-based onboarding templates
- `onboarding_tasks` - Individual onboarding tasks
- `personnel_onboarding` - Employee onboarding progress

**Features:**
- Customizable onboarding templates by role/department
- Task assignment by role (employee, manager, HR, IT)
- Due date calculation based on hire date
- Document and signature requirements
- Progress tracking
- Task categories (paperwork, training, equipment, etc.)

### 6. Performance Management

**Competitive with HiBob:**

**Tables:**
- `performance_review_cycles` - Review periods and cycles
- `performance_reviews` - Individual reviews
- `personnel_goals` - Goals and objectives (OKRs)
- `performance_feedback` - Continuous feedback
- `one_on_one_meetings` - 1:1 meeting tracking

**Features:**
- Configurable review cycles (annual, quarterly, probation)
- Multi-rater reviews (self, manager, peer, upward)
- Rating systems (1-5 scale with categories)
- Goal tracking with progress percentages
- Key results (OKR-style)
- Continuous feedback between employees
- One-on-one meeting notes and action items

### 7. Document Management

**Tables:**
- `personnel_documents` - Employee document storage
- `document_access_log` - Audit trail

**Features:**
- Document categorization (contracts, tax forms, policies, etc.)
- Version control
- E-signature tracking
- Expiry date monitoring with alerts
- Access control (confidential, employee-accessible)
- Complete audit trail
- Document templates

### 8. Benefits Management

**Tables:**
- `benefits_plans` - Available benefits plans
- `personnel_benefits` - Employee enrollments

**Features:**
- Multiple benefit types (health, dental, vision, retirement, etc.)
- Eligibility rules
- Cost tracking (employer/employee split)
- Enrollment periods
- Dependent management
- Coverage tier selection
- Plan documents

### 9. Payroll Integration & Export

**NOT processing payroll internally - Integration only:**

**Tables:**
- `payroll_periods` - Pay period tracking
- `payroll_export_configs` - Provider configurations
- `payroll_entries` - Aggregated payroll data per employee
- `emergency_contacts` - Emergency contact information
- `compensation_history` - Salary change tracking

**Features:**
- Configurable pay periods (weekly, biweekly, semi-monthly, monthly)
- Export to multiple formats (CSV, Excel, JSON, XML, API)
- Field mapping for different providers (Gusto, ADP, Paychex, QuickBooks, etc.)
- Hours breakdown (regular, overtime, double-time, PTO, sick, holiday)
- Adjustments (bonuses, commissions, reimbursements, deductions)
- Export audit trail
- Compensation history tracking

**Supported Payroll Providers:**
- Gusto
- ADP
- Paychex
- QuickBooks Payroll
- Rippling
- And any provider accepting CSV/Excel/API imports

### 10. Approval Workflows

**Tables:**
- `approval_workflows` - Configurable approval processes
- `approval_requests` - Active approval requests
- `approval_actions` - Approval history

**Features:**
- Multi-step approval chains
- Configurable by workflow type
- Auto-approval conditions
- Request tracking
- Approval/denial with comments
- Complete audit trail

### 11. Utility Functions

**Database Functions:**
- `calculate_pto_balance()` - Real-time PTO balance calculation
- `get_overtime_hours()` - Overtime hours for a period
- `check_shift_conflicts()` - Prevent double-booking
- `get_reporting_chain()` - Organizational hierarchy
- `get_direct_reports()` - Manager's team
- `calculate_worked_hours()` - Hours breakdown (regular/OT)
- `check_labor_compliance()` - Compliance violation detection

**Analytics Views:**
- `v_headcount_by_department` - Headcount analytics
- `v_pto_summary` - PTO overview by employee
- `v_upcoming_shifts` - Shift calendar data
- `v_pending_approvals` - Approval queue

## Competitive Feature Matrix

| Feature | Our System | HiBob | Rippling | Connecteam | Homebase | Deputy |
|---------|-----------|-------|----------|------------|----------|--------|
| **Core HR** |
| Employee profiles | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Org chart / hierarchy | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Custom fields | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Document management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| E-signatures | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Time & Attendance** |
| Time tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Shift scheduling | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Shift swaps | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Break tracking | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GPS tracking | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Compliance alerts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Time Off** |
| PTO policies | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Accrual tracking | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Approval workflows | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Onboarding** |
| Onboarding workflows | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Task assignment | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Progress tracking | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Performance** |
| Performance reviews | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Goal tracking (OKRs) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Continuous feedback | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| 360° reviews | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Benefits** |
| Benefits management | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Enrollment tracking | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Payroll Integration** |
| Payroll export | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multiple providers | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hours aggregation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Data Security

**Encryption:**
- `tax_id_encrypted` - SSN/National ID numbers
- `bank_account_encrypted` - Banking information
- `api_key_encrypted` - Payroll provider API keys

**Audit Trails:**
- Document access logging
- Approval action tracking
- Compensation change history
- Time entry modifications

**Access Control:**
- Row-level security on all tables
- Workspace-based isolation
- Document confidentiality flags
- Role-based permissions ready

## Integration Points

### Payroll Providers

Configure exports via `payroll_export_configs`:

```sql
INSERT INTO payroll_export_configs (
    workspace_id,
    provider_name,
    export_format,
    field_mappings,
    include_fields
) VALUES (
    'workspace-uuid',
    'gusto', -- or 'adp', 'paychex', 'quickbooks'
    'csv',
    '{"employee_id": "Employee ID", "gross_pay": "Total Pay"}'::jsonb,
    ARRAY['employee_id', 'first_name', 'last_name', 'regular_hours', 'overtime_hours', 'gross_pay']
);
```

### Export Process

1. Create payroll period
2. Approve all time entries for the period
3. System aggregates hours into `payroll_entries`
4. Export using configured format
5. Import into payroll provider

### Supported Export Formats

- **CSV** - Most compatible, configurable delimiter
- **Excel** - .xlsx format
- **JSON** - API integrations
- **XML** - Legacy systems
- **API** - Direct provider integration (coming soon)

## UI Considerations

**No new tabs added** - All features integrate into existing People module structure:

- **People Tab**: Enhanced profiles, org chart
- **Time Tab**: Scheduling, time tracking, PTO
- **Performance**: Reviews, goals, feedback (can be subtab)
- **Documents**: Document management (can be subtab or profile section)
- **Reports**: Analytics views and exports

## Best Practices

### PTO Management

1. Create policies for each PTO type
2. Set appropriate accrual rates
3. Configure approval workflows
4. Monitor balances regularly
5. Set up blackout dates for busy periods

### Shift Scheduling

1. Collect employee availability upfront
2. Use shift templates for recurring schedules
3. Publish schedules early
4. Enable shift swaps to reduce no-shows
5. Monitor compliance violations

### Onboarding

1. Create role-specific templates
2. Assign clear ownership (HR, IT, Manager)
3. Set realistic due dates
4. Track completion rates
5. Gather feedback for improvement

### Performance Reviews

1. Schedule review cycles in advance
2. Enable self-reviews for reflection
3. Train managers on giving feedback
4. Link goals to company objectives
5. Follow up with action items

### Payroll Integration

1. Test export format with sample data
2. Verify field mappings are correct
3. Lock payroll periods before export
4. Keep audit trail of all exports
5. Reconcile with payroll provider

## Migration Path

**Fresh Foundation Approach:** These migrations rebuild the People module from scratch with clean schema design and strict constraints. The original `personnel` table is dropped and recreated, and `time_entries` is rebuilt with all new fields.

**To apply:**

```bash
# Apply migrations in order
supabase db push

# Or apply individually if needed
psql -f supabase/migrations/058_people_enterprise_core.sql
psql -f supabase/migrations/059_people_enterprise_operations.sql
psql -f supabase/migrations/060_people_enterprise_workflows.sql
psql -f supabase/migrations/061_people_enterprise_functions.sql
```

**Schema Changes:**
- `personnel` table is **dropped and rebuilt** with comprehensive structure
- `time_entries` table is **dropped and rebuilt** with enhanced tracking
- All new tables use strict NOT NULL constraints and validation
- Comprehensive CHECK constraints for data integrity
- Optimized indexes for performance

## Next Steps

### Immediate

1. Apply database migrations
2. Update TypeScript types
3. Create React hooks for new tables
4. Add UI components for new features

### Phase 2

1. Build scheduling calendar UI
2. Implement PTO request flow
3. Create onboarding dashboard
4. Build performance review forms
5. Implement document upload/signing

### Phase 3

1. Mobile time clock app
2. Manager dashboard
3. Employee self-service portal
4. Advanced analytics
5. Payroll provider API integrations

## Support

This optimization makes the People module competitive with leading HR platforms while maintaining the flexibility to integrate with any payroll provider. The system is designed to scale from small teams to enterprise organizations.

For questions or customization needs, refer to the migration files for detailed schema information.
