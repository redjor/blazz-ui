# BlazzTime — macOS Menu Bar Time Tracker — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A native SwiftUI macOS menu bar app that lets the user log time entries to Convex in under 5 seconds.

**Architecture:** SwiftUI `MenuBarExtra` popover app with zero external dependencies. Communicates with existing Convex backend via HTTP API (`URLSession`). Auth token manually provisioned and stored in macOS Keychain. Offline buffer in `~/Library/Application Support/BlazzTime/pending.json`.

**Tech Stack:** Swift 5.9+, SwiftUI, macOS 14 (Sonoma), Convex HTTP API, Keychain Services, SMAppService

**Convex deployment URL:** Stored as a constant (user fills in their deployment URL).

**Key Convex API facts:**
- Query: `POST <CONVEX_URL>/api/query` with `{ "path": "module:functionName", "args": {...} }`
- Mutation: `POST <CONVEX_URL>/api/mutation` with same format
- Auth: `Authorization: Bearer <token>` header
- `projects:listActive` returns `[{ _id, clientId, name, tjm, hoursPerDay, status, ... }]`
- `timeEntries:create` args: `{ projectId: Id, date: "YYYY-MM-DD", minutes: Int, hourlyRate: Float, billable: Bool, description?: String }`
- `hourlyRate` = `project.tjm / project.hoursPerDay`
- New query `timeEntries:listByDate` needs to be added (args: `{ date: string }`)
- Auth uses `@convex-dev/auth` with Google OAuth. `requireAuth(ctx)` checks `ctx.auth.getUserIdentity()`.

---

## Task 1: Add `listByDate` query to Convex backend

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts` (after line 27, after the `list` query)

**Step 1: Write the new query**

Add after the existing `list` query (line 27):

```typescript
export const listByDate = query({
	args: { date: v.string() },
	handler: async (ctx, { date }) => {
		await requireAuth(ctx)
		return ctx.db
			.query("timeEntries")
			.withIndex("by_date", (q) => q.eq("date", date))
			.collect()
	},
})
```

This uses the existing `by_date` index on the `timeEntries` table (see `schema.ts:78`).

**Step 2: Verify it compiles**

Run: `cd apps/ops && npx convex dev --once --typecheck=disable`
Expected: Convex syncs without errors. If Convex backend is not running, run `pnpm type-check` to verify TypeScript compiles.

**Step 3: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add listByDate query for menu bar app"
```

---

## Task 2: Add HTTP token endpoint to Convex

The menu bar app needs a way to get a valid auth token. Add an HTTP endpoint that the user can visit while logged in to copy their token.

**Files:**
- Modify: `apps/ops/convex/http.ts`

**Step 1: Add the token endpoint**

Add before `export default http`:

```typescript
// Token endpoint for BlazzTime menu bar app
// Visit while logged in to get your session token
http.route({
	path: "/api/auth/token",
	method: "GET",
	handler: httpAction(async (ctx, request) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) {
			return new Response(JSON.stringify({ error: "Not authenticated" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		}
		// Extract token from Authorization header (passed by Convex client)
		const authHeader = request.headers.get("Authorization")
		const token = authHeader?.replace("Bearer ", "") ?? null
		return new Response(
			JSON.stringify({
				message: "Copy this token into BlazzTime",
				token,
				subject: identity.subject,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			}
		)
	}),
})
```

**Note:** This approach has a chicken-and-egg problem — you need a token to call the endpoint that gives you the token. The pragmatic V1 solution: the user grabs the token from the browser devtools (Convex stores it in localStorage as `__convexAuthJWT`). Document this in the app's first-launch instructions. The HTTP endpoint is a nicer V1.5 that can be called from the web app UI.

**Step 2: Verify it compiles**

Run: `cd apps/ops && pnpm type-check`

**Step 3: Commit**

```bash
git add apps/ops/convex/http.ts
git commit -m "feat(ops): add HTTP token endpoint for BlazzTime auth"
```

---

## Task 3: Create Xcode project structure

**This task must be done in Xcode or via `xcodegen`.**

**Step 1: Create the directory structure**

```bash
mkdir -p apps/ops/BlazzTime/BlazzTime
mkdir -p apps/ops/BlazzTime/BlazzTime/Assets.xcassets/AppIcon.appiconset
mkdir -p apps/ops/BlazzTime/BlazzTimeTests
```

