package ly.neptune.astro.webhooks

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonElement
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

object WebhookVerifier {

    private val json = Json { ignoreUnknownKeys = true }

    fun verify(rawBody: String, signature: String, secret: String): Boolean {
        val expected = computeSignature(rawBody, secret)
        val provided = signature.removePrefix("sha256=")
        return constantTimeEquals(expected, provided)
    }

    fun parse(rawBody: String): JsonElement =
        json.parseToJsonElement(rawBody)

    private fun computeSignature(body: String, secret: String): String {
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(SecretKeySpec(secret.toByteArray(Charsets.UTF_8), "HmacSHA256"))
        return mac.doFinal(body.toByteArray(Charsets.UTF_8))
            .joinToString("") { "%02x".format(it) }
    }

    private fun constantTimeEquals(a: String, b: String): Boolean {
        if (a.length != b.length) return false
        var result = 0
        for (i in a.indices) result = result or (a[i].code xor b[i].code)
        return result == 0
    }
}

class WebhookReceiver(private val secret: String) {

    private val handlers = mutableMapOf<String, MutableList<suspend (JsonElement) -> Unit>>()

    fun on(event: String, handler: suspend (JsonElement) -> Unit): WebhookReceiver {
        handlers.getOrPut(event) { mutableListOf() }.add(handler)
        return this
    }

    suspend fun handle(rawBody: String, signature: String) {
        require(WebhookVerifier.verify(rawBody, signature, secret)) {
            "Invalid webhook signature"
        }
        val parsed = WebhookVerifier.parse(rawBody)
        val eventName = parsed.toString()
            .let { json.parseToJsonElement(it) }
            .let {
                kotlinx.serialization.json.jsonObject(it)["event"]
                    ?.let { el -> kotlinx.serialization.json.jsonPrimitive(el).content }
            } ?: return

        handlers[eventName]?.forEach { it(parsed) }
        handlers["*"]?.forEach { it(parsed) }
    }

    private fun kotlinx.serialization.json.jsonObject(el: JsonElement) =
        el as? kotlinx.serialization.json.JsonObject ?: error("Not a JSON object")

    private fun kotlinx.serialization.json.jsonPrimitive(el: JsonElement) =
        el as? kotlinx.serialization.json.JsonPrimitive ?: error("Not a primitive")
}
