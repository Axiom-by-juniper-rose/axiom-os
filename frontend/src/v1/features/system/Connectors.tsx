import { useState } from "react";
import { useLS } from "../../hooks/useLS";
import { Card, Badge, Button } from "../../components/ui/components";
import { Tabs } from "../../components/ui/layout";

// ─── Connector Definitions ────────────────────────────────────────────────────
interface ConnectorDef {
    id: string;
    name: string;
    category: string;
    type: "OAuth" | "API Key" | "MCP";
    desc: string;
    authLabel: string;
    color: string;
}

const CONNECTORS: ConnectorDef[] = [
    // Productivity / Workspace
    { id: "google", name: "Google Workspace", category: "Productivity", type: "OAuth", desc: "Calendar, Gmail, Drive, Contacts sync", authLabel: "Sign in with Google", color: "var(--c-blue)" },
    { id: "notion", name: "Notion", category: "Productivity", type: "OAuth", desc: "Sync notes, tasks, and databases two-way", authLabel: "Connect Notion", color: "var(--c-text)" },
    { id: "figma", name: "Figma", category: "Design", type: "OAuth", desc: "Embed design files in Site & Concept sections", authLabel: "Connect Figma", color: "var(--c-purple)" },
    { id: "slack", name: "Slack", category: "Communication", type: "OAuth", desc: "Post deal alerts, receive Axiom events", authLabel: "Add to Slack", color: "var(--c-purple)" },
    // Automation
    { id: "zapier", name: "Zapier", category: "Automation", type: "API Key", desc: "Trigger workflows across 5,000+ apps", authLabel: "Enter API Key", color: "var(--c-amber)" },
    // Communications
    { id: "twilio", name: "Twilio", category: "Communication", type: "API Key", desc: "VoIP dialer, SMS notifications, call transcription", authLabel: "Enter API Keys", color: "var(--c-red)" },
    { id: "sendgrid", name: "SendGrid", category: "Communication", type: "API Key", desc: "Outbound email automation and drip sequences", authLabel: "Enter API Key", color: "var(--c-blue)" },
    // Legal / Docs
    { id: "docusign", name: "DocuSign", category: "Legal", type: "OAuth", desc: "Send contracts and track e-signature status", authLabel: "Connect DocuSign", color: "var(--c-amber)" },
    // CRM
    { id: "salesforce", name: "Salesforce", category: "CRM", type: "OAuth", desc: "Bi-directional CRM data sync with Axiom contacts", authLabel: "Connect Salesforce", color: "var(--c-blue)" },
    // Real Estate Data
    { id: "costar", name: "CoStar / REIS", category: "Market Data", type: "API Key", desc: "Live comps, market analytics, property data", authLabel: "Enter API Key", color: "var(--c-green)" },
    { id: "mls", name: "MLS / RESO", category: "Market Data", type: "API Key", desc: "Live listing data, sold comps", authLabel: "Enter Credentials", color: "var(--c-teal)" },
    { id: "propstream", name: "BatchSkipTracing", category: "Prospecting", type: "API Key", desc: "Owner lookup, phone/email for prospect lists", authLabel: "Enter API Key", color: "var(--c-gold)" },
    // Property Management
    { id: "propertyware", name: "Propertyware", category: "Asset Mgmt", type: "API Key", desc: "Asset management and tenant data sync", authLabel: "Enter API Key", color: "var(--c-teal)" },
];

const MCP_SERVERS = [
    { name: "SketchUp Live Model Server", desc: "3D model streaming and updates", port: 3001 },
    { name: "GIS / Parcel Data MCP", desc: "Live parcel, zoning, and GIS data", port: 3002 },
    { name: "Municipal Records MCP", desc: "Permit history, zoning codes", port: 3003 },
    { name: "Environmental Data MCP", desc: "FEMA, wetlands, species databases", port: 3004 },
    { name: "Market Data MCP", desc: "Live comp sales and pricing", port: 3005 },
    { name: "Construction Cost MCP", desc: "RSMeans and local bid data", port: 3006 },
];

type ConnState = { status: "connected" | "idle"; key?: string };
type ConnMap = Record<string, ConnState>;

