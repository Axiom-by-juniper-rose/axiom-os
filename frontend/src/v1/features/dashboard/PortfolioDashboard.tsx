import { useState, useMemo } from "react";
import { Card, KPI, Badge, Button } from "../../components/ui/components";
import { useProject } from "../../context/ProjectContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_TT } from "../../lib/chartTheme";

export function PortfolioDashboard() {
    const ctx = useProject();
    const allProjects = ctx?.allProjects ?? [];
    const switchProject = (ctx as any)?.switchProject;
    const createProject = (ctx as any)?.createProject;

    const [stageFilter, setStageFilter] = useState("All");
    const [sortCol, setSortCol] = useState("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const totalProjects = allProjects.length;
    const activeCount = allProjects.filter((p: any) => p.stage !== "completed" && p.stage !== "disposed").length;
    const pipelineValue = allProjects.reduce((sum: number, p: any) => sum + (p.financials?.revenue || 0), 0);
    const totalRisks = allProjects.reduce((sum: number, p: any) => sum + (p.risks?.length || 0), 0);
    const avgRiskCount = totalProjects > 0 ? (totalRisks / totalProjects).toFixed(1) : "0";
    const fmtPipeline = pipelineValue > 0 ? "$" + (pipelineValue / 1_000_000).toFixed(1) + "M" : "$0";

    const stages = ["All", ...Array.from(new Set(allProjects.map((p: any) => p.stage || "active")))];
    const filtered = stageFilter === "All" ? allProjects : allProjects.filter((p: any) => (p.stage || "active") === stageFilter);

    const sorted = useMemo(() => {
        return [...filtered].sort((a: any, b: any) => {
            let aVal: any, bVal: any;
            if (sortCol === "name") { aVal = a.name || ""; bVal = b.name || ""; }
            else if (sortCol === "revenue") { aVal = a.financials?.revenue || 0; bVal = b.financials?.revenue || 0; }
            else if (sortCol === "profit") { aVal = a.financials?.profit || 0; bVal = b.financials?.profit || 0; }
            else if (sortCol === "risks") { aVal = a.risks?.length || 0; bVal = b.risks?.length || 0; }
            else { aVal = a[sortCol] || ""; bVal = b[sortCol] || ""; }
            const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortCol, sortDir]);

    const chartData = allProjects.slice(0, 8).map((p: any) => ({
        name: (p.name || p.project_name || "Project").substring(0, 15),
        revenue: Math.round((p.financials?.revenue || 0) / 1000),
    }));

    const healthBadge = (proj: any) => {
        const high = (proj.risks || []).filter((r: any) => r.impact === "High" || r.impact === "Critical").length;
        if (high === 0) return <Badge label="Healthy" color="var(--c-green)" />;
        if (high <= 2) return <Badge label="At Risk" color="var(--c-amber)" />;
        return <Badge label="Critical" color="var(--c-red)" />;
    };

    const toggleSort = (col: string) => {
        if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortCol(col); setSortDir("asc"); }
    };

    const handleRowClick = (proj: any) => {
        if (switchProject && proj.id) {
            switchProject(proj.id);
            window.dispatchEvent(new CustomEvent("axiom_goto_view", { detail: "dashboard" }));
        }
    };

    const sortIcon = (col: string) => sortCol === col ? (sortDir === "asc" ? " \u2191" : " \u2193") : "";

    return (
        <div className="axiom-stack-20">
            <Card title="Portfolio Overview" action={createProject ? <Button variant="gold" label="+ New Project" onClick={() => createProject("New Development", "", "")} /> : undefined}>
                <div className="axiom-grid-4 axiom-mb-24">
                    <KPI label="Total Projects" value={totalProjects} />
                    <KPI label="Active" value={activeCount} color="var(--c-green)" />
                    <KPI label="Pipeline Value" value={fmtPipeline} color="var(--c-blue)" sub="Aggregated" />
                    <KPI label="Avg. Risk Count" value={avgRiskCount} color="var(--c-amber)" sub="Per Project" />
                </div>

                {chartData.length > 0 && (
                    <div style={{ height: 180, marginBottom: 20 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                                <XAxis type="number" tick={{ fill: "#7a8494", fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fill: "#eceaf5", fontSize: 11 }} width={80} />
                                <Tooltip {...CHART_TT} />
                                <Bar dataKey="revenue" fill="#e8b84b" radius={[0, 4, 4, 0]} name="Revenue ($K)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--c-dim)" }}>Filter:</span>
                    <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={{ background: "var(--c-bg3)", border: "1px solid var(--c-border)", color: "var(--c-sub)", borderRadius: 4, padding: "4px 8px", fontSize: 12 }}>
                        {stages.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <table className="axiom-table">
                    <thead>
                        <tr>
                            {[{ col: "name", label: "Project" }, { col: "stage", label: "Stage" }, { col: "revenue", label: "Revenue" }, { col: "profit", label: "Profit" }, { col: "risks", label: "Risks" }, { col: "status", label: "Health" }].map(h => (
                                <th key={h.col} className="axiom-th" style={{ cursor: "pointer" }} onClick={() => toggleSort(h.col)}>{h.label}{sortIcon(h.col)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.length === 0 && <tr><td colSpan={6} className="axiom-td axiom-text-center axiom-py-40 axiom-text-dim">No projects. Click "+ New Project" to get started.</td></tr>}
                        {sorted.map((proj: any, i: number) => (
                            <tr key={proj.id ?? i} className="premium-hover" style={{ cursor: "pointer" }} onClick={() => handleRowClick(proj)}>
                                <td className="axiom-td axiom-text-sub axiom-text-bold">{proj.name ?? proj.project_name ?? "Project " + (i + 1)}</td>
                                <td className="axiom-td"><Badge label={proj.stage ?? "active"} color={proj.stage === "active" ? "var(--c-green)" : proj.stage === "closing" ? "var(--c-gold)" : "var(--c-blue)"} /></td>
                                <td className="axiom-td axiom-text-gold">{proj.financials?.revenue ? "$" + Number(proj.financials.revenue).toLocaleString() : "--"}</td>
                                <td className="axiom-td axiom-text-green">{proj.financials?.profit ? "$" + Number(proj.financials.profit).toLocaleString() : "--"}</td>
                                <td className="axiom-td">{proj.risks?.length ?? 0}</td>
                                <td className="axiom-td">{healthBadge(proj)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
