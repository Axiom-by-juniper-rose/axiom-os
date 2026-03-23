# AXIOM OS — CANONICAL SPECIFICATION
**Single Source of Truth | Juniper Rose Investments & Holdings**
*Version: 2.0 | Date: 2026-03-22 | Status: Definitive*

---

## WHAT AXIOM IS

Axiom OS is a **Neural Infrastructure Runtime for Commercial Real Estate Development** — not a PropTech app, not a dashboard, not a chatbot bolted onto spreadsheets. It is an operating system for the entire development lifecycle: acquisition through construction through asset management, with autonomous AI agents running underneath every workflow.

**The one-sentence version:** You walk a site, Axiom has already geocoded it, fetched the comps, stress-tested the financials against live FRED macro data, and written the IC memo before you get back to the car.

**What makes it structurally different from every competitor:**
Axiom is the only platform that connects all five layers simultaneously — macroeconomic data (FRED), property intelligence (ATTOM/Regrid), spatial analysis (Leaflet/Mapbox/3D), financial modeling (IRR/NPV/MACRS), and multi-agent AI (4 LLM providers) — inside one unified UI with offline field capability.

---

## INFRASTRUCTURE IDENTIFIERS

| Item | Value |
|---|---|
| Supabase Project Ref | `ubdhpacoqmlxudcvhyuu` |
| Vercel Team | `juniper-rose` (ID: `team_k9pMkrpQoIolWK5TG0xkDSXD`) |
| GitHub Repo | `Axiom-by-juniper-rose/axiom-os` |
| Local Repo | `C:\Users\bkala\.gemini\antigravity\scratch\axiom\` |
| Frontend Dev | `http://localhost:5173` (Vite) |
| Backend Dev | `http://localhost:8009/axiom` (FastAPI, founder mode) |
| Brand Colors | `#07070e` bg / `#0d0d1a` surface / `#e8b84b` gold accent |
| Fonts | Syne 800 (display) / DM Mono (mono) / Instrument Sans (body) |

---

## TECHNOLOGY STACK

| Layer | Technology | Deploy Target |
|---|---|---|
| Frontend | React + Vite + TypeScript | Vercel (auto-deploy) |
| Backend | FastAPI + Python | Render / Docker |
| Database | Supabase (Postgres) | Supabase cloud |
| Edge Functions | Deno / TypeScript | Supabase Edge (20 deployed) |
| AI Routing | LLM Proxy (4 providers) | Supabase Edge |
| Cache | Upstash Redis | Edge (comps-fetch) |
| Billing | Stripe (checkout + webhooks) | Live |
| Auth | Supabase Auth (JWT + RLS) | Live |


---

## FEATURE DOMAINS (V1 LIVE)

### Frontend — 11 Domains, 33+ Components (`frontend/src/v1/features/`)

| Domain | Components |
|---|---|
| **CRM** | Contacts, Deals, Deal Analyzer, Prospecting Engine |
| **Finance** | Financials, Calc Hub (IRR/NPV/Cap Rate), Invoices |
| **Site** | Site Analysis, Entitlements, Infrastructure, Concept Design, Site Map (Leaflet) |
| **Intel** | Market Intel, MLS Listings, Data Intel, Jurisdiction Intel |
| **Execution** | Field Dashboard (offline-first), Project Management, Risk Registry, Site Mgmt, Vendor Network, Professional Network |
| **Workspace** | Notes, Calendar, Email, Spreadsheets, Workflows, Resource Center |
| **Output** | Copilot, Neural OS, AI Agent Hub, Reports, Deal Teaser |
| **System** | Settings, Connectors, Billing, Legal & Compliance, Audit Log |

**Shell features:** Accordion sidebar, ⌘K command palette, split-view, floating panel detach, live ticker strip (WebSocket: 10yr Treasury + SOFR), chat panel, meeting recorder, in-browser VoIP dialer, auth gate, onboarding wizard, PWA offline support.

### Backend Agent Pipeline (`backend/axiom_engine/agents/orchestrator.py`)

8 sequential LLM agents (V5 parallelizes with `asyncio.gather`):

