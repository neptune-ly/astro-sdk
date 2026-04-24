// src/client.ts
var AstroRequestError = class extends Error {
  constructor(status, error) {
    super(error.message);
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
        throw new AstroRequestError(res.status, json?.error ?? {
          code: "UNKNOWN_ERROR",
          message: `HTTP ${res.status}`
        });
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
    this.alias = new AliasClient(this.http);
    this.openBanking = new OpenBankingClient(this.http);
    this.identity = new IdentityClient(this.http);
  }
};
function createClient(config) {
  return new AstroClient(config);
}
export {
  AliasClient,
  AstroClient,
  AstroRequestError,
  HttpClient,
  IdentityClient,
  OpenBankingClient,
  PaymentsClient,
  WebhookReceiver,
  createClient,
  parseWebhookPayload,
  verifyWebhookSignature
};
