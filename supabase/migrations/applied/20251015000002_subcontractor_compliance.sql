-- =============================================
-- SUBCONTRACTOR COMPLIANCE TRACKING
-- Migration: 20251015000002
-- =============================================
-- Track subcontractor documents, compliance, ratings, and authorization

-- =============================================
-- SUBCONTRACTOR PROFILES
-- =============================================

CREATE TABLE subcontractor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN (
        'available', 'busy', 'unavailable'
    )),
    max_concurrent_jobs INTEGER DEFAULT 5,
    
    -- Skills & Authorization
    authorized_categories TEXT[] DEFAULT '{}', -- e.g., ['electrical', 'plumbing', 'hvac']
    authorized_states TEXT[] DEFAULT '{}', -- e.g., ['CA', 'NY', 'TX']
    specializations TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    
    -- Performance Metrics
    rating_avg DECIMAL(3, 2) DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
    review_count INTEGER DEFAULT 0,
    completed_jobs_count INTEGER DEFAULT 0,
    on_time_completion_rate DECIMAL(5, 2) DEFAULT 100, -- percentage
    
    -- Response Times
    avg_response_time_hours DECIMAL(8, 2),
    
    -- Reliability Score (0-100)
    reliability_score INTEGER DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
    
    -- Insurance & Bonding
    has_general_liability BOOLEAN DEFAULT false,
    has_workers_comp BOOLEAN DEFAULT false,
    has_bonding BOOLEAN DEFAULT false,
    
    -- Financial
    preferred_payment_terms TEXT,
    
    -- Status
    is_verified BOOLEAN DEFAULT false,
    is_preferred_vendor BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- COMPLIANCE DOCUMENTS
-- =============================================

CREATE TABLE subcontractor_compliance_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    document_type TEXT NOT NULL CHECK (document_type IN (
        'license', 'insurance_general_liability', 'insurance_workers_comp',
        'insurance_auto', 'bonding', 'certification', 'safety_training',
        'background_check', 'w9', 'other'
    )),
    
    name TEXT NOT NULL,
    document_number TEXT,
    issuing_authority TEXT,
    
    issue_date DATE,
    expiration_date DATE,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'active', 'expiring_soon', 'expired', 'rejected'
    )),
    
    -- Storage
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    document_url TEXT,
    
    -- Verification
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    
    -- Alerts
    expiration_notification_sent BOOLEAN DEFAULT false,
    days_before_expiration_alert INTEGER DEFAULT 30,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- WORK AUTHORIZATION RULES
-- =============================================

CREATE TABLE work_authorization_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Requirements
    required_document_types TEXT[] NOT NULL,
    required_certifications TEXT[] DEFAULT '{}',
    
    -- Applies to
    work_category TEXT NOT NULL, -- e.g., 'electrical', 'plumbing'
    state TEXT, -- If state-specific
    
    -- Auto-verification
    auto_verify_on_upload BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SUBCONTRACTOR RATINGS & REVIEWS
-- =============================================

CREATE TABLE subcontractor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
    
    -- Ratings (1-5 scale)
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
    
    -- Review
    title TEXT,
    review_text TEXT,
    
    -- Recommendation
    would_recommend BOOLEAN,
    would_hire_again BOOLEAN,
    
    -- Reviewer
    reviewed_by UUID NOT NULL REFERENCES auth.users(id),
    reviewer_role TEXT,
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_subcontractor_profiles_company ON subcontractor_profiles(company_id);
CREATE INDEX idx_subcontractor_profiles_workspace ON subcontractor_profiles(workspace_id);
CREATE INDEX idx_subcontractor_profiles_available ON subcontractor_profiles(is_available);
CREATE INDEX idx_subcontractor_compliance_company ON subcontractor_compliance_docs(company_id);
CREATE INDEX idx_subcontractor_compliance_workspace ON subcontractor_compliance_docs(workspace_id);
CREATE INDEX idx_subcontractor_compliance_status ON subcontractor_compliance_docs(status);
CREATE INDEX idx_subcontractor_compliance_expiration ON subcontractor_compliance_docs(expiration_date);
CREATE INDEX idx_work_auth_rules_workspace ON work_authorization_rules(workspace_id);
CREATE INDEX idx_work_auth_rules_category ON work_authorization_rules(work_category);
CREATE INDEX idx_subcontractor_reviews_company ON subcontractor_reviews(company_id);
CREATE INDEX idx_subcontractor_reviews_workspace ON subcontractor_reviews(workspace_id);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_subcontractor_profiles_updated_at
    BEFORE UPDATE ON subcontractor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subcontractor_compliance_docs_updated_at
    BEFORE UPDATE ON subcontractor_compliance_docs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subcontractor_reviews_updated_at
    BEFORE UPDATE ON subcontractor_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Auto-update compliance doc status based on expiration
CREATE OR REPLACE FUNCTION update_compliance_doc_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiration_date IS NOT NULL THEN
        IF NEW.expiration_date < CURRENT_DATE THEN
            NEW.status = 'expired';
        ELSIF NEW.expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN
            NEW.status = 'expiring_soon';
        ELSIF NEW.status IN ('expired', 'expiring_soon') THEN
            NEW.status = 'active';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_compliance_doc_status
    BEFORE INSERT OR UPDATE OF expiration_date ON subcontractor_compliance_docs
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_doc_status();

-- Update subcontractor profile rating when new review added
CREATE OR REPLACE FUNCTION update_subcontractor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE subcontractor_profiles
    SET 
        rating_avg = (
            SELECT AVG(overall_rating)::DECIMAL(3,2)
            FROM subcontractor_reviews
            WHERE company_id = NEW.company_id AND is_published = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM subcontractor_reviews
            WHERE company_id = NEW.company_id AND is_published = true
        )
    WHERE company_id = NEW.company_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subcontractor_rating
    AFTER INSERT OR UPDATE ON subcontractor_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_subcontractor_rating();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE subcontractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_compliance_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authorization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_reviews ENABLE ROW LEVEL SECURITY;

-- Subcontractor Profiles policies
CREATE POLICY "Users can view subcontractor profiles in their workspaces"
    ON subcontractor_profiles FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage subcontractor profiles in their workspaces"
    ON subcontractor_profiles FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Compliance Docs policies
CREATE POLICY "Users can view compliance docs in their workspaces"
    ON subcontractor_compliance_docs FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage compliance docs in their workspaces"
    ON subcontractor_compliance_docs FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Work Authorization Rules policies
CREATE POLICY "Users can view work auth rules in their workspaces"
    ON work_authorization_rules FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage work auth rules in their workspaces"
    ON work_authorization_rules FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Reviews policies
CREATE POLICY "Users can view reviews in their workspaces"
    ON subcontractor_reviews FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage reviews in their workspaces"
    ON subcontractor_reviews FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE subcontractor_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE subcontractor_compliance_docs;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE subcontractor_profiles IS 'Subcontractor performance, availability, and authorization tracking';
COMMENT ON TABLE subcontractor_compliance_docs IS 'Document tracking with expiration alerts';
COMMENT ON TABLE work_authorization_rules IS 'Define what documents/certs required for work categories';
COMMENT ON TABLE subcontractor_reviews IS 'Ratings and reviews for subcontractor performance';
