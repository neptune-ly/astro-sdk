import { PaymentSession, CreateSessionParams, ResolveResult, Consent, TokenResponse, CreateConsentParams, AstroConfig, AstroClient } from '@neptune-astro/sdk';
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
interface CheckoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    sessionId: string;
    gatewayUrl?: string;
    theme?: 'light' | 'dark' | 'auto';
    onSuccess?: (e: SuccessEvent) => void;
    onFailed?: (e: FailedEvent) => void;
    label?: string;
}
declare function CheckoutButton({ sessionId, gatewayUrl, theme, onSuccess, onFailed, label, disabled, ...rest }: CheckoutButtonProps): react_jsx_runtime.JSX.Element;

export { AstroProvider, CheckoutButton, useAliasResolve, useAstro, useOpenBankingConsent, usePaymentSession };