export function Connectors() {
    const [connState, setConnState] = useLS<ConnMap>("axiom_connector_states", {
        google: { status: "idle" }, notion: { status: "idle" }, figma: { status: "idle" },
        slack: { status: "idle" }, zapier: { status: "idle" }, twilio: { status: "idle" },
        sendgrid: { status: "idle" }, docusign: { status: "idle" }, salesforce: { status: "idle" },
        costar: { status: "idle" }, mls: { status: "idle" }, propstream: { status: "idle" },
        propertyware: { status: "idle" },
    });
    const [apiInputs, setApiInputs] = useState<Record<string, string>>({});
    const [activeEdit, setActiveEdit] = useState<string | null>(null);

    const connected = Object.values(connState).filter(v => v.status === "connected").length;

    const handleOAuth = (id: string) => {
        // In production: open OAuth window. For now, simulate connection.
        setConnState((prev: ConnMap) => ({ ...prev, [id]: { status: "connected" } }));
    };

    const handleApiKey = (id: string) => {
        const key = apiInputs[id];
        if (!key?.trim()) return;
        setConnState((prev: ConnMap) => ({ ...prev, [id]: { status: "connected", key } }));
        setActiveEdit(null);
    };

    const handleDisconnect = (id: string) => {
        setConnState((prev: ConnMap) => ({ ...prev, [id]: { status: "idle" } }));
        setApiInputs(prev => ({ ...prev, [id]: "" }));
    };

    const grouped = CONNECTORS.reduce((acc, c) => {
        if (!acc[c.category]) acc[c.category] = [];
        acc[c.category].push(c);
        return acc;
    }, {} as Record<string, ConnectorDef[]>);

    return (
        <Tabs tabs={["Integrations", "MCP Servers", "Webhooks"]}>
            {/* ── Tab 1: Integrations ── */}
            <div>
                <div className="axiom-flex-sb-center" style={{ marginBottom: 20 }}>
                    <div className="axiom-text-13-bold">Institutional Connectors</div>
                    <Badge label={`${connected} / ${CONNECTORS.length} Active`} color={connected > 0 ? "var(--c-green)" : "var(--c-dim)"} />
                </div>

                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category} style={{ marginBottom: 24 }}>
                        <div className="axiom-text-10-gold-ls2-caps" style={{ marginBottom: 10 }}>{category}</div>
                        <div className="axiom-connector-grid">
                            {items.map(c => {
                                const state = connState[c.id] ?? { status: "idle" };
                                const isConnected = state.status === "connected";
                                return (
                                    <div
                                        key={c.id}
                                        className={`axiom-connector-card${isConnected ? " axiom-connector-card--connected" : ""}`}
                                    >
                                        <div className="axiom-connector-header">
                                            <div className="axiom-connector-name" style={{ color: isConnected ? c.color : "var(--c-text)" }}>
                                                {c.name}
                                            </div>
                                            <span className={`axiom-connector-badge axiom-connector-badge--${isConnected ? "connected" : "disconnected"}`}>
                                                {isConnected ? "Connected" : c.type}
                                            </span>
                                        </div>
                                        <div className="axiom-connector-desc">{c.desc}</div>

                                        {/* Action Row */}
                                        {isConnected ? (
                                            <Button label="Disconnect" onClick={() => handleDisconnect(c.id)} style={{ fontSize: 10, padding: "3px 10px" }} />
                                        ) : c.type === "OAuth" ? (
                                            <Button variant="gold" label={c.authLabel} onClick={() => handleOAuth(c.id)} style={{ fontSize: 11 }} />
                                        ) : activeEdit === c.id ? (
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <input
                                                    className="axiom-input"
                                                    placeholder="Paste API key..."
                                                    value={apiInputs[c.id] ?? ""}
                                                    onChange={e => setApiInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                                                    style={{ fontSize: 11, flex: 1 }}
                                                    onKeyDown={e => e.key === "Enter" && handleApiKey(c.id)}
                                                    autoFocus
                                                />
                                                <Button variant="gold" label="Save" onClick={() => handleApiKey(c.id)} style={{ fontSize: 10 }} />
                                                <Button label="✕" onClick={() => setActiveEdit(null)} style={{ fontSize: 10, padding: "3px 8px" }} />
                                            </div>
                                        ) : (
                                            <Button label={c.authLabel} onClick={() => setActiveEdit(c.id)} style={{ fontSize: 11 }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tab 2: MCP Servers ── */}
            <div>
                <Card title="MCP — Model Context Protocol Servers">
                    <div className="axiom-text-11-dim" style={{ marginBottom: 16 }}>
                        Local servers extend Axiom AI with offline datasets, live model streaming, and private data access.
                    </div>
                    <div className="axiom-connector-grid">
                        {MCP_SERVERS.map((s, i) => (
                            <div key={i} className="axiom-connector-card">
                                <div className="axiom-connector-header">
                                    <div className="axiom-connector-name">{s.name}</div>
                                    <Badge label="OFFLINE" color="var(--c-dim)" />
                                </div>
                                <div className="axiom-connector-desc">{s.desc}</div>
                                <div className="axiom-flex-sb-center">
                                    <span className="axiom-text-11-gold-mono">localhost:{s.port}</span>
                                    <Button label="Start Server" onClick={() => { }} variant="gold" style={{ fontSize: 10 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ── Tab 3: Webhooks ── */}
            <div>
                <Card title="Incoming Webhooks">
                    <div className="axiom-widget-placeholder">
                        <div className="axiom-text-14-dim" style={{ marginBottom: 10 }}>No webhooks configured</div>
                        <div className="axiom-text-11-dim" style={{ marginBottom: 16 }}>
                            Webhooks allow external services to push real-time data into Axiom OS.
                        </div>
                        <Button label="+ Create Webhook Endpoint" onClick={() => { }} variant="gold" />
                    </div>
                </Card>
            </div>
        </Tabs>
    );
}
