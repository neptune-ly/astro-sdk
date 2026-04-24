type Currency = 'LYD' | 'USD' | 'EUR' | 'GBP' | string;
type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
type MandateStatus = 'PENDING_CONSENT' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
type ConsentStatus = 'PENDING' | 'ACTIVE' | 'REVOKED' | 'EXPIRED';
type PaymentOrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'PENDING_SCA';
interface Destination {
    type: 'iban' | 'alias';
    value: string;
}
interface Pagination {
    next_cursor?: string;
    has_more: boolean;
}
interface AstroConfig {
    baseUrl: string;
    merchantKey?: string;
    bankKey?: string;
    adminKey?: string;
    timeout?: number;
}
interface AstroError {
    code: string;
    message: string;
    detail?: string;
    request_id?: string;
}
type WebhookEvent = 'payment.completed' | 'payment.failed' | 'payment.expired' | 'mandate.activated' | 'mandate.cancelled' | 'mandate.charge.completed' | 'mandate.charge.failed' | 'consent.granted' | 'consent.revoked' | 'consent.expired' | 'payment_order.completed' | 'payment_order.failed' | 'payment_order.pending_sca' | 'payment_order.rejected';
interface WebhookPayload<T = unknown> {
    event: WebhookEvent;
    api_version: string;
    timestamp: string;
    data: T;
}

