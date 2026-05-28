package ly.neptune.astro.payments

import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class PaymentsClient internal constructor(private val engine: HttpEngine) {

    suspend fun createSession(request: CreateSessionRequest, idempotencyKey: String? = null): PaymentSession =
        engine.post(
            "/payments/initiate",
            request,
            idempotencyKey?.let { mapOf("Idempotency-Key" to it) } ?: emptyMap()
        )

    suspend fun getSession(sessionId: String): PaymentSession =
        engine.get("/payments/$sessionId")

    suspend fun listSessions(
        status: String? = null,
        cursor: String? = null,
        limit: Int? = null
    ): ListSessionsResponse = engine.get(
        "/payments",
        mapOf("status" to status, "cursor" to cursor, "limit" to limit?.toString())
    )

    suspend fun cancelSession(sessionId: String): PaymentSession =
        engine.post("/payments/$sessionId/cancel")

    suspend fun createRefund(sessionId: String, request: CreateRefundRequest, idempotencyKey: String? = null): Refund =
        engine.post(
            "/payments/$sessionId/refunds",
            request,
            idempotencyKey?.let { mapOf("Idempotency-Key" to it) } ?: emptyMap()
        )

    suspend fun listRefunds(sessionId: String): RefundListResponse =
        engine.get("/payments/$sessionId/refunds")

    suspend fun getRefund(refundId: String): Refund =
        engine.get("/payments/refunds/$refundId")

    suspend fun createMandate(request: CreateMandateRequest, idempotencyKey: String? = null): Mandate =
        engine.post(
            "/recurring/mandates",
            request,
            idempotencyKey?.let { mapOf("Idempotency-Key" to it) } ?: emptyMap()
        )

    suspend fun listMandates(
        status: String? = null,
        page: Int? = null,
        limit: Int? = null
    ): MandateListResponse = engine.get(
        "/recurring/mandates",
        mapOf("status" to status, "page" to page?.toString(), "limit" to limit?.toString())
    )

    suspend fun getMandate(mandateId: String): Mandate =
        engine.get("/recurring/mandates/$mandateId")

    suspend fun cancelMandate(mandateId: String): Mandate =
        engine.delete("/recurring/mandates/$mandateId")

    suspend fun chargeMandate(
        mandateId: String,
        request: ChargeMandateRequest,
        idempotencyKey: String? = null
    ): MandateCharge = engine.post(
        "/recurring/mandates/$mandateId/charge",
        request,
        idempotencyKey?.let { mapOf("Idempotency-Key" to it) } ?: emptyMap()
    )

    suspend fun listMandateCharges(
        mandateId: String,
        page: Int? = null,
        limit: Int? = null
    ): MandateChargeListResponse = engine.get(
        "/recurring/mandates/$mandateId/charges",
        mapOf("page" to page?.toString(), "limit" to limit?.toString())
    )
}
