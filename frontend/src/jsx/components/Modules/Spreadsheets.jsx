import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Card } from '../UI/Card';
import { Agent } from '../UI/Agent';

export default function Spreadsheets() {
    const [sheets, setSheets] = useLS("axiom_sheets", [
        {
            id: 1, name: "Development Pro Forma - Sunset Ridge", rows: 15, cols: 8, type: "Pro Forma", modified: "2025-02-20", data: [
                ["Item", "Units", "$/Unit", "Subtotal", "% of Total", "Notes"],
                ["Land Acquisition", "1", "3,000,000", "$3,000,000", "27.8%", "Under contract"],
                ["Hard Costs - Grading", "42", "12,000", "$504,000", "4.7%", "Per civil estimate"],
            ]
        },
    ]);
    const [active, setActive] = useState(sheets[0]?.id);
    const sheet = sheets.find(s => s.id === active);
    const updCell = (r, c2, val) => { if (!sheet) return; const nd = sheet.data.map((row, ri) => row.map((cell, ci) => ri === r && ci === c2 ? val : cell)); setSheets(sheets.map(s => s.id === active ? { ...s, data: nd, modified: new Date().toISOString().split("T")[0] } : s)); };

    return (
        <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, alignItems: "center" }}>
                {sheets.map(s => (
                    <div key={s.id} style={{ ...S.navi(active === s.id), borderRadius: 3, padding: "4px 10px", cursor: "pointer" }} onClick={() => setActive(s.id)}>
                        <span style={{ fontSize: 12 }}>{s.name}</span>
                    </div>
                ))}
            </div>
            {sheet && (
                <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 3 }}>
                    <table style={{ ...S.tbl, width: "100%" }}>
                        <tbody>
                            {sheet.data.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} style={{ ...S.td, background: ri === 0 ? C.bg2 : C.bg3, color: ri === 0 ? C.gold : C.sub, fontSize: 10, minWidth: 90 }}>
                                            <input style={{ ...S.inp, width: "100%", border: "none", background: "transparent" }} value={cell} onChange={e => updCell(ri, ci, e.target.value)} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
