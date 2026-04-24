# astro_sdk — Astro Flutter/Dart SDK

Flutter/Dart SDK for OpenWave/Astro payments. Works in Flutter apps, pure Dart backend, and Dart CLI.

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
| `astro.payments` | `createSession`, `getSession`, `cancelSession`, `listSessions`, `createMandate` |
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
