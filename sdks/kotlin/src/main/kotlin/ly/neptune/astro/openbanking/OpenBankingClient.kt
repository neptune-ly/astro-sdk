package ly.neptune.astro.openbanking

import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class OpenBankingClient(private val engine: HttpEngine) {

    suspend fun createConsent(request: CreateConsentRequest): Consent =
        engine.post("/ob/consents", request)

    suspend fun getConsent(consentId: String): Consent =
        engine.get("/ob/consents/$consentId")

    suspend fun revokeConsent(consentId: String): Map<String, String> =
        engine.delete("/ob/consents/$consentId")

    suspend fun exchangeCode(
        code: String,
        redirectUri: String,
        consentId: String,
        codeVerifier: String
    ): TokenResponse = engine.post(
        "/ob/token",
        mapOf(
            "grant_type" to "authorization_code",
            "code" to code,
            "redirect_uri" to redirectUri,
            "consent_id" to consentId,
            "code_verifier" to codeVerifier
        )
    )

    suspend fun refreshToken(refreshToken: String): TokenResponse = engine.post(
        "/ob/token",
        mapOf("grant_type" to "refresh_token", "refresh_token" to refreshToken)
    )

    suspend fun getAccounts(accessToken: String, consentId: String): List<OBAccount> {
        val response = engine.client.get(engine.baseUrl("/ob/accounts")) {
            header("Authorization", "Bearer $accessToken")
            header("X-Consent-Id", consentId)
        }
        return engine.handleResponse(response)
    }

    suspend fun getBalance(accessToken: String, consentId: String, accountId: String): OBBalance {
        val response = engine.client.get(engine.baseUrl("/ob/accounts/$accountId/balance")) {
            header("Authorization", "Bearer $accessToken")
            header("X-Consent-Id", consentId)
        }
        return engine.handleResponse(response)
    }

    suspend fun getTransactions(
        accessToken: String,
        consentId: String,
        accountId: String,
        fromDate: String? = null,
        toDate: String? = null
    ): OBTransactionsResponse {
        val response = engine.client.get(engine.baseUrl("/ob/accounts/$accountId/transactions")) {
            header("Authorization", "Bearer $accessToken")
            header("X-Consent-Id", consentId)
            fromDate?.let { parameter("from_date", it) }
            toDate?.let { parameter("to_date", it) }
        }
        return engine.handleResponse(response)
    }
}
