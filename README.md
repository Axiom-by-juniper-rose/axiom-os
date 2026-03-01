# AxiomOS

**AI-Powered Real Estate Development Intelligence Platform**

Built for SMB land developers managing 2–20 deals annually. AxiomOS handles deal underwriting, permit tracking, jurisdiction intelligence, IC memo generation, and investor reporting — all in one platform.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Billing | Stripe (Checkout + Webhooks) |
| Hosting | Vercel |
| Auth | Supabase Auth |

---

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_STRIPE_* price IDs

# 3. Run dev server
npm run dev
```

---

## Environment Variables

Set these in Vercel dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PRO_PRICE_ID=price_xxx
VITE_STRIPE_PRO_PLUS_PRICE_ID=price_xxx
VITE_STRIPE_ENTERPRISE_PRICE_ID=price_xxx
```

Set these in Supabase dashboard → Edge Functions → Secrets:

```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
APP_URL=https://your-app.vercel.app
```

---

## Supabase Edge Functions

| Function | Purpose | JWT |
|----------|---------|-----|
| `stripe-checkout` | Create checkout sessions + billing portal | Required |
| `stripe-webhook` | Handle Stripe payment events | None (Stripe signature) |

### Deploy edge functions

```bash
npx supabase functions deploy stripe-checkout --project-ref your-project-ref
npx supabase functions deploy stripe-webhook --project-ref your-project-ref
```

### Stripe Webhook Setup

In Stripe dashboard → Webhooks → Add endpoint:
- URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

---

## Subscription Tiers

| Tier | Price | Features |
|------|-------|---------|
| FREE | $0 | 1 project, basic underwriting |
| PRO | $29/mo | 5 projects, MLS comps, exports |
| PRO+ | $99/mo | Unlimited projects, AI agents, IC Memo |
| ENTERPRISE | $499/mo | White-label, API access, priority support |

---

## Database

22-table PostgreSQL schema with row-level security. Full migration in `supabase/migrations/`.

Core tables: `projects`, `site_data`, `financial_models`, `deals`, `comps`, `site_tasks`, `permits`, `risks`, `user_profiles`, `subscription_events`

---

## Deployment

Vercel auto-deploys on every push to `main`. See `.github/workflows/deploy.yml`.

```bash
# Manual deploy
npm run build
vercel deploy --prod --prebuilt
```

---

## Priority Markets

Florida · Texas · Georgia · North Carolina · Arizona · Tennessee · Colorado

---

## License

Private — All rights reserved.
