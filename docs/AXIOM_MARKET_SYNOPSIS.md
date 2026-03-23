# AXIOM OS
## Market Synopsis for Beta Testers & Investors
*Juniper Rose Investments & Holdings | March 2026 | Confidential*

---

## THE PROBLEM

Commercial real estate development runs on five separate software stacks that don't talk to each other.

A typical acquisition analyst at a mid-size PE firm pays for CoStar (market data), Argus (financial modeling), a generic CRM, mapping software, and cloud storage. They spend 12 hours on every new deal — pulling municipal PDFs for zoning, exporting comps to Excel, building a pro forma from scratch, and manually writing the IC memo. By the time it's done, the deal may already be gone.

The industry is worth $18.2 billion in software spend. None of the incumbents have solved this. CoStar is a data monopoly trying to bolt AI onto aging infrastructure. Dealpath does CRM well but has no GIS or financial modeling. Argus is the finance standard but looks like 2008 and has no mobile story. Procore runs construction but knows nothing about the deal that created the project it's managing.

**The market is fragmented by design — and that fragmentation costs firms $25,000 per analyst desk per year in wasted time.**

---

## THE SOLUTION

Axiom OS is a **Neural Infrastructure Runtime** — one platform that replaces all five tools.

When a user inputs a property address, Axiom simultaneously:
- Geocodes the site and maps comps within a configurable radius
- Pulls live macroeconomic data from the Federal Reserve (FRED API)
- Runs a baseline pro forma (IRR, cap rate, NPV, equity waterfall)
- Queries the local zoning code for FAR, setbacks, and unit potential
- Fires an 8-agent AI pipeline that synthesizes everything into a 20-page Investment Committee memo

**That entire sequence takes 3 minutes.** It used to take 12 hours.

The platform works offline. An acquisition manager walking a 50-acre site with no signal uses the iPad-optimized Field Dashboard to log photos, voice notes, and site observations. The moment they reconnect, everything syncs to the deal record. Speed to Letter of Intent increases by 48 hours — which in competitive deal markets is the difference between winning and losing.

---

## WHAT'S BUILT AND LIVE TODAY

Axiom is not a pitch deck. The infrastructure is real and running.

**20 Supabase Edge Functions deployed to production.** These handle everything from multi-provider LLM routing (OpenAI, Anthropic, Groq, Together AI) to Stripe billing to autonomous deal analysis. The AI orchestration layer routes requests intelligently by task complexity and cost.

**30-table production database.** Full CRM, deal pipeline, financial models, site data, market intelligence, lease management, vendor network, audit logging, and Stripe billing — all live on Supabase with Row Level Security.

**A live data cascade.** When comps are requested, the system tries CoStar first, falls back to ATTOM, then Regrid, then intelligently interpolated mock data. The UI never breaks. Federal Reserve macro data ingests daily via a scheduled CRON function.

**Autonomous underwriting pipeline.** Upload a PDF offering memorandum and the `om-ingestor` edge function uses Claude's PDF vision to extract deal data, create the deal record, and trigger the full agent pipeline — with zero user input after the upload.

**Risk calibration that works.** The system's Brier score is 0.17 against a baseline of 0.24. The predictions are already meaningfully better than chance.

**Stripe billing live.** Three pricing tiers (Boutique, Enterprise, Institution) with checkout, webhooks, and subscription management all wired.

---


## THE COMPETITIVE POSITION

Every major competitor owns one lane. Axiom owns all of them.

| Competitor | Their Lane | Why It's Not Enough |
|---|---|---|
| CoStar | Market data | Data monopoly with no workflow, no AI, no mobile, aging UI |
| Dealpath | Deal pipeline CRM | No GIS, no financial modeling, no field capability |
| Argus Enterprise | Financial analysis | Industry-standard but desktop-only, no AI, 2008 UX |
| Procore | Construction PM | No deal intelligence, no underwriting, no CRE data |
| Northspyre | Budget tracking | Single-function, no market data, no agent pipeline |
| TestFit | Spatial design | One trick — generative massing, nothing else |

**Axiom's structural moat has five layers:**

1. **Multi-LLM orchestration.** The system routes between four AI providers based on task complexity and cost. No other PropTech platform does this — they pick one provider and get locked in.

2. **Holistic Deal Synthesis.** Axiom is the only platform that chains FRED macro data → property micro data → financial model → AI IC memo in a single automated sequence.

3. **Field-First architecture.** Competitors are desktop-first. Axiom's offline-capable iPad interface was designed from day one for on-site use. This matters enormously in a business where speed to offer wins deals.

4. **Neural infrastructure depth.** The V5 roadmap adds a Graph Neural Network risk engine, pgvector semantic memory, and BIM-aware agents connected to Speckle and Procore. This is not a chatbot — it's infrastructure.

