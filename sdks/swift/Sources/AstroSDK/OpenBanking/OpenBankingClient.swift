import Foundation

public final class OpenBankingClient {
    private let http: AstroHTTPClient
    init(http: AstroHTTPClient) { self.http = http }

    public func createConsent(
        bankHandle: String,
        scopes: [String],
        redirectUri: String,
        state: String,
        codeChallenge: String,
        codeChallengeMethod: String = "S256"
    ) async throws -> Consent {
        let body = CreateConsentBody(
            bankHandle: bankHandle, scopes: scopes, redirectUri: redirectUri,
            state: state, codeChallenge: codeChallenge, codeChallengeMethod: codeChallengeMethod
        )
        return try await http.perform(http.request(http.url("/ob/consents"), method: "POST", body: body))
    }

    public func getConsent(_ consentId: String) async throws -> Consent {
        try await http.perform(http.request(http.url("/ob/consents/\(consentId)")))
    }

    public func exchangeCode(
        code: String,
        redirectUri: String,
        consentId: String,
        codeVerifier: String
    ) async throws -> TokenResponse {
        let body = TokenBody(
            grantType: "authorization_code",
            code: code,
            redirectUri: redirectUri,
            consentId: consentId,
            codeVerifier: codeVerifier
        )
        return try await http.perform(http.request(http.url("/ob/token"), method: "POST", body: body))
    }

    public func refreshToken(_ refreshToken: String) async throws -> TokenResponse {
        let body = RefreshBody(grantType: "refresh_token", refreshToken: refreshToken)
        return try await http.perform(http.request(http.url("/ob/token"), method: "POST", body: body))
    }

    public func getAccounts(accessToken: String, consentId: String) async throws -> [OBAccount] {
        var req = http.request(
            http.url("/ob/accounts"),
            extraHeaders: ["Authorization": "Bearer \(accessToken)", "X-Consent-Id": consentId]
        )
        let result = try await http.perform(req) as OBAccountsWrapper
        return result.accounts
    }

    public func getTransactions(
        accessToken: String,
        consentId: String,
        accountId: String,
        fromDate: String? = nil,
        toDate: String? = nil
    ) async throws -> [OBTransaction] {
        let url = http.url("/ob/accounts/\(accountId)/transactions", query: ["from_date": fromDate, "to_date": toDate])
        let req = http.request(url, extraHeaders: ["Authorization": "Bearer \(accessToken)", "X-Consent-Id": consentId])
        let result = try await http.perform(req) as OBTransactionsWrapper
        return result.transactions
    }
}

private struct CreateConsentBody: Encodable {
    let bankHandle: String; let scopes: [String]; let redirectUri: String
    let state: String; let codeChallenge: String; let codeChallengeMethod: String
    enum CodingKeys: String, CodingKey {
        case bankHandle = "bank_handle"; case scopes; case redirectUri = "redirect_uri"
        case state; case codeChallenge = "code_challenge"; case codeChallengeMethod = "code_challenge_method"
    }
}

private struct TokenBody: Encodable {
    let grantType: String; let code: String; let redirectUri: String
    let consentId: String; let codeVerifier: String
    enum CodingKeys: String, CodingKey {
        case grantType = "grant_type"; case code; case redirectUri = "redirect_uri"
        case consentId = "consent_id"; case codeVerifier = "code_verifier"
    }
}

private struct RefreshBody: Encodable {
    let grantType: String; let refreshToken: String
    enum CodingKeys: String, CodingKey {
        case grantType = "grant_type"; case refreshToken = "refresh_token"
    }
}

private struct OBAccountsWrapper: Decodable { let accounts: [OBAccount] }
private struct OBTransactionsWrapper: Decodable { let transactions: [OBTransaction] }