**Step 2: Create the Xcode project via `xcodegen`**

Install xcodegen if not present: `brew install xcodegen`

Create `apps/ops/BlazzTime/project.yml`:

```yaml
name: BlazzTime
options:
  bundleIdPrefix: dev.blazz
  deploymentTarget:
    macOS: "14.0"
  xcodeVersion: "16.0"
targets:
  BlazzTime:
    type: application
    platform: macOS
    sources:
      - BlazzTime
    settings:
      base:
        INFOPLIST_FILE: BlazzTime/Info.plist
        CODE_SIGN_ENTITLEMENTS: BlazzTime/BlazzTime.entitlements
        PRODUCT_BUNDLE_IDENTIFIER: dev.blazz.blazztime
        MARKETING_VERSION: "1.0.0"
        CURRENT_PROJECT_VERSION: "1"
        SWIFT_VERSION: "5.9"
        LD_RUNPATH_SEARCH_PATHS: "$(inherited) @executable_path/../Frameworks"
        ENABLE_HARDENED_RUNTIME: true
        MACOSX_DEPLOYMENT_TARGET: "14.0"
    entitlements:
      path: BlazzTime/BlazzTime.entitlements
      properties:
        com.apple.security.app-sandbox: false
        keychain-access-groups:
          - "$(AppIdentifierPrefix)dev.blazz.blazztime"
  BlazzTimeTests:
    type: bundle.unit-test
    platform: macOS
    sources:
      - BlazzTimeTests
    dependencies:
      - target: BlazzTime
    settings:
      base:
        SWIFT_VERSION: "5.9"
```

**Step 3: Create Info.plist**

Create `apps/ops/BlazzTime/BlazzTime/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>LSUIElement</key>
    <true/>
    <key>CFBundleName</key>
    <string>BlazzTime</string>
    <key>CFBundleDisplayName</key>
    <string>Blazz Time</string>
    <key>CFBundleIdentifier</key>
    <string>dev.blazz.blazztime</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>14.0</string>
</dict>
</plist>
```

`LSUIElement = true` hides the dock icon.

**Step 4: Create entitlements**

Create `apps/ops/BlazzTime/BlazzTime/BlazzTime.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.network.client</key>
    <true/>
    <key>keychain-access-groups</key>
    <array>
        <string>$(AppIdentifierPrefix)dev.blazz.blazztime</string>
    </array>
</dict>
</plist>
```

**Step 5: Generate the Xcode project**

```bash
cd apps/ops/BlazzTime && xcodegen generate
```

Expected: `BlazzTime.xcodeproj` created.

**Step 6: Commit**

```bash
git add apps/ops/BlazzTime/project.yml apps/ops/BlazzTime/BlazzTime/Info.plist apps/ops/BlazzTime/BlazzTime/BlazzTime.entitlements
git commit -m "feat(ops): scaffold BlazzTime Xcode project structure"
```

---

## Task 4: Write Models

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/Models.swift`

**Step 1: Write the models**

```swift
import Foundation

// MARK: - Convex API

struct ConvexResponse<T: Decodable>: Decodable {
    let value: T
}

struct ConvexError: Decodable {
    let code: String?
    let message: String?
}

struct ConvexErrorResponse: Decodable {
    let code: String
    let message: String
}

// MARK: - Domain

struct Project: Decodable, Identifiable, Hashable {
    let _id: String
    let clientId: String
    let name: String
    let tjm: Double
    let hoursPerDay: Double
    let status: String
    let description: String?

    var id: String { _id }

    var hourlyRate: Double {
        guard hoursPerDay > 0 else { return 0 }
        return tjm / hoursPerDay
    }
}

struct Client: Decodable, Identifiable {
    let _id: String
    let name: String

    var id: String { _id }
}

struct TimeEntry: Decodable, Identifiable {
    let _id: String
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool

    var id: String { _id }

    var hours: Double {
        Double(minutes) / 60.0
    }

    var revenue: Double {
        hours * hourlyRate
    }

    var formattedDuration: String {
        let h = minutes / 60
        let m = minutes % 60
        if m == 0 { return "\(h)h" }
        return "\(h)h\(String(format: "%02d", m))"
    }
}

