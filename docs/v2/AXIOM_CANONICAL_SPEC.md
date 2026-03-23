# AXIOM OS — CANONICAL SPECIFICATION v2.0
**The Definitive Application Reference | Juniper Rose Investments & Holdings**
*Single source of truth — all prior documents superseded by this file*
*Last compiled: 2026-03-22 | Sources: all antigravity brain sessions + Perplexity blueprint + 3rd-party audit + CRM spec + user booklet*

---

## PART 1: IDENTITY & MISSION

### What Axiom Is
Axiom OS is a **Neural Infrastructure Runtime for Commercial Real Asset Development** — not a SaaS tool, not a PropTech app, not a CRM addon. It is an operating system for the entire real estate development lifecycle: from off-market sourcing to construction closeout, running on AI agents, live market data, and a spatial intelligence engine.

**The one-sentence pitch:** Give us an address — we return a geocoded site, 5-mile comp map, baseline pro-forma, macroeconomic stress test, zoning-to-deal calculation, and a 20-page IC memo, all before you leave the parking lot.

### What Makes It Structurally Different
Every competitor solves one problem. Axiom solves the entire chain:

| Problem | Competitors | Axiom |
|---|---|---|
| CRM & pipeline | Dealpath, Salesforce | ✅ Built-in (9 pillars, CINC-grade) |
| Financial modeling | Argus, Excel | ✅ Real-time pro-forma engine |
| Market data | CoStar, ATTOM | ✅ Live cascade + FRED macro |
| GIS/spatial | TestFit, Google Earth | ✅ Mapbox + Leaflet + 3D massing |
| Construction PM | Procore | ✅ V5 Procore sync + BIM layer |
| AI underwriting | None (market gap) | ✅ 8-agent async pipeline |
| Risk intelligence | None (market gap) | ✅ GNN Risk Engine + TT-SI |
| Field mobility | None (market gap) | ✅ iPad-first offline IndexedDB |
| Tax intelligence | None (market gap) | ✅ OZ engine, MACRS, 1031 tracker |
| Investor relations | Juniper Square | ✅ Integrated, not bolted on |

### Domain
- **App:** `app.buildaxiom.dev` (authenticated shell)
- **Marketing:** `www.buildaxiom.dev` (public site)
- **Supabase project ref:** `ubdhpacoqmlxudcvhyuu`
- **Vercel team:** `juniper-rose` (ID: `team_k9pMkrpQoIolWK5TG0xkDSXD`)
- **GitHub:** `Axiom-by-juniper-rose/axiom-os`
- **Local dev:** `http://localhost:5173` (Vite) | `http://localhost:8009` (FastAPI)
- **Proprietary IP:** Juniper Rose Investments & Holdings

---

## PART 2: ARCHITECTURE OVERVIEW

### Stack
```
Frontend:   React 19 + Vite 7 + TypeScript 5 + Tailwind → Vercel (app.buildaxiom.dev)
Landing:    React + Vite (separate project) → Vercel (www.buildaxiom.dev)
Backend:    FastAPI + Python → Render/Docker
Database:   Supabase (Postgres 17 + pgvector + Edge Functions + Realtime)
Auth:       Supabase Auth (JWT + RLS)
AI Layer:   Multi-provider LLM proxy (OpenAI GPT-4o + Anthropic Claude 4.6 + Groq + Together)
Storage:    Supabase Storage
CDN:        Vercel Edge Network
Cache:      Upstash Redis (comps + FRED)
Billing:    Stripe (checkout + portal + webhooks)
Analytics:  Vercel Analytics
```

### Routing Logic (App.tsx)
```
hostname === 'app.buildaxiom.dev' OR localhost → IS_APP_DOMAIN = true → AxiomModular shell
hostname === 'www.buildaxiom.dev'              → IS_APP_DOMAIN = false → VanguardLanding
```
App domain routes: `/login` (public) + `/*` (AuthGate → AxiomModular)
Marketing domain routes: `/` + `/v1` + `/use-cases/:slug` + `/login` (redirects to app domain)

