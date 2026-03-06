import React from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Progress } from '../UI/Progress';
import { CItem } from '../UI/CItem';
import { CSVImportButton } from '../UI/CSVImportButton';
import { DD_CATS, DEFAULT_PERMITS } from '../../data/defaults';

export default function ProcessControl() {
    const [dd, setDd] = useLS("axiom_dd_v2", {});
    const [per, setPer] = useLS("axiom_permits_v2", DEFAULT_PERMITS);

    const toggleDD = (k) => setDd({ ...dd, [k]: !dd[k] });
    const togglePerm = (id) => setPer(per.map(p => p.id === id ? { ...p, status: p.status === "Approved" ? "Pending" : "Approved" } : p));
    const updPerm = (id, f, v) => setPer(per.map(p => p.id === id ? { ...p, [f]: v } : p));

    const totalDD = DD_CATS.reduce((a, c) => a + c.items.length, 0);
    const doneDD = Object.values(dd).filter(Boolean).length;
    const ddPct = Math.round(doneDD / totalDD * 100);

    return (
        <Tabs tabs={["Due Diligence Checklist", "Permit Tracker", "Phase Timeline", "Document Binder"]}>
            <div>
                <Card title="Due Diligence Status" action={<div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 10, color: C.dim }}>{doneDD}/{totalDD} Tasks</span><Badge label={`${ddPct}%`} color={C.blue} /></div>}>
                    <Progress value={ddPct} color={C.blue} height={6} />
                    <div style={{ ...S.g2, marginTop: 14 }}>
                        {DD_CATS.map((cat, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase", borderBottom: `1px solid ${C.gold}22`, paddingBottom: 4 }}>{cat.cat}</div>
                                {cat.items.map(it => (
                                    <CItem key={it.id} label={it.name} checked={dd[it.id]} risk={it.risk} onClick={() => toggleDD(it.id)} />
                                ))}
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Due Diligence · AI Agent">
                    <Agent id="DD" system="You are a due diligence coordinator. Help users organize site investigations, technical reports, and vendor coordination. Spot gaps in the checklist and flag potential critical-path items." placeholder="Ask about due diligence priorities or missing items..." />
                </Card>
            </div>
            <div>
                <Card title="Permit & Entitlement Tracker" action={<CSVImportButton onImport={(data) => setPer([...per, ...data.map((d, i) => ({ ...d, id: Date.now() + i }))])} />}>
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Permit / Application</th><th style={S.th}>Agency</th><th style={S.th}>Submitted</th><th style={S.th}>Status</th><th style={S.th}>Reference #</th><th style={S.th}>Actions</th></tr></thead>
                        <tbody>{per.map(p => (
                            <tr key={p.id}>
                                <td style={{ ...S.td, color: C.text, fontWeight: 500 }}>{p.type}</td>
                                <td style={S.td}>{p.agency}</td>
                                <td style={S.td}><input style={{ ...S.inp, padding: "3px 6px", fontSize: 11 }} value={p.submitted || ""} onChange={e => updPerm(p.id, "submitted", e.target.value)} /></td>
                                <td style={S.td}><Badge label={p.status} color={p.status === "Approved" ? C.green : p.status === "Conditional" ? C.blue : C.amber} /></td>
                                <td style={S.td}><input style={{ ...S.inp, padding: "3px 6px", fontSize: 11 }} value={p.ref || ""} onChange={e => updPerm(p.id, "ref", e.target.value)} /></td>
                                <td style={S.td}><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => togglePerm(p.id)}>{p.status === "Approved" ? "Undo" : "Approve"}</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                    <button style={{ ...S.btn("gold"), marginTop: 12 }} onClick={() => setPer([...per, { id: Date.now(), type: "New Permit", agency: "", status: "Pending", ref: "" }])}>Add Permit Row</button>
                </Card>
            </div>
        </Tabs>
    );
}
