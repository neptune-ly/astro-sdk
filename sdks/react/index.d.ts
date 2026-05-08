import { PaymentSession, CreateSessionParams, ResolvePayerParams, ResolvePayerResult, SelectAuthParams, SelectAuthResult, ConfirmParams, ConfirmResult, ResolveResult, Consent, TokenResponse, CreateConsentParams, AstroConfig, AstroClient } from '@neptune.fintech/astro-sdk';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface UsePaymentSessionState {
    session: PaymentSession | null;
    loading: boolean;
    error: string | null;
}
interface UsePaymentSessionReturn extends UsePaymentSessionState {
    create: (params: CreateSessionParams) => Promise<PaymentSession | null>;
    reset: () => void;
}
declare function usePaymentSession(): UsePaymentSessionReturn;

/**
 * useCheckout — customer-facing checkout session flow.
 *
 * This hook is for use ONLY in the hosted checkout page or embedded widget.
 * It drives resolve-payer → select-auth → confirm using X-Session-Token,
 * NOT a merchant API key. Merchant API keys are blocked server-side for these paths.
 *
 * @param baseUrl  OpenWave gateway base URL
 * @param sessionToken  The X-Session-Token received from the checkout URL
 */
declare function useCheckout(baseUrl: string, sessionToken?: string): {
    resolvePayer: (sessionId: string, params: ResolvePayerParams) => Promise<ResolvePayerResult | null>;
    selectAuth: (sessionId: string, params: SelectAuthParams) => Promise<SelectAuthResult | null>;
    confirm: (sessionId: string, params: ConfirmParams) => Promise<ConfirmResult | null>;
    loading: boolean;
    error: string | null;
};

interface UseAliasResolveReturn {
    result: ResolveResult | null;
    loading: boolean;
    error: string | null;
    resolve: (alias: string) => Promise<ResolveResult | null>;
    reset: () => void;
}
declare function useAliasResolve(): UseAliasResolveReturn;

interface UseConsentReturn {
    consent: Consent | null;
    tokens: TokenResponse | null;
    loading: boolean;
    error: string | null;
    createConsent: (params: CreateConsentParams) => Promise<Consent | null>;
    exchangeCode: (code: string, codeVerifier: string) => Promise<TokenResponse | null>;
    revokeConsent: () => Promise<void>;
}
declare function useOpenBankingConsent(): UseConsentReturn;

interface AstroContextValue {
    client: AstroClient;
}
declare function AstroProvider({ config, children, }: {
    config: AstroConfig;
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useAstro(): AstroContextValue;

type SuccessEvent = {
    session_id: string;
    status: 'COMPLETED';
    reference?: string;
    receipt_url?: string;
};
type FailedEvent = {
    session_id: string;
    status: 'FAILED' | 'EXPIRED' | 'CANCELLED';
    message: string;
};
type CheckoutBranding = {
    merchantName?: string;
    merchantLogoUrl?: string;
    acquirerName?: string;
    acquirerLogoUrl?: string;
    gatewayName?: string;
    gatewayLogoUrl?: string;
    openWaveLogoUrl?: string;
    neptuneLogoUrl?: string;
    accentColor?: string;
};
interface CheckoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    sessionId: string;
    gatewayUrl?: string;
    theme?: 'light' | 'dark' | 'auto';
    branding?: CheckoutBranding;
    onSuccess?: (e: SuccessEvent) => void;
    onFailed?: (e: FailedEvent) => void;
    label?: string;
}
declare function CheckoutButton({ sessionId, gatewayUrl, theme, branding, onSuccess, onFailed, label, disabled, ...rest }: CheckoutButtonProps): react_jsx_runtime.JSX.Element;

export { AstroProvider, CheckoutButton, useAliasResolve, useAstro, useCheckout, useOpenBankingConsent, usePaymentSession };
