import Foundation

public final class PaymentsClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func createSession(_ request: CreateSessionRequest, idempotencyKey: String? = nil) async throws -> PaymentSession {
        let headers = idempotencyKey.map { ["Idempotency-Key": $0] } ?? [:]
        let req = http.request(http.url("/payments/initiate"), method: "POST", body: request, extraHeaders: headers)
        return try await http.perform(req)
    }

    public func getSession(_ sessionId: String) async throws -> PaymentSession {
        let req = http.request(http.url("/payments/\(sessionId)"))
        return try await http.perform(req)
    }

    public func cancelSession(_ sessionId: String) async throws -> PaymentSession {
        let req = http.request(http.url("/payments/\(sessionId)/cancel"), method: "POST")
        return try await http.perform(req)
    }

    public func createRefund(
        sessionId: String,
        request: CreateRefundRequest,
        idempotencyKey: String? = nil
    ) async throws -> Refund {
        let headers = idempotencyKey.map { ["Idempotency-Key": $0] } ?? [:]
        let req = http.request(
            http.url("/payments/\(sessionId)/refunds"),
            method: "POST",
            body: request,
            extraHeaders: headers
        )
        return try await http.perform(req)
    }

    public func listRefunds(sessionId: String) async throws -> RefundListResponse {
        let req = http.request(http.url("/payments/\(sessionId)/refunds"))
        return try await http.perform(req)
    }

    public func getRefund(_ refundId: String) async throws -> Refund {
        let req = http.request(http.url("/payments/refunds/\(refundId)"))
        return try await http.perform(req)
    }

    public func listSessions(status: String? = nil, cursor: String? = nil) async throws -> [PaymentSession] {
        let url = http.url("/payments", query: ["status": status, "cursor": cursor])
        let req = http.request(url)
        let result = try await http.perform(req) as ListSessionsWrapper
        return result.sessions
    }

    public func createMandate(_ request: CreateMandateRequest, idempotencyKey: String? = nil) async throws -> Mandate {
        let headers = idempotencyKey.map { ["Idempotency-Key": $0] } ?? [:]
        let req = http.request(http.url("/recurring/mandates"), method: "POST", body: request, extraHeaders: headers)
        return try await http.perform(req)
    }

    public func listMandates(status: String? = nil, page: Int? = nil, limit: Int? = nil) async throws -> MandateListResponse {
        let url = http.url("/recurring/mandates", query: [
            "status": status,
            "page": page.map(String.init),
            "limit": limit.map(String.init)
        ])
        let req = http.request(url)
        return try await http.perform(req)
    }

    public func getMandate(_ mandateId: String) async throws -> Mandate {
        let req = http.request(http.url("/recurring/mandates/\(mandateId)"))
        return try await http.perform(req)
    }

    public func cancelMandate(_ mandateId: String) async throws -> Mandate {
        let req = http.request(http.url("/recurring/mandates/\(mandateId)"), method: "DELETE")
        return try await http.perform(req)
    }

    public func chargeMandate(
        _ mandateId: String,
        request: ChargeMandateRequest,
        idempotencyKey: String? = nil
    ) async throws -> MandateCharge {
        let headers = idempotencyKey.map { ["Idempotency-Key": $0] } ?? [:]
        let req = http.request(
            http.url("/recurring/mandates/\(mandateId)/charge"),
            method: "POST",
            body: request,
            extraHeaders: headers
        )
        return try await http.perform(req)
    }

    public func listMandateCharges(_ mandateId: String, page: Int? = nil, limit: Int? = nil) async throws -> MandateChargeListResponse {
        let url = http.url("/recurring/mandates/\(mandateId)/charges", query: [
            "page": page.map(String.init),
            "limit": limit.map(String.init)
        ])
        let req = http.request(url)
        return try await http.perform(req)
    }
}

private struct ListSessionsWrapper: Decodable { let sessions: [PaymentSession] }
