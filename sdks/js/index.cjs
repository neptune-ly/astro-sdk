"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AliasClient: () => AliasClient,
  AstroClient: () => AstroClient,
  AstroRequestError: () => AstroRequestError,
  CheckoutClient: () => CheckoutClient,
  HttpClient: () => HttpClient,
  IdentityClient: () => IdentityClient,
  OpenBankingClient: () => OpenBankingClient,
  PaymentsClient: () => PaymentsClient,
  WebhookReceiver: () => WebhookReceiver,
  createCheckoutClient: () => createCheckoutClient,
  createClient: () => createClient,
  parseWebhookPayload: () => parseWebhookPayload,
  verifyWebhookSignature: () => verifyWebhookSignature
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var AstroRequestError = class extends Error {
  constructor(status, error) {
    super(error.message || `HTTP ${status}`);
    this.name = "AstroRequestError";
    this.status = status;
    this.code = error.code;
    this.detail = error.detail;
    this.requestId = error.request_id;
  }
};
var HttpClient = class {
  constructor(config) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout ?? 3e4;
    this.defaultHeaders = { "Content-Type": "application/json" };
    if (config.merchantKey) {
      this.defaultHeaders["Authorization"] = `Bearer ${config.merchantKey}`;
    }
    if (config.bankKey) {
      this.defaultHeaders["X-OpenWave-Bank-Key"] = config.bankKey;
    }
    if (config.adminKey) {
      this.defaultHeaders["X-OpenWave-Admin-Key"] = config.adminKey;
    }
  }
  setMerchantKey(key) {
    this.defaultHeaders["Authorization"] = `Bearer ${key}`;
    delete this.defaultHeaders["X-OpenWave-Bank-Key"];
    delete this.defaultHeaders["X-OpenWave-Admin-Key"];
  }
  setBankKey(key) {
    this.defaultHeaders["X-OpenWave-Bank-Key"] = key;
    delete this.defaultHeaders["Authorization"];
    delete this.defaultHeaders["X-OpenWave-Admin-Key"];
  }
  setAdminKey(key) {
    this.defaultHeaders["X-OpenWave-Admin-Key"] = key;
    delete this.defaultHeaders["Authorization"];
    delete this.defaultHeaders["X-OpenWave-Bank-Key"];
  }
  setSessionToken(token) {
    this.defaultHeaders["X-Session-Token"] = token;
  }
  clearSessionToken() {
    delete this.defaultHeaders["X-Session-Token"];
  }
  async request(method, path, body, extraHeaders) {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const res = await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...extraHeaders },
        body: body !== void 0 ? JSON.stringify(body) : void 0,
        signal: controller.signal
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const j = json;
        const raw = j?.error ?? (j?.code || j?.message ? j : null);
        const errBody = typeof raw === "string" ? { code: `HTTP_${res.status}`, message: raw } : {
          code: raw?.code ?? `HTTP_${res.status}`,
          message: raw?.message ?? raw?.error ?? `HTTP ${res.status}`,
          detail: raw?.detail,
          request_id: raw?.request_id
        };
        throw new AstroRequestError(res.status, errBody);
      }
      return json;
    } finally {
      clearTimeout(timer);
    }
  }
  get(path, params) {
    const url = params ? path + "?" + new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== void 0).map(([k, v]) => [k, String(v)])
    ).toString() : path;
    return this.request("GET", url);
  }
  post(path, body, headers) {
    return this.request("POST", path, body, headers);
  }
  patch(path, body) {
    return this.request("PATCH", path, body);
  }
  delete(path) {
    return this.request("DELETE", path);
  }
};

// src/payments/index.ts
var PaymentsClient = class {
  constructor(http) {
    this.http = http;
  }
  async createSession(params) {
    return this.http.post("/payments/sessions", params);
  }
  async getSession(sessionId) {
    return this.http.get(`/payments/sessions/${sessionId}`);
  }
  async listSessions(params) {
    return this.http.get("/payments/sessions", params);
  }
  async previewFee(bankHandle, amount) {
    return this.http.get("/payments/fee", { bankHandle, amount });
  }
  async cancelSession(sessionId) {
    return this.http.post(`/payments/sessions/${sessionId}/cancel`);
  }
  async createMandate(params) {
    return this.http.post("/recurring/mandates", params);
  }
  async getMandate(mandateId) {
    return this.http.get(`/recurring/mandates/${mandateId}`);
  }
  async cancelMandate(mandateId) {
    return this.http.delete(`/recurring/mandates/${mandateId}`);
  }
  async chargeMandate(mandateId, params) {
    return this.http.post(`/recurring/mandates/${mandateId}/charge`, params);
  }
};

// src/checkout/index.ts
var CheckoutClient = class {
  constructor(http) {
    this.http = http;
  }
  /**
   * Resolve payer identity from alias or IBAN.
   * Returns masked phone + available accounts for the customer to select from.
   */
  async resolvePayer(sessionId, params) {
    return this.http.post(
      `/payments/sessions/${sessionId}/resolve-payer`,
      params
    );
  }
  /**
   * Customer selects authentication method (OTP or PUSH).
   * The bank will send an OTP SMS or push notification.
   */
  async selectAuth(sessionId, params) {
    return this.http.post(
      `/payments/sessions/${sessionId}/select-auth`,
      params
    );
  }
  /**
   * Customer confirms payment with OTP code or push approval.
   * On success returns COMPLETED status and the bank transfer reference.
   */
  async confirm(sessionId, params) {
    return this.http.post(
      `/payments/sessions/${sessionId}/confirm`,
      params
    );
  }
};

