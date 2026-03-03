# Axiom OS — SAML 2.0 SSO Integration Runbook

> **Status:** Production-Ready via Supabase Auth SAML  
> **Supports:** Okta · Azure AD · Google Workspace · PingFederate · Auth0

---

## Overview

Axiom OS uses Supabase's native SAML 2.0 support to enable Single Sign-On for Enterprise customers. Once configured, users authenticate via their corporate Identity Provider (IdP) and Supabase issues a JWT for session management — no credentials are ever stored in the Axiom DB.

---

## Step 1: Enable SAML in Supabase Dashboard

1. Navigate to: **Supabase Dashboard → Authentication → Providers → SAML 2.0**
2. Click **"Enable SAML 2.0"**
3. Note down the **SP Entity ID** and **ACS (Assertion Consumer Service) URL**

These values will be needed when configuring your IdP.

```
SP Entity ID:   https://ubdhpacoqmlxudcvhyuu.supabase.co/auth/v1/sso/saml/<provider-id>
ACS URL:        https://ubdhpacoqmlxudcvhyuu.supabase.co/auth/v1/sso/saml/<provider-id>/acs
```

---

## Step 2: Configure Your Identity Provider

### Okta

1. Go to **Applications → Create App Integration → SAML 2.0**
2. Fill in:
   - **Single Sign On URL (ACS URL):** Copy from Supabase
   - **Audience URI (Entity ID):** Copy from Supabase
   - **Name ID Format:** `EmailAddress`
   - **Application username:** Email
3. In **Attribute Statements**, map:

   | Attribute Name | Value |
   |---|---|
   | `email` | `user.email` |
   | `first_name` | `user.firstName` |
   | `last_name` | `user.lastName` |

4. Download the **Identity Provider Metadata XML**

### Azure Active Directory

1. In Azure Portal → **Enterprise Applications → New Application → Create your own application**
2. Select **"Integrate any other application you don't find in the gallery"**
3. Go to **Single Sign-On → SAML**
4. Set:
   - **Identifier (Entity ID):** Paste from Supabase
   - **Reply URL (ACS URL):** Paste from Supabase
5. Download **Federation Metadata XML**

### Google Workspace

1. Go to **Admin Console → Apps → Web and Mobile Apps → Add App → Add custom SAML app**
2. On "Google Identity Provider details" page, download the **IdP metadata XML**
3. Set:
   - **ACS URL:** Paste from Supabase
   - **Entity ID:** Paste from Supabase
4. Map attribute: `email` → Basic info → Primary email

---

## Step 3: Register the IdP in Supabase

Using the Supabase CLI:

```bash
npx supabase sso add \
  --type saml \
  --metadata-file /path/to/idp-metadata.xml \
  --project-ref ubdhpacoqmlxudcvhyuu
```

Or via Management API:

```bash
curl -X POST 'https://api.supabase.com/v1/projects/ubdhpacoqmlxudcvhyuu/config/auth/sso/providers' \
  -H 'Authorization: Bearer <supabase-management-token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "saml",
    "metadata_xml": "...paste full XML here..."
  }'
```

---

## Step 4: Frontend SSO Login Flow

In `AuthContext.tsx` or the login component, initiate the SAML flow:

```typescript
import { supabase } from '../lib/supabaseClient';

const initiateSSO = async (domain: string) => {
  const { data, error } = await supabase.auth.signInWithSSO({
    domain, // e.g., 'yourcompany.com'
  });

  if (error) throw error;
  if (data.url) {
    // Redirect to IdP login page
    window.location.href = data.url;
  }
};
```

Add a "Sign in with SSO" button to the login form that collects the corporate email domain and calls `initiateSSO`.

---

## Step 5: Role Mapping (Enterprise Authorization)

After SSO login, map IdP group attributes to Axiom roles via Supabase Edge Function hook:

```typescript
// In an auth hook Edge Function (auth-role-sync)
const { user } = payload;
const domain = user.email.split('@')[1];

// Map corporate domains to enterprise roles
const TENANT_MAP: Record<string, string> = {
  'acmecapital.com': 'enterprise_admin',
  'partner.acmecapital.com': 'enterprise_user',
};

const role = TENANT_MAP[domain] || 'free';
await supabase.from('profiles').upsert({ id: user.id, role });
```

---

## Step 6: Test the Integration

```bash
# Verify the SAML provider was registered
npx supabase sso list --project-ref ubdhpacoqmlxudcvhyuu

# Test auth endpoint
curl "https://ubdhpacoqmlxudcvhyuu.supabase.co/auth/v1/sso?domain=yourcompany.com"
# Expected: 302 → IdP login page
```

---

## Supported Enterprise Scenarios

| Use Case | Configuration |
|---|---|
| Single tenant (all users from one company) | One SSO provider mapped to `enterprise_admin` role |
| Multi-tenant (PE firm with multiple LPs) | Multiple SSO providers, each mapped to a tenant ID |
| Mixed (SSO + email fallback) | Both SAML and email/password providers enabled |
| Read-only LP investor access | SSO + custom `viewer` role with restricted RLS policies |

---

## Security Considerations

- **Always verify** the IdP metadata XML signature before registering
- **Enable RLS** on all Supabase tables before enabling SSO
- **Log all SSO events** via the `security-log-event` Edge Function
- **Token rotation:** Supabase JWTs expire in 1 hour by default — configure refresh in `AuthContext`

---

*Last updated: 2026-03-03 · Axiom OS Enterprise Security Team*