### Module Architecture (frontend/src/)
```
src/
├── main.tsx              # Entry — BrowserRouter + AuthProvider + SW registration
├── App.tsx               # Domain detection + route split
├── context/              # AuthContext (founder bypass via URL param)
├── contexts/             # (merge target — duplicate, to be cleaned)
├── components/
│   ├── Auth/AuthGate     # Protected route wrapper
│   └── DebugErrorBoundary
├── jsx/
│   ├── AxiomApp.jsx      # Main modular shell (sidebar + all feature routing)
│   └── components/
│       └── Marketing/
│           ├── VanguardLanding.jsx
│           └── MicropageRenderer.jsx
├── pages/
│   ├── LoginPage.tsx
│   └── LandingPage.tsx
├── lib/
│   └── supabaseClient.ts # SDK client (CANONICAL — use this everywhere)
└── v1/features/          # 33+ domain modules (see §4)
```

---

## PART 3: FEATURE DOMAINS (33+ MODULES)

### Frontend Feature Map (`frontend/src/v1/features/`)

| Domain | Modules | Status |
|---|---|---|
| **CRM** | Contacts, Deals (Kanban + table), Deal Analyzer, Prospecting Engine, Deal Teaser generator | ✅ Live |
| **Finance** | Financials (pro-forma), Calc Hub (IRR/NPV/ROI), Invoices | ✅ Live |
| **Site** | Site Analysis, Entitlements, Infrastructure, Concept Design, Site Map (Leaflet 2D), Zoning Analyzer | ✅ Live |
| **Intel** | Market Intel (FRED live), MLS Listings, Data Intel, Jurisdiction Intel | ✅ Live |
| **Execution** | Field Dashboard (offline-first iPad), Project Management, Risk Registry, Site Mgmt, Vendor Network, Professional Network | ✅ Live |
| **Workspace** | Notes (TipTap rich text), Calendar, Email, Spreadsheets, Workflows, Resource Center | ✅ Live |
| **Output** | Copilot (NL→SQL query), Neural OS, AI Agent Hub, Reports, OM Ingestor | ✅ Live |
| **System** | Settings, Connectors (API keys), Billing (Stripe), Legal & Compliance, Audit Log | ✅ Live |

### Shell Features
- Accordion sidebar with collapsible nav
- ⌘K command palette (full search + navigation)
- Split-view panels + floating panel detach
- Ticker strip (WebSocket: 10yr Treasury, SOFR, REIT, Homebuilder indices)
- Chat panel (Copilot always accessible)
- Meeting recorder + in-browser VoIP dialer (Twilio shell)
- Auth gate with founder bypass (`?founder=true` URL param)
- Onboarding wizard
- Service Worker (offline PWA support)

### CRM Pillars (from AXIOM_CRM_SPEC.md — 9 pillars total)
1. **CINC-Inspired Lead Intelligence** — behavioral scoring, 50+ signals, auto-routes
2. **Institutional Capital Markets Suite** — IC workflow, deal scoring, portfolio dashboard
3. **Unified Data Intelligence** — CoStar/PropStream/Zillow APIs, AVM, sentiment NLP
4. **Agent Productivity & Mobile** — voice-to-CRM, field ops, instant deal analysis
5. **Marketing Automation** — omnichannel (email/SMS/social), drip sequences, landing pages
6. **Advanced Analytics** — role-based dashboards (CEO / CFO / Deal Team / IR / Agent)
7. **Integration Ecosystem** — QuickBooks, DocuSign, Zoom, Slack, Google Workspace
8. **Security & Compliance** — SOC2 infra, GDPR/CCPA, KYC/AML workflows, MFA/SSO
9. **AI Automation** — generative content, predictive workflows, next-best-action

---

## PART 4: BACKEND ARCHITECTURE

