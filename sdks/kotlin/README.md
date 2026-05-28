# @neptune-astro/kotlin — OpenWave Kotlin SDK

Kotlin/JVM SDK for OpenWave-compatible payment gateways. Uses Ktor HTTP client with coroutines.

## Installation

```kotlin
// build.gradle.kts
dependencies {
    implementation("ly.neptune.astro:astro-kotlin:1.0.0")
}
```

## Quick Start

```kotlin
import ly.neptune.astro.*
import kotlinx.coroutines.runBlocking

val astro = astroClient {
    baseUrl = "https://astro.neptune.ly/api/v1"
    merchantKey = System.getenv("ASTRO_MERCHANT_KEY")
}

runBlocking {
    // Create a payment session
    val session = astro.payments.createSession(
        CreateSessionRequest(
            amount = 50_000,   // 50.000 LYD
            currency = "LYD",
            destination = Destination(type = "alias", value = "mtellesy"),
            reference = "order_1042",
            redirectUrl = "https://myapp.com/result"
        )
    )
    println("Checkout URL: ${session.checkoutUrl}")

    // Resolve an alias
    val resolved = astro.identity.resolve("mtellesy")
    println("Routes to bank: ${resolved.bankHandle}")
}

astro.close()
```

## Modules

| Module | Description |
|---|---|
| `astro.payments` | Create/list/cancel sessions, refunds, mandates, and mandate charges |
| `astro.alias` | Get profile, linked accounts, deactivate |
| `astro.openBanking` | Consents, token exchange, accounts, transactions |
| `astro.identity` | Resolve alias, list banks |
| `WebhookVerifier` | HMAC-SHA256 signature verification |
| `WebhookReceiver` | Event-based webhook dispatcher |

## Presented Payments

The Kotlin SDK is appropriate for:

- backend presentment creation and status polling
- Android bank-app or wallet-app flows that resume after QR or NFC claim
- direct operator implementations that still need to preserve OpenWave authorization boundaries

Presented payments remain a channel layer. After claim, Astro returns `payment_url`, `mandate_consent_url`, or `auth_surface`; open that secure hosted, SDK-controlled, or bank-controlled surface and reuse the standard payment or mandate lifecycle rather than inventing a separate authorization path.

OpenWave QR is not a separate proprietary barcode. Use the returned EMV TLV payload. Libya deployments should detect `LY.OPENWAVE` inside Merchant Account Information tag `26` by default, read `presentment_id` from sub-tag `01`, claim token from sub-tag `02`, channel from sub-tag `03`, and payment/mandate intent from sub-tag `04`. If that GUI is absent, keep the existing domestic QR route. NFC uses an NDEF URI, normally an HTTPS app/universal link.

For recurring mandate approval, expect `auth_surface.type = "HOSTED_MANDATE_CONSENT"` or a `mandate_consent_url`.

Merchant apps must not collect OTP, PIN, passcode, push approval, or bank credentials.

```kotlin
val presentment = astro.presentments.create(
    CreatePresentmentRequest(
        channel = "QR",
        mode = "MERCHANT_PRESENTED",
        intent = "ONE_TIME_PAYMENT",
        amountMode = "FIXED",
        amount = 860_000,
        currency = "LYD",
        description = "Neptune Store checkout"
    ),
    idempotencyKey = "pos-order-1042"
)

val claim = astro.presentments.claim(
    presentment.presentmentId,
    ClaimPresentmentRequest(
        claimToken = presentment.presentmentPayload?.claimToken,
        payerAlias = "tellesy@andalus"
    )
)
println("Open secure auth surface: ${claim.authSurface?.url ?: claim.paymentUrl}")
```

## Refunds and recurring charges

```kotlin
astro.payments.createRefund(
    sessionId = session.sessionId,
    request = CreateRefundRequest(
        amount = 20_000,
        currency = "LYD",
        merchantReference = "refund-order-1042-item-1",
        reason = "Customer returned one item"
    ),
    idempotencyKey = "refund-order-1042-item-1"
)

val mandate = astro.payments.createMandate(
    CreateMandateRequest(
        payerAlias = "tellesy@andalus",
        amountLimit = 50_000,
        currency = "LYD",
        frequency = "MONTHLY",
        description = "Premium support plan",
        consentRedirectUrl = "https://merchant.example/subscription/return"
    ),
    idempotencyKey = "sub-1042"
)

astro.payments.chargeMandate(
    mandate.mandateId,
    ChargeMandateRequest(amount = 50_000, description = "Premium support monthly charge"),
    idempotencyKey = "sub-1042-2026-05"
)
```

Fulfil orders only from a trusted backend after a signed `payment.completed` webhook or final server status confirms completion. Frontend redirects and `payment.settlement_pending` are customer experience signals, not fulfilment evidence.

## Webhook Handler (Ktor server)

```kotlin
val receiver = WebhookReceiver(secret = System.getenv("ASTRO_WEBHOOK_SECRET"))

receiver
    .on("payment.completed") { payload ->
        val obj = payload as JsonObject
        val ref = obj["data"]?.jsonObject?.get("reference")?.jsonPrimitive?.content
        db.orders.markPaid(ref)
    }
    .on("payment.failed") { payload ->
        // handle failure
    }

// In your route handler
post("/webhooks/astro") {
    val body = call.receiveText()
    val sig = call.request.headers["X-OpenWave-Signature"] ?: return@post call.respond(400)
    receiver.handle(body, sig)
    call.respond(HttpStatusCode.OK)
}
```

## Error Handling

```kotlin
try {
    val session = astro.payments.createSession(...)
} catch (e: AstroRequestException) {
    println("Error ${e.status}: [${e.code}] ${e.message}")
    println("Request ID: ${e.requestId}")
}
```

## Open Banking

```kotlin
// 1. Create consent (bank admin key required)
val consent = astro.openBanking.createConsent(
    CreateConsentRequest(
        bankHandle = "andalus",
        scopes = listOf("accounts:read", "transactions:read"),
        redirectUri = "https://myapp.com/ob/callback",
        state = generateState(),
        codeChallenge = pkce.challenge
    )
)
// Redirect user to consent.consentUrl

// 2. Exchange code after redirect
val tokens = astro.openBanking.exchangeCode(
    code = params["code"]!!, redirectUri = "...", consentId = consent.consentId, codeVerifier = pkce.verifier
)

// 3. Fetch data
val accounts = astro.openBanking.getAccounts(tokens.accessToken, consent.consentId)
val txns = astro.openBanking.getTransactions(tokens.accessToken, consent.consentId, accounts[0].accountId)
```

## License

UNLICENSED — Neptune Fintech internal SDK
