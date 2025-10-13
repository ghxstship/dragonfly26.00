import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

// Helper to generate random monetary amounts
const randomAmount = (min: number, max: number) => {
  return (Math.random() * (max - min) + min).toFixed(2)
}

export function generateFinanceMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'forecasting':
      return generateForecastingData(count)
    case 'budgets':
      return generateBudgetsData(count)
    case 'transactions':
      return generateTransactionsData(count)
    case 'revenue':
      return generateRevenueData(count)
    case 'expenses':
      return generateExpensesData(count)
    case 'payroll':
      return generatePayrollData(count)
    case 'reconciliation':
      return generateReconciliationData(count)
    case 'payments':
      return generatePaymentsData(count)
    case 'invoices':
      return generateInvoicesData(count)
    case 'taxes':
      return generateTaxesData(count)
    case 'accounts':
      return generateAccountsData(count)
    case 'gl-codes':
      return generateGLCodesData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const metrics = [
    "Total Revenue YTD",
    "Total Expenses YTD",
    "Net Profit Margin",
    "Outstanding Invoices",
    "Pending Payments",
    "Budget Utilization",
    "Cash Flow Forecast",
    "Accounts Receivable",
    "Accounts Payable",
    "Operating Expenses",
  ]
  const statuses = ["healthy", "warning", "critical", "excellent"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `overview-metric-${i + 1}`,
    name: metrics[i % metrics.length],
    description: `Financial metric tracking for ${metrics[i % metrics.length].toLowerCase()}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "CFO - Sarah Chen" : i % 3 === 1 ? "Controller - Marcus Webb" : "Finance Manager - Elena Rodriguez",
    assignee_name: i % 3 === 0 ? "Sarah Chen" : i % 3 === 1 ? "Marcus Webb" : "Elena Rodriguez",
    due_date: getRandomFutureDate(7),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["financial-metric", "overview", "kpi"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateForecastingData(count: number): DataItem[] {
  const forecastTypes = [
    "Q1 Revenue Projection",
    "Q2 Expense Forecast",
    "Labor Cost Forecast",
    "Equipment Budget Projection",
    "Production Cost Forecast",
    "Cash Flow Projection",
    "Contingency Budget Forecast",
    "Vendor Spend Forecast",
    "Revenue Stream Forecast",
    "Capital Expenditure Projection",
  ]
  const lineItemCategories = ["Labor", "Equipment", "Materials", "Services", "Travel", "Facilities"]
  const statuses = ["draft", "under_review", "approved", "active", "needs_update"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `forecast-${i + 1}`,
    name: `${forecastTypes[i % forecastTypes.length]} - ${lineItemCategories[i % lineItemCategories.length]}`,
    description: `Budget forecasting using line item approved rate ranges: $${50 + (i * 15)}-$${200 + (i * 25)}/unit. Projection period: ${i % 3 === 0 ? "Monthly" : i % 3 === 1 ? "Quarterly" : "Annual"}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Budget Analyst - Jessica Park" : i % 4 === 1 ? "Financial Planner - Tom Zhang" : i % 4 === 2 ? "Controller - Marcus Webb" : "Finance Director - Sarah Chen",
    assignee_name: i % 4 === 0 ? "Jessica Park" : i % 4 === 1 ? "Tom Zhang" : i % 4 === 2 ? "Marcus Webb" : "Sarah Chen",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["forecasting", "projection", lineItemCategories[i % lineItemCategories.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
    projected_amount: `$${randomAmount(10000, 250000)}`,
    variance: `${(Math.random() * 20 - 10).toFixed(1)}%`,
  }))
}

function generateBudgetsData(count: number): DataItem[] {
  const budgetNames = ["Production Budget", "Marketing Budget", "Crew Budget", "Equipment Budget", "Travel Budget", "Venue Budget", "Post-Production", "Contingency", "Operations", "CapEx"]
  const statuses = ["draft", "approved", "active", "closed"]
  const productions = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => {
    const total = parseFloat(randomAmount(50000, 500000))
    const allocated = parseFloat((total * (Math.random() * 0.5 + 0.3)).toFixed(2))
    const spent = parseFloat((allocated * (Math.random() * 0.8)).toFixed(2))
    
    return {
      id: `budget-${i + 1}`,
      production_id: i % 2 === 0 ? productions[i % productions.length] : null,
      name: `${budgetNames[i % budgetNames.length]} Q${Math.floor(i / 4) % 4 + 1} 2024`,
      description: "Budget allocation with forecast vs. actual tracking",
      total_amount: total,
      allocated_amount: allocated,
      spent_amount: spent,
      currency: "USD",
      start_date: getRandomPastDate(60).split('T')[0],
      end_date: getRandomFutureDate(180).split('T')[0],
      status: statuses[i % statuses.length],
      created_by: "person-1",
      created_at: getRandomPastDate(60),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 15),
      attachments_count: Math.floor(Math.random() * 8),
    }
  })
}

