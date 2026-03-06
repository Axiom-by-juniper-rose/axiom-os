import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge, Dot } from '../UI/Badge';

export default function Legal() {
    const [activeDoc, setActiveDoc] = useState(null);
    const [docs, setDocs] = useLS("axiom_legal_v2", [
        { id: 1, name: "Terms of Service", status: "Active", version: "3.2", lastUpdated: "2025-01-15", type: "Terms", content: "AXIOM OS - TERMS OF SERVICE..." },
        { id: 2, name: "Privacy Policy", status: "Active", version: "2.8", lastUpdated: "2025-01-15", type: "Privacy", content: "AXIOM OS - PRIVACY POLICY..." },
    ]);

    const CS = { Active: C.green, Draft: C.amber, Archived: C.dim, Registered: C.green, Pending: C.amber, Compliant: C.green };

    if (activeDoc) {
        const d = docs.find(x => x.id === activeDoc);
        return (
            <div>
                <button style={{ ...S.btn(), marginBottom: 14 }} onClick={() => setActiveDoc(null)}>Back to Documents</button>
                <Card title={d.name} action={<Badge label={d.status} color={CS[d.status]} />}>
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap", background: C.bg2, padding: 18, borderRadius: 4 }}>{d.content}</pre>
                </Card>
            </div>
        );
    }

    return (
        <Tabs tabs={["Legal Documents", "Trademarks"]}>
            <div>
                <Card title="Legal Documents">
                    <table style={S.tbl}>
                        <thead><tr><th style={S.th}>Document</th><th style={S.th}>Status</th><th style={S.th}>Version</th><th style={S.th}></th></tr></thead>
                        <tbody>{docs.map(d => (
                            <tr key={d.id}>
                                <td style={S.td}>{d.name}</td>
                                <td style={S.td}><Badge label={d.status} color={CS[d.status]} /></td>
                                <td style={S.td}>v{d.version}</td>
                                <td style={S.td}><button style={S.btn("gold")} onClick={() => setActiveDoc(d.id)}>View</button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </Card>
            </div>
        </Tabs>
    );
}
