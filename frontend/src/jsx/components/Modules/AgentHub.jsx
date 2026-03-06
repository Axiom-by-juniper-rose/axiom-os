import React from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Card } from '../UI/Card';
import { Agent } from '../UI/Agent';

const AGENTS = [
    { id: "Strategy", name: "Strategic Director", role: "High-level goal setting and resource allocation.", sys: "You are the Strategic Director of a major development firm. Focus on macro strategy, venture capital requirements, and long-term asset value." },
    { id: "Yield", name: "Yield Specialist", role: "Optimization of land use and lot counts.", sys: "You are a land use specialist. Your goal is to maximize density and yield while maintaining regulatory compliance and marketability." },
    { id: "Finance", name: "Capital Markets Analyst", role: "Project financing and equity structuring.", sys: "You are a capital markets expert. Advise on loan-to-cost ratios, equity waterfalls, and IRR hurdles." },
    { id: "Legal", name: "General Counsel", role: "Entitlements, contracts, and legal risk.", sys: "You are a real estate attorney. Analyze contracts, title reports, and municipal codes for legal exposure." },
    { id: "Construction", name: "VDC Manager", role: "Constructability and cost estimation.", sys: "You are a Virtual Design and Construction manager. Focus on hard costs, schedule optimization, and site preparation." },
    { id: "Marketing", name: "Sales Director", role: "Product positioning and pricing strategy.", sys: "You are a homebuilding sales director. Advise on product mix, floor plans, and absorption rates." }
];

export default function AgentHub() {
    const [active, setActive] = useLS("axiom_active_hub_agent", "Strategy");
    const selected = AGENTS.find(a => a.id === active) || AGENTS[0];

    return (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
            <div>
                <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>Agent Directory</div>
                {AGENTS.map(a => (
                    <div key={a.id} onClick={() => setActive(a.id)} style={{ padding: "12px 16px", borderRadius: 8, background: active === a.id ? "rgba(212,168,67,0.12)" : "transparent", border: `1px solid ${active === a.id ? C.gold + "44" : "transparent"}`, cursor: "pointer", marginBottom: 8, transition: "all 0.2s" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: active === a.id ? C.gold : C.text }}>{a.name}</div>
                        <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>{a.role}</div>
                    </div>
                ))}
                <div style={{ marginTop: 20 }}>
                    <button style={{ ...S.btn(), width: "100%", justifyContent: "center" }}>Provision New Agent</button>
                </div>
            </div>
            <div>
                <Card title={`${selected.name} · Active Session`} action={<div style={{ fontSize: 10, color: C.green }}>System Ready</div>}>
                    <Agent id={`Hub_${selected.id}`} system={selected.sys} placeholder={`Message the ${selected.name}...`} height={550} />
                </Card>
            </div>
        </div>
    );
}
