import os
import json
import asyncio
import logging
from supabase import create_client, Client
from axiom_engine.brain import call_llm
from axiom_engine.agents import personas
from axiom_engine.connectors.rates import get_10yr_treasury
from axiom_engine.tools.market import get_location_intel
from axiom_engine.tools.crm import find_matching_investors
from axiom_engine.tools.finance import generate_fiscal_plan_text
# from axiom_engine.connectors.census import get_census_data # skip for now to simplify dependencies

logger = logging.getLogger(__name__)

# Initialize Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = None

if url and key:
    supabase = create_client(url, key)


def _write_analysis(deal_id: str, agent_type: str, report_text: str, model: str = "claude") -> None:
    """Write structured agent output to deal_analyses (replaces notes blob append)."""
    if not supabase:
        return
    try:
        supabase.table("deal_analyses").insert({
            "deal_id": deal_id,
            "agent_type": agent_type,
            "report_text": report_text,
            "model": model,
        }).execute()
        # Emit v5_event signal for Realtime streaming to frontend
        supabase.table("v5_events").insert({
            "event_type": "agent_completed",
            "source_table": "deals",
            "source_id": deal_id,
            "payload": {"agent": agent_type, "status": "done"},
        }).execute()
    except Exception as e:
        logger.warning(f"_write_analysis failed for {deal_id}/{agent_type}: {e}")

