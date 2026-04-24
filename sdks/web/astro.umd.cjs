(function(l,p){typeof exports=="object"&&typeof module<"u"?p(exports):typeof define=="function"&&define.amd?define(["exports"],p):(l=typeof globalThis<"u"?globalThis:l||self,p(l.Astro={}))})(this,function(l){"use strict";const p=`
  .ow-overlay {
    position: fixed; inset: 0; z-index: 999999;
    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; animation: ow-fadein 0.2s ease;
  }
  .ow-modal {
    background: #fff; border-radius: 16px;
    width: 100%; max-width: 440px; overflow: hidden;
    box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    animation: ow-slidein 0.25s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ow-modal[data-theme=dark] { background: #1a1a2e; color: #e0e0e0; }
  .ow-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem; border-bottom: 1px solid #f0f0f0;
  }
  [data-theme=dark] .ow-header { border-color: #2a2a4a; }
  .ow-title { font-size: 1.1rem; font-weight: 700; color: #7c3aed; }
  .ow-close {
    background: none; border: none; cursor: pointer; font-size: 1.25rem;
    color: #888; padding: 0.25rem; border-radius: 6px;
    transition: background 0.15s;
  }
  .ow-close:hover { background: #f5f5f5; }
  [data-theme=dark] .ow-close:hover { background: #2a2a4a; }
  .ow-body { padding: 1.5rem; }
  .ow-amount {
    text-align: center; padding: 1rem;
    background: linear-gradient(135deg, #7c3aed15, #06b6d415);
    border-radius: 12px; margin-bottom: 1.5rem;
  }
  .ow-amount-value { font-size: 2rem; font-weight: 800; color: #7c3aed; }
  .ow-amount-currency { font-size: 1rem; color: #888; margin-left: 0.5rem; }
  .ow-label { font-size: 0.8rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .ow-input {
    width: 100%; padding: 0.75rem 1rem; border: 2px solid #e0e0e0;
    border-radius: 10px; font-size: 1rem; outline: none; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .ow-input:focus { border-color: #7c3aed; }
  [data-theme=dark] .ow-input { background: #2a2a4a; border-color: #3a3a6a; color: #e0e0e0; }
  .ow-input-group { margin-bottom: 1rem; }
  .ow-otp-hint { font-size: 0.8rem; color: #888; margin-top: 0.4rem; }
  .ow-btn {
    width: 100%; padding: 0.875rem; border: none; border-radius: 10px;
    font-size: 1rem; font-weight: 700; cursor: pointer;
    background: #7c3aed; color: #fff; margin-top: 0.5rem;
    transition: background 0.15s, transform 0.1s;
  }
  .ow-btn:hover { background: #6d28d9; }
  .ow-btn:active { transform: scale(0.98); }
  .ow-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
  .ow-btn-ghost {
    background: transparent; color: #888; font-size: 0.9rem; margin-top: 0.5rem;
    text-decoration: underline; border: none; cursor: pointer; width: 100%;
  }
  .ow-error { color: #ef4444; font-size: 0.875rem; margin-top: 0.5rem; text-align: center; }
  .ow-success { color: #22c55e; font-size: 1rem; text-align: center; padding: 1rem; }
  .ow-spinner { display: inline-block; width: 1rem; height: 1rem; border: 2px solid #fff4; border-top-color: #fff; border-radius: 50%; animation: ow-spin 0.7s linear infinite; vertical-align: middle; margin-right: 0.5rem; }
  .ow-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #f0f0f0; text-align: center; font-size: 0.75rem; color: #aaa; }
  [data-theme=dark] .ow-footer { border-color: #2a2a4a; }
  @keyframes ow-fadein { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ow-slidein { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes ow-spin { to { transform: rotate(360deg) } }
`;class m{constructor(e){this.overlay=null,this.styleEl=null,this.step="alias",this.aliasValue="",this.errorMsg="",this.sessionData=null,this.options=e}mount(){this.injectStyles(),this.render()}destroy(){var e,t;(e=this.overlay)==null||e.remove(),(t=this.styleEl)==null||t.remove(),this.overlay=null}injectStyles(){document.getElementById("ow-styles")||(this.styleEl=document.createElement("style"),this.styleEl.id="ow-styles",this.styleEl.textContent=p,document.head.appendChild(this.styleEl))}render(){var o,r;(o=this.overlay)==null||o.remove();const e=this.resolveTheme(),t=document.createElement("div");t.className="ow-overlay",t.addEventListener("click",i=>{i.target===t&&this.handleDismiss()});const s=document.createElement("div");s.className="ow-modal",s.setAttribute("data-theme",e),s.innerHTML=this.renderHTML(),t.appendChild(s),document.body.appendChild(t),this.overlay=t,this.bindEvents(s),(r=s.querySelector(".ow-alias-input"))==null||r.focus()}renderHTML(){var h,u;const e=(h=this.sessionData)==null?void 0:h.amount,t=((u=this.sessionData)==null?void 0:u.currency)??"LYD",s=t==="LYD"?1e3:100,o=t==="LYD"?3:2,r=e!=null?`<div class="ow-amount"><span class="ow-amount-value">${(e/s).toFixed(o)}</span><span class="ow-amount-currency">${t}</span></div>`:"",i=`
      <div class="ow-header">
        <span class="ow-title">Astro Pay</span>
        <button class="ow-close" aria-label="Close">✕</button>
      </div>
    `,n='<div class="ow-footer">Secured by <strong>Neptune Astro</strong> · OpenWave Standard</div>';let a="";return this.step==="alias"?a=`
        <div class="ow-body">
          ${r}
          <div class="ow-input-group">
            <div class="ow-label">Pay with</div>
            <input class="ow-input ow-alias-input" type="text" placeholder="your-alias or LY..." value="${this.aliasValue}" autocomplete="off" />
            <div class="ow-otp-hint">Enter your NPT alias (e.g. <strong>mtellesy</strong>) or your IBAN</div>
          </div>
          ${this.errorMsg?`<div class="ow-error">${this.errorMsg}</div>`:""}
          <button class="ow-btn ow-pay-btn">Continue →</button>
          <button class="ow-btn-ghost ow-cancel-btn">Cancel</button>
        </div>
      `:this.step==="otp"?a=`
        <div class="ow-body">
          ${r}
          <div class="ow-input-group">
            <div class="ow-label">One-Time Password</div>
            <input class="ow-input ow-otp-input" type="text" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code" />
            <div class="ow-otp-hint">Check your SMS for the OTP sent to your registered number</div>
          </div>
          ${this.errorMsg?`<div class="ow-error">${this.errorMsg}</div>`:""}
          <button class="ow-btn ow-confirm-btn">Confirm Payment</button>
          <button class="ow-btn-ghost ow-back-btn">← Change alias</button>
        </div>
      `:this.step==="processing"?a='<div class="ow-body"><div class="ow-success"><span class="ow-spinner"></span>Processing payment…</div></div>':this.step==="success"?a='<div class="ow-body"><div class="ow-success">✅ Payment successful!</div><button class="ow-btn ow-done-btn" style="margin:0 1.5rem 1.5rem;width:calc(100% - 3rem)">Done</button></div>':this.step==="failed"&&(a=`<div class="ow-body"><div class="ow-error" style="padding:1rem;font-size:1rem">❌ ${this.errorMsg||"Payment failed"}</div><button class="ow-btn ow-retry-btn" style="margin:0 1.5rem 1.5rem;width:calc(100% - 3rem)">Try again</button></div>`),i+a+n}bindEvents(e){var t,s,o,r,i,n,a,h,u;(t=e.querySelector(".ow-close"))==null||t.addEventListener("click",()=>this.handleDismiss()),(s=e.querySelector(".ow-cancel-btn"))==null||s.addEventListener("click",()=>this.handleDismiss()),(o=e.querySelector(".ow-pay-btn"))==null||o.addEventListener("click",()=>this.handleAliasContinue(e)),(r=e.querySelector(".ow-alias-input"))==null||r.addEventListener("keydown",d=>{d.key==="Enter"&&this.handleAliasContinue(e)}),(i=e.querySelector(".ow-confirm-btn"))==null||i.addEventListener("click",()=>this.handleOtpConfirm(e)),(n=e.querySelector(".ow-otp-input"))==null||n.addEventListener("keydown",d=>{d.key==="Enter"&&this.handleOtpConfirm(e)}),(a=e.querySelector(".ow-back-btn"))==null||a.addEventListener("click",()=>{this.step="alias",this.errorMsg="",this.render()}),(h=e.querySelector(".ow-done-btn"))==null||h.addEventListener("click",()=>this.destroy()),(u=e.querySelector(".ow-retry-btn"))==null||u.addEventListener("click",()=>{this.step="alias",this.errorMsg="",this.render()})}async handleAliasContinue(e){var o;const t=e.querySelector(".ow-alias-input");if(this.aliasValue=(t==null?void 0:t.value.trim())??"",!this.aliasValue){this.errorMsg="Please enter an alias or IBAN",this.render();return}const s=e.querySelector(".ow-pay-btn");s.disabled=!0,s.innerHTML='<span class="ow-spinner"></span>Verifying…',this.errorMsg="";try{const r=this.options.gatewayUrl??"",i=await fetch(`${r}/payments/sessions/${this.options.sessionId}/initiate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({alias:this.aliasValue})}),n=await i.json();if(!i.ok){this.errorMsg=((o=n==null?void 0:n.error)==null?void 0:o.message)??"Verification failed",this.render();return}this.sessionData={...this.sessionData,...n},this.step="otp",this.render()}catch{this.errorMsg="Network error. Please try again.",this.render()}}async handleOtpConfirm(e){var s,o,r,i,n,a;const t=((s=e.querySelector(".ow-otp-input"))==null?void 0:s.value.trim())??"";if(t.length<4){this.errorMsg="Please enter a valid OTP",this.render();return}this.step="processing",this.render();try{const h=this.options.gatewayUrl??"",u=await fetch(`${h}/payments/sessions/${this.options.sessionId}/confirm`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({otp:t})}),d=await u.json();if(!u.ok){this.step="failed",this.errorMsg=((o=d==null?void 0:d.error)==null?void 0:o.message)??"Payment failed",this.render(),(i=(r=this.options).onFailed)==null||i.call(r,{session_id:this.options.sessionId,status:"FAILED",message:this.errorMsg});return}this.step="success",this.render(),(a=(n=this.options).onSuccess)==null||a.call(n,{session_id:this.options.sessionId,status:"COMPLETED",reference:d.reference,receipt_url:d.receipt_url})}catch{this.step="failed",this.errorMsg="Network error. Please try again.",this.render()}}handleDismiss(){var e,t;this.destroy(),(t=(e=this.options).onDismiss)==null||t.call(e)}resolveTheme(){var t;const e=this.options.theme??"auto";return e==="light"?"light":e==="dark"||(t=window.matchMedia)!=null&&t.call(window,"(prefers-color-scheme: dark)").matches?"dark":"light"}}let c=null;function w(f){c&&c.destroy(),c=new m(f),c.mount()}function y(){c==null||c.destroy(),c=null}l.AstroCheckout=m,l.checkout=w,l.dismiss=y,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=astro.umd.cjs.map