// MARK: - Offline Buffer

struct PendingEntry: Codable, Identifiable {
    let id: UUID
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool
    let createdAt: Date
}

// MARK: - Convex Mutation Payloads

struct CreateTimeEntryArgs: Encodable {
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool
}

struct ConvexRequest: Encodable {
    let path: String
    let args: [String: AnyCodable]
}

/// Type-erased Encodable wrapper for Convex args
struct AnyCodable: Encodable {
    private let _encode: (Encoder) throws -> Void

    init<T: Encodable>(_ value: T) {
        _encode = { try value.encode(to: $0) }
    }

    func encode(to encoder: Encoder) throws {
        try _encode(encoder)
    }
}
```

**Step 2: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/Models.swift
git commit -m "feat(ops): add BlazzTime data models"
```

---

## Task 5: Write AuthManager (Keychain)

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/AuthManager.swift`
- Create: `apps/ops/BlazzTime/BlazzTimeTests/AuthManagerTests.swift`

**Step 1: Write the failing test**

Create `apps/ops/BlazzTime/BlazzTimeTests/AuthManagerTests.swift`:

```swift
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
```

**Step 2: Write the implementation**

Create `apps/ops/BlazzTime/BlazzTime/AuthManager.swift`:

```swift
import Foundation
import Security

final class AuthManager: ObservableObject {
    @Published var isAuthenticated: Bool = false

    private let service = "dev.blazz.blazztime"
    private let account = "convex-token"

    init() {
        isAuthenticated = getToken() != nil
    }

    @discardableResult
    func saveToken(_ token: String) -> Bool {
        deleteToken()
        let data = Data(token.utf8)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecValueData as String: data,
        ]
        let status = SecItemAdd(query as CFDictionary, nil)
        isAuthenticated = status == errSecSuccess
        return isAuthenticated
    }

    func getToken() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    func deleteToken() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary)
        isAuthenticated = false
    }
}
```

**Step 3: Run tests**

```bash
cd apps/ops/BlazzTime && xcodebuild test -scheme BlazzTime -destination 'platform=macOS'
```

Expected: 4 tests pass.

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/AuthManager.swift apps/ops/BlazzTime/BlazzTimeTests/AuthManagerTests.swift
git commit -m "feat(ops): add BlazzTime Keychain auth manager"
```

---

## Task 6: Write ConvexClient

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/ConvexClient.swift`

**Step 1: Write the client**

```swift
import Foundation

final class ConvexClient: ObservableObject {
    /// Set this to your Convex deployment URL, e.g. "https://your-deployment-123.convex.cloud"
    static let deploymentURL = "CONVEX_DEPLOYMENT_URL_HERE"

    @Published var projects: [Project] = []
    @Published var todayEntries: [TimeEntry] = []
    @Published var isLoading = false
    @Published var error: String?

    private let authManager: AuthManager

    init(authManager: AuthManager) {
        self.authManager = authManager
    }

    // MARK: - Public API

    @MainActor
    func fetchProjects() async {
        do {
            let result: [Project] = try await query("projects:listActive", args: [:])
            projects = result
        } catch {
            self.error = "Erreur projets: \(error.localizedDescription)"
        }
    }

    @MainActor
    func fetchTodayEntries() async {
        let today = Self.todayString()
        do {
            let result: [TimeEntry] = try await query("timeEntries:listByDate", args: ["date": today])
            todayEntries = result
            self.error = nil
        } catch {
            self.error = "Erreur entrées: \(error.localizedDescription)"
        }
    }

    @MainActor
    func createEntry(projectId: String, minutes: Int, hourlyRate: Double, description: String?) async throws {
        let today = Self.todayString()
        let args: [String: Any] = [
            "projectId": projectId,
            "date": today,
            "minutes": minutes,
            "hourlyRate": hourlyRate,
            "billable": true,
            "description": description as Any,
        ]
        let _: String? = try await mutation("timeEntries:create", args: args)
        // Refresh today's entries after creation
        await fetchTodayEntries()
    }

    // MARK: - HTTP

    private func query<T: Decodable>(_ path: String, args: [String: Any]) async throws -> T {
        try await request(endpoint: "query", path: path, args: args)
    }

