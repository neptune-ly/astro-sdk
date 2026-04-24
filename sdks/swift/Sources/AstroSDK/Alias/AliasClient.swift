import Foundation

public final class AliasClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func getProfile(_ alias: String) async throws -> AliasProfile {
        try await http.perform(http.request(http.url("/alias/\(alias)")))
    }

    public func getAccounts(_ alias: String) async throws -> [LinkedAccount] {
        let result = try await http.perform(http.request(http.url("/alias/\(alias)/accounts"))) as AccountsWrapper
        return result.accounts
    }

    public func resolve(_ alias: String) async throws -> ResolveResult {
        try await http.perform(http.request(http.url("/alias/\(alias)/resolve")))
    }

    public func deactivate(_ alias: String) async throws -> AliasProfile {
        try await http.perform(http.request(http.url("/alias/\(alias)/deactivate"), method: "POST"))
    }
}

private struct AccountsWrapper: Decodable { let accounts: [LinkedAccount] }
