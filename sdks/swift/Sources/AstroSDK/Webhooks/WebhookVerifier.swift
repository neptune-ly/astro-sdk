import Foundation
import CryptoKit

public struct WebhookVerifier {
    private let secret: String

    public init(secret: String) {
        self.secret = secret
    }

    public func verify(rawBody: String, signature: String) -> Bool {
        let provided = signature.hasPrefix("sha256=") ? String(signature.dropFirst(7)) : signature
        let expected = hmac(rawBody)
        return constantTimeEquals(expected, provided)
    }

    public func parse(rawBody: String) throws -> [String: Any] {
        guard
            let data = rawBody.data(using: .utf8),
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        else {
            throw AstroError(statusCode: 0, code: "PARSE_ERROR", message: "Invalid JSON webhook body")
        }
        return json
    }

    public func handle(
        rawBody: String,
        signature: String,
        handlers: [String: ([String: Any]) -> Void]
    ) throws {
        guard verify(rawBody: rawBody, signature: signature) else {
            throw AstroError(statusCode: 401, code: "INVALID_SIGNATURE", message: "Webhook signature verification failed")
        }
        let payload = try parse(rawBody: rawBody)
        guard let event = payload["event"] as? String else { return }
        handlers[event]?(payload)
        handlers["*"]?(payload)
    }

    private func hmac(_ body: String) -> String {
        let keyData = Data(secret.utf8)
        let bodyData = Data(body.utf8)
        let key = SymmetricKey(data: keyData)
        let mac = HMAC<SHA256>.authenticationCode(for: bodyData, using: key)
        return Data(mac).map { String(format: "%02x", $0) }.joined()
    }

    private func constantTimeEquals(_ a: String, _ b: String) -> Bool {
        guard a.count == b.count else { return false }
        let aBytes = Array(a.utf8)
        let bBytes = Array(b.utf8)
        var result: UInt8 = 0
        for i in 0..<aBytes.count { result |= aBytes[i] ^ bBytes[i] }
        return result == 0
    }
}
