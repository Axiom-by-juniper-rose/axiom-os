import { useMemo, useState } from "react";
import { useProjectState } from "../../hooks/useProjectState";
import { Card, KPI, Button, Badge } from "../../components/ui/components";
import { fmt } from "../../lib/utils";
import { DEFAULT_FIN, DEFAULT_RISKS, DEFAULT_PERMITS } from "../../lib/defaults";
import { buildMonthlyCashFlows, calcIRR } from "../../lib/math";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props { projectId: string; }

// ─── CHART THEME ─────────────────────────────────────────────
const TT_STYLE = {
    contentStyle: {
        background: "rgba(13,15,19,0.97)",
        border: "1px solid rgba(212,168,67,0.4)",
        borderRadius: 8, fontSize: 12,
        padding: "10px 14px", color: "#E2E8F0",
    },
    itemStyle: { color: "#D4A843", fontWeight: 600 },
    labelStyle: { color: "#8892A4", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1 },
    cursor: { stroke: "rgba(212,168,67,0.3)", strokeWidth: 1 },
};
const PIE_COLORS = ["#D4A843", "#3B82F6", "#22C55E", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444"];
const AXIS_STYLE = { fontSize: 10, fill: "#6B7280" };
const GRID_STROKE = "rgba(255,255,255,0.05)";

export function Dashboard({ projectId }: Props) {
    const { project, updateProject, syncError } = useProjectState(projectId);
    const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

    const fin = project.financials ?? DEFAULT_FIN;
    const risks = project.risks ?? DEFAULT_RISKS;
    const permits = project.permits ?? DEFAULT_PERMITS;
    const ddChecks = project.ddChecks ?? {};

    // ── Snapshot calcs ────────────────────────────────────────
    const snap = useMemo(() => {
        const hard = fin.totalLots * fin.hardCostPerLot;
        const soft = hard * (fin.softCostPct / 100);
        const fees = fin.planningFees + (fin.permitFeePerLot + fin.schoolFee + fin.impactFeePerLot) * fin.totalLots;
        const cont = (hard + soft) * (fin.contingencyPct / 100);
        const landCost = fin.landCost + fin.closingCosts;
        const totalCost = landCost + hard + soft + cont + fees;
        const revenue = fin.totalLots * fin.salesPricePerLot;
        const profit = revenue * 0.97 - totalCost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
        const { flows, constMonths } = buildMonthlyCashFlows(fin);
        const irr = (Math.pow(1 + (calcIRR(flows) || 0), 12) - 1) * 100;

        // Cost breakdown for pie chart
        const costBreakdown = [
            { name: "Land", value: Math.round(landCost / 1000) },
            { name: "Hard Cost", value: Math.round(hard / 1000) },
            { name: "Soft Cost", value: Math.round(soft / 1000) },
            { name: "Fees", value: Math.round(fees / 1000) },
            { name: "Contingency", value: Math.round(cont / 1000) },
        ];

        // Cash flow chart data (monthly)
        const cashFlowData = flows.slice(0, 24).map((v, i) => ({
            month: `M${i + 1}`,
            cashFlow: Math.round(v / 1000),
            cumulative: Math.round(flows.slice(0, i + 1).reduce((s, x) => s + x, 0) / 1000),
        }));

        // Scenario comparison
        const scenarios = [
            { name: "Bear", revenue: revenue * 0.85, cost: totalCost * 1.1 },
            { name: "Base", revenue, cost: totalCost },
            { name: "Bull", revenue: revenue * 1.15, cost: totalCost * 0.95 },
        ].map(s => ({
            ...s,
            profit: Math.round((s.revenue * 0.97 - s.cost) / 1000),
            margin: Math.round(((s.revenue * 0.97 - s.cost) / s.revenue) * 100),
        }));

        return { totalCost, revenue, profit, margin, irr, constMonths, costBreakdown, cashFlowData, scenarios };
    }, [fin]);

    const openRisks = risks.filter((r: any) => r.status === "Open").length;
    const ddDone = Object.values(ddChecks).filter(Boolean).length;
    const approvedPm = permits.filter((p: any) => p.status === "Approved").length;
    const riskSeverity = [
        { name: "Low", value: risks.filter((r: any) => r.severity === "Low").length, color: "#22C55E" },
        { name: "Medium", value: risks.filter((r: any) => r.severity === "Medium").length, color: "#F59E0B" },
        { name: "High", value: risks.filter((r: any) => r.severity === "High").length, color: "#EF4444" },
        { name: "Critical", value: risks.filter((r: any) => r.severity === "Critical").length, color: "#8B5CF6" },
    ].filter(r => r.value > 0);

    return (
        <div className="axiom-stack-32">

            {/* Sync error banner */}
            {syncError && (
                <div style={{ padding: "8px 12px", background: "var(--c-bg3)", border: "1px solid var(--c-amber)", borderRadius: 4, fontSize: 11, color: "var(--c-amber)" }}>
                    ⚠ {syncError}
                </div>
            )}

            {/* Top bar */}
            <div className="axiom-top-bar">
                <div>
                    <div className="axiom-breadcrumb">Command Center</div>
                    <div className="axiom-page-title">{project.name || "Unnamed Project"}</div>
                </div>
                <div className="axiom-flex-gap-12">
                    <Button label="Export Summary" variant="gold" />
                    <Button label="Refresh Data" />
                </div>
            </div>

            {/* KPI row */}
            <div className="axiom-grid-4">
                <KPI label="Total Lots" value={fmt.num(fin.totalLots)} />
                <KPI label="Project Revenue" value={fmt.M(snap.revenue)} color="var(--c-green)" />
                <KPI label="Net Profit" value={fmt.M(snap.profit)} color={snap.profit >= 0 ? "var(--c-green)" : "var(--c-red)"} />
                <KPI label="Levered IRR" value={fmt.pct(snap.irr)} color="var(--c-blue)" />
            </div>
            <div className="axiom-grid-4">
                <KPI label="Open Risks" value={String(openRisks)} color={openRisks > 3 ? "var(--c-amber)" : "var(--c-green)"} sub="active items" />
                <KPI label="DD Items Done" value={String(ddDone)} color="var(--c-blue)" sub="complete" />
                <KPI label="Permits Approved" value={String(approvedPm)} color="var(--c-teal)" sub="of total" />
                <KPI label="Profit Margin" value={fmt.pct(snap.margin)} color={snap.margin > 15 ? "var(--c-green)" : "var(--c-gold)"} sub="net margin" />
            </div>

            {/* ── CHARTS ROW 1 (Cash Flow + Cost Breakdown) ── */}
            <div className="axiom-grid-2">
                <Card title="Monthly Cash Flow — 24 Month View">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={snap.cashFlowData} style={{ cursor: "pointer" }}>
                            <defs>
                                <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4A843" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#D4A843" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                            <XAxis dataKey="month" tick={AXIS_STYLE} interval={3} />
                            <YAxis tick={AXIS_STYLE} tickFormatter={v => `$${v}K`} />
                            <Tooltip {...TT_STYLE} formatter={(v: any) => [`$${v}K`, ""]} />
                            <Legend wrapperStyle={{ fontSize: 10, color: "#6B7280" }} />
                            <Area type="monotone" dataKey="cashFlow" stroke="#D4A843" fill="url(#cfGrad)" strokeWidth={2} dot={false} name="Monthly" />
                            <Area type="monotone" dataKey="cumulative" stroke="#3B82F6" fill="url(#cumGrad)" strokeWidth={2} dot={false} name="Cumulative" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Cost Structure Breakdown">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <ResponsiveContainer width={160} height={180}>
                            <PieChart>
                                <Pie
                                    data={snap.costBreakdown}
                                    cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={75}
                                    dataKey="value"
                                    onClick={(e) => setSelectedSlice(e.name)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {snap.costBreakdown.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={selectedSlice && _.name !== selectedSlice ? 0.4 : 1} />
                                    ))}
                                </Pie>
                                <Tooltip {...TT_STYLE} formatter={(v: any) => [`$${v}K`, ""]} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1 }}>
                            {snap.costBreakdown.map((item, i) => (
                                <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid var(--c-border)", cursor: "pointer" }}
                                    onClick={() => setSelectedSlice(s => s === item.name ? null : item.name)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <span style={{ fontSize: 11, color: "var(--c-sub)" }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text)" }}>${item.value.toLocaleString()}K</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── CHARTS ROW 2 (Scenario Analysis + Risk Severity) ── */}
            <div className="axiom-grid-2">
                <Card title="Scenario Analysis — Profit Comparison">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={snap.scenarios} style={{ cursor: "pointer" }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                            <XAxis dataKey="name" tick={AXIS_STYLE} />
                            <YAxis tick={AXIS_STYLE} tickFormatter={v => `$${v}K`} />
                            <Tooltip {...TT_STYLE} />
                            <Legend wrapperStyle={{ fontSize: 10, color: "#6B7280" }} />
                            <Bar dataKey="profit" name="Profit" radius={[3, 3, 0, 0]}>
                                {snap.scenarios.map((s, i) => (
                                    <Cell key={i} fill={s.profit > 0 ? ["#F59E0B", "#D4A843", "#22C55E"][i] : "#EF4444"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Risk Severity Distribution">
                    {riskSeverity.length > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <ResponsiveContainer width={140} height={160}>
                                <PieChart>
                                    <Pie data={riskSeverity} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                                        {riskSeverity.map((item, i) => (
                                            <Cell key={i} fill={item.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...TT_STYLE} formatter={(v: any) => [v, "risks"]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1 }}>
                                {riskSeverity.map(r => (
                                    <div key={r.name} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--c-border)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                                            <span style={{ fontSize: 11, color: "var(--c-sub)" }}>{r.name}</span>
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: r.color }}>{r.value}</span>
                                    </div>
                                ))}
                                <div style={{ marginTop: 10, fontSize: 10, color: "var(--c-dim)" }}>
                                    {risks.length} total risks tracked
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: "var(--c-dim)", fontSize: 12, padding: "20px 0" }}>No risks tracked yet. Add risks in the Risk Command module.</div>
                    )}
                </Card>
            </div>

            {/* Project Meta */}
            <Card title="Project Meta" action={<Badge label="Auto-Saved" color="var(--c-green)" />}>
                <div className="axiom-grid-2">
                    <div>
                        <div className="axiom-label" style={{ marginBottom: 8 }}>PROJECT NAME</div>
                        <input className="axiom-input" value={project.name || ""} onChange={e => updateProject({ name: e.target.value })} title="Project Name" />
                    </div>
                    <div>
                        <div className="axiom-label" style={{ marginBottom: 8 }}>STATE</div>
                        <input className="axiom-input" value={project.state || ""} onChange={e => updateProject({ state: e.target.value })} placeholder="e.g. FL" title="State" />
                    </div>
                    <div>
                        <div className="axiom-label" style={{ marginBottom: 8 }}>MUNICIPALITY</div>
                        <input className="axiom-input" value={project.municipality || ""} onChange={e => updateProject({ municipality: e.target.value })} placeholder="City / County" title="Municipality" />
                    </div>
                    <div>
                        <div className="axiom-label" style={{ marginBottom: 8 }}>ENTITLEMENT STATUS</div>
                        <select className="axiom-select" value={project.entitlementStatus || "Not Started"} onChange={e => updateProject({ entitlementStatus: e.target.value })}>
                            {["Not Started", "In Progress", "Submitted", "Approved"].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Footer */}
            <div className="axiom-footer">
                <div className="axiom-breadcrumb">Axiom OS · V1 Architecture · Real Estate Intelligence</div>
            </div>
        </div>
    );
}
