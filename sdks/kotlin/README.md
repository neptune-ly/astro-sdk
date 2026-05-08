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
| `astro.payments` | Create/list/cancel sessions, mandates |
| `astro.alias` | Get profile, linked accounts, deactivate |
| `astro.openBanking` | Consents, token exchange, accounts, transactions |
| `astro.identity` | Resolve alias, list banks |
| `WebhookVerifier` | HMAC-SHA256 signature verification |
| `WebhookReceiver` | Event-based webhook dispatcher |

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
