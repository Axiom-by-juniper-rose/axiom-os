-- Axiom OS V2: Autonomous Agent Hookup for Deals table
-- When a user uploads an OM, a new deal is created in the deals table.
-- We want the supervisor-agent to automatically fetch comps and run underwriting on these deals as well.
CREATE TRIGGER trigger_deals_supervisor_agent
AFTER
INSERT ON "public"."deals" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"(
        'http://supervisor-agent:54321/functions/v1/supervisor-agent',
        'POST',
        '{"Content-type":"application/json"}',
        '{}',
        '1000'
    );