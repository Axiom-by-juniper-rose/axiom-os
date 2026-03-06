import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge, Dot } from '../UI/Badge';
import { Field } from '../UI/Field';

export default function EmailSection() {
    const [emails, setEmails] = useLS("axiom_emails", [
        { id: 1, from: "Sarah Chen <sarah@pacificrealty.com>", to: "me", subject: "RE: Sunset Ridge LOI - Counter Offer", body: "Hi,\n\nThe seller came back with a counter at $3.15M.", date: "2025-02-20 09:15", read: true, folder: "inbox", deal: "Sunset Ridge" },
        { id: 2, from: "City Planning <planning@cityofsac.gov>", to: "me", subject: "Notice of Application Completeness", body: "Dear Applicant,\n\nYour application has been deemed complete.", date: "2025-02-18 14:30", read: false, folder: "inbox", deal: "Sunset Ridge" },
    ]);
    const [folder, setFolder] = useState("inbox");
    const [selEmail, setSelEmail] = useState(null);
    const [composing, setComposing] = useState(false);
    const [draft, setDraft] = useState({ to: "", subject: "", body: "", deal: "" });

    const filtered = emails.filter(e => e.folder === folder);
    const folders = [{ id: "inbox", label: "Inbox", count: emails.filter(e => e.folder === "inbox").length }, { id: "sent", label: "Sent", count: emails.filter(e => e.folder === "sent").length }];

    const sendEmail = () => { if (!draft.to || !draft.subject) return; setEmails([...emails, { id: Date.now(), from: "me", to: draft.to, subject: draft.subject, body: draft.body, date: new Date().toISOString().replace("T", " ").substring(0, 16), read: true, folder: "sent", deal: draft.deal }]); setDraft({ to: "", subject: "", body: "", deal: "" }); setComposing(false); };

    return (
        <div style={{ display: "flex", gap: 14 }}>
            <div style={{ width: 160, flexShrink: 0 }}>
                <button style={{ ...S.btn("gold"), width: "100%", marginBottom: 12 }} onClick={() => { setComposing(true); setSelEmail(null); }}>+ Compose</button>
                {folders.map(f => (
                    <div key={f.id} style={{ ...S.navi(folder === f.id), display: "flex", justifyContent: "space-between", marginBottom: 2, borderRadius: 3 }} onClick={() => { setFolder(f.id); setSelEmail(null); }}>
                        <span style={{ fontSize: 12 }}>{f.label}</span>
                    </div>
                ))}
            </div>
            <div style={{ flex: 1 }}>
                {selEmail ? (
                    <Card title={selEmail.subject} action={<button style={S.btn()} onClick={() => setSelEmail(null)}>Back</button>}>
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "'Courier New',monospace", fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{selEmail.body}</pre>
                    </Card>
                ) : (
                    <Card title={folder.toUpperCase()}>
                        {filtered.map(e => (
                            <div key={e.id} style={{ padding: "10px 0", borderBottom: "1px solid #0F1117", cursor: "pointer" }} onClick={() => setSelEmail(e)}>
                                <div style={{ fontSize: 12, color: C.text, fontWeight: e.read ? 400 : 700 }}>{e.from}</div>
                                <div style={{ fontSize: 13, color: C.text }}>{e.subject}</div>
                            </div>
                        ))}
                    </Card>
                )}
            </div>
        </div>
    );
}
