import React from 'react';
import { C } from '../../constants';

export function HealthRing({ score }) {
    const color = score >= 75 ? C.green : score >= 50 ? C.amber : C.red;
    const r = 36, circ = 2 * Math.PI * r, dash = circ * score / 100;
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <svg width={90} height={90}>
                <circle cx={45} cy={45} r={r} fill="none" stroke={C.border} strokeWidth={7} />
                <circle cx={45} cy={45} r={r} fill="none" stroke={color} strokeWidth={7}
                    strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.6s" }} />
                <text x={45} y={50} textAnchor="middle" fill={color} fontSize={18} fontWeight={700} fontFamily="Courier New">{score}</text>
            </svg>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 2, marginTop: -4 }}>PROJECT HEALTH</div>
        </div>
    );
}
