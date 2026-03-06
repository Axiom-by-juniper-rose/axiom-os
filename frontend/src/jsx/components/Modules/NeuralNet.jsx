import React, { useState, useContext } from 'react';
import { C, S } from '../../constants';
import { ProjectContext as Ctx } from '../../context/ProjectContext';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Badge, Dot } from '../UI/Badge';
import { Agent } from '../UI/Agent';

export default function NeuralNet() {
    const { project, fin } = useContext(Ctx);
    const loc = project.state ? (project.municipality ? `${project.municipality}, ${project.state}` : project.state) : "your market";
    const [activeLayer, setActiveLayer] = useState(null);
    const [activeNode, setActiveNode] = useState(null);
    const [nodeData, setNodeData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const layers = [
        { id: "input", name: "Input Layer", nodes: ["Site Data", "Zoning", "Comps", "Market Trends", "Demographics", "Finance"], color: C.blue },
        { id: "output", name: "Output Layer", nodes: ["Deal Score", "Go/No-Go", "Optimal Price", "Timeline", "Risk Rating"], color: C.gold },
    ];

    const NeuronNode = ({ label, color, active, onClick }) => (
        <div onClick={onClick} style={{ padding: "6px 10px", borderRadius: 20, border: `1.5px solid ${active ? color : color + "55"}`, background: active ? color + "22" : "transparent", cursor: "pointer", fontSize: 10, color: active ? color : C.muted, minWidth: 70, position: "relative" }}>
            {active && <div style={{ position: "absolute", top: -2, right: -2, width: 6, height: 6, background: color, borderRadius: 3 }} />}
            {label}
        </div>
    );

    return (
        <Tabs tabs={["Neural Network", "Market Predictions"]}>
            <div>
                <Card title="Deal Scoring Neural Network">
                    <div style={{ display: "flex", gap: 8, justifyContent: "space-between", padding: "20px 0", background: C.bg2, borderRadius: 6, marginBottom: 14 }}>
                        {layers.map((layer) => (
                            <div key={layer.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                <div style={{ fontSize: 10, color: layer.color, fontWeight: 700, textTransform: "uppercase" }}>{layer.name}</div>
                                {layer.nodes.map((node, ni) => (
                                    <NeuronNode key={ni} label={node} color={layer.color} active={activeNode === node} onClick={() => setActiveNode(node)} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <Agent id="NeuralAnalyst" system={`Analyze deal for ${project.name} in ${loc}.`} placeholder="Analyze this deal..." />
                </Card>
            </div>
        </Tabs>
    );
}
