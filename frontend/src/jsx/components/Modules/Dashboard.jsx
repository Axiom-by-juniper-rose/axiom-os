import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar
} from "recharts";
import { C, S, PP, RC } from '../../constants';
import { fmt, useLS } from '../../utils';
import { usePrj } from '../../context/ProjectContext';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Badge } from '../UI/Badge';
import { Progress } from '../UI/Progress';
import { HealthRing } from '../UI/HealthRing';
import { Agent } from '../UI/Agent';
import { ALL_DD } from '../../data/defaults';

export default function Dashboard() {
    const { fin, risks, ddChecks, permits, project } = usePrj();
    const hard = fin.totalLots * fin.hardCostPerLot, soft = hard * fin.softCostPct / 100;
    const fees = fin.planningFees + (fin.permitFeePerLot + fin.schoolFee + fin.impactFeePerLot) * fin.totalLots;
    const cont = (hard + soft) * fin.contingencyPct / 100;
    const totalCost = fin.landCost + fin.closingCosts + hard + soft + cont + fees;
    const revenue = fin.totalLots * fin.salesPricePerLot, comm = revenue * fin.salesCommission / 100;
    const reserves = totalCost * fin.reservePercentage / 100;
    const profit = revenue - comm - reserves - totalCost;
    const margin = revenue > 0 ? profit / revenue * 100 : 0, roi = totalCost > 0 ? profit / totalCost * 100 : 0;

    const allDD = ALL_DD.length;
    const doneDD = Object.values(ddChecks).filter(Boolean).length;
    const openRisks = risks.filter(r => r.status === "Open").length;
    const approvedPerm = permits.filter(p => p.status === "Approved").length;

    const ddS = Math.round(doneDD / allDD * 100);
    const finS = Math.round(Math.min(1, Math.max(0, margin / 20)) * 100);
    const riskS = Math.round((1 - Math.min(1, openRisks / 8)) * 100);
    const permS = permits.length ? Math.round(approvedPerm / permits.length * 100) : 0;
    const health = Math.round(ddS * 0.35 + finS * 0.30 + riskS * 0.20 + permS * 0.15);

    // BUG-M2 fix: replaced fabricated hardcoded multipliers with a model driven from
    // real fin fields (constructionMonths, absorbRate, totalLots, salesPricePerLot).
    const constructionMonths = fin.constructionMonths || 18;
    const constructionYears = Math.max(1, Math.ceil(constructionMonths / 12));
    const sellOutMonths = fin.totalLots > 0 && fin.absorbRate > 0
        ? Math.ceil(fin.totalLots / fin.absorbRate)
        : 24;
    const sellOutYears = Math.max(1, Math.ceil(sellOutMonths / 12));
    const totalYears = constructionYears + sellOutYears;
    const cfData = Array.from({ length: Math.min(totalYears + 1, 8) }, (_, i) => {
        let v = 0;
        if (i === 0) {
            // Year 0: land acquisition + closing costs (equity outlay)
            v = -(fin.landCost + fin.closingCosts) / 1e6;
        } else if (i <= constructionYears) {
            // Construction years: spread hard + soft + fees evenly
            const annualCostBurn = (hard + soft + fees + cont) / constructionYears;
            v = -annualCostBurn / 1e6;
        } else {
            // Revenue phase: distribute lot sales over sell-out period
            const lotsThisYear = Math.min(
                fin.absorbRate > 0 ? fin.absorbRate * 12 : fin.totalLots / sellOutYears,
                fin.totalLots
            );
            const annualRevenue = lotsThisYear * fin.salesPricePerLot;
            const annualComm = annualRevenue * (fin.salesCommission / 100);
            v = (annualRevenue - annualComm) / 1e6;
        }
        return { y: `Y${i}`, v: parseFloat(v.toFixed(2)) };
    });
    const costPie = [
        { name: "Land", value: Math.round((fin.landCost + fin.closingCosts) / totalCost * 100) || 35 },
        { name: "Hard", value: Math.round(hard / totalCost * 100) || 40 },
        { name: "Soft", value: Math.round(soft / totalCost * 100) || 12 },
        { name: "Fees", value: Math.round(fees / totalCost * 100) || 8 },
        { name: "Reserves", value: Math.round(reserves / totalCost * 100) || 5 },
    ];
    const radarD = [
        { sub: "Financial", val: finS }, { sub: "Due Diligence", val: ddS },
        { sub: "Risk", val: riskS }, { sub: "Permits", val: permS }, { sub: "Market", val: 68 },
    ];
    const [layout, setLayout] = useLS("axiom_dashboard_layout", "Standard");

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "var(--c-dim)", textTransform: "uppercase", letterSpacing: 2 }}>Project Overview</div>
                <div style={{ display: "flex", gap: 4, background: "var(--c-bg2)", padding: 4, borderRadius: 6, border: `1px solid var(--c-border)` }}>
                    {["Standard", "Compact", "Metrics"].map(l => (
                        <div key={l} style={{ padding: "4px 12px", fontSize: 10, cursor: "pointer", borderRadius: 4, background: layout === l ? "var(--c-border2)" : "transparent", color: layout === l ? "var(--c-text)" : "var(--c-dim)", fontWeight: layout === l ? 600 : 400, transition: "all 0.1s" }} onClick={() => setLayout(l)}>
                            {l}
                        </div>
                    ))}
                </div>
            </div>
            <div style={layout === "Compact" ? S.g4 : S.g5}>
                <KPI label="Total Lots" value={fmt.num(fin.totalLots)} sub="Concept yield" />
                <KPI label="Total Revenue" value={fmt.M(revenue)} color={C.green} sub="Gross" />
                <KPI label="Net Profit" value={fmt.M(profit)} color={profit >= 0 ? C.green : C.red} sub={`Margin: ${margin.toFixed(1)}%`} />
                {layout !== "Compact" && <KPI label="ROI" value={fmt.pct(roi)} color={roi > 15 ? C.green : C.amber} sub="Return on cost" />}
                {layout !== "Compact" && <KPI label="GRM" value={(fin.grm || 14.2).toFixed(1) + "x"} color={C.blue} sub="Gross rent mult." />}
            </div>
            {layout !== "Metrics" && (
                <div style={{ ...(layout === "Compact" ? S.g2 : S.g3), marginTop: 14 }}>
                    <div style={{ gridColumn: layout === "Compact" ? "1/3" : "1/3" }}>
                        <Card title="Projected Cash Flow ($ Millions)">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={cfData}>
                                    <defs><linearGradient id="cfg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.gold} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
                                    </linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 6" stroke={C.border} strokeOpacity={0.5} />
                                    <XAxis dataKey="y" stroke={C.dim} tick={{ fontSize: 12, fontFamily: 'Inter,sans-serif', fill: C.muted }} />
                                    <YAxis stroke={C.dim} tick={{ fontSize: 12, fontFamily: 'Inter,sans-serif', fill: C.muted }} tickFormatter={v => `$${v.toFixed(1)}M`} />
                                    <Tooltip contentStyle={{ background: "rgba(17,19,24,0.95)", border: `1px solid ${C.gold}33`, borderRadius: 8, fontSize: 13, fontFamily: "Inter,sans-serif", padding: "10px 14px", boxShadow: "0 8px 32px rgba(212,168,67,0.15)", backdropFilter: "blur(12px)" }} cursor={{ stroke: C.gold, strokeWidth: 1, strokeDasharray: "4 4" }} formatter={v => [`$${v.toFixed(2)}M`, "Cash Flow"]} />
                                    <Area type="monotone" dataKey="v" stroke={C.gold} fill="url(#cfg)" strokeWidth={2.5} dot={{ fill: C.gold, r: 4, strokeWidth: 2, stroke: C.bg3 }} activeDot={{ r: 6, fill: C.gold, stroke: C.bg, strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                    <Card title="Project Health">
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><HealthRing score={health} /></div>
                        {[["Due Diligence", ddS, C.blue], ["Financial", finS, C.green], ["Risk Mgmt", riskS, C.amber], ["Permits", permS, C.purple]].map(([l, v, col]) => (
                            <div key={l} style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span style={{ fontSize: 10, color: C.dim }}>{l}</span>
                                    <span style={{ fontSize: 10, color: col, fontWeight: 700 }}>{v}%</span>
                                </div>
                                <Progress value={v} color={col} />
                            </div>
                        ))}
                    </Card>
                </div>)}
            <div style={layout === "Compact" ? S.g3 : S.g2}>
                <Card title="Cost Allocation">
                    <ResponsiveContainer width="100%" height={210}>
                        <PieChart style={{ cursor: 'pointer' }}>
                            <Pie data={costPie} cx="50%" cy="50%" outerRadius={75} innerRadius={45} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} style={{ fontSize: 9 }}>
                                {costPie.map((_, i) => <Cell key={i} fill={PP[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: "rgba(17,19,24,0.95)", border: `1px solid ${C.gold}33`, borderRadius: 8, fontSize: 13, fontFamily: "Inter,sans-serif", padding: "10px 14px", boxShadow: "0 8px 32px rgba(212,168,67,0.15)", backdropFilter: "blur(12px)" }} cursor={{ stroke: C.gold, strokeWidth: 1, strokeDasharray: "4 4" }} formatter={v => [`${v}%`]} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Deal Readiness Radar">
                    <ResponsiveContainer width="100%" height={210}>
                        <RadarChart data={radarD} style={{ cursor: 'pointer' }}>
                            <PolarGrid stroke={C.border} strokeOpacity={0.4} />
                            <PolarAngleAxis dataKey="sub" tick={{ fill: C.muted, fontSize: 11, fontFamily: 'Inter,sans-serif' }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar dataKey="val" stroke={C.gold} fill={C.gold} fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: C.gold, stroke: C.bg3, strokeWidth: 1 }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card title="Project Snapshot">
                <div style={S.g3}>
                    {[
                        ["Project", project.name || "Unnamed"], ["Address", project.address || "— "], ["Jurisdiction", project.jurisdiction || "— "],
                        ["Total Cost", fmt.usd(totalCost)], ["Gross Revenue", fmt.usd(revenue)], ["Net Profit", fmt.usd(profit)],
                        ["Cost / Lot", fmt.usd(totalCost / (fin.totalLots || 1))], ["Revenue / Lot", fmt.usd(revenue / (fin.totalLots || 1))], ["Sell-Out Timeline", `${Math.ceil(fin.totalLots / (fin.absorbRate || 1))} months`],
                    ].map(([l, v]) => (
                        <div key={l} style={{ borderBottom: `1px solid ${C.border}`, padding: "7px 0" }}>
                            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                            <div style={{ fontSize: 14, color: C.text, marginTop: 2, fontWeight: 500 }}>{v}</div>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Executive Summary · AI Agent">
                <Agent id="Executive" system="You are a senior real estate development analyst creating investor-grade executive summaries. Include deal thesis, site overview, concept yield, financial highlights (IRR, margin, ROI), key risks, and go/no-go recommendation." placeholder="Describe your project for an investor-grade executive summary..." />
            </Card>
        </>
    );
}
