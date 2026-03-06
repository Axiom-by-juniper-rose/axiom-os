import React from 'react';
import { S } from '../../constants';

export function Field({ label, children, mb }) {
    return (
        <div style={{ marginBottom: mb ?? 11 }}>
            <label style={S.lbl}>{label}</label>
            {children}
        </div>
    );
}