### FastAPI App (`backend/app.py`)
```
CORS:    Scoped to axiom-os.vercel.app, app.buildaxiom.dev, localhost:5173
Auth:    JWT via PyJWT + Supabase verify
Routes:  /health, /runs, /runs/{index}, /market/intel, /stripe/webhook, /core/55plus
Routers: auth, admin, deals, parcels, calc, copilot_v2, scenarios
Agents:  manager.start_agents() on startup (AgentManager lifecycle)
```

### Routers
```
routers/auth.py       → login, register, refresh
routers/deals.py      → CRUD deals + pipeline
routers/parcels.py    → parcel scoring + lookup
routers/calc.py       → financial calculations (IRR, NPV, cap rate, DSCR)
routers/copilot_v2.py → NL query → Supabase SQL → structured response
routers/admin.py      → org admin, usage tracking
```

### 8-Agent Orchestrator (`axiom_engine/agents/orchestrator.py`)
Sequential pipeline (V5 parallelizes with asyncio.gather):
1. Market Researcher — comps, submarket trends
2. Valuator — AVM, cap rate analysis
3. Strategist — development thesis
4. Risk Officer — market/execution risk matrix
5. Capital Raiser (Equity) — equity structure, IRR targets
6. Debt Capital Markets — debt sizing, coverage ratios
7. Legal / Compliance — zoning, entitlement, regulatory
8. Skeptic → Analyst Memo writer — final IC memo to deal_analyses

### Supporting Modules
```
axiom_engine/finance.py       → IRR, NPV, cap rate, DSCR, margin calcs
axiom_engine/parcels.py       → parcel scoring, coordinate lookup
axiom_engine/brain.py         → LLM wrapper (routes to proxy)
axiom_engine/scenarios.py     → financial scenario modeling
axiom_engine/webhooks.py      → Stripe subscription change handler
axiom_engine/connectors/
  rates.py                    → 10yr Treasury (FRED API)
  census.py                   → Demographics (disabled — re-enable for V5)
engines-score/xgboost_prep.py → Deal scoring feature prep (needs ~500 labeled deals)
```

---

## PART 5: SUPABASE EDGE FUNCTIONS (22 DEPLOYED)

| Function | Purpose | Status |
|---|---|---|
| `llm-proxy` | Multi-provider routing (OpenAI/Anthropic/Groq/Together) + cost routing | ✅ Live |
| `engines-risk` | Real-time risk calculation | ✅ Live |
| `engines-score` | XGBoost deal scoring stub | ✅ Deployed (needs training data) |
| `engines-calc` | Financial calc engine | ✅ Live |
| `comps-fetch` | CoStar→ATTOM→Regrid→Mock cascade + Upstash Redis cache | ✅ Live |
| `fred-ingestor` | FRED macro data daily CRON ingest | ✅ Live |
| `predictive-economy` | Predictive economy model | ✅ Live |
| `project-scenarios` | Scenario modeling | ✅ Live |
| `cron-setup` | CRON job configuration | ✅ Live |
| `stripe-checkout` | Checkout session creation | ✅ Live |
| `stripe-webhook` | Webhook + subscription tier update | ✅ Live |
| `om-ingestor` | PDF→deal via Claude PDF vision | ✅ Live (needs ANTHROPIC_API_KEY) |
| `supervisor-agent` | Autonomous underwriting loop | ✅ Live (webhook URL fixed) |
| `deal-teaser` | LP-quality IC memo generator | ✅ Live |
| `anthropic-ingestor` | Direct /v1/messages calls | ✅ Live |
| `decision-artifacts` | Structured decision storage | ✅ Live |
| `security-log-event` | Security audit trail | ✅ Live |
| `signals-recent` | Recent event bus signals | ✅ Live |
| `axiom-chat` | In-app Copilot chat handler | ✅ Live |
| `comms-agent` | Communication automation | ✅ Live |
| `transcribe` | Audio transcription (meeting recorder) | ✅ Live |
| `run-migrations` | Remote migration execution | ✅ Live |

**Runtime:** Vercel Edge (sub-500ms) + Supabase pgvector

