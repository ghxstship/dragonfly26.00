-- =============================================
-- MISSING TAB FEATURES FOR EXISTING MODULES
-- Migration: 012
-- =============================================

-- =============================================
-- EVENTS MODULE - Additional Features
-- =============================================

-- Tours (Multi-city tour schedules)
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    description TEXT,
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    tour_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
        'planning', 'active', 'completed', 'cancelled'
    )),
    
    total_shows INTEGER DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tour Dates
CREATE TABLE tour_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    date DATE NOT NULL,
    show_time TIME,
    load_in_time TIME,
    
    venue_name TEXT,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'confirmed', 'cancelled', 'postponed', 'completed'
    )),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Travel Itineraries
CREATE TABLE travel_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    traveler_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
    
    departure_date TIMESTAMPTZ NOT NULL,
    arrival_date TIMESTAMPTZ NOT NULL,
    
    origin_city TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    
    transportation_type TEXT CHECK (transportation_type IN (
        'flight', 'bus', 'train', 'car', 'other'
    )),
    
    confirmation_number TEXT,
    carrier TEXT,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'checked_in', 'completed', 'cancelled'
    )),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hospitality Reservations
CREATE TABLE hospitality_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    reservation_type TEXT NOT NULL CHECK (reservation_type IN (
        'restaurant', 'catering', 'entertainment', 'transportation', 'other'
    )),
    
    vendor_name TEXT NOT NULL,
    contact_name TEXT,
    contact_phone TEXT,
    
    reservation_date TIMESTAMPTZ NOT NULL,
    party_size INTEGER,
    
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    location_details TEXT,
    
    confirmation_number TEXT,
    
    cost DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'cancelled'
    )),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shipments (Shipping & Receiving)
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    tracking_number TEXT,
    carrier TEXT,
    
    type TEXT NOT NULL CHECK (type IN ('inbound', 'outbound', 'return')),
    
    origin_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    destination_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    
    origin_address TEXT,
    destination_address TEXT,
    
    ship_date TIMESTAMPTZ,
    expected_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    
    contents TEXT,
    weight DECIMAL(10, 2),
    weight_unit TEXT DEFAULT 'lbs',
    
    cost DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN (
        'preparing', 'shipped', 'in_transit', 'delivered', 'returned', 'lost'
    )),
    
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- FINANCE MODULE - Additional Features
-- =============================================

-- Payroll
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    total_gross DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) DEFAULT 0,
    total_net DECIMAL(15, 2) DEFAULT 0,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'processing', 'approved', 'paid'
    )),
    
    processed_by UUID REFERENCES auth.users(id),
    processed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payroll Items
CREATE TABLE payroll_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID NOT NULL REFERENCES payroll(id) ON DELETE CASCADE,
    
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    gross_pay DECIMAL(10, 2) NOT NULL,
    deductions DECIMAL(10, 2) DEFAULT 0,
    net_pay DECIMAL(10, 2) NOT NULL,
    
    hours_worked DECIMAL(8, 2),
    hourly_rate DECIMAL(10, 2),
    
    deduction_details JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reconciliations (Show Settlements)
CREATE TABLE reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    reconciliation_type TEXT NOT NULL CHECK (reconciliation_type IN (
        'show_settlement', 'project_closeout', 'vendor_settlement'
    )),
    
    reconciliation_date DATE NOT NULL,
    
    budgeted_amount DECIMAL(15, 2),
    actual_revenue DECIMAL(15, 2),
    actual_expenses DECIMAL(15, 2),
    net_result DECIMAL(15, 2),
    
    variance DECIMAL(15, 2),
    variance_notes TEXT,
    
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN (
        'in_progress', 'review', 'approved', 'disputed'
    )),
    
    reconciled_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tax Documents
CREATE TABLE tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    document_type TEXT NOT NULL CHECK (document_type IN (
        'w2', 'w9', '1099', '1099_nec', 'sales_tax', 'vat', 'other'
    )),
    
    tax_year INTEGER NOT NULL,
    
    entity_type TEXT NOT NULL CHECK (entity_type IN ('personnel', 'company')),
    entity_id UUID NOT NULL,
    
    amount DECIMAL(15, 2),
    
    file_url TEXT,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'filed', 'amended', 'archived'
    )),
    
    filed_date DATE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GL Codes (General Ledger Codes)
CREATE TABLE gl_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    
    account_type TEXT NOT NULL CHECK (account_type IN (
        'asset', 'liability', 'equity', 'revenue', 'expense'
    )),
    
    parent_code_id UUID REFERENCES gl_codes(id) ON DELETE SET NULL,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id, code)
);

-- =============================================
-- PROCUREMENT MODULE - Additional Features
-- =============================================

-- Purchase Requisitions
CREATE TABLE purchase_requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    requisition_number TEXT UNIQUE NOT NULL,
    
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    needed_by TIMESTAMPTZ,
    
    description TEXT NOT NULL,
    justification TEXT,
    
    estimated_total DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'approved', 'rejected', 'converted_to_po', 'cancelled'
    )),
    
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    
    po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Requisition Line Items
