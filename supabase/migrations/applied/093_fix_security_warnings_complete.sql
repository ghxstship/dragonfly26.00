-- Generated ALTER FUNCTION statements for 63 functions
-- Run this to get the actual function signatures from the database:

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'check_advance_overdue' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION check_advance_overdue(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: check_advance_overdue(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'generate_run_of_show' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION generate_run_of_show(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: generate_run_of_show(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_personnel_hours' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_personnel_hours(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_personnel_hours(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'handle_new_user' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION handle_new_user(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: handle_new_user(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_work_order_actual_cost' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_work_order_actual_cost(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_work_order_actual_cost(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_compliance_doc_status' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_compliance_doc_status(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_compliance_doc_status(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_subcontractor_rating' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_subcontractor_rating(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_subcontractor_rating(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'create_work_order_thread' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION create_work_order_thread(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: create_work_order_thread(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'can_access_workspace' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION can_access_workspace(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: can_access_workspace(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'check_checklist_completion' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION check_checklist_completion(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: check_checklist_completion(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'check_approval_completion' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION check_approval_completion(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: check_approval_completion(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'create_cost_from_work_order' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION create_cost_from_work_order(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: create_cost_from_work_order(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'create_cost_from_invoice' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION create_cost_from_invoice(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: create_cost_from_invoice(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_production_budget_spent' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_production_budget_spent(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_production_budget_spent(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_hiring_application_counts' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_hiring_application_counts(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_hiring_application_counts(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_folder_path' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_folder_path(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_folder_path(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_folder_item_count' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_folder_item_count(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_folder_item_count(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_item_status_on_stock_change' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_item_status_on_stock_change(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_item_status_on_stock_change(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'create_low_stock_alert' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION create_low_stock_alert(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: create_low_stock_alert(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'user_has_permission' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION user_has_permission(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: user_has_permission(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_user_role_in_workspace' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_user_role_in_workspace(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_user_role_in_workspace(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_low_stock_report' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_low_stock_report(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_low_stock_report(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'check_plan_limit' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION check_plan_limit(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: check_plan_limit(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_active_subscription' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_active_subscription(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_active_subscription(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'role_available_in_plan' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION role_available_in_plan(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: role_available_in_plan(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'expire_invitations' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION expire_invitations(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: expire_invitations(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_team_availability' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_team_availability(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_team_availability(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'validate_user_role_scope' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION validate_user_role_scope(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: validate_user_role_scope(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_budget_variance' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_budget_variance(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_budget_variance(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_production_financials' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_production_financials(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_production_financials(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_production_summary' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_production_summary(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_production_summary(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'expire_time_limited_roles' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION expire_time_limited_roles(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: expire_time_limited_roles(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'complete_user_onboarding' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION complete_user_onboarding(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: complete_user_onboarding(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'trigger_expire_roles' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION trigger_expire_roles(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: trigger_expire_roles(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_updated_at' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_updated_at(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_updated_at(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_user_highest_role_level' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_user_highest_role_level(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_user_highest_role_level(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'compute_folder_path' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION compute_folder_path(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: compute_folder_path(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_folder_stats' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_folder_stats(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_folder_stats(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'global_search' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION global_search(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: global_search(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'search_assets' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION search_assets(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: search_assets(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'generate_item_qr_code' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION generate_item_qr_code(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: generate_item_qr_code(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'sync_profile_full_name' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION sync_profile_full_name(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: sync_profile_full_name(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_inventory_dashboard_metrics' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_inventory_dashboard_metrics(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_inventory_dashboard_metrics(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'update_inventory_photos' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION update_inventory_photos(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: update_inventory_photos(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_asset_utilization' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_asset_utilization(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_asset_utilization(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'bulk_create_inventory_items' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION bulk_create_inventory_items(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: bulk_create_inventory_items(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'calculate_production_health' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION calculate_production_health(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: calculate_production_health(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'cleanup_inventory_photos' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION cleanup_inventory_photos(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: cleanup_inventory_photos(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'export_inventory_data' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION export_inventory_data(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: export_inventory_data(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_asset_availability' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_asset_availability(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_asset_availability(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_workspace_dashboard' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_workspace_dashboard(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_workspace_dashboard(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'check_schedule_conflict' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION check_schedule_conflict(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: check_schedule_conflict(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'has_permission' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION has_permission(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: has_permission(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'search_inventory_by_code' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION search_inventory_by_code(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: search_inventory_by_code(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'refresh_timezone_cache' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION refresh_timezone_cache(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: refresh_timezone_cache(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'transfer_inventory_stock' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION transfer_inventory_stock(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: transfer_inventory_stock(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_item_movement_history' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_item_movement_history(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_item_movement_history(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'adjust_inventory_stock' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION adjust_inventory_stock(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: adjust_inventory_stock(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'is_workspace_member_optimized' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION is_workspace_member_optimized(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: is_workspace_member_optimized(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'is_org_member_optimized' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION is_org_member_optimized(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: is_org_member_optimized(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'is_org_admin_optimized' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION is_org_admin_optimized(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: is_org_admin_optimized(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'search_assets_by_category' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION search_assets_by_category(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: search_assets_by_category(%)' , func_sig;
    END IF;
END $$;

DO $$
DECLARE
    func_sig TEXT;
BEGIN
    SELECT pg_get_function_identity_arguments(oid) INTO func_sig
    FROM pg_proc 
    WHERE proname = 'get_slow_queries' AND pronamespace = 'public'::regnamespace
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION get_slow_queries(%s) SET search_path = ''''', func_sig);
        RAISE NOTICE 'Fixed: get_slow_queries(%)' , func_sig;
    END IF;
END $$;


-- Done!

-- =====================================================
-- PART 2: FIX SECURITY DEFINER VIEWS (IF THEY EXIST)
-- =====================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'stock_movement_summary') THEN
        DROP VIEW stock_movement_summary CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'catalog_statistics') THEN
        DROP VIEW catalog_statistics CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'active_alerts_summary') THEN
        DROP VIEW active_alerts_summary CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'items_requiring_attention') THEN
        DROP VIEW items_requiring_attention CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'inventory_valuation_by_folder') THEN
        DROP VIEW inventory_valuation_by_folder CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'catalog_by_category') THEN
        DROP VIEW catalog_by_category CASCADE;
    END IF;
END $$;

-- =====================================================
-- PART 3: MOVE PG_TRGM EXTENSION
-- =====================================================

DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- =====================================================
-- PART 4: RESTRICT MATERIALIZED VIEW ACCESS
-- =====================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews WHERE matviewname = 'cached_timezone_names') THEN
        REVOKE ALL ON cached_timezone_names FROM anon;
        REVOKE ALL ON cached_timezone_names FROM authenticated;
        GRANT SELECT ON cached_timezone_names TO service_role;
    END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
