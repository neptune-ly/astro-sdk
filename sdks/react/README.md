# @neptune.fintech/astro-react

React SDK for Neptune. Astro secure checkout surfaces.

Use React when you want the official hosted or secure embedded OpenWave payment experience inside a React app without moving authorization into merchant-owned UI.

## Install

```bash
npm install @neptune.fintech/astro-react
```

## Typical use

- one-time checkout from a server-created session
- recurring mandate approval from a hosted consent session
- presented-payment claim results that return into your React app after scan or tap

## Checkout example

```tsx
import {
  AstroProvider,
  CheckoutButton,
  usePaymentSession,
  useCheckout,
} from '@neptune.fintech/astro-react'

function PayButton({ sessionId }: { sessionId: string }) {
  const { session, refresh } = usePaymentSession(sessionId)
  const checkout = useCheckout()

  return (
    <CheckoutButton
      sessionId={sessionId}
      status={session?.status}
      onClick={() => checkout.open({ sessionId })}
      onComplete={refresh}
    >
      Pay securely with OpenWave
    </CheckoutButton>
  )
}

export function App() {
  return (
    <AstroProvider baseUrl="https://astro.neptune.ly/api/v1">
      <PayButton sessionId="ps_..." />
    </AstroProvider>
  )
}
```

## Presented Payments

React is appropriate for the merchant or wallet app shell around a presented-payment flow:

1. Your backend creates the presentment.
2. Your React app renders the QR or starts the NFC handoff.
3. The customer scans or taps.
4. The secure hosted or SDK-controlled authorization surface takes over.
5. Your React app receives the final redirect or callback state.

React should only receive or render final redirect/callback state after the hosted or SDK-controlled auth surface completes. React must not collect OTP, PIN, passcode, push approval, or bank credentials directly.

For QR, render the OpenWave EMV payload returned by the backend. In Libya that payload stays compatible with the NUMO QR container: scanners route to OpenWave only when tag `26` or another operator-approved Merchant Account Information template contains `00 = LY.OPENWAVE`. Operator metadata belongs in the optional tag `50` template, not in NUMO `62-*` reference fields.

For recurring mandate approval, expect `auth_surface.type = "HOSTED_MANDATE_CONSENT"` or a `mandate_consent_url`.

Fulfilment must happen on your backend after a signed `payment.completed` webhook or final server status confirms completion. Do not ship goods or activate subscriptions from a browser callback or `payment.settlement_pending`.
