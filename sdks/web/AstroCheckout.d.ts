import type { CheckoutOptions } from './checkout.js';
export declare class AstroCheckout {
    private options;
    private overlay;
    private styleEl;
    private step;
    private aliasValue;
    private errorMsg;
    private sessionData;
    private selectedAuth;
    constructor(options: CheckoutOptions);
    mount(): void;
    destroy(): void;
    private injectStyles;
    private render;
    private renderHTML;
    private bindEvents;
    private handleAliasContinue;
    private handleAuthSelect;
    private pollPushStatus;
    private handleOtpConfirm;
    private handleDismiss;
    private resolveTheme;
    private escapeHtml;
    private safeUrl;
    private safeColor;
    private headers;
}
