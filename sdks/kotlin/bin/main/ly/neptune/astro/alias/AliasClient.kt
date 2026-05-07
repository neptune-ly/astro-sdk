package ly.neptune.astro.alias

import ly.neptune.astro.HttpEngine
import ly.neptune.astro.models.*

class AliasClient internal constructor(private val engine: HttpEngine) {

    suspend fun getProfile(alias: String): AliasProfile =
        engine.get("/alias/$alias")

    suspend fun getAccounts(alias: String): AliasAccountsResponse =
        engine.get("/alias/$alias/accounts")

    suspend fun deactivate(alias: String): AliasProfile =
        engine.post("/alias/$alias/deactivate")

    suspend fun resolve(alias: String): ResolveResult =
        engine.get("/alias/$alias/resolve")
}
