import React, { useState, useCallback } from 'react';
import { C, S } from '../../constants';
import { fmt } from '../../utils';
import { usePrj } from '../../context/ProjectContext';
import { Card } from '../UI/Card';
import { Agent } from '../UI/Agent';

// Mock callClaude function usually defined elsewhere or used via Agent component
const callClaude = async (messages, system) => {
    // This is a placeholder for the actual API call logic
    return "Assistant reply placeholder";
};

export default function CopilotPanel() {
    const { project, fin } = usePrj();
    const [msgs, setMsgs] = useState([]);
    const [inp, setInp] = useState("");
    const [busy, setBusy] = useState(false);
    const [model, setModel] = useState("claude-sonnet-4-20250514");
    const [mode, setMode] = useState("general");
    const modes = {
        general: { label: "General Assistant", system: "You are Axiom Copilot, an AI assistant for a real estate development intelligence platform. Help with any questions about real estate development, feasibility analysis, financial modeling, entitlements, or market analysis." },
        underwriter: { label: "Underwriter", system: "You are a real estate underwriter. Analyze deals, stress-test assumptions, calculate returns, and provide institutional-grade underwriting opinions." },
        legal: { label: "Legal / Entitlements", system: "You are a real estate attorney specializing in land use, entitlements, CEQA, zoning, CC&Rs, and development agreements." },
        market: { label: "Market Analyst", system: "You are a real estate market analyst. Analyze comparable sales, absorption rates, pricing trends, and market dynamics for land development." },
        financial: { label: "CFO / Financial", system: "You are a real estate development CFO. Analyze pro formas, financing structures, equity waterfalls, IRR calculations, and capital stack optimization." },
    };
    const systemCtx = `${modes[mode].system}\n\nProject Context: ${project.name} at ${project.address}, ${project.jurisdiction}. ${fin.totalLots} lots, land cost $${fin.landCost}, hard cost $${fin.hardCostPerLot}/lot, sale price $${fin.salesPricePerLot}/lot.`;

    const send = useCallback(async () => {
        if (!inp.trim() || busy) return;
        const um = { role: "user", content: inp };
        const nm = [...msgs, um]; setMsgs(nm); setInp(""); setBusy(true);
        const reply = await callClaude(nm, systemCtx);
        setMsgs([...nm, { role: "assistant", content: reply }]);
        setBusy(false);
    }, [inp, msgs, systemCtx, busy]);

    const prompts = [
        "Generate an executive summary for this project",
        "What are the top 5 risks for this deal?",
        "Calculate the IRR assuming 18-month sell-out",
        "Analyze the comp data and suggest pricing",
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <select style={{ ...S.sel, width: 200 }} value={mode} onChange={e => setMode(e.target.value)}>
                    {Object.entries(modes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <button style={S.btn()} onClick={() => setMsgs([])}>Clear History</button>
            </div>
            <div style={S.g2}>
                <div>
                    <Card title={`Copilot — · ${modes[mode].label}`}>
                        <div style={{ maxHeight: 450, overflowY: "auto", marginBottom: 12 }}>
                            {msgs.map((m, i) => (
                                <div key={i} style={S.bub(m.role)}>
                                    <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, marginBottom: 3, textTransform: "uppercase" }}>{m.role === "user" ? "You" : "—  Copilot"}</div>
                                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, lineHeight: 1.5 }}>{m.content}</pre>
                                </div>
                            ))}
                            {busy && <div style={{ ...S.bub("assistant"), color: C.gold, fontSize: 12 }}>—  Thinking...</div>}
                        </div>
                        <div style={{ display: "flex", gap: 7 }}>
                            <input style={{ ...S.inp, flex: 1 }} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Ask ${modes[mode].label}...`} />
                            <button style={S.btn("gold")} onClick={send} disabled={busy}>Send</button>
                        </div>
                    </Card>
                </div>
                <div>
                    <Card title="Quick Prompts">
                        {prompts.map((p, i) => (
                            <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid #0F1117", cursor: "pointer" }} onClick={() => setInp(p)}>
                                <span style={{ fontSize: 12, color: C.sub }}>{p}</span>
                            </div>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
}
