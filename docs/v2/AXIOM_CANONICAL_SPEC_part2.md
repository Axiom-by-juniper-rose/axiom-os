---

## PART 9: OPEN ISSUES & FIX REGISTRY

| Priority | Issue | Location | Fix | Effort |
|---|---|---|---|---|
| 🔴 P0 | Hardcoded anon key | src/v1/lib/supabase.ts | Move to VITE_SUPABASE_ANON_KEY | 30 min |
| 🔴 P0 | Confirm AxiomModular routing | App.tsx domain split | Verify JSX module loads correctly | 15 min |
| 🟠 P1 | Sequential 8-agent pipeline (40-64s) | orchestrator.py | asyncio.gather() | 4 hrs |
| 🟠 P1 | Agent output in notes blob | orchestrator.py | Write to deal_analyses table | 2 hrs |
| 🟠 P1 | DEBUG print() in orchestrator | orchestrator.py | logging.getLogger() | 30 min |
| 🟡 P2 | Legacy monolith files in src/ | frontend/src/ | Archive v16/v17/v19/v20.jsx | 10 min |
| 🟡 P2 | Dual context dirs | src/context + src/contexts | Merge to one | 1 hr |
| 🟡 P2 | 26 empty migration .bak files | supabase/migrations/ | Delete .bak files | 5 min |
| 🟡 P2 | No TypeScript strict | tsconfig.app.json | Enable strict | 2+ hrs |
| 🟡 P2 | Census connector disabled | connectors/census.py | Re-enable for V5 | 30 min |
| 🟡 P2 | 10 Dependabot alerts | npm | npm audit fix | 30 min |
| 🟡 P2 | Backend db.json/axiom.db | backend/app.py | Full Supabase cutover | 3 hrs |
| 🔵 P3 | No unit tests for finance.py | backend/tests/ | pytest IRR/NPV/cap rate/DSCR | 2 hrs |
| 🔵 P3 | No orchestrator integration test | backend/tests/ | Mock LLM + deal_analyses verify | 3 hrs |
| 🔵 P3 | Test files at backend root | backend/*.py | Move to backend/tests/ | 15 min |

---

## PART 10: EXTERNAL SERVICES & API REGISTRY

| Service | Purpose | Status | Env Var |
|---|---|---|---|
| Anthropic Claude 4.6 | Primary LLM, PDF vision, TT-SI | Live | ANTHROPIC_API_KEY |
| OpenAI GPT-4o | Secondary LLM + 1536-dim embeddings | Live | OPENAI_API_KEY |
| Groq (Llama 3.3 70B) | Fast inference | Live | GROQ_API_KEY |
| Together AI (Mixtral) | Cost-optimized inference | Live | TOGETHER_API_KEY |
| FRED API | Daily macro data CRON | Live | FRED_API_KEY |
| ATTOM | Property data + comps | Live | ATTOM_API_KEY |
| Regrid | Parcel data fallback | Live | REGRID_API_KEY |
| Stripe | Billing | Live | STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET |
| Upstash Redis | Edge cache | Live | UPSTASH_REDIS_REST_URL + TOKEN |
| Mapbox GL JS | Map tiles | Live | VITE_MAPBOX_TOKEN |
| Nominatim | Geocoding | Live | no key |
| Supabase | DB + Auth + Edge + Storage | Live | SUPABASE_URL + ANON_KEY + SERVICE_ROLE_KEY |
| Vercel Analytics | Frontend analytics | Live | auto |
| Twilio | VoIP dialer | Shell only | TWILIO_ACCOUNT_SID + AUTH_TOKEN |
| Speckle | CAD/BIM streams | V5 planned | SPECKLE_TOKEN |
| Procore | Construction PM | V5 planned | PROCORE_CLIENT_ID + SECRET |
| OpenSpace | 360 vision | V5 planned | OPENSPACE_API_KEY |

---

## PART 11: DEPENDENCY MANIFEST

Frontend (current): react 19, react-router-dom 7, @supabase/supabase-js 2, @tiptap 2,
  mapbox-gl 3, three 0.183, react-leaflet 5, recharts 3, lightweight-charts 5,
  lucide-react, jspdf, clsx, @vercel/analytics, tailwindcss 3, vite 7, typescript 5

Frontend V5 additions: @react-three/fiber 8, @react-three/drei 9, react-map-gl 7, idb 8

Backend (current): fastapi 0.115, uvicorn 0.30, pydantic 2.8, requests 2.32,
  PyJWT 2.9, passlib[bcrypt], sqlmodel, python-dotenv, stripe

Backend V5 additions: torch 2.3, torch_geometric 2.5, supabase-vecs 0.6,
  openai 1.25, celery 5.4, redis 5.0, httpx 0.27

---

## PART 12: DEPLOYMENT

Frontend: cd frontend && npm run build → auto-deploy Vercel on push to main
Backend: Dockerfile → Render (uvicorn app:app --host 0.0.0.0 --port 8009)
Supabase: supabase link --project-ref ubdhpacoqmlxudcvhyuu && supabase db push
Edge functions: supabase functions deploy <name> [--no-verify-jwt for stripe/supervisor]

/axiom-build workflow: git log → npm test → npm run build → supasync → vercel deploy --prod

*Owner: Alan Augustin / Juniper Rose Investments & Holdings*
*Supersedes all prior docs. Next review: V5 Phase 1 completion.*