def process_deal(deal_id: str):
    """
    Orchestrates the multi-agent analysis for a single deal.
    Each agent result is written to deal_analyses as it completes.
    Emits v5_events for Supabase Realtime streaming to frontend.
    """
    if not supabase:
        logger.error("Supabase credentials missing. Cannot process deal.")
        return

    logger.info(f"[Orchestrator] Processing Deal {deal_id}")

    # 1. Fetch Deal
    try:
        response = supabase.table("deals").select("*").eq("id", deal_id).execute()
        if not response.data:
            logger.error(f"Deal {deal_id} not found")
            return
        deal = response.data[0]
    except Exception as e:
        logger.error(f"Error fetching deal {deal_id}: {e}")
        return

    # Check if already processed (look in deal_analyses, not notes blob)
    try:
        existing = supabase.table("deal_analyses").select("id").eq(
            "deal_id", deal_id).eq("agent_type", "analyst").execute()
        if existing.data:
            logger.info(f"Deal {deal_id} already has a final memo. Skipping.")
            return
    except Exception:
        pass  # Table may not exist yet — proceed

    # 2. Fetch shared context
    treasury_rate = get_10yr_treasury()
    location_str = deal.get("location", "")
    city, state = "", ""
    if "," in location_str:
        parts = location_str.split(",")
        city, state = parts[0].strip(), parts[1].strip()

    saved_intel = get_location_intel(supabase, city, state)
    fiscal_plan = generate_fiscal_plan_text(deal)

    # ── Group 1: Independent agents (run first, no inter-dependencies) ──────

    logger.info("  -> Agent: Market Researcher")
    market_prompt = (
        f"Deal Location: {location_str}. Current 10yr Treasury: {treasury_rate}%.\n\n"
        f"Saved Market Intelligence:\n{saved_intel}\n\n"
        f"Research the market drivers for this location."
    )
    market_report = call_llm(personas.MARKET_RESEARCHER, market_prompt, json_mode=False)
    _write_analysis(deal_id, "market_researcher", market_report)

    deal_context = (
        f"Deal Data: {json.dumps(deal, indent=2)}\n\n"
        f"Market Report:\n{market_report}\n\nFiscal Plan:\n{fiscal_plan}"
    )

    logger.info("  -> Agent: Valuator")
    val_report = call_llm(personas.VALUATOR, deal_context, json_mode=False)
    _write_analysis(deal_id, "valuator", val_report)

    logger.info("  -> Agent: Legal & Compliance")
    from axiom_engine.tools.zoning import analyze_zoning
    zoning_code, site_sqft = "Unknown", 43560
    for tag in deal.get("tags", []):
        if "sqft" in tag.lower():
            try:
                site_sqft = float("".join(filter(str.isdigit, tag)))
            except Exception:
                pass
        if tag.upper() in ["T6-8", "MU-3", "RM-1", "CG", "IL"]:
            zoning_code = tag.upper()
    zoning_analysis = analyze_zoning(zoning_code, site_sqft)
    legal_report = call_llm(
        personas.LEGAL_COMPLIANCE,
        f"{deal_context}\n\nAutomated Zoning Analysis:\n{zoning_analysis}",
        json_mode=False,
    )
    _write_analysis(deal_id, "legal", legal_report)

    # ── Group 2: Depend on Group 1 ──────────────────────────────────────────

    from axiom_engine.tools.renovation import estimate_renovation_costs
    reno_estimates = estimate_renovation_costs(deal.get("asset_type", "Multifamily"), units=50)
    strat_context = f"{deal_context}\n\nValuation:\n{val_report}\n\nRenovation:\n{reno_estimates}"

    logger.info("  -> Agent: Strategist")
    strat_report = call_llm(personas.STRATEGIST, strat_context, json_mode=False)
    _write_analysis(deal_id, "strategist", strat_report)

    logger.info("  -> Agent: Risk Officer")
    rent_roll_str = "## Rent Roll:\n"
    try:
        leases_resp = supabase.table("leases").select("*, tenants(*)").eq("deal_id", deal_id).execute()
        leases = leases_resp.data or []
        if not leases:
            rent_roll_str += "No active leases reported."
        else:
            for l in leases:
                t = l.get("tenants") or {}
                rent_roll_str += (
                    f"- {t.get('name','Unknown')}: {l.get('sqft')} sqft "
                    f"@ ${l.get('annual_rent')}/yr [{l.get('status')}]\n"
                )
    except Exception as e:
        logger.warning(f"Leases fetch failed: {e}")
        rent_roll_str += "Leasing profile unavailable."
    risk_report = call_llm(
        personas.RISK_OFFICER,
        f"{deal_context}\n\nTenant Profile:\n{rent_roll_str}",
        json_mode=False,
    )
    _write_analysis(deal_id, "risk_officer", risk_report)

    # ── Group 3: Capital stack (parallel-ready, sequential here for MVP) ────

    logger.info("  -> Agent: Capital Raiser")
    investor_matches = "CRM matching unavailable."
    try:
        investor_matches = find_matching_investors(supabase, deal)
    except Exception as e:
        logger.warning(f"Investor match failed: {e}")
    cap_report = call_llm(
        personas.CAPITAL_RAISER,
        f"{deal_context}\n\nPotential Investors:\n{investor_matches}",
        json_mode=False,
    )
    _write_analysis(deal_id, "capital_raiser", cap_report)

    logger.info("  -> Agent: Debt Capital Markets")
    from axiom_engine.tools.debt import find_matching_lenders
    lender_matches = "Debt marketplace unavailable."
    try:
        lender_matches = find_matching_lenders(supabase, deal)
    except Exception as e:
        logger.warning(f"Lender match failed: {e}")
    debt_report = call_llm(
        personas.DEBT_CAPITAL,
        f"{deal_context}\n\nPotential Lenders:\n{lender_matches}",
        json_mode=False,
    )
    _write_analysis(deal_id, "debt_capital", debt_report)

    # ── Synthesis ────────────────────────────────────────────────────────────

    logger.info("  -> Agent: Skeptic")
    skeptic_context = (
        f"Market:\n{market_report}\nValuation:\n{val_report}\n"
        f"Strategy:\n{strat_report}\nEquity:\n{cap_report}\n"
        f"Debt:\n{debt_report}\nRisk:\n{risk_report}\nLegal:\n{legal_report}"
    )
    skeptic_report = call_llm(personas.SKEPTIC, skeptic_context, json_mode=False)
    _write_analysis(deal_id, "skeptic", skeptic_report)

    logger.info("  -> Agent: Analyst (Final Memo)")
    final_memo = call_llm(
        personas.ANALYST_WRITER,
        f"Deal Data: {json.dumps(deal)}\n\nTeam Reports:\n{skeptic_context}\n\nCritique:\n{skeptic_report}",
        json_mode=False,
    )
    _write_analysis(deal_id, "analyst", final_memo)

    logger.info(f"[Orchestrator] Deal {deal_id} analysis complete. All results in deal_analyses.")
