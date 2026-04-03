import { useState } from "react";
import { Card, Badge, Button, Progress } from "../../components/ui/components";
import { useProject } from "../../context/ProjectContext";
import { swarmEngine } from "../../services/SwarmEngine";

// ─── INTEGRATION CONNECTORS ─────────────────────────────────
interface IntegrationConfig {
    n8n: { url: string; connected: boolean; workflows: { id: string; name: string; active: boolean }[] };
    airtable: { connected: boolean; bases: { id: string; name: string }[] };
}

function useIntegrationConfig(): [IntegrationConfig, (c: IntegrationConfig) => void] {
    const [config, setConfig] = useState<IntegrationConfig>(() => {
        try {
            const saved = localStorage.getItem("axiom-integrations");
            return saved ? JSON.parse(saved) : {
                n8n: { url: "", connected: false, workflows: [] },
                airtable: { connected: false, bases: [] },
            };
        } catch { return { n8n: { url: "", connected: false, workflows: [] }, airtable: { connected: false, bases: [] } }; }
    });
    const save = (c: IntegrationConfig) => { setConfig(c); localStorage.setItem("axiom-integrations", JSON.stringify(c)); };
    return [config, save];
}

interface WorkflowTrigger {
    id: string;
    name: string;
    desc: string;
    active: boolean;
    lastRun?: string;
    category: "AI" | "Finance" | "CRM";
}