    private func mutation<T: Decodable>(_ path: String, args: [String: Any]) async throws -> T {
        try await request(endpoint: "mutation", path: path, args: args)
    }

    private func request<T: Decodable>(endpoint: String, path: String, args: [String: Any]) async throws -> T {
        guard let token = authManager.getToken() else {
            throw ConvexClientError.notAuthenticated
        }

        let url = URL(string: "\(Self.deploymentURL)/api/\(endpoint)")!
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = ["path": path, "args": args]
        urlRequest.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ConvexClientError.invalidResponse
        }

        if httpResponse.statusCode == 401 {
            await MainActor.run { authManager.deleteToken() }
            throw ConvexClientError.notAuthenticated
        }

        guard httpResponse.statusCode == 200 else {
            let errorBody = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw ConvexClientError.serverError(httpResponse.statusCode, errorBody)
        }

        // Convex wraps responses in { "value": <result>, "status": "success" }
        // For mutations that return an ID, value is a string
        // For queries that return arrays, value is an array
        let decoded = try JSONDecoder().decode(ConvexQueryResponse<T>.self, from: data)
        return decoded.value
    }

    // MARK: - Helpers

    static func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}

private struct ConvexQueryResponse<T: Decodable>: Decodable {
    let value: T
    let status: String?
}

enum ConvexClientError: LocalizedError {
    case notAuthenticated
    case invalidResponse
    case serverError(Int, String)

    var errorDescription: String? {
        switch self {
        case .notAuthenticated: return "Non authentifié"
        case .invalidResponse: return "Réponse invalide"
        case .serverError(let code, let body): return "Erreur \(code): \(body)"
        }
    }
}
```

**Step 2: Verify it compiles**

```bash
cd apps/ops/BlazzTime && xcodebuild build -scheme BlazzTime -destination 'platform=macOS'
```

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/ConvexClient.swift
git commit -m "feat(ops): add BlazzTime Convex HTTP client"
```

---

## Task 7: Write OfflineBuffer

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/OfflineBuffer.swift`
- Create: `apps/ops/BlazzTime/BlazzTimeTests/OfflineBufferTests.swift`

**Step 1: Write the failing test**

Create `apps/ops/BlazzTime/BlazzTimeTests/OfflineBufferTests.swift`:

```swift
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
```

**Step 2: Write the implementation**

Create `apps/ops/BlazzTime/BlazzTime/OfflineBuffer.swift`:

```swift
import Foundation

final class OfflineBuffer: ObservableObject {
    @Published private(set) var pending: [PendingEntry] = []

    private let fileURL: URL

    init(directory: URL? = nil) {
        let dir = directory ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("BlazzTime")
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        fileURL = dir.appendingPathComponent("pending.json")
        load()
    }

    var hasPending: Bool { !pending.isEmpty }

    func add(_ entry: PendingEntry) {
        pending.append(entry)
        save()
    }

    func remove(_ id: UUID) {
        pending.removeAll { $0.id == id }
        save()
    }

    // MARK: - Persistence

    private func load() {
        guard let data = try? Data(contentsOf: fileURL) else { return }
        pending = (try? JSONDecoder().decode([PendingEntry].self, from: data)) ?? []
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(pending) else { return }
        try? data.write(to: fileURL, options: .atomic)
    }
}
```

**Step 3: Run tests**

```bash
cd apps/ops/BlazzTime && xcodebuild test -scheme BlazzTime -destination 'platform=macOS'
```

Expected: All OfflineBuffer tests pass.

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/OfflineBuffer.swift apps/ops/BlazzTime/BlazzTimeTests/OfflineBufferTests.swift
git commit -m "feat(ops): add BlazzTime offline buffer with persistence"
```

---

## Task 8: Write QuickEntryView (SwiftUI popover)

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/QuickEntryView.swift`

**Step 1: Write the view**

```swift
import SwiftUI

struct QuickEntryView: View {
    @ObservedObject var client: ConvexClient
    @ObservedObject var authManager: AuthManager
    @ObservedObject var offlineBuffer: OfflineBuffer

    @State private var selectedProjectId: String = ""
    @State private var duration: Double = 1.0
    @State private var note: String = ""
    @State private var showSuccess = false
    @State private var isSubmitting = false

