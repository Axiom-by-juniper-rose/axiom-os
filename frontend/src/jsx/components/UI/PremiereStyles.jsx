import React from 'react';

export function PremiereStyles() {
    return (
        <style>{`
      :root {
        --c-gold: #D4A843; --c-gold2: #E8C76A; --c-bg: #0D0F13; --c-bg2: #0A0C10; --c-bg3: #111318;
        --c-bg4: #1A1E2A; --c-border: #1E2330; --c-border2: #2D3748; --c-dim: #6B7280;
        --c-text: #E2E8F0; --c-muted: #8892A4; --c-sub: #C4CDD8;
        --c-green: #22C55E; --c-blue: #3B82F6; --c-purple: #8B5CF6;
        --c-red: #EF4444; --c-amber: #F59E0B; --c-teal: #10B981;
      }
      body.light-mode {
        --c-gold: #B38622; --c-gold2: #C49F44; --c-bg: #F8FAFC; --c-bg2: #F1F5F9; --c-bg3: #FFFFFF;
        --c-bg4: #E2E8F0; --c-border: #E2E8F0; --c-border2: #CBD5E1; --c-dim: #64748B;
        --c-text: #0F172A; --c-muted: #475569; --c-sub: #334155;
        --c-green: #16A34A; --c-blue: #2563EB; --c-purple: #7C3AED;
        --c-red: #DC2626; --c-amber: #D97706; --c-teal: #0D9488;
      }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: var(--c-bg2); }
      ::-webkit-scrollbar-thumb { background: var(--c-border); borderRadius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--c-dim); }
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    `}</style>
    );
}
