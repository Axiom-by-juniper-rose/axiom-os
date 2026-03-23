/**
 * RiskCalibrationDashboard — Axiom OS V5
 * Displays Brier score trend and agent prediction history.
 */
import { useEffect, useState } from 'react';

const C = {
  bg: '#0d0d1a', surface: '#12121f', border: 'rgba(255,255,255,0.07)',
  gold: '#e8b84b', green: '#4ade80', red: '#f87171',
  text: '#eceaf5', textMid: '#7a8494',
};

interface RiskEvent {
  id: string;
  deal_id: string;
  risk_type: string;
  predicted_prob: number;
  actual_outcome: boolean | null;
  brier_score: number | null;
  tts_applied: boolean;
  model_version: string;
  created_at: string;
}

interface Props {
  orgId?: string;
  supabase: any;
}

export function RiskCalibrationDashboard({ orgId: _orgId, supabase }: Props) {
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [avgBrier, setAvgBrier] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await supabase
          .table('risk_events')
          .select('*')
          .not('brier_score', 'is', null)
          .order('created_at', { ascending: false })
          .limit(50)
          .execute();
        const data: RiskEvent[] = result.data || [];
        setEvents(data);
        if (data.length > 0) {
          const avg = data.reduce((s, e) => s + (e.brier_score ?? 0), 0) / data.length;
          setAvgBrier(Math.round(avg * 1000) / 1000);
        }
      } catch (e) {
        console.warn('RiskCalibration load failed:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase]);

  const baseline = 0.24;
  const improvement = avgBrier !== null ? ((baseline - avgBrier) / baseline * 100).toFixed(1) : null;
  const scoreColor = avgBrier !== null && avgBrier < baseline ? C.green : C.red;

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: C.text, marginBottom: 20, fontSize: 16 }}>
        Risk Calibration
      </h3>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, background: C.surface, borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.textMid, marginBottom: 6 }}>
            BRIER SCORE
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: scoreColor }}>
            {loading ? '—' : avgBrier ?? '—'}
          </div>
          <div style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>
            baseline: {baseline}
          </div>
        </div>
        <div style={{ flex: 1, background: C.surface, borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.textMid, marginBottom: 6 }}>
            IMPROVEMENT
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: C.green }}>
            {improvement ? `+${improvement}%` : '—'}
          </div>
          <div style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>vs naive baseline</div>
        </div>
        <div style={{ flex: 1, background: C.surface, borderRadius: 8, padding: '14px 18px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: C.textMid, marginBottom: 6 }}>
            CALIBRATED EVENTS
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: C.text }}>
            {events.length}
          </div>
          <div style={{ fontSize: 11, color: C.textMid, marginTop: 4 }}>
            TT-SI applied: {events.filter((e) => e.tts_applied).length}
          </div>
        </div>
      </div>

      {/* Recent events list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {events.slice(0, 8).map((ev) => (
          <div key={ev.id} style={{
            display: 'flex', gap: 12, padding: '8px 12px',
            background: C.surface, borderRadius: 6,
            fontFamily: 'DM Mono, monospace', fontSize: 11,
          }}>
            <span style={{ color: C.textMid, flex: 1 }}>{ev.risk_type}</span>
            <span style={{ color: C.text }}>{ev.predicted_prob.toFixed(3)}</span>
            <span style={{ color: ev.brier_score! < 0.2 ? C.green : C.red }}>
              {ev.brier_score?.toFixed(3)}
            </span>
            <span style={{ color: ev.tts_applied ? C.gold : C.textMid }}>
              {ev.tts_applied ? 'TT-SI' : '     '}
            </span>
          </div>
        ))}
        {events.length === 0 && !loading && (
          <div style={{ color: C.textMid, fontSize: 12, padding: '12px 0' }}>
            No calibrated events yet. Run deal analyses to populate.
          </div>
        )}
      </div>
    </div>
  );
}
