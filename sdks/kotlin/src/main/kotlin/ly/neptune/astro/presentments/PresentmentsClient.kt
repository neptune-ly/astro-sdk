package ly.neptune.astro.presentments

import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class PresentmentsClient internal constructor(private val engine: HttpEngine) {

    suspend fun capabilities(): PresentedPaymentCapabilitiesResponse =
        engine.get("/capabilities")

    suspend fun create(request: CreatePresentmentRequest, idempotencyKey: String? = null): Presentment =
        engine.post(
            "/presentments",
            request,
            idempotencyKey?.let { mapOf("Idempotency-Key" to it) } ?: emptyMap()
        )

    suspend fun get(presentmentId: String): Presentment =
        engine.get("/presentments/$presentmentId")

    suspend fun list(): List<Presentment> =
        engine.get<PresentmentsListResponse>("/presentments").data

    suspend fun claim(presentmentId: String, request: ClaimPresentmentRequest): Presentment =
        engine.post("/presentments/$presentmentId/claim", request)

    suspend fun cancel(presentmentId: String): Presentment =
        engine.post("/presentments/$presentmentId/cancel")

    suspend fun status(presentmentId: String): PresentmentStatusResponse =
        engine.get("/presentments/$presentmentId/status")
}
