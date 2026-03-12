import XCTest
@testable import BlazzTime

final class AuthManagerTests: XCTestCase {
    let manager = AuthManager()
    let testToken = "test-token-12345"

    override func tearDown() {
        manager.deleteToken()
    }

    func testSaveAndRetrieveToken() {
        XCTAssertTrue(manager.saveToken(testToken))
        XCTAssertEqual(manager.getToken(), testToken)
    }

    func testDeleteToken() {
        manager.saveToken(testToken)
        manager.deleteToken()
        XCTAssertNil(manager.getToken())
    }

    func testOverwriteToken() {
        manager.saveToken("old-token")
        manager.saveToken("new-token")
        XCTAssertEqual(manager.getToken(), "new-token")
    }

    func testNoTokenReturnsNil() {
        manager.deleteToken()
        XCTAssertNil(manager.getToken())
    }
}
