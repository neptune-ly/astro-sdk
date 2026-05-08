export interface CheckoutSuccessEvent {
    session_id: string;
    status: 'COMPLETED';
    reference?: string;
    receipt_url?: string;
}
export interface CheckoutFailedEvent {
    session_id: string;
    status: 'FAILED' | 'EXPIRED' | 'CANCELLED';
    message: string;
    code?: string;
}
export interface CheckoutBranding {
    merchantName?: string;
    merchantLogoUrl?: string;
    acquirerName?: string;
    acquirerLogoUrl?: string;
    gatewayName?: string;
    gatewayLogoUrl?: string;
    openWaveLogoUrl?: string;
    neptuneLogoUrl?: string;
    accentColor?: string;
}
export interface CheckoutOptions {
    sessionId: string;
    gatewayUrl?: string;
    locale?: 'en' | 'ar';
    theme?: 'light' | 'dark' | 'auto';
    branding?: CheckoutBranding;
    onSuccess?: (event: CheckoutSuccessEvent) => void;
    onFailed?: (event: CheckoutFailedEvent) => void;
    onDismiss?: () => void;
}
export declare function checkout(options: CheckoutOptions): void;
export declare function dismiss(): void;
