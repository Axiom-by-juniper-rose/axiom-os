import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge, Dot } from '../UI/Badge';
import { Field } from '../UI/Field';

const TYPES = ["Buyer", "Seller", "Broker", "Lender", "Attorney", "Contractor", "Architect", "Engineer", "Appraiser", "Inspector", "Title Officer", "Escrow", "Investor", "Other"];
const STATUSES = ["Active", "Inactive", "Prospect", "Lead", "Archived"];
const TC = { Buyer: C.green, Seller: C.blue, Broker: C.gold, Lender: C.purple, Attorney: C.teal, Contractor: C.amber, Architect: C.blue, Engineer: C.teal, Appraiser: C.amber, Inspector: C.dim, Investor: C.green, "Title Officer": C.gold, Escrow: C.purple, Other: C.dim };
const SC2 = { Active: C.green, Inactive: C.dim, Prospect: C.blue, Lead: C.amber, Archived: C.muted };

export default function Contacts() {
    const [contacts, setContacts] = useLS("axiom_contacts", [
        { id: 1, name: "Sarah Chen", type: "Broker", company: "Pacific Realty Group", email: "sarah@pacificrealty.com", phone: "(415) 555-0123", status: "Active", deals: ["Sunset Ridge"], notes: "Top producing agent, 15+ yrs subdivision experience", lastContact: "2025-02-15" },
        { id: 2, name: "Mike Rodriguez", type: "Lender", company: "First National Bank", email: "mrodriguez@fnb.com", phone: "(310) 555-0456", status: "Active", deals: ["Hawk Valley"], notes: "Construction loan specialist, competitive rates", lastContact: "2025-02-10" },
        { id: 3, name: "Jennifer Park", type: "Attorney", company: "Park & Associates", email: "jpark@parklaw.com", phone: "(650) 555-0789", status: "Active", deals: [], notes: "Land use & entitlement attorney. Excellent with CEQA.", lastContact: "2025-01-28" },
    ]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [drawer, setDrawer] = useState(null);
    const [nc, setNc] = useState({ name: "", type: "Broker", company: "", email: "", phone: "", status: "Active", deals: [], notes: "", lastContact: "" });

    const filtered = contacts.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType !== "All" && c.type !== filterType) return false;
        if (filterStatus !== "All" && c.status !== filterStatus) return false;
        return true;
    });

    const addContact = () => { if (!nc.name) return; setContacts([...contacts, { ...nc, id: Date.now(), lastContact: new Date().toISOString().split("T")[0] }]); setNc({ name: "", type: "Broker", company: "", email: "", phone: "", status: "Active", deals: [], notes: "", lastContact: "" }); };
    const delContact = (id) => setContacts(contacts.filter(c => c.id !== id));
    const updContact = (id, field, val) => setContacts(contacts.map(c => c.id === id ? { ...c, [field]: val } : c));

    return (
        <Tabs tabs={["Directory", "Add Contact", "Import/Export"]}>
            <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <input style={{ ...S.inp, flex: 1 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts by name or company..." />
                    <select style={{ ...S.sel, width: 140 }} value={filterType} onChange={e => setFilterType(e.target.value)}><option>All</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
                    <select style={{ ...S.sel, width: 120 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option>All</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
                </div>
                <Card title={`Contact Directory (${filtered.length})`} action={<Badge label={contacts.filter(c => c.status === "Active").length + " Active"} color={C.green} />}>
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Name</th><th style={S.th}>Type</th><th style={S.th}>Company</th><th style={S.th}>Email</th><th style={S.th}>Phone</th><th style={S.th}>Deals</th><th style={S.th}>Status</th><th style={S.th}>Last</th><th style={S.th}></th></tr></thead>
                        <tbody>{filtered.map(c => (
                            <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setDrawer(c)}>
                                <td style={{ ...S.td, color: C.text, fontWeight: 600 }}>{c.name}</td>
                                <td style={S.td}><Badge label={c.type} color={TC[c.type] || C.dim} /></td>
                                <td style={{ ...S.td, fontSize: 12 }}>{c.company}</td>
                                <td style={{ ...S.td, fontSize: 12, color: C.blue }}>{c.email}</td>
                                <td style={{ ...S.td, fontSize: 12 }}>{c.phone}</td>
                                <td style={S.td}>{c.deals?.length || 0}</td>
                                <td style={S.td}><Dot color={SC2[c.status] || C.dim} /><span style={{ fontSize: 12 }}>{c.status}</span></td>
                                <td style={{ ...S.td, fontSize: 10, color: C.dim }}>{c.lastContact}</td>
                                <td style={S.td}><button style={{ ...S.btn(), padding: "2px 7px", fontSize: 9 }} onClick={e => { e.stopPropagation(); delContact(c.id); }}>x</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
                {drawer && (
                    <Card title={`Edit: ${drawer.name}`} action={<button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => setDrawer(null)}>Close</button>}>
                        <div style={S.g3}>
                            <Field label="Name"><input style={S.inp} value={drawer.name} onChange={e => updContact(drawer.id, "name", e.target.value)} /></Field>
                            <Field label="Type"><select style={S.sel} value={drawer.type} onChange={e => updContact(drawer.id, "type", e.target.value)}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
                            <Field label="Company"><input style={S.inp} value={drawer.company} onChange={e => updContact(drawer.id, "company", e.target.value)} /></Field>
                            <Field label="Email"><input style={S.inp} value={drawer.email} onChange={e => updContact(drawer.id, "email", e.target.value)} /></Field>
                            <Field label="Phone"><input style={S.inp} value={drawer.phone} onChange={e => updContact(drawer.id, "phone", e.target.value)} /></Field>
                            <Field label="Status"><select style={S.sel} value={drawer.status} onChange={e => updContact(drawer.id, "status", e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
                        </div>
                        <Field label="Notes"><textarea style={{ ...S.ta, height: 60 }} value={drawer.notes} onChange={e => updContact(drawer.id, "notes", e.target.value)} /></Field>
                    </Card>
                )}
            </div>
            <div>
                <Card title="Add New Contact">
                    <div style={S.g3}>
                        <Field label="Full Name"><input style={S.inp} value={nc.name} onChange={e => setNc({ ...nc, name: e.target.value })} placeholder="Jane Doe" /></Field>
                        <Field label="Type"><select style={S.sel} value={nc.type} onChange={e => setNc({ ...nc, type: e.target.value })}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
                        <Field label="Company"><input style={S.inp} value={nc.company} onChange={e => setNc({ ...nc, company: e.target.value })} /></Field>
                        <Field label="Email"><input style={S.inp} value={nc.email} onChange={e => setNc({ ...nc, email: e.target.value })} placeholder="email@example.com" /></Field>
                        <Field label="Phone"><input style={S.inp} value={nc.phone} onChange={e => setNc({ ...nc, phone: e.target.value })} placeholder="(555) 000-0000" /></Field>
                        <Field label="Status"><select style={S.sel} value={nc.status} onChange={e => setNc({ ...nc, status: e.target.value })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
                    </div>
                    <Field label="Notes"><textarea style={{ ...S.ta, height: 60 }} value={nc.notes} onChange={e => setNc({ ...nc, notes: e.target.value })} placeholder="Background, relationship, specialties..." /></Field>
                    <button style={S.btn("gold")} onClick={addContact}>Add Contact</button>
                </Card>
            </div>
        </Tabs>
    );
}
