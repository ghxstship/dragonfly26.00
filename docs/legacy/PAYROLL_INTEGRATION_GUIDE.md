# Payroll Integration Guide

## Overview

The People module now includes comprehensive payroll export functionality to integrate with external payroll providers. **We do NOT process payroll internally** - instead, we aggregate timesheet data and export it in formats compatible with all major payroll providers.

## Supported Payroll Providers

### Direct Support (Pre-configured Field Mappings)
- **Gusto** - Popular for small/mid-sized businesses
- **ADP** - Enterprise payroll processing
- **Paychex** - Full-service payroll
- **QuickBooks Payroll** - Accounting integration
- **Rippling** - All-in-one platform
- **Justworks** - PEO services
- **OnPay** - Small business payroll
- **Patriot Payroll** - Affordable option

### Universal Support
Any payroll provider that accepts CSV, Excel, JSON, or XML imports is supported through custom field mapping.

## How It Works

### 1. Configuration

Set up your payroll provider integration:

```sql
INSERT INTO payroll_export_configs (
    workspace_id,
    provider_name,
    export_format,
    field_mappings,
    include_fields,
    delimiter,
    date_format
) VALUES (
    'workspace-uuid',
    'gusto',
    'csv',
    '{
        "employee_id": "Employee ID",
        "first_name": "First Name",
        "last_name": "Last Name",
        "regular_hours": "Regular Hours",
        "overtime_hours": "Overtime Hours",
        "gross_pay": "Gross Pay"
    }'::jsonb,
    ARRAY['employee_id', 'first_name', 'last_name', 'regular_hours', 'overtime_hours', 'gross_pay'],
    ',',
    'YYYY-MM-DD'
);
```

### 2. Payroll Period Creation

Create a payroll period:

```sql
INSERT INTO payroll_periods (
    workspace_id,
    name,
    period_start,
    period_end,
    pay_date,
    frequency,
    status
) VALUES (
    'workspace-uuid',
    'January 2024 - Period 1',
    '2024-01-01',
    '2024-01-15',
    '2024-01-20',
    'biweekly',
    'open'
);
```

### 3. Time Entry Approval

All time entries must be approved before export:

```sql
UPDATE time_entries
SET approval_status = 'approved',
    approved_by = auth.uid(),
    approved_at = NOW()
WHERE workspace_id = 'workspace-uuid'
    AND start_time::DATE BETWEEN '2024-01-01' AND '2024-01-15'
    AND approval_status = 'pending';
```

### 4. Payroll Entry Aggregation

The system automatically aggregates approved time entries into payroll entries:

```sql
-- This would typically be done via a function or application logic
INSERT INTO payroll_entries (
    workspace_id,
    payroll_period_id,
    personnel_id,
    regular_hours,
    overtime_hours,
    pto_hours,
    regular_rate,
    overtime_rate,
    gross_pay
)
SELECT 
    te.workspace_id,
    pp.id as payroll_period_id,
    te.personnel_id,
    SUM(CASE WHEN NOT te.is_overtime THEN EXTRACT(EPOCH FROM te.duration) / 3600 ELSE 0 END) as regular_hours,
    SUM(CASE WHEN te.is_overtime THEN EXTRACT(EPOCH FROM te.duration) / 3600 ELSE 0 END) as overtime_hours,
    0 as pto_hours, -- Calculate from PTO requests
    p.salary_amount as regular_rate,
    p.salary_amount * 1.5 as overtime_rate,
    SUM(te.gross_pay) as gross_pay
FROM time_entries te
JOIN payroll_periods pp ON te.workspace_id = pp.workspace_id
JOIN personnel p ON te.personnel_id = p.id
WHERE te.approval_status = 'approved'
    AND te.start_time::DATE BETWEEN pp.period_start AND pp.period_end
GROUP BY te.workspace_id, pp.id, te.personnel_id, p.salary_amount
ON CONFLICT (payroll_period_id, personnel_id) DO UPDATE
SET regular_hours = EXCLUDED.regular_hours,
    overtime_hours = EXCLUDED.overtime_hours,
    gross_pay = EXCLUDED.gross_pay;
```

### 5. Export

Export the payroll data in the configured format:

```sql
-- Lock the period
UPDATE payroll_periods
SET status = 'locked'
WHERE id = 'period-uuid';

-- Generate export (application logic would create the actual file)
SELECT 
    p.employee_id as "Employee ID",
    p.first_name as "First Name",
    p.last_name as "Last Name",
    pe.regular_hours as "Regular Hours",
    pe.overtime_hours as "Overtime Hours",
    pe.gross_pay as "Gross Pay",
    pe.bonuses as "Bonuses",
    pe.deductions as "Deductions"
FROM payroll_entries pe
JOIN personnel p ON pe.personnel_id = p.id
WHERE pe.payroll_period_id = 'period-uuid'
ORDER BY p.last_name, p.first_name;

-- Mark as exported
UPDATE payroll_periods
SET status = 'completed',
    exported_at = NOW(),
    exported_by = auth.uid(),
    export_file_url = 'storage/exports/payroll_2024_01_period1.csv'
WHERE id = 'period-uuid';
```

## Export Formats

### CSV Format

**Example Output:**
```csv
Employee ID,First Name,Last Name,Regular Hours,Overtime Hours,Gross Pay
E001,John,Doe,80.00,5.00,2125.00
E002,Jane,Smith,75.50,0.00,1887.50
E003,Bob,Johnson,80.00,12.50,2437.50
```

**Configuration Options:**
- Delimiter: `,` (comma), `|` (pipe), `;` (semicolon), `\t` (tab)
- Date format: `YYYY-MM-DD`, `MM/DD/YYYY`, `DD-MM-YYYY`
- Time format: `HH24:MI`, `HH12:MI AM`
- Header row: Yes/No
- Quote character: `"` or `'`

