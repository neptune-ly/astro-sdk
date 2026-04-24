// ignore_for_file: invalid_annotation_target

class AstroError implements Exception {
  final String code;
  final String message;
  final String? detail;
  final int statusCode;

  const AstroError({
    required this.code,
    required this.message,
    required this.statusCode,
    this.detail,
  });

  @override
  String toString() => '[$code] $message (HTTP $statusCode)';
}

// ─── Shared ──────────────────────────────────────────────────────────────────

class Destination {
  final String type;
  final String value;

  const Destination({required this.type, required this.value});

  Map<String, dynamic> toJson() => {'type': type, 'value': value};
}

class Pagination {
  final String? nextCursor;
  final bool hasMore;

  const Pagination({this.nextCursor, required this.hasMore});

  factory Pagination.fromJson(Map<String, dynamic> j) => Pagination(
        nextCursor: j['next_cursor'] as String?,
        hasMore: j['has_more'] as bool? ?? false,
      );
}

// ─── Payments ────────────────────────────────────────────────────────────────

class PaymentSession {
  final String sessionId;
  final String status;
  final int amount;
  final String currency;
  final Destination destination;
  final String? description;
  final String? reference;
  final String checkoutUrl;
  final String createdAt;
  final String expiresAt;
  final String? completedAt;
  final String? settlementType;

  const PaymentSession({
    required this.sessionId,
    required this.status,
    required this.amount,
    required this.currency,
    required this.destination,
    this.description,
    this.reference,
    required this.checkoutUrl,
    required this.createdAt,
    required this.expiresAt,
    this.completedAt,
    this.settlementType,
  });

  factory PaymentSession.fromJson(Map<String, dynamic> j) => PaymentSession(
        sessionId: j['session_id'] as String,
        status: j['status'] as String,
        amount: j['amount'] as int,
        currency: j['currency'] as String,
        destination: Destination(
          type: (j['destination'] as Map)['type'] as String,
          value: (j['destination'] as Map)['value'] as String,
        ),
        description: j['description'] as String?,
        reference: j['reference'] as String?,
        checkoutUrl: j['checkout_url'] as String,
        createdAt: j['created_at'] as String,
        expiresAt: j['expires_at'] as String,
        completedAt: j['completed_at'] as String?,
        settlementType: j['settlement_type'] as String?,
      );
}

class Mandate {
  final String mandateId;
  final String status;
  final String customerAlias;
  final int amount;
  final String currency;
  final String interval;
  final String description;
  final String startDate;
  final String? endDate;
  final String createdAt;

  const Mandate({
    required this.mandateId,
    required this.status,
    required this.customerAlias,
    required this.amount,
    required this.currency,
    required this.interval,
    required this.description,
    required this.startDate,
    this.endDate,
    required this.createdAt,
  });

  factory Mandate.fromJson(Map<String, dynamic> j) => Mandate(
        mandateId: j['mandate_id'] as String,
        status: j['status'] as String,
        customerAlias: j['customer_alias'] as String,
        amount: j['amount'] as int,
        currency: j['currency'] as String,
        interval: j['interval'] as String,
        description: j['description'] as String,
        startDate: j['start_date'] as String,
        endDate: j['end_date'] as String?,
        createdAt: j['created_at'] as String,
      );
}

// ─── Alias ───────────────────────────────────────────────────────────────────

class AliasProfile {
  final String aliasUsername;
  final bool isActive;
  final String bankHandle;
  final String createdAt;

  const AliasProfile({
    required this.aliasUsername,
    required this.isActive,
    required this.bankHandle,
    required this.createdAt,
  });

  factory AliasProfile.fromJson(Map<String, dynamic> j) => AliasProfile(
        aliasUsername: j['alias_username'] as String,
        isActive: j['is_active'] as bool,
        bankHandle: j['bank_handle'] as String,
        createdAt: j['created_at'] as String,
      );
}

class LinkedAccount {
  final String iban;
  final String currency;
  final String? accountName;
  final String bankHandle;
  final bool isDefault;

  const LinkedAccount({
    required this.iban,
    required this.currency,
    this.accountName,
    required this.bankHandle,
    required this.isDefault,
  });

