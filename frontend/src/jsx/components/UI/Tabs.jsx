import React, { useState } from 'react';
import { S } from '../../constants';

export function Tabs({ tabs, children }) {
    const [a, setA] = useState(0);
    return (
        <div>
            <div style={S.hbar}>{tabs.map((t, i) => <button key={i} style={S.tab(a === i)} onClick={() => setA(i)}>{t}</button>)}</div>
            {children[a] || children}
        </div>
    );
}
