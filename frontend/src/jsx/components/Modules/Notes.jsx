import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';
import { Agent } from '../UI/Agent';

export default function Notes() {
    const [notes, setNotes] = useLS("axiom_notes", [
        { id: 1, title: "Sunset Ridge - Due Diligence Checklist", content: "Phase I ESA: Clean (received 02/10)\nGeotech: Pending - West Valley Labs\nAPNs: 123-456-789\nTitle: Preliminary report ordered from Chicago Title\nSurvey: ALTA survey in progress (ETA 02/28)\nWetlands: None identified per NWI mapping\nFlood: Zone X confirmed via FEMA panel 06065C0720G", deal: "Sunset Ridge", category: "Due Diligence", pinned: true, created: "2025-02-10", modified: "2025-02-20" },
        { id: 2, title: "IC Meeting Notes - Feb 14", content: "Attendees: Sarah, Mike, David, Jennifer\n\nKey decisions:\n1. Proceed with Sunset Ridge LOI at $3.0M (approved)\n2. Hawk Valley - need updated comps\n3. Budget approved for Phase I ESA on Meadowbrook", deal: "General", category: "Meeting Notes", pinned: false, created: "2025-02-14", modified: "2025-02-14" },
    ]);

    const CATS = ["All", "Due Diligence", "Meeting Notes", "Research", "Legal", "Site Analysis", "Financial", "Personal"];
    const [filterCat, setFilterCat] = useState("All");
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null);
    const [nn, setNn] = useState({ title: "", content: "", deal: "", category: "Research", pinned: false });

    const filtered = notes.filter(n => {
        if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterCat !== "All" && n.category !== filterCat) return false;
        return true;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (new Date(b.modified)).getTime() - (new Date(a.modified)).getTime());

    const addNote = () => { if (!nn.title) return; setNotes([...notes, { ...nn, id: Date.now(), created: new Date().toISOString().split("T")[0], modified: new Date().toISOString().split("T")[0] }]); setNn({ title: "", content: "", deal: "", category: "Research", pinned: false }); };
    const updNote = (id, field, val) => setNotes(notes.map(n => n.id === id ? { ...n, [field]: val, modified: new Date().toISOString().split("T")[0] } : n));
    const delNote = (id) => setNotes(notes.filter(n => n.id !== id));

    return (
        <Tabs tabs={["All Notes", "New Note", "AI Summary"]}>
            <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <input style={{ ...S.inp, flex: 1 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." />
                    <select style={{ ...S.sel, width: 140 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select>
                </div>
                {filtered.map(n => (
                    <Card key={n.id} title={n.title} action={<div style={{ display: "flex", gap: 6 }}>{n.pinned && <Badge label="Pinned" color={C.gold} />}<Badge label={n.category} color={C.blue} /><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => setEditing(editing === n.id ? null : n.id)}>{editing === n.id ? "Close" : "Edit"}</button><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => updNote(n.id, "pinned", !n.pinned)}>{n.pinned ? "Unpin" : "Pin"}</button><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => delNote(n.id)}>x</button></div>}>
                        {editing === n.id ? (
                            <div>
                                <Field label="Title"><input style={S.inp} value={n.title} onChange={e => updNote(n.id, "title", e.target.value)} /></Field>
                                <Field label="Content"><textarea style={{ ...S.ta, height: 200 }} value={n.content} onChange={e => updNote(n.id, "content", e.target.value)} /></Field>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: 10, color: C.dim, marginBottom: 8 }}>Modified: {n.modified}</div>
                                <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Courier New',monospace", fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{n.content}</pre>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </Tabs>
    );
}
