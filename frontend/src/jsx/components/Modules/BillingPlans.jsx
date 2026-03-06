import React, { useState, useEffect } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Card } from '../UI/Card';
// BUG-H3 fix: wire real Stripe checkout via the existing stripe-checkout Edge Function.
// Previously, clicking "Upgrade" only wrote to localStorage with no payment.
import { supabase } from '../../../lib/supabase';

// Stripe price IDs — keep in sync with Stripe dashboard
const PRICE_IDS = {
    pro: "price_H5ggYwtDq4fbrJ",           // Pro $29/mo
    pro_plus: "price_1Pk_Axiom_ProPlus",    // Pro+ $99/mo (update if different in Stripe)
};

export default function BillingPlans() {
    const [current, setCurrent] = useLS("axiom_tier", "free");
    const [loading, setLoading] = useState(null); // tier id being processed
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);

    // Load Stripe customer ID from the user's Supabase profile
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            supabase
                .from("user_profiles")
                .select("stripe_customer_id, subscription_tier, stripe_current_period_end")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    if (data) {
                        setProfile(data);
                        // Sync local tier state with DB record (normalize enum to lowercase)
                        if (data.subscription_tier) setCurrent(data.subscription_tier.toLowerCase());
                    }
                });
        });
    }, []);

    const handleUpgrade = async (tier) => {
        setError(null);
        setLoading(tier.id);
        try {
            const { data, error: fnError } = await supabase.functions.invoke("stripe-checkout", {
                body: {
                    action: "create_checkout",
                    price_id: PRICE_IDS[tier.id],
                    customerId: profile?.stripe_customer_id || undefined,
                },
            });
            if (fnError) throw new Error(fnError.message);
            if (!data?.url) throw new Error("No checkout URL returned.");
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    const handleManage = async () => {
        setError(null);
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
            if (!data?.url) throw new Error("No portal URL returned.");
            window.location.href = data.url;
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(null);
        }
    };

    const tiers = [
        {
            id: "free", name: "Free", price: 0,
            desc: "For individuals exploring the market.",
            features: ["5 Active Deals", "Basic Mortgage Calculator", "Market Data (limited)", "1 Agent session"],
        },
        {
            id: "pro", name: "Pro", price: 29,
            desc: "For serious investors building a portfolio.",
            features: ["Unlimited Deals", "All 9 Calculators", "Full Market Intelligence", "Unlimited AI Agent usage", "Neural Network scoring"],
            recommended: true,
        },
        {
            id: "pro_plus", name: "Pro+", price: 99,
            desc: "For agencies and teams scaling up.",
            features: ["Everything in Pro", "Team Collaboration", "White-label reports", "Priority support", "Custom integrations"],
        },
    ];

    return (
        <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 3, textTransform: "uppercase" }}>Pricing</div>
                <div style={{ fontSize: 25, color: C.text, fontWeight: 700, marginTop: 4 }}>Choose your plan</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 6 }}>Billed monthly · Cancel anytime · Secured by Stripe</div>
            </div>

            {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: 4, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.red }}>
                    ⚠ {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {tiers.map(t => {
                    const isCurrent = current === t.id;
                    const isLoading = loading === t.id;
                    return (
                        <div key={t.id} style={{
                            background: C.bg3, border: `1px solid ${t.recommended ? C.gold : C.border}`,
                            borderRadius: 4, padding: 20, position: "relative", display: "flex", flexDirection: "column"
                        }}>
                            {t.recommended && (
                                <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.gold, color: C.bg, fontSize: 8, fontWeight: 700, letterSpacing: 2, padding: "2px 10px", borderRadius: 10, textTransform: "uppercase" }}>
                                    Most Popular
                                </div>
                            )}
                            <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{t.desc}</div>
                            <div style={{ marginTop: 12 }}>
                                <span style={{ fontSize: 32, color: C.gold, fontWeight: 700 }}>${t.price}</span>
                                <span style={{ fontSize: 12, color: C.dim }}>/mo</span>
                            </div>
                            <ul style={{ margin: "14px 0", padding: "0 0 0 16px", flex: 1 }}>
                                {t.features.map(f => (
                                    <li key={f} style={{ fontSize: 11, color: C.sub, marginBottom: 5 }}>{f}</li>
                                ))}
                            </ul>
                            {t.id === "free" ? (
                                <button style={{ ...S.btn(isCurrent ? "" : "gold"), marginTop: 6, width: "100%", opacity: 0.7, cursor: "not-allowed" }} disabled>
                                    {isCurrent ? "Current Plan" : "Free"}
                                </button>
                            ) : (
                                <button
                                    style={{ ...S.btn(isCurrent ? "" : "gold"), marginTop: 6, width: "100%", opacity: isLoading ? 0.6 : 1 }}
                                    disabled={isCurrent || isLoading}
                                    onClick={() => handleUpgrade(t)}
                                >
                                    {isLoading ? "Redirecting…" : isCurrent ? "Current Plan" : `Upgrade to ${t.name}`}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Billing portal link for paying subscribers */}
            {current !== "free" && profile?.stripe_customer_id && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                        style={{ ...S.btn(), fontSize: 10 }}
                        onClick={handleManage}
                        disabled={loading === "portal"}
                    >
                        {loading === "portal" ? "Opening portal…" : "Manage Subscription & Invoices"}
                    </button>
                </div>
            )}
        </div>
    );
}
