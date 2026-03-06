import React from 'react';
import { C, RC } from '../../constants';
import { Badge } from './Badge';

export function CItem({ text, checked, onChange, risk }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", borderBottom: "1px solid #0F1117" }}>
            <input type="checkbox" checked={!!checked} onChange={onChange} style={{ accentColor: C.gold, width: 13, height: 13, cursor: "pointer" }} />
            <span style={{ flex: 1, fontSize: 13, color: checked ? C.dim : C.sub, textDecoration: checked ? "line-through" : "none" }}>{text}</span>
            {risk && <Badge label={risk} color={RC[risk] || C.dim} />}
        </div>
    );
}