**Brier score:** 0.17 (vs baseline 0.24) — risk calibration confirmed working.


---

## PART 6: COMPLETE DATABASE SCHEMA (47 TABLES)

### Extensions
```sql
uuid-ossp   → live
vector      → required for V5 (run v5_enable_vector.sql)
```

### V1 Core Tables (30 — all live in production)

**Multi-tenant foundation:** `organizations`, `user_profiles` (subscription_tier, org_id)

**Deal lifecycle:** `deals` (pipeline + financials), `deal_stage_history`, `deal_analyses` (V5 — replaces notes blob), `deal_contacts`, `deal_intel_links`, `deal_oz_links` (V5)

**Project management:** `projects` (+governance_id FK in V5), `site_data`, `site_tasks` → superseded by `workflow_tasks` (V5)

**Financial:** `financial_models`, `loan_terms`, `equity_terms`, `invoices`, `subscription_events`, `usage_tracking`

**Risk & Intelligence:** `risks` (+gnn_risk_score in V5), `dd_checklists`, `comps`, `intel_records` (+embedding vector in V5)

**CRM:** `contacts`, `tenants`, `leases`, `vendors`, `notes`, `calendar_events`, `team_invites`, `pilot_signups`

**Market data:** `market_data_cache` (FRED/macro), `signals` (market signals — separate from V5 event bus), `predictive_economy_baselines`, `scenarios`, `decision_artifacts`

**MLOps:** `models`, `model_alerts`, `scoring_events`

**Security:** `security_events` (SOC2 audit trail), `activity_log`, `permits`, `ai_conversations`

### V5 New Tables — Neural & Agent Layer (7)

| Table | Purpose |
|---|---|
| `deal_analyses` | Structured per-agent output (replaces notes blob). Indexed by deal_id + run_id |
| `v5_events` | System event bus (signal_type enum). Separate from market `signals` table |
| `risk_graphs` | GNN node/edge data + feature matrix per deal |
| `risk_events` | Risk predictions + Brier calibration + TT-SI flag |
| `agent_actions` | Semantic memory (embedding vector(1536)) — pgvector cosine search |
| `project_outcomes` | Closed-loop learning (predicted_irr vs actual_irr, delta generated column) |
| `portfolio_governance` | Autonomy controls (autonomy_mode enum: manual/assisted/supervised/autonomous) |

### V5 New Tables — Construction & BIM Layer (3)

| Table | Purpose |
|---|---|
| `bim_extracts` | Speckle CAD/BIM geometry + properties per stream object |
| `workflow_tasks` | Procore-synced tasks (status enum: pending/in_progress/complete/blocked/cancelled) |
| `site_plans` | OpenSpace 360° captures + embeddings + flagged_issues JSONB |

### V5 New Tables — Tax Intelligence Layer (7)

| Table | Purpose |
|---|---|
| `tax_codes` | Jurisdiction registry (federal/state/county/city/special_district) |
| `property_tax_records` | Annual assessed tax per deal/project (mill_rate, exemptions JSONB) |
| `tax_assessments` | Appraisal district assessments (total_assessed generated column) |
| `opportunity_zones` | IRS 2018 OZ tract registry (8,764 tracts, GeoJSON geometry) |
| `deal_oz_links` | Deal ↔ OZ eligibility + capital_gain_deferred + step_up_pct |
| `depreciation_schedules` | MACRS/SL/bonus schedules (remaining_basis generated column) |
| `tax_1031_exchanges` | Exchange tracking (identification_deadline + exchange_deadline generated columns) |

### Key RPC Functions
```sql
find_similar_actions(query_embedding vector(1536), similarity_threshold float, match_count int)
-- Returns agent_actions ordered by cosine similarity for semantic memory retrieval

-- Supervisor auto-underwriting triggers (both deals + projects tables):
trigger_deals_supervisor_agent → https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent
trigger_supervisor_agent       → https://ubdhpacoqmlxudcvhyuu.supabase.co/functions/v1/supervisor-agent
```

