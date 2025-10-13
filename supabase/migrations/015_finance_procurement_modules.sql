-- =============================================
-- FINANCE & PROCUREMENT MODULES
-- Migration: 007
-- =============================================

-- =============================================
-- FINANCE MODULE
-- =============================================

-- Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    total_amount DECIMAL(15, 2) NOT NULL,
    allocated_amount DECIMAL(15, 2) DEFAULT 0,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    start_date DATE,
    end_date DATE,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'approved', 'active', 'closed'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Budget Line Items
CREATE TABLE budget_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    
    budgeted_amount DECIMAL(12, 2) NOT NULL,
    actual_amount DECIMAL(12, 2) DEFAULT 0,
    
    gl_code TEXT, -- General Ledger code
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Transactions
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    category TEXT NOT NULL,
    
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    description TEXT,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Relationships
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
    budget_line_item_id UUID REFERENCES budget_line_items(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Payment Details
    payment_method TEXT,
    reference_number TEXT,
    receipt_url TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'cleared', 'reconciled', 'void'
    )),
    
    -- Accounting
    gl_code TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    invoice_number TEXT UNIQUE NOT NULL,
    
    -- Parties
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Amounts
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Dates
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled'
    )),
    
    notes TEXT,
    terms TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoice Line Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense Reports
CREATE TABLE expense_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    submitted_by UUID NOT NULL REFERENCES auth.users(id),
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    submitted_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'approved', 'rejected', 'reimbursed'
    )),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense Items
CREATE TABLE expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_report_id UUID NOT NULL REFERENCES expense_reports(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    
    receipt_url TEXT,
    merchant TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PROCUREMENT MODULE
-- =============================================

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    po_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'work_order', 'purchase_order', 'change_order', 'talent_order'
    )),
    
    -- Parties
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Amounts
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'issued', 'fulfilled', 'cancelled'
    )),
    
    -- Dates
    issue_date DATE,
    delivery_date DATE,
    
    -- Approval
    requires_approval BOOLEAN DEFAULT true,
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    
    notes TEXT,
    terms TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PO Line Items
CREATE TABLE po_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Rate Ranges for Forecasting
    min_rate DECIMAL(10, 2),
    max_rate DECIMAL(10, 2),
    
    gl_code TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Procurement Agreements
CREATE TABLE procurement_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    agreement_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
        'service_agreement', 'vendor_contract', 'procurement_agreement', 'msa'
    )),
    
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    
    value DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    
    start_date DATE,
    end_date DATE,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending', 'active', 'expired', 'terminated'
    )),
    
    document_url TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approval Workflows
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    required_approvers UUID[] DEFAULT '{}',
    current_approver UUID REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'cancelled'
    )),
    
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    
    notes TEXT
);

-- =============================================
-- INDEXES
-- =============================================

-- Budgets
CREATE INDEX idx_budgets_workspace ON budgets(workspace_id);
CREATE INDEX idx_budgets_production ON budgets(production_id);
CREATE INDEX idx_budgets_status ON budgets(status);
CREATE INDEX idx_budget_items_budget ON budget_line_items(budget_id);

-- Transactions
CREATE INDEX idx_transactions_workspace ON financial_transactions(workspace_id);
CREATE INDEX idx_transactions_type ON financial_transactions(type);
CREATE INDEX idx_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_transactions_production ON financial_transactions(production_id);

-- Invoices
CREATE INDEX idx_invoices_workspace ON invoices(workspace_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_company ON invoices(company_id);

-- Purchase Orders
CREATE INDEX idx_pos_workspace ON purchase_orders(workspace_id);
CREATE INDEX idx_pos_number ON purchase_orders(po_number);
CREATE INDEX idx_pos_status ON purchase_orders(status);
CREATE INDEX idx_pos_company ON purchase_orders(company_id);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pos_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agreements_updated_at
    BEFORE UPDATE ON procurement_agreements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies (same pattern as before)
-- ... (abbreviated for brevity - same workspace-based RLS as other modules)

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE purchase_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE approval_requests;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE budgets IS 'Project and production budgets';
COMMENT ON TABLE financial_transactions IS 'Income, expenses, and transfers';
COMMENT ON TABLE invoices IS 'Customer and vendor invoices';
COMMENT ON TABLE purchase_orders IS 'Purchase orders and work orders';
COMMENT ON TABLE procurement_agreements IS 'Vendor agreements and contracts';
COMMENT ON TABLE approval_requests IS 'Approval workflows for budgets, POs, expenses';
