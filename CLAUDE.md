# AXIOM OS — AUTONOMOUS BUILD SPEC
# Claude Code reads this file and builds the complete application without asking questions.
# Run: cd scratch/axiom && claude
# Last updated: 2026-03-22

---

## WHO YOU ARE BUILDING FOR

Alan Augustin — Founder, Juniper Rose Investments & Holdings, Sarasota FL.
Product: Axiom OS — Neural Infrastructure Runtime for CRE Development.
Stack: React + Vite + TypeScript (frontend) | FastAPI + Python (backend) | Supabase (DB + Edge) | Vercel (deploy)
Brand: #07070e bg | #0d0d1a surface | #e8b84b gold | Syne 800 + DM Mono + Instrument Sans

---

## YOUR MISSION

Axiom OS V1 exists but has critical bugs and the wrong component rendered in production.
Your job: fix all P0/P1 issues, ensure the V1 modular app is live, and build the V5 neural scaffold.
Work autonomously. Fix errors as they appear. Do not ask for clarification. Ship.

---

## PHASE 0 — IMMEDIATE FIXES (do these first, in order)

### Fix 1: Activate V1 Architecture (5 min)
File: `frontend/src/main.tsx`
Find: `const USE_V1_ARCHITECTURE = false`
Change to: `const USE_V1_ARCHITECTURE = true`
Verify: `npm run build` passes. V1 modular app is now what users see.

### Fix 2: Supervisor Webhook URL (10 min)
File: `supabase/migrations/20260303050000_deals_supervisor_webhook.sql`
Find: `http://supervisor-agent:54321/functions/v1/supervisor-agent`
Replace: `https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent`

### Fix 3: Remove Hardcoded Anon Key (30 min)
File: `frontend/src/v1/lib/supabase.ts`
Remove the hardcoded `SUPA_KEY` string.
Replace with: `const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY`
Add to `.env.example`: `VITE_SUPABASE_ANON_KEY=your_anon_key_here`
Verify: no key strings in source, only env var references.

### Fix 4: Scope CORS (5 min)
File: `backend/app.py` line 58
Find: `allow_origins=["*"]`
Replace: `allow_origins=[os.getenv("FRONTEND_URL", "https://axiom-os.vercel.app")]`
Add `import os` if not present.

### Fix 5: Replace Debug Prints (10 min)
File: `backend/axiom_engine/agents/orchestrator.py` and `backend/app.py`
Find all: `print(f"DEBUG:`
Replace with: `logger.debug(` (add `import logging; logger = logging.getLogger(__name__)` at top of each file)

### Fix 6: Archive Legacy Monoliths (10 min)
```bash
mkdir -p frontend/src/archive
mv frontend/src/AxiomOS_v16_fixed.jsx frontend/src/archive/
mv frontend/src/AxiomOS_v17.jsx frontend/src/archive/
mv frontend/src/AxiomOS_v19_clean.jsx frontend/src/archive/
mv frontend/src/AxiomOS_v20.jsx frontend/src/archive/
mv AxiomOS_v17.jsx archive/ 2>/dev/null || true
mv AxiomOS_v17.css archive/ 2>/dev/null || true
mv App.jsx archive/ 2>/dev/null || true
```

### Fix 7: Clean Empty Migrations (5 min)
```bash
# In supabase/migrations/, delete all files containing only:
# "-- remote migration placeholder"
# Keep all files with real SQL content.
```

### Fix 8: Merge Context Directories (1 hr)
- Audit `frontend/src/context/` vs `frontend/src/contexts/`
- Keep the more complete version of each context
- Update all imports project-wide to use `context/` (singular)
- Delete `contexts/` directory when done

### Fix 9: Consolidate Supabase Client (2 hrs)
- Remove `frontend/src/v1/lib/supabase.ts` (hand-rolled fetch wrapper)
- Update all imports to use `frontend/src/lib/supabaseClient.ts` (SDK)
- Verify realtime subscriptions still work in `AuditLog.tsx`
- Verify auth still works in all auth-gated components


