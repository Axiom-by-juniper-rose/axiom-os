import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';

export function NotifBell({ setActive }) {
    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useLS("axiom_notifs_list", [
        { id: 1, title: "Sunset Ridge LOI Due", body: "LOI deadline is in 5 days", time: "2 hours ago", type: "deadline", read: false, section: "pipeline" },
    ]);
    const unread = notifs.filter(n => !n.read).length;

    return (
        <div style={{ position: "relative" }}>
            <div style={{ cursor: "pointer", padding: "4px 8px", border: `1px solid ${C.border}`, borderRadius: 3, background: C.bg3, display: "flex", alignItems: "center", gap: 4 }} onClick={() => setOpen(!open)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={unread > 0 ? C.gold : C.dim} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {unread > 0 && <span style={{ background: C.red, color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: 6 }}>{unread}</span>}
            </div>
            {open && (
                <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, width: 320, background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 4, zIndex: 999 }}>
                    <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 10, color: C.gold, fontWeight: 700 }}>NOTIFICATIONS</span>
                    </div>
                    <div style={{ maxHeight: 300, overflowY: "auto" }}>
                        {notifs.map(n => (
                            <div key={n.id} style={{ padding: "8px 14px", borderBottom: "1px solid #0F1117", cursor: "pointer" }} onClick={() => { setActive(n.section); setOpen(false); }}>
                                <div style={{ fontSize: 12, color: C.text, fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                                <div style={{ fontSize: 10, color: C.dim }}>{n.body}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
