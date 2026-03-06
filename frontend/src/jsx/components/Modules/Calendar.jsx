import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Field } from '../UI/Field';

export default function FullCalendar() {
    const [view, setView] = useState("month");
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selDay, setSelDay] = useState(today.getDate());
    const [events, setEvents] = useLS("axiom_cal_events", [
        { id: 1, title: "Sunset Ridge - LOI Due", date: "2025-02-28", time: "17:00", type: "Deadline", deal: "Sunset Ridge", color: C.red, notes: "Final LOI submission to seller" },
        { id: 2, title: "IC Committee Meeting", date: "2025-03-05", time: "10:00", type: "Meeting", deal: "Ridgecrest Heights", color: C.purple, notes: "Investment committee review" },
    ]);
    const [ne, setNe] = useState({ title: "", date: "", time: "09:00", type: "Meeting", deal: "", color: C.blue, notes: "", recurring: "" });
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const EC = { Deadline: C.red, Meeting: C.purple, Inspection: C.amber, Hearing: C.blue, Closing: C.green, Review: C.teal, Reminder: C.gold, Personal: C.dim };
    const TYPES = ["Meeting", "Deadline", "Inspection", "Hearing", "Closing", "Review", "Reminder", "Personal"];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const dStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayEvents = (d) => events.filter(e => e.date === dStr(d));

    const addEvent = () => { if (!ne.title || !ne.date) return; setEvents([...events, { ...ne, id: Date.now() }]); setNe({ title: "", date: "", time: "09:00", type: "Meeting", deal: "", color: C.blue, notes: "", recurring: "" }); setShowQuickAdd(false); };
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Tabs tabs={["Month View", "Agenda"]}>
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 18, color: C.gold, fontWeight: 700 }}>{MONTHS[month]} {year}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
                    {DAYS.map(d => <div key={d} style={{ padding: 6, textAlign: "center", fontSize: 9, color: C.dim, background: C.bg2 }}>{d}</div>)}
                    {Array.from({ length: firstDay }, (_, i) => <div key={"e" + i} style={{ background: C.bg2, minHeight: 80 }} />)}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const d = i + 1; const evts = dayEvents(d);
                        return (
                            <div key={d} style={{ background: C.bg2, border: `1px solid ${C.border}`, minHeight: 80, padding: 4, cursor: "pointer" }} onClick={() => { setSelDay(d); setShowQuickAdd(true); setNe({ ...ne, date: dStr(d) }); }}>
                                <div style={{ fontSize: 13, color: C.text }}>{d}</div>
                                {evts.map(e => (
                                    <div key={e.id} style={{ fontSize: 9, padding: "1px 4px", borderRadius: 2, marginTop: 2, background: (e.color || C.blue) + "22", color: e.color || C.blue }}>{e.title}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Tabs>
    );
}
