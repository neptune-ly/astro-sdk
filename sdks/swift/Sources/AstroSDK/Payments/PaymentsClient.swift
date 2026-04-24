import Foundation

public final class PaymentsClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func createSession(_ request: CreateSessionRequest) async throws -> PaymentSession {
        let req = http.request(http.url("/payments/sessions"), method: "POST", body: request)
        return try await http.perform(req)
    }

    public func getSession(_ sessionId: String) async throws -> PaymentSession {
        let req = http.request(http.url("/payments/sessions/\(sessionId)"))
        return try await http.perform(req)
    }

    public func cancelSession(_ sessionId: String) async throws -> PaymentSession {
        let req = http.request(http.url("/payments/sessions/\(sessionId)/cancel"), method: "POST")
        return try await http.perform(req)
    }

    public func listSessions(status: String? = nil, cursor: String? = nil) async throws -> [PaymentSession] {
        let url = http.url("/payments/sessions", query: ["status": status, "cursor": cursor])
        let req = http.request(url)
        let result = try await http.perform(req) as ListSessionsWrapper
        return result.sessions
    }
}

private struct ListSessionsWrapper: Decodable { let sessions: [PaymentSession] }
