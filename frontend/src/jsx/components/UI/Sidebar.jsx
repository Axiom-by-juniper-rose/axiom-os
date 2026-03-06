import React, { useState } from 'react';
import { C, S, NAV } from '../../constants';

export function Sidebar({ active, setActive, collapsed, setCollapsed }) {
    const [expanded, setExpanded] = useState({});
    const toggleGroup = (name) => {
        setExpanded(prev => {
            const current = prev[name] !== false;
            return { ...prev, [name]: !current };
        });
    };

    const groups = NAV.reduce((acc, item) => {
        if (!acc.find(g => g.name === item.group)) acc.push({ name: item.group, items: [] });
        acc.find(g => g.name === item.group).items.push(item);
        return acc;
    }, []);

    return (
        <div style={{ ...S.side, width: collapsed ? 64 : 218, transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", position: "relative" }}>
            <div style={{ padding: collapsed ? "18px 0" : "18px 16px 12px", borderBottom: `1px solid ${C.border}`, flexShrink: 0, textAlign: "center", overflow: "hidden" }}>
                <div style={{ fontSize: collapsed ? 14 : 23, fontWeight: 700, letterSpacing: collapsed ? 2 : 6, color: C.gold, fontFamily: "Georgia,serif", transition: "all 0.3s" }}>{collapsed ? "AX" : "AXIOM"}</div>
                {!collapsed && <div style={{ fontSize: 9, color: C.dim, letterSpacing: 3, marginTop: 2 }}>DEVELOPER OS v6.0</div>}
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
                {groups.map(group => {
                    const isExpanded = expanded[group.name] !== false;
                    return (
                        <div key={group.name} style={{ overflow: "hidden" }}>
                            {!collapsed && (
                                <div style={{ ...S.navg, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => toggleGroup(group.name)}>
                                    <span>{group.name}</span>
                                    <span style={{ fontSize: 10, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                                </div>
                            )}
                            <div style={{ maxHeight: isExpanded || collapsed ? 1500 : 0, opacity: isExpanded || collapsed ? 1 : 0, transition: "all 0.3s" }}>
                                {group.items.map(item => (
                                    <div key={item.id} style={S.navi(active === item.id, collapsed)} onClick={() => setActive(item.id)} title={collapsed ? item.label : ""}>
                                        <span style={{ fontSize: 13, color: active === item.id ? C.gold : C.dim }}>{active === item.id ? "✦" : "✧"}</span>
                                        {!collapsed && <span>{item.label}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ position: "absolute", bottom: 60, right: collapsed ? 24 : 16, cursor: "pointer", color: C.gold, fontSize: 18 }} onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "»" : "«"}
            </div>
        </div>
    );
}
