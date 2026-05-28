# astro_sdk — OpenWave Flutter/Dart SDK

Flutter/Dart SDK for OpenWave payments. Works in Flutter apps, pure Dart backend, and Dart CLI.

## Installation

```yaml
# pubspec.yaml
dependencies:
  astro_sdk:
    path: ../packages/astro-flutter  # local
    # OR once published:
    # astro_sdk: ^1.0.0
```

## Quick Start

```dart
import 'package:astro_sdk/astro_sdk.dart';

final astro = AstroClient(AstroConfig(
  baseUrl: 'https://astro.neptune.ly/api/v1',
  merchantKey: const String.fromEnvironment('ASTRO_KEY'),
));

// Create a payment session
final session = await astro.payments.createSession(
  amount: 50000,          // 50.000 LYD
  currency: 'LYD',
  destination: Destination(type: 'alias', value: 'mtellesy'),
  reference: 'order_1042',
  redirectUrl: 'https://myapp.com/result',
);

print('Checkout URL: ${session.checkoutUrl}');

// Resolve an alias
final resolved = await astro.identity.resolve('mtellesy');
print('Routes to bank: ${resolved.bankHandle}');
```

## Modules

| Client | Methods |
|---|---|
| `astro.payments` | `createSession`, `getSession`, `cancelSession`, `listSessions`, `createRefund`, `listRefunds`, `createMandate`, `chargeMandate`, `listMandateCharges` |
| `astro.alias` | `getProfile`, `getAccounts`, `resolve`, `deactivate` |
| `astro.openBanking` | `createConsent`, `exchangeCode`, `refreshToken`, `getAccounts`, `getTransactions` |
| `astro.identity` | `resolve`, `listBanks`, `getBank` |
| `WebhookVerifier` | `verify`, `parse`, `handleRaw` |

## Flutter Payment Flow

```dart
// 1. On your backend: create session and get session_id
// 2. In Flutter: open checkout URL
final uri = Uri.parse(session.checkoutUrl);
await launchUrl(uri, mode: LaunchMode.externalApplication);

// 3. Handle deep link callback
// AndroidManifest / Info.plist: register your redirect_url scheme
// In your router:
if (uri.path == '/result') {
  final sessionId = uri.queryParameters['session_id'];
  final status = uri.queryParameters['status'];
  if (status == 'completed') {
    // Order fulfilled
  }
}
```

## Presented Payments

Flutter is suitable for bank apps, wallet apps, and merchant apps that need to render QR, start NFC handoff, or resume the flow after a presentment claim.

- For gateway-mediated presentments, create the presentment on your backend and open the returned `payment_url`, `mandate_consent_url`, or `auth_surface`.
- For direct bank or wallet presentments, keep the same OpenWave consent and SCA model inside your controlled app surface.
- For QR scanning in Libya, parse normal EMV/NUMO QR first. Route to OpenWave only when a Merchant Account Information template contains `00 = LY.OPENWAVE`; otherwise keep the existing LYPay/NUMO QR path.

For recurring mandate approval, expect `auth_surface.type = "HOSTED_MANDATE_CONSENT"` or a `mandate_consent_url`.

Do not collect OTP, PIN, passcode, push approval, bank credentials, or approval secrets in custom merchant widgets.

```dart
final presentment = await astro.presentments.create({
  'channel': 'QR',
  'mode': 'MERCHANT_PRESENTED',
  'intent': 'ONE_TIME_PAYMENT',
  'amount_mode': 'FIXED',
  'amount': 860000,
  'currency': 'LYD',
  'description': 'Neptune Store checkout',
}, idempotencyKey: 'pos-order-1042');

final claim = await astro.presentments.claim(presentment.presentmentId, {
  'claim_token': presentment.presentmentPayload?.claimToken,
  'payer_alias': 'tellesy@andalus',
});

await launchUrl(Uri.parse(claim.authSurface?.url ?? claim.paymentUrl!));
```

OpenWave QR uses EMV tag `26` by default. Sub-tags are `00 = LY.OPENWAVE`, `01 = presentment_id`, `02 = claim_token`, `03 = QR`, and `04 = P` or `M`. Optional operator metadata uses tag `50` with `00 = LY.OPENWAVE.OP` and `01 = operator_id`. NFC uses an NDEF URI record, preferably an HTTPS universal/app link that resolves to the same claim flow.

## Refunds and recurring charges

```dart
await astro.payments.createRefund(
  session.sessionId,
  const CreateRefundRequest(
    amount: 20000,
    currency: 'LYD',
    merchantReference: 'refund-order-1042-item-1',
    reason: 'Customer returned one item',
  ),
  idempotencyKey: 'refund-order-1042-item-1',
);

final mandate = await astro.payments.createMandate(
  payerAlias: 'tellesy@andalus',
  amountLimit: 50000,
  currency: 'LYD',
  frequency: 'MONTHLY',
  description: 'Premium support plan',
  consentRedirectUrl: 'myapp://subscription/return',
);

await astro.payments.chargeMandate(
  mandateId: mandate.mandateId,
  amount: 50000,
  description: 'Premium support monthly charge',
  idempotencyKey: 'sub-1042-2026-05',
);
```

Fulfil orders only from your backend after a signed `payment.completed` webhook or final server status confirms completion. Do not fulfil from a mobile callback or `payment.settlement_pending`.

## Webhook Verification (Dart server / edge function)

```dart
final verifier = astro.webhookVerifier(
  const String.fromEnvironment('ASTRO_WEBHOOK_SECRET'),
);

// In your HTTP handler:
final body = await request.body;
final sig = request.headers['x-openwave-signature'] ?? '';

verifier.handleRaw(body, sig, {
  'payment.completed': (payload) {
    final ref = (payload['data'] as Map)['reference'];
    db.markPaid(ref);
  },
  'payment.failed': (payload) {
    // handle failure
  },
});
```

## Open Banking

```dart
// 1. Create consent (bank partner key required)
final consent = await astro.openBanking.createConsent(
  bankHandle: 'andalus',
  scopes: ['accounts:read', 'transactions:read'],
  redirectUri: 'myapp://ob/callback',
  state: generateState(),
  codeChallenge: pkce.challenge,
);

// 2. Open consent URL
await launchUrl(Uri.parse(consent.consentUrl));

// 3. Handle callback deep link, exchange code
final tokens = await astro.openBanking.exchangeCode(
  code: callbackParams['code']!,
  redirectUri: 'myapp://ob/callback',
  consentId: consent.consentId,
  codeVerifier: pkce.verifier,
);

// 4. Fetch accounts and transactions
final accounts = await astro.openBanking.getAccounts(
  tokens.accessToken, consent.consentId,
);
final txns = await astro.openBanking.getTransactions(
  tokens.accessToken, consent.consentId, accounts.first.accountId,
);
```

## Error Handling

```dart
try {
  await astro.payments.createSession(...);
} on AstroError catch (e) {
  print('${e.statusCode}: [${e.code}] ${e.message}');
}
```

## License

UNLICENSED — Neptune Fintech internal SDK
