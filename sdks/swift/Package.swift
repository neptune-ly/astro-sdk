// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "AstroSDK",
    platforms: [
        .iOS(.v15),
        .macOS(.v12),
    ],
    products: [
        .library(name: "AstroSDK", targets: ["AstroSDK"]),
    ],
    targets: [
        .target(
            name: "AstroSDK",
            dependencies: [],
            path: "Sources/AstroSDK"
        ),
        .testTarget(
            name: "AstroSDKTests",
            dependencies: ["AstroSDK"],
            path: "Tests/AstroSDKTests"
        ),
    ]
)
