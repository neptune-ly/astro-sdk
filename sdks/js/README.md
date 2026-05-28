# @neptune.fintech/astro-sdk

Official JavaScript / TypeScript SDK for Astro, Neptune's OpenWave-compliant gateway.

Works in **Node.js**, **Deno**, and the **browser** (uses native `fetch` + `crypto.subtle`).

Use this SDK from trusted server-side code for payment sessions, subscription mandates, Open Banking token exchange, Credit & Finance orchestration targets, identity administration, and webhook verification.

## Install

```bash
npm install @neptune.fintech/astro-sdk
```

## Quick Start

```ts
import { createClient } from '@neptune.fintech/astro-sdk'

const astro = createClient({
  baseUrl: 'https://astro.neptune.ly',
  merchantKey: process.env.OPENWAVE_MERCHANT_KEY,
})

// Create a payment session
const session = await astro.payments.createSession({
  amount: 50000,           // 50.000 LYD (minor units)
  currency: 'LYD',
  destination: { type: 'alias', value: 'mtellesy' },
  description: 'Order #1042',
  reference: 'order_1042',
  redirect_url: 'https://mystore.com/orders/1042/result',
}, {
  idempotencyKey: 'order_1042_create_session',
})

console.log(session.checkout_url) // redirect customer here
```

## Modules

| Module | Use it for | Runs where |
|---|---|---|
| `payments` | Checkout sessions, status, cancellation, recurring mandates | Backend |
| `presentments` | QR/NFC presentment lifecycle and secure claim handoff | Backend |
| `alias` | NPT alias lookup and linked account visibility | Backend or trusted internal tools |
| `openBanking` | Consent creation, PKCE token exchange, accounts/balances/transactions | Backend |
| `finance` | Credit assessment, finance offers, hosted offer acceptance, contracts, repayments | Backend target |
| `identity` | Registry-backed alias resolution and bank-vouched claims | Backend or bank integration |
| `webhooks` | Signature verification and event dispatch | Backend webhook endpoint |

## Presented Payments

Use the backend SDK to create presentments for:

- merchant-presented QR
- merchant-presented NFC
- merchant-presented app handoff
- recurring mandate approval launched from QR or NFC

After claim, Astro returns `payment_url`, `mandate_consent_url`, or `auth_surface`. Merchant apps must open that secure hosted, SDK-controlled, or bank-controlled surface and must not collect OTP, PIN, passcode, push approval, or bank credentials.

When `channel` is `QR`, render the OpenWave EMV QR value returned by the operator. In Libya deployments this is NUMO-compatible EMV TLV with the OpenWave template in tag `26`:

| Tag | Meaning |
|---|---|
| `26.00` | `LY.OPENWAVE` GUI |
| `26.01` | `presentment_id` |
| `26.02` | short-lived claim token or signed reference |
| `26.03` | channel code, normally `QR` |
| `26.04` | intent code, `P` for payment or `M` for mandate approval |
| `50.00` / `50.01` | optional `LY.OPENWAVE.OP` operator template and operator id |

Existing NUMO/LYPay QR codes continue down the existing QR route. A scanner should route to OpenWave only when it finds the `LY.OPENWAVE` GUI inside an EMV Merchant Account Information template.

```ts
const presentment = await astro.presentments.create({
  channel: 'QR',
  mode: 'MERCHANT_PRESENTED',
  intent: 'ONE_TIME_PAYMENT',
  amount_mode: 'FIXED',
  amount: 125_000,
  currency: 'LYD',
  description: 'In-store checkout',
  merchant_reference: 'store-10045',
}, {
  idempotencyKey: 'store-10045-presentment',
})

// Render this as a QR code or NFC URI in your controlled merchant app.
console.log(presentment.presentment_payload.qr_payload?.value ?? presentment.presentment_payload.uri)
```

For subscription approval, create a mandate presentment with a fixed amount limit and frequency. After claim, send the customer to `mandate_consent_url` or `auth_surface.url`; mandate claims should use `auth_surface.type = "HOSTED_MANDATE_CONSENT"`. Astro shows the mandate terms and completes OTP or push authorization before the mandate becomes active.

```ts
const subscription = await astro.presentments.create({
  channel: 'QR',
  mode: 'MERCHANT_PRESENTED',
  intent: 'MANDATE_APPROVAL',
  amount_mode: 'FIXED',
  amount: 50_000,
  currency: 'LYD',
  frequency: 'MONTHLY',
  description: 'Premium support subscription',
  merchant_reference: 'sub-10045',
}, {
  idempotencyKey: 'sub-10045-presentment',
})
```

## Credit & Finance target

When enabled by the Astro deployment, Credit & Finance remains server-side. Your backend requests finance-specific consent, creates assessments and offers, and sends the customer only to the hosted acceptance URL.

```ts
const assessment = await astro.finance.assessments.create({
  consentId,
  purpose: 'BNPL',
  requestedAmount: 860_000,
  currency: 'LYD',
  tenor: { unit: 'MONTH', value: 6 },
  dataWindow: { from: '2025-11-01', to: '2026-05-01' },
  selectedAccountIds: ['acc_01JCR5YSS1QYZYKJ6W9AC4S5C8'],
})

const offer = await astro.finance.offers.create({
  assessmentId: assessment.assessmentId,
  productType: 'BNPL_INSTALLMENT',
  amount: 860_000,
  currency: 'LYD',
  tenor: { unit: 'MONTH', value: 6 },
  financeCost: 0,
  disclosureUrl: 'https://merchant.example/finance/disclosures/order-1042',
  merchantReference: 'order_1042',
})

// Send the customer to the hosted acceptance page. Do not collect finance
// acceptance, bank credentials, OTP, or raw account data inside merchant UI.
console.log(offer.acceptUrl)
```