---

## PHASE 1 — DEAL ANALYSES TABLE (1 hr)

Replace the notes-blob anti-pattern with a proper structured table.

### Migration: `supabase/migrations/v1_fix_deal_analyses.sql`
```sql
-- Create deal_analyses table
CREATE TABLE IF NOT EXISTS deal_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  report_text TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deal_analyses_deal_id ON deal_analyses(deal_id);
CREATE INDEX idx_deal_analyses_agent_type ON deal_analyses(agent_type);
CREATE INDEX idx_deal_analyses_created_at ON deal_analyses(created_at DESC);

-- RLS
ALTER TABLE deal_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members can read their deal analyses"
  ON deal_analyses FOR SELECT
  USING (
    deal_id IN (
      SELECT id FROM deals WHERE org_id = (
        SELECT org_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );
CREATE POLICY "org members can insert deal analyses"
  ON deal_analyses FOR INSERT
  WITH CHECK (
    deal_id IN (
      SELECT id FROM deals WHERE org_id = (
        SELECT org_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );
```

### Update orchestrator.py
In `backend/axiom_engine/agents/orchestrator.py`:
- Remove the pattern: `new_notes = current_notes + formatted_note; supabase.table("deals").update({"notes": new_notes})...`
- Replace with:
```python
supabase.table("deal_analyses").insert({
    "deal_id": deal_id,
    "agent_type": agent_name,
    "report_text": report_text,
    "model": model_used,
    "tokens_used": tokens
}).execute()
```

---

## PHASE 2 — ASYNC AGENT PIPELINE (4 hrs)

Parallelize the 8-agent chain. Current: 40-64s serial. Target: ~8-12s parallel.

### Refactor `backend/axiom_engine/agents/orchestrator.py`

```python
import asyncio
import logging

logger = logging.getLogger(__name__)

# Agents that can run in parallel (no dependencies on each other):
PARALLEL_GROUP_1 = ["market_researcher", "valuator", "legal_compliance"]
# Agents that depend on Group 1 results:
SEQUENTIAL_GROUP_2 = ["strategist", "risk_officer"]
# Final synthesis agents:
SEQUENTIAL_GROUP_3 = ["capital_raiser", "debt_capital_markets", "skeptic"]

async def process_deal(deal_id: str, deal_data: dict) -> dict:
    """
    Parallel agent execution with Supabase Realtime progress signals.
    """
    results = {}

    # Fire Group 1 in parallel
    async def run_agent(name: str, context: dict):
        result = await call_llm_agent(name, context)
        # Emit progress signal
        supabase.table("signals").insert({
            "type": "agent_completed",
            "source_table": "deals",
            "source_id": deal_id,
            "payload": {"agent": name, "status": "done"}
        }).execute()
        # Write to deal_analyses
        supabase.table("deal_analyses").insert({
            "deal_id": deal_id,
            "agent_type": name,
            "report_text": result["text"],
            "model": result["model"],
            "tokens_used": result.get("tokens")
        }).execute()
        return name, result

    group1_results = await asyncio.gather(
        *[run_agent(name, deal_data) for name in PARALLEL_GROUP_1]
    )
    for name, result in group1_results:
        results[name] = result

    # Group 2 uses Group 1 context
    combined_context = {**deal_data, "prior_analysis": results}
    group2_results = await asyncio.gather(
        *[run_agent(name, combined_context) for name in SEQUENTIAL_GROUP_2]
    )
    for name, result in group2_results:
        results[name] = result

    # Final synthesis
    final_context = {**combined_context, "risk_analysis": results}
    for name in SEQUENTIAL_GROUP_3:
        _, result = await run_agent(name, final_context)
        results[name] = result
        final_context[name] = result

    return results
```

---

## PHASE 3 — V5 NEURAL LAYER (separate dev branch)

Create Supabase dev branch, build all V5 tables.

