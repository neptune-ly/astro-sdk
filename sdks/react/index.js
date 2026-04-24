var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/hooks/usePaymentSession.ts
import { useState, useCallback } from "react";

// src/AstroProvider.tsx
import { createContext, useContext, useMemo } from "react";
import { AstroClient } from "@neptune-astro/sdk";
import { jsx } from "react/jsx-runtime";
var AstroContext = createContext(null);
function AstroProvider({
  config,
  children
}) {
  const client = useMemo(() => new AstroClient(config), [config.baseUrl]);
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
      const msg = err?.message ?? "Failed to create session";
      setState({ session: null, loading: false, error: msg });
      return null;
    }
  }, [client]);
  const reset = useCallback(() => {
    setState({ session: null, loading: false, error: null });
  }, []);
  return { ...state, create, reset };
}

// src/hooks/useAliasResolve.ts
import { useState as useState2, useCallback as useCallback2 } from "react";
function useAliasResolve() {
  const { client } = useAstro();
  const [result, setResult] = useState2(null);
  const [loading, setLoading] = useState2(false);
  const [error, setError] = useState2(null);
  const resolve = useCallback2(async (alias) => {
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
  const reset = useCallback2(() => {
    setResult(null);
    setError(null);
  }, []);
  return { result, loading, error, resolve, reset };
}

// src/hooks/useOpenBankingConsent.ts
import { useState as useState3, useCallback as useCallback3 } from "react";
function useOpenBankingConsent() {
  const { client } = useAstro();
  const [consent, setConsent] = useState3(null);
  const [tokens, setTokens] = useState3(null);
  const [loading, setLoading] = useState3(false);
  const [error, setError] = useState3(null);
  const createConsent = useCallback3(async (params) => {
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
  const exchangeCode = useCallback3(async (code, codeVerifier) => {
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
  const revokeConsent = useCallback3(async () => {
    if (!consent) return;
    await client.openBanking.revokeConsent(consent.consent_id);
    setConsent(null);
    setTokens(null);
  }, [client, consent]);
  return { consent, tokens, loading, error, createConsent, exchangeCode, revokeConsent };
}

// src/components/CheckoutButton.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var { checkout } = __require("@neptune-astro/web-sdk");
function CheckoutButton({
  sessionId,
  gatewayUrl,
  theme = "auto",
  onSuccess,
  onFailed,
  label = "Pay Now",
  disabled,
  ...rest
}) {
  function handleClick() {
    checkout({ sessionId, gatewayUrl, theme, onSuccess, onFailed });
  }
  return /* @__PURE__ */ jsx2("button", { onClick: handleClick, disabled, ...rest, children: label });
}
export {
  AstroProvider,
  CheckoutButton,
  useAliasResolve,
  useAstro,
  useOpenBankingConsent,
  usePaymentSession
};
