import Foundation

// MARK: - Config & Error

public struct AstroConfig {
    public let baseURL: URL
    public var merchantKey: String?
    public var bankKey: String?
    public var adminKey: String?
    public var timeout: TimeInterval

    public init(
        baseURL: URL,
        merchantKey: String? = nil,
        bankKey: String? = nil,
        adminKey: String? = nil,
        timeout: TimeInterval = 30
    ) {
        self.baseURL = baseURL
        self.merchantKey = merchantKey
        self.bankKey = bankKey
        self.adminKey = adminKey
        self.timeout = timeout
    }
}

public struct AstroError: LocalizedError {
    public let statusCode: Int
    public let code: String
    public let detail: String?
    public var errorDescription: String?

    public init(statusCode: Int, code: String, message: String, detail: String? = nil) {
        self.statusCode = statusCode
        self.code = code
        self.detail = detail
        self.errorDescription = "[\(code)] \(message)"
    }
}

// MARK: - Shared

public struct Destination: Codable {
    public let type: String
    public let value: String
    public init(type: String, value: String) {
        self.type = type
        self.value = value
    }
}

public struct Pagination: Codable {
    public let nextCursor: String?
    public let hasMore: Bool
    enum CodingKeys: String, CodingKey {
        case nextCursor = "next_cursor"
        case hasMore = "has_more"
    }
}

// MARK: - Payments

public struct PaymentSession: Codable {
    public let sessionId: String
    public let status: String
    public let amount: Int
    public let currency: String
    public let destination: Destination
    public let description: String?
    public let reference: String?
    public let checkoutUrl: String
    public let createdAt: String
    public let expiresAt: String
    public let completedAt: String?
    public let settlementType: String?
    enum CodingKeys: String, CodingKey {
        case sessionId = "session_id"
        case status, amount, currency, destination, description, reference
        case checkoutUrl = "checkout_url"
        case createdAt = "created_at"
        case expiresAt = "expires_at"
        case completedAt = "completed_at"
        case settlementType = "settlement_type"
    }
}

public struct CreateSessionRequest: Codable {
    public let amount: Int
    public let currency: String
    public let destination: Destination
    public let description: String?
    public let reference: String?
    public let redirectUrl: String?
    public let webhookUrl: String?
    enum CodingKeys: String, CodingKey {
        case amount, currency, destination, description, reference
        case redirectUrl = "redirect_url"
        case webhookUrl = "webhook_url"
    }
    public init(
        amount: Int, currency: String, destination: Destination,
        description: String? = nil, reference: String? = nil,
        redirectUrl: String? = nil, webhookUrl: String? = nil
    ) {
        self.amount = amount; self.currency = currency; self.destination = destination
        self.description = description; self.reference = reference
        self.redirectUrl = redirectUrl; self.webhookUrl = webhookUrl
    }
}

public struct Mandate: Codable {
    public let mandateId: String
    public let status: String
    public let customerAlias: String
    public let amount: Int
    public let currency: String
    public let interval: String
    public let description: String
    public let startDate: String
    public let endDate: String?
    public let createdAt: String
    enum CodingKeys: String, CodingKey {
        case mandateId = "mandate_id"
        case status
        case customerAlias = "customer_alias"
        case amount, currency, interval, description
        case startDate = "start_date"
        case endDate = "end_date"
        case createdAt = "created_at"
    }
}

// MARK: - Alias

public struct AliasProfile: Codable {
    public let aliasUsername: String
    public let isActive: Bool
    public let bankHandle: String
    public let createdAt: String
    enum CodingKeys: String, CodingKey {
        case aliasUsername = "alias_username"
        case isActive = "is_active"
        case bankHandle = "bank_handle"
        case createdAt = "created_at"
    }
}

public struct LinkedAccount: Codable {
    public let iban: String
    public let currency: String
    public let accountName: String?
    public let bankHandle: String
    public let isDefault: Bool
    enum CodingKeys: String, CodingKey {
        case iban, currency
        case accountName = "account_name"
        case bankHandle = "bank_handle"
        case isDefault = "is_default"
    }
}

// MARK: - Open Banking

public struct Consent: Codable {
    public let consentId: String
    public let status: String
    public let bankHandle: String
    public let scopes: [String]
    public let redirectUri: String
    public let consentUrl: String
    public let createdAt: String
    public let expiresAt: String
    enum CodingKeys: String, CodingKey {
        case consentId = "consent_id"
        case status
        case bankHandle = "bank_handle"
        case scopes
        case redirectUri = "redirect_uri"
        case consentUrl = "consent_url"
        case createdAt = "created_at"
        case expiresAt = "expires_at"
    }
}

public struct TokenResponse: Codable {
    public let accessToken: String
    public let refreshToken: String
    public let tokenType: String
    public let expiresIn: Int
    public let scope: String
    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case tokenType = "token_type"
        case expiresIn = "expires_in"
        case scope
    }
}

public struct OBAccount: Codable {
    public let accountId: String
    public let iban: String
    public let currency: String
    public let accountType: String
    public let displayName: String?
    enum CodingKeys: String, CodingKey {
        case accountId = "account_id"
        case iban, currency
        case accountType = "account_type"
        case displayName = "display_name"
    }
}

public struct OBTransaction: Codable {
    public let transactionId: String
    public let amount: Int
    public let currency: String
    public let direction: String
    public let narrative: String?
    public let reference: String?
    public let valueDate: String
    public let bookingDate: String
    enum CodingKeys: String, CodingKey {
        case transactionId = "transaction_id"
        case amount, currency, direction, narrative, reference
        case valueDate = "value_date"
        case bookingDate = "booking_date"
    }
}

// MARK: - Identity

public struct ResolveResult: Codable {
    public let nptHandle: String
    public let iban: String
    public let bankHandle: String
    public let currency: String
    enum CodingKeys: String, CodingKey {
        case nptHandle = "npt_handle"
        case iban
        case bankHandle = "bank_handle"
        case currency
    }
}

public struct BankEntry: Codable {
    public let bankHandle: String
    public let displayName: String
    public let country: String
    public let obEnabled: Bool
    enum CodingKeys: String, CodingKey {
        case bankHandle = "bank_handle"
        case displayName = "display_name"
        case country
        case obEnabled = "ob_enabled"
    }
}