### Step 1: Create dev branch
```bash
supabase branches create v5-neural --project-ref ubdhpacoqmlxudcvhyuu
```

### Step 2: Migration `v5_enable_vector.sql`
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to intel_records
ALTER TABLE intel_records ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Semantic memory search function
CREATE OR REPLACE FUNCTION find_similar_actions(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.75,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  deal_id UUID,
  action_type TEXT,
  description TEXT,
  outcome TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aa.id,
    aa.deal_id,
    aa.action_type,
    aa.description,
    aa.outcome,
    1 - (aa.embedding <=> query_embedding) AS similarity
  FROM agent_actions aa
  WHERE 1 - (aa.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```


### Step 3: Migration `v5_neural_layer.sql`
```sql
-- Neural & Agent Layer Tables

CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN (
    'new_deal_packet','risk_updated','bim_updated',
    'mitigation_activated','agent_completed','agent_failed'
  )),
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  payload JSONB DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_signals_type ON signals(type);
CREATE INDEX idx_signals_source ON signals(source_table, source_id);
CREATE INDEX idx_signals_created ON signals(created_at DESC);

CREATE TABLE IF NOT EXISTS risk_graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  feature_matrix JSONB DEFAULT '{}',
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_risk_graphs_deal ON risk_graphs(deal_id);

CREATE TABLE IF NOT EXISTS risk_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  risk_type TEXT NOT NULL,
  predicted_prob NUMERIC(5,4) NOT NULL,
  actual_outcome BOOLEAN,
  brier_score NUMERIC(5,4),
  model_version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_risk_events_deal ON risk_events(deal_id);

CREATE TABLE IF NOT EXISTS agent_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_agent_actions_deal ON agent_actions(deal_id);
CREATE INDEX idx_agent_actions_embedding ON agent_actions
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE IF NOT EXISTS project_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  predicted_irr NUMERIC(8,4),
  actual_irr NUMERIC(8,4),
  delta NUMERIC(8,4) GENERATED ALWAYS AS (actual_irr - predicted_irr) STORED,
  lessons_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_governance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  autonomy_mode TEXT NOT NULL DEFAULT 'supervised'
    CHECK (autonomy_mode IN ('off','supervised','autonomous')),
  max_auto_cost_impact NUMERIC DEFAULT 50000,
  escalation_threshold NUMERIC DEFAULT 0.85,
  approved_agents TEXT[] DEFAULT ARRAY['deal_screener'],
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_governance_org ON portfolio_governance(org_id);

-- Add GNN score column to risks
ALTER TABLE risks ADD COLUMN IF NOT EXISTS gnn_risk_score NUMERIC(5,4);

-- Enable RLS on all new tables
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_governance ENABLE ROW LEVEL SECURITY;
```

### Step 4: Migration `v5_construction_layer.sql`
```sql
CREATE TABLE IF NOT EXISTS bim_extracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  speckle_stream_id TEXT NOT NULL,
  object_type TEXT NOT NULL,
  geometry JSONB DEFAULT '{}',
  properties JSONB DEFAULT '{}',
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_bim_project ON bim_extracts(project_id);
CREATE INDEX idx_bim_stream ON bim_extracts(speckle_stream_id);

CREATE TABLE IF NOT EXISTS workflow_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  procore_task_id TEXT,
  title TEXT NOT NULL,
  phase TEXT,
  assignee TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','completed','blocked')),
  synced_at TIMESTAMPTZ
);
CREATE INDEX idx_workflow_project ON workflow_tasks(project_id);
CREATE INDEX idx_workflow_status ON workflow_tasks(status);

CREATE TABLE IF NOT EXISTS site_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  capture_date DATE NOT NULL,
  image_url TEXT NOT NULL,
  embedding vector(1536),
  ai_summary TEXT,
  flagged_issues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_site_plans_project ON site_plans(project_id);

