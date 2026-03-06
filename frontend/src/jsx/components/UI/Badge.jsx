import React from 'react';
import { S, C } from '../../constants';

export function Badge({ label, color }) {
    return <span style={S.tag(color || C.gold)}>{label}</span>;
}

export function Dot({ color }) {
    return <span style={S.dot(color)} />;
}
