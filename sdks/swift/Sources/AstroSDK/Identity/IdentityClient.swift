import Foundation

public final class IdentityClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func resolve(_ alias: String) async throws -> ResolveResult {
        try await http.perform(http.request(http.url("/v1/registry/resolve/\(alias)")))
    }

    public func listBanks() async throws -> [BankEntry] {
        try await http.perform(http.request(http.url("/v1/banks")))
    }

    public func getBank(_ handle: String) async throws -> BankEntry {
        try await http.perform(http.request(http.url("/v1/banks/\(handle)")))
    }
}
