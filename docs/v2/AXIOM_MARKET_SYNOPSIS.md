# AXIOM OS — MARKET SYNOPSIS
**For Beta Testers & Investors**
*Juniper Rose Investments & Holdings | Confidential — March 2026*

---

## THE PROBLEM: $35 BILLION IN WASTED MOTION

Every commercial real estate deal runs on five to seven tools that don't talk to each other.

A top-tier acquisition analyst at a mid-market private equity firm spends 12 hours on a single underwriting sprint: pulling municipal PDFs for zoning, running comps in CoStar, building the pro-forma in Argus or Excel, dropping pins in Google Earth, and drafting the IC memo from scratch. Then doing it again when the deal moves. Then again for the IC presentation.

That's $25,000 per analyst per year in pure labor waste. Multiply it across a team of ten. Then realize this is happening at every institutional developer, family office, and brokerage firm in the country.

The tools responsible — CoStar ($11B market cap), Argus (Altus Group, $2.5B), Procore ($8B), Dealpath, TestFit — were each built to solve one piece of the problem. None of them talk to the field. None of them talk to each other. None of them run AI.

**This is the gap Axiom was built to close.**

---

## WHAT AXIOM IS

Axiom OS is a **Neural Infrastructure Runtime for Commercial Real Estate** — not a SaaS tool, not a CRM addon, not a data portal. It is an operating system for the entire development lifecycle, running on autonomous AI agents, live market data, and a spatial intelligence engine.

The way to understand it: give Axiom an address and it returns a geocoded site map, five-mile comp analysis, baseline financial pro-forma, macroeconomic stress test (FRED API), zoning-to-units calculation, 3D property massing, and a 20-page Investment Committee memo — in under three minutes, from a field-ready iPad interface, before the acquisition manager leaves the parking lot.

No other platform does this. No competitor is close.

---

## HOW IT WORKS

Axiom unifies the entire deal chain in a single React/TypeScript application backed by Supabase, deployed globally on Vercel Edge:

**AI Engine:** Four LLM providers (Anthropic Claude, OpenAI GPT-4o, Groq Llama, Together Mixtral) route by task complexity through a unified proxy. An 8-agent autonomous pipeline — Market Researcher, Valuator, Strategist, Risk Officer, Capital Raiser, Debt Capital, Legal, and Skeptic/Analyst — executes in parallel and writes structured IC artifacts directly to the database.

**Spatial Intelligence:** Mapbox GL JS renders 3D terrain maps with zoning, parcel, flood zone, and Opportunity Zone overlays. The ZoningAnalyzer converts municipal zoning codes into mathematical constraints: max FAR, unit potential, setbacks. Three.js handles massing visualization.

**Financial Engine:** Real-time IRR, NPV, Cap Rate, DSCR, and margin calculations. Live 10-year Treasury and SOFR feeds from FRED. Pro-forma generation from first-principles — no spreadsheets, no manual inputs.

**Risk Intelligence:** A Graph Neural Network (GNN) Risk Engine scores deals by constructing node/edge graphs from deal fields — market conditions, capital structure, entitlement complexity, operator track record. Test-Time Self-Improvement (TT-SI) refinement activates when confidence falls below 0.7, generating synthetic training examples via Claude to sharpen the prediction. Current Brier score: **0.17 vs. baseline 0.24** — the model is outperforming the naive baseline.

**Field Operations:** iPad-optimized offline architecture. When signal drops, the offline engine activates automatically. Voice dictation, photo capture, and site data queue in IndexedDB and sync to the cloud the moment connectivity returns. Acquisition managers can submit LOIs the same day they walk the site.

**Tax Intelligence:** Integrated Opportunity Zone engine (8,764 IRS tracts), MACRS depreciation schedules with bonus depreciation taper, 1031 exchange tracking with auto-calculated deadlines, and county assessor integrations — built directly into the deal workflow, not bolted on.

**CRM Engine:** Nine-pillar institutional CRM combining CINC-grade lead intelligence (50+ behavioral signals, predictive scoring, automated drip sequences) with institutional capital markets tools (IC workflow, investor portal, capital call automation, waterfall calculations).

---

## THE NUMBERS

**Market size:** CRE PropTech market is $18.2B (2025), growing at 16% CAGR. The AI-specific segment — risk, PM, CAD/BIM, construction intelligence — is approximately $35B in total addressable market. PropTech AI investment surged 176% year-over-year heading into 2026.

**Axiom's addressable segment:** $4.5B (premium CRE software, mid-market to institutional). Target: 1% share = $350M ARR ceiling.

