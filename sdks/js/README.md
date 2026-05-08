# @neptune.fintech/astro-sdk

Official JavaScript / TypeScript SDK for Astro, Neptune's OpenWave-compliant gateway.

Works in **Node.js**, **Deno**, and the **browser** (uses native `fetch` + `crypto.subtle`).

Use this SDK from trusted server-side code for payment sessions, subscription mandates, Open Banking token exchange, identity administration, and webhook verification.

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
})

console.log(session.checkout_url) // redirect customer here
```

## Modules

| Module | Use it for | Runs where |
|---|---|---|
| `payments` | Checkout sessions, status, cancellation, recurring mandates | Backend |
| `alias` | NPT alias lookup and linked account visibility | Backend or trusted internal tools |
| `openBanking` | Consent creation, PKCE token exchange, accounts/balances/transactions | Backend |
| `identity` | Registry-backed alias resolution and bank-vouched claims | Backend or bank integration |
| `webhooks` | Signature verification and event dispatch | Backend webhook endpoint |

### `astro.payments`

```ts
// Create session
const session = await astro.payments.createSession({ ... })

// Get status
const status = await astro.payments.getSession(session.session_id)

// List sessions
const { sessions } = await astro.payments.listSessions({ status: 'COMPLETED' })

// Recurring mandate
const mandate = await astro.payments.createMandate({ ... })
await astro.payments.chargeMandate(mandate.mandate_id, { amount: 5000 })
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
  await fulfillOrder(reference)
})

receiver.on('payment.failed', async (payload) => {
  console.error('Payment failed:', payload.data)
})

// In your HTTP handler:
await receiver.handle(rawBodyString, req.headers['x-openwave-signature'])
```

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
