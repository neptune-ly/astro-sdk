package ly.neptune.astro.identity

import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class IdentityClient internal constructor(private val engine: HttpEngine) {

    suspend fun resolve(alias: String): ResolveResult =
        engine.get("/v1/registry/resolve/$alias")

    suspend fun listBanks(): List<BankEntry> =
        engine.get("/v1/banks")

    suspend fun getBank(bankHandle: String): BankEntry =
        engine.get("/v1/banks/$bankHandle")
}
