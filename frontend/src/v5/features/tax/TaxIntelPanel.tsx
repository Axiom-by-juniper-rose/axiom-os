/**
 * TaxIntelPanel — Axiom OS V5
 * Tabbed tax intelligence: Codes | Property Tax | Opportunity Zones | Depreciation | 1031
 */
import { useState } from 'react';

const C = {
  bg: '#07070e', surface: '#0d0d1a', surfaceHi: '#12121f',
  border: 'rgba(255,255,255,0.07)', gold: '#e8b84b',
  goldDim: 'rgba(232,184,75,0.12)', green: '#4ade80',
  text: '#eceaf5', textMid: '#7a8494',
};

type Tab = 'codes' | 'property' | 'oz' | 'depreciation' | '1031';

const TABS: { id: Tab; label: string }[] = [
  { id: 'codes',        label: 'Tax Codes'    },
  { id: 'property',     label: 'Property Tax' },
  { id: 'oz',           label: 'Opp. Zones'   },
  { id: 'depreciation', label: 'Depreciation' },
  { id: '1031',         label: '1031 Exchange' },
];

interface Props {
  dealId?: string;
  projectId?: string;
}

export function TaxIntelPanel({ dealId, projectId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('codes');

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${C.border}`,
        padding: '0 20px', gap: 4,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 16px', fontSize: 13,
              fontFamily: 'Instrument Sans, sans-serif',
              color: activeTab === tab.id ? C.gold : C.textMid,
              borderBottom: activeTab === tab.id ? `2px solid ${C.gold}` : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {activeTab === 'codes'        && <TaxCodesTab />}
        {activeTab === 'property'     && <PropertyTaxTab dealId={dealId} />}
        {activeTab === 'oz'           && <OZTab dealId={dealId} />}
        {activeTab === 'depreciation' && <DepreciationTab projectId={projectId} />}
        {activeTab === '1031'         && <Exchange1031Tab dealId={dealId} />}
      </div>
    </div>
  );
}

function TaxCodesTab() {
  const [state, setState] = useState('FL');
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={state}
          onChange={(e) => setState(e.target.value.toUpperCase())}
          placeholder="State (e.g. FL)"
          maxLength={2}
          style={inputStyle}
        />
        <button style={btnStyle}>Search</button>
      </div>
      <Placeholder text={`Tax codes for ${state} will load here`} />
    </div>
  );
}

function PropertyTaxTab({ dealId }: { dealId?: string }) {
  return (
    <div>
      <SectionLabel>Property Tax Records</SectionLabel>
      {dealId
        ? <Placeholder text="Property tax records load from county assessor API" />
        : <Placeholder text="No deal selected" />}
    </div>
  );
}

function OZTab({ dealId }: { dealId?: string }) {
  return (
    <div>
      <SectionLabel>Opportunity Zone Eligibility</SectionLabel>
      {dealId
        ? <Placeholder text="OZ spatial lookup runs against IRS 2018 tract data" />
        : <Placeholder text="Select a deal to check OZ eligibility" />}
      <div style={{ marginTop: 16, fontSize: 12, color: C.textMid, fontFamily: 'DM Mono, monospace' }}>
        8,764 IRS OZ tracts indexed | Expires: 2028-12-31
      </div>
    </div>
  );
}

function DepreciationTab({ projectId }: { projectId?: string }) {
  return (
    <div>
      <SectionLabel>MACRS Depreciation Schedules</SectionLabel>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Residential', life: '27.5 yr' },
          { label: 'Commercial',  life: '39 yr'   },
          { label: 'Land Improve', life: '15 yr'  },
          { label: 'Equipment',   life: '5-7 yr'  },
        ].map((item) => (
          <div key={item.label} style={{
            background: C.surfaceHi, borderRadius: 8, padding: '10px 14px',
            border: `1px solid ${C.border}`, minWidth: 120,
          }}>
            <div style={{ fontSize: 12, color: C.textMid }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: 'Syne, sans-serif' }}>
              {item.life}
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: C.textMid, fontFamily: 'DM Mono, monospace' }}>
        2026 Bonus depreciation: 20% | TCJA phase-down active
      </div>
      {projectId
        ? <Placeholder text="Full MACRS schedule loads from project depreciation_schedules" />
        : <Placeholder text="Select a project to view full schedule" />}
    </div>
  );
}

function Exchange1031Tab({ dealId }: { dealId?: string }) {
  return (
    <div>
      <SectionLabel>1031 Exchange Tracker</SectionLabel>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <InfoBadge label="ID Deadline" value="45 days" color={C.gold} />
        <InfoBadge label="Exchange Deadline" value="180 days" color={C.gold} />
      </div>
      {dealId
        ? <Placeholder text="Active 1031 exchanges for this deal appear here" />
        : <Placeholder text="Select a deal to view exchange status" />}
    </div>
  );
}

// ── Shared micro-components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: C.text, marginBottom: 12, fontSize: 14 }}>
      {children}
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div style={{
      background: C.surfaceHi, borderRadius: 8, padding: '18px 20px',
      border: `1px dashed ${C.border}`,
      color: C.textMid, fontSize: 12, fontFamily: 'DM Mono, monospace',
    }}>
      {text}
    </div>
  );
}

function InfoBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: C.surfaceHi, borderRadius: 8, padding: '10px 16px', border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, color: C.textMid, fontFamily: 'DM Mono, monospace' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'Syne, sans-serif' }}>{value}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#12121f', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, padding: '8px 12px', color: '#eceaf5',
  fontFamily: 'DM Mono, monospace', fontSize: 13, outline: 'none', width: 100,
};

const btnStyle: React.CSSProperties = {
  background: 'rgba(232,184,75,0.15)', border: '1px solid rgba(232,184,75,0.3)',
  borderRadius: 6, padding: '8px 16px', color: '#e8b84b',
  fontFamily: 'Instrument Sans, sans-serif', fontSize: 13, cursor: 'pointer',
};