declare class AstroRequestError extends Error {
    readonly code: string;
    readonly detail?: string;
    readonly requestId?: string;
    readonly status: number;
    constructor(status: number, error: AstroError);
}
declare class HttpClient {
    private baseUrl;
    private defaultHeaders;
    private timeout;
    constructor(config: AstroConfig);
    setMerchantKey(key: string): void;
    setBankKey(key: string): void;
    setAdminKey(key: string): void;
    setSessionToken(token: string): void;
    request<T>(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T>;
    get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>;
    post<T>(path: string, body?: unknown, headers?: Record<string, string>): Promise<T>;
    patch<T>(path: string, body?: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
}

interface CreateSessionParams {
    amount: number;
    currency: Currency;
    destination: Destination;
    description?: string;
    reference?: string;
    redirect_url?: string;
    webhook_url?: string;
    metadata?: Record<string, string>;
}
interface PaymentSession {
    session_id: string;
    status: PaymentStatus;
    amount: number;
    currency: Currency;
    destination: Destination;
    description?: string;
    reference?: string;
    checkout_url: string;
    redirect_url?: string;
    created_at: string;
    expires_at: string;
    completed_at?: string;
}
interface ListSessionsParams {
    status?: PaymentStatus;
    limit?: number;
    cursor?: string;
    from_date?: string;
    to_date?: string;
}
interface ListSessionsResponse {
    sessions: PaymentSession[];
    pagination: Pagination;
}
interface CreateMandateParams {
    customer_alias: string;
    amount: number;
    currency: Currency;
    interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
    description: string;
    start_date: string;
    end_date?: string;
    max_amount?: number;
    webhook_url?: string;
}
interface Mandate {
    mandate_id: string;
    status: string;
    customer_alias: string;
    amount: number;
    currency: Currency;
    interval: string;
    description: string;
    start_date: string;
    end_date?: string;
    created_at: string;
}
declare class PaymentsClient {
    private http;
    constructor(http: HttpClient);
    createSession(params: CreateSessionParams): Promise<PaymentSession>;
    getSession(sessionId: string): Promise<PaymentSession>;
    listSessions(params?: ListSessionsParams): Promise<ListSessionsResponse>;
    cancelSession(sessionId: string): Promise<void>;
    createMandate(params: CreateMandateParams): Promise<Mandate>;
    getMandate(mandateId: string): Promise<Mandate>;
    cancelMandate(mandateId: string): Promise<void>;
    chargeMandate(mandateId: string, params: {
        amount: number;
        reference?: string;
    }): Promise<{
        charge_id: string;
        status: string;
    }>;
}

interface AliasProfile {
    alias_username: string;
    is_active: boolean;
    bank_handle: string;
    customer_id?: string;
    created_at: string;
}
interface LinkedAccount {
    iban: string;
    currency: Currency;
    account_name?: string;
    bank_handle: string;
    is_default: boolean;
}
interface AliasAccountsResponse {
    alias_username: string;
    accounts: LinkedAccount[];
}
declare class AliasClient {
    private http;
    constructor(http: HttpClient);
    get(username: string): Promise<AliasProfile>;
    getAccounts(username: string): Promise<AliasAccountsResponse>;
    deactivate(username: string): Promise<void>;
    resolve(alias: string): Promise<{
        iban: string;
        bank_handle: string;
        currency: Currency;
    }>;
}

type OBScope = 'accounts:read' | 'balances:read' | 'transactions:read' | 'payments:write';
interface CreateConsentParams {
    bank_handle: string;
    scopes: OBScope[];
    redirect_uri: string;
    state: string;
    code_challenge: string;
    code_challenge_method: 'S256';
    expiry_days?: number;
}
interface Consent {
    consent_id: string;
    status: ConsentStatus;
    bank_handle: string;
    scopes: OBScope[];
    redirect_uri: string;
    consent_url: string;
    created_at: string;
    expires_at: string;
}
interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: string;
}
interface OBAccount {
    account_id: string;
    iban: string;
    currency: Currency;
    account_type: 'CURRENT' | 'SAVINGS' | string;
    display_name?: string;
}
interface OBBalance {
    account_id: string;
    available: number;
    current: number;
    currency: Currency;
    as_of: string;
}
interface OBTransaction {
    transaction_id: string;
    amount: number;
    currency: Currency;
    direction: 'DEBIT' | 'CREDIT';
    narrative?: string;
    reference?: string;
    value_date: string;
    booking_date: string;
}
interface OBTransactionsResponse {
    account_id: string;
    transactions: OBTransaction[];
}
interface CreatePaymentOrderParams {
    source_account_id: string;
    destination: Destination;
    amount: number;
    currency: Currency;
    description?: string;
    reference?: string;
}
interface PaymentOrder {
    order_id: string;
    status: PaymentOrderStatus;
    amount: number;
    currency: Currency;
    destination: Destination;
    description?: string;
    reference?: string;
    sca_url?: string;
    created_at: string;
}
interface BankCapabilities {
    bank_handle: string;
    ob_enabled: boolean;
    ob_scopes_supported: OBScope[];
    sca_exemption_limit: number;
    max_consent_expiry_days: number;
}
declare class OpenBankingClient {
    private http;
    constructor(http: HttpClient);
    getBankCapabilities(bankHandle: string): Promise<BankCapabilities>;
    createConsent(params: CreateConsentParams): Promise<Consent>;
    getConsent(consentId: string): Promise<Consent>;
    revokeConsent(consentId: string): Promise<void>;
    exchangeCode(params: {
        code: string;
        redirect_uri: string;
        consent_id: string;
        code_verifier: string;
    }): Promise<TokenResponse>;
    refreshToken(params: {
        refresh_token: string;
        consent_id: string;
    }): Promise<TokenResponse>;
    revokeToken(token: string): Promise<void>;
    getAccounts(consentId: string): Promise<{
        accounts: OBAccount[];
    }>;
    getBalances(accountId: string, consentId: string): Promise<OBBalance>;
    getTransactions(accountId: string, consentId: string, params?: {
        fromDate?: string;
        toDate?: string;
        count?: number;
    }): Promise<OBTransactionsResponse>;
    createPaymentOrder(params: CreatePaymentOrderParams, consentId: string): Promise<PaymentOrder>;
    getPaymentOrder(orderId: string): Promise<PaymentOrder>;
}

interface IdentityProfile {
    npt_handle: string;
    customer_display_name: string;
    default_bank_handle: string;
    default_iban: string;
    created_at: string;
}
interface IdentityAccount {
    bank_handle: string;
    iban: string;
    currency: Currency;
    is_default: boolean;
    linked_at: string;
}
interface ClaimHandleParams {
    npt_handle: string;
    iban: string;
    customer_display_name: string;
    bank_customer_ref: string;
}
interface ResolveResult {
    npt_handle: string;
    iban: string;
    bank_handle: string;
    currency: Currency;
}
interface BankEntry {
    bank_handle: string;
    display_name: string;
    country: string;
    ob_enabled: boolean;
}
interface RegistryInfo {
    operator: string;
    source_url: string;
    version: string;
    total_handles: number;
    total_banks: number;
}
declare class IdentityClient {
    private http;
    constructor(http: HttpClient);
    resolve(alias: string): Promise<ResolveResult>;
    getProfile(handle: string): Promise<IdentityProfile>;
    claimHandle(params: ClaimHandleParams): Promise<{
        npt_handle: string;
        bank_key: string;
    }>;
    getAccounts(handle: string): Promise<{
        accounts: IdentityAccount[];
    }>;
    linkAccount(handle: string, params: {
        iban: string;
        currency: Currency;
        bank_handle: string;
    }): Promise<IdentityAccount>;
    setDefaultAccount(handle: string, bankHandle: string): Promise<void>;
    deleteIdentity(handle: string): Promise<void>;
    listBanks(): Promise<{
        banks: BankEntry[];
    }>;
    getRegistryInfo(): Promise<RegistryInfo>;
}

type WebhookHandler<T = unknown> = (payload: WebhookPayload<T>) => void | Promise<void>;
declare function verifyWebhookSignature(rawBody: string, signature: string, secret: string): Promise<boolean>;
declare function parseWebhookPayload<T = unknown>(rawBody: string): WebhookPayload<T>;
declare class WebhookReceiver {
    private handlers;
    private secret;
    constructor(secret: string);
    on<T = unknown>(event: WebhookEvent | '*', handler: WebhookHandler<T>): this;
    handle(rawBody: string, signature: string): Promise<void>;
}

declare class AstroClient {
    readonly payments: PaymentsClient;
    readonly alias: AliasClient;
    readonly openBanking: OpenBankingClient;
    readonly identity: IdentityClient;
    readonly http: HttpClient;
    constructor(config: AstroConfig);
}
declare function createClient(config: AstroConfig): AstroClient;

export { type AliasAccountsResponse, AliasClient, type AliasProfile, AstroClient, type AstroConfig, type AstroError, AstroRequestError, type BankCapabilities, type BankEntry, type ClaimHandleParams, type Consent, type ConsentStatus, type CreateConsentParams, type CreateMandateParams, type CreatePaymentOrderParams, type CreateSessionParams, type Currency, type Destination, HttpClient, type IdentityAccount, IdentityClient, type IdentityProfile, type LinkedAccount, type ListSessionsParams, type ListSessionsResponse, type Mandate, type MandateStatus, type OBAccount, type OBBalance, type OBScope, type OBTransaction, type OBTransactionsResponse, OpenBankingClient, type Pagination, type PaymentOrder, type PaymentOrderStatus, type PaymentSession, type PaymentStatus, PaymentsClient, type RegistryInfo, type ResolveResult, type TokenResponse, type WebhookEvent, type WebhookHandler, type WebhookPayload, WebhookReceiver, createClient, parseWebhookPayload, verifyWebhookSignature };
