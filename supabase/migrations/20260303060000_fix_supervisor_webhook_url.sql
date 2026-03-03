-- P0 Fix: Supervisor webhook URL corrected from local Docker to production Supabase
-- Drops the broken localhost trigger and replaces with the correct production URL.
DROP TRIGGER IF EXISTS trigger_deals_supervisor_agent ON "public"."deals";
DROP TRIGGER IF EXISTS trigger_supervisor_agent ON "public"."projects";
-- Deals table trigger (production URL)
CREATE TRIGGER trigger_deals_supervisor_agent
AFTER
INSERT ON "public"."deals" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"(
        'https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent',
        'POST',
        '{"Content-type":"application/json"}',
        '{}',
        '5000'
    );
-- Projects table trigger (production URL)
CREATE TRIGGER trigger_supervisor_agent
AFTER
INSERT ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"(
        'https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent',
        'POST',
        '{"Content-type":"application/json"}',
        '{}',
        '5000'
    );