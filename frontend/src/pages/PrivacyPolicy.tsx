import React from 'react';

const S = {
    page: { backgroundColor: '#0A0A0A', color: '#ECECEC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' } as React.CSSProperties,
    nav: { padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' } as React.CSSProperties,
    wrap: { maxWidth: 800, margin: '0 auto', padding: '64px 48px' } as React.CSSProperties,
    h1: { fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 } as React.CSSProperties,
    h2: { fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 40, marginBottom: 12 } as React.CSSProperties,
    p: { color: '#94A3B8', lineHeight: 1.8, fontSize: 15, marginBottom: 16 } as React.CSSProperties,
    ul: { color: '#94A3B8', lineHeight: 1.8, fontSize: 15, paddingLeft: 24, marginBottom: 16 } as React.CSSProperties,
    meta: { color: '#64748B', fontSize: 13, marginBottom: 48 } as React.CSSProperties,
    footer: { padding: '32px 48px', borderTop: '1px solid #222', textAlign: 'center' as const, color: '#64748B', fontSize: 13 },
};

export const PrivacyPolicy: React.FC = () => (
    <div style={S.page}>
        <nav style={S.nav}>
            <a href="/" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '2px', color: '#fff', textDecoration: 'none' }}>
                ⬡ AXIOM<span style={{ color: '#D4A843' }}>OS</span>
            </a>
            <a href="/" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>← Back to Home</a>
        </nav>

        <div style={S.wrap}>
            <h1 style={S.h1}>Privacy Policy</h1>
            <p style={S.meta}>Last Updated: March 23, 2026 · Effective: March 23, 2026</p>

            <p style={S.p}>
                Juniper Rose Intelligence LLC ("Company," "we," "us," or "our") operates Axiom OS, a spatial intelligence and real estate underwriting platform available at <strong style={{ color: '#fff' }}>buildaxiom.dev</strong> ("Service"). This Privacy Policy explains how we collect, use, disclose, and protect your information.
            </p>

            <h2 style={S.h2}>1. Information We Collect</h2>
            <p style={S.p}><strong style={{ color: '#D4A843' }}>Account Information:</strong> When you register, we collect your name, email address, company name, and password hash.</p>
            <p style={S.p}><strong style={{ color: '#D4A843' }}>Payment Information:</strong> Billing and payment data is processed by Stripe, Inc. We store only your Stripe Customer ID and subscription tier — we never store raw card numbers or bank details on our servers.</p>
            <p style={S.p}><strong style={{ color: '#D4A843' }}>Usage Data:</strong> We collect logs of features accessed, analysis runs executed, API calls made, and error events. This data is used to operate and improve the Service.</p>
            <p style={S.p}><strong style={{ color: '#D4A843' }}>Project Data:</strong> Real estate deal data, financial models, documents, and notes you create or upload are stored in your account and processed to provide the Service.</p>
            <p style={S.p}><strong style={{ color: '#D4A843' }}>Device & Technical Data:</strong> IP address, browser type, operating system, and session identifiers collected automatically via Supabase Auth and application logs.</p>

            <h2 style={S.h2}>2. How We Use Your Information</h2>
            <ul style={S.ul}>
                <li>To provide, maintain, and improve the Axiom OS platform</li>
                <li>To process payments and manage your subscription via Stripe</li>
                <li>To enforce plan limits (analysis runs, deal count, feature gates)</li>
                <li>To send transactional emails (receipts, password resets, usage alerts)</li>
                <li>To respond to support requests sent to support@buildaxiom.dev</li>
                <li>To detect fraud, abuse, and security incidents</li>
                <li>To comply with legal obligations</li>
            </ul>
            <p style={S.p}>We do not sell your personal information or project data to third parties.</p>

            <h2 style={S.h2}>3. Data Sharing & Third-Party Services</h2>
            <p style={S.p}>We share data only with services necessary to operate the platform:</p>
            <ul style={S.ul}>
                <li><strong style={{ color: '#fff' }}>Stripe, Inc.</strong> — Payment processing. Subject to Stripe's Privacy Policy.</li>
                <li><strong style={{ color: '#fff' }}>Supabase, Inc.</strong> — Database, authentication, and edge functions (hosted on AWS us-west-2).</li>
                <li><strong style={{ color: '#fff' }}>Anthropic, PBC</strong> — AI Copilot and agent pipeline inference. Prompts and outputs may be processed by Anthropic's API.</li>
                <li><strong style={{ color: '#fff' }}>Railway, Inc.</strong> — Backend API hosting.</li>
                <li><strong style={{ color: '#fff' }}>ATTOM Data / Regrid / FRED</strong> — Third-party market data providers accessed on your behalf.</li>
            </ul>

            <h2 style={S.h2}>4. Data Retention</h2>
            <p style={S.p}>Account data is retained for the duration of your subscription plus 90 days after cancellation, after which it is deleted. You may request immediate deletion by emailing support@buildaxiom.dev. Payment records are retained as required by law (typically 7 years).</p>

            <h2 style={S.h2}>5. Security</h2>
            <p style={S.p}>We use AES-256 encryption at rest, TLS 1.3 in transit, Row Level Security (RLS) enforced at the database layer, and Stripe-certified payment handling. Access to production data is restricted to authorized personnel only.</p>

            <h2 style={S.h2}>6. Your Rights (CCPA / GDPR)</h2>
            <p style={S.p}>Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data. To exercise these rights, email <strong style={{ color: '#D4A843' }}>support@buildaxiom.dev</strong> with subject line "Data Request." We will respond within 30 days.</p>

            <h2 style={S.h2}>7. Cookies</h2>
            <p style={S.p}>We use essential session cookies for authentication only. We do not use advertising or tracking cookies. You may disable cookies in your browser, but this will prevent login functionality.</p>

            <h2 style={S.h2}>8. Children's Privacy</h2>
            <p style={S.p}>The Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors.</p>

            <h2 style={S.h2}>9. Changes to This Policy</h2>
            <p style={S.p}>We may update this policy periodically. Material changes will be communicated via email to your registered address at least 14 days before taking effect.</p>

            <h2 style={S.h2}>10. Contact</h2>
            <p style={S.p}>
                Juniper Rose Intelligence LLC<br />
                Sarasota, FL 34233<br />
                Email: <a href="mailto:support@buildaxiom.dev" style={{ color: '#D4A843' }}>support@buildaxiom.dev</a>
            </p>
        </div>

        <footer style={S.footer}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12 }}>
                <a href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
                <a href="/refund" style={{ color: '#64748B', textDecoration: 'none' }}>Refund Policy</a>
                <a href="mailto:support@buildaxiom.dev" style={{ color: '#64748B', textDecoration: 'none' }}>Support</a>
            </div>
            © 2026 Juniper Rose Intelligence LLC · Sarasota, FL
        </footer>
    </div>
);
