package ly.neptune.astro.payments

import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class PaymentsClient internal constructor(private val engine: HttpEngine) {

    suspend fun createSession(request: CreateSessionRequest): PaymentSession =
        engine.post("/payments/sessions", request)

    suspend fun getSession(sessionId: String): PaymentSession =
        engine.get("/payments/sessions/$sessionId")

    suspend fun listSessions(
        status: String? = null,
        cursor: String? = null,
        limit: Int? = null
    ): ListSessionsResponse = engine.get(
        "/payments/sessions",
        mapOf("status" to status, "cursor" to cursor, "limit" to limit?.toString())
    )

    suspend fun cancelSession(sessionId: String): PaymentSession =
        engine.post("/payments/sessions/$sessionId/cancel")

    suspend fun createMandate(request: CreateMandateRequest): Mandate =
        engine.post("/recurring/mandates", request)

    suspend fun getMandate(mandateId: String): Mandate =
        engine.get("/recurring/mandates/$mandateId")

    suspend fun cancelMandate(mandateId: String): Mandate =
        engine.post("/recurring/mandates/$mandateId/cancel")
}