    private var selectedProject: Project? {
        client.projects.first { $0._id == selectedProjectId }
    }

    private var todayTotalMinutes: Int {
        client.todayEntries.reduce(0) { $0 + $1.minutes }
    }

    private var todayTotalRevenue: Double {
        client.todayEntries.reduce(0.0) { $0 + $1.revenue }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: "clock.fill")
                    .foregroundStyle(.secondary)
                Text("Blazz Time")
                    .font(.headline)
                Spacer()
                if offlineBuffer.hasPending {
                    Image(systemName: "circle.fill")
                        .foregroundStyle(.orange)
                        .font(.system(size: 8))
                        .help("\(offlineBuffer.pending.count) entrée(s) en attente")
                }
            }

            if !authManager.isAuthenticated {
                notAuthenticatedView
            } else if client.isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
            } else {
                formView
                Divider()
                todaySummaryView
            }
        }
        .padding(16)
        .frame(width: 300)
        .task {
            guard authManager.isAuthenticated else { return }
            client.isLoading = true
            async let p: () = client.fetchProjects()
            async let e: () = client.fetchTodayEntries()
            _ = await (p, e)
            client.isLoading = false
            await flushPendingEntries()
        }
    }

    // MARK: - Subviews

    private var notAuthenticatedView: some View {
        VStack(spacing: 8) {
            Text("Token non configuré")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text("Ouvrez Blazz Ops dans le navigateur, copiez le token depuis les DevTools (localStorage → __convexAuthJWT), et collez-le ci-dessous.")
                .font(.caption)
                .foregroundStyle(.tertiary)
                .multilineTextAlignment(.center)
            TextField("Coller le token ici", text: $note)
                .textFieldStyle(.roundedBorder)
                .font(.caption)
            Button("Enregistrer le token") {
                let token = note.trimmingCharacters(in: .whitespacesAndNewlines)
                guard !token.isEmpty else { return }
                authManager.saveToken(token)
                note = ""
            }
            .buttonStyle(.borderedProminent)
            .disabled(note.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
    }

    private var formView: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Project picker
            Picker("Projet", selection: $selectedProjectId) {
                Text("Choisir...").tag("")
                ForEach(client.projects) { project in
                    Text(project.name).tag(project._id)
                }
            }
            .pickerStyle(.menu)

            // Duration
            HStack {
                Text("Durée")
                Spacer()
                TextField("", value: $duration, format: .number)
                    .frame(width: 60)
                    .textFieldStyle(.roundedBorder)
                    .multilineTextAlignment(.trailing)
                Stepper("", value: $duration, in: 0.25...24, step: 0.25)
                    .labelsHidden()
                Text("h")
                    .foregroundStyle(.secondary)
            }

            // Note
            TextField("Note (optionnel)", text: $note)
                .textFieldStyle(.roundedBorder)
                .font(.callout)

            // Submit
            Button(action: submit) {
                HStack {
                    if isSubmitting {
                        ProgressView()
                            .controlSize(.small)
                    }
                    Text(showSuccess ? "✓ Enregistré" : "Enregistrer")
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(showSuccess ? .green : .accentColor)
            .disabled(selectedProjectId.isEmpty || isSubmitting)
            .keyboardShortcut(.return, modifiers: .command)

            // Error
            if let error = client.error {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
            }
        }
    }

    private var todaySummaryView: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Aujourd'hui")
                    .font(.subheadline.weight(.medium))
                Spacer()
                Text(formatMinutes(todayTotalMinutes))
                    .font(.subheadline.weight(.semibold))
                Text("·")
                    .foregroundStyle(.secondary)
                Text(formatCurrency(todayTotalRevenue))
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.green)
            }

            ForEach(client.todayEntries) { entry in
                HStack {
                    Text(entry.formattedDuration)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .frame(width: 40, alignment: .leading)
                    Text(projectName(for: entry.projectId))
                        .font(.caption)
                        .lineLimit(1)
                    Spacer()
                    Image(systemName: "checkmark.circle.fill")
                        .font(.caption2)
                        .foregroundStyle(.green)
                }
            }
        }
    }

    // MARK: - Actions

    private func submit() {
        guard let project = selectedProject else { return }
        let minutes = Int(duration * 60)
        let desc = note.isEmpty ? nil : note

        isSubmitting = true
        client.error = nil

        Task {
            do {
                try await client.createEntry(
                    projectId: project._id,
                    minutes: minutes,
                    hourlyRate: project.hourlyRate,
                    description: desc
                )
                showSuccess = true
                NSSound(named: "Tink")?.play()
                note = ""
                // Reset success after 2s
                try? await Task.sleep(for: .seconds(2))
                showSuccess = false
            } catch {
                // Offline: buffer the entry
                let pending = PendingEntry(
                    id: UUID(),
                    projectId: project._id,
                    date: ConvexClient.todayString(),
                    minutes: minutes,
                    hourlyRate: project.hourlyRate,
                    description: desc,
                    billable: true,
                    createdAt: Date()
                )
                offlineBuffer.add(pending)
                client.error = "Sauvé hors-ligne (sync auto)"
            }
            isSubmitting = false
        }
    }

    private func flushPendingEntries() async {
        for entry in offlineBuffer.pending {
            do {
                try await client.createEntry(
                    projectId: entry.projectId,
                    minutes: entry.minutes,
                    hourlyRate: entry.hourlyRate,
                    description: entry.description
                )
                offlineBuffer.remove(entry.id)
            } catch {
                break // Stop flushing on first error
            }
        }
    }

    // MARK: - Formatting

    private func formatMinutes(_ total: Int) -> String {
        let h = total / 60
        let m = total % 60
        if m == 0 { return "\(h)h" }
        return "\(h)h\(String(format: "%02d", m))"
    }

    private func formatCurrency(_ amount: Double) -> String {
        "\(Int(amount))€"
    }

    private func projectName(for projectId: String) -> String {
        client.projects.first { $0._id == projectId }?.name ?? "?"
    }
}
```

**Step 2: Verify it compiles**

```bash
cd apps/ops/BlazzTime && xcodebuild build -scheme BlazzTime -destination 'platform=macOS'
```

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/QuickEntryView.swift
git commit -m "feat(ops): add BlazzTime popover UI"
```

