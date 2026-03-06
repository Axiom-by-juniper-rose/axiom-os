import React, { useState } from 'react';
import { C, S } from '../../constants';
import { fmt, useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Badge, Dot } from '../UI/Badge';

export default function InvoicesPayments() {
    const [invoices, setInvoices] = useLS("axiom_invoices", [
        { id: 1, vendor: "Thompson Civil Engineering", amount: 12500, date: "2025-02-15", status: "Paid", category: "Soft Costs", deal: "Sunset Ridge" },
        { id: 2, vendor: "Pacific Realty Group", amount: 45000, date: "2025-02-10", status: "Pending", category: "Acquisition", deal: "Sunset Ridge" },
        { id: 3, vendor: "City of Sacramento", amount: 8500, date: "2025-02-18", status: "Approved", category: "Fees", deal: "Hawk Valley" },
        { id: 4, vendor: "A+ Grading Services", amount: 28000, date: "2025-02-22", status: "New", category: "Hard Costs", deal: "Sunset Ridge" },
    ]);

    const stats = [
        { l: "Total Invoiced", v: fmt.usd(invoices.reduce((a, b) => a + b.amount, 0)), c: C.text },
        { l: "Paid", v: fmt.usd(invoices.filter(i => i.status === "Paid").reduce((a, b) => a + b.amount, 0)), c: C.green },
        { l: "Pending", v: fmt.usd(invoices.filter(i => i.status !== "Paid").reduce((a, b) => a + b.amount, 0)), c: C.amber },
    ];

    return (
        <Tabs tabs={["Invoices", "Draw Requests", "Approval Workflow"]}>
            <div>
                <div style={{ ...S.g3, marginBottom: 14 }}>
                    {stats.map(s => <KPI key={s.l} label={s.l} value={s.v} color={s.c} />)}
                </div>
                <Card title="Invoice Management" action={<button style={S.btn("gold")}>+ Ingest Invoice</button>}>
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Vendor</th><th style={S.th}>Category</th><th style={S.th}>Amount</th><th style={S.th}>Date</th><th style={S.th}>Status</th><th style={S.th}>Deal</th></tr></thead>
                        <tbody>
                            {invoices.map(i => (
                                <tr key={i.id}>
                                    <td style={{ ...S.td, fontWeight: 600 }}>{i.vendor}</td>
                                    <td style={S.td}><Badge label={i.category} color={C.blue} /></td>
                                    <td style={{ ...S.td, color: C.gold }}>{fmt.usd(i.amount)}</td>
                                    <td style={S.td}>{i.date}</td>
                                    <td style={S.td}><Dot color={i.status === "Paid" ? C.green : C.amber} />{i.status}</td>
                                    <td style={S.td}>{i.deal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </Tabs>
    );
}
