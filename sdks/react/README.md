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

## Presented Payments

React is appropriate for the merchant or wallet app shell around a presented-payment flow:

1. Your backend creates the presentment.
2. Your React app renders the QR or starts the NFC handoff.
3. The customer scans or taps.
4. The secure hosted or SDK-controlled authorization surface takes over.
5. Your React app receives the final redirect or callback state.

React must not collect OTP, PIN, or push-approval data directly.