### RLS Policy Coverage
- All V1 tables: org-scoped via `org_id IN (SELECT org_id FROM user_profiles WHERE id = auth.uid())`
- `signals` + `models` + `predictive_economy_baselines`: global read for authenticated users
- `security_events`: user-scoped (own audit trail only)
- Edge functions: bypass RLS via service_role key

### Migration Files (canonical order)
```
20260302020000_axiom_core_schema.sql          → V1 core tables
20260302020001_axiom_security_mlops.sql       → Security + MLOps tables
20260303030000_billing_usage_schema.sql       → Billing + usage
20260303040000_vault_cmk_encryption.sql       → Supabase Vault CMK
20260303050000_deals_supervisor_webhook.sql   → (BROKEN — superseded)
20260303060000_fix_supervisor_webhook_url.sql → P0 fix — production URL
20260303070000_rls_policies.sql               → RLS policies
20260318000001_v5_enable_vector.sql           → pgvector + find_similar_actions()
20260318000002_v5_neural_layer.sql            → Neural + agent tables
20260318000003_v5_construction_layer.sql      → BIM + workflow tables
20260318000004_v5_tax_layer.sql               → Tax intelligence tables
```

---

## PART 7: API ROUTES

### FastAPI Backend
```
GET  /health
GET  /market/intel?state_fips=12       → Census + 10yr Treasury
GET  /runs?limit=20                    → Run history
GET  /runs/{index}                     → Single run
GET  /runs/{index}/report              → Markdown report
GET  /core/55plus                      → CORE-tier feature gate
POST /stripe/webhook                   → Stripe event handler
```

### Routers (included via app.include_router)
```
/auth/*        → login, register, refresh
/deals/*       → CRUD + pipeline operations
/parcels/*     → parcel scoring + lookup
/calc/*        → IRR, NPV, cap rate, DSCR, margin
/copilot/*     → NL → SQL → structured response
/admin/*       → org management + usage
/scenarios/*   → financial scenario CRUD
```

### Vercel Edge (V5 additions)
```
GET/POST  /api/risk/gnn               → GNN inference (ONNX)
POST      /api/agents/deal-screener   → TT-SI + Claude planner
POST      /api/agents/project-sentinel→ Multi-modal risk monitor
POST      /api/bim/speckle            → CAD/BIM stream extract
POST      /api/workflows/procore      → Procore task sync
POST      /api/construction/openspace → Vision embeddings
```

### Tax API (V5 planned)
```
GET  /tax/codes?state=FL&category=property
GET  /tax/oz/{deal_id}                → OZ eligibility + benefits
GET  /tax/depreciation/{project_id}   → Full MACRS schedule
GET  /tax/1031/{deal_id}              → Exchange tracking + deadlines
POST /tax/assess/{deal_id}            → Trigger county assessor lookup
```

---

## PART 8: NEURAL ARCHITECTURE (V5)

### Neural Roadmap

| Phase | Deliverable | Tech | Status |
|---|---|---|---|
| 1 | GNN Risk Engine | PyTorch Geometric → ONNX → Vercel Edge | Specced + migrations live |
| 2 | TT-SI + Calibration | Claude in-context + Brier scoring | Specced |
| 3 | Semantic Memory | pgvector (1536-dim cosine) | Migration live |
| 4 | CAD/BIM + Workflow | Speckle + Procore + OpenSpace | Specced |

### GNN Risk Engine
```python
class RiskGNN(nn.Module):
  # PyTorch Geometric — node/edge risk graph
  def forward(self, x, edge_index):  # [nodes, features], [2, edges]
    x = F.relu(self.conv1(x, edge_index))
    return torch.sigmoid(self.conv2(x, edge_index))  # Risk probabilities per node

# Pipeline:
# build_risk_graph(deal) → node/edge features from deal fields
# score_deal(deal_id) → GNN → write risk_graphs + update risks.gnn_risk_score
# Export ONNX → sub-500ms Vercel Edge inference
```