### Excel Format

Generates `.xlsx` file with:
- Header row with styled columns
- Number formatting for hours and currency
- Data validation
- Freeze panes
- Auto-fit columns

### JSON Format

```json
{
  "period": {
    "name": "January 2024 - Period 1",
    "start_date": "2024-01-01",
    "end_date": "2024-01-15",
    "pay_date": "2024-01-20"
  },
  "employees": [
    {
      "employee_id": "E001",
      "name": {
        "first": "John",
        "last": "Doe"
      },
      "hours": {
        "regular": 80.00,
        "overtime": 5.00,
        "pto": 0.00
      },
      "pay": {
        "gross": 2125.00,
        "bonuses": 0.00,
        "deductions": 0.00
      }
    }
  ]
}
```

### XML Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<PayrollExport>
  <Period>
    <Name>January 2024 - Period 1</Name>
    <StartDate>2024-01-01</StartDate>
    <EndDate>2024-01-15</EndDate>
    <PayDate>2024-01-20</PayDate>
  </Period>
  <Employees>
    <Employee>
      <EmployeeID>E001</EmployeeID>
      <FirstName>John</FirstName>
      <LastName>Doe</LastName>
      <RegularHours>80.00</RegularHours>
      <OvertimeHours>5.00</OvertimeHours>
      <GrossPay>2125.00</GrossPay>
    </Employee>
  </Employees>
</PayrollExport>
```

## Provider-Specific Field Mappings

### Gusto

```json
{
  "employee_id": "Employee ID",
  "first_name": "First Name",
  "last_name": "Last Name",
  "regular_hours": "Hours",
  "overtime_hours": "Overtime Hours",
  "pto_hours": "PTO Hours",
  "sick_hours": "Sick Hours",
  "bonuses": "Bonus",
  "reimbursements": "Reimbursement"
}
```

### ADP

```json
{
  "employee_id": "File #",
  "regular_hours": "Reg Hours",
  "overtime_hours": "OT Hours",
  "double_time_hours": "DT Hours",
  "gross_pay": "Total Pay"
}
```

### QuickBooks Payroll

```json
{
  "first_name": "First Name",
  "last_name": "Last Name",
  "employee_id": "Employee ID",
  "regular_hours": "Regular Pay Hours",
  "overtime_hours": "Overtime Hours",
  "sick_hours": "Sick Hours",
  "pto_hours": "Vacation Hours"
}
```

## Data Included in Export

### Standard Fields
- Employee ID
- First Name
- Last Name
- Email
- Department

### Hours Breakdown
- Regular hours
- Overtime hours (1.5x)
- Double-time hours (2x)
- PTO hours
- Sick hours
- Holiday hours

### Pay Information
- Regular rate
- Overtime rate
- Gross pay
- Bonuses
- Commissions
- Reimbursements
- Deductions

### Additional Data (Optional)
- Tax withholding info
- Benefits deductions
- Garnishments
- Direct deposit information

## Security & Compliance

### Data Protection
- All sensitive data encrypted at rest
- API keys stored encrypted
- Export files stored securely with expiring URLs
- Audit log of all exports

### Access Control
- Only authorized users can initiate exports
- Role-based permissions
- Multi-factor authentication recommended

### Compliance
- SOC 2 compliant storage
- GDPR data handling
- Retention policies configurable
- Right to deletion supported

## Troubleshooting

### Common Issues

**Issue:** Export file has incorrect format
- **Solution:** Verify field mappings in `payroll_export_configs`
- Check delimiter and date format settings

**Issue:** Missing employees in export
- **Solution:** Ensure employees have `employment_status = 'active'`
- Verify they have approved time entries in the period

**Issue:** Hours don't match expectations
- **Solution:** Check time entry approval status
- Verify break time calculations
- Review overtime rules

**Issue:** Payroll provider rejects import
- **Solution:** Validate field names match exactly
- Check data types (numbers vs strings)
- Verify date formats

### Validation Checklist

Before exporting:
- [ ] All time entries approved
- [ ] Payroll period dates correct
- [ ] Employee information up to date
- [ ] Field mappings verified
- [ ] Test export with sample data
- [ ] Backup created

## API Integration (Future)

Coming soon - Direct API integration with payroll providers:

```typescript
// Example API integration
async function exportToGusto(payrollPeriodId: string) {
  const config = await getPayrollConfig('gusto')
  const entries = await getPayrollEntries(payrollPeriodId)
  
  const response = await fetch('https://api.gusto.com/v1/companies/{id}/payrolls', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pay_period: {
        start_date: entries.period_start,
        end_date: entries.period_end
      },
      employee_compensations: entries.employees.map(e => ({
        employee_id: e.employee_id,
        hours: e.regular_hours,
        overtime_hours: e.overtime_hours
      }))
    })
  })
  
  return response.json()
}
```

## Best Practices

1. **Test First**: Always test exports with sample data before production use
2. **Lock Periods**: Lock payroll periods before exporting to prevent changes
3. **Audit Trail**: Keep records of all exports for compliance
4. **Reconciliation**: Compare exported totals with expected values
5. **Backup**: Maintain backups before and after each export
6. **Schedule**: Export at consistent times to avoid confusion
7. **Verify**: Have a second person review export data
8. **Document**: Keep notes on any manual adjustments made

## Support

For payroll integration assistance:
1. Check provider documentation for import format requirements
2. Test with small sample data first
3. Verify field mappings match provider expectations
4. Contact provider support if imports fail
5. Review audit logs for troubleshooting

The system is designed to be flexible and work with any payroll provider that accepts standard data formats.
