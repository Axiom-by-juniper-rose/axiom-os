-- ============================================================
-- 20260303070000_rls_policies.sql
-- RLS policies for Phase 4 tables NOT covered by initial schema
-- (initial schema already covers projects, deals, contacts, etc.)
-- ============================================================
-- ─── ENABLE RLS ON PHASE 4 TABLES ───────────────────────────
ALTER TABLE IF EXISTS signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS predictive_economy_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS decision_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scoring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS models ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS model_alerts ENABLE ROW LEVEL SECURITY;
-- ─── SIGNALS (global read — market/macro data for all org users) ──
DROP POLICY IF EXISTS "signals_read_all" ON signals;
CREATE POLICY "signals_read_all" ON signals FOR
SELECT USING (auth.role() = 'authenticated');
-- ─── PREDICTIVE ECONOMY BASELINES (global read) ──────────────
DROP POLICY IF EXISTS "pred_econ_read_all" ON predictive_economy_baselines;
CREATE POLICY "pred_econ_read_all" ON predictive_economy_baselines FOR
SELECT USING (auth.role() = 'authenticated');
-- ─── MODELS REGISTRY (read-only for authenticated) ───────────
DROP POLICY IF EXISTS "models_read_all" ON models;
CREATE POLICY "models_read_all" ON models FOR
SELECT USING (auth.role() = 'authenticated');
-- ─── MODEL ALERTS (read-only for authenticated) ──────────────
DROP POLICY IF EXISTS "model_alerts_read_all" ON model_alerts;
CREATE POLICY "model_alerts_read_all" ON model_alerts FOR
SELECT USING (auth.role() = 'authenticated');
-- ─── SCENARIOS: via project org_id ───────────────────────────
DROP POLICY IF EXISTS "scenarios_org_scoped" ON scenarios;
CREATE POLICY "scenarios_org_scoped" ON scenarios FOR ALL USING (
    project_id IN (
        SELECT id
        FROM public.projects
        WHERE org_id IN (
                SELECT org_id
                FROM public.user_profiles
                WHERE id = (
                        SELECT auth.uid()
                    )
            )
    )
);
-- ─── DECISION ARTIFACTS: via project org_id ──────────────────
DROP POLICY IF EXISTS "artifacts_org_scoped" ON decision_artifacts;
CREATE POLICY "artifacts_org_scoped" ON decision_artifacts FOR ALL USING (
    project_id IN (
        SELECT id
        FROM public.projects
        WHERE org_id IN (
                SELECT org_id
                FROM public.user_profiles
                WHERE id = (
                        SELECT auth.uid()
                    )
            )
    )
);
-- ─── SCORING EVENTS: via project org_id ──────────────────────
DROP POLICY IF EXISTS "scoring_events_org_scoped" ON scoring_events;
CREATE POLICY "scoring_events_org_scoped" ON scoring_events FOR ALL USING (
    project_id IN (
        SELECT id
        FROM public.projects
        WHERE org_id IN (
                SELECT org_id
                FROM public.user_profiles
                WHERE id = (
                        SELECT auth.uid()
                    )
            )
    )
);
-- ─── RISK EVENTS: via project org_id ─────────────────────────
DROP POLICY IF EXISTS "risk_events_org_scoped" ON risk_events;
CREATE POLICY "risk_events_org_scoped" ON risk_events FOR ALL USING (
    project_id IN (
        SELECT id
        FROM public.projects
        WHERE org_id IN (
                SELECT org_id
                FROM public.user_profiles
                WHERE id = (
                        SELECT auth.uid()
                    )
            )
    )
);
-- ─── SECURITY EVENTS: user-scoped (audit trail) ──────────────
DROP POLICY IF EXISTS "security_events_user_scoped" ON security_events;
CREATE POLICY "security_events_user_scoped" ON security_events FOR
SELECT USING (
        user_id = (
            SELECT auth.uid()
        )
    );
-- ─── NOTE ─────────────────────────────────────────────────────
-- Edge functions use service_role key which bypasses RLS.
-- Run: SELECT tablename, policyname FROM pg_policies ORDER BY tablename; 
-- to verify all policies are active.