import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge, Dot } from '../UI/Badge';
import { Field } from '../UI/Field';

export default function Connectors() {
    const [list, setList] = useLS("axiom_connectors", [
        { id: 1, name: "CoStar API", type: "API", status: "Connected", key: "cs_••••••••", endpoint: "https://api.costar.com/v1" },
        { id: 2, name: "Regrid Parcels", type: "API", status: "Connected", key: "rg_••••••••", endpoint: "https://app.regrid.com/api" },
        { id: 3, name: "FEMA Flood API", type: "API", status: "Idle", key: "", endpoint: "https://msc.fema.gov" },
        { id: 4, name: "Google Maps", type: "API", status: "Connected", key: "gm_••••••••", endpoint: "https://maps.googleapis.com" },
        { id: 5, name: "ATTOM Data", type: "API", status: "Idle", key: "", endpoint: "https://api.attomdata.com" },
        { id: 6, name: "SketchUp MCP", type: "MCP", status: "Offline", key: "", endpoint: "ws://localhost:3001" },
        { id: 7, name: "GIS Data MCP", type: "MCP", status: "Offline", key: "", endpoint: "ws://localhost:3002" },
        { id: 8, name: "Salesforce CRM", type: "App", status: "Connected", key: "", endpoint: "" },
        { id: 9, name: "Procore", type: "App", status: "Idle", key: "", endpoint: "" },
        { id: 10, name: "DocuSign", type: "App", status: "Idle", key: "", endpoint: "" },
    ]);
    const [nc, setNc] = useState({ name: "", type: "API", key: "", endpoint: "" });
    const SC = { Connected: C.green, Idle: C.amber, Offline: C.dim };

    const add = () => { if (!nc.name) return; setList([...list, { ...nc, id: Date.now(), status: "Idle" }]); setNc({ name: "", type: "API", key: "", endpoint: "" }); };
    const toggle = (id) => setList(list.map(c => c.id === id ? { ...c, status: c.status === "Connected" ? "Idle" : "Connected" } : c));

    const mcpServers = [
        { name: "SketchUp Live Model Server", desc: "3D model streaming and updates", port: 3001 },
        { name: "GIS / Parcel Data MCP", desc: "Live parcel, zoning, and GIS data", port: 3002 },
        { name: "Municipal Records MCP", desc: "Permit history, zoning codes", port: 3003 },
        { name: "Environmental Data MCP", desc: "FEMA, wetlands, species databases", port: 3004 },
        { name: "Market Data MCP", desc: "Live comp sales and pricing", port: 3005 },
        { name: "Construction Cost MCP", desc: "RSMeans and local bid data", port: 3006 },
    ];

    return (
        <Tabs tabs={["Connections", "MCP Servers", "Webhooks"]}>
            <div>
                <Card title="Active Connectors" action={<Badge label={list.filter(c => c.status === "Connected").length + " Active"} color={C.green} />}>
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Name</th><th style={S.th}>Type</th><th style={S.th}>Endpoint</th><th style={S.th}>Status</th><th style={S.th}>Actions</th></tr></thead>
                        <tbody>{list.map(c => (
                            <tr key={c.id}>
                                <td style={{ ...S.td, color: C.text, fontWeight: 500 }}>{c.name}</td>
                                <td style={S.td}><Badge label={c.type} color={c.type === "MCP" ? C.purple : c.type === "App" ? C.teal : C.blue} /></td>
                                <td style={{ ...S.td, fontSize: 10, color: C.dim }}>{c.endpoint || "— "}</td>
                                <td style={S.td}><Dot color={SC[c.status] || C.dim} />{c.status}</td>
                                <td style={S.td}>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => toggle(c.id)}>{c.status === "Connected" ? "Pause" : "Connect"}</button>
                                        <button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => setList(list.filter(x => x.id !== c.id))}>x</button>
                                    </div>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
                <Card title="Add Connector">
                    <div style={S.g4}>
                        <Field label="Name"><input style={S.inp} value={nc.name} onChange={e => setNc({ ...nc, name: e.target.value })} placeholder="Service name" /></Field>
                        <Field label="Type"><select style={S.sel} value={nc.type} onChange={e => setNc({ ...nc, type: e.target.value })}><option>API</option><option>MCP</option><option>App</option><option>Webhook</option></select></Field>
                        <Field label="Endpoint / URL"><input style={S.inp} value={nc.endpoint} onChange={e => setNc({ ...nc, endpoint: e.target.value })} placeholder="https://..." /></Field>
                        <Field label="API Key"><input style={S.inp} type="password" value={nc.key} onChange={e => setNc({ ...nc, key: e.target.value })} placeholder="••••••••" /></Field>
                    </div>
                    <button style={S.btn("gold")} onClick={add}>Add Connector</button>
                </Card>
            </div>
            <div>
                <Card title="Model Context Protocol Servers">
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>MCP servers enable Claude agents to access real-time data from external systems.</div>
                    {mcpServers.map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #0F1117" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, color: C.text }}>{m.name}</div>
                                <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{m.desc}</div>
                            </div>
                            <input style={{ ...S.inp, width: 200 }} defaultValue={`ws://localhost:${m.port}`} />
                            <button style={{ ...S.btn(), padding: "4px 10px", fontSize: 9 }}>Test</button>
                            <button style={{ ...S.btn("gold"), padding: "4px 10px", fontSize: 9 }}>Connect</button>
                        </div>
                    ))}
                </Card>
            </div>
            <div>
                <Card title="Outbound Webhooks">
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>Trigger external systems when project milestones are reached.</div>
                    {["Deal Approved", "Entitlement Filed", "Due Diligence Complete", "Permit Approved", "Construction Started", "Project Closed"].map((e, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid #0F1117" }}>
                            <span style={{ flex: 1, fontSize: 13 }}>{e}</span>
                            <input style={{ ...S.inp, width: 300 }} placeholder="https://your-webhook-url.com/..." />
                            <button style={{ ...S.btn(), padding: "4px 10px", fontSize: 9 }}>Test</button>
                        </div>
                    ))}
                </Card>
            </div>
        </Tabs>
    );
}
