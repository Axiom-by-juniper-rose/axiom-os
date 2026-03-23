#!/usr/bin/env bash
# Axiom OS V5 Build — Final verification and commit
# Run from: C:\Users\bkala\.gemini\antigravity\scratch\axiom\
# Usage: bash deploy.sh

set -e

echo "=== AXIOM OS V5 BUILD VERIFICATION ==="

# 1. Frontend build
echo ""
echo "--- Frontend build ---"
cd frontend
npm run build
echo "✅ Frontend build passed"

# 2. Backend import check
echo ""
echo "--- Backend import check ---"
cd ../
python -c "
import sys
sys.path.insert(0, 'backend')
from axiom_engine.neural.gnn_risk import build_risk_graph, heuristic_risk_score
from axiom_engine.neural.tts_improve import should_apply_tts
from axiom_engine.memory.semantic_store import embed
from axiom_engine.tax.depreciation import build_macrs_schedule, MACRS_LIVES
from axiom_engine.tax.opportunity_zones import calculate_oz_benefits
print('✅ All V5 backend modules import cleanly')
"

# 3. Quick depreciation sanity check
python -c "
import sys, datetime
sys.path.insert(0, 'backend')
from axiom_engine.tax.depreciation import build_macrs_schedule
s = build_macrs_schedule(1_000_000, 'residential', datetime.date(2026,1,1), 'SL')
total = sum(x['deduction'] for x in s)
assert abs(total - 1_000_000) < 1, f'Depreciation total mismatch: {total}'
print(f'✅ MACRS schedule: {len(s)} periods, total deductions \${total:,.0f}')
"

# 4. GNN heuristic sanity check
python -c "
import sys
sys.path.insert(0, 'backend')
from axiom_engine.neural.gnn_risk import heuristic_risk_score
deal = {'irr': 0.18, 'cap_rate': 0.06, 'ltv': 0.70}
score = heuristic_risk_score(deal)
assert 0 <= score <= 1, f'Score out of range: {score}'
print(f'✅ GNN heuristic risk score: {score:.4f}')
"

echo ""
echo "=== ALL CHECKS PASSED ==="

# 5. Git commit
echo ""
echo "--- Committing V5 build ---"
git add -A
git commit -m "feat: V5 neural layer, tax intelligence, agent refactor

- neural/: GNN risk engine (PyTorch + heuristic fallback), TT-SI calibration
- memory/: pgvector semantic store (embed, store_action, find_similar)
- tax/: MACRS depreciation engine, OZ eligibility calculator, tax router (5 endpoints)
- agents/orchestrator.py: writes to deal_analyses, emits v5_events signals, no debug prints
- agents/manager.py: polls deal_analyses instead of notes blob
- app.py: tax router wired, all logging via logger
- frontend/src/v5/: SwarmEngine, AgentHandoff, RiskCalibrationDashboard, TaxIntelPanel, SiteMap3D, PortfolioGovernance
- archive/: legacy monoliths moved out of src/
- backend/tests/test_finance_v5.py: IRR/NPV/cap rate test suite"

echo "✅ Committed"

echo ""
echo "--- Deploy to Vercel ---"
cd frontend
vercel --prod