// src/alias/index.ts
var AliasClient = class {
  constructor(http) {
    this.http = http;
  }
  async get(username) {
    return this.http.get(`/alias/${encodeURIComponent(username)}`);
  }
  async getAccounts(username) {
    return this.http.get(
      `/alias/${encodeURIComponent(username)}/accounts`
    );
  }
  async deactivate(username) {
    return this.http.delete(`/alias/${encodeURIComponent(username)}`);
  }
  async resolve(alias) {
    return this.http.get(`/v1/identity/resolve`, { alias });
  }
};

// src/openbanking/index.ts
var OpenBankingClient = class {
  constructor(http) {
    this.http = http;
  }
  async getBankCapabilities(bankHandle) {
    return this.http.get(`/banks/${bankHandle}/capabilities`);
  }
  async createConsent(params) {
    return this.http.post("/ob/consents", params);
  }
  async getConsent(consentId) {
    return this.http.get(`/ob/consents/${consentId}`);
  }
  async revokeConsent(consentId) {
    return this.http.delete(`/ob/consents/${consentId}`);
  }
  async exchangeCode(params) {
    return this.http.post("/ob/token", {
      grant_type: "authorization_code",
      ...params
    });
  }
  async refreshToken(params) {
    return this.http.post("/ob/token", {
      grant_type: "refresh_token",
      ...params
    });
  }
  async revokeToken(token) {
    return this.http.post("/ob/token/revoke", { token });
  }
  async getAccounts(consentId) {
    return this.http.get("/ob/accounts", void 0);
  }
  async getBalances(accountId, consentId) {
    return this.http.get(`/ob/accounts/${accountId}/balances`);
  }
  async getTransactions(accountId, consentId, params) {
    return this.http.get(
      `/ob/accounts/${accountId}/transactions`,
      params
    );
  }
  async createPaymentOrder(params, consentId) {
    return this.http.post("/ob/payment-orders", params, {
      "X-Consent-Id": consentId
    });
  }
  async getPaymentOrder(orderId) {
    return this.http.get(`/ob/payment-orders/${orderId}`);
  }
};

// src/identity/index.ts
var IdentityClient = class {
  constructor(http) {
    this.http = http;
  }
  async resolve(alias) {
    return this.http.get("/v1/identity/resolve", { alias });
  }
  async getProfile(handle) {
    return this.http.get(`/v1/identity/${encodeURIComponent(handle)}`);
  }
  async claimHandle(params) {
    return this.http.post("/v1/identity/claim", params);
  }
  async getAccounts(handle) {
    return this.http.get(`/v1/identity/${encodeURIComponent(handle)}/accounts`);
  }
  async linkAccount(handle, params) {
    return this.http.post(`/v1/identity/${encodeURIComponent(handle)}/accounts`, params);
  }
  async setDefaultAccount(handle, bankHandle) {
    return this.http.patch(`/v1/identity/${encodeURIComponent(handle)}/default`, {
      bank_handle: bankHandle
    });
  }
  async deleteIdentity(handle) {
    return this.http.delete(`/v1/identity/${encodeURIComponent(handle)}`);
  }
  async listBanks() {
    return this.http.get("/v1/banks");
  }
  async getRegistryInfo() {
    return this.http.get("/v1/registry/info");
  }
};

// src/webhooks/index.ts
async function hmacSha256(secret, data) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  const { createHmac } = await import("crypto");
  return createHmac("sha256", secret).update(data).digest("hex");
}
async function verifyWebhookSignature(rawBody, signature, secret) {
  const expected = "sha256=" + await hmacSha256(secret, rawBody);
  return signature === expected;
}
function parseWebhookPayload(rawBody) {
  return JSON.parse(rawBody);
}
var WebhookReceiver = class {
  constructor(secret) {
    this.handlers = /* @__PURE__ */ new Map();
    this.secret = secret;
  }
  on(event, handler) {
    const existing = this.handlers.get(event) ?? [];
    existing.push(handler);
    this.handlers.set(event, existing);
    return this;
  }
  async handle(rawBody, signature) {
    const valid = await verifyWebhookSignature(rawBody, signature, this.secret);
    if (!valid) throw new Error("Invalid webhook signature");
    const payload = parseWebhookPayload(rawBody);
    const handlers = [
      ...this.handlers.get(payload.event) ?? [],
      ...this.handlers.get("*") ?? []
    ];
    await Promise.all(handlers.map((h) => h(payload)));
  }
};

// src/index.ts
var AstroClient = class {
  constructor(config) {
    this.http = new HttpClient(config);
    this.payments = new PaymentsClient(this.http);
    this.checkout = new CheckoutClient(this.http);
    this.alias = new AliasClient(this.http);
    this.openBanking = new OpenBankingClient(this.http);
    this.identity = new IdentityClient(this.http);
  }
};
function createClient(config) {
  return new AstroClient(config);
}
function createCheckoutClient(opts) {
  const http = new HttpClient({ baseUrl: opts.baseUrl, timeout: opts.timeout });
  if (opts.sessionToken) http.setSessionToken(opts.sessionToken);
  return new CheckoutClient(http);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AliasClient,
  AstroClient,
  AstroRequestError,
  CheckoutClient,
  HttpClient,
  IdentityClient,
  OpenBankingClient,
  PaymentsClient,
  WebhookReceiver,
  createCheckoutClient,
  createClient,
  parseWebhookPayload,
  verifyWebhookSignature
});
