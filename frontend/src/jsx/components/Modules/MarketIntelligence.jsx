import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { C, S } from '../../constants';
import { fmt, useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function MarketIntelligence() {
    const [mkt, setMkt] = useLS("axiom_market", { avgSale: 750000, ppsf: 325, dom: 45, inventory: 2.1, appreciation: 5.2, rentalGrowth: 4.8, vacancy: 5.0, capRate: 5.5, absorption: 4 });
    const [comps] = useState([
        { id: 1, addr: "452 Oak Dr", date: "2024-01-15", price: 785000, sf: 2400, lsf: 6000, ppsf: 327, dist: "0.2 mi", quality: "Superior" },
        { id: 2, addr: "119 Pine Ln", date: "2023-12-10", price: 715000, sf: 2100, lsf: 5500, ppsf: 340, dist: "0.4 mi", quality: "Active" },
        { id: 3, addr: "882 Maples Cir", date: "2023-11-22", price: 825000, sf: 2650, lsf: 7200, ppsf: 311, dist: "0.8 mi", quality: "Inferred" },
        { id: 4, addr: "331 Birch Rd", date: "2024-02-01", price: 699000, sf: 1950, lsf: 5000, ppsf: 358, dist: "0.5 mi", quality: "Pending" },
    ]);

    const mu = k => e => setMkt({ ...mkt, [k]: parseFloat(e.target.value) || 0 });
    const pData = Array.from({ length: 12 }, (_, i) => ({ n: `M${i + 1}`, v: 650000 + i * 8000 + Math.random() * 5000 }));

    return (
        <Tabs tabs={["Market Indicators", "Comparable Sales", "Price Trends", "Rentals", "Demographics"]}>
            <div>
                <div style={S.g4}>
                    <KPI label="Avg. Sale Price" value={fmt.usd(mkt.avgSale)} sub="Current Submarket" />
                    <KPI label="Price / SF" value={fmt.usd(mkt.ppsf)} sub="Finished product" />
                    <KPI label="Days on Market" value={mkt.dom} color={C.blue} sub="Avg. velocity" />
                    <KPI label="Inventory" value={mkt.inventory + " mo"} color={C.teal} sub="Supply level" />
                </div>
                <div style={{ ...S.g2, marginTop: 14 }}>
                    <Card title="Submarket Price Trend (L12M)">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={pData}>
                                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.3} /><stop offset="95%" stopColor={C.blue} stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                <XAxis dataKey="n" stroke={C.dim} tick={{ fontSize: 10 }} />
                                <YAxis stroke={C.dim} tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1e3).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ background: "rgba(15,17,23,0.9)", border: `1px solid ${C.blue}` }} />
                                <Area type="monotone" dataKey="v" stroke={C.blue} fill="url(#pg)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card title="Market Sentiment · AI Agent">
                        <Agent id="Market" system="You are a market intelligence analyst for a major homebuilder. Analyze submarket data, competitor velocity, pricing trends, and macroeconomic factors to provide a sentiment score and strategic advice." placeholder="Describe submarket conditions for a strategic sentiment analysis..." />
                    </Card>
                </div>
            </div>
            <div>
                <Card title="Comparable Sales Analysis">
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Address</th><th style={S.th}>Date</th><th style={S.th}>Sale Price</th><th style={S.th}>SF</th><th style={S.th}>Lot SF</th><th style={S.th}>$/SF</th><th style={S.th}>Dist</th><th style={S.th}>Status</th></tr></thead>
                        <tbody>{comps.map(c => (
                            <tr key={c.id}>
                                <td style={{ ...S.td, color: C.text, fontWeight: 500 }}>{c.addr}</td>
                                <td style={S.td}>{c.date}</td>
                                <td style={{ ...S.td, color: C.green }}>{fmt.usd(c.price)}</td>
                                <td style={S.td}>{fmt.num(c.sf)}</td>
                                <td style={S.td}>{fmt.num(c.lsf)}</td>
                                <td style={S.td}>${c.ppsf}</td>
                                <td style={S.td}>{c.dist}</td>
                                <td style={S.td}><Badge label={c.quality} color={c.quality === "Superior" ? C.teal : c.quality === "Pending" ? C.gold : C.blue} /></td>
                            </tr>
                        ))}</tbody>
                    </table>
                    <button style={{ ...S.btn(), marginTop: 12 }}>Import comps from CoStar / Regrid</button>
                </Card>
            </div>
        </Tabs>
    );
}
