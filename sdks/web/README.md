# @neptune.fintech/astro-web

Drop-in checkout widget for **Astro**, Neptune's OpenWave gateway. One function call opens a secure, branded, mobile-responsive authorization surface for one-time payments.

The widget only receives a scoped `sessionId`. Your backend owns session creation, merchant keys, webhook verification, and fulfilment.

## Usage

### Via CDN (script tag)

```html
<script src="https://cdn.neptune.ly/astro/v1/astro.umd.js"></script>
<script>
  Astro.checkout({
    sessionId: 'ops_01HZGV...',     // created by your backend
    gatewayUrl: 'https://astro.neptune.ly',
    onSuccess: (e) => {
      console.log('Paid!', e.session_id)
      window.location.href = '/orders/success'
    },
    onFailed: (e) => {
      alert('Payment failed: ' + e.message)
    },
    onDismiss: () => {
      console.log('Customer closed the widget')
    },
  })
</script>
```

### Via npm

```bash
npm install @neptune.fintech/astro-web
```

```ts
import { checkout } from '@neptune.fintech/astro-web'

checkout({
  sessionId: 'ops_01HZGV...',
  gatewayUrl: 'https://astro.neptune.ly',
  theme: 'auto',          // 'light' | 'dark' | 'auto'
  locale: 'en',           // 'en' | 'ar'
  onSuccess: (e) => redirect(e.receipt_url!),
  onFailed: (e) => showError(e.message),
})
```

## How It Works

1. **Your backend** creates a payment session via `POST /payments/initiate` and returns the `session_id` to your frontend
2. **You call `checkout({ sessionId })`** — the widget opens
3. **Customer enters their NPT alias or IBAN** — Astro resolves it with the gateway and identity registry
4. **Customer authenticates with bank SCA** — OTP or push approval is handled in the hosted surface
5. **Payment completes** — `onSuccess` fires and Astro sends a signed webhook to your backend

## Flow Diagram

```
Your page                  Widget                    Astro Gateway
    │                        │                             │
    │─ checkout({sessionId}) ┤                             │
    │                        │── POST /sessions/{id}/initiate ──►│
    │                        │◄── { amount, currency } ────│
    │                        │                             │
    │              [OTP input]│                             │
    │                        │── POST /sessions/{id}/confirm ───►│
    │                        │◄── { status: COMPLETED } ───│
    │◄── onSuccess(event) ───┤                             │
```

## Options

| Option | Type | Required | Description |
|---|---|:---:|---|
| `sessionId` | `string` | ✅ | Payment session ID from your backend |
| `gatewayUrl` | `string` | | Gateway base URL (default: empty — uses relative) |
| `theme` | `'light' \| 'dark' \| 'auto'` | | Widget theme (default: `auto`) |
| `locale` | `'en' \| 'ar'` | | Language (default: `en`) |
| `onSuccess` | `function` | | Called when payment completes |
| `onFailed` | `function` | | Called when payment fails or is rejected |
| `onDismiss` | `function` | | Called when customer closes the widget |

## Security

- **Never put API keys in the frontend** — the widget uses only the `session_id` (not sensitive)
- Session IDs are single-use and expire after 15 minutes
- All gateway communication is HTTPS
- Use your backend webhook as the source of truth for order fulfilment

## Presented Payments

The web drop-in is also the correct authorization surface after a QR or NFC presentment is claimed. Your merchant page may display a QR code or expose an NFC handoff, but once the customer claims that presentment the claim-returned hosted URL, secure session, or SDK sheet owns the SCA step.

QR rendering should use the operator-returned `qr_payload.value` when available. For Libya interoperability this value is an EMV/NUMO-compatible TLV payload with the OpenWave template in tag `26` and optional operator metadata in tag `50`; do not invent a second merchant QR format in the browser. NFC handoff should use an NDEF URI or universal/app link that resolves to the same presentment claim.

For recurring subscriptions, presentment may start the mandate approval flow. The claim response should use `auth_surface.type = "HOSTED_MANDATE_CONSENT"` or return `mandate_consent_url`, and the customer still sees the full mandate scope, amount rules, and frequency before approving with bank OTP or push.

Merchant pages must not render OTP, PIN, passcode, push approval, or bank credential inputs for bank authorization.

Fulfilment must happen on your backend after a signed `payment.completed` webhook or final server status confirms completion. Do not ship goods or activate subscriptions from a browser callback or `payment.settlement_pending`.

## License

UNLICENSED — Copyright © Neptune Fintech