1. Market Researcher → live comps + macro context
2. Valuator → IRR, cap rate, exit scenarios
3. Strategist → deal structure recommendation
4. Risk Officer → risk register population
5. Capital Raiser (Equity) → equity stack modeling
6. Debt Capital Markets → debt terms + lender fit
7. Legal / Compliance → zoning, permit, title flags
8. Skeptic → stress-tests all assumptions → final Analyst Memo

Supporting modules: `finance.py`, `parcels.py`, `reporting.py`, `brain.py`, `connectors/rates.py`, `store.py`, `scenarios.py`, `webhooks.py`

### Supabase Edge Functions (20 deployed)

| Function | Purpose | Status |
|---|---|---|
| `llm-proxy` | Multi-provider routing: OpenAI/Anthropic/Groq/Together | ✅ Live |
| `risk-engine` | Real-time risk calculation | ✅ Live |
| `engines-score` | XGBoost deal scoring (stub — needs 500 labeled deals) | ⚠️ Stub |
| `comps-fetch` | CoStar→ATTOM→Regrid→Mock cascade + Upstash cache | ✅ Live |
| `cron-setup` | FRED macro data daily ingest | ✅ Live |
| `stripe-checkout` | Stripe Checkout session creation | ✅ Live |
| `stripe-webhook` | Stripe webhook → update `profiles.subscription_tier` | ✅ Live |
| `om-ingestor` | PDF upload → deal creation via Claude PDF vision | ✅ Live |
| `supervisor-agent` | Autonomous underwriting loop | ⚠️ P0 webhook bug |
| `deal-teaser` | LP-quality IC memo generator | ✅ Live (behind flag) |
| `anthropic-ingestor` | Direct Anthropic `/v1/messages` integration | ✅ Live |
| `audit-log` | Security event logging | ✅ Live |

---

## PRODUCTION STATUS

| Component | Status | Note |
|---|---|---|
| 20 Supabase Edge Functions | ✅ Live | |
| V1 database schema (30 tables) | ✅ Live | |
| Stripe billing | ✅ Live | checkout + portal + webhooks |
| LLM proxy (4 providers) | ✅ Live | |
| OM Ingestor (PDF→Deal) | ✅ Live | needs `ANTHROPIC_API_KEY` env var |
| Supervisor agent | ⚠️ Deployed | P0: webhook URL points to localhost |
| Audit Log UI | ✅ Built | behind `USE_V1_ARCHITECTURE` flag |
| Deal Teaser | ✅ Built | behind `USE_V1_ARCHITECTURE` flag |
| Vercel auto-deploy | ✅ Live | pushes to prod on merge |
| FRED CRON pipeline | ✅ Live | daily macro ingest |
| Upstash Redis cache | ✅ Live | comps-fetch layer |
| **Brier Score** | **0.17** | vs baseline 0.24 — calibration working |


---

## CRITICAL ISSUES — FIX BEFORE ONBOARDING

| Priority | Issue | Fix | Time |
|---|---|---|---|
| 🔴 **P0** | `USE_V1_ARCHITECTURE = false` in `main.tsx` — monolith is live, V1 invisible | Set to `true` | 5 min |
| 🔴 **P0** | Supervisor webhook URL → `localhost:54321` | Change to `https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent` | 10 min |
| 🔴 **P1** | Anon key hardcoded in `src/v1/lib/supabase.ts` | Move to `VITE_SUPABASE_ANON_KEY` env var | 30 min |
| 🔴 **P1** | `allow_origins=["*"]` in `backend/app.py` | Scope to Vercel domain only | 5 min |
| 🟠 **P1** | 8 agents run serially (40-64s per deal) | `asyncio.gather()` + Realtime streaming | 4 hrs |
| 🟠 **P1** | Agent output appended to `notes` text blob | Create `deal_analyses` table | 1 hr |
| 🟡 **P2** | 4 monolith JSX files (494-565KB each) bundled in `src/` | Archive all | 10 min |
| 🟡 **P2** | 26 empty migration stubs | Delete all | 5 min |
| 🟡 **P2** | Dual Supabase client (`supabaseClient.ts` SDK vs hand-rolled) | Consolidate to SDK | 2 hrs |
| 🟡 **P2** | `context/` AND `contexts/` dirs coexist | Merge | 1 hr |
| 🟡 **P2** | No RLS policies in migration files | Export from dashboard | 3 hrs |
| 🔵 **P3** | `print(f"DEBUG:")` in prod orchestrator | Replace with `logging` | 10 min |
| 🔵 **P4** | 10 Dependabot alerts (8 high) | `npm audit fix` | 30 min |