CREATE TABLE requisition_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisition_id UUID NOT NULL REFERENCES purchase_requisitions(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2),
    estimated_total DECIMAL(10, 2),
    
    preferred_vendor_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    gl_code_id UUID REFERENCES gl_codes(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Tours
CREATE INDEX idx_tours_workspace ON tours(workspace_id);
CREATE INDEX idx_tours_production ON tours(production_id);
CREATE INDEX idx_tour_dates_tour ON tour_dates(tour_id);
CREATE INDEX idx_tour_dates_date ON tour_dates(date);

-- Travel
CREATE INDEX idx_itineraries_workspace ON travel_itineraries(workspace_id);
CREATE INDEX idx_itineraries_traveler ON travel_itineraries(traveler_id);
CREATE INDEX idx_itineraries_tour ON travel_itineraries(tour_id);
CREATE INDEX idx_itineraries_dates ON travel_itineraries(departure_date, arrival_date);

-- Hospitality
CREATE INDEX idx_hospitality_workspace ON hospitality_reservations(workspace_id);
CREATE INDEX idx_hospitality_event ON hospitality_reservations(event_id);
CREATE INDEX idx_hospitality_date ON hospitality_reservations(reservation_date);

-- Shipments
CREATE INDEX idx_shipments_workspace ON shipments(workspace_id);
CREATE INDEX idx_shipments_production ON shipments(production_id);
CREATE INDEX idx_shipments_event ON shipments(event_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);

-- Payroll
CREATE INDEX idx_payroll_workspace ON payroll(workspace_id);
CREATE INDEX idx_payroll_period ON payroll(pay_period_start, pay_period_end);
CREATE INDEX idx_payroll_items_payroll ON payroll_items(payroll_id);
CREATE INDEX idx_payroll_items_personnel ON payroll_items(personnel_id);

-- Reconciliations
CREATE INDEX idx_reconciliations_workspace ON reconciliations(workspace_id);
CREATE INDEX idx_reconciliations_production ON reconciliations(production_id);
CREATE INDEX idx_reconciliations_event ON reconciliations(event_id);

-- Tax Documents
CREATE INDEX idx_tax_docs_workspace ON tax_documents(workspace_id);
CREATE INDEX idx_tax_docs_year ON tax_documents(tax_year);
CREATE INDEX idx_tax_docs_entity ON tax_documents(entity_type, entity_id);

-- GL Codes
CREATE INDEX idx_gl_codes_workspace ON gl_codes(workspace_id);
CREATE INDEX idx_gl_codes_code ON gl_codes(code);
CREATE INDEX idx_gl_codes_type ON gl_codes(account_type);

-- Requisitions
CREATE INDEX idx_requisitions_workspace ON purchase_requisitions(workspace_id);
CREATE INDEX idx_requisitions_number ON purchase_requisitions(requisition_number);
CREATE INDEX idx_requisitions_status ON purchase_requisitions(status);
CREATE INDEX idx_requisitions_requested ON purchase_requisitions(requested_by);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tour_dates_updated_at
    BEFORE UPDATE ON tour_dates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_itineraries_updated_at
    BEFORE UPDATE ON travel_itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_hospitality_updated_at
    BEFORE UPDATE ON hospitality_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payroll_updated_at
    BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reconciliations_updated_at
    BEFORE UPDATE ON reconciliations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tax_docs_updated_at
    BEFORE UPDATE ON tax_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gl_codes_updated_at
    BEFORE UPDATE ON gl_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_requisitions_updated_at
    BEFORE UPDATE ON purchase_requisitions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitality_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gl_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisition_items ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies (abbreviated - same pattern)

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE tours;
ALTER PUBLICATION supabase_realtime ADD TABLE tour_dates;
ALTER PUBLICATION supabase_realtime ADD TABLE travel_itineraries;
ALTER PUBLICATION supabase_realtime ADD TABLE shipments;
ALTER PUBLICATION supabase_realtime ADD TABLE payroll;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE tours IS 'Multi-city tour schedules';
COMMENT ON TABLE tour_dates IS 'Individual tour stops and dates';
COMMENT ON TABLE travel_itineraries IS 'Personnel travel arrangements';
COMMENT ON TABLE hospitality_reservations IS 'Restaurant and entertainment reservations';
COMMENT ON TABLE shipments IS 'Equipment and material shipments';
COMMENT ON TABLE payroll IS 'Crew payroll runs';
COMMENT ON TABLE reconciliations IS 'Show and project financial settlements';
COMMENT ON TABLE tax_documents IS 'Tax forms and documents';
COMMENT ON TABLE gl_codes IS 'General ledger account codes';
COMMENT ON TABLE purchase_requisitions IS 'Purchase request workflows';