  factory LinkedAccount.fromJson(Map<String, dynamic> j) => LinkedAccount(
        iban: j['iban'] as String,
        currency: j['currency'] as String,
        accountName: j['account_name'] as String?,
        bankHandle: j['bank_handle'] as String,
        isDefault: j['is_default'] as bool? ?? false,
      );
}

// ─── Open Banking ────────────────────────────────────────────────────────────

class Consent {
  final String consentId;
  final String status;
  final String bankHandle;
  final List<String> scopes;
  final String redirectUri;
  final String consentUrl;
  final String createdAt;
  final String expiresAt;

  const Consent({
    required this.consentId,
    required this.status,
    required this.bankHandle,
    required this.scopes,
    required this.redirectUri,
    required this.consentUrl,
    required this.createdAt,
    required this.expiresAt,
  });

  factory Consent.fromJson(Map<String, dynamic> j) => Consent(
        consentId: j['consent_id'] as String,
        status: j['status'] as String,
        bankHandle: j['bank_handle'] as String,
        scopes: List<String>.from(j['scopes'] as List),
        redirectUri: j['redirect_uri'] as String,
        consentUrl: j['consent_url'] as String,
        createdAt: j['created_at'] as String,
        expiresAt: j['expires_at'] as String,
      );
}

class TokenResponse {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final int expiresIn;
  final String scope;

  const TokenResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.tokenType,
    required this.expiresIn,
    required this.scope,
  });

  factory TokenResponse.fromJson(Map<String, dynamic> j) => TokenResponse(
        accessToken: j['access_token'] as String,
        refreshToken: j['refresh_token'] as String,
        tokenType: j['token_type'] as String,
        expiresIn: j['expires_in'] as int,
        scope: j['scope'] as String,
      );
}

class OBAccount {
  final String accountId;
  final String iban;
  final String currency;
  final String accountType;
  final String? displayName;

  const OBAccount({
    required this.accountId,
    required this.iban,
    required this.currency,
    required this.accountType,
    this.displayName,
  });

  factory OBAccount.fromJson(Map<String, dynamic> j) => OBAccount(
        accountId: j['account_id'] as String,
        iban: j['iban'] as String,
        currency: j['currency'] as String,
        accountType: j['account_type'] as String,
        displayName: j['display_name'] as String?,
      );
}

class OBTransaction {
  final String transactionId;
  final int amount;
  final String currency;
  final String direction;
  final String? narrative;
  final String? reference;
  final String valueDate;
  final String bookingDate;

  const OBTransaction({
    required this.transactionId,
    required this.amount,
    required this.currency,
    required this.direction,
    this.narrative,
    this.reference,
    required this.valueDate,
    required this.bookingDate,
  });

  factory OBTransaction.fromJson(Map<String, dynamic> j) => OBTransaction(
        transactionId: j['transaction_id'] as String,
        amount: j['amount'] as int,
        currency: j['currency'] as String,
        direction: j['direction'] as String,
        narrative: j['narrative'] as String?,
        reference: j['reference'] as String?,
        valueDate: j['value_date'] as String,
        bookingDate: j['booking_date'] as String,
      );
}

// ─── Identity ────────────────────────────────────────────────────────────────

class ResolveResult {
  final String nptHandle;
  final String iban;
  final String bankHandle;
  final String currency;

  const ResolveResult({
    required this.nptHandle,
    required this.iban,
    required this.bankHandle,
    required this.currency,
  });

  factory ResolveResult.fromJson(Map<String, dynamic> j) => ResolveResult(
        nptHandle: j['npt_handle'] as String,
        iban: j['iban'] as String,
        bankHandle: j['bank_handle'] as String,
        currency: j['currency'] as String,
      );
}

class BankEntry {
  final String bankHandle;
  final String displayName;
  final String country;
  final bool obEnabled;

  const BankEntry({
    required this.bankHandle,
    required this.displayName,
    required this.country,
    required this.obEnabled,
  });

  factory BankEntry.fromJson(Map<String, dynamic> j) => BankEntry(
        bankHandle: j['bank_handle'] as String,
        displayName: j['display_name'] as String,
        country: j['country'] as String,
        obEnabled: j['ob_enabled'] as bool? ?? false,
      );
}
