# Astro SDK

Official SDKs for the **Astro** OpenWave payment gateway by Neptune Fintech.

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

## License

SDK artifacts are provided for integration use. Source code is proprietary — © Neptune Fintech.
