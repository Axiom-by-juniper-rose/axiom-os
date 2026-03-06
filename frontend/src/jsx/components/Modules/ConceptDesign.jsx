import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { C, S, PP } from '../../constants';
import { fmt, useLS } from '../../utils';
import { usePrj } from '../../context/ProjectContext';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function ConceptDesign() {
    const { fin, setFin } = usePrj();
    const [cfg, setCfg] = useLS("axiom_yield", { grossAcres: 10, netAcres: 7.5, smallLotAvg: 4200, largeLotAvg: 8500, smallLotPct: 60, pudUnits: 0, streetPct: 15, openSpacePct: 15, utilityPct: 5 });

    const cy = k => e => setCfg({ ...cfg, [k]: parseFloat(e.target.value) || 0 });

    const devSF = cfg.netAcres * 43560 * (1 - (cfg.streetPct + cfg.openSpacePct + cfg.utilityPct) / 100);
    const smallLots = Math.floor(devSF * cfg.smallLotPct / 100 / cfg.smallLotAvg);
    const largeLots = Math.floor(devSF * (100 - cfg.smallLotPct) / 100 / cfg.largeLotAvg);
    const total = smallLots + largeLots + cfg.pudUnits;
    const density = cfg.netAcres > 0 ? total / cfg.netAcres : 0;

    const pieD = [
        { name: "Streets", value: cfg.streetPct, fill: C.blue },
        { name: "Open Space", value: cfg.openSpacePct, fill: C.teal },
        { name: "Utilities/Ease.", value: cfg.utilityPct, fill: C.purple },
        { name: "Small Lots", value: cfg.smallLotPct * (100 - cfg.streetPct - cfg.openSpacePct - cfg.utilityPct) / 100, fill: C.gold },
        { name: "Large Lots", value: (100 - cfg.smallLotPct) * (100 - cfg.streetPct - cfg.openSpacePct - cfg.utilityPct) / 100, fill: C.gold + "88" },
    ];

    return (
        <Tabs tabs={["Concept Yield", "Land Use Allocation", "PUD / Attached", "Test Fit Notes", "Design Import"]}>
            <div>
                <div style={S.g4}>
                    <KPI label="Small SFR Lots" value={fmt.num(smallLots)} sub={`avg ${fmt.sf(cfg.smallLotAvg)}`} />
                    <KPI label="Large SFR Lots" value={fmt.num(largeLots)} sub={`avg ${fmt.sf(cfg.largeLotAvg)}`} />
                    <KPI label="PUD / Fee Simple" value={fmt.num(cfg.pudUnits)} color={C.blue} sub="Attached units" />
                    <KPI label="Total Concept Yield" value={fmt.num(total)} color={C.green} sub={`${density.toFixed(1)} DU/AC`} />
                </div>
                <div style={{ ...S.g2, marginTop: 14 }}>
                    <Card title="Yield Configuration">
                        <div style={S.g2}>
                            {[["Gross Acres", "grossAcres"], ["Net Dev. Acres", "netAcres"], ["Small Lot Avg SF", "smallLotAvg"], ["Large Lot Avg SF", "largeLotAvg"], ["Small Lot % of Dev Area", "smallLotPct"], ["PUD / Attached Units", "pudUnits"], ["Streets % of Gross", "streetPct"], ["Open Space %", "openSpacePct"], ["Utility / Easement %", "utilityPct"]].map(([l, k]) => (
                                <Field key={k} label={l}><input style={S.inp} type="number" value={cfg[k]} onChange={cy(k)} /></Field>
                            ))}
                        </div>
                        <button style={{ ...S.btn("gold"), marginTop: 10 }} onClick={() => setFin({ ...fin, totalLots: total })}>Sync Lots to Financial Model</button>
                    </Card>
                    <Card title="Land Use Allocation">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart style={{ cursor: 'pointer' }}>
                                <Pie data={pieD} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} ${Number(value).toFixed(0)}%`} style={{ fontSize: 9 }}>
                                    {pieD.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "rgba(17,19,24,0.95)", border: `1px solid ${C.gold}33`, borderRadius: 8, fontSize: 13, fontFamily: "Inter,sans-serif", padding: "10px 14px", boxShadow: "0 8px 32px rgba(212,168,67,0.15)", backdropFilter: "blur(12px)" }} cursor={{ stroke: C.gold, strokeWidth: 1, strokeDasharray: "4 4" }} formatter={v => [`${Number(v).toFixed(1)}%`]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
            <div>
                <Card title="Land Allocation Summary">
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Use Category</th><th style={S.th}>% of Gross</th><th style={S.th}>Acres</th><th style={S.th}>SF</th></tr></thead>
                        <tbody>{[["Streets / ROW", cfg.streetPct], ["Open Space / Parks", cfg.openSpacePct], ["Utilities / Easements", cfg.utilityPct], ["Net Developable", 100 - cfg.streetPct - cfg.openSpacePct - cfg.utilityPct]].map(([name, pct]) => (
                            <tr key={name}>
                                <td style={{ ...S.td, color: C.text }}>{name}</td>
                                <td style={{ ...S.td, color: C.gold }}>{Number(pct).toFixed(1)}%</td>
                                <td style={S.td}>{(cfg.grossAcres * pct / 100).toFixed(2)} ac</td>
                                <td style={S.td}>{Math.round(cfg.grossAcres * 43560 * pct / 100).toLocaleString()} SF</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
            </div>
        </Tabs>
    );
}
