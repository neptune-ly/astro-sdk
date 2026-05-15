<div align="center">

<img src="./docs/neptune-logo.png" alt="Neptune. Financial Technology And Solutions" width="520">

# Astro SDK

</div>

Official SDKs for **Neptune. Astro**, the OpenWave gateway implementation by Neptune Fintech.

**Docs:** https://neptune-ly.github.io/astro-sdk/

---

## SDKs

| SDK | Language | Install |
|---|---|---|
| [`sdks/js`](./sdks/js) | TypeScript / Node.js 18+ | `npm install @neptune-astro/sdk` |
| [`sdks/react`](./sdks/react) | React 18+ | `npm install @neptune-astro/react` |
| [`sdks/web`](./sdks/web) | Browser drop-in | `<script src="astro.js">` |
| [`sdks/flutter`](./sdks/flutter) | Flutter / Dart 3+ | pub.dev / git |
| [`sdks/kotlin`](./sdks/kotlin) | Kotlin / JVM | Gradle |
| [`sdks/swift`](./sdks/swift) | Swift / iOS 15+ | Swift Package Manager |

## Quick Install

### TypeScript / Node.js
```bash
npm install @neptune-astro/sdk
```

### Flutter
```yaml
dependencies:
  astro_sdk:
    git:
      url: https://github.com/neptune-ly/astro-sdk.git
      path: sdks/flutter
```

### Swift (SPM)
```swift
// Package.swift
.package(url: "https://github.com/neptune-ly/astro-sdk.git", from: "1.0.0")
```

### Kotlin (Gradle)
```kotlin
dependencies {
    implementation("ly.neptune.astro:astro-kotlin:1.0.0")
}
```

## OpenWave Standard

Built on the [OpenWave](https://neptune-ly.github.io/openwave-spec/) open payment standard.

## Presented Payments

The SDK surface now includes the implementation rules for OpenWave **presented payments**:

- merchant-presented QR
- merchant-presented NFC
- customer-presented wallet or bank-app tokens
- presented recurring mandate approval

These SDKs do not move OTP, PIN, or push approval into merchant UI. Scan or tap only starts the flow. Final customer authorization still happens in the hosted or secure SDK surface defined by OpenWave.

Banks and wallets can also implement the same presented-payment channel directly when their operator enables it. The SDK guides below describe both the gateway-mediated and direct-operator models.

## License

SDK artifacts are provided for integration use. Source code is proprietary — © Neptune Fintech.
