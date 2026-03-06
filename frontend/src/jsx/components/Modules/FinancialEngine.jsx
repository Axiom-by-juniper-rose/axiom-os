import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { C, S, PP } from '../../constants';
import { fmt } from '../../utils';
import { usePrj } from '../../context/ProjectContext';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function FinancialEngine() {
    const { fin, setFin } = usePrj();
    const fu = k => e => setFin({ ...fin, [k]: parseFloat(e.target.value) || 0 });

    const hard = fin.totalLots * fin.hardCostPerLot, soft = hard * fin.softCostPct / 100;
    const fees = fin.planningFees + (fin.permitFeePerLot + fin.schoolFee + fin.impactFeePerLot) * fin.totalLots;
    const cont = (hard + soft) * fin.contingencyPct / 100;
    const totalCost = fin.landCost + fin.closingCosts + hard + soft + cont + fees;
    const revenue = fin.totalLots * fin.salesPricePerLot, comm = revenue * fin.salesCommission / 100;
    const reserves = totalCost * fin.reservePercentage / 100;
    const profit = revenue - comm - reserves - totalCost;
    const roi = totalCost > 0 ? profit / totalCost * 100 : 0, irr = roi * 0.85; // Static approx

    const sensitivity = [-10, -5, 0, 5, 10].map(pct => {
        const r = revenue * (1 + pct / 100), p = r - comm - reserves - totalCost;
        return { name: `${pct > 0 ? '+' : ''}${pct}%`, profit: p / 1e6, roi: (p / totalCost * 100) };
    });

    return (
        <Tabs tabs={["Pro Forma", "Acquisition", "Hard Costs", "Soft Costs / Fees", "Capital Stack", "Sensitivity"]}>
            <div>
                <div style={S.g4}>
                    <KPI label="Total Project Cost" value={fmt.usd(totalCost)} sub={`$${(totalCost / fin.totalLots).toLocaleString()} / lot`} />
                    <KPI label="Net Profit" value={fmt.usd(profit)} color={profit > 0 ? C.green : C.red} sub="Unlevered" />
                    <KPI label="Return on Cost" value={fmt.pct(roi)} color={roi > 15 ? C.green : C.amber} sub="Total ROI" />
                    <KPI label="Project IRR" value={fmt.pct(irr)} color={irr > 20 ? C.green : C.amber} sub="Unlevered Est." />
                </div>
                <Card title="Executive Pro Forma Summary">
                    <table style={S.tbl}>
                        <tbody>
                            <tr style={{ background: "rgba(212,168,67,0.05)" }}><td style={{ ...S.td, color: C.gold, fontWeight: 700 }}>REVENUE</td><td style={S.td} /><td></td><td style={{ ...S.td, textAlign: "right", fontWeight: 700 }}>{fmt.usd(revenue)}</td></tr>
                            <tr><td style={S.td}>Gross Sales ({fin.totalLots} Lots @ {fmt.usd(fin.salesPricePricePerLot)})</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(revenue)}</td></tr>
                            <tr><td style={S.td}>Selling Costs / Commissions ({fin.salesCommission}%)</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right", color: C.red }}>({fmt.usd(comm)})</td></tr>
                            <tr style={{ background: "rgba(212,168,67,0.05)" }}><td style={{ ...S.td, color: C.gold, fontWeight: 700 }}>ACQUISITION & SITE COSTS</td><td style={S.td} /><td></td><td style={{ ...S.td, textAlign: "right", fontWeight: 700 }}>{fmt.usd(fin.landCost + fin.closingCosts)}</td></tr>
                            <tr><td style={S.td}>Land Purchase Price</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(fin.landCost)}</td></tr>
                            <tr style={{ background: "rgba(212,168,67,0.05)" }}><td style={{ ...S.td, color: C.gold, fontWeight: 700 }}>DEVELOPMENT COSTS</td><td style={S.td} /><td></td><td style={{ ...S.td, textAlign: "right", fontWeight: 700 }}>{fmt.usd(hard + soft + cont + fees)}</td></tr>
                            <tr><td style={S.td}>Site Improvements (Hard Costs)</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(hard)}</td></tr>
                            <tr><td style={S.td}>Professional / Soft Costs</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(soft)}</td></tr>
                            <tr><td style={S.td}>Government / Impact Fees</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(fees)}</td></tr>
                            <tr><td style={S.td}>Contingency ({fin.contingencyPct}%)</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right" }}>{fmt.usd(cont)}</td></tr>
                            <tr style={{ borderTop: `2px solid ${C.gold}` }}><td style={{ ...S.td, fontWeight: 800 }}>NET PROJECT PROFIT</td><td style={S.td} /><td style={S.td} /><td style={{ ...S.td, textAlign: "right", fontWeight: 800, color: C.green }}>{fmt.usd(profit)}</td></tr>
                        </tbody>
                    </table>
                </Card>
                <Card title="Financial Strategy · AI Agent">
                    <Agent id="Finance" system="You are a real estate private equity CFO. Analyze project pro formas, deal structures, acquisition hurdles, and return metrics. Provide critical feedback on cost assumptions and revenue projections." placeholder="Ask for a critical review of this pro forma..." />
                </Card>
            </div>
            <div>
                <Card title="Acquisition Inputs">
                    <div style={S.g3}>
                        {[["Land Purchase Price", "landCost"], ["Closing Costs (Est)", "closingCosts"], ["Option Payments Paid", "optionPayments"], ["Brokerage / Legal", "brokerageAcq"]].map(([l, k]) => (
                            <Field key={k} label={l}><input style={S.inp} type="number" value={fin[k]} onChange={fu(k)} /></Field>
                        ))}
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Hard Cost Breakdown">
                    <div style={S.g3}>
                        {[["Hard Cost / Lot", "hardCostPerLot"], ["Contingency %", "contingencyPct"], ["Off-Site Upgrades", "offsiteCosts"], ["Landscaping / Parks", "landscaping"]].map(([l, k]) => (
                            <Field key={k} label={l}><input style={S.inp} type="number" value={fin[k]} onChange={fu(k)} /></Field>
                        ))}
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Sensitivity Analysis (Revenue Variance)">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sensitivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                            <XAxis dataKey="name" stroke={C.dim} tick={{ fontSize: 11 }} />
                            <YAxis stroke={C.dim} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "rgba(15,17,23,0.9)", border: `1px solid ${C.gold}` }} labelStyle={{ color: C.gold }} />
                            <Bar dataKey="profit" name="Profit ($M)">{sensitivity.map((d, i) => <Cell key={i} fill={d.profit > 0 ? C.green : C.red} fillOpacity={0.6} />)}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </Tabs>
    );
}
