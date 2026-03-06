import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { C, S, RC } from '../../constants';
import { fmt, useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function DataIntel() {
    const IT = ["Zoning Change", "Permit Activity", "Market Report", "Comp Sale", "Development News", "Infrastructure", "Political", "Public Record", "Broker Intel", "Other"];
    const [records, setRecords] = useLS("axiom_intel", [
        { id: 1, type: "Zoning Change", title: "Rezoning Application - 500 Elm St", source: "City Planning Portal", date: "2025-02-15", relevance: "High", summary: "Adjacent parcel rezoning from C-2 to R-3 could increase density allowance for subject.", linked: true },
        { id: 2, type: "Market Report", title: "Q4 2024 Land Sales Report - Sacramento MSA", source: "CoStar Analytics", date: "2025-01-20", relevance: "Medium", summary: "Finished lot prices up 8% YoY. Absorption rates steady at 3.2 lots/month for SFR.", linked: true },
        { id: 3, type: "Permit Activity", title: "125-Lot Subdivision Approved - Oak Grove", source: "County Records", date: "2025-02-08", relevance: "High", summary: "Competing project 2 miles from subject site. Expected to begin construction Q3 2025.", linked: false },
        { id: 4, type: "Infrastructure", title: "Highway 50 Interchange Improvement", source: "Caltrans", date: "2025-01-30", relevance: "Medium", summary: "$42M interchange project begins 2026. Will improve access to subject by 8 minutes.", linked: false },
        { id: 5, type: "Comp Sale", title: "Lot Sale - 45 lots @ $178K/lot", source: "MLS / Public Records", date: "2025-02-12", relevance: "High", summary: "Comparable subdivision sold. 45 finished lots averaging 5,200 SF at $178,000 per lot.", linked: true },
        { id: 6, type: "Development News", title: "School District Bond Measure Passed", source: "Local News", date: "2025-02-01", relevance: "Medium", summary: "$180M school bond passed. New elementary school planned within 1 mile of subject.", linked: false },
    ]);
    const [filterType, setFilterType] = useState("All");
    const [filterRel, setFilterRel] = useState("All");
    const [nr, setNr] = useState({ type: "Market Report", title: "", source: "", summary: "", relevance: "Medium", linked: false });

    const filtered = records.filter(r => {
        if (filterType !== "All" && r.type !== filterType) return false;
        if (filterRel !== "All" && r.relevance !== filterRel) return false;
        return true;
    });

    const addRec = () => { if (!nr.title) return; setRecords([...records, { ...nr, id: Date.now(), date: new Date().toISOString().split("T")[0] }]); setNr({ type: "Market Report", title: "", source: "", summary: "", relevance: "Medium", linked: false }); };
    const TC3 = { ...RC, "Zoning Change": C.purple, "Permit Activity": C.amber, "Market Report": C.blue, "Comp Sale": C.green, "Development News": C.teal, Infrastructure: C.gold, Political: C.red, "Public Record": C.dim, "Broker Intel": C.gold, Other: C.muted };

    return (
        <Tabs tabs={["Intel Feed", "Add Record", "Analytics", "Live Market"]}>
            <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <input style={{ ...S.inp, flex: 1 }} placeholder="Search intel records..." />
                    <select style={{ ...S.sel, width: 140 }} value={filterType} onChange={e => setFilterType(e.target.value)}><option>All</option>{IT.map(t => <option key={t}>{t}</option>)}</select>
                    <select style={{ ...S.sel, width: 100 }} value={filterRel} onChange={e => setFilterRel(e.target.value)}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select>
                </div>
                <Card title={`Intelligence Feed (${filtered.length} records)`}>
                    {filtered.map(r => (
                        <div key={r.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #0F1117" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                                    <Badge label={r.type} color={TC3[r.type] || C.dim} />
                                    <Badge label={r.relevance} color={RC[r.relevance] || C.dim} />
                                    {r.linked && <Badge label="Linked" color={C.gold} />}
                                    <span style={{ fontSize: 10, color: C.dim, marginLeft: "auto" }}>{r.date}</span>
                                </div>
                                <div style={{ fontSize: 13, color: C.text, fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
                                <div style={{ fontSize: 12, color: C.dim, marginBottom: 2 }}>Source: {r.source}</div>
                                <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.4 }}>{r.summary}</div>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
            <div>
                <Card title="Add Intel Record">
                    <div style={S.g3}>
                        <Field label="Intel Type"><select style={S.sel} value={nr.type} onChange={e => setNr({ ...nr, type: e.target.value })}>{IT.map(t => <option key={t}>{t}</option>)}</select></Field>
                        <Field label="Title"><input style={S.inp} value={nr.title} onChange={e => setNr({ ...nr, title: e.target.value })} placeholder="Brief descriptive title" /></Field>
                        <Field label="Source"><input style={S.inp} value={nr.source} onChange={e => setNr({ ...nr, source: e.target.value })} placeholder="CoStar, County Records, MLS..." /></Field>
                    </div>
                    <button style={S.btn("gold")} onClick={addRec}>Save Intel Record</button>
                </Card>
            </div>
        </Tabs>
    );
}
