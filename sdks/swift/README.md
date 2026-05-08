# AstroSDK — OpenWave Swift SDK

Swift SDK for OpenWave-compatible payment gateways. Requires iOS 15+ / macOS 12+. Uses Swift Concurrency (`async/await`) and `CryptoKit`.

## Installation (Swift Package Manager)

```swift
// Package.swift
dependencies: [
    .package(url: "https://github.com/neptune-astro/astro-swift", from: "1.0.0")
]
```

Or in Xcode: **File → Add Package Dependencies** → paste the repo URL.

## Quick Start

```swift
import AstroSDK

let astro = AstroClient(config: AstroConfig(
    baseURL: URL(string: "https://astro.neptune.ly/api/v1")!,
    merchantKey: ProcessInfo.processInfo.environment["ASTRO_KEY"]
))

// Create a payment session
let session = try await astro.payments.createSession(
    CreateSessionRequest(
        amount: 50_000,   // 50.000 LYD
        currency: "LYD",
        destination: Destination(type: "alias", value: "mtellesy"),
        reference: "order_1042",
        redirectUrl: "myapp://payment/result"
    )
)

// Open checkout URL in Safari / SFSafariViewController
let url = URL(string: session.checkoutUrl)!
await UIApplication.shared.open(url)
```

## Modules

| Property | Type | Description |
|---|---|---|
| `astro.payments` | `PaymentsClient` | Sessions, mandates |
| `astro.alias` | `AliasClient` | Profile, accounts, resolve |
| `astro.openBanking` | `OpenBankingClient` | Consent, token, accounts, transactions |
| `astro.identity` | `IdentityClient` | Resolve alias, list banks |
| `astro.webhookVerifier(secret:)` | `WebhookVerifier` | HMAC-SHA256 verification |

## Payment Result Handling (Deep Link)

```swift
// In SceneDelegate or @main App
func scene(_ scene: UIScene, openURLContexts urlContexts: Set<UIOpenURLContext>) {
    guard let url = urlContexts.first?.url,
          url.scheme == "myapp", url.host == "payment" else { return }
    let params = URLComponents(url: url, resolvingAgainstBaseURL: false)?
        .queryItems?.reduce(into: [String: String]()) { $0[$1.name] = $1.value }
    if params?["status"] == "completed" {
        // Notify order manager
    }
}
```

## Open Banking

```swift
// 1. Create consent
let consent = try await astro.openBanking.createConsent(
    bankHandle: "andalus",
    scopes: ["accounts:read", "transactions:read"],
    redirectUri: "myapp://ob/callback",
    state: UUID().uuidString,
    codeChallenge: pkce.challenge
)

// 2. Open consentUrl, handle redirect, exchange code
let tokens = try await astro.openBanking.exchangeCode(
    code: callbackCode,
    redirectUri: "myapp://ob/callback",
    consentId: consent.consentId,
    codeVerifier: pkce.verifier
)

// 3. Fetch data
let accounts = try await astro.openBanking.getAccounts(
    accessToken: tokens.accessToken,
    consentId: consent.consentId
)
```

## Webhook Verification (Server-Side Swift / Vapor)

```swift
let verifier = astro.webhookVerifier(secret: ProcessInfo.processInfo.environment["WEBHOOK_SECRET"]!)

// In Vapor route:
app.post("webhooks", "astro") { req async throws -> Response in
    let body = req.body.string ?? ""
    let sig = req.headers.first(name: "X-OpenWave-Signature") ?? ""
    try verifier.handle(rawBody: body, signature: sig, handlers: [
        "payment.completed": { payload in
            let ref = (payload["data"] as? [String: Any])?["reference"] as? String
            await db.markPaid(ref)
        }
    ])
    return Response(status: .ok)
}
```

## Error Handling

```swift
do {
    let session = try await astro.payments.createSession(...)
} catch let error as AstroError {
    print("\(error.statusCode): [\(error.code)] \(error.localizedDescription)")
}
```

## License

UNLICENSED — Neptune Fintech internal SDK
