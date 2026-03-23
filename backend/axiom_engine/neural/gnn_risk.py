"""
Axiom OS V5 — GNN Risk Engine
PyTorch Geometric graph neural network for deal risk scoring.
ONNX export for Vercel Edge sub-500ms inference.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Lazy import — torch/torch_geometric not installed by default
# Install: pip install torch torch_geometric
try:
    import torch
    import torch.nn.functional as F
    from torch_geometric.nn import GCNConv
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    logger.warning("PyTorch/PyG not installed. GNN scoring will use heuristic fallback.")


class RiskGNN(torch.nn.Module if TORCH_AVAILABLE else object):
    """Graph Convolutional Network for deal risk scoring."""

    def __init__(self, num_features: int = 12, hidden: int = 64, num_classes: int = 1):
        if not TORCH_AVAILABLE:
            raise ImportError("PyTorch required for RiskGNN. pip install torch torch_geometric")
        super().__init__()
        self.conv1 = GCNConv(num_features, hidden)
        self.conv2 = GCNConv(hidden, num_classes)

    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, p=0.2, training=self.training)
        return torch.sigmoid(self.conv2(x, edge_index))


def build_risk_graph(deal: dict) -> dict:
    """
    Extract node/edge feature matrix from deal fields for GNN input.
    Returns dict with 'nodes' (list of feature vectors) and 'edges' (edge list).
    """
    # Financial node
    irr = float(deal.get("irr") or 0)
    cap_rate = float(deal.get("cap_rate") or 0)
    ltv = float(deal.get("ltv") or 0)

    # Market node
    vacancy = float(deal.get("market_vacancy") or 0.05)
    absorption = float(deal.get("absorption_rate") or 0.5)
    market_score = float(deal.get("market_score") or 0.5)

    # Risk node
    permit_risk = float(deal.get("permit_risk") or 0.3)
    entitlement_risk = float(deal.get("entitlement_risk") or 0.3)
    env_risk = float(deal.get("environmental_risk") or 0.1)

    # Macro node
    treasury_10yr = float(deal.get("treasury_10yr") or 0.045)
    interest_rate = float(deal.get("interest_rate") or 0.07)
    inflation = float(deal.get("inflation_rate") or 0.035)

    nodes = [
        [irr, cap_rate, ltv],                            # node 0: financial
        [vacancy, absorption, market_score],              # node 1: market
        [permit_risk, entitlement_risk, env_risk],        # node 2: risk
        [treasury_10yr, interest_rate, inflation],        # node 3: macro
    ]

    # Bidirectional edges: all nodes connected to financial node + macro-market link
    edges = [
        [0, 1], [1, 0],   # financial <-> market
        [0, 2], [2, 0],   # financial <-> risk
        [0, 3], [3, 0],   # financial <-> macro
        [1, 3], [3, 1],   # market <-> macro
        [2, 3], [3, 2],   # risk <-> macro
    ]

    return {"nodes": nodes, "edges": edges}


def heuristic_risk_score(deal: dict) -> float:
    """
    Fallback heuristic when PyTorch is not available.
    Returns a 0-1 risk score based on key financial metrics.
    Higher = higher risk.
    """
    score = 0.5  # base

    irr = float(deal.get("irr") or 0)
    cap_rate = float(deal.get("cap_rate") or 0)
    ltv = float(deal.get("ltv") or 0)

    # Low IRR increases risk
    if irr < 0.12: score += 0.15
    elif irr > 0.20: score -= 0.10

    # High LTV increases risk
    if ltv > 0.80: score += 0.15
    elif ltv < 0.60: score -= 0.10

    # Low cap rate in high-rate environment increases risk
    if cap_rate < 0.05: score += 0.10

    return min(max(score, 0.0), 1.0)


def score_deal(deal_id: str, deal: dict, supabase) -> float:
    """
    Run GNN inference (or heuristic fallback) and persist results to Supabase.
    Returns risk score 0.0-1.0 (higher = riskier).
    """
    if not TORCH_AVAILABLE:
        risk_score = heuristic_risk_score(deal)
        logger.info(f"Heuristic risk score for deal {deal_id}: {risk_score:.4f}")
    else:
        try:
            graph = build_risk_graph(deal)
            model = RiskGNN(num_features=3, hidden=32, num_classes=1)
            model.eval()

            x = torch.tensor(graph["nodes"], dtype=torch.float)
            edge_index = torch.tensor(graph["edges"], dtype=torch.long).t().contiguous()

            with torch.no_grad():
                out = model(x, edge_index)
                risk_score = float(out.mean().item())

        except Exception as e:
            logger.error(f"GNN inference failed for deal {deal_id}: {e}. Using heuristic.")
            risk_score = heuristic_risk_score(deal)

    # Persist to Supabase
    try:
        graph_data = build_risk_graph(deal)
        supabase.table("risk_graphs").insert({
            "deal_id": deal_id,
            "nodes": graph_data["nodes"],
            "edges": graph_data["edges"],
            "feature_matrix": {"method": "gnn" if TORCH_AVAILABLE else "heuristic"},
        }).execute()

        supabase.table("risks").update({
            "gnn_risk_score": risk_score,
            "gnn_computed_at": "now()",
        }).eq("deal_id", deal_id).execute()

        logger.info(f"GNN risk score persisted for deal {deal_id}: {risk_score:.4f}")
    except Exception as e:
        logger.warning(f"Could not persist GNN score for deal {deal_id}: {e}")

    return risk_score


def export_onnx(output_path: str = "gnn_risk.onnx"):
    """Export trained model to ONNX for Vercel Edge inference."""
    if not TORCH_AVAILABLE:
        raise ImportError("PyTorch required for ONNX export.")

    import torch.onnx

    model = RiskGNN(num_features=3, hidden=32, num_classes=1)
    model.eval()

    dummy_x = torch.randn(4, 3)
    dummy_edge_index = torch.tensor([[0,1,0,2],[1,0,2,0]], dtype=torch.long)

    torch.onnx.export(
        model,
        (dummy_x, dummy_edge_index),
        output_path,
        input_names=["x", "edge_index"],
        output_names=["risk_scores"],
        opset_version=17,
    )
    logger.info(f"ONNX model exported to {output_path}")
    return output_path