ALTER TABLE bim_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_plans ENABLE ROW LEVEL SECURITY;
```


### Step 5: Migration `v5_tax_layer.sql`
```sql
CREATE TABLE IF NOT EXISTS tax_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jurisdiction TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('property','transfer','income','special')),
  rate NUMERIC(8,6) NOT NULL,
  description TEXT,
  effective_date DATE NOT NULL,
  sunset_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tax_codes_jurisdiction ON tax_codes(jurisdiction);
CREATE INDEX idx_tax_codes_category ON tax_codes(category);

CREATE TABLE IF NOT EXISTS property_tax_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  tax_year INTEGER NOT NULL,
  assessed_value NUMERIC(15,2),
  tax_amount NUMERIC(12,2),
  mill_rate NUMERIC(8,4),
  exemptions JSONB DEFAULT '{}',
  parcel_number TEXT,
  county TEXT,
  state TEXT(2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  appraisal_district TEXT,
  assessed_land_value NUMERIC(15,2),
  assessed_improvement_value NUMERIC(15,2),
  total_assessed NUMERIC(15,2) GENERATED ALWAYS AS
    (assessed_land_value + assessed_improvement_value) STORED,
  assessment_date DATE,
  protest_deadline DATE,
  protested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunity_zones (
  tract_id TEXT PRIMARY KEY,
  state TEXT(2) NOT NULL,
  county TEXT NOT NULL,
  designated_date DATE NOT NULL DEFAULT '2018-06-14',
  expires_at DATE NOT NULL DEFAULT '2028-12-31',
  geometry JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_oz_state ON opportunity_zones(state);

CREATE TABLE IF NOT EXISTS deal_oz_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  tract_id TEXT NOT NULL REFERENCES opportunity_zones(tract_id),
  capital_gain_deferred NUMERIC(15,2),
  step_up_pct NUMERIC(5,4) DEFAULT 0.15,
  exclusion_eligible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS depreciation_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  asset_class TEXT NOT NULL,
  cost_basis NUMERIC(15,2) NOT NULL,
  useful_life_years NUMERIC(5,1) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('macrs','straight_line','bonus')),
  placed_in_service_date DATE NOT NULL,
  annual_deduction NUMERIC(12,2),
  remaining_basis NUMERIC(15,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tax_1031_exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  relinquished_deal_id UUID REFERENCES deals(id),
  replacement_deal_id UUID REFERENCES deals(id),
  qi_name TEXT,
  qi_contact TEXT,
  identification_deadline DATE,
  exchange_deadline DATE,
  boot_amount NUMERIC(12,2) DEFAULT 0,
  deferred_gain NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','identified','completed','failed','reversed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE property_tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_oz_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE depreciation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_1031_exchanges ENABLE ROW LEVEL SECURITY;
```

---

## PHASE 4 — BACKEND V5 MODULES

### `backend/axiom_engine/neural/gnn_risk.py`
```python
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
import logging

logger = logging.getLogger(__name__)

class RiskGNN(torch.nn.Module):
    def __init__(self, num_features: int = 12, hidden: int = 64, num_classes: int = 1):
        super().__init__()
        self.conv1 = GCNConv(num_features, hidden)
        self.conv2 = GCNConv(hidden, num_classes)

    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, training=self.training)
        return torch.sigmoid(self.conv2(x, edge_index))

def build_risk_graph(deal: dict) -> dict:
    """Extract node/edge features from deal fields for GNN input."""
    nodes = [
        [deal.get("irr", 0), deal.get("cap_rate", 0), deal.get("ltv", 0)],
        [deal.get("market_vacancy", 0), deal.get("absorption_rate", 0), 0],
        [deal.get("permit_risk", 0), deal.get("entitlement_risk", 0), 0],
        [deal.get("interest_rate", 0), deal.get("treasury_10yr", 0), 0],
    ]
    edges = [[0,1],[1,0],[0,2],[2,0],[1,3],[3,1],[2,3],[3,2]]
    return {"nodes": nodes, "edges": edges}

def score_deal(deal_id: str, deal: dict, supabase) -> float:
    """Run GNN inference and write results to Supabase."""
    try:
        graph = build_risk_graph(deal)
        model = RiskGNN()
        model.eval()
        x = torch.tensor(graph["nodes"], dtype=torch.float)
        edge_index = torch.tensor(graph["edges"], dtype=torch.long).t().contiguous()
        with torch.no_grad():
            risk_score = float(model(x, edge_index).mean().item())
        supabase.table("risk_graphs").insert({
            "deal_id": deal_id,
            "nodes": graph["nodes"],
            "edges": graph["edges"],
            "feature_matrix": {}
        }).execute()
        supabase.table("risks").update(
            {"gnn_risk_score": risk_score}
        ).eq("deal_id", deal_id).execute()
        logger.info(f"GNN scored deal {deal_id}: {risk_score:.4f}")
        return risk_score
    except Exception as e:
        logger.error(f"GNN scoring failed for {deal_id}: {e}")
        return 0.5
```


### `backend/axiom_engine/memory/semantic_store.py`
```python
from openai import AsyncOpenAI
import logging

logger = logging.getLogger(__name__)
client = AsyncOpenAI()

async def embed(text: str) -> list[float]:
    response = await client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

async def store_action(action: dict, supabase) -> str:
    embedding = await embed(f"{action['action_type']}: {action['description']}")
    result = supabase.table("agent_actions").insert({
        **action,
        "embedding": embedding
    }).execute()
    return result.data[0]["id"]

async def find_similar(query: str, supabase, threshold: float = 0.75, limit: int = 3):
    embedding = await embed(query)
    result = supabase.rpc("find_similar_actions", {
        "query_embedding": embedding,
        "similarity_threshold": threshold,
        "match_count": limit
    }).execute()
    return result.data
```

### `backend/axiom_engine/tax/depreciation.py`
```python
from datetime import date
from typing import Literal
import logging

logger = logging.getLogger(__name__)

MACRS_LIVES = {
    "residential": 27.5,
    "commercial": 39.0,
    "land_improvements": 15.0,
    "equipment_5yr": 5.0,
    "equipment_7yr": 7.0,
}

BONUS_RATES = {
    2023: 0.80,
    2024: 0.60,
    2025: 0.40,
    2026: 0.20,
    2027: 0.00,
}

def build_macrs_schedule(
    cost_basis: float,
    asset_class: str,
    placed_in_service_date: date,
    method: Literal["macrs", "straight_line", "bonus"] = "macrs"
) -> list[dict]:
    useful_life = MACRS_LIVES.get(asset_class, 39.0)
    year = placed_in_service_date.year
    schedule = []
    remaining = cost_basis

    if method == "bonus":
        bonus_rate = BONUS_RATES.get(year, 0.0)
        first_year = cost_basis * bonus_rate
        schedule.append({
            "year": year,
            "deduction": round(first_year, 2),
            "remaining_basis": round(cost_basis - first_year, 2),
            "method": f"bonus_{int(bonus_rate*100)}pct"
        })
        remaining -= first_year
        cost_basis = remaining
        method = "straight_line"
        useful_life = max(useful_life - 1, 1)
        year += 1

    annual = cost_basis / useful_life
    for i in range(int(useful_life)):
        deduction = min(annual, remaining)
        remaining = max(0, remaining - deduction)
        schedule.append({
            "year": year + i,
            "deduction": round(deduction, 2),
            "remaining_basis": round(remaining, 2),
            "method": method
        })
        if remaining <= 0:
            break

    return schedule
```

---

## PHASE 5 — FRONTEND V5 SCAFFOLD

Create `frontend/src/v5/` directory structure:

```bash
mkdir -p frontend/src/v5/features/neural
mkdir -p frontend/src/v5/features/tax
mkdir -p frontend/src/v5/features/gis
mkdir -p frontend/src/v5/features/governance
mkdir -p frontend/src/v5/components/ui
```

### `frontend/src/v5/features/neural/SwarmEngine.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

interface AgentTask {
  id: string;
  agent_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  deal_id: string;
  started_at?: Date;
  completed_at?: Date;
  result?: string;
}

export class SwarmEngine {
  private tasks = new Map<string, AgentTask>();
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  private onUpdate?: (tasks: AgentTask[]) => void;

  constructor(onUpdate?: (tasks: AgentTask[]) => void) {
    this.onUpdate = onUpdate;
  }

  subscribe(dealId: string) {
    return this.supabase
      .channel(`deal-signals-${dealId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'signals',
        filter: `source_id=eq.${dealId}`
      }, (payload) => {
        const signal = payload.new as any;
        if (signal.type === 'agent_completed' || signal.type === 'agent_failed') {
          const taskId = signal.payload?.agent;
          if (taskId && this.tasks.has(taskId)) {
            const task = this.tasks.get(taskId)!;
            task.status = signal.type === 'agent_completed' ? 'completed' : 'failed';
            task.completed_at = new Date();
            this.tasks.set(taskId, task);
            this.onUpdate?.(Array.from(this.tasks.values()));
          }
        }
      })
      .subscribe();
  }

  initTasks(dealId: string, agentTypes: string[]) {
    for (const agent of agentTypes) {
      this.tasks.set(agent, {
        id: agent,
        agent_type: agent,
        status: 'pending',
        deal_id: dealId
      });
    }
    this.onUpdate?.(Array.from(this.tasks.values()));
  }

  getTasks(): AgentTask[] {
    return Array.from(this.tasks.values());
  }
}
```


### `frontend/src/v5/features/neural/AgentHandoff.tsx`
```tsx
import { useEffect, useState } from 'react';
import { SwarmEngine } from './SwarmEngine';

const AGENT_LABELS: Record<string, string> = {
  market_researcher: 'Market Research',
  valuator: 'Valuation',
  legal_compliance: 'Legal & Compliance',
  strategist: 'Strategy',
  risk_officer: 'Risk Assessment',
  capital_raiser: 'Capital Raise (Equity)',
  debt_capital_markets: 'Debt Capital Markets',
  skeptic: 'IC Memo Synthesis',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#3d4454',
  running: '#4ea8de',
  completed: '#4ade80',
  failed: '#f87171',
};

interface Props {
  dealId: string;
}

export function AgentHandoff({ dealId }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const engine = new SwarmEngine(setTasks);
    engine.initTasks(dealId, Object.keys(AGENT_LABELS));
    const channel = engine.subscribe(dealId);
    return () => { channel.unsubscribe(); };
  }, [dealId]);

  return (
    <div style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24 }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#eceaf5', marginBottom: 20 }}>
        Agent Pipeline
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map((task) => (
          <div key={task.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', borderRadius: 8,
            background: '#12121f', border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: STATUS_COLORS[task.status],
              boxShadow: task.status === 'running' ? `0 0 8px ${STATUS_COLORS.running}` : 'none',
              flexShrink: 0
            }} />
            <span style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#eceaf5', fontSize: 14, flex: 1 }}>
              {AGENT_LABELS[task.agent_type] || task.agent_type}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', color: '#7a8494', fontSize: 12 }}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## PHASE 6 — TESTS

### `backend/tests/test_finance.py`
```python
import pytest
from axiom_engine.finance import calculate_irr, calculate_npv, calculate_cap_rate

def test_irr_basic():
    cash_flows = [-1_000_000, 150_000, 150_000, 150_000, 150_000, 1_200_000]
    irr = calculate_irr(cash_flows)
    assert 0.15 < irr < 0.25, f"Expected IRR ~20%, got {irr:.2%}"

def test_npv_positive_at_8_pct():
    cash_flows = [-500_000, 60_000, 60_000, 60_000, 560_000]
    npv = calculate_npv(cash_flows, discount_rate=0.08)
    assert npv > 0, f"Expected positive NPV at 8%, got {npv}"

def test_cap_rate():
    noi = 120_000
    value = 1_500_000
    cap = calculate_cap_rate(noi, value)
    assert abs(cap - 0.08) < 0.001, f"Expected cap rate 8%, got {cap:.2%}"

def test_irr_invalid_no_sign_change():
    with pytest.raises(ValueError):
        calculate_irr([100, 200, 300])
```

### `backend/tests/test_depreciation.py`
```python
import pytest
from datetime import date
from axiom_engine.tax.depreciation import build_macrs_schedule

def test_residential_27_5_year():
    schedule = build_macrs_schedule(
        cost_basis=1_000_000,
        asset_class="residential",
        placed_in_service_date=date(2026, 1, 1),
        method="straight_line"
    )
    assert len(schedule) == 28  # 27.5yr rounds up to 28 periods
    annual = schedule[0]["deduction"]
    assert abs(annual - 36_364) < 100, f"Expected ~$36,364/yr, got {annual}"

def test_bonus_depreciation_2026():
    schedule = build_macrs_schedule(
        cost_basis=500_000,
        asset_class="equipment_5yr",
        placed_in_service_date=date(2026, 3, 1),
        method="bonus"
    )
    first_year = schedule[0]["deduction"]
    assert abs(first_year - 100_000) < 1, f"Expected $100k (20% bonus), got {first_year}"

def test_macrs_totals_equal_basis():
    basis = 750_000
    schedule = build_macrs_schedule(
        cost_basis=basis,
        asset_class="commercial",
        placed_in_service_date=date(2026, 1, 1),
        method="straight_line"
    )
    total = sum(s["deduction"] for s in schedule)
    assert abs(total - basis) < 1, f"Total deductions {total} != basis {basis}"
```

---

## VERIFICATION SEQUENCE

After completing each phase, run:

```bash
# Phase 0 verification
npm run build                              # Must be 0 errors
git diff --stat                            # Review what changed

# Phase 1 verification
supabase db diff --schema public           # Confirm deal_analyses table
supabase db push --linked                  # Push to dev branch

# Phase 2 verification
pytest tests/test_orchestrator.py -v      # Mock LLM, parallel execution
# Manually: trigger analysis → signals table shows overlapping agent timestamps

# Phase 3-4 verification
pytest tests/test_finance.py -v
pytest tests/test_depreciation.py -v

# Final verification
npm run build                              # 0 errors
vercel --prod                             # Deploy
# Paste Vercel URL in chat
```

---

## FILE OUTPUT SUMMARY

When complete, these files must exist:

```
scratch/axiom/
├── CLAUDE.md                              ← this file
├── frontend/src/main.tsx                  ← USE_V1_ARCHITECTURE = true
├── frontend/src/archive/                  ← monolith JSX files archived
├── frontend/src/v5/
│   ├── features/neural/SwarmEngine.ts
│   ├── features/neural/AgentHandoff.tsx
│   ├── features/tax/TaxIntelPanel.tsx
│   ├── features/gis/SiteMap3D.tsx
│   └── features/governance/PortfolioGovernance.tsx
├── backend/axiom_engine/
│   ├── neural/gnn_risk.py
│   ├── neural/tts_improve.py
│   ├── memory/semantic_store.py
│   ├── tax/depreciation.py
│   ├── tax/opportunity_zones.py
│   ├── tax/assessor.py
│   └── routers/tax.py
├── backend/tests/
│   ├── test_finance.py
│   ├── test_depreciation.py
│   └── test_orchestrator.py
└── supabase/migrations/
    ├── v1_fix_deal_analyses.sql
    ├── v5_enable_vector.sql
    ├── v5_neural_layer.sql
    ├── v5_construction_layer.sql
    └── v5_tax_layer.sql
```

Build sequentially through phases. Fix errors as they appear. Ship.
