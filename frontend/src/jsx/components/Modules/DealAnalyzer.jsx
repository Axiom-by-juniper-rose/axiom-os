import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { C, S } from '../../constants';
import { fmt, useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Badge } from '../UI/Badge';
import { Progress } from '../UI/Progress';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function DealAnalyzer() {
    const [deal, setDeal] = useLS("axiom_analyze_deal", { name: "Sunset Ridge Estates", address: "456 Ridge Rd", lots: 42, type: "SFR Subdivision", landCost: 3000000, hardCostPerLot: 65000, salesPrice: 185000, absorption: 3, entitlementStatus: "Under Review", ceqa: "MND", floodZone: "X", phase1: "Clean", soilType: "Sandy Loam" });

    const du = k => e => setDeal({ ...deal, [k]: e.target.value });

    const hard = deal.lots * deal.hardCostPerLot, soft = hard * 0.18, fees = 25000 * deal.lots, cont = (hard + soft) * 0.10;
    const totalCost = +deal.landCost + hard + soft + fees + cont;
    const revenue = deal.lots * deal.salesPrice, profit = revenue * 0.97 - totalCost;
    const margin = revenue > 0 ? profit / revenue * 100 : 0;

    const radarD = [{ sub: "Financial", val: 85 }, { sub: "Entitlement", val: 60 }, { sub: "Environmental", val: 90 }, { sub: "Market", val: 68 }, { sub: "Infrastructure", val: 75 }];

    return (
        <Tabs tabs={["Quick Analysis", "Financials", "Go/No-Go", "IC Memo"]}>
            <div>
                <Card title="Deal Inputs">
                    <div style={S.g4}>
                        <Field label="Project Name"><input style={S.inp} value={deal.name} onChange={du("name")} /></Field>
                        <Field label="Total Lots"><input style={S.inp} type="number" value={deal.lots} onChange={du("lots")} /></Field>
                        <Field label="Land Cost ($)"><input style={S.inp} type="number" value={deal.landCost} onChange={du("landCost")} /></Field>
                        <Field label="Sales Price / Lot ($)"><input style={S.inp} type="number" value={deal.salesPrice} onChange={du("salesPrice")} /></Field>
                    </div>
                </Card>
                <div style={S.g4}>
                    <KPI label="Total Cost" value={fmt.M(totalCost)} color={C.red} />
                    <KPI label="Revenue" value={fmt.M(revenue)} color={C.green} />
                    <KPI label="Net Profit" value={fmt.M(profit)} color={profit >= 0 ? C.green : C.red} />
                    <KPI label="Margin" value={fmt.pct(margin)} color={margin > 15 ? C.green : C.amber} />
                </div>
                <div style={{ ...S.g2, marginTop: 14 }}>
                    <Card title="Deal Readiness">
                        <ResponsiveContainer width="100%" height={200}>
                            <RadarChart data={radarD}>
                                <PolarGrid stroke={C.border} />
                                <PolarAngleAxis dataKey="sub" tick={{ fill: C.dim, fontSize: 11 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar dataKey="val" stroke={C.gold} fill={C.gold} fillOpacity={0.2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card title="Go / No-Go Verdict">
                        <div style={{ textAlign: "center", padding: 20 }}>
                            <div style={{ fontSize: 48, fontWeight: 800, color: C.green }}>GO</div>
                            <div style={{ fontSize: 12, color: C.dim, textTransform: "uppercase", letterSpacing: 2 }}>Analysis Approved</div>
                        </div>
                    </Card>
                </div>
            </div>
        </Tabs>
    );
}
