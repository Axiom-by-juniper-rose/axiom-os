import React from 'react';
import { C } from '../../constants';

export function Progress({ value, color, height = 5 }) {
    return (
        <div style={{ height, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div
                style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(0, value))}%`,
                    background: color || C.gold,
                    borderRadius: 3,
                    transition: "width 0.4s"
                }}
            />
        </div>
    );
}