---

## COMPLETE SCHEMA

### Extensions: `uuid-ossp` (live) | `vector` (V5 — not yet enabled)

### V1 Live Tables (30)

`organizations`, `user_profiles`, `projects`, `deals`, `deal_stage_history`, `site_data`, `financial_models`, `loan_terms`, `equity_terms`, `permits`, `risks`, `dd_checklists`, `comps`, `site_tasks`, `intel_records`, `deal_intel_links`, `contacts`, `tenants`, `leases`, `deal_contacts`, `vendors`, `notes`, `calendar_events`, `invoices`, `ai_conversations`, `subscription_events`, `usage_tracking`, `activity_log`, `team_invites`, `pilot_signups`, `market_data_cache`

**V5 modifications to existing tables:**
- `projects` → add `governance_id FK`
- `risks` → add `gnn_risk_score NUMERIC`
- `intel_records` → add `embedding vector(1536)`

### V5 Neural & Agent Layer (7 new tables)

| Table | Key Columns |
|---|---|
| `deal_analyses` | `deal_id`, `agent_type`, `report_text`, `model`, `tokens_used`, `created_at` |
| `signals` | `id`, `type ENUM`, `source_table`, `source_id`, `payload JSONB`, `processed_at` |
| `risk_graphs` | `deal_id`, `nodes JSONB`, `edges JSONB`, `feature_matrix JSONB`, `computed_at` |
| `risk_events` | `deal_id`, `risk_type`, `predicted_prob`, `actual_outcome`, `brier_score`, `model_version` |
| `agent_actions` | `id`, `deal_id`, `action_type`, `description`, `outcome`, `embedding vector(1536)`, `created_at` |
| `project_outcomes` | `project_id`, `predicted_irr`, `actual_irr`, `delta`, `lessons_text`, `created_at` |
| `portfolio_governance` | `org_id`, `autonomy_mode ENUM`, `max_auto_cost_impact`, `escalation_threshold`, `approved_agents TEXT[]` |

### V5 Construction & BIM Layer (3 new tables)

| Table | Key Columns |
|---|---|
| `bim_extracts` | `project_id`, `speckle_stream_id`, `object_type`, `geometry JSONB`, `properties JSONB`, `extracted_at` |
| `workflow_tasks` | `project_id`, `procore_task_id`, `title`, `phase`, `assignee`, `due_date`, `status`, `synced_at` |
| `site_plans` | `project_id`, `capture_date`, `image_url`, `embedding vector(1536)`, `ai_summary`, `flagged_issues JSONB` |

### V5 Tax Intelligence Layer (7 new tables)

| Table | Key Columns |
|---|---|
| `tax_codes` | `jurisdiction`, `code`, `category`, `rate`, `effective_date`, `sunset_date` |
| `property_tax_records` | `deal_id`, `tax_year`, `assessed_value`, `tax_amount`, `mill_rate`, `exemptions JSONB`, `parcel_number` |
| `tax_assessments` | `deal_id`, `appraisal_district`, `assessed_land_value`, `total_assessed`, `protest_deadline`, `protested` |
| `opportunity_zones` | `tract_id`, `state`, `county`, `designated_date`, `expires_at`, `geometry JSONB` |
| `deal_oz_links` | `deal_id`, `tract_id`, `capital_gain_deferred`, `step_up_pct`, `exclusion_eligible` |
| `depreciation_schedules` | `project_id`, `asset_class`, `cost_basis`, `useful_life_years`, `method`, `placed_in_service_date`, `annual_deduction` |
| `tax_1031_exchanges` | `org_id`, `relinquished_deal_id`, `replacement_deal_id`, `identification_deadline`, `exchange_deadline`, `boot_amount`, `deferred_gain` |

**Total: 30 V1 + 17 V5 = 47 tables | 4 V5 migrations | 3 RPC functions**


---