### TT-SI (Test-Time Self-Improvement)
```typescript
if (risk.confidence < 0.7) {
  const syntheticExamples = await claude.generateSynthetic(risk);
  improvedRisk = await claude.refineWithContext(syntheticExamples);
  // Write calibration row to risk_events (brier_score, tts_applied=true)
}
```

### Semantic Memory
```sql
-- Retrieves most similar past agent actions as context
SELECT * FROM find_similar_actions(query_embedding, 0.75, 5);
```

### Agent Event Bus (v5_events table)
```
signal_type ENUM: new_deal_packet | risk_updated | bim_updated |
                  agent_completed | mitigation_activated | deal_advanced
```

### Autonomy Modes (portfolio_governance)
```
manual       → all agent output requires human approval
assisted     → agent suggests, human approves (DEFAULT)
supervised   → agent acts, human reviews within 24h
autonomous   → agent acts, human notified only on escalation
```

### V5 Build Strategy
```
V1 (production — never disrupted)    V5 (parallel development)
──────────────────────────────────   ─────────────────────────
frontend/src/v1/                  →  frontend/src/v5/
backend/ (existing files)         →  backend/ (additive only)
Supabase prod DB                  →  Supabase dev branch
Vercel production                 →  Vercel preview URL

Toggle: VITE_AXIOM_VERSION env var
Merge gate: V5 phase passes full test suite → merge to prod
```

### V5 New Backend Modules
```
neural/gnn_risk.py        → RiskGNN, PyTorch Geometric, ONNX export
neural/tts_improve.py     → TTS_Improver, synthetic examples, calibration
memory/semantic_store.py  → embed() + store_action() + find_similar()
connectors/speckle.py     → Poll stream API → parse geometry → bim_extracts
connectors/procore.py     → Sync workflow_tasks from Procore API
connectors/openspace.py   → Ingest captures → embed → site_plans
tax/assessor.py           → County assessor API → property_tax_records
tax/opportunity_zones.py  → Spatial lookup: lat/lng → OZ tract + eligibility
tax/depreciation.py       → MACRS schedule + bonus depreciation taper
routers/tax.py            → Tax API endpoints
```

**[MODIFY] agents/orchestrator.py:**
- Refactor to `async` + `asyncio.gather()` for parallel independent agents
- Stream results to v5_events as each agent completes
- Write to deal_analyses (not notes blob)
- Replace all `print(f"DEBUG:")` with `logging.getLogger(__name__)`


---

## PART 9: OPEN ISSUES & FIX REGISTRY

### 🔴 P0 — Must Fix Before Any Beta Customer

| # | Issue | Location | Fix | Effort |
|---|---|---|---|---|
| 1 | `USE_V1_ARCHITECTURE = false` — old monolith is live | `frontend/src/main.tsx` was restructured; confirm `AxiomModular` is routing correctly | Verify `App.tsx` domain check routes to `AxiomApp.jsx` not `AxiomOS_v20.jsx` | 15 min |
| 2 | Anon key hardcoded in source | `src/v1/lib/supabase.ts` (if exists) | Move to `VITE_SUPABASE_ANON_KEY` | 30 min |

### 🟠 P1 — Before Enterprise Onboarding

| # | Issue | Fix | Effort |
|---|---|---|---|
| 3 | Sequential 8-agent pipeline (40-64s) | `asyncio.gather()` in orchestrator | 4 hrs |
| 4 | Agent output appended to notes blob | Use `deal_analyses` table (migration live) | 2 hrs |
| 5 | Backend CORS wildcard | Confirm scoped to ALLOWED_ORIGINS (already fixed in app.py — verify) | 5 min |
| 6 | DEBUG print statements in orchestrator | Replace with `logging.getLogger(__name__)` | 30 min |

### 🟡 P2 — Before V5 Launch

