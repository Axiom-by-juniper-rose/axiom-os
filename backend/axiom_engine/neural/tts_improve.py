"""
Axiom OS V5 — TT-SI (Test-Time Self-Improvement)
When GNN confidence is below threshold, generates synthetic examples
via Claude to refine the risk prediction.
"""
import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


def should_apply_tts(confidence: float, threshold: float = 0.70) -> bool:
    """Return True if confidence is low enough to warrant TT-SI refinement."""
    return confidence < threshold


def generate_synthetic_examples(deal: dict, risk_score: float, brain_fn) -> list[dict]:
    """
    Ask Claude to generate synthetic deal variants that bracket the risk boundary.
    Returns list of example dicts with adjusted parameters.
    """
    prompt = f"""You are a commercial real estate risk analyst.

Deal parameters:
- IRR: {deal.get('irr', 'unknown')}
- Cap Rate: {deal.get('cap_rate', 'unknown')}  
- LTV: {deal.get('ltv', 'unknown')}
- Location: {deal.get('location', 'unknown')}
- Asset Type: {deal.get('asset_type', 'unknown')}

Current risk score: {risk_score:.2f} (0=safe, 1=high risk)
Confidence: LOW — need synthetic boundary examples.

Generate 3 synthetic deal variants as JSON array. Each variant should:
1. Be similar to the above but with one key parameter changed
2. Have a clear risk direction (riskier or safer)
3. Include 'irr', 'cap_rate', 'ltv', 'risk_direction' ('higher'|'lower'), 'rationale'

Respond ONLY with valid JSON array, no markdown."""

    try:
        response = brain_fn(
            system="You are a CRE risk expert. Respond only with valid JSON.",
            user=prompt,
            json_mode=True
        )
        if isinstance(response, list):
            return response
        if isinstance(response, dict) and "examples" in response:
            return response["examples"]
        return []
    except Exception as e:
        logger.warning(f"TT-SI synthetic generation failed: {e}")
        return []


def refine_with_context(
    original_score: float,
    synthetic_examples: list[dict],
    brain_fn,
    deal_context: str = ""
) -> tuple[float, float]:
    """
    Use Claude to synthesize a refined risk score and confidence
    given the original score and synthetic boundary examples.
    Returns (refined_score, new_confidence).
    """
    if not synthetic_examples:
        return original_score, 0.65

    examples_text = "\n".join([
        f"- IRR {ex.get('irr')}, Cap {ex.get('cap_rate')}, LTV {ex.get('ltv')} "
        f"→ {ex.get('risk_direction')} risk: {ex.get('rationale', '')}"
        for ex in synthetic_examples
    ])

    prompt = f"""You are calibrating a real estate risk score.

Original score: {original_score:.3f} (0=low risk, 1=high risk)

Boundary examples for context:
{examples_text}

Deal context: {deal_context[:500] if deal_context else 'Not provided'}

Based on these boundary examples, what is the refined risk score?
Respond with JSON: {{"refined_score": 0.XX, "confidence": 0.XX, "rationale": "..."}}"""

    try:
        result = brain_fn(
            system="You are a precise risk calibration system. Return only valid JSON.",
            user=prompt,
            json_mode=True
        )
        refined = float(result.get("refined_score", original_score))
        confidence = float(result.get("confidence", 0.75))
        return min(max(refined, 0.0), 1.0), min(max(confidence, 0.0), 1.0)
    except Exception as e:
        logger.warning(f"TT-SI refinement failed: {e}")
        return original_score, 0.65


def write_calibration_event(deal_id: str, risk_type: str, predicted_prob: float,
                             confidence: float, tts_applied: bool,
                             model_version: str, supabase) -> None:
    """Persist calibration row to risk_events for Brier score tracking."""
    try:
        supabase.table("risk_events").insert({
            "deal_id": deal_id,
            "risk_type": risk_type,
            "predicted_prob": predicted_prob,
            "confidence": confidence,
            "tts_applied": tts_applied,
            "model_version": model_version,
        }).execute()
    except Exception as e:
        logger.warning(f"Could not write calibration event for deal {deal_id}: {e}")