function generateTransactionsData(count: number): DataItem[] {
  const types = ["income", "expense", "transfer"]
  const categories = ["Sales", "Vendor Payment", "Payroll", "Equipment", "Travel", "Materials", "Services"]
  const statuses = ["pending", "cleared", "reconciled", "void"]
  const methods = ["bank_transfer", "credit_card", "ach", "wire", "check", "cash"]
  const productions = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `txn-${(10000 + i).toString()}`,
    type: types[i % types.length],
    category: categories[i % categories.length],
    amount: parseFloat(randomAmount(100, 25000)),
    currency: "USD",
    description: `${categories[i % categories.length]} transaction`,
    transaction_date: getRandomPastDate(14),
    production_id: i % 3 === 0 ? productions[i % productions.length] : null,
    budget_id: i % 4 === 0 ? `budget-${(i % 10) + 1}` : null,
    company_id: i % 2 === 0 ? `company-${(i % 5) + 1}` : null,
    payment_method: methods[i % methods.length],
    reference_number: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: statuses[i % statuses.length],
    gl_code: `${1000 + (i % 10) * 100}`,
    created_by: "person-1",
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateRevenueData(count: number): DataItem[] {
  const revenueStreams = [
    "Ticket Sales - Main Show",
    "Merchandise Revenue",
    "Sponsorship Income",
    "Licensing Fees",
    "VIP Package Sales",
    "Concession Revenue",
    "Streaming Rights",
    "Broadcast Rights",
    "Venue Rental Income",
    "Brand Partnership",
  ]
  const statuses = ["received", "pending", "projected", "overdue"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `revenue-${i + 1}`,
    name: `${revenueStreams[i % revenueStreams.length]} - $${randomAmount(5000, 150000)}`,
    description: `Revenue stream tracking with payment terms and collection status`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Revenue Manager - Sophia Martinez" : i % 3 === 1 ? "Sales Lead - Ryan Cooper" : "Account Manager - Emily White",
    assignee_name: i % 3 === 0 ? "Sophia Martinez" : i % 3 === 1 ? "Ryan Cooper" : "Emily White",
    due_date: getRandomFutureDate(45),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["revenue", "income", revenueStreams[i % revenueStreams.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateExpensesData(count: number): DataItem[] {
  const statuses = ["draft", "submitted", "approved", "rejected", "reimbursed"]
  const productionIds = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `expense-report-${i + 1}`,
    submitted_by: "person-1",
    production_id: i % 2 === 0 ? productionIds[i % productionIds.length] : null,
    title: `Expense Report ${i + 1}`,
    description: "Expense report with receipts and itemized costs",
    total_amount: parseFloat(randomAmount(50, 5000)),
    currency: "USD",
    submitted_date: i % 3 !== 0 ? getRandomPastDate(7) : null,
    approved_date: i % 4 === 0 ? getRandomPastDate(3) : null,
    approved_by: i % 4 === 0 ? "person-2" : null,
    status: statuses[i % statuses.length],
    notes: "Submitted with all required receipts",
    created_at: getRandomPastDate(10),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 7),
  }))
}

function generatePayrollData(count: number): DataItem[] {
  const payrollPeriods = [
    "Weekly Payroll - Week 1",
    "Weekly Payroll - Week 2",
    "Weekly Payroll - Week 3",
    "Weekly Payroll - Week 4",
    "Bi-Weekly Payroll Period 1",
    "Bi-Weekly Payroll Period 2",
    "Monthly Payroll - January",
    "Monthly Payroll - February",
    "Bonus Payment - Q1",
    "Per Diem Distribution",
  ]
  const statuses = ["processing", "approved", "paid", "pending_approval", "on_hold"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `payroll-${i + 1}`,
    name: `${payrollPeriods[i % payrollPeriods.length]} - ${Math.floor(Math.random() * 50) + 20} employees`,
    description: `Crew payroll processing with hours worked, rates, taxes, and deductions`,
    status: statuses[i % statuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Payroll Manager - Christine Lopez" : i % 3 === 1 ? "HR Coordinator - Daniel Brown" : "Payroll Specialist - Amanda Foster",
    assignee_name: i % 3 === 0 ? "Christine Lopez" : i % 3 === 1 ? "Daniel Brown" : "Amanda Foster",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(2),
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["payroll", "compensation", "crew"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateReconciliationData(count: number): DataItem[] {
  const reconciliationTypes = [
    "Project Settlement - Summer Tour 2024",
    "Show Settlement - Madison Square Garden",
    "Festival Settlement - Coachella Weekend 1",
    "Venue Settlement - Radio City Music Hall",
    "Production Settlement - Broadway Run",
    "Tour Settlement - European Leg",
    "Event Settlement - Corporate Gala",
    "Concert Settlement - Arena Show",
    "Show Close-Out - Vegas Residency",
    "Final Settlement - Regional Theater",
  ]
  const statuses = ["pending", "in_review", "reconciled", "disputed", "finalized"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `settlement-${i + 1}`,
    name: `${reconciliationTypes[i % reconciliationTypes.length]} - $${randomAmount(50000, 750000)}`,
    description: `Project/show settlement with box office reconciliation, expenses vs. budget, and final accounting`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Settlements Manager - Victoria Santos" : i % 3 === 1 ? "Production Accountant - Nathan Gray" : "Finance Controller - Rebecca Hill",
    assignee_name: i % 3 === 0 ? "Victoria Santos" : i % 3 === 1 ? "Nathan Gray" : "Rebecca Hill",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: ["reconciliation", "settlement", "project-close"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generatePaymentsData(count: number): DataItem[] {
  const paymentTypes = [
    "Vendor Payment - Sound Company",
    "Vendor Payment - Lighting Rental",
    "Contractor Payment - Stage Build",
    "Venue Deposit Payment",
    "Insurance Premium Payment",
    "Equipment Purchase Payment",
    "Service Provider Payment",
    "Talent Payment - Performer Fee",
    "Agency Commission Payment",
    "Supplier Payment - Materials",
  ]
  const statuses = ["scheduled", "processing", "sent", "cleared", "failed", "cancelled"]
  const methods = ["ACH Transfer", "Wire Transfer", "Check", "Credit Card", "Bank Transfer"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `payment-${(5000 + i).toString()}`,
    name: `${paymentTypes[i % paymentTypes.length]} - $${randomAmount(500, 50000)}`,
    description: `Payment processing via ${methods[i % methods.length]} - Confirmation #${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "AP Manager - Carlos Rodriguez" : i % 3 === 1 ? "Payment Processor - Emma Johnson" : "Finance Clerk - Patrick O'Brien",
    assignee_name: i % 3 === 0 ? "Carlos Rodriguez" : i % 3 === 1 ? "Emma Johnson" : "Patrick O'Brien",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(21),
    updated_at: new Date().toISOString(),
    tags: ["payment", "vendor", methods[i % methods.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateInvoicesData(count: number): DataItem[] {
  const statuses = ["draft", "sent", "viewed", "partial", "paid", "overdue", "cancelled"]
  const companyIds = ["company-1", "company-2", "company-3", "company-4"]
  const productionIds = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => {
    const subtotal = parseFloat(randomAmount(5000, 75000))
    const tax = parseFloat((subtotal * 0.08).toFixed(2))
    const total = parseFloat((subtotal + tax).toFixed(2))
    const issueDate = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
    const dueDate = new Date(issueDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    return {
      id: `invoice-${i + 1}`,
      invoice_number: `INV-${String(202400 + i).padStart(8, '0')}`,
      company_id: companyIds[i % companyIds.length],
      production_id: i % 2 === 0 ? productionIds[i % productionIds.length] : null,
      subtotal,
      tax,
      total,
      currency: "USD",
      issue_date: issueDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      paid_date: i % 3 === 0 ? new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      status: statuses[i % statuses.length],
      notes: "Payment terms: Net 30",
      terms: "Payment due within 30 days of invoice date",
      created_by: "person-1",
      created_at: issueDate.toISOString(),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 12),
      attachments_count: Math.floor(Math.random() * 8),
    }
  })
}

function generateTaxesData(count: number): DataItem[] {
  const taxTypes = [
    "Sales Tax Filing - Q1 2024",
    "Payroll Tax Withholding",
    "State Income Tax Filing",
    "Federal Tax Payment",
    "1099 Contractor Forms",
    "W-2 Employee Forms",
    "Quarterly Tax Estimate",
    "Property Tax Assessment",
    "Use Tax Filing",
    "Entertainment Tax Filing",
  ]
  const statuses = ["pending", "filed", "paid", "under_review", "amended", "overdue"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tax-${i + 1}`,
    name: `${taxTypes[i % taxTypes.length]} - $${randomAmount(2000, 100000)}`,
    description: `Tax document and filing with IRS/state requirements, deadlines, and compliance tracking`,
    status: statuses[i % statuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Tax Manager - Jennifer White" : i % 3 === 1 ? "Tax Accountant - Michael Chen" : "Compliance Officer - Laura Martinez",
    assignee_name: i % 3 === 0 ? "Jennifer White" : i % 3 === 1 ? "Michael Chen" : "Laura Martinez",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["tax", "compliance", "filing"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateAccountsData(count: number): DataItem[] {
  const accountCategories = [
    "Revenue - Ticket Sales",
    "Revenue - Merchandise",
    "Revenue - Sponsorships",
    "Expenses - Crew Labor",
    "Expenses - Equipment Rental",
    "Expenses - Travel & Lodging",
    "Expenses - Venue Costs",
    "Expenses - Marketing",
    "Assets - Equipment Owned",
    "Liabilities - Vendor Payables",
    "Assets - Cash & Equivalents",
    "Expenses - Insurance",
    "Revenue - Licensing",
    "Expenses - Professional Services",
    "Assets - Accounts Receivable",
  ]
  const accountTypes = ["asset", "liability", "equity", "revenue", "expense"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `account-${(1000 + i * 10).toString()}`,
    name: accountCategories[i % accountCategories.length],
    description: `Accounting category for classification and reporting - Type: ${accountTypes[i % accountTypes.length].charAt(0).toUpperCase() + accountTypes[i % accountTypes.length].slice(1)}`,
    status: i % 5 === 0 ? "active" : i % 5 === 1 ? "inactive" : i % 5 === 2 ? "archived" : i % 5 === 3 ? "review" : "active",
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Chart Manager - Robert Johnson" : i % 3 === 1 ? "Staff Accountant - Amanda Davis" : "Accounting Lead - Gregory Moore",
    assignee_name: i % 3 === 0 ? "Robert Johnson" : i % 3 === 1 ? "Amanda Davis" : "Gregory Moore",
    due_date: getRandomFutureDate(365),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: ["account", "category", accountTypes[i % accountTypes.length]],
    comments_count: Math.floor(Math.random() * 6),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateGLCodesData(count: number): DataItem[] {
  const glCodes = [
    "1000 - Cash Operating Account",
    "1100 - Accounts Receivable",
    "1500 - Equipment & Assets",
    "2000 - Accounts Payable",
    "2100 - Accrued Expenses",
    "3000 - Owner's Equity",
    "4000 - Ticket Revenue",
    "4100 - Merchandise Sales",
    "4200 - Sponsorship Income",
    "5000 - Crew Wages & Salaries",
    "5100 - Payroll Taxes",
    "6000 - Equipment Rental Expense",
    "6100 - Venue Rental Expense",
    "6200 - Travel & Transportation",
    "7000 - Marketing & Advertising",
    "7100 - Professional Fees",
    "8000 - Insurance Expense",
    "8100 - Utilities & Services",
  ]
  const statuses = ["active", "inactive", "pending_approval", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `gl-${(1000 + i * 100).toString()}`,
    name: glCodes[i % glCodes.length],
    description: `General ledger code for detailed transaction tracking and financial reporting hierarchy`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "GL Manager - Catherine Lee" : i % 3 === 1 ? "Senior Accountant - William Brown" : "Accounting Manager - Michelle Garcia",
    assignee_name: i % 3 === 0 ? "Catherine Lee" : i % 3 === 1 ? "William Brown" : "Michelle Garcia",
    due_date: getRandomFutureDate(365),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["gl-code", "accounting", "ledger"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 2),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "completed", "archived"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Financial Record",
    "Budget Item",
    "Transaction Entry",
    "Accounting Entry",
    "Financial Report",
    "Payment Record",
    "Revenue Entry",
    "Expense Entry",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `finance-item-${i + 1}`,
    name: `${names[i % names.length]} ${i + 1}`,
    description: "Financial item requiring attention and processing",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Finance Team" : i % 3 === 1 ? "Accounting Manager" : "Financial Controller",
    assignee_name: i % 3 === 0 ? "Finance Team" : i % 3 === 1 ? "Accounting Manager" : "Financial Controller",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["finance"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