| # | Issue | Fix | Effort |
|---|---|---|---|
| 7 | Legacy monolith files in src/ | Archive `AxiomOS_v16_fixed.jsx`, `v17`, `v19_clean`, `v20` | 10 min |
| 8 | Dual context directories | Merge `context/` + `contexts/` | 1 hr |
| 9 | 26 empty migration stubs | Delete `.bak` files, confirm only canonical migrations remain | 5 min |
| 10 | No TypeScript strict mode | Enable in tsconfig.app.json | 2+ hrs |
| 11 | Census connector disabled | Re-enable for V5 GIS demographics | 30 min |
| 12 | 10 Dependabot alerts | `npm audit fix` | 30 min |
| 13 | Backend still uses db.json/axiom.db | Full Supabase cutover for deal_runs | 3 hrs |

### 🔵 P3 — Before Public Launch

| # | Issue | Fix | Effort |
|---|---|---|---|
| 14 | No unit tests for finance.py | pytest for IRR, NPV, cap rate, DSCR | 2 hrs |
| 15 | No orchestrator integration test | Mock LLM, verify deal_analyses write | 3 hrs |
| 16 | 30+ test files at backend root | Consolidate to `backend/tests/` | 15 min |
| 17 | docs/ sparse | Add architecture diagrams, API docs, onboarding | ongoing |

---

## PART 10: EXTERNAL SERVICES & API REGISTRY

| Service | Purpose | Status | Key/Config |
|---|---|---|---|
| Anthropic Claude 4.6 | Primary LLM, PDF vision, TT-SI | ✅ Live | ANTHROPIC_API_KEY |
| OpenAI GPT-4o | Secondary LLM + 1536-dim embeddings | ✅ Live | OPENAI_API_KEY |
| Groq (Llama 3.3 70B) | Fast inference | ✅ Live | GROQ_API_KEY |
| Together AI (Mixtral) | Cost-optimized inference | ✅ Live | TOGETHER_API_KEY |
| FRED API | Daily macro data (10yr Treasury, SOFR, etc.) | ✅ Live CRON | FRED_API_KEY |
| ATTOM | Property data + comps | ✅ Live (cascade) | ATTOM_API_KEY |
| Regrid | Parcel data | ✅ Live (fallback) | REGRID_API_KEY |
| Stripe | Billing — checkout + portal + webhooks | ✅ Live | STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET |
| Upstash Redis | Edge cache (comps-fetch) | ✅ Live | UPSTASH_REDIS_REST_URL + TOKEN |
| Mapbox GL JS | Map tiles (zoning, parcel, flood, OZ) | ✅ In frontend | VITE_MAPBOX_TOKEN |
| Nominatim | Geocoding (free, current) | ✅ Live | no key |
| Supabase | DB + Auth + Edge Functions + Storage | ✅ Live | SUPABASE_URL + ANON_KEY + SERVICE_ROLE_KEY |
| Vercel Analytics | Frontend analytics | ✅ Live | auto |
| Twilio | VoIP dialer | 🔶 UI shell only | TWILIO_ACCOUNT_SID + AUTH_TOKEN |
| Speckle | CAD/BIM streams | 📋 V5 planned | SPECKLE_TOKEN |
| Procore | Construction PM sync | 📋 V5 planned | PROCORE_CLIENT_ID + SECRET |
| OpenSpace | 360° site vision | 📋 V5 planned | OPENSPACE_API_KEY |

### Pricing Tiers (Stripe)
```
Pro:        VITE_STRIPE_PRO_PRICE_ID         → $199/mo (suggested; confirm in dashboard)
Pro+:       VITE_STRIPE_PRO_PLUS_PRICE_ID    → $499/mo
Enterprise: VITE_STRIPE_ENTERPRISE_PRICE_ID  → $2,999/mo
```
Supabase secrets: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, all 3 Price IDs

---

## PART 11: DEPENDENCY MANIFEST

