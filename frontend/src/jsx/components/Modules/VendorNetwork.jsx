import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { usePrj } from '../../context/ProjectContext';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';

export default function VendorNetwork() {
    const { vendors, setVendors } = usePrj();
    const [nv, setNv] = useState({ name: "", type: "General Contractor", status: "Active", contact: "", email: "", phone: "", insuranceExp: "", msaSigned: false, rating: 5, notes: "" });
    const [filt, setFilt] = useState("All");

    const addVendor = () => {
        if (!nv.name) return;
        setVendors([...vendors, { ...nv, id: Date.now() }]);
        setNv({ name: "", type: "General Contractor", status: "Active", contact: "", email: "", phone: "", insuranceExp: "", msaSigned: false, rating: 5, notes: "" });
    };

    const filtered = (vendors || []).filter(v => filt === "All" || v.type === filt || v.status === filt);
    const types = ["General Contractor", "Architect", "Civil Engineer", "Structural Engineer", "MEP Engineer", "Landscape Architect", "Environmental", "Legal", "Broker"];

    return (
        <Tabs tabs={["Vendor Directory", "Compliance Tracking", "Bid Management"]}>
            <div>
                <div style={S.g4}>
                    <KPI label="Total Active Vendors" value={(vendors || []).filter(v => v.status === 'Active').length} />
                    <KPI label="Expiring COIs (30d)" value={(vendors || []).filter(v => new Date(v.insuranceExp) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length} color={C.amber} />
                </div>
                <Card title="Vendor Directory">
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Company</th><th style={S.th}>Type</th><th style={S.th}>Status</th><th style={S.th}></th></tr></thead>
                        <tbody>{filtered.map(v => (
                            <tr key={v.id}>
                                <td style={{ ...S.td, color: C.gold, fontWeight: 500 }}>{v.name}</td>
                                <td style={S.td}>{v.type}</td>
                                <td style={S.td}><Badge label={v.status} color={v.status === "Active" ? C.green : C.dim} /></td>
                                <td style={S.td}><button style={{ ...S.btn(), padding: "2px 7px", fontSize: 9 }} onClick={() => setVendors(vendors.filter(x => x.id !== v.id))}>x</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
                <Card title="Onboard New Vendor">
                    <div style={S.g2}>
                        <Field label="Company Name"><input style={S.inp} value={nv.name} onChange={e => setNv({ ...nv, name: e.target.value })} /></Field>
                        <Field label="Type"><select style={S.sel} value={nv.type} onChange={e => setNv({ ...nv, type: e.target.value })}>{types.map(t => <option key={t}>{t}</option>)}</select></Field>
                    </div>
                    <button style={{ ...S.btn("gold"), marginTop: 16 }} onClick={addVendor}>Save Vendor</button>
                </Card>
            </div>
        </Tabs>
    );
}
