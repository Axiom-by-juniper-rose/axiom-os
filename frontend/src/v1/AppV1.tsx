import { AuthProvider, TierProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { useState } from "react";
import { Dashboard } from "./features/dashboard/Dashboard";
import { Contacts } from "./features/crm/Contacts";
import { Deals } from "./features/deals/Deals";
import { NeuralAgents } from "./features/agents/NeuralAgents";
import { Financials } from "./features/financials/Financials";
import { SiteAnalysis } from "./features/analysis/SiteAnalysis";
import { ProjectManagement } from "./features/management/ProjectManagement";
import { RiskRegistry } from "./features/management/RiskRegistry";
import { MarketIntel } from "./features/analysis/MarketIntel";
import { AgentHub } from "./features/output/AgentHub";
import { Reports } from "./features/output/Reports";
import { Settings } from "./features/system/Settings";
import { Connectors } from "./features/system/Connectors";
import { AuditLog } from "./features/security/AuditLog";
import "./components/ui/theme.css";

// ─── NAV STRUCTURE (matches V20 groups) ──────────────────────
const NAV_GROUPS = [
    {
        group: "OVERVIEW",
        items: [
            { id: "dashboard", label: "⬡ Command Center" },
            { id: "connectors", label: "⬡ Connectors & APIs" },
        ],
    },
    {
        group: "CRM",
        items: [
            { id: "contacts", label: "⬡ Contacts" },
            { id: "deals", label: "⬡ Deal Pipeline" },
        ],
    },
    {
        group: "FINANCE",
        items: [
            { id: "financials", label: "⬡ Financial Engine" },
            { id: "calchub", label: "⬡ Calculator Hub" },
        ],
    },
    {
        group: "SITE",
        items: [
            { id: "analysis", label: "⬡ Site & Entitlements" },
            { id: "profile", label: "⬡ Property Profile" },
        ],
    },
    {
        group: "MARKET",
        items: [
            { id: "market", label: "⬡ Market Intelligence" },
        ],
    },
    {
        group: "EXECUTION",
        items: [
            { id: "process", label: "⬡ Process Control" },
            { id: "risk", label: "⬡ Risk Command" },
            { id: "reports", label: "⬡ Reports & Binder" },
        ],
    },
    {
        group: "OUTPUT",
        items: [
            { id: "agents", label: "⬡ Neural Agents" },
            { id: "hub", label: "⬡ AI Agent Hub" },
        ],
    },
    {
        group: "SYSTEM",
        items: [
            { id: "settings", label: "⬡ Settings" },
        ],
    },
    {
        group: "SECURITY",
        items: [
            { id: "audit", label: "⬡ Audit Log" },
        ],
    },
];

// ─── ACCORDION NAV SECTION ───────────────────────────────────
function NavSection({
    group, items, activeView, onSelect, collapsed: sidebarCollapsed
}: {
    group: string;
    items: { id: string; label: string }[];
    activeView: string;
    onSelect: (id: string) => void;
    collapsed: boolean;
}) {
    const [open, setOpen] = useState(true);

    if (sidebarCollapsed) {
        // Icon-only mode: show dots
        return (
            <div style={{ padding: "4px 0", borderBottom: "1px solid var(--c-border)" }}>
                {items.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        title={item.label.replace("⬡ ", "")}
                        style={{
                            width: 40, height: 36,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                            borderRadius: 4,
                            margin: "1px auto",
                            background: activeView === item.id ? "var(--c-bg4)" : "transparent",
                            color: activeView === item.id ? "var(--c-gold)" : "var(--c-muted)",
                            fontSize: 14,
                            transition: "all 0.15s",
                        }}
                    >
                        ◆
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{ marginBottom: 4 }}>
            {/* Section header — clickable to collapse */}
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "6px 10px 5px",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <span style={{
                    fontSize: 9, letterSpacing: "2.5px", color: "var(--c-dim)",
                    textTransform: "uppercase", fontWeight: 700,
                }}>
                    {group}
                </span>
                <span style={{
                    fontSize: 9, color: "var(--c-dim)",
                    transform: open ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s",
                    lineHeight: 1,
                }}>
                    ▾
                </span>
            </div>

            {/* Items */}
            {open && items.map(item => {
                const isActive = activeView === item.id;
                return (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        style={{
                            display: "flex", alignItems: "center",
                            padding: "8px 12px 8px 14px",
                            cursor: "pointer",
                            borderRadius: 4,
                            margin: "1px 4px",
                            fontSize: 12,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "var(--c-gold)" : "var(--c-sub)",
                            background: isActive ? "color-mix(in srgb, var(--c-gold) 8%, var(--c-bg3))" : "transparent",
                            borderLeft: isActive ? "2px solid var(--c-gold)" : "2px solid transparent",
                            transition: "all 0.15s",
                            letterSpacing: "0.3px",
                        }}
                        onMouseEnter={e => {
                            if (!isActive) {
                                (e.currentTarget as HTMLElement).style.background = "var(--c-bg3)";
                                (e.currentTarget as HTMLElement).style.color = "var(--c-text)";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!isActive) {
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                                (e.currentTarget as HTMLElement).style.color = "var(--c-sub)";
                            }
                        }}
                    >
                        {item.label}
                    </div>
                );
            })}
        </div>
    );
}

// ─── PLACEHOLDER FOR STUB SCREENS ───────────────────────────
function ComingSoon({ name }: { name: string }) {
    return (
        <div style={{ padding: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "var(--c-dim)", textTransform: "uppercase", marginBottom: 8 }}>
                Module
            </div>
            <div style={{ fontSize: 28, fontWeight: 200, color: "var(--c-text)", marginBottom: 16 }}>
                {name}
            </div>
            <div style={{ color: "var(--c-muted)", fontSize: 13 }}>
                This module is being elevated to V1 architecture. Core data is available — full UI coming in the next sprint.
            </div>
        </div>
    );
}

// ─── VIEW RENDERER ────────────────────────────────────────────
function renderView(view: string) {
    switch (view) {
        case "dashboard": return <Dashboard projectId="default" />;
        case "contacts": return <Contacts />;
        case "deals": return <Deals />;
        case "market": return <MarketIntel projectId="default" />;
        case "analysis": return <SiteAnalysis projectId="default" />;
        case "agents": return <NeuralAgents />;
        case "hub": return <AgentHub />;
        case "financials": return <Financials />;
        case "process": return <ProjectManagement projectId="default" />;
        case "risk": return <RiskRegistry projectId="default" />;
        case "reports": return <Reports />;
        case "settings": return <Settings />;
        case "connectors": return <Connectors />;
        case "audit": return <div style={{ padding: 0 }}><AuditLog /></div>;
        case "profile": return <ComingSoon name="Property Profile" />;
        case "calchub": return <ComingSoon name="Calculator Hub" />;
        default: return <ComingSoon name={view} />;
    }
}

// ─── MAIN APP CONTENT ─────────────────────────────────────────
function AppContent() {
    const [view, setView] = useState("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const sidebarWidth = sidebarCollapsed ? 54 : 220;

    return (
        <div className="axiom-layout">
            {/* ─── SIDEBAR ──────────────────────────────────── */}
            <div style={{
                width: sidebarWidth,
                minWidth: sidebarWidth,
                background: "#09090D",
                borderRight: "1px solid var(--c-border)",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                overflow: "hidden",
            }}>
                {/* Header */}
                <div style={{
                    padding: sidebarCollapsed ? "16px 0" : "16px 18px",
                    borderBottom: "1px solid var(--c-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarCollapsed ? "center" : "space-between",
                    flexShrink: 0,
                }}>
                    {!sidebarCollapsed && (
                        <div style={{
                            fontSize: 11, fontWeight: 800, letterSpacing: "3px",
                            color: "var(--c-gold)",
                        }}>
                            AXIOM <span style={{ fontSize: 8, color: "var(--c-dim)", verticalAlign: "top" }}>OS</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(c => !c)}
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        style={{
                            background: "transparent", border: "none",
                            cursor: "pointer", padding: "2px 4px",
                            color: "var(--c-dim)", fontSize: 14,
                            lineHeight: 1, borderRadius: 3,
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--c-text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--c-dim)")}
                    >
                        {sidebarCollapsed ? "▶" : "◀"}
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, overflowY: "auto", padding: "10px 0", overflowX: "hidden" }}>
                    {NAV_GROUPS.map(g => (
                        <NavSection
                            key={g.group}
                            group={g.group}
                            items={g.items}
                            activeView={view}
                            onSelect={setView}
                            collapsed={sidebarCollapsed}
                        />
                    ))}
                </nav>

                {/* Footer version */}
                {!sidebarCollapsed && (
                    <div style={{
                        padding: "10px 14px",
                        borderTop: "1px solid var(--c-border)",
                        fontSize: 9, letterSpacing: 2,
                        color: "var(--c-dim)",
                    }}>
                        AXIOM OS · V1 · 2026
                    </div>
                )}
            </div>

            {/* ─── MAIN CONTENT ─────────────────────────────── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", minWidth: 0 }}>
                {renderView(view)}
            </div>
        </div>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function AppV1() {
    return (
        <AuthProvider>
            <TierProvider>
                <ProjectProvider>
                    <AppContent />
                </ProjectProvider>
            </TierProvider>
        </AuthProvider>
    );
}
