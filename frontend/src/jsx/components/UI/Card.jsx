import React from 'react';
import { S } from '../../constants';

export function Card({ title, children, action }) {
    return (
        <div style={S.card}>
            <div style={S.ct}>
                <span>{title}</span>
                {action}
            </div>
            {children}
        </div>
    );
}