## V5 NEURAL ARCHITECTURE

### Four-Phase Roadmap

| Phase | Deliverable | Technology |
|---|---|---|
| 1 | GNN Risk Engine | PyTorch Geometric → ONNX → Vercel Edge (<500ms) |
| 2 | TT-SI + Calibration | Claude in-context synthetic examples + Brier scoring |
| 3 | Semantic Memory | Supabase pgvector, 1536-dim embeddings |
| 4 | CAD/BIM Connectors | Speckle + Procore + OpenSpace APIs |

### GNN Risk Engine
```python
class RiskGNN(nn.Module):
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        return torch.sigmoid(self.conv2(x, edge_index))  # risk probabilities
# build_risk_graph(deal) → node/edge feature extraction
# score_deal(deal_id) → writes risk_graphs + updates risks.gnn_risk_score
# export ONNX → Vercel Edge inference
```

### TT-SI (Test-Time Self-Improvement)
```typescript
if (risk.confidence < 0.7) {
  const syntheticExamples = await claude.generateSynthetic(risk);
  improvedRisk = await claude.refineWithContext(syntheticExamples);
  // writes calibration row to risk_events
}
```

### Semantic Memory
```sql
SELECT * FROM find_similar_actions(query_embedding, 0.75, 3);
-- returns past successful actions ordered by cosine similarity
```

### Core Agents

**Deal Screener** → Input: deal packet + BIM + embeddings → GNN risk → TT-SI if confidence <0.7 → reject/revise/advance + IC artifacts

**Project Sentinel** → Trigger: signals table (schedule/cost/BIM/vision anomaly) → multi-modal risk recalc → auto-mitigations + escalations

**Supervisor Agent** (deployed, P0 webhook bug) → webhook on new deal → comps-fetch → IC memo → deal_analyses write

### Build Strategy
```
V1 PRODUCTION (untouched)    V5 DEVELOPMENT (parallel)
─────────────────────────    ──────────────────────────
frontend/src/v1/         →   frontend/src/v5/
backend/ existing files  →   backend/ additive only
Supabase prod DB         →   Supabase dev branch
Vercel production        →   Vercel preview URL
```
Toggle: `const MODE = import.meta.env.VITE_AXIOM_VERSION`

### New V5 Frontend Components
- `v5/features/neural/RiskCalibrationDashboard.tsx` — Brier curves, prediction history
- `v5/features/neural/AgentHandoff.tsx` — live agent-to-agent status visualization
- `v5/features/neural/SwarmEngine.ts` — async task queue, Supabase Realtime subscriber
- `v5/features/tax/TaxIntelPanel.tsx` — tabbed: Tax Codes / Property Tax / OZ / Depreciation / 1031
- `v5/features/tax/OpportunityZoneMap.tsx` — Leaflet OZ tract overlay
- `v5/features/tax/DepreciationSchedule.tsx` — MACRS table + bonus depreciation toggle
- `v5/features/tax/Exchange1031Tracker.tsx` — timeline with QI deadlines + boot calculator
- `v5/features/gis/SiteMap3D.tsx` — react-three-fiber 3D property massing
- `v5/features/gis/GISOverlay.tsx` — Mapbox: zoning, parcel, flood zone, OZ layers
- `v5/features/governance/PortfolioGovernance.tsx` — autonomy controls per org
- `v5/components/ui/useOfflineStore.ts` — IndexedDB + Supabase background sync

### New V5 Backend Modules
```
neural/gnn_risk.py          RiskGNN, PyTorch Geometric, ONNX export
neural/tts_improve.py       TTS_Improver, synthetic examples, calibration
memory/semantic_store.py    embed() + store_action() + find_similar()
connectors/speckle.py       Poll Speckle → parse geometry → bim_extracts
connectors/procore.py       Sync workflow_tasks from Procore API
connectors/openspace.py     Ingest captures → embed → site_plans
tax/assessor.py             County assessor → property_tax_records
tax/opportunity_zones.py    Spatial lat/lng → OZ tract → eligibility
tax/depreciation.py         MACRS schedule builder, bonus taper
routers/tax.py              5 tax API endpoints
```

---

## CAD/BIM INTEGRATION

