import Foundation

public final class PresentmentsClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func capabilities() async throws -> PresentedPaymentCapabilitiesResponse {
        let req = http.request(http.url("/capabilities"))
        return try await http.perform(req)
    }

    public func create(_ request: CreatePresentmentRequest, idempotencyKey: String? = nil) async throws -> Presentment {
        let headers = idempotencyKey.map { ["Idempotency-Key": $0] } ?? [:]
        let req = http.request(http.url("/presentments"), method: "POST", body: request, extraHeaders: headers)
        return try await http.perform(req)
    }

    public func list() async throws -> [Presentment] {
        let req = http.request(http.url("/presentments"))
        let response: PresentmentsListResponse = try await http.perform(req)
        return response.data
    }

    public func get(_ presentmentId: String) async throws -> Presentment {
        let req = http.request(http.url("/presentments/\(presentmentId)"))
        return try await http.perform(req)
    }

    public func claim(_ presentmentId: String, request: ClaimPresentmentRequest) async throws -> Presentment {
        let req = http.request(http.url("/presentments/\(presentmentId)/claim"), method: "POST", body: request)
        return try await http.perform(req)
    }

    public func cancel(_ presentmentId: String) async throws -> Presentment {
        let req = http.request(http.url("/presentments/\(presentmentId)/cancel"), method: "POST")
        return try await http.perform(req)
    }

    public func status(_ presentmentId: String) async throws -> PresentmentStatusResponse {
        let req = http.request(http.url("/presentments/\(presentmentId)/status"))
        return try await http.perform(req)
    }
}