### Frontend (package.json — current)
```json
Production:
  react + react-dom: ^19.2.0
  react-router-dom: ^7.13.0
  @supabase/supabase-js: ^2.97.0
  @tiptap/*: ^2.11.5 (rich text editor)
  mapbox-gl: ^3.19.1
  three: ^0.183.2
  react-leaflet: ^5.0.0
  leaflet: ^1.9.4
  recharts: ^3.7.0
  lightweight-charts: ^5.0.8
  lucide-react: ^0.574.0
  jspdf: ^4.1.0
  clsx: ^2.1.1
  @vercel/analytics: ^1.6.1
```

### Frontend (V5 additions)
```json
  "@react-three/fiber": "^8.16.0"
  "@react-three/drei": "^9.105.0"
  "react-map-gl": "^7.1.7"
  "idb": "^8.0.0"
```

### Backend (requirements.txt — current)
```
fastapi==0.115.0, uvicorn==0.30.6, pydantic==2.8.2
requests==2.32.3, PyJWT==2.9.0, passlib[bcrypt]==1.7.4
sqlmodel, python-dotenv, stripe
```

### Backend (V5 additions)
```
torch==2.3.0, torch_geometric==2.5.3
supabase-vecs==0.6.0, openai==1.25.0
celery==5.4.0, redis==5.0.4, httpx==0.27.0
```

---

## PART 12: DEPLOYMENT & CI/CD

### Frontend Deployment
```bash
cd frontend
npm run build          # tsc -b && vite build
# Auto-deploys to Vercel on push to main
# app.buildaxiom.dev → app shell
# www.buildaxiom.dev → landing (separate landing/ project)
```

### Backend Deployment
```bash
cd backend
# Dockerfile builds → pushes to Render
# Environment: uvicorn app:app --host 0.0.0.0 --port 8009
```

### Supabase Migrations
```bash
supabase link --project-ref ubdhpacoqmlxudcvhyuu
supabase db push                    # Apply all pending migrations
supabase functions deploy <name>    # Deploy individual edge function
```

### Edge Functions Deployment
```bash
supabase functions deploy supervisor-agent --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
# All others: --verify-jwt (default)
```

### /axiom-build Workflow (Antigravity trigger)
```bash
git log --oneline -10               # Review recent changes
npm test                             # Fix failures first
npm run build                        # Confirm clean build
supasync                             # Schema diff + TypeScript type gen
vercel deploy --prod                 # Deploy
# Report: what changed, what deployed, paste URL
```

---

## PART 13: FIELD OPERATIONS GUIDE (From User Booklet)

### The 48-Hour LOI Flow (Core Use Case)
```
Friday 3:00 PM  → Analyst inputs address → Mapbox 3D renders → ZoningAnalyzer runs R-4
Friday 4:30 PM  → AI Copilot: 5 rent comps → baseline pro-forma: 19% IRR / 150-unit build
Saturday 10 AM  → Acquisition Manager on iPad (offline) → Voice Log + Quick Shot
Saturday 11:30  → Sync Ledger uploads → re-run model + $500K site-prep → IRR 17.5%
Monday 9:00 AM  → LOI sent. Deal captured.
```

### Offline Engine Activation
- Signal loss → `STABLE SIGNAL` badge turns amber → `OFFLINE ENGINE ACTIVE`
- All captures queue in Sync Ledger with `PENDING` status
- Signal restored → IndexedDB pushes to Supabase → status → `SYNCED`
- Large tap targets (min 44px) optimized for iPad Pro use in field

### Key Copilot Commands
```
"Show me all industrial comps within 5 miles of Site A that sold above $150/PSF in last 6 months"
"What's the current 10yr Treasury and what does that mean for our deal on Oak Street?"
"Generate an IC memo for the Miami warehouse deal"
"What deals are in due diligence right now?"
```

---

*This document supersedes: AXIOM_MASTER_BLUEPRINT_v1.md, AXIOM_INTELLIGENCE_MASTER.md, all brain session .md files*
*Next review: upon V5 Phase 1 completion*
*Owner: Alan Augustin / Juniper Rose Investments & Holdings*
