import React, { useState, useEffect, useRef } from 'react';
import { NAV } from '../../constants';

export function CommandKModal({ isOpen, onClose, onSelect }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    if (!isOpen) return null;
    const results = NAV.filter(n => n.label.toLowerCase().includes(query.toLowerCase()) || n.group.toLowerCase().includes(query.toLowerCase()));

    const handleSelect = (id) => {
        onSelect(id);
        onClose();
    };

    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 10000, paddingTop: "12vh", backdropFilter: "blur(4px)" }} onClick={onClose}>
            <div style={{ background: "var(--c-bg3)", border: `1px solid var(--c-border)`, borderRadius: 8, width: 600, maxWidth: "90%", boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid var(--c-border)`, background: "var(--c-bg2)" }}>
                    <input ref={inputRef} style={{ background: "transparent", border: "none", color: "var(--c-text)", fontSize: 16, width: "100%", outline: "none" }} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Axiom OS..." />
                </div>
                <div style={{ maxHeight: 400, overflowY: "auto", padding: 8 }}>
                    {results.map((item) => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer" }} onClick={() => handleSelect(item.id)}>
                            <span style={{ color: "var(--c-text)", fontSize: 14 }}>{item.label}</span>
                            <span style={{ fontSize: 10, color: "var(--c-dim)", textTransform: "uppercase" }}>{item.group}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