export function WorkflowHub() {
    const { project } = useProject() as any;
    const [integrations, setIntegrations] = useIntegrationConfig();
    const [workflows, setWorkflows] = useState<WorkflowTrigger[]>([
        { id: "ic-memo", name: "Auto IC Memo", desc: "Generate investment memo when Deal Score > 75%", active: true, category: "AI", lastRun: "2 hours ago" },
        { id: "pro-forma", name: "Live Pro Forma", desc: "Recalculate pro forma on any land cost change", active: true, category: "Finance", lastRun: "5 mins ago" },
        { id: "crm-sync", name: "Lead Sync", desc: "Push new listings matching criteria to CRM", active: false, category: "CRM" },
        { id: "audit-gen", name: "Risk Auditor", desc: "Daily risk registry scan for critical threats", active: true, category: "AI", lastRun: "1 day ago" },
        { id: "report-dist", name: "Auto Distribution", desc: "Distribute weekly project status to LPs", active: false, category: "CRM" },
    ]);

    const toggleWorkflow = (id: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    };

    return (
        <div className="axiom-stack-20">
            <div className="axiom-grid-2 axiom-gap-20">
                <Card title="Automation Engine Status" action={<Badge label="SYSTEM ONLINE" color="var(--c-green)" />}>
                    <div className="axiom-flex-sb-center axiom-mb-16">
                        <div className="axiom-text-11-dim">Active Triggers</div>
                        <div className="axiom-text-14-bold">{workflows.filter(w => w.active).length} / {workflows.length}</div>
                    </div>
                    <Progress value={(workflows.filter(w => w.active).length / workflows.length) * 100} />
                    <div className="axiom-text-10-dim axiom-mt-12">
                        Axiom is monitoring 124 data streams for {project.name || "active project"}.
                    </div>
                </Card>

                <Card title="Compute Load">
                    <div className="axiom-flex-sb-center axiom-mb-10">
                        <span className="axiom-text-11-dim">LLM Tokens / Day</span>
                        <span className="axiom-text-12-bold">4.2k</span>
                    </div>
                    <div className="axiom-flex-sb-center axiom-mb-10">
                        <span className="axiom-text-11-dim">Automation Threads</span>
                        <span className="axiom-text-12-bold">Active</span>
                    </div>
                    <div className="axiom-flex-sb-center">
                        <span className="axiom-text-11-dim">Pattern Scoring</span>
                        <Badge label="OPTIMAL" color="var(--c-teal)" />
                    </div>
                </Card>
            </div>

            <Card title="Configured Automations">
                <div className="axiom-text-12-dim axiom-mb-16">
                    Define triggers that connect project data updates to AI agents and external services.
                </div>
                <div className="axiom-stack-8">
                    {workflows.map(w => (
                        <div key={w.id} className="axiom-flex-sb-center axiom-p-12-16 axiom-bg-2 axiom-radius-6 axiom-border-1 premium-hover">
                            <div className="axiom-flex-center-gap-14">
                                <div className="axiom-w-32 axiom-h-32 axiom-flex-center axiom-bg-3 axiom-radius-full">
                                    <span className="axiom-text-14">{w.category === "AI" ? "✦" : w.category === "Finance" ? "$" : "👤"}</span>
                                </div>
                                <div>
                                    <div className="axiom-flex-center-gap-8">
                                        <div className="axiom-text-13-text-bold">{w.name}</div>
                                        <Badge label={w.category} color={w.category === "AI" ? "var(--c-gold)" : w.category === "Finance" ? "var(--c-green)" : "var(--c-blue)"} />
                                    </div>
                                    <div className="axiom-text-11-dim axiom-mt-2">{w.desc}</div>
                                </div>
                            </div>
                            <div className="axiom-flex-center-gap-16">
                                {w.name.includes("Audit") && w.active && (
                                    <Button
                                        label="▶ Run"
                                        className="axiom-p-4-10 axiom-text-9"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            swarmEngine.init("Automated Project Risk Audit");
                                            swarmEngine.addTask("Scan Risk Registry for critical entries", "SYSTEM");
                                            swarmEngine.addTask("Analyze financial exposure of found risks", "FINANCIAL");
                                            swarmEngine.addTask("Draft mitigation strategy tasks", "ADMIN");
                                            const el = document.querySelector('[data-nav="hub"]') as HTMLElement;
                                            if (el) el.click();
                                        }}
                                    />
                                )}
                                {w.active && w.lastRun && <div className="axiom-text-9-dim-italic">Last run: {w.lastRun}</div>}
                                <div
                                    className={`axiom-switch ${w.active ? "active" : ""}`}
                                    onClick={() => toggleWorkflow(w.id)}
                                    title={w.active ? "Deactivate" : "Activate"}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <Button label="+ Create New Automation" variant="gold" className="axiom-mt-16 axiom-full-width" />
            </Card>

            {/* ── INTEGRATIONS: n8n + Airtable ────────────────────────── */}
            <Card title="External Integrations" action={<Badge label="MCP / API" color="var(--c-purple)" />}>
                <div className="axiom-grid-2 axiom-gap-16">
                    {/* n8n Panel */}
                    <div className="axiom-p-16 axiom-bg-2 axiom-radius-6 axiom-border-1">
                        <div className="axiom-flex-center-gap-8 axiom-mb-12">
                            <span style={{ fontSize: 18 }}>⚡</span>
                            <div>
                                <div className="axiom-text-13-text-bold">n8n Workflow Automation</div>
                                <div className="axiom-text-10-dim">Connect your n8n instance to trigger workflows from Axiom events</div>
                            </div>
                        </div>
                        <div className="axiom-stack-8">
                            <input
                                className="axiom-ai-input"
                                style={{ minHeight: 36, fontFamily: "'DM Mono', monospace", fontSize: 12 }}
                                placeholder="https://your-n8n-instance.app.n8n.cloud"
                                value={integrations.n8n.url}
                                onChange={e => setIntegrations({ ...integrations, n8n: { ...integrations.n8n, url: e.target.value } })}
                            />
                            <div className="axiom-flex-center-gap-8">
                                <Button
                                    label={integrations.n8n.connected ? "✓ Connected" : "Connect"}
                                    variant={integrations.n8n.connected ? "ghost" : "gold"}
                                    onClick={() => {
                                        if (integrations.n8n.url.trim()) {
                                            setIntegrations({
                                                ...integrations,
                                                n8n: {
                                                    ...integrations.n8n,
                                                    connected: true,
                                                    workflows: [
                                                        { id: "wf-1", name: "Deal Intake → Enrichment", active: true },
                                                        { id: "wf-2", name: "Risk Alert → Slack Notify", active: false },
                                                        { id: "wf-3", name: "Weekly LP Report → Email", active: true },
                                                    ]
                                                }
                                            });
                                        }
                                    }}
                                />
                                {integrations.n8n.connected && (
                                    <Button label="Disconnect" variant="ghost" onClick={() => setIntegrations({ ...integrations, n8n: { url: "", connected: false, workflows: [] } })} />
                                )}
                            </div>
                            {integrations.n8n.connected && integrations.n8n.workflows.length > 0 && (
                                <div className="axiom-stack-4 axiom-mt-8">
                                    <div className="axiom-text-9-dim" style={{ letterSpacing: 2, textTransform: "uppercase" }}>Available Workflows</div>
                                    {integrations.n8n.workflows.map(wf => (
                                        <div key={wf.id} className="axiom-flex-sb-center axiom-py-6">
                                            <span className="axiom-text-12">{wf.name}</span>
                                            <Badge label={wf.active ? "ACTIVE" : "INACTIVE"} color={wf.active ? "var(--c-green)" : "var(--c-dim)"} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Airtable Panel */}
                    <div className="axiom-p-16 axiom-bg-2 axiom-radius-6 axiom-border-1">
                        <div className="axiom-flex-center-gap-8 axiom-mb-12">
                            <span style={{ fontSize: 18 }}>📊</span>
                            <div>
                                <div className="axiom-text-13-text-bold">Airtable MCP</div>
                                <div className="axiom-text-10-dim">Sync deal pipeline, contacts, and project data with Airtable bases</div>
                            </div>
                        </div>
                        <div className="axiom-stack-8">
                            <div className="axiom-flex-center-gap-8">
                                <Button
                                    label={integrations.airtable.connected ? "✓ Connected via MCP" : "Connect Airtable"}
                                    variant={integrations.airtable.connected ? "ghost" : "gold"}
                                    onClick={() => {
                                        setIntegrations({
                                            ...integrations,
                                            airtable: {
                                                connected: true,
                                                bases: [
                                                    { id: "base-1", name: "Deal Pipeline Tracker" },
                                                    { id: "base-2", name: "Contact Directory" },
                                                    { id: "base-3", name: "Project Milestones" },
                                                ]
                                            }
                                        });
                                    }}
                                />
                                {integrations.airtable.connected && (
                                    <Button label="Disconnect" variant="ghost" onClick={() => setIntegrations({ ...integrations, airtable: { connected: false, bases: [] } })} />
                                )}
                            </div>
                            {integrations.airtable.connected && integrations.airtable.bases.length > 0 && (
                                <div className="axiom-stack-4 axiom-mt-8">
                                    <div className="axiom-text-9-dim" style={{ letterSpacing: 2, textTransform: "uppercase" }}>Synced Bases</div>
                                    {integrations.airtable.bases.map(b => (
                                        <div key={b.id} className="axiom-flex-sb-center axiom-py-6">
                                            <span className="axiom-text-12">{b.name}</span>
                                            <Badge label="SYNCED" color="var(--c-green)" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="axiom-text-10-dim axiom-mt-8">
                                Axiom reads/writes Airtable via the MCP server protocol. Configure field mappings in Settings → Connectors.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="axiom-text-10-dim axiom-mt-16" style={{ textAlign: "center" }}>
                    Event mapping: Deal Created → n8n webhook | Risk Updated → Slack alert | Contact Added → Airtable sync
                </div>
            </Card>

            <Card title="Recent Activity Logs">
                <div className="axiom-stack-6">
                    {[
                        { time: "14:22:04", event: "Auto-Recalculate Pro Forma", status: "SUCCESS", detail: "Land cost updated to $1.2M" },
                        { time: "12:15:30", event: "Pattern Match: Site Comps", status: "INFO", detail: "4 new listings found in R-3 zoning" },
                        { time: "09:45:12", event: "LP Report Generation", status: "QUEUED", detail: "Waiting for monthly close" },
                    ].map((l, i) => (
                        <div key={i} className="axiom-flex-sb-center axiom-py-8 axiom-border-t-1">
                            <div className="axiom-flex-center-gap-10">
                                <span className="axiom-mono-11-dim">{l.time}</span>
                                <span className="axiom-text-12">{l.event}</span>
                            </div>
                            <div className="axiom-flex-center-gap-8">
                                <span className="axiom-text-10-dim">{l.detail}</span>
                                <Badge label={l.status} color={l.status === "SUCCESS" ? "var(--c-green)" : l.status === "INFO" ? "var(--c-blue)" : "var(--c-amber)"} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