**Unit economics:**
- Customer Acquisition Cost: $8,000
- Lifetime Value: $250,000
- Gross Margin: 87%
- Net Revenue Retention: 135%
- Annual Churn Target: 15%

**ROI for customers:**
- 12-hour analyst sprint → 3-minute Copilot query (saves $25,000+/yr per analyst desk)
- Five tools consolidated into one (CoStar + Argus + CRM + map software + cloud storage → Axiom)
- 48-hour acceleration on LOI timing — speed to offer determines deal capture in competitive markets

---

## PRICING

**Boutique Tier** — $1,500–2,500/month (1-5 users)
Unlimited mapping, basic AI memos, standard financial models, offline field mode.

**Enterprise Tier** — $5,000–8,500/month + consumption (10-25 users)
Bring-Your-Own-Key (BYOK) for CoStar and Anthropic, custom ML deal scoring, automated IC pipeline, 3D spatial modeling, dedicated Copilot instance.

**Institutional / Custom** — $150,000+/year
White-labeled OS with bespoke spatial heuristics, custom data lake integration, SLA-backed uptime.

**Data Marketplace Add-On** — 15% markup on API passthrough
For clients without direct ATTOM or CoStar licenses, Axiom provides data access via its master keys.

---

## TRACTION & STATUS

- **Platform:** Live on `app.buildaxiom.dev`. 22 Supabase Edge Functions deployed to production.
- **Infrastructure:** Multi-provider LLM proxy live. FRED daily data pipeline live. Stripe billing live. Autonomous supervisor agent live. OM PDF ingestor live.
- **Risk calibration:** Brier score 0.17 vs. baseline 0.24. GNN schema and migrations deployed to Supabase.
- **Beta cohort:** Targeting first 15 firms at $1,500/month — prioritizing active deal pipelines in Sunbelt metros.
- **Year 1 ARR target:** $2.2M (15 beta → 40 Boutique + 10 Enterprise)
- **Year 3 ARR target:** $18M (250 Boutique + 80 Enterprise + 15 Institutional)

---

## EXIT THESIS

| Year | ARR | Event | Multiple | Value |
|---|---|---|---|---|
| 2026 | $5M | Strategic acquisition — Procore or Autodesk | 20x | **$100M** |
| 2027 | $45M | Infrastructure platform — Series B or strategic | 25x | **$1.1B** |

The strategic logic is straightforward: Procore ($8B market cap) and Autodesk ($65B) have acquisition track records and are both building AI capabilities from scratch. Axiom offers a faster path to AI-native CRE intelligence than either can build internally. Neural infra multiples are running 22–28x ARR in comparable transactions.

The longer game: Axiom becomes the infrastructure layer that the entire CRE industry runs on — the same way Salesforce became unavoidable for enterprise sales. The proprietary deal data accumulating in pgvector is the durable moat. Once 500+ labeled deals are in the system, the XGBoost deal scoring model trains itself. Once 5,000 deals exist, the Copilot starts suggesting off-market acquisitions before they're listed.

---

## AGI TRAJECTORY

Axiom is the only CRE platform being built as neural infrastructure from the ground up — not AI bolted onto legacy software.

The Q2 2026 milestone is BIM-aware agents: Speckle integration brings CAD geometry into the risk graph, so the GNN can factor structural constraints directly into underwriting. By Q4 2026, 20+ specialized agents operate in parallel across a portfolio. By 2027, the world model runs full project simulation — predicting outcomes before ground breaks.

This is the natural endpoint of what we're building: an operating system that knows more about a deal than any analyst can hold in their head, available to any firm at any scale.

---

## FOR BETA TESTERS

You have been selected because you operate at the intersection of deal origination, underwriting, and capital formation. You understand what it costs — in time, in money, in missed opportunities — to run a fragmented tech stack.

Your job in beta is simple:
1. **Break the Field Dashboard** — test it offline on an iPad. Push the sync logic.
2. **Run the Zoning-to-Deal pipeline** — throw complex zoning codes at it. Measure AI accuracy.
3. **Time the IC memo** — from address input to complete memo. Tell us where the latency hurts.
4. **Stress the Copilot** — ask complex multi-step market queries. Report hallucination rates.

Your feedback directly shapes the product. Early beta participants receive founding pricing, co-design access, and case study rights that become the platform's go-to-market evidence.

**The 48-Hour Challenge:** Give us a real address from your active deal flow. We'll return 3D massing, full zoning heuristics, 10-year pro-forma, and risk score in under one hour.

---

## CONTACT

**Alan Augustin** | Founder, Juniper Rose Investments & Holdings
Sarasota, Florida | Realtor · MLO · Insurance Agent (2-15) | Title/Notary pending

*axiom.buildaxiom.dev | Confidential — not for distribution*
