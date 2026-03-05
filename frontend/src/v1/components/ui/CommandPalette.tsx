import { useState, useEffect, useRef, useCallback } from "react";

// ─── Search Index ────────────────────────────────────────────────────────────
// All navigable sections in Axiom OS. Mirrors NAV_GROUPS in AppV1.tsx.
export const SEARCH_INDEX: { id: string; label: string; group: string; keywords: string[] }[] = [
    // OVERVIEW
    { id: "dashboard", label: "Command Center", group: "OVERVIEW", keywords: ["command", "center", "home", "overview", "dashboard", "summary", "kpi"] },
    { id: "connectors", label: "Connectors & APIs", group: "OVERVIEW", keywords: ["connectors", "api", "integrations", "google", "notion", "slack", "zapier", "mcp"] },
    // CRM
    { id: "contacts", label: "Contacts", group: "CRM", keywords: ["contacts", "crm", "people", "leads", "clients", "network"] },
    { id: "deals", label: "Deal Pipeline", group: "CRM", keywords: ["deals", "pipeline", "stages", "board", "sourcing", "committee", "closing"] },
    { id: "analyzer", label: "Deal Analyzer", group: "CRM", keywords: ["analyzer", "deal", "analysis", "proforma", "irr", "returns"] },
    // FINANCE
    { id: "financials", label: "Financial Engine", group: "FINANCE", keywords: ["financials", "finance", "engine", "pro forma", "model", "cash flow"] },
    { id: "calchub", label: "Calculator Hub", group: "FINANCE", keywords: ["calculator", "calc", "hub", "mortgage", "ltv", "ltc", "interest"] },
    { id: "invoices", label: "Invoices & Payments", group: "FINANCE", keywords: ["invoices", "payments", "billing", "invoice", "accounts receivable"] },
    // SITE
    { id: "analysis", label: "Site & Entitlements", group: "SITE", keywords: ["site", "entitlements", "zoning", "gis", "land", "parcel"] },
    { id: "entitlements", label: "Entitlements", group: "SITE", keywords: ["entitlements", "permits", "zoning", "approval", "gpr"] },
    { id: "infrastructure", label: "Infrastructure", group: "SITE", keywords: ["infrastructure", "utilities", "roads", "grading", "wet", "dry"] },
    { id: "concept", label: "Concept Design", group: "SITE", keywords: ["concept", "design", "site plan", "layout", "massing", "architecture"] },
    { id: "sitemap", label: "Site Map", group: "SITE", keywords: ["site map", "map", "gis", "leaflet", "parcel", "aerial"] },
    // INTEL
    { id: "market", label: "Market Intelligence", group: "INTEL", keywords: ["market", "intelligence", "comps", "trends", "absorption", "pricing"] },
    { id: "mls", label: "MLS & Listings", group: "INTEL", keywords: ["mls", "listings", "active", "sold", "comparables", "homes"] },
    { id: "dataintel", label: "Data Intelligence", group: "INTEL", keywords: ["data", "intelligence", "research", "caltrans", "infrastructure"] },
    { id: "jurisdintel", label: "Jurisdiction Intel", group: "INTEL", keywords: ["jurisdiction", "city", "county", "fees", "impact", "exactions"] },
    // EXECUTION
    { id: "process", label: "Process Control", group: "EXECUTION", keywords: ["process", "control", "timeline", "milestones", "phases", "schedule"] },
    { id: "risk", label: "Risk Command", group: "EXECUTION", keywords: ["risk", "registry", "command", "mitigation", "high", "low"] },
    { id: "sitemgmt", label: "Site Management", group: "EXECUTION", keywords: ["site", "management", "construction", "workers", "weather", "logs", "daily"] },
    { id: "vendors", label: "Vendor Network", group: "EXECUTION", keywords: ["vendors", "vendor", "network", "contractors", "subs", "rating"] },
    { id: "network", label: "Professional Network", group: "EXECUTION", keywords: ["professional", "network", "contacts", "architects", "engineers", "legal", "crm"] },
    { id: "reports", label: "Reports & Binder", group: "EXECUTION", keywords: ["reports", "binder", "export", "pdf", "summary", "output"] },
    // WORKSPACE
    { id: "notes", label: "Notes", group: "WORKSPACE", keywords: ["notes", "record", "transcribe", "meeting", "summarize", "capture"] },
    { id: "calendar", label: "Calendar", group: "WORKSPACE", keywords: ["calendar", "schedule", "events", "meetings", "deadlines"] },
    { id: "email", label: "Email", group: "WORKSPACE", keywords: ["email", "inbox", "gmail", "outlook", "mail", "messages"] },
    { id: "sheets", label: "Spreadsheets", group: "WORKSPACE", keywords: ["spreadsheets", "sheets", "excel", "csv", "table", "grid"] },
    { id: "workflows", label: "Workflows & Automation", group: "WORKSPACE", keywords: ["workflows", "automation", "rules", "triggers", "zapier", "if", "then"] },
    { id: "resources", label: "Resource Center", group: "WORKSPACE", keywords: ["resources", "guides", "learning", "documentation", "knowledge"] },
    // OUTPUT
    { id: "copilot", label: "Axiom Copilot", group: "OUTPUT", keywords: ["copilot", "ai", "assistant", "chat", "gpt", "question"] },
    { id: "neuralos", label: "Neural OS", group: "OUTPUT", keywords: ["neural", "os", "network", "agents", "intelligence", "brain"] },
    { id: "hub", label: "AI Agent Hub", group: "OUTPUT", keywords: ["hub", "agents", "ai", "specialist", "tools"] },
    // SYSTEM
    { id: "settings", label: "Settings", group: "SYSTEM", keywords: ["settings", "profile", "account", "api keys", "preferences"] },
    { id: "billing", label: "Billing & Plans", group: "SYSTEM", keywords: ["billing", "plans", "upgrade", "subscription", "tier"] },
    { id: "legal", label: "Legal & Compliance", group: "SYSTEM", keywords: ["legal", "compliance", "filings", "contracts", "permits", "tracker"] },
    // SECURITY
    { id: "audit", label: "Audit Log", group: "SECURITY", keywords: ["audit", "log", "history", "security", "events", "access"] },
];

