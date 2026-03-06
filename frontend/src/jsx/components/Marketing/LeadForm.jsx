import React, { useState } from 'react';
import { C, S } from '../../constants';

export default function LeadForm({ title = "Download the E-Book", subtitle = "Mastering Spatial Intelligence in CRE" }) {
    const [form, setForm] = useState({ name: '', email: '', role: '', company: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("[Marketing] Lead Captured:", form);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: C.bg2, borderRadius: 12, border: `1px solid ${C.green}44` }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📥</div>
                <div style={{ fontSize: 18, color: C.text, fontWeight: 700, marginBottom: 8 }}>Thank you!</div>
                <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>Your download link has been sent to {form.email}.</div>
                <button style={S.btn("gold")} onClick={() => setSubmitted(false)}>Back</button>
            </div>
        );
    }

    return (
        <div style={{ padding: 32, background: C.bg3, borderRadius: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 24 }}>{subtitle}</div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <input
                        style={S.inp} placeholder="Full Name" required
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                    <input
                        style={S.inp} type="email" placeholder="Work Email" required
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <select
                        style={S.sel} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="">Your Role</option>
                        <option>Managing Director</option>
                        <option>Acquisition Lead</option>
                        <option>Analyst</option>
                        <option>Broker</option>
                    </select>
                    <input
                        style={S.inp} placeholder="Company Name"
                        value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                </div>
                <button type="submit" style={{ ...S.btn("gold"), width: '100%', padding: '14px' }}>Send me the E-Book</button>
            </form>
        </div>
    );
}