### `astro.finance`

```ts
const caps = await astro.finance.capabilities()
const assessments = await astro.finance.assessments.list()
const refreshed = await astro.finance.assessments.refresh(assessment.assessmentId)
const createdOffer = await astro.finance.offers.create({ ... })
const contract = await astro.finance.offers.accept(
  createdOffer.offerId,
  createdOffer.acceptanceSessionToken!,
  { customerAcceptedDisclosure: true }
)
const schedule = await astro.finance.contracts.repaymentSchedule(contract.contractId)
```

### `astro.payments`

```ts
// Create session
const session = await astro.payments.createSession({ ... })

// Get status
const status = await astro.payments.getSession(session.session_id)
if (status.status === 'FAILED') {
  console.log(status.error_code, status.error_message)
}

// List sessions
const { sessions } = await astro.payments.listSessions({ status: 'COMPLETED' })

// Refund a completed session
const refund = await astro.payments.createRefund(
  session.session_id,
  {
    amount: 50_000,
    currency: 'LYD',
    reason: 'Customer return',
    merchant_reference: 'refund_order_1042_001',
  },
  { idempotencyKey: `refund_${session.session_id}_001` },
)

// Recurring mandate
const mandate = await astro.payments.createMandate({
  payer_alias: 'mtellesy@andalus',
  amount_limit: 50_000,
  currency: 'LYD',
  frequency: 'MONTHLY',
  description: 'Premium support subscription',
  consent_redirect_url: 'https://store.example/subscription/return',
  merchant_reference: 'sub_1042',
}, {
  idempotencyKey: 'sub_1042_create_mandate',
})
await astro.payments.chargeMandate(
  mandate.mandate_id,
  {
    amount: 50_000,
    description: 'Premium support - May 2026',
    merchant_reference: 'sub_1042_may_2026',
  },
  { idempotencyKey: 'sub_1042_may_2026_charge' },
)
```

### `astro.alias`

```ts
const profile = await astro.alias.get('mtellesy')
const { accounts } = await astro.alias.getAccounts('mtellesy')
```

### `astro.openBanking`

```ts
// Check capabilities
const caps = await astro.openBanking.getBankCapabilities('andalus')

// Create consent (redirect customer to consent_url)
const consent = await astro.openBanking.createConsent({
  bank_handle: 'andalus',
  scopes: ['accounts:read', 'balances:read'],
  redirect_uri: 'https://myapp.com/callback',
  state: 'random_state',
  code_challenge: '...', // PKCE S256
  code_challenge_method: 'S256',
})
// Redirect customer to consent.consent_url.
// Astro shows TPP name, bank, requested scopes, account access, and SCA.

// Exchange code for tokens
const tokens = await astro.openBanking.exchangeCode({
  code: 'AUTH_CODE',
  redirect_uri: 'https://myapp.com/callback',
  consent_id: consent.consent_id,
  code_verifier: '...',
})

// Access data
const { accounts } = await astro.openBanking.getAccounts(consent.consent_id)
const balance = await astro.openBanking.getBalances(accounts[0].account_id, consent.consent_id)
const { transactions } = await astro.openBanking.getTransactions(
  accounts[0].account_id,
  consent.consent_id,
  { fromDate: '2026-01-01', count: 50 }
)
```

### `astro.identity`

```ts
// Public alias resolution (no auth needed)
const resolved = await astro.identity.resolve('mtellesy')
// { iban: 'LY83...', bank_handle: 'andalus', currency: 'LYD' }

// Claim a handle (bank key required)
await astro.identity.claimHandle({
  npt_handle: 'mtellesy',
  iban: 'LY83002700100099900001',
  customer_display_name: 'Mohamed T.',
  bank_customer_ref: 'CUST-001',
})
```

### Webhook Verification

```ts
import { WebhookReceiver } from '@neptune.fintech/astro-sdk'

const receiver = new WebhookReceiver(process.env.WEBHOOK_SECRET!)

receiver.on('payment.completed', async (payload) => {
  const { session_id, reference } = payload.data as any
  const eventId = payload.id ?? payload.event_id
  // Persist eventId before fulfilment so retries stay idempotent.
  await fulfillOrder(reference)
})

receiver.on('payment.failed', async (payload) => {
  console.error('Payment failed:', payload.data)
})

receiver.on('payment.reconciliation_required', async (payload) => {
  // The bank execution result is unknown. Hold fulfilment and escalate to operations.
  await holdOrderForManualReview((payload.data as any).session_id)
})

// In your HTTP handler:
await receiver.handle(rawBodyString, req.headers['x-openwave-signature'])
```

Fulfil only after your backend verifies a signed final event, normally `payment.completed`. Do not fulfil from frontend redirects, mobile callbacks, hosted checkout return states, `payment.settlement_pending`, or `payment.reconciliation_required`.

## Error Handling

```ts
import { AstroRequestError } from '@neptune.fintech/astro-sdk'

try {
  const session = await astro.payments.createSession({ ... })
} catch (err) {
  if (err instanceof AstroRequestError) {
    console.error(err.code)       // 'ALIAS_NOT_FOUND'
    console.error(err.status)     // 404
    console.error(err.requestId)  // for support
  }
}
```

## Amount Convention

All amounts are **integers in minor units**:

```ts
// 500.000 LYD
const amount = 500_000  // NOT 500.0

// Convert for display
const display = (amount / 1000).toFixed(3) + ' LYD'  // "500.000 LYD"
```

## License

UNLICENSED — Copyright © Neptune Fintech
