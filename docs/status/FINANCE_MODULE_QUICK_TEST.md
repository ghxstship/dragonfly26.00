# Finance Module Quick Test Guide

## Test All 13 Tabs

Navigate to your workspace Finance module and test each tab:

### Base URL
```
http://localhost:3000/[locale]/(dashboard)/workspace/[workspaceId]/finance/[tab]
```

### Tab URLs to Test

1. **Overview** - `/finance/overview`
   - ✅ Should show custom dashboard with metrics
   - ✅ No database dependency (static UI)

2. **Forecasting** - `/finance/forecasting`
   - ✅ Should load budgets table data
   - ✅ Shows production relationships

3. **Budgets** - `/finance/budgets`
   - ✅ Should load budgets table data
   - ✅ Financial view with CRUD

4. **Transactions** - `/finance/transactions`
   - ✅ Should load financial_transactions table
   - ✅ Shows budget, production, company relationships

5. **Revenue** - `/finance/revenue`
   - ✅ Should load financial_transactions (income)
   - ✅ Same relationships as transactions

6. **Expenses** - `/finance/expenses`
   - ✅ Should load financial_transactions (expense)
   - ✅ Same relationships as transactions

7. **Payroll** - `/finance/payroll`
   - ✅ Should load payroll table
   - ✅ Shows production and processor relationships

8. **Reconciliation** - `/finance/reconciliation`
   - ✅ Should load reconciliations table (FIXED!)
   - ✅ Shows production, event, and user relationships

9. **Payments** - `/finance/payments`
   - ✅ Should load financial_transactions (payments)
   - ✅ Same relationships as transactions

10. **Invoices** - `/finance/invoices`
    - ✅ Should load invoices table
    - ✅ Shows company, production, creator relationships

11. **Taxes** - `/finance/taxes`
    - ✅ Should load financial_transactions (tax-related)
    - ✅ Same relationships as transactions

12. **Accounts** - `/finance/accounts`
    - ✅ Should load gl_codes table
    - ✅ Sorted by code

13. **GL Codes** - `/finance/gl-codes`
    - ✅ Should load gl_codes table
    - ✅ Same as Accounts tab

## Expected Behavior

### All Tabs Should:
- ✅ Load without "Error Loading Data"
- ✅ Show real-time indicator (except Overview)
- ✅ Display "0 items" if tables are empty
- ✅ Allow creating new items (except Overview)
- ✅ Support view switching (except Overview)
- ✅ Have working search and filters

### Overview Tab Specifically:
- ✅ Custom dashboard layout
- ✅ Financial metrics cards
- ✅ Budget status section
- ✅ Recent transactions section
- ✅ Status alert box

## Quick Verification

Run this in browser console on any Finance tab:
```javascript
// Should return the table name for current tab
console.log(window.location.pathname.split('/').pop())
```

## If You See Errors

Check browser console for:
1. Database connection errors
2. Foreign key syntax errors
3. Table not found errors
4. Permission/RLS errors

## Success Criteria
- ✅ All 13 tabs load successfully
- ✅ No red "Error Loading Data" messages
- ✅ Real-time data updates work
- ✅ Can navigate between all tabs smoothly