5. **Regulatory moat.** The founder holds an active Realtor license, MLO license, 2-15 insurance license, and title/notary certification pending. Competitors are pure software companies without practitioner credentials. In a regulated industry, this is a meaningful trust signal.

---

## THE MARKET

**CRE PropTech market:** $18.2B (2025), growing at 16% CAGR.

**Total addressable market for Axiom's category** (premium unified CRE OS): $4.5B.

**Axiom's realistic target:** $350M ARR at 1% share of the broader $35B construction/development AI market.

**PropTech AI investment is surging** — 176% year-over-year increase in 2026 funding. Neural infrastructure platforms are trading at 22-28x revenue multiples.

---

## THE BUSINESS MODEL

**"Seat + Compute" pricing — enterprise OS rates, not SaaS commodity pricing.**

| Tier | Price | What's Included |
|---|---|---|
| Boutique | $1,500–$2,500/mo | 1-5 users, unlimited mapping, AI memos, financial models, offline mode |
| Enterprise | $5,000–$8,500/mo + compute | 10-25 users, bring-your-own-key (CoStar/Anthropic), custom ML scoring, 3D modeling |
| Institution | $150,000+/yr | White-label, bespoke spatial engines, custom data lake integration |
| Data Marketplace | 15% markup on passthrough | For users without own ATTOM/CoStar licenses |

**Unit economics:** CAC $8K | LTV $250K | Gross margin 87% | NRR 135%

**The ROI case for clients is simple:** Axiom saves 15 hours per analyst per week — roughly $75,000/year in labor per seat. A $60,000/year enterprise contract pays for itself immediately. Every CFO can approve it.

---

## REVENUE TRAJECTORY

| Timeline | ARR | Accounts |
|---|---|---|
| Q1-Q2 2026 (Beta) | $270K | 15 beta firms at $1,500/mo |
| Q3-Q4 2026 (Launch) | $2.2M | 40 Boutique + 10 Enterprise |
| 2026 Target (V5) | $5M | V5 neural layer drives expansion |
| Year 3 | $18M | 250 Boutique + 80 Enterprise + 15 Institutional |

**Exit path:**
- **2026:** $5M ARR → strategic acquisition by Procore or Autodesk at 20x = **$100M**
- **2027:** $45M ARR → infrastructure platform valuation at 25x = **$1.1B**

---

## FOR BETA TESTERS

You have been selected because you operate at the intersection of deal sourcing, underwriting, and capital markets — the exact workflows Axiom is built for.

**What we need from you:**

**Test the Field Dashboard offline.** Take an iPad to a site with intentionally poor signal. Log photos and voice notes. Reconnect and verify the sync. Tell us where it breaks, where it's slow, and what you needed that wasn't there.

**Push the Zoning-to-Deal pipeline.** Input a real site address in a market you know well. Let the system run its zoning analysis and pro forma. Tell us where the numbers diverge from your own judgment and why.

**Stress-test the AI outputs.** Ask the Copilot complex, multi-variable market questions. Note where it hallucinates, where it hedges when it shouldn't, and where it actually surprises you with something useful.

**Flag the missing deal types.** The system was built around standard multifamily and commercial acquisition. If you work in industrial, hospitality, or mixed-use, we need to know what breaks.

Your feedback in the first 60 days shapes the V5 neural layer. The deals you run through Axiom become training data for the XGBoost scoring model that will eventually tell future users the probability their IC will approve a deal before they submit it.

**Welcome to the infrastructure layer of the next era of CRE.**

---

## FOR INVESTORS

**The thesis:** The CRE development software stack is about to consolidate. Just as Salesforce unified enterprise CRM and Procore unified construction PM, one platform will unify the development lifecycle. That platform needs to be built by someone who understands both the software and the deals — not a pure-play tech company that has never closed a transaction.

**Why now:** AI capability crossed a threshold in 2025. Multi-modal LLMs can now read PDFs, extract deal terms, generate spatial analyses, and write institutional-quality memos. The tools to build Axiom didn't exist 18 months ago. The window to establish infrastructure-level positioning is open right now and will close as majors (Procore, CoStar, Autodesk) accelerate their AI roadmaps.

**Why this team:** The founder holds active real estate, mortgage, and insurance licenses in Florida — the third-largest CRE market in the US. Axiom is built from practitioner insight, not theory. The regulatory credibility that comes from those licenses is a trust signal that pure software competitors cannot replicate.

**What the capital goes toward:** V5 neural layer completion (GNN, pgvector, BIM connectors), enterprise sales motion (first 10 institutional accounts), and SOC2 Type II certification for Blackstone-tier clients who require it before signing.

**The ask:** Strategic beta partners and seed capital for enterprise sales and V5 build-out. Conversation starts at [contact].

---

*Axiom OS is a product of Juniper Rose Investments & Holdings | Sarasota, Florida*
*Confidential — for authorized recipients only | 2026*
