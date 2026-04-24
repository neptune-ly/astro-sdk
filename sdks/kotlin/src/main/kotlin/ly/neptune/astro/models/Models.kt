package ly.neptune.astro.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AstroError(
    val code: String,
    val message: String,
    val detail: String? = null,
    @SerialName("request_id") val requestId: String? = null
)

@Serializable
data class Destination(
    val type: String,
    val value: String
)

@Serializable
data class Pagination(
    @SerialName("next_cursor") val nextCursor: String? = null,
    @SerialName("has_more") val hasMore: Boolean
)

// ─── Payments ────────────────────────────────────────────────────────────────

@Serializable
data class CreateSessionRequest(
    val amount: Long,
    val currency: String,
    val destination: Destination,
    val description: String? = null,
    val reference: String? = null,
    @SerialName("redirect_url") val redirectUrl: String? = null,
    @SerialName("webhook_url") val webhookUrl: String? = null,
    val metadata: Map<String, String>? = null
)

@Serializable
data class PaymentSession(
    @SerialName("session_id") val sessionId: String,
    val status: String,
    val amount: Long,
    val currency: String,
    val destination: Destination,
    val description: String? = null,
    val reference: String? = null,
    @SerialName("checkout_url") val checkoutUrl: String,
    @SerialName("redirect_url") val redirectUrl: String? = null,
    @SerialName("created_at") val createdAt: String,
    @SerialName("expires_at") val expiresAt: String,
    @SerialName("completed_at") val completedAt: String? = null,
    @SerialName("settlement_type") val settlementType: String? = null
)

@Serializable
data class ListSessionsResponse(
    val sessions: List<PaymentSession>,
    val pagination: Pagination
)

@Serializable
data class CreateMandateRequest(
    @SerialName("customer_alias") val customerAlias: String,
    val amount: Long,
    val currency: String,
    val interval: String,
    val description: String,
    @SerialName("start_date") val startDate: String,
    @SerialName("end_date") val endDate: String? = null,
    @SerialName("max_amount") val maxAmount: Long? = null,
    @SerialName("webhook_url") val webhookUrl: String? = null
)

@Serializable
data class Mandate(
    @SerialName("mandate_id") val mandateId: String,
    val status: String,
    @SerialName("customer_alias") val customerAlias: String,
    val amount: Long,
    val currency: String,
    val interval: String,
    val description: String,
    @SerialName("start_date") val startDate: String,
    @SerialName("end_date") val endDate: String? = null,
    @SerialName("created_at") val createdAt: String
)

// ─── Alias ───────────────────────────────────────────────────────────────────

@Serializable
data class AliasProfile(
    @SerialName("alias_username") val aliasUsername: String,
    @SerialName("is_active") val isActive: Boolean,
    @SerialName("bank_handle") val bankHandle: String,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class LinkedAccount(
    val iban: String,
    val currency: String,
    @SerialName("account_name") val accountName: String? = null,
    @SerialName("bank_handle") val bankHandle: String,
    @SerialName("is_default") val isDefault: Boolean
)

@Serializable
data class AliasAccountsResponse(
    @SerialName("alias_username") val aliasUsername: String,
    val accounts: List<LinkedAccount>
)

// ─── Open Banking ────────────────────────────────────────────────────────────

@Serializable
data class CreateConsentRequest(
    @SerialName("bank_handle") val bankHandle: String,
    val scopes: List<String>,
    @SerialName("redirect_uri") val redirectUri: String,
    val state: String,
    @SerialName("code_challenge") val codeChallenge: String,
    @SerialName("code_challenge_method") val codeChallengeMethod: String = "S256",
    @SerialName("expiry_days") val expiryDays: Int? = null
)

@Serializable
data class Consent(
    @SerialName("consent_id") val consentId: String,
    val status: String,
    @SerialName("bank_handle") val bankHandle: String,
    val scopes: List<String>,
    @SerialName("redirect_uri") val redirectUri: String,
    @SerialName("consent_url") val consentUrl: String,
    @SerialName("created_at") val createdAt: String,
    @SerialName("expires_at") val expiresAt: String
)

@Serializable
data class TokenResponse(
    @SerialName("access_token") val accessToken: String,
    @SerialName("refresh_token") val refreshToken: String,
    @SerialName("token_type") val tokenType: String,
    @SerialName("expires_in") val expiresIn: Int,
    val scope: String
)

@Serializable
data class OBAccount(
    @SerialName("account_id") val accountId: String,
    val iban: String,
    val currency: String,
    @SerialName("account_type") val accountType: String,
    @SerialName("display_name") val displayName: String? = null
)

@Serializable
data class OBBalance(
    @SerialName("account_id") val accountId: String,
    val available: Long,
    val current: Long,
    val currency: String,
    @SerialName("as_of") val asOf: String
)

@Serializable
data class OBTransaction(
    @SerialName("transaction_id") val transactionId: String,
    val amount: Long,
    val currency: String,
    val direction: String,
    val narrative: String? = null,
    val reference: String? = null,
    @SerialName("value_date") val valueDate: String,
    @SerialName("booking_date") val bookingDate: String
)

@Serializable
data class OBTransactionsResponse(
    @SerialName("account_id") val accountId: String,
    val transactions: List<OBTransaction>
)

// ─── Identity ────────────────────────────────────────────────────────────────

@Serializable
data class ResolveResult(
    @SerialName("npt_handle") val nptHandle: String,
    val iban: String,
    @SerialName("bank_handle") val bankHandle: String,
    val currency: String
)

@Serializable
data class BankEntry(
    @SerialName("bank_handle") val bankHandle: String,
    @SerialName("display_name") val displayName: String,
    val country: String,
    @SerialName("ob_enabled") val obEnabled: Boolean
)

// ─── Webhooks ────────────────────────────────────────────────────────────────

@Serializable
data class WebhookPayload<T>(
    val event: String,
    @SerialName("api_version") val apiVersion: String,
    val timestamp: String,
    val data: T
)
