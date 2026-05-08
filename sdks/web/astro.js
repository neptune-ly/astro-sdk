const S = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" fill="none"><rect x="10" y="10" width="100" height="100" rx="28" fill="#07315F"/><path d="M28 72c12-25 24-37 36-37 10 0 16 9 24 18 9 10 18 19 34 3" stroke="#F0CE9D" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="64" cy="35" r="5" fill="#EB4E4D"/><circle cx="122" cy="56" r="5" fill="#00A8AE"/><text x="128" y="68" fill="#07315F" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="42" font-weight="760">OpenWave</text><text x="130" y="91" fill="#6e6e73" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="15" font-weight="560">Neptune-built open standard</text></svg>')}`, E = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" fill="none"><rect x="10" y="10" width="100" height="100" rx="30" fill="#07315F"/><path d="M36 76 60 29l24 47M45 59h30" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="31" r="6" fill="white" opacity=".9"/><text x="128" y="66" fill="#07315F" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="45" font-weight="780">Astro</text><text x="130" y="90" fill="#6e6e73" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="15" font-weight="560">Neptune OpenWave gateway</text></svg>')}`, L = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 120" fill="none"><rect x="10" y="10" width="100" height="100" rx="30" fill="#07315F"/><path d="M34 78V40l26 38 26-38v38" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="88" cy="32" r="7" fill="#00A8AE"/><circle cx="32" cy="88" r="7" fill="#EB4E4D"/><text x="128" y="64" fill="#07315F" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="38" font-weight="780">Neptune</text><text x="130" y="89" fill="#6e6e73" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" font-size="15" font-weight="560">Financial Technology</text></svg>')}`, M = `
  .ow-overlay {
    position: fixed; inset: 0; z-index: 999999;
    background: rgba(0,0,0,0.34); backdrop-filter: blur(18px) saturate(1.2);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; animation: ow-fadein 0.18s ease;
  }
  .ow-modal {
    --ow-accent: #07315F;
    background: rgba(255,255,255,0.94); border-radius: 28px;
    width: 100%; max-width: 456px; overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.7);
    animation: ow-slidein 0.24s cubic-bezier(.2,.8,.2,1);
    font-family: "SF Compact Rounded", "SF Pro Rounded", "Beiruti", -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1d1d1f;
  }
  .ow-modal[data-theme=dark] {
    background: rgba(29,29,31,0.92); color: #f5f5f7;
    box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08);
  }
  .ow-header {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1.15rem 1.25rem; border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  [data-theme=dark] .ow-header { border-color: rgba(255,255,255,0.08); }
  .ow-brand { display: flex; align-items: center; gap: 0.7rem; min-width: 0; flex: 1; }
  .ow-logo {
    width: 34px; height: 34px; border-radius: 10px; object-fit: cover;
    background: var(--ow-accent);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 0.74rem; font-weight: 750; letter-spacing: 0;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22);
  }
  .ow-logo-wide { width: 72px; height: 32px; border-radius: 0; background: transparent; object-fit: contain; box-shadow: none; }
  .ow-title { display: block; font-size: 0.98rem; font-weight: 760; color: inherit; line-height: 1.1; }
  .ow-subtitle { display: block; font-size: 0.72rem; color: #86868b; margin-top: 0.12rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  [data-theme=dark] .ow-subtitle { color: #a1a1a6; }
  .ow-rail {
    display: flex; align-items: center; gap: 0.55rem; padding: 0 1.25rem 1rem;
  }
  .ow-chip {
    display: inline-flex; align-items: center; gap: 0.42rem; min-width: 0;
    border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.035);
    border-radius: 999px; padding: 0.32rem 0.55rem; color: #6e6e73;
    font-size: 0.68rem; font-weight: 640;
  }
  [data-theme=dark] .ow-chip { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.07); color: #a1a1a6; }
  .ow-chip img { width: 18px; height: 18px; border-radius: 6px; object-fit: cover; }
  .ow-standard {
    margin-left: auto;
    background: color-mix(in srgb, var(--ow-accent) 10%, transparent);
    color: var(--ow-accent);
    border-color: color-mix(in srgb, var(--ow-accent) 24%, transparent);
  }
  .ow-close {
    width: 32px; height: 32px; border: none; cursor: pointer; font-size: 1.25rem;
    color: #6e6e73; border-radius: 999px; background: rgba(0,0,0,0.05);
    transition: background 0.15s, color 0.15s;
  }
  .ow-close:hover { background: rgba(0,0,0,0.09); color: #1d1d1f; }
  [data-theme=dark] .ow-close { background: rgba(255,255,255,0.1); color: #d2d2d7; }
  [data-theme=dark] .ow-close:hover { background: rgba(255,255,255,0.16); color: #fff; }
  .ow-body { padding: 1.35rem 1.25rem 1.25rem; }
  .ow-amount {
    text-align: center; padding: 1.1rem 1rem;
    background: rgba(0,0,0,0.035); border: 1px solid rgba(0,0,0,0.05);
    border-radius: 18px; margin-bottom: 1.1rem;
  }
  [data-theme=dark] .ow-amount { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
  .ow-amount-value { font-size: 2rem; font-weight: 780; color: inherit; letter-spacing: 0; }
  .ow-amount-currency { font-size: 0.95rem; color: #86868b; margin-left: 0.45rem; }
  .ow-label { font-size: 0.76rem; font-weight: 650; color: #6e6e73; margin-bottom: 0.45rem; }
  [data-theme=dark] .ow-label { color: #a1a1a6; }
  .ow-input {
    width: 100%; padding: 0.85rem 0.95rem; border: 1px solid rgba(0,0,0,0.12);
    border-radius: 14px; font-size: 1rem; outline: none; box-sizing: border-box;
    background: rgba(255,255,255,0.86); color: #1d1d1f;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .ow-input:focus { border-color: var(--ow-accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ow-accent) 15%, transparent); }
  [data-theme=dark] .ow-input { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14); color: #f5f5f7; }
  .ow-input-group { margin-bottom: 1rem; }
  .ow-otp-hint { font-size: 0.8rem; color: #86868b; margin-top: 0.45rem; line-height: 1.35; }
  .ow-btn {
    width: 100%; padding: 0.92rem; border: none; border-radius: 14px;
    font-size: 0.98rem; font-weight: 720; cursor: pointer;
    background: var(--ow-accent); color: #fff; margin-top: 0.5rem;
    transition: background 0.15s, transform 0.1s;
  }
  .ow-btn:hover { filter: brightness(0.94); }
  .ow-btn:active { transform: scale(0.98); }
  .ow-btn:disabled { background: #d2d2d7; cursor: not-allowed; transform: none; }
  .ow-btn-ghost {
    background: transparent; color: #6e6e73; font-size: 0.9rem; margin-top: 0.65rem;
    border: none; cursor: pointer; width: 100%; padding: 0.35rem;
  }
  .ow-error {
    color: #b42318; background: #fff1f0; border: 1px solid #ffd8d2;
    font-size: 0.875rem; margin: 0.75rem 0; text-align: left; padding: 0.75rem;
    border-radius: 14px; line-height: 1.35;
  }
  [data-theme=dark] .ow-error { color: #ffb4ab; background: rgba(255,69,58,0.14); border-color: rgba(255,69,58,0.22); }
  .ow-state { font-size: 1rem; text-align: center; padding: 1.6rem 1rem; color: inherit; }
  .ow-state-title { font-size: 1.05rem; font-weight: 740; margin-bottom: 0.35rem; }
  .ow-state-subtitle { color: #86868b; font-size: 0.86rem; line-height: 1.4; }
  .ow-state-mark {
    width: 42px; height: 42px; border-radius: 999px; margin: 0 auto 0.8rem;
    display: flex; align-items: center; justify-content: center; color: #fff;
    background: #34c759; font-weight: 800;
  }
  .ow-state-mark.fail { background: #ff3b30; }
  .ow-spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid #fff4; border-top-color: #fff; border-radius: 50%; animation: ow-spin 0.7s linear infinite; vertical-align: middle; margin-right: 0.5rem; }
  .ow-footer { padding: 0.78rem 1.25rem; border-top: 1px solid rgba(0,0,0,0.06); text-align: center; font-size: 0.73rem; color: #86868b; }
  .ow-footer-logos { display: flex; justify-content: center; align-items: center; gap: .7rem; margin-bottom: .45rem; }
  .ow-footer-logos img { max-height: 18px; max-width: 78px; object-fit: contain; }
  [data-theme=dark] .ow-footer { border-color: rgba(255,255,255,0.08); color: #a1a1a6; }
  @keyframes ow-fadein { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ow-slidein { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes ow-spin { to { transform: rotate(360deg) } }
`;
class $ {
  constructor(e) {
    this.overlay = null, this.styleEl = null, this.step = "alias", this.aliasValue = "", this.errorMsg = "", this.sessionData = null, this.options = e;
  }
  mount() {
    this.injectStyles(), this.render();
  }
  destroy() {
    var e, t;
    (e = this.overlay) == null || e.remove(), (t = this.styleEl) == null || t.remove(), this.overlay = null;
  }
  injectStyles() {
    document.getElementById("ow-styles") || (this.styleEl = document.createElement("style"), this.styleEl.id = "ow-styles", this.styleEl.textContent = M, document.head.appendChild(this.styleEl));
  }
  render() {
    var i, n, a;
    (i = this.overlay) == null || i.remove();
    const e = this.resolveTheme(), t = document.createElement("div");
    t.className = "ow-overlay", t.addEventListener("click", (l) => {
      l.target === t && this.handleDismiss();
    });
    const s = document.createElement("div");
    s.className = "ow-modal", s.setAttribute("data-theme", e), s.style.setProperty("--ow-accent", this.safeColor((n = this.options.branding) == null ? void 0 : n.accentColor) ?? "#07315F"), s.innerHTML = this.renderHTML(), t.appendChild(s), document.body.appendChild(t), this.overlay = t, this.bindEvents(s), (a = s.querySelector(".ow-alias-input")) == null || a.focus();
  }
  renderHTML() {
    var u, f;
    const e = this.options.branding ?? {}, t = this.escapeHtml(e.gatewayName ?? "OpenWave"), s = this.escapeHtml(e.merchantName ?? "Merchant checkout"), i = this.escapeHtml(e.acquirerName ?? "Bank-authenticated payment"), n = this.safeUrl(e.gatewayLogoUrl) ?? E, a = this.safeUrl(e.openWaveLogoUrl) ?? S, l = this.safeUrl(e.neptuneLogoUrl) ?? L, d = this.safeUrl(e.merchantLogoUrl), r = this.safeUrl(e.acquirerLogoUrl), c = d ?? n, o = (u = this.sessionData) == null ? void 0 : u.amount, m = ((f = this.sessionData) == null ? void 0 : f.currency) ?? "LYD", b = m === "LYD" ? 1e3 : 100, y = m === "LYD" ? 3 : 2, w = o != null ? `<div class="ow-amount"><span class="ow-amount-value">${(o / b).toFixed(y)}</span><span class="ow-amount-currency">${m}</span></div>` : "", v = `
      <div class="ow-header">
        <div class="ow-brand">
          ${c ? `<img class="ow-logo ow-logo-wide" src="${this.escapeHtml(c)}" alt="" />` : `<div class="ow-logo">${t.slice(0, 2).toUpperCase()}</div>`}
          <div>
            <span class="ow-title">${s}</span>
            <span class="ow-subtitle">${t} payment via ${i}</span>
          </div>
        </div>
        <button class="ow-close" aria-label="Close">&times;</button>
      </div>
    `, x = `
      <div class="ow-rail">
        <span class="ow-chip"><img src="${this.escapeHtml(n)}" alt="" /> ${t}</span>
        <span class="ow-chip"><img src="${this.escapeHtml(a)}" alt="" /> OpenWave</span>
        <span class="ow-chip">${r ? `<img src="${this.escapeHtml(r)}" alt="" />` : ""}${i}</span>
        <span class="ow-chip ow-standard">SCA protected</span>
      </div>
    `, k = `<div class="ow-footer"><div class="ow-footer-logos"><img src="${this.escapeHtml(l)}" alt="Neptune" /><img src="${this.escapeHtml(a)}" alt="OpenWave" /></div>Secured by <strong>${t}</strong>. The merchant never sees bank credentials.</div>`;
    let p = "";
    return this.step === "alias" ? p = `
        <div class="ow-body">
          ${w}
          <div class="ow-input-group">
            <div class="ow-label">Pay with</div>
            <input class="ow-input ow-alias-input" type="text" placeholder="your-alias or LY..." value="${this.aliasValue}" autocomplete="off" />
            <div class="ow-otp-hint">Enter your NPT alias (e.g. <strong>tellesy@andalus</strong> or <strong>tellesy</strong>) or your IBAN. Authentication happens with your bank.</div>
          </div>
          ${this.errorMsg ? `<div class="ow-error">${this.errorMsg}</div>` : ""}
          <button class="ow-btn ow-pay-btn">Continue</button>
          <button class="ow-btn-ghost ow-cancel-btn">Cancel</button>
        </div>
      ` : this.step === "otp" ? p = `
        <div class="ow-body">
          ${w}
          <div class="ow-input-group">
            <div class="ow-label">One-Time Password</div>
            <input class="ow-input ow-otp-input" type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code" />
            <div class="ow-otp-hint">Check your bank SMS for this exact payment amount. This code is never collected by the merchant.</div>
          </div>
          ${this.errorMsg ? `<div class="ow-error">${this.errorMsg}</div>` : ""}
          <button class="ow-btn ow-confirm-btn">Confirm Payment</button>
          <button class="ow-btn-ghost ow-back-btn">Change payer</button>
        </div>
      ` : this.step === "processing" ? p = '<div class="ow-body"><div class="ow-state"><span class="ow-spinner"></span><div class="ow-state-title">Processing payment</div><div class="ow-state-subtitle">Your bank is completing the authorization.</div></div></div>' : this.step === "success" ? p = '<div class="ow-body"><div class="ow-state"><div class="ow-state-mark">OK</div><div class="ow-state-title">Payment successful</div><div class="ow-state-subtitle">The merchant has received the confirmed payment status.</div></div><button class="ow-btn ow-done-btn">Done</button></div>' : this.step === "failed" && (p = `<div class="ow-body"><div class="ow-state"><div class="ow-state-mark fail">!</div><div class="ow-state-title">Payment failed</div><div class="ow-state-subtitle">${this.escapeHtml(this.errorMsg || "The bank could not complete this payment.")}</div></div><button class="ow-btn ow-retry-btn">Try again</button></div>`), v + x + p + k;
  }
  bindEvents(e) {
    var t, s, i, n, a, l, d, r, c;
    (t = e.querySelector(".ow-close")) == null || t.addEventListener("click", () => this.handleDismiss()), (s = e.querySelector(".ow-cancel-btn")) == null || s.addEventListener("click", () => this.handleDismiss()), (i = e.querySelector(".ow-pay-btn")) == null || i.addEventListener("click", () => this.handleAliasContinue(e)), (n = e.querySelector(".ow-alias-input")) == null || n.addEventListener("keydown", (o) => {
      o.key === "Enter" && this.handleAliasContinue(e);
    }), (a = e.querySelector(".ow-confirm-btn")) == null || a.addEventListener("click", () => this.handleOtpConfirm(e)), (l = e.querySelector(".ow-otp-input")) == null || l.addEventListener("keydown", (o) => {
      o.key === "Enter" && this.handleOtpConfirm(e);
    }), (d = e.querySelector(".ow-back-btn")) == null || d.addEventListener("click", () => {
      this.step = "alias", this.errorMsg = "", this.render();
    }), (r = e.querySelector(".ow-done-btn")) == null || r.addEventListener("click", () => this.destroy()), (c = e.querySelector(".ow-retry-btn")) == null || c.addEventListener("click", () => {
      this.step = "alias", this.errorMsg = "", this.render();
    });
  }
  async handleAliasContinue(e) {
    var i;
    const t = e.querySelector(".ow-alias-input");
    if (this.aliasValue = (t == null ? void 0 : t.value.trim()) ?? "", !this.aliasValue) {
      this.errorMsg = "Please enter an alias or IBAN", this.render();
      return;
    }
    const s = e.querySelector(".ow-pay-btn");
    s.disabled = !0, s.innerHTML = '<span class="ow-spinner"></span>Verifying', this.errorMsg = "";
    try {
      const n = this.options.gatewayUrl ?? "", l = this.aliasValue.toUpperCase().startsWith("LY") ? { payer_iban: this.aliasValue } : { payer_alias: this.aliasValue }, d = await fetch(`${n}/payments/sessions/${this.options.sessionId}/resolve-payer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(l)
      }), r = await d.json();
      if (!d.ok) {
        this.errorMsg = (r == null ? void 0 : r.message) ?? ((i = r == null ? void 0 : r.error) == null ? void 0 : i.message) ?? "Verification failed", this.render();
        return;
      }
      const c = await fetch(`${n}/payments/sessions/${this.options.sessionId}/select-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_mode: "OTP" })
      }), o = await c.json().catch(() => ({}));
      if (!c.ok) {
        this.errorMsg = (o == null ? void 0 : o.message) ?? (o == null ? void 0 : o.error) ?? "Could not send OTP", this.render();
        return;
      }
      this.sessionData = { ...this.sessionData, ...r }, this.step = "otp", this.render();
    } catch {
      this.errorMsg = "Network error. Please try again.", this.render();
    }
  }
  async handleOtpConfirm(e) {
    var s, i, n, a, l, d;
    const t = ((s = e.querySelector(".ow-otp-input")) == null ? void 0 : s.value.trim()) ?? "";
    if (t.length < 4) {
      this.errorMsg = "Please enter a valid OTP", this.render();
      return;
    }
    this.step = "processing", this.render();
    try {
      const r = this.options.gatewayUrl ?? "", c = await fetch(`${r}/payments/sessions/${this.options.sessionId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp_code: t })
      }), o = await c.json();
      if (!c.ok) {
        this.step = "failed", this.errorMsg = (o == null ? void 0 : o.message) ?? ((i = o == null ? void 0 : o.error) == null ? void 0 : i.message) ?? "Payment failed", this.render(), (a = (n = this.options).onFailed) == null || a.call(n, { session_id: this.options.sessionId, status: "FAILED", message: this.errorMsg });
        return;
      }
      this.step = "success", this.render(), (d = (l = this.options).onSuccess) == null || d.call(l, {
        session_id: this.options.sessionId,
        status: "COMPLETED",
        reference: o.transfer_reference ?? o.reference,
        receipt_url: o.receipt_url
      });
    } catch {
      this.step = "failed", this.errorMsg = "Network error. Please try again.", this.render();
    }
  }
  handleDismiss() {
    var e, t;
    this.destroy(), (t = (e = this.options).onDismiss) == null || t.call(e);
  }
  resolveTheme() {
    var t;
    const e = this.options.theme ?? "auto";
    return e === "light" ? "light" : e === "dark" || (t = window.matchMedia) != null && t.call(window, "(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  escapeHtml(e) {
    return e.replace(/[&<>"']/g, (t) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[t] ?? t);
  }
  safeUrl(e) {
    if (!e) return null;
    try {
      const t = new URL(e);
      return ["https:", "http:"].includes(t.protocol) ? t.toString() : null;
    } catch {
      return null;
    }
  }
  safeColor(e) {
    return e && /^#[0-9a-fA-F]{6}$/.test(e) ? e : null;
  }
}
let h = null;
function T(g) {
  h && h.destroy(), h = new $(g), h.mount();
}
function U() {
  h == null || h.destroy(), h = null;
}
export {
  $ as AstroCheckout,
  T as checkout,
  U as dismiss
};
//# sourceMappingURL=astro.js.map
