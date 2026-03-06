import React from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

const FZ = { X: { l: "Zone X - Minimal Flood Hazard", c: C.green }, AE: { l: "Zone AE - 1% Annual Chance", c: C.red }, A: { l: "Zone A - 1% Chance (no BFE)", c: C.amber }, VE: { l: "Zone VE - Coastal High Hazard", c: C.purple }, X500: { l: "Zone X (Shaded) - 0.2% Chance", c: C.blue } };

export default function Infrastructure() {
    const [svcs, setSvcs] = useLS("axiom_utilities", [
        { name: "Water", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
        { name: "Sewer / Sanitary", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
        { name: "Storm Drain", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
        { name: "Electric", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
        { name: "Natural Gas", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
        { name: "Telecom / Fiber", provider: "", capacity: "", distance: "", connFee: "", status: "Verify" },
    ]);
    const [env, setEnv] = useLS("axiom_env", { floodZone: "X", firmPanel: "", firmDate: "", bfe: "", loma: "No", phase1: "No", phase1Date: "", rec: "", wetlands: "None Observed", species: "", ceqa: "Class 32 - Infill", mitigation: "", airQuality: "" });

    const upd = (i, k, v) => { const d = [...svcs]; d[i] = { ...d[i], [k]: v }; setSvcs(d); };
    const eu = k => e => setEnv({ ...env, [k]: e.target.value });

    const statOpts = ["Verify", "Available", "Capacity Constraints", "Extension Required", "Moratorium", "N/A"];
    const SC = { Available: C.green, "Capacity Constraints": C.amber, "Extension Required": C.red, Verify: C.blue, Moratorium: C.purple, "N/A": C.dim };

    return (
        <Tabs tabs={["Utilities & Services", "Sewage & Drainage", "Environmental & Flood", "CEQA"]}>
            <div>
                <Card title="Utility & Service Plan">
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Service</th><th style={S.th}>Provider / District</th><th style={S.th}>Capacity / Size</th><th style={S.th}>Dist. to Main</th><th style={S.th}>Conn. Fee/Unit</th><th style={S.th}>Status</th></tr></thead>
                        <tbody>{svcs.map((s, i) => (
                            <tr key={i}>
                                <td style={{ ...S.td, color: C.gold, fontWeight: 600, fontSize: 12 }}>{s.name}</td>
                                {["provider", "capacity", "distance", "connFee"].map(k => (
                                    <td key={k} style={S.td}><input style={{ ...S.inp, padding: "4px 7px", fontSize: 12 }} value={s[k]} onChange={e => upd(i, k, e.target.value)} placeholder={k === "connFee" ? "$ 0" : ""} /></td>
                                ))}
                                <td style={S.td}><select style={{ ...S.sel, padding: "4px 7px", fontSize: 10, color: SC[s.status] || C.dim, width: "auto" }} value={s.status} onChange={e => upd(i, "status", e.target.value)}>{statOpts.map(o => <option key={o}>{o}</option>)}</select></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
                <Card title="Utilities · AI Agent">
                    <Agent id="Utilities" system="You are a civil engineering consultant specializing in land development infrastructure. Analyze utility capacity, off-site improvement costs, service extension feasibility, and infrastructure budget items." placeholder="Ask about utility capacity, connection costs, off-site improvement requirements..." />
                </Card>
            </div>
            <div>
                <Card title="Sewer & Wastewater Analysis">
                    <div style={S.g3}>
                        {[["Sewer District", ""], ["Capacity Available (EQR)", "Available units"], ["Connection Fee / Unit", "$ 0"], ["Off-Site Extension Required (ft)", "0"], ["Cost Per LF Extension", "$ 0"], ["Total Extension Cost", "Auto-calculated"]].map(([l, ph], i) => (
                            <Field key={i} label={l}><input style={S.inp} placeholder={ph} /></Field>
                        ))}
                    </div>
                    <Field label="Septic / OWTS Feasibility"><select style={S.sel}><option>No - Sewer Available</option><option>Yes - Perc Tests Needed</option><option>Yes - Confirmed</option><option>Not Applicable</option></select></Field>
                    <Field label="Notes / Agency Contacts"><textarea style={{ ...S.ta, height: 55 }} placeholder="Sewer district contact, capacity letter status, moratorium notes..." /></Field>
                </Card>
            </div>
            <div>
                <Card title="FEMA Flood Zone Analysis">
                    <div style={S.g2}>
                        <div>
                            <Field label="Flood Zone"><select style={S.sel} value={env.floodZone} onChange={eu("floodZone")}>{Object.keys(FZ).map(z => <option key={z} value={z}>{FZ[z].l}</option>)}</select></Field>
                            {FZ[env.floodZone] && <div style={{ marginTop: 6 }}><Badge label={FZ[env.floodZone].l} color={FZ[env.floodZone].c} /></div>}
                        </div>
                        <div>
                            <Field label="FIRM Panel Number"><input style={S.inp} value={env.firmPanel} onChange={eu("firmPanel")} placeholder="0000C0000X" /></Field>
                            <Field label="FIRM Effective Date"><input style={S.inp} type="date" value={env.firmDate} onChange={eu("firmDate")} /></Field>
                        </div>
                        <Field label="Base Flood Elevation (BFE - NAVD88)"><input style={S.inp} value={env.bfe} onChange={eu("bfe")} placeholder="e.g. 482.5 ft" /></Field>
                        <Field label="LOMA / LOMR Status"><select style={S.sel} value={env.loma} onChange={eu("loma")}><option>No</option><option>In Process</option><option>Yes - Approved</option><option>Denied</option></select></Field>
                    </div>
                </Card>
            </div>
            <div>
                <Card title="CEQA Pathway">
                    <div style={S.g2}>
                        <Field label="CEQA Document Type"><select style={S.sel} value={env.ceqa} onChange={eu("ceqa")}>{["Class 32 - Infill Exemption", "Class 15 - Minor Land Division", "Categorical Exemption - Other", "Negative Declaration (ND)", "Mitigated Negative Declaration (MND)", "EIR - Project Level", "EIR - Program Level", "Not Subject to CEQA"].map(o => <option key={o}>{o}</option>)}</select></Field>
                        <Field label="Air Quality Basin / District"><input style={S.inp} value={env.airQuality} onChange={eu("airQuality")} placeholder="SCAQMD, BAAQMD, SJVAPCD..." /></Field>
                        <Field label="Mitigation Measures Required"><textarea style={{ ...S.ta, height: 80 }} value={env.mitigation} onChange={eu("mitigation")} placeholder="List all required mitigation measures by category (Bio, Cultural, Noise, Air, Traffic)..." /></Field>
                    </div>
                </Card>
            </div>
        </Tabs>
    );
}
