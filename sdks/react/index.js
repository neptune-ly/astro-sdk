// src/hooks/usePaymentSession.ts
import { useState, useCallback } from "react";

// src/AstroProvider.tsx
import { createContext, useContext, useMemo } from "react";
import { AstroClient } from "@neptune.fintech/astro-sdk";
import { jsx } from "react/jsx-runtime";
var AstroContext = createContext(null);
function AstroProvider({
  config,
  children
}) {
  const client = useMemo(() => new AstroClient(config), [config.baseUrl, config.merchantKey, config.bankKey, config.adminKey]);
  return /* @__PURE__ */ jsx(AstroContext.Provider, { value: { client }, children });
}
function useAstro() {
  const ctx = useContext(AstroContext);
  if (!ctx) throw new Error("useAstro must be used inside <AstroProvider>");
  return ctx;
}

// src/hooks/usePaymentSession.ts
function usePaymentSession() {
  const { client } = useAstro();
  const [state, setState] = useState({
    session: null,
    loading: false,
    error: null
  });
  const create = useCallback(async (params) => {
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
  const reset = useCallback(() => {
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
import { useState as useState2, useCallback as useCallback2 } from "react";
import { CheckoutClient } from "@neptune.fintech/astro-sdk";
function useCheckout(baseUrl, sessionToken) {
  const client = new CheckoutClient(
    // The CheckoutClient constructor accepts an HttpClient — we create one with no merchant key
    // and optionally a session token via a minimal config object.
    // Since CheckoutClient takes an HttpClient, we use the exported createCheckoutClient instead.
    // See createCheckoutClient() in astro-sdk for direct usage outside React.
    createMinimalHttpClient(baseUrl, sessionToken)
  );
  const [loading, setLoading] = useState2(false);
  const [error, setError] = useState2(null);
  const resolvePayer = useCallback2(
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
  const selectAuth = useCallback2(
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
  const confirm = useCallback2(
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
import { useState as useState3, useCallback as useCallback3 } from "react";
function useAliasResolve() {
  const { client } = useAstro();
  const [result, setResult] = useState3(null);
  const [loading, setLoading] = useState3(false);
  const [error, setError] = useState3(null);
  const resolve = useCallback3(async (alias) => {
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
  const reset = useCallback3(() => {
    setResult(null);
    setError(null);
  }, []);
  return { result, loading, error, resolve, reset };
}

// src/hooks/useOpenBankingConsent.ts
import { useState as useState4, useCallback as useCallback4 } from "react";
function useOpenBankingConsent() {
  const { client } = useAstro();
  const [consent, setConsent] = useState4(null);
  const [tokens, setTokens] = useState4(null);
  const [loading, setLoading] = useState4(false);
  const [error, setError] = useState4(null);
  const createConsent = useCallback4(async (params) => {
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
  const exchangeCode = useCallback4(async (code, codeVerifier) => {
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
  const revokeConsent = useCallback4(async () => {
    if (!consent) return;
    await client.openBanking.revokeConsent(consent.consent_id);
    setConsent(null);
    setTokens(null);
  }, [client, consent]);
  return { consent, tokens, loading, error, createConsent, exchangeCode, revokeConsent };
}

// src/components/CheckoutButton.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx2("button", { onClick: handleClick, disabled, ...rest, children: label });
}
export {
  AstroProvider,
  CheckoutButton,
  useAliasResolve,
  useAstro,
  useCheckout,
  useOpenBankingConsent,
  usePaymentSession
};
