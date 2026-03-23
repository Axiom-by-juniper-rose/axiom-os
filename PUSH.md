# Axiom OS V5 — Claude Code Push Instructions

Run these commands in sequence from the repo root:
`C:\Users\bkala\.gemini\antigravity\scratch\axiom\`

---

## Step 1: Stage all changes

```bash
git add -A
```

## Step 2: Verify what's staged

```bash
git status
```

Expected new/modified files:
- backend/axiom_engine/neural/ (3 files)
- backend/axiom_engine/memory/ (2 files)
- backend/axiom_engine/tax/ (3 files)
- backend/axiom_engine/agents/orchestrator.py
- backend/axiom_engine/agents/manager.py
- backend/axiom_engine/brain.py
- backend/axiom_engine/parcels.py
- backend/app.py
- backend/routers/copilot.py
- backend/routers/copilot_v2.py
- backend/tests/test_finance_v5.py
- frontend/src/v5/ (7 files)
- supabase/migrations/20260318000001-4_v5_*.sql
- archive/ (legacy JSX moved here)
- docs/AXIOM_CANONICAL_SPEC.md
- docs/AXIOM_MARKET_SYNOPSIS.md
- CLAUDE.md
- deploy.sh

## Step 3: Commit

```bash
git commit -m "feat(v5): neural layer, tax intelligence, agent pipeline refactor

Backend:
- neural/gnn_risk.py: RiskGNN class, heuristic fallback, ONNX export
- neural/tts_improve.py: TT-SI confidence-gated refinement via Claude
- memory/semantic_store.py: pgvector embed/store/find_similar
- tax/depreciation.py: MACRS + bonus depreciation engine (TCJA taper)
- tax/opportunity_zones.py: IRS OZ eligibility + benefit calculator
- tax/__init__.py: tax router, 5 endpoints (/oz, /depreciation, /1031, /assess, /codes)
- agents/orchestrator.py: writes to deal_analyses, emits v5_events, no debug prints
- agents/manager.py: polls deal_analyses not notes blob, 60s interval
- app.py: tax router wired, all logging via logger module
- brain.py, parcels.py, copilot*.py: print(DEBUG) -> logger

Frontend:
- v5/features/neural/SwarmEngine.ts: Supabase Realtime agent tracker
- v5/features/neural/AgentHandoff.tsx: live pipeline progress UI
- v5/features/neural/RiskCalibrationDashboard.tsx: Brier score display
- v5/features/tax/TaxIntelPanel.tsx: 5-tab tax module
- v5/features/gis/SiteMap3D.tsx: react-three-fiber 3D massing
- v5/features/governance/PortfolioGovernance.tsx: autonomy controls
- v5/index.ts: clean public exports

DB:
- 4 V5 migrations: vector extension, neural layer, construction layer, tax layer

Housekeeping:
- archive/: legacy monoliths moved out of src/
- backend/tests/test_finance_v5.py: IRR/NPV/cap rate test suite
- deploy.sh: one-command verify + commit + deploy"
```

## Step 4: Push

```bash
git push origin main
```

## Step 5: Deploy frontend to Vercel

```bash
cd frontend
vercel --prod
```
