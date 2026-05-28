import XCTest
@testable import AstroSDK

final class AstroSDKTests: XCTestCase {
    func testConfigStoresBaseURL() {
        let url = URL(string: "https://astro.neptune.ly/api/v1")!
        let config = AstroConfig(baseURL: url, merchantKey: "mk_test")
        XCTAssertEqual(config.baseURL, url)
        XCTAssertEqual(config.merchantKey, "mk_test")
    }
}
