import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';

export default function ReportsBinder() {
    const [reports, setReports] = useLS("axiom_reports", [
        { id: 1, name: "Executive Summary", type: "PDF", date: "2024-02-15", status: "Current", size: "1.2 MB" },
        { id: 2, name: "Pro Forma Detail", type: "Excel", date: "2024-02-14", status: "Draft", size: "2.4 MB" },
        { id: 3, name: "Market Analysis", type: "PDF", date: "2024-01-30", status: "Stale", size: "4.8 MB" },
        { id: 4, name: "Site Plan A", type: "DWG", date: "2024-02-01", status: "Current", size: "12.5 MB" },
        { id: 5, name: "Phase I ESA", type: "PDF", date: "2023-11-20", status: "Final", size: "8.1 MB" },
    ]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: C.gold, margin: 0 }}>Project Binder & Reports</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={S.btn()}>Upload Document</button>
                    <button style={S.btn("gold")}>Generate Report Bundle</button>
                </div>
            </div>
            <Card title="Document Inventory">
                <table style={S.tbl}>
                    <thead><tr><th style={S.th}>Document Name</th><th style={S.th}>Format</th><th style={S.th}>Date</th><th style={S.th}>Size</th><th style={S.th}>Status</th><th style={S.th}>Actions</th></tr></thead>
                    <tbody>{reports.map(r => (
                        <tr key={r.id}>
                            <td style={{ ...S.td, color: C.text, fontWeight: 500 }}>{r.name}</td>
                            <td style={S.td}><Badge label={r.type} color={r.type === "PDF" ? C.red : r.type === "Excel" ? C.green : C.blue} /></td>
                            <td style={S.td}>{r.date}</td>
                            <td style={S.td}>{r.size}</td>
                            <td style={S.td}><Badge label={r.status} color={r.status === "Current" ? C.green : r.status === "Stale" ? C.amber : C.blue} /></td>
                            <td style={S.td}><div style={{ display: "flex", gap: 4 }}><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }}>View</button><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }}>v</button></div></td>
                        </tr>
                    ))}</tbody>
                </table>
            </Card>
            <div style={S.g2}>
                <Card title="Report Templates">
                    {["Investor Pitch Deck", "Lender Package", "Planning Commission Prep", "Internal Deal Memo", "Vendor RFP Bundle"].map(t => (
                        <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 13 }}>{t}</span>
                            <button style={{ ...S.btn(), padding: "4px 10px", fontSize: 10 }}>Generate</button>
                        </div>
                    ))}
                </Card>
                <Card title="Quick Export">
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>Batch export project data to standard formats.</div>
                    <div style={S.g2}>
                        <button style={S.btn()}>Export Financials (.csv)</button>
                        <button style={S.btn()}>Export Checklist (.csv)</button>
                        <button style={S.btn()}>Export Risks (.csv)</button>
                        <button style={S.btn()}>Full Data Pack (.json)</button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