---

## Task 9: Write BlazzTimeApp entry point

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTime/BlazzTimeApp.swift`

**Step 1: Write the app entry point**

```swift
import SwiftUI
import ServiceManagement

@main
struct BlazzTimeApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var offlineBuffer = OfflineBuffer()

    var body: some Scene {
        MenuBarExtra {
            QuickEntryView(
                client: ConvexClient(authManager: authManager),
                authManager: authManager,
                offlineBuffer: offlineBuffer
            )
        } label: {
            Label("Blazz Time", systemImage: offlineBuffer.hasPending ? "clock.badge.exclamationmark" : "clock.fill")
        }
        .menuBarExtraStyle(.window)
    }
}
```

**Note on the `ConvexClient` instantiation:** Creating it inside the `MenuBarExtra` body is fine because `MenuBarExtra` with `.window` style creates the content once (not on every click). However, if this causes issues, refactor to a `@StateObject` in a later iteration.

**Step 2: Verify it compiles and runs**

```bash
cd apps/ops/BlazzTime && xcodebuild build -scheme BlazzTime -destination 'platform=macOS'
```

Then run manually from Xcode or:
```bash
open apps/ops/BlazzTime/build/Build/Products/Debug/BlazzTime.app
```

Expected: Clock icon appears in menu bar. Clicking opens the popover with the token input (since no token is configured yet).

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/BlazzTimeApp.swift
git commit -m "feat(ops): add BlazzTime app entry point with MenuBarExtra"
```

---

## Task 10: Add global keyboard shortcut (⌥T)

**Files:**
- Modify: `apps/ops/BlazzTime/BlazzTime/BlazzTimeApp.swift`

**Step 1: Add KeyboardShortcuts utility**

Create `apps/ops/BlazzTime/BlazzTime/HotKey.swift`:

```swift
import Carbon
import Cocoa

/// Registers a global hotkey (⌥T) that posts a notification to toggle the popover.
/// MenuBarExtra with .window style doesn't support programmatic toggle natively,
/// so this is deferred to a future iteration when NSPopover-based approach is used.
///
/// For V1: the user clicks the menu bar icon. Global shortcut is a V2 feature
/// because MenuBarExtra(.window) doesn't expose the popover for programmatic control.
///
/// Keeping this file as a stub for V2.

// NOTE: To implement global shortcut with MenuBarExtra, we'd need to drop down to
// AppKit's NSStatusItem + NSPopover instead of SwiftUI's MenuBarExtra.
// This is acceptable for V2 since clicking the icon is fast enough for V1.
```