// ─── Scoring / Matching ──────────────────────────────────────────────────────
function scoreEntry(entry: typeof SEARCH_INDEX[0], query: string): number {
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    const label = entry.label.toLowerCase();
    const group = entry.group.toLowerCase();
    if (label === q) return 100;
    if (label.startsWith(q)) return 90;
    if (label.includes(q)) return 70;
    if (group.includes(q)) return 50;
    for (const kw of entry.keywords) {
        if (kw === q) return 80;
        if (kw.startsWith(q)) return 65;
        if (kw.includes(q)) return 45;
    }
    return 0;
}

function searchIndex(query: string) {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 8);
    return SEARCH_INDEX
        .map(e => ({ ...e, score: scoreEntry(e, query) }))
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
}

// ─── Group icon map ──────────────────────────────────────────────────────────
const GROUP_ICON: Record<string, string> = {
    OVERVIEW: "⬡", CRM: "◈", FINANCE: "◆", SITE: "◉", INTEL: "◎",
    EXECUTION: "◐", WORKSPACE: "◩", OUTPUT: "◌", SYSTEM: "◧", SECURITY: "⬘",
};

// ─── Component ───────────────────────────────────────────────────────────────
interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    onNavigate: (id: string) => void;
}

export function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [cursor, setCursor] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const results = searchIndex(query);

    // Focus on open
    useEffect(() => {
        if (open) {
            setQuery("");
            setCursor(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Reset cursor on results change
    useEffect(() => { setCursor(0); }, [query]);

    const handleSelect = useCallback((id: string) => {
        onNavigate(id);
        onClose();
        setQuery("");
    }, [onNavigate, onClose]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
        else if (e.key === "Enter" && results[cursor]) { handleSelect(results[cursor].id); }
        else if (e.key === "Escape") { onClose(); }
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="axiom-cp-backdrop" onClick={onClose} />

            {/* Palette */}
            <div className="axiom-cp-container" role="dialog" aria-label="Command Palette" aria-modal="true">
                {/* Search Input */}
                <div className="axiom-cp-input-row">
                    <span className="axiom-cp-icon">⌕</span>
                    <input
                        ref={inputRef}
                        className="axiom-cp-input"
                        placeholder="Search Axiom OS..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label="Search"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {query && (
                        <button className="axiom-cp-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Clear">✕</button>
                    )}
                    <kbd className="axiom-cp-esc">ESC</kbd>
                </div>

                {/* Divider */}
                <div className="axiom-cp-divider" />

                {/* Results */}
                <div className="axiom-cp-results" role="listbox">
                    {results.length === 0 && (
                        <div className="axiom-cp-empty">No results for "{query}"</div>
                    )}
                    {results.map((entry, i) => (
                        <div
                            key={entry.id}
                            className={`axiom-cp-item${i === cursor ? " axiom-cp-item--active" : ""}`}
                            onMouseEnter={() => setCursor(i)}
                            onClick={() => handleSelect(entry.id)}
                            role="option"
                            aria-selected={i === cursor}
                        >
                            <span className="axiom-cp-item-icon">{GROUP_ICON[entry.group] || "⬡"}</span>
                            <span className="axiom-cp-item-label">{entry.label}</span>
                            <span className="axiom-cp-item-group">{entry.group}</span>
                            <span className="axiom-cp-item-arrow">→</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="axiom-cp-footer">
                    <span><kbd>↑↓</kbd> navigate</span>
                    <span><kbd>↵</kbd> select</span>
                    <span><kbd>ESC</kbd> close</span>
                </div>
            </div>
        </>
    );
}
