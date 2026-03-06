import React, { useState } from 'react';
import { C, S } from '../../constants';
import { fmt } from '../../utils';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Field } from '../UI/Field';

function MortgageCalc() {
    const [loan, setLoan] = useState(500000);
    const [rate, setRate] = useState(6.5);
    const [years, setYears] = useState(30);
    const n = years * 12, r = rate / 100 / 12;
    const pmt = r > 0 ? loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
    const totalPaid = pmt * n;
    const totalInterest = totalPaid - loan;
    const amort = Array.from({ length: Math.min(12, n) }, (_, i) => {
        const ip = loan * r * Math.pow(1 + r, i) / (Math.pow(1 + r, n) - 1) * (n - i > 0 ? 1 : 0);
        const bal = loan * (Math.pow(1 + r, n) - Math.pow(1 + r, i + 1)) / (Math.pow(1 + r, n) - 1);
        return { month: i + 1, payment: pmt, principal: pmt - loan * r * Math.pow(1 + r, i) / (Math.pow(1 + r, n) - 1) * (n > 0 ? 1 : 0), interest: ip > 0 ? ip : pmt * 0.7, balance: Math.max(0, bal) };
    });
    return (
        <Card title="Mortgage Calculator">
            <div style={S.g3}>
                <Field label="Loan Amount ($)"><input style={S.inp} type="number" value={loan} onChange={e => setLoan(+e.target.value)} /></Field>
                <Field label="Interest Rate (%)"><input style={S.inp} type="number" step="0.125" value={rate} onChange={e => setRate(+e.target.value)} /></Field>
                <Field label="Term (Years)"><select style={S.sel} value={years} onChange={e => setYears(+e.target.value)}><option value={15}>15 Years</option><option value={20}>20 Years</option><option value={25}>25 Years</option><option value={30}>30 Years</option></select></Field>
            </div>
            <div style={{ ...S.g3, marginTop: 14 }}>
                <div style={{ background: C.bg, border: `1px solid ${C.gold}44`, borderRadius: 4, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2 }}>MONTHLY PAYMENT</div>
                    <div style={{ fontSize: 37, color: C.gold, fontWeight: 700 }}>{fmt.usd(Math.round(pmt))}</div>
                </div>
                <KPI label="Total Paid" value={fmt.usd(Math.round(totalPaid))} color={C.sub} />
                <KPI label="Total Interest" value={fmt.usd(Math.round(totalInterest))} color={C.red} />
            </div>
        </Card>
    );
}

function ROICalc() {
    const [v, setV] = useState({ purchase: 350000, rehab: 85000, arv: 520000, holdMonths: 6, holdCostMo: 3200, closingBuy: 8000, closingSell: 18000, commission: 3 });
    const u = k => e => setV({ ...v, [k]: +e.target.value });
    const totalIn = v.purchase + v.rehab + v.closingBuy;
    const holdCost = v.holdCostMo * v.holdMonths;
    const commAmt = v.arv * v.commission / 100;
    const totalCost = totalIn + holdCost + v.closingSell + commAmt;
    const profit = v.arv - totalCost;
    const roiVal = totalIn > 0 ? profit / totalIn * 100 : 0;
    const annRoi = v.holdMonths > 0 ? roiVal * (12 / v.holdMonths) : 0;
    return (
        <Card title="Flip ROI Analysis">
            <div style={S.g3}>
                <Field label="Purchase Price"><input style={S.inp} type="number" value={v.purchase} onChange={u("purchase")} /></Field>
                <Field label="Rehab / Renovation"><input style={S.inp} type="number" value={v.rehab} onChange={u("rehab")} /></Field>
                <Field label="ARV"><input style={S.inp} type="number" value={v.arv} onChange={u("arv")} /></Field>
            </div>
            <div style={{ ...S.g4, marginTop: 14 }}>
                <KPI label="Total Invested" value={fmt.usd(totalIn)} color={C.sub} />
                <KPI label="Net Profit" value={fmt.usd(profit)} color={profit >= 0 ? C.green : C.red} />
                <KPI label="ROI" value={fmt.pct(roiVal)} color={roiVal > 20 ? C.green : C.amber} />
                <KPI label="Annualized ROI" value={fmt.pct(annRoi)} color={annRoi > 30 ? C.green : C.amber} />
            </div>
        </Card>
    );
}

function CapRateCalc() {
    const [v, setV] = useState({ price: 2000000, gri: 180000, vacancy: 5, opex: 72000 });
    const u = k => e => setV({ ...v, [k]: +e.target.value });
    const egi = v.gri * (1 - v.vacancy / 100);
    const noi = egi - v.opex;
    const capRate = v.price > 0 ? noi / v.price * 100 : 0;
    return (
        <Card title="Cap Rate / NOI Calculator">
            <div style={S.g4}>
                <Field label="Price"><input style={S.inp} type="number" value={v.price} onChange={u("price")} /></Field>
                <Field label="GRI"><input style={S.inp} type="number" value={v.gri} onChange={u("gri")} /></Field>
                <Field label="Vacancy %"><input style={S.inp} type="number" value={v.vacancy} onChange={u("vacancy")} /></Field>
                <Field label="OpEx"><input style={S.inp} type="number" value={v.opex} onChange={u("opex")} /></Field>
            </div>
            <div style={{ ...S.g2, marginTop: 14 }}>
                <KPI label="Cap Rate" value={capRate.toFixed(2) + "%"} color={capRate > 6 ? C.green : C.amber} />
                <KPI label="NOI" value={fmt.usd(noi)} color={C.green} />
            </div>
        </Card>
    );
}

const CALCS = [
    { id: "mortgage", label: "Mortgage", component: MortgageCalc },
    { id: "roi", label: "Flip ROI", component: ROICalc },
    { id: "caprate", label: "Cap Rate", component: CapRateCalc },
];

export default function CalcHub() {
    const [ac, setAc] = useState("mortgage");
    const ActiveComp = CALCS.find(c => c.id === ac)?.component || MortgageCalc;

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 180, flexShrink: 0 }}>
                {CALCS.map(c => (
                    <div key={c.id} style={{ ...S.navi(ac === c.id), marginBottom: 2, borderRadius: 3 }} onClick={() => setAc(c.id)}>
                        <span style={{ fontSize: 12 }}>{c.label}</span>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                <ActiveComp />
            </div>
        </div>
    );
}
