import React from 'react';
import { S, C } from '../../constants';

export function KPI({ label, value, sub, color, trend }) {
    return (
        <div style={S.kpi}>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 25, color: color || C.gold, fontWeight: 700, marginTop: 3, lineHeight: 1 }}>{value}</div>
            {sub && <div style={{ fontSize: 10, color: C.dim, marginTop: 3 }}>{sub}</div>}
            {trend !== undefined && (
                <div style={{ fontSize: 10, color: trend >= 0 ? C.green : C.red, marginTop: 2 }}>
                    {trend >= 0 ? "— ²" : "— ¼"} {Math.abs(trend).toFixed(1)}%
                </div>
            )}
        </div>
    );
}
