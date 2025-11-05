-- =============================================
-- COMMUNICATION THREADS & INVOICE MANAGEMENT
-- Migration: 20251015000003
-- =============================================
-- Searchable communication history and one-click invoicing

-- =============================================
-- COMMUNICATION THREADS
-- =============================================

CREATE TABLE communication_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Context (what this thread is about)
    context_type TEXT NOT NULL CHECK (context_type IN (
        'work_order', 'job_contract', 'project', 'rfp', 'estimate'
    )),
    context_id UUID NOT NULL,
    
    title TEXT NOT NULL,
    description TEXT,
    
    -- Participants
    participant_user_ids UUID[] DEFAULT '{}',
    participant_company_ids UUID[] DEFAULT '{}',
    
    -- Status
    is_archived BOOLEAN DEFAULT false,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE thread_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES communication_threads(id) ON DELETE CASCADE,
    
    author_id UUID NOT NULL REFERENCES auth.users(id),
    
    message TEXT NOT NULL,
    
    -- Attachments
    file_ids UUID[] DEFAULT '{}',
    
    -- Message Type
    message_type TEXT DEFAULT 'message' CHECK (message_type IN (
        'message', 'status_update', 'system_notification', 'approval_request'
    )),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Reactions
    reactions JSONB DEFAULT '{}'::jsonb, -- {user_id: emoji}
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INVOICE MANAGEMENT
-- =============================================

CREATE TABLE subcontractor_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    invoice_number TEXT UNIQUE NOT NULL,
    
    -- References
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    job_contract_id UUID REFERENCES job_contracts(id) ON DELETE SET NULL,
    
    -- Financial
    subtotal DECIMAL(15, 2) NOT NULL,
    tax DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Dates
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'pending_approval', 'approved',
        'paid', 'rejected', 'disputed', 'cancelled'
    )),
    
    -- Approval Workflow
    submitted_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Payment
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Documents
    invoice_document_url TEXT,
    
    -- Notes
    notes TEXT,
    internal_notes TEXT,
    
    -- Metadata
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES subcontractor_invoices(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    
    -- Optional link to work order or task
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    project_task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ESTIMATES SYSTEM (Outgoing Quotes)
-- =============================================

CREATE TABLE estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    estimate_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- Client
    client_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    client_contact_id UUID REFERENCES company_contacts(id) ON DELETE SET NULL,
    
    -- Project Reference
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Financial
    subtotal DECIMAL(15, 2) NOT NULL,
    tax DECIMAL(15, 2) DEFAULT 0,
    discount DECIMAL(15, 2) DEFAULT 0,
    total DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Validity
    valid_until DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted'
    )),
    
    -- Tracking
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    
    -- Signature
    client_signature_url TEXT,
    signed_at TIMESTAMPTZ,
    signed_by_name TEXT,
    
    -- Conversion
    converted_to_contract_id UUID REFERENCES job_contracts(id) ON DELETE SET NULL,
    converted_at TIMESTAMPTZ,
    
    -- Documents
    estimate_document_url TEXT,
    
    -- Terms
    payment_terms TEXT,
    terms_and_conditions TEXT,
    
    -- Notes
    notes TEXT,
    internal_notes TEXT,
    rejection_reason TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE estimate_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    
    category TEXT,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Communication
CREATE INDEX idx_communication_threads_workspace ON communication_threads(workspace_id);
CREATE INDEX idx_communication_threads_context ON communication_threads(context_type, context_id);
CREATE INDEX idx_thread_messages_thread ON thread_messages(thread_id);
CREATE INDEX idx_thread_messages_author ON thread_messages(author_id);

-- Invoices
CREATE INDEX idx_subcontractor_invoices_workspace ON subcontractor_invoices(workspace_id);
CREATE INDEX idx_subcontractor_invoices_company ON subcontractor_invoices(company_id);
CREATE INDEX idx_subcontractor_invoices_work_order ON subcontractor_invoices(work_order_id);
CREATE INDEX idx_subcontractor_invoices_status ON subcontractor_invoices(status);
CREATE INDEX idx_subcontractor_invoices_due_date ON subcontractor_invoices(due_date);
CREATE INDEX idx_invoice_line_items_invoice ON invoice_line_items(invoice_id);

-- Estimates
CREATE INDEX idx_estimates_workspace ON estimates(workspace_id);
CREATE INDEX idx_estimates_client_company ON estimates(client_company_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_production ON estimates(production_id);
CREATE INDEX idx_estimate_line_items_estimate ON estimate_line_items(estimate_id);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_thread_messages_search ON thread_messages 
    USING GIN (to_tsvector('english', message));

CREATE INDEX idx_invoices_search ON subcontractor_invoices 
    USING GIN (to_tsvector('english', 
        invoice_number || ' ' || COALESCE(notes, '')
    ));

CREATE INDEX idx_estimates_search ON estimates 
    USING GIN (to_tsvector('english', 
        estimate_number || ' ' || title || ' ' || COALESCE(description, '')
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_communication_threads_updated_at
    BEFORE UPDATE ON communication_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subcontractor_invoices_updated_at
    BEFORE UPDATE ON subcontractor_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-create communication thread when work order is created
CREATE OR REPLACE FUNCTION create_work_order_thread()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO communication_threads (
        workspace_id,
        context_type,
        context_id,
        title,
        description,
        participant_user_ids,
        created_by
    ) VALUES (
        NEW.workspace_id,
        'work_order',
        NEW.id,
        'Work Order: ' || NEW.title,
        'Communication thread for work order #' || NEW.work_order_number,
        ARRAY[NEW.created_by],
        NEW.created_by
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_work_order_thread
    AFTER INSERT ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION create_work_order_thread();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE communication_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_line_items ENABLE ROW LEVEL SECURITY;

-- Communication policies
CREATE POLICY "Users can view threads in their workspaces"
    ON communication_threads FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage threads in their workspaces"
    ON communication_threads FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view messages in their threads"
    ON thread_messages FOR SELECT
    USING (thread_id IN (
        SELECT id FROM communication_threads WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage messages in their threads"
    ON thread_messages FOR ALL
    USING (thread_id IN (
        SELECT id FROM communication_threads WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- Invoice policies
CREATE POLICY "Users can view invoices in their workspaces"
    ON subcontractor_invoices FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage invoices in their workspaces"
    ON subcontractor_invoices FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view invoice line items"
    ON invoice_line_items FOR SELECT
    USING (invoice_id IN (
        SELECT id FROM subcontractor_invoices WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage invoice line items"
    ON invoice_line_items FOR ALL
    USING (invoice_id IN (
        SELECT id FROM subcontractor_invoices WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- Estimate policies
CREATE POLICY "Users can view estimates in their workspaces"
    ON estimates FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage estimates in their workspaces"
    ON estimates FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view estimate line items"
    ON estimate_line_items FOR SELECT
    USING (estimate_id IN (
        SELECT id FROM estimates WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can manage estimate line items"
    ON estimate_line_items FOR ALL
    USING (estimate_id IN (
        SELECT id FROM estimates WHERE workspace_id IN (
            SELECT id FROM workspaces WHERE organization_id IN (
                SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
            )
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE communication_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE thread_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE subcontractor_invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE estimates;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE communication_threads IS 'Dedicated communication channels for work orders, projects, etc.';
COMMENT ON TABLE thread_messages IS 'Messages within communication threads';
COMMENT ON TABLE subcontractor_invoices IS 'One-click invoicing from subcontractors';
COMMENT ON TABLE estimates IS 'Outgoing estimates/quotes to clients';
