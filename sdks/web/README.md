# @neptune-astro/web-sdk

Drop-in checkout widget for **OpenWave / Astro** payments. Like Stripe.js — one function call opens a styled, mobile-responsive payment modal.

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
npm install @neptune-astro/web-sdk
```

```ts
import { checkout } from '@neptune-astro/web-sdk'

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

1. **Your backend** creates a payment session via `POST /payments/sessions` and returns the `session_id` to your frontend
2. **You call `checkout({ sessionId })`** — the widget opens
3. **Customer enters their NPT alias or IBAN** — widget verifies it with the gateway
4. **Customer enters OTP** — sent to their registered phone by their bank
5. **Payment completes** — `onSuccess` fires with the session details

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

## License

UNLICENSED — Copyright © Neptune Fintech