```
Speckle (CAD streams) → bim_extracts → risk_graphs → GNN input
Procore (PM)         ↔ workflow_tasks (bidirectional)
OpenSpace (360° vision) → site_plans → embeddings → Sentinel
```

All three → unified coordinator → single composite risk score → autonomous actions.

---

## TAX INTELLIGENCE LAYER

- **Property Tax:** County assessor lookup, mill rate, protest deadlines
- **Transfer Tax:** Jurisdiction-level rates at close
- **Depreciation:** MACRS schedules (Residential 27.5yr, Commercial 39yr, Land Improvements 15yr, Equipment 5-7yr) + bonus depreciation (100%→80%→60% TCJA taper)
- **Opportunity Zones:** Spatial lookup against 8,764 IRS-designated OZ tracts (2018 data)
- **1031 Exchanges:** 45-day ID deadline + 180-day close + boot calculator
- **API endpoints:** `/tax/oz/{deal_id}`, `/tax/depreciation/{project_id}`, `/tax/1031/{deal_id}`, `/tax/assess/{deal_id}`, `/tax/codes`

---

## ENTERPRISE HARDENING PATH

| Step | Action | Target |
|---|---|---|
| 1 | Telemetry | Datadog/Sentry, `correlation_id` everywhere |
| 2 | CMK Encryption | Customer-managed keys via Supabase Vault (draft exists) |
| 3 | Edge Caching | Extend Upstash to FRED + assessor calls (800ms → <50ms) |
| 4 | RLS Hardening | Export policies from dashboard → migrations |
| 5 | Rate Limiting | Per-org limits on LLM proxy |
| 6 | SOC2 Audit Trail | Wire `security_events` to all write operations |

---

## AGI ROADMAP

| Quarter | Milestone |
|---|---|
| Q2 2026 | BIM-aware agents (Speckle live, agents read geometry) |
| Q3 2026 | Embodied coordination (drone data → neural risk planning) |
| Q4 2026 | Multi-agent society (20+ parallel specialized agents) |
| 2027 | World model (full project simulation before ground breaks) |

**Innovation tracks:**
1. **Shadow underwriting** — agent monitors `projects`, delivers IC memo before user asks
2. **XGBoost deal scoring** — `engines-score` stub trains on 500 labeled deals → probabilistic IC rejection prediction
3. **Off-market acquisition AI** — pgvector accumulation → Copilot surfaces deals before listing

---

## DEPENDENCY MANIFEST

### Frontend V5 additions
```json
"@react-three/fiber": "^8.16.0",
"@react-three/drei": "^9.105.0",
"three": "^0.165.0",
"mapbox-gl": "^3.3.0",
"react-map-gl": "^7.1.7",
"idb": "^8.0.0"
```

### Backend V5 additions
```
torch==2.3.0
torch_geometric==2.5.3
supabase-vecs==0.6.0
openai==1.25.0
celery==5.4.0
redis==5.0.4
httpx==0.27.0
```

### External Services
| Service | Purpose | Status |
|---|---|---|
| Anthropic Claude 4.6 | Primary LLM, PDF vision, TT-SI | Live |
| OpenAI GPT-4o | Secondary LLM + 1536-dim embeddings | Live |
| Groq Llama 3.3 70B | Fast draft inference | Live |
| Together Mixtral | Cost-optimized inference | Live |
| FRED API | Daily macro ingest (CRON) | Live |
| ATTOM | Property data + comps | Live |
| Regrid | Parcel fallback | Live |
| Stripe | Billing | Live |
| Upstash Redis | Edge cache | Live |
| Speckle | CAD/BIM streams | V5 planned |
| Procore | Construction task sync | V5 planned |
| OpenSpace | 360° vision | V5 planned |
| Mapbox GL JS | Advanced tile layers | V5 planned |
| Twilio | VoIP (UI shell only) | V5 wiring |

---

## GLOBAL WORKFLOW: /axiom-build
```bash
1. git log --oneline -10
2. npm test → fix failures
3. npm run build
4. supasync (schema diff + type gen)
5. vercel deploy --prod
6. Report: what changed + Vercel URL
```

*Canonical spec — do not edit without updating version. Last compiled: 2026-03-22*
