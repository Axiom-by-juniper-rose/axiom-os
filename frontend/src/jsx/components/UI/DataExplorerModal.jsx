import React from 'react';
import { C, S } from '../../constants';
import { fmt } from '../../utils';

export function DataExplorerModal({ data, onClose }) {
    if (!data) return null;
    const pd = data.payload || data;
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)" }} onClick={onClose}>
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24, width: 500, maxWidth: "90%" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.gold, textTransform: "uppercase" }}>Data Node Inspector</div>
                    <button style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontSize: 18 }} onClick={onClose}>×</button>
                </div>
                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    {Object.entries(pd).map(([k, v], i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: i % 2 === 0 ? C.bg2 : "transparent" }}>
                            <span style={{ color: C.sub, fontSize: 13 }}>{k}</span>
                            <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{String(v)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
