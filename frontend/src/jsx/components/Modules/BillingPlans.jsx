import React, { useState, useEffect } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { supabase } from '../../../lib/supabase';

const TIERS = [
    {
        id: "boutique",
        name: "Boutique",
        price: "From $1,500",
        period: "/mo",
        range: "$1,500–$2,500/mo",
        seats: "1–5 users",
        desc: "Full platform access for boutique investors and family offices executing active deals.",
        color: "var(--c-blue)",
        cta: "Request Access",
        features: [
            "Unlimited deal mapping & pipeline",
            "AI IC memo generation",
            "Full financial modeling engine",
            "Neural intelligence scoring",
            "Market intelligence + FRED macro data",
            "Tax intelligence (OZ, MACRS, depreciation)",
            "Agent pipeline (9-stage underwriting)",
            "Offline-capable field mode",
            "PDF & CSV export",
            "Email support + onboarding call",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "From $5,000",
        period: "/mo",
        range: "$5,000–$8,500/mo + compute",
        seats: "10–25 users",
        desc: "Full-stack deal intelligence for growth-stage firms running multi-market portfolios.",
        color: "var(--c-gold)",
        recommended: true,
        cta: "Schedule Demo",
        features: [
            "Everything in Boutique",
            "Bring-your-own-key (CoStar / Anthropic / OpenAI)",
            "Custom ML risk scoring & TT-SI calibration",
            "3D Site Map & GIS spatial layer",
            "Portfolio governance dashboard",
            "Multi-user collaboration (role-based access)",
            "Semantic memory across deal history",
            "Realtime agent swarm (parallel underwriting)",
            "Metered compute at 15% passthrough markup",
            "Dedicated account manager",
        ],
    },
    {
        id: "institution",
        name: "Institution",
        price: "Custom",
        period: "",
        range: "From $150,000/yr",
        seats: "Unlimited users",
        desc: "White-label deployment for institutional platforms, family offices, and capital market teams.",
        color: "var(--c-purple)",
        cta: "Contact Enterprise Sales",
        features: [
            "Everything in Enterprise",
            "White-label branding & custom domain",
            "Bespoke spatial intelligence engine",
            "Custom data lake integration (ATTOM, CoStar, RCA)",
            "BIM-aware agents (Speckle / Procore connectors)",
            "SOC2 Type II compliance package",
            "On-prem / private cloud deployment",
            "SLA-backed uptime guarantee",
            "Custom ML fine-tuning on your deal history",
            "Dedicated engineering pod",
        ],
    },
];

const UNIT_ECONOMICS = [
    { label: "Labor saved / analyst / week", value: "15 hrs" },
    { label: "Annual labor value per seat", value: "$75K+" },
    { label: "Gross margin", value: "87%" },
    { label: "Net Revenue Retention", value: "135%" },
];

export default function BillingPlans() {
    const [current, setCurrent] = useLS("axiom_tier", "boutique");
    const [loading, setLoading] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        supabase?.auth?.getUser?.().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from("user_profiles")
                .select("stripe_customer_id, subscription_tier, stripe_current_period_end")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        setProfile(data);
                        if (data.subscription_tier) setCurrent(data.subscription_tier.toLowerCase());
                    }
                });
        }).catch(() => {});
    }, []);

    const handleCTA = async (tier) => {
        if (tier.id === "institution") {
            window.open("mailto:enterprise@axiom-os.com?subject=Institution%20Inquiry%20—%20Axiom%20OS", "_blank");
            return;
        }
        if (tier.id === "enterprise") {
            window.open("mailto:enterprise@axiom-os.com?subject=Enterprise%20Demo%20Request%20—%20Axiom%20OS", "_blank");
            return;
        }
        // Boutique — attempt Stripe checkout if configured
        setError(null);
        setLoading(tier.id);
        try {
            const { data, error: fnError } = await supabase.functions.invoke("stripe-checkout", {
                body: {
                    action: "create_checkout",
                    tier: tier.id,
                    customerId: profile?.stripe_customer_id || undefined,
                },
            });
            if (fnError) throw new Error(fnError.message);
            if (data?.url) {
                window.location.href = data.url;
            } else {
                window.open("mailto:enterprise@axiom-os.com?subject=Boutique%20Access%20Request", "_blank");
            }
        } catch {
            window.open("mailto:enterprise@axiom-os.com?subject=Boutique%20Access%20Request", "_blank");
        } finally {
            setLoading(null);
        }
    };

    const handleManage = async () => {
        setLoading("portal");
        try {
            const { data, error: fnError } = await supabase.functions.invoke("stripe-checkout", {
                body: {
                    action: "create_portal",
                    customerId: profile?.stripe_customer_id,
                    return_url: window.location.href,
                },
            });
            if (fnError) throw new Error(fnError.message);
            if (data?.url) window.location.href = data.url;
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
                    Seat + Compute Pricing · Enterprise OS
                </div>
                <div style={{ fontSize: 28, color: C.text, fontWeight: 700, marginBottom: 8 }}>
                    Axiom OS Platform Access
                </div>
                <div style={{ fontSize: 12, color: C.dim, maxWidth: 520, margin: "0 auto" }}>
                    Purpose-built for institutional real estate deal intelligence. Not commodity SaaS — a full operating system for deal teams.
                </div>
            </div>

            {/* ROI strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 28, padding: "14px 20px", background: "color-mix(in srgb, var(--c-gold) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--c-gold) 20%, transparent)", borderRadius: 6 }}>
                {UNIT_ECONOMICS.map(({ label, value }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.gold }}>{value}</div>
                        <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
                    </div>
                ))}
            </div>

            {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.red }}>
                    ⚠ {error}
                </div>
            )}

            {/* Tier cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
                {TIERS.map(t => {
                    const isCurrent = current === t.id;
                    const isLoading = loading === t.id;
                    return (
                        <div key={t.id} style={{
                            background: C.bg3,
                            border: `1px solid ${t.recommended ? t.color : C.border}`,
                            borderRadius: 8,
                            padding: 24,
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: t.recommended ? `0 0 24px color-mix(in srgb, ${t.color} 12%, transparent)` : "none",
                        }}>
                            {t.recommended && (
                                <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: C.gold, color: C.bg, fontSize: 8, fontWeight: 800, letterSpacing: 2, padding: "3px 12px", borderRadius: 20, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                    Most Selected
                                </div>
                            )}

                            {/* Tier header */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                                    <span style={{ fontSize: 11, color: t.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>{t.name}</span>
                                    <span style={{ fontSize: 9, color: C.dim, marginLeft: "auto" }}>{t.seats}</span>
                                </div>
                                <div style={{ fontSize: 26, color: C.text, fontWeight: 800, lineHeight: 1 }}>
                                    {t.price}<span style={{ fontSize: 13, color: C.dim, fontWeight: 400 }}>{t.period}</span>
                                </div>
                                <div style={{ fontSize: 10, color: C.dim, marginTop: 3 }}>{t.range}</div>
                            </div>

                            <div style={{ fontSize: 11, color: C.dim, marginBottom: 18, lineHeight: 1.6 }}>{t.desc}</div>

                            {/* CTA */}
                            <button
                                onClick={() => !isCurrent && !isLoading && handleCTA(t)}
                                disabled={isCurrent || isLoading}
                                style={{
                                    ...S.btn(isCurrent ? "" : "gold"),
                                    marginBottom: 18,
                                    width: "100%",
                                    padding: "9px 14px",
                                    fontSize: 10,
                                    background: isCurrent ? "transparent" : t.recommended ? C.gold : "transparent",
                                    color: isCurrent ? C.dim : t.recommended ? C.bg : t.color,
                                    borderColor: isCurrent ? C.border : t.color,
                                    opacity: isLoading ? 0.6 : 1,
                                    cursor: isCurrent ? "default" : "pointer",
                                }}
                            >
                                {isLoading ? "Processing…" : isCurrent ? "✓ Active Plan" : t.cta}
                            </button>

                            {/* Features */}
                            <ul style={{ margin: 0, padding: 0, listStyle: "none", flex: 1 }}>
                                {t.features.map(f => (
                                    <li key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                                        <span style={{ color: t.color, fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
                                        <span style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Data marketplace note */}
            <div style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 18 }}>📊</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 2 }}>Data Marketplace — 15% Passthrough</div>
                    <div style={{ fontSize: 11, color: C.dim }}>For users without existing ATTOM, CoStar, or Anthropic licenses. High-volume data fetches and inferences billed at cost + 15% markup. No seat charge — pure usage-based.</div>
                </div>
                <button style={{ ...S.btn(), fontSize: 9, whiteSpace: "nowrap" }} onClick={() => window.open("mailto:enterprise@axiom-os.com?subject=Data%20Marketplace%20Inquiry", "_blank")}>
                    Learn More
                </button>
            </div>

            {/* Active subscription management */}
            {profile?.stripe_customer_id && current !== "boutique" && (
                <div style={{ textAlign: "center" }}>
                    <button style={{ ...S.btn(), fontSize: 10 }} onClick={handleManage} disabled={loading === "portal"}>
                        {loading === "portal" ? "Opening portal…" : "Manage Subscription & Invoices →"}
                    </button>
                </div>
            )}

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: 28, fontSize: 10, color: C.dim, lineHeight: 1.8 }}>
                All plans include 256-bit encryption, SOC2-aligned data handling, and dedicated uptime SLAs.<br />
                The ROI case is simple: Axiom saves 15 hrs/analyst/week — ~$75K/yr per seat. A $60K/yr contract pays for itself immediately.<br />
                <span style={{ color: C.gold }}>enterprise@axiom-os.com</span> · Axiom OS by Juniper Rose Investments & Holdings · Sarasota, FL
            </div>
        </div>
    );
}
