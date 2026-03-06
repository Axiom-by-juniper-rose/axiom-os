import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';
import { Badge } from '../UI/Badge';

export default function Workflows() {
    const [workflows, setWorkflows] = useLS("axiom_workflows", [
        { id: 1, name: "Deal Stage Transition Alerts", trigger: "Deal moves to new stage", condition: "Any deal", actions: ["Send email notification", "Log activity"], status: "Active", runs: 24, lastRun: "2025-02-20" },
        { id: 2, name: "DD Deadline Reminders", trigger: "3 days before DD deadline", condition: "Deals in DD", actions: ["Send email reminder"], status: "Active", runs: 8, lastRun: "2025-02-18" },
    ]);

    const toggle = (id) => setWorkflows(workflows.map(w => w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w));

    return (
        <Tabs tabs={["Active Workflows", "Create Workflow"]}>
            <div>
                <div style={{ ...S.g4, marginBottom: 14 }}>
                    <KPI label="Total Workflows" value={workflows.length} />
                    <KPI label="Active" value={workflows.filter(w => w.status === "Active").length} color={C.green} />
                </div>
                {workflows.map(w => (
                    <Card key={w.id} title={w.name} action={<div style={{ display: "flex", gap: 6 }}><Badge label={w.status} color={w.status === "Active" ? C.green : C.amber} /><button style={{ ...S.btn(), padding: "3px 8px", fontSize: 9 }} onClick={() => toggle(w.id)}>{w.status === "Active" ? "Pause" : "Resume"}</button></div>}>
                        <div style={{ fontSize: 12, color: C.sub }}>Trigger: {w.trigger}</div>
                        <div style={{ fontSize: 12, color: C.dim }}>Last Run: {w.lastRun} ({w.runs} runs)</div>
                    </Card>
                ))}
            </div>
        </Tabs>
    );
}
