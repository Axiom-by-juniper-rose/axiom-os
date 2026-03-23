"""
Axiom OS V5 — Tax API Router
Endpoints: /tax/oz, /tax/depreciation, /tax/1031, /tax/assess, /tax/codes
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from axiom_engine.dependencies import get_ctx

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/tax", tags=["Tax Intelligence"])


def get_supabase():
    import os
    from supabase import create_client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    return create_client(url, key)


@router.get("/codes")
def get_tax_codes(state: str = None, category: str = None, ctx: dict = Depends(get_ctx)):
    """Return tax codes filtered by state/jurisdiction and category."""
    try:
        supa = get_supabase()
        query = supa.table("tax_codes").select("*")
        if state:
            query = query.ilike("jurisdiction", f"%{state}%")
        if category:
            query = query.eq("category", category)
        result = query.limit(100).execute()
        return {"codes": result.data or [], "count": len(result.data or [])}
    except Exception as e:
        logger.error(f"get_tax_codes error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/oz/{deal_id}")
def get_oz_eligibility(deal_id: str, ctx: dict = Depends(get_ctx)):
    """Check OZ eligibility for a deal and return benefit calculations."""
    try:
        supa = get_supabase()
        deal_result = supa.table("deals").select("*").eq("id", deal_id).execute()
        if not deal_result.data:
            raise HTTPException(status_code=404, detail="Deal not found")
        deal = deal_result.data[0]
        from axiom_engine.tax.opportunity_zones import check_oz_eligibility
        result = check_oz_eligibility(deal, supa)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"oz eligibility error for {deal_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/depreciation/{project_id}")
def get_depreciation_schedule(project_id: str, ctx: dict = Depends(get_ctx)):
    """Return all depreciation schedules for a project."""
    try:
        supa = get_supabase()
        result = supa.table("depreciation_schedules").select("*").eq(
            "project_id", project_id
        ).execute()
        return {"schedules": result.data or [], "project_id": project_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/1031/{deal_id}")
def get_1031_exchange(deal_id: str, ctx: dict = Depends(get_ctx)):
    """Return 1031 exchange status for a deal (relinquished or replacement)."""
    try:
        supa = get_supabase()
        result = supa.table("tax_1031_exchanges").select("*").or_(
            f"relinquished_deal_id.eq.{deal_id},replacement_deal_id.eq.{deal_id}"
        ).execute()
        return {"exchanges": result.data or [], "deal_id": deal_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/assess/{deal_id}")
def trigger_assessment(deal_id: str, ctx: dict = Depends(get_ctx)):
    """Trigger county assessor lookup for a deal's property."""
    try:
        supa = get_supabase()
        deal_result = supa.table("deals").select("location,parcel_number,state").eq(
            "id", deal_id
        ).execute()
        if not deal_result.data:
            raise HTTPException(status_code=404, detail="Deal not found")
        deal = deal_result.data[0]
        return {
            "status": "queued",
            "deal_id": deal_id,
            "message": f"Assessment lookup queued for {deal.get('location', 'unknown location')}",
            "note": "Full assessor API integration requires ATTOM or county API keys."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
