-- Create agreements table for procurement module
-- Agreements are different from scopes of work:
-- - Agreements: Master Service Agreements, Framework Agreements, Blanket Purchase Agreements
-- - Scopes of Work: Project-specific deliverables and contracts

CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Agreement details
    name TEXT NOT NULL,
    agreement_type TEXT NOT NULL CHECK (agreement_type IN (
        'master_service', 'framework', 'blanket_purchase', 
        'standing', 'memorandum', 'license', 'other'
    )),
    description TEXT,
    
    -- Parties involved
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Timeline
    start_date DATE NOT NULL,
    end_date DATE,
    renewal_date DATE,
    
    -- Financial terms
    total_value DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    payment_terms TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_review', 'active', 'expired', 
        'terminated', 'renewed', 'archived'
    )),
    
    -- Terms and conditions
    terms JSONB DEFAULT '{}'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    
    -- Files and references
    document_url TEXT,
    reference_number TEXT,
    
    -- Notifications
    notify_before_expiry_days INTEGER DEFAULT 30,
    
    -- Audit fields
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agreements_workspace ON agreements(workspace_id);
CREATE INDEX idx_agreements_company ON agreements(company_id);
CREATE INDEX idx_agreements_status ON agreements(status);
CREATE INDEX idx_agreements_start_date ON agreements(start_date);
CREATE INDEX idx_agreements_end_date ON agreements(end_date);

-- RLS Policies
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Users can view agreements in their workspace
CREATE POLICY "Users can view agreements in their workspace"
    ON agreements
    FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id
            FROM user_roles
            WHERE user_id = auth.uid()
        )
    );

-- Users with appropriate permissions can insert agreements
CREATE POLICY "Users can insert agreements in their workspace"
    ON agreements
    FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id
            FROM user_roles
            WHERE user_id = auth.uid()
            AND role_id IN (
                SELECT id FROM roles 
                WHERE slug IN ('gladiator', 'navigator', 'admin', 'owner')
            )
        )
    );

-- Users with appropriate permissions can update agreements
CREATE POLICY "Users can update agreements in their workspace"
    ON agreements
    FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id
            FROM user_roles
            WHERE user_id = auth.uid()
            AND role_id IN (
                SELECT id FROM roles 
                WHERE slug IN ('gladiator', 'navigator', 'admin', 'owner')
            )
        )
    );

-- Users with appropriate permissions can delete agreements
CREATE POLICY "Users can delete agreements in their workspace"
    ON agreements
    FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id
            FROM user_roles
            WHERE user_id = auth.uid()
            AND role_id IN (
                SELECT id FROM roles 
                WHERE slug IN ('admin', 'owner')
            )
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_agreements_updated_at
    BEFORE UPDATE ON agreements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