**Step 2: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/HotKey.swift
git commit -m "docs(ops): stub global hotkey for BlazzTime V2"
```

---

## Task 11: Add launch-at-login support

**Files:**
- Modify: `apps/ops/BlazzTime/BlazzTime/BlazzTimeApp.swift`

**Step 1: Add launch at login toggle**

Update `BlazzTimeApp.swift` — add a settings menu item in the popover. Modify `QuickEntryView.swift` to add a gear icon in the header:

Add to the bottom of `QuickEntryView.swift`, inside the main `VStack`, after `todaySummaryView`:

```swift
// Add this after the todaySummaryView in the authenticated branch:
Divider()
HStack {
    Toggle("Lancer au démarrage", isOn: Binding(
        get: { SMAppService.mainApp.status == .enabled },
        set: { newValue in
            do {
                if newValue {
                    try SMAppService.mainApp.register()
                } else {
                    try SMAppService.mainApp.unregister()
                }
            } catch {
                print("Launch at login error: \(error)")
            }
        }
    ))
    .font(.caption)
    .toggleStyle(.switch)
    .controlSize(.mini)

    Spacer()

    Button(action: { authManager.deleteToken() }) {
        Image(systemName: "rectangle.portrait.and.arrow.right")
            .font(.caption)
    }
    .buttonStyle(.plain)
    .help("Déconnecter")
}
```

**Step 2: Add `import ServiceManagement` at the top of `QuickEntryView.swift`.**

**Step 3: Verify it compiles**

```bash
cd apps/ops/BlazzTime && xcodebuild build -scheme BlazzTime -destination 'platform=macOS'
```

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTime/QuickEntryView.swift
git commit -m "feat(ops): add launch-at-login and logout to BlazzTime"
```

---

## Task 12: Add .gitignore and finalize

**Files:**
- Create: `apps/ops/BlazzTime/.gitignore`

**Step 1: Create gitignore**

```
# Xcode
BlazzTime.xcodeproj/project.xcworkspace/
BlazzTime.xcodeproj/xcuserdata/
build/
DerivedData/
*.xcuserstate

# Swift Package Manager
.build/
.swiftpm/
```

**Step 2: Update the Convex deployment URL**

Open `apps/ops/BlazzTime/BlazzTime/ConvexClient.swift` and replace `CONVEX_DEPLOYMENT_URL_HERE` with your actual Convex deployment URL (from `npx convex dashboard` or the Convex dashboard). This is intentionally not committed to git.

**Step 3: Verify full build**

```bash
cd apps/ops/BlazzTime && xcodebuild build -scheme BlazzTime -destination 'platform=macOS'
```

**Step 4: Manual test**

1. Run the app from Xcode
2. Click the clock icon in the menu bar
3. Paste your Convex auth token (from browser localStorage `__convexAuthJWT`)
4. Select a project, set duration, optionally add a note
5. Click "Enregistrer" — should hear "Tink" sound, see green checkmark
6. Verify entry appears in Blazz Ops web app

**Step 5: Commit**

```bash
git add apps/ops/BlazzTime/.gitignore
git commit -m "feat(ops): finalize BlazzTime v1 setup"
```

---

## Summary

| Task | Description | Estimated complexity |
|------|-------------|---------------------|
| 1 | Add `listByDate` Convex query | Trivial (5 lines) |
| 2 | Add HTTP token endpoint | Small |
| 3 | Create Xcode project structure | Setup (xcodegen) |
| 4 | Write Models | Small |
| 5 | Write AuthManager + tests | Small |
| 6 | Write ConvexClient | Medium |
| 7 | Write OfflineBuffer + tests | Small |
| 8 | Write QuickEntryView | Medium (main UI) |
| 9 | Write App entry point | Trivial |
| 10 | Global shortcut stub | Trivial (deferred to V2) |
| 11 | Launch at login | Small |
| 12 | Gitignore + finalize | Trivial |
