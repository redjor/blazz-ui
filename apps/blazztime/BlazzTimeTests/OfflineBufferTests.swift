import XCTest
@testable import BlazzTime

final class OfflineBufferTests: XCTestCase {
    var buffer: OfflineBuffer!
    let testDir = FileManager.default.temporaryDirectory.appendingPathComponent("BlazzTimeTest-\(UUID().uuidString)")

    override func setUp() {
        buffer = OfflineBuffer(directory: testDir)
    }

    override func tearDown() {
        try? FileManager.default.removeItem(at: testDir)
    }

    func testAddAndRetrieve() {
        let entry = PendingEntry(
            id: UUID(),
            projectId: "proj123",
            date: "2026-03-12",
            minutes: 90,
            hourlyRate: 75.0,
            description: "test",
            billable: true,
            createdAt: Date()
        )
        buffer.add(entry)
        XCTAssertEqual(buffer.pending.count, 1)
        XCTAssertEqual(buffer.pending.first?.projectId, "proj123")
    }

    func testRemoveAfterSync() {
        let entry = PendingEntry(
            id: UUID(),
            projectId: "proj123",
            date: "2026-03-12",
            minutes: 60,
            hourlyRate: 75.0,
            description: nil,
            billable: true,
            createdAt: Date()
        )
        buffer.add(entry)
        buffer.remove(entry.id)
        XCTAssertTrue(buffer.pending.isEmpty)
    }

    func testPersistenceToDisk() {
        let entry = PendingEntry(
            id: UUID(),
            projectId: "proj456",
            date: "2026-03-12",
            minutes: 120,
            hourlyRate: 80.0,
            description: "offline",
            billable: true,
            createdAt: Date()
        )
        buffer.add(entry)

        // Create new buffer from same directory — should reload
        let buffer2 = OfflineBuffer(directory: testDir)
        XCTAssertEqual(buffer2.pending.count, 1)
        XCTAssertEqual(buffer2.pending.first?.projectId, "proj456")
    }

    func testEmptyBufferHasNoPending() {
        XCTAssertTrue(buffer.pending.isEmpty)
    }
}
