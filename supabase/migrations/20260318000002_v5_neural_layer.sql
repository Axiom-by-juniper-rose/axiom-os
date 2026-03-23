-- V5 Migration 2: Neural & Agent Layer
-- Applied: 2026-03-18

-- ENUMs
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'signal_type') THEN
    CREATE TYPE public.signal_type AS ENUM (
      'new_deal_packet','risk_updated','bim_updated',
      'agent_completed','mitigation_activated','deal_advanced'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'autonomy_mode') THEN
    CREATE TYPE public.autonomy_mode AS ENUM (
      'manual','assisted','supervised','autonomous'
    );
  END IF;
END$$;

-- deal_analyses: structured agent output (replaces notes blob)
CREATE TABLE IF NOT EXISTS public.deal_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN (
    'market_researcher','valuator','strategist','risk_officer',
    'capital_raiser','debt_capital','legal','skeptic','analyst'
  )),
  report_text TEXT,
  model TEXT,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  run_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_deal_analyses_deal_id ON public.deal_analyses(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_analyses_run_id ON public.deal_analyses(run_id);

-- v5_events: system event bus (named v5_events; 'signals' taken by market data table)
CREATE TABLE IF NOT EXISTS public.v5_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type public.signal_type NOT NULL,
  source_table TEXT,
  source_id UUID,
  payload JSONB DEFAULT '{}',
  org_id UUID REFERENCES public.organizations(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_v5_events_type ON public.v5_events(event_type);
CREATE INDEX IF NOT EXISTS idx_v5_events_source ON public.v5_events(source_table, source_id);

-- risk_graphs: GNN node/edge data
CREATE TABLE IF NOT EXISTS public.risk_graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  feature_matrix JSONB DEFAULT '{}',
  computed_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_risk_graphs_deal_id ON public.risk_graphs(deal_id);

-- risk_events: calibration tracking
CREATE TABLE IF NOT EXISTS public.risk_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL,
  predicted_prob NUMERIC CHECK (predicted_prob BETWEEN 0 AND 1),
  confidence NUMERIC CHECK (confidence BETWEEN 0 AND 1),
  actual_outcome BOOLEAN,
  brier_score NUMERIC,
  tts_applied BOOLEAN DEFAULT false,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_risk_events_deal_id ON public.risk_events(deal_id);

-- agent_actions: semantic memory store (pgvector)
-- NOTE: ivfflat index must be added manually once rows exist (requires data)
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  org_id UUID REFERENCES public.organizations(id),
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agent_actions_deal_id ON public.agent_actions(deal_id);
-- Run after seeding data:
-- CREATE INDEX idx_agent_actions_embedding ON public.agent_actions
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- project_outcomes: closed-loop learning
CREATE TABLE IF NOT EXISTS public.project_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  predicted_irr NUMERIC,
  actual_irr NUMERIC,
  irr_delta NUMERIC GENERATED ALWAYS AS (actual_irr - predicted_irr) STORED,
  predicted_margin NUMERIC,
  actual_margin NUMERIC,
  lessons_text TEXT,
  outcome_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- portfolio_governance: autonomy controls per org
CREATE TABLE IF NOT EXISTS public.portfolio_governance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  autonomy_mode public.autonomy_mode DEFAULT 'assisted',
  max_auto_cost_impact NUMERIC DEFAULT 50000,
  escalation_threshold NUMERIC DEFAULT 0.75,
  approved_agents TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extend risks table with GNN columns
ALTER TABLE public.risks
  ADD COLUMN IF NOT EXISTS gnn_risk_score NUMERIC,
  ADD COLUMN IF NOT EXISTS gnn_computed_at TIMESTAMPTZ;
