import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { KPI } from '../UI/KPI';

export default function SiteManagement() {
    const [tasks, setTasks] = useLS("axiom_site_tasks", [
        { id: 1, name: "Mass Grading", start: "2025-03-01", dur: 14, progress: 0, status: "Planned" },
        { id: 2, name: "Wet Utilities", start: "2025-03-15", dur: 21, progress: 0, status: "Planned" },
        { id: 3, name: "Staking & Survey", start: "2025-02-25", dur: 3, progress: 100, status: "Complete" },
        { id: 4, name: "Mobilization", start: "2025-02-20", dur: 5, progress: 80, status: "In Progress" },
    ]);

    return (
        <Tabs tabs={["Development Schedule", "Daily Logs", "RFIs & Submittals"]}>
            <div>
                <Card title="Gantt Timeline View">
                    <div style={{ padding: "10px 0" }}>
                        {tasks.map(t => (
                            <div key={t.id} style={{ marginBottom: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                                    <span style={{ color: C.sub }}>{t.name}</span>
                                    <span style={{ color: C.dim }}>{t.start} ({t.dur} days)</span>
                                </div>
                                <div style={{ height: 18, background: C.bg2, borderRadius: 9, position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${t.progress}%`, background: t.status === "Complete" ? C.green : C.gold, opacity: 0.8 }} />
                                    <div style={{ position: "absolute", left: "5%", top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: 9, fontWeight: 700 }}>{t.progress}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div>
                <Card title="Construction Daily Logs">
                    <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                        <KPI label="Workers on Site" value="12" />
                        <KPI label="Weather" value="Sunny / 72°F" />
                        <KPI label="Incidents" value="0" color={C.green} />
                    </div>
                </Card>
            </div>
        </Tabs>
    );
}
