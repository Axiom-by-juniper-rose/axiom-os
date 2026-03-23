#!/usr/bin/env bash
# AXIOM OS V5 — Git commit and push
# Claude Code: run this file from the repo root
# Usage: bash push.sh

set -e

REPO="C:/Users/bkala/.gemini/antigravity/scratch/axiom"
cd "$REPO"

echo "=== AXIOM V5 PUSH ==="
echo "Remote: $(git remote get-url origin)"
echo "Branch: $(git branch --show-current)"
echo ""

# Stage everything
git add -A

# Show what's staged
echo "--- Staged changes ---"
git status --short
echo ""

# Commit
git commit -m "feat(v5): neural layer, tax intelligence, agent pipeline refactor

Backend:
- neural/gnn_risk.py: RiskGNN class, heuristic fallback, ONNX export
- neural/tts_improve.py: TT-SI confidence-gated refinement via Claude
- memory/semantic_store.py: pgvector embed/store/find_similar
- tax/depreciation.py: MACRS + bonus depreciation engine (TCJA taper)
- tax/opportunity_zones.py: IRS OZ eligibility + benefit calculator
- tax/__init__.py: tax router, 5 endpoints
- agents/orchestrator.py: deal_analyses writes, v5_events signals
- agents/manager.py: polls deal_analyses, proper logging
- app.py + brain.py + copilot*.py + parcels.py: print(DEBUG) removed

Frontend:
- v5/features/neural/SwarmEngine.ts
- v5/features/neural/AgentHandoff.tsx
- v5/features/neural/RiskCalibrationDashboard.tsx
- v5/features/tax/TaxIntelPanel.tsx
- v5/features/gis/SiteMap3D.tsx
- v5/features/governance/PortfolioGovernance.tsx
- v5/index.ts

DB: 4 V5 migrations (vector, neural layer, construction, tax)
Docs: canonical spec + market synopsis
Archive: legacy monoliths moved out"

echo "✅ Committed"

# Push
echo ""
echo "--- Pushing to origin/main ---"
git push origin main

echo ""
echo "✅ Pushed to https://github.com/Axiom-by-juniper-rose/axiom-os"
echo ""
echo "--- Deploying frontend ---"
cd frontend
vercel --prod
