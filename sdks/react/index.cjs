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
  AstroProvider: () => AstroProvider,
  CheckoutButton: () => CheckoutButton,
  useAliasResolve: () => useAliasResolve,
  useAstro: () => useAstro,
  useCheckout: () => useCheckout,
  useOpenBankingConsent: () => useOpenBankingConsent,
  usePaymentSession: () => usePaymentSession
});
module.exports = __toCommonJS(index_exports);

// src/hooks/usePaymentSession.ts
var import_react2 = require("react");

// src/AstroProvider.tsx
var import_react = require("react");
var import_astro_sdk = require("@neptune.fintech/astro-sdk");
var import_jsx_runtime = require("react/jsx-runtime");
var AstroContext = (0, import_react.createContext)(null);
function AstroProvider({
  config,
  children
}) {
  const client = (0, import_react.useMemo)(() => new import_astro_sdk.AstroClient(config), [config.baseUrl, config.merchantKey, config.bankKey, config.adminKey]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AstroContext.Provider, { value: { client }, children });
}
function useAstro() {
  const ctx = (0, import_react.useContext)(AstroContext);
  if (!ctx) throw new Error("useAstro must be used inside <AstroProvider>");
  return ctx;
}

// src/hooks/usePaymentSession.ts
function usePaymentSession() {
  const { client } = useAstro();
  const [state, setState] = (0, import_react2.useState)({
    session: null,
    loading: false,
    error: null
  });
  const create = (0, import_react2.useCallback)(async (params) => {
    setState({ session: null, loading: true, error: null });
    try {
      const session = await client.payments.createSession(params);
      setState({ session, loading: false, error: null });
      return session;
    } catch (err) {
      const msg = formatSessionCreateError(err);
      setState({ session: null, loading: false, error: msg });
      return null;
    }
  }, [client]);
  const reset = (0, import_react2.useCallback)(() => {
    setState({ session: null, loading: false, error: null });
  }, []);
  return { ...state, create, reset };
}
function formatSessionCreateError(err) {
  const status = err?.status;
  const code = err?.code;
  if (status === 401 || status === 403) {
    return "Merchant credential was rejected. Rotate or copy the current merchant access credential from the gateway portal and update the demo configuration.";
  }
  if (code && err?.message) return `${code}: ${err.message}`;
  return err?.message ?? "Failed to create payment session";
}

// src/hooks/useCheckout.ts
var import_react3 = require("react");
var import_astro_sdk2 = require("@neptune.fintech/astro-sdk");
function useCheckout(baseUrl, sessionToken) {
  const client = new import_astro_sdk2.CheckoutClient(
    // The CheckoutClient constructor accepts an HttpClient — we create one with no merchant key
    // and optionally a session token via a minimal config object.
    // Since CheckoutClient takes an HttpClient, we use the exported createCheckoutClient instead.
    // See createCheckoutClient() in astro-sdk for direct usage outside React.
    createMinimalHttpClient(baseUrl, sessionToken)
  );
  const [loading, setLoading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const resolvePayer = (0, import_react3.useCallback)(
    async (sessionId, params) => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.resolvePayer(sessionId, params);
        return result;
      } catch (e) {
        setError(e?.message ?? "Failed to resolve payer");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );
  const selectAuth = (0, import_react3.useCallback)(
    async (sessionId, params) => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.selectAuth(sessionId, params);
        return result;
      } catch (e) {
        setError(e?.message ?? "Failed to send auth challenge");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );
  const confirm = (0, import_react3.useCallback)(
    async (sessionId, params) => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.confirm(sessionId, params);
        return result;
      } catch (e) {
        setError(e?.message ?? "Payment confirmation failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [client]
  );
  return { resolvePayer, selectAuth, confirm, loading, error };
}
function createMinimalHttpClient(baseUrl, sessionToken) {
  const base = baseUrl.replace(/\/$/, "");
  const headers = { "Content-Type": "application/json" };
  if (sessionToken) headers["X-Session-Token"] = sessionToken;
  return {
    post: async (path, body) => {
      const res = await fetch(`${base}/api/v1${path}`, {
        method: "POST",
        headers,
        body: body !== void 0 ? JSON.stringify(body) : void 0
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const e = json?.error ?? json?.message ?? `HTTP ${res.status}`;
        throw new Error(typeof e === "string" ? e : JSON.stringify(e));
      }
      return json;
    }
  };
}

// src/hooks/useAliasResolve.ts
var import_react4 = require("react");
function useAliasResolve() {
  const { client } = useAstro();
  const [result, setResult] = (0, import_react4.useState)(null);
  const [loading, setLoading] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const resolve = (0, import_react4.useCallback)(async (alias) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await client.identity.resolve(alias);
      setResult(r);
      return r;
    } catch (err) {
      setError(err?.message ?? "Alias not found");
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);
  const reset = (0, import_react4.useCallback)(() => {
    setResult(null);
    setError(null);
  }, []);
  return { result, loading, error, resolve, reset };
}

// src/hooks/useOpenBankingConsent.ts
var import_react5 = require("react");
function useOpenBankingConsent() {
  const { client } = useAstro();
  const [consent, setConsent] = (0, import_react5.useState)(null);
  const [tokens, setTokens] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)(null);
  const createConsent = (0, import_react5.useCallback)(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const c = await client.openBanking.createConsent(params);
      setConsent(c);
      return c;
    } catch (err) {
      setError(err?.message ?? "Failed to create consent");
      return null;
    } finally {
      setLoading(false);
    }
  }, [client]);
  const exchangeCode = (0, import_react5.useCallback)(async (code, codeVerifier) => {
    if (!consent) return null;
    setLoading(true);
    setError(null);
    try {
      const t = await client.openBanking.exchangeCode({
        code,
        redirect_uri: "",
        consent_id: consent.consent_id,
        code_verifier: codeVerifier
      });
      setTokens(t);
      return t;
    } catch (err) {
      setError(err?.message ?? "Token exchange failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, [client, consent]);
  const revokeConsent = (0, import_react5.useCallback)(async () => {
    if (!consent) return;
    await client.openBanking.revokeConsent(consent.consent_id);
    setConsent(null);
    setTokens(null);
  }, [client, consent]);
  return { consent, tokens, loading, error, createConsent, exchangeCode, revokeConsent };
}

// src/components/CheckoutButton.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
async function getCheckout() {
  const mod = await import("@neptune.fintech/astro-web");
  return mod.checkout;
}
function CheckoutButton({
  sessionId,
  gatewayUrl,
  theme = "auto",
  branding,
  onSuccess,
  onFailed,
  label = "Pay Now",
  disabled,
  ...rest
}) {
  async function handleClick() {
    const checkout = await getCheckout();
    checkout({ sessionId, gatewayUrl, theme, branding, onSuccess, onFailed });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("button", { onClick: handleClick, disabled, ...rest, children: label });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AstroProvider,
  CheckoutButton,
  useAliasResolve,
  useAstro,
  useCheckout,
  useOpenBankingConsent,
  usePaymentSession
});
