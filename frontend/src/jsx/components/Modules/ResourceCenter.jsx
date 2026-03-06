import React, { useState } from 'react';
import { C, S } from '../../constants';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';

export default function ResourceCenter() {
    const [search, setSearch] = useState("");
    const resources = [
        { id: 1, title: "Land Development Feasibility Guide", category: "Getting Started", type: "Guide", desc: "Complete walkthrough of the development feasibility process.", readTime: "15 min", level: "Beginner" },
        { id: 2, title: "Pro Forma Modeling Best Practices", category: "Financial Modeling", type: "Guide", desc: "How to structure a development pro forma.", readTime: "20 min", level: "Intermediate" },
    ];

    return (
        <Tabs tabs={["Library", "Templates"]}>
            <div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    <input style={{ ...S.inp, flex: 1 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {resources.map(r => (
                        <div key={r.id} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 4, padding: 16, cursor: "pointer" }}>
                            <div style={{ fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 4 }}>{r.title}</div>
                            <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.4, marginBottom: 8 }}>{r.desc}</div>
                            <button style={{ ...S.btn("gold"), padding: "3px 10px", fontSize: 10 }}>Read</button>
                        </div>
                    ))}
                </div>
            </div>
        </Tabs>
    );
}
