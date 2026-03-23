/**
 * PortfolioGovernance — Axiom OS V5
 * Autonomy mode controls and escalation threshold settings per org.
 */
import { useState, useEffect } from 'react';

const C = {
  bg: '#0d0d1a', surface: '#12121f', border: 'rgba(255,255,255,0.07)',
  gold: '#e8b84b', goldDim: 'rgba(232,184,75,0.12)', goldBorder: 'rgba(232,184,75,0.3)',
  green: '#4ade80', text: '#eceaf5', textMid: '#7a8494',
};

type AutonomyMode = 'manual' | 'assisted' | 'supervised' | 'autonomous';

const MODES: { id: AutonomyMode; label: string; description: string }[] = [
  { id: 'manual',     label: 'Manual',     description: 'All agent actions require human approval before execution.' },
  { id: 'assisted',   label: 'Assisted',   description: 'Agents suggest actions. You click to confirm each one.'     },
  { id: 'supervised', label: 'Supervised', description: 'Agents act autonomously under cost thresholds. Escalate above.' },
  { id: 'autonomous', label: 'Autonomous', description: 'Full autonomous operation. Escalate only for exceptions.'    },
];

interface Props {
  orgId: string;
  supabase: any;
}

export function PortfolioGovernance({ orgId, supabase }: Props) {
  const [mode, setMode] = useState<AutonomyMode>('assisted');
  const [maxCost, setMaxCost] = useState(50000);
  const [threshold, setThreshold] = useState(0.75);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await supabase
          .table('portfolio_governance')
          .select('*').eq('org_id', orgId).single();
        if (res.data) {
          setMode(res.data.autonomy_mode || 'assisted');
          setMaxCost(res.data.max_auto_cost_impact ?? 50000);
          setThreshold(res.data.escalation_threshold ?? 0.75);
        }
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, [orgId, supabase]);

  const handleSave = async () => {
    try {
      await supabase.table('portfolio_governance').upsert({
        org_id: orgId,
        autonomy_mode: mode,
        max_auto_cost_impact: maxCost,
        escalation_threshold: threshold,
        updated_at: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save governance settings:', e);
    }
  };

  if (loading) return <div style={{ color: C.textMid, padding: 24 }}>Loading governance settings...</div>;

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: C.text, marginBottom: 20, fontSize: 16, margin: '0 0 20px' }}>
        Portfolio Governance
      </h3>

      {/* Autonomy mode selector */}
      <div style={{ marginBottom: 24 }}>
        <Label>Autonomy Mode</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MODES.map((m) => (
            <div
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                background: mode === m.id ? C.goldDim : C.surface,
                border: `1px solid ${mode === m.id ? C.goldBorder : C.border}`,
                borderRadius: 8, padding: '12px 16px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `2px solid ${mode === m.id ? C.gold : C.textMid}`,
                  background: mode === m.id ? C.gold : 'transparent',
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: C.text, fontSize: 14 }}>
                  {m.label}
                </span>
              </div>
              <p style={{ color: C.textMid, fontSize: 12, margin: '6px 0 0 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thresholds */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <Label>Max Auto Cost Impact ($)</Label>
          <input
            type="number"
            value={maxCost}
            onChange={(e) => setMaxCost(Number(e.target.value))}
            style={inputStyle}
          />
          <sub style={{ color: C.textMid, fontSize: 11 }}>Agent actions above this escalate to human</sub>
        </div>
        <div style={{ flex: 1 }}>
          <Label>Escalation Threshold (0–1)</Label>
          <input
            type="number"
            min={0} max={1} step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            style={inputStyle}
          />
          <sub style={{ color: C.textMid, fontSize: 11 }}>Risk scores above this trigger escalation</sub>
        </div>
      </div>

      <button onClick={handleSave} style={btnStyle}>
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.textMid, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: '#12121f', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, padding: '9px 12px', color: '#eceaf5',
  fontFamily: 'DM Mono, monospace', fontSize: 13, outline: 'none', display: 'block',
};

const btnStyle: React.CSSProperties = {
  background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.3)',
  borderRadius: 8, padding: '10px 24px', color: '#e8b84b',
  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
};
