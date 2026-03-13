# Convex-Swift Real-Time Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace HTTP REST polling with real-time WebSocket subscriptions using the official `convex-swift` package.

**Architecture:** Add `convex-swift` SPM dependency. Create a `ConvexService` singleton wrapping `ConvexClientWithAuth`. `TodoStore` and `QuickEntryView` subscribe to Combine publishers instead of manual fetch. Widget stays on HTTP.

**Tech Stack:** convex-swift (SPM), Combine, SwiftUI @Observable, async/await

---

### Task 1: Add convex-swift SPM dependency

**Files:**
- Modify: `apps/blazzos/project.yml`

**Step 1: Add SPM package to project.yml**

Add under the top-level `packages` key:

```yaml
packages:
  Convex:
    url: https://github.com/get-convex/convex-swift
    from: "0.5.0"
```

Add dependency to BlazzOS, BlazzOSIOS, and BlazzOSTests targets:

```yaml
  BlazzOS:
    dependencies:
      - target: BlazzOSWidget
      - package: Convex
  BlazzOSIOS:
    dependencies:
      - package: Convex
```

**Step 2: Regenerate xcodeproj**

Run: `cd apps/blazzos && xcodegen generate`
Expected: `Created project at .../BlazzOS.xcodeproj`

**Step 3: Resolve packages**

Run: `cd apps/blazzos && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -resolvePackageDependencies`
Expected: Package resolved successfully

**Step 4: Build to verify**

Run: `cd apps/blazzos && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -configuration Debug -allowProvisioningUpdates build 2>&1 | tail -3`
Expected: `BUILD SUCCEEDED`

**Step 5: Commit**

```bash
git add apps/blazzos/project.yml apps/blazzos/BlazzOS.xcodeproj
git commit -m "feat(blazzos): add convex-swift SPM dependency"
```

---

### Task 2: Create ConvexService singleton

**Files:**
- Create: `apps/blazzos/Shared/ConvexService.swift`
- Modify: `apps/blazzos/Shared/Models.swift` (remove Convex HTTP types)

**Step 1: Create ConvexService.swift**

This wraps `ConvexClientWithAuth` and exposes typed publishers + mutation methods.

```swift
import Foundation
import Combine
import ConvexMobile

/// Custom AuthProvider that reads the JWT from Keychain via AuthManager
final class KeychainAuthProvider: AuthProvider {
    private let authManager: AuthManager

    init(authManager: AuthManager) {
        self.authManager = authManager
    }

    func getToken() async -> String? {
        authManager.getToken()
    }
}

/// Singleton wrapping ConvexClientWithAuth for real-time subscriptions
@Observable
final class ConvexService {
    var projects: [Project] = []
    var todayEntries: [TimeEntry] = []
    var todayTodos: [TodoItem] = []
    var allTodos: [TodoItem] = []
    var isLoading = false
    var error: String?

    private var client: ConvexClientWithAuth?
    private var cancellables = Set<AnyCancellable>()

    func configure(authManager: AuthManager) {
        let deploymentURL = Bundle.main.infoDictionary?["ConvexURL"] as? String ?? ""
        guard !deploymentURL.isEmpty else {
            error = "ConvexURL not configured"
            return
        }

        let authProvider = KeychainAuthProvider(authManager: authManager)
        client = ConvexClientWithAuth(deploymentUrl: deploymentURL, authProvider: authProvider)
    }

    // MARK: - Subscriptions

    func subscribeProjects() {
        guard let client else { return }
        client.subscribe(to: "projects:listActive", yielding: [Project].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] projects in
                self?.projects = projects
            }
            .store(in: &cancellables)
    }

    func subscribeTodayEntries() {
        guard let client else { return }
        let today = Self.todayString()
        client.subscribe(to: "timeEntries:listByDate", with: ["date": today], yielding: [TimeEntry].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] entries in
                self?.todayEntries = entries
            }
            .store(in: &cancellables)
    }

    func subscribeTodayTodos() {
        guard let client else { return }
        let today = Self.todayString()
        client.subscribe(to: "todos:listByDate", with: ["date": today], yielding: [TodoItem].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] todos in
                self?.todayTodos = todos
            }
            .store(in: &cancellables)
    }

    func subscribeAllTodos() {
        guard let client else { return }
        client.subscribe(to: "todos:list", yielding: [TodoItem].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] todos in
                self?.allTodos = todos
            }
            .store(in: &cancellables)
    }

    // MARK: - Mutations

    func createTimeEntry(projectId: String, minutes: Int, hourlyRate: Double, description: String?, billable: Bool = true) async throws {
        guard let client else { throw ConvexServiceError.notConfigured }
        var args: [String: Any] = [
            "projectId": projectId,
            "date": Self.todayString(),
            "minutes": minutes,
            "hourlyRate": hourlyRate,
            "billable": billable,
        ]
        if let description, !description.isEmpty {
            args["description"] = description
        }
        try await client.mutation("timeEntries:create", with: args)
    }

    // MARK: - Helpers

    static func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}

enum ConvexServiceError: LocalizedError {
    case notConfigured

    var errorDescription: String? {
        switch self {
        case .notConfigured: return "Convex not configured"
        }
    }
}
```

**Step 2: Clean up Models.swift**

Remove the HTTP-specific types that are no longer needed:
- `ConvexResponse<T>`
- `ConvexError`
- `ConvexErrorResponse`
- `CreateTimeEntryArgs`
- `ConvexRequest`
- `AnyCodable`

Keep: `Project`, `Client`, `TimeEntry`, `PendingEntry`, `TodoItem`

**Step 3: Build to verify**

Run: `cd apps/blazzos && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -configuration Debug -allowProvisioningUpdates build 2>&1 | tail -3`
Expected: `BUILD SUCCEEDED` (will fail — expected, old ConvexClient references remain)

**Step 4: Commit**

```bash
git add apps/blazzos/Shared/ConvexService.swift apps/blazzos/Shared/Models.swift
git commit -m "feat(blazzos): add ConvexService with real-time subscriptions"
```

---

### Task 3: Update iOS app to use ConvexService

**Files:**
- Modify: `apps/blazzos/BlazzOSIOS/BlazzOSIOSApp.swift`
- Modify: `apps/blazzos/BlazzOSIOS/TodoStore.swift`
- Modify: `apps/blazzos/BlazzOSIOS/TodayView.swift`
- Modify: `apps/blazzos/BlazzOSIOS/AllTodosView.swift`

**Step 1: Update BlazzOSIOSApp.swift**

Create ConvexService at app level, pass to views:

```swift
import SwiftUI

@main
struct BlazzOSIOSApp: App {
    @StateObject private var authManager = AuthManager()
    @State private var convex = ConvexService()

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    MainTabView(convex: convex)
                        .onAppear {
                            convex.configure(authManager: authManager)
                            convex.subscribeTodayTodos()
                            convex.subscribeAllTodos()
                        }
                } else {
                    LoginView(authManager: authManager)
                }
            }
            .preferredColorScheme(.dark)
        }
    }
}

struct MainTabView: View {
    let convex: ConvexService

    var body: some View {
        TabView {
            TodayView(convex: convex)
                .tabItem {
                    Label("Aujourd'hui", systemImage: "sun.max")
                }

            AllTodosView(convex: convex)
                .tabItem {
                    Label("Tâches", systemImage: "checklist")
                }
        }
        .tint(.white)
    }
}
```

**Step 2: Simplify TodoStore.swift**

TodoStore becomes a thin helper for filtering/grouping — data lives in ConvexService:

```swift
import Foundation

enum TodoStoreHelpers {
    static func todosFiltered(from todos: [TodoItem], by status: String?) -> [TodoItem] {
        let source = status == nil ? todos : todos.filter { $0.status == status }
        return sortedByPriority(source)
    }

    static func todayGroupedByPriority(_ todos: [TodoItem]) -> [(String, [TodoItem])] {
        let order = ["urgent", "high", "normal", "low"]
        let grouped = Dictionary(grouping: todos) { $0.priority ?? "normal" }
        return order.compactMap { key in
            guard let items = grouped[key], !items.isEmpty else { return nil }
            return (key, items)
        }
    }

    private static func sortedByPriority(_ todos: [TodoItem]) -> [TodoItem] {
        let order: [String: Int] = ["urgent": 0, "high": 1, "normal": 2, "low": 3]
        return todos.sorted { (order[$0.priority ?? "normal"] ?? 2) < (order[$1.priority ?? "normal"] ?? 2) }
    }
}
```

**Step 3: Update TodayView.swift**

Replace `store` with `convex`, remove `.task` fetch and `.refreshable`:

```swift
import SwiftUI

struct TodayView: View {
    let convex: ConvexService

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Text("\(formattedDate) — \(convex.todayTodos.count) tâche\(convex.todayTodos.count > 1 ? "s" : "")")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.5))
                        .padding(.horizontal)
                        .padding(.bottom, 20)

                    if let error = convex.error {
                        errorView(error)
                    } else if convex.todayTodos.isEmpty {
                        emptyView
                    } else {
                        todoList
                    }
                }
            }
            .background(Color.black)
            .navigationTitle("Aujourd'hui")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }

    @ViewBuilder
    private var todoList: some View {
        let grouped = TodoStoreHelpers.todayGroupedByPriority(convex.todayTodos)
        ForEach(grouped, id: \.0) { priority, todos in
            Section {
                ForEach(todos) { todo in
                    NavigationLink(value: todo) {
                        TodoRowView(todo: todo)
                    }
                    .buttonStyle(.plain)
                }
            } header: {
                Text(priorityLabel(priority))
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white.opacity(0.3))
                    .textCase(.uppercase)
                    .padding(.horizontal)
                    .padding(.top, 20)
                    .padding(.bottom, 6)
            }
            .padding(.horizontal)
        }
        .navigationDestination(for: TodoItem.self) { todo in
            TodoDetailView(todo: todo)
        }
    }

    @ViewBuilder
    private func errorView(_ error: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.title)
                .foregroundStyle(.red)
            Text(error)
                .font(.caption)
                .foregroundStyle(.red)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var emptyView: some View {
        VStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 40))
                .foregroundStyle(.green)
            Text("Rien pour aujourd'hui")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.5))
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "EEE d MMMM"
        return formatter.string(from: Date())
    }

    private func priorityLabel(_ priority: String) -> String {
        switch priority {
        case "urgent": return "Urgent"
        case "high": return "High"
        case "normal": return "Normal"
        case "low": return "Low"
        default: return priority
        }
    }
}
```

**Step 4: Update AllTodosView.swift**

```swift
import SwiftUI

struct AllTodosView: View {
    let convex: ConvexService
    @State private var selectedStatus: String? = nil

    private let filterOptions: [(label: String, value: String?)] = [
        ("Toutes", nil),
        ("Triage", "triage"),
        ("Todo", "todo"),
        ("In Progress", "in_progress"),
        ("Blocked", "blocked"),
        ("Done", "done"),
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                PillFilterView(options: filterOptions, selected: $selectedStatus)
                    .padding(.vertical, 12)

                ScrollView {
                    LazyVStack(spacing: 0) {
                        let todos = TodoStoreHelpers.todosFiltered(from: convex.allTodos, by: selectedStatus)
                        if todos.isEmpty {
                            Text("Aucune tâche")
                                .font(.callout)
                                .foregroundStyle(.white.opacity(0.5))
                                .padding(.top, 80)
                        } else {
                            ForEach(todos) { todo in
                                NavigationLink(value: todo) {
                                    TodoRowView(todo: todo)
                                }
                                .buttonStyle(.plain)
                                .padding(.horizontal)
                            }
                        }
                    }
                }
                .navigationDestination(for: TodoItem.self) { todo in
                    TodoDetailView(todo: todo)
                }
            }
            .background(Color.black)
            .navigationTitle("Tâches")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
```

**Step 5: Build iOS**

Run: `cd apps/blazzos && xcodegen generate && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOSIOS -configuration Debug -destination 'generic/platform=iOS' -allowProvisioningUpdates build 2>&1 | tail -3`
Expected: `BUILD SUCCEEDED`

**Step 6: Commit**

```bash
git add apps/blazzos/BlazzOSIOS/ apps/blazzos/Shared/
git commit -m "feat(blazzos): wire iOS app to convex-swift real-time subscriptions"
```

---

### Task 4: Update macOS app to use ConvexService

**Files:**
- Modify: `apps/blazzos/BlazzOS/BlazzOSApp.swift`
- Modify: `apps/blazzos/BlazzOS/QuickEntryView.swift`

**Step 1: Update BlazzOSApp.swift**

```swift
import SwiftUI
import ServiceManagement

@main
struct BlazzOSApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var offlineBuffer = OfflineBuffer()
    @State private var convex = ConvexService()

    var body: some Scene {
        MenuBarExtra {
            QuickEntryView(
                convex: convex,
                authManager: authManager,
                offlineBuffer: offlineBuffer
            )
            .onAppear {
                guard authManager.isAuthenticated else { return }
                convex.configure(authManager: authManager)
                convex.subscribeProjects()
                convex.subscribeTodayEntries()
            }
        } label: {
            if offlineBuffer.hasPending {
                Label("BlazzOS", systemImage: "clock.badge.exclamationmark")
            } else {
                Image("MenuBarIcon")
            }
        }
        .menuBarExtraStyle(.window)
    }
}
```

**Step 2: Update QuickEntryView.swift**

Replace `@ObservedObject var client: ConvexClient` with `let convex: ConvexService`. Replace all `client.projects` → `convex.projects`, `client.todayEntries` → `convex.todayEntries`, `client.error` → `convex.error`. Replace `client.createEntry(...)` → `convex.createTimeEntry(...)`. Remove the `.task` fetch block. Keep offline buffer logic.

Key changes:
- `var client: ConvexClient` → `var convex: ConvexService`
- `client.projects` → `convex.projects`
- `client.todayEntries` → `convex.todayEntries`
- `client.error` → `convex.error`
- `client.isLoading` → `convex.isLoading`
- Remove `.task { ... fetchProjects/fetchTodayEntries ... }`
- `client.createEntry(...)` → `convex.createTimeEntry(...)`
- `ConvexClient.todayString()` → `ConvexService.todayString()`
- Header text: "Blazz Time" → "BlazzOS"

**Step 3: Build macOS**

Run: `cd apps/blazzos && xcodegen generate && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -configuration Debug -allowProvisioningUpdates build 2>&1 | tail -3`
Expected: `BUILD SUCCEEDED`

**Step 4: Commit**

```bash
git add apps/blazzos/BlazzOS/
git commit -m "feat(blazzos): wire macOS app to convex-swift real-time subscriptions"
```

---

### Task 5: Remove old ConvexClient.swift

**Files:**
- Delete: `apps/blazzos/Shared/ConvexClient.swift`

**Step 1: Delete old HTTP client**

```bash
git rm apps/blazzos/Shared/ConvexClient.swift
```

**Step 2: Build both targets**

Run macOS: `cd apps/blazzos && xcodegen generate && xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -configuration Debug -allowProvisioningUpdates build 2>&1 | tail -3`

Run iOS: `xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOSIOS -configuration Debug -destination 'generic/platform=iOS' -allowProvisioningUpdates build 2>&1 | tail -3`

Expected: Both `BUILD SUCCEEDED`

Note: `LoginWebView.swift` references `ConvexClient.appURL` — this needs to be changed to read from Bundle directly:
```swift
let appURL = Bundle.main.infoDictionary?["AppURL"] as? String ?? ""
```

And `TodoProvider.swift` (widget) still uses its own HTTP — no changes needed.

**Step 3: Commit**

```bash
git add -A apps/blazzos/
git commit -m "refactor(blazzos): remove old HTTP ConvexClient, all targets use convex-swift"
```

---

### Task 6: Build and install on devices

**Step 1: Build and install macOS**

```bash
cd apps/blazzos
xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOS -configuration Release -allowProvisioningUpdates archive -archivePath build/BlazzOS.xcarchive
trash /Applications/BlazzOS.app
cp -R build/BlazzOS.xcarchive/Products/Applications/BlazzOS.app /Applications/BlazzOS.app
open /Applications/BlazzOS.app
```

**Step 2: Build and install iOS**

```bash
xcodebuild -project BlazzOS.xcodeproj -scheme BlazzOSIOS -configuration Release -destination 'id=00008027-0016411A2E05802E' -allowProvisioningUpdates build
xcrun devicectl device install app --device 00008027-0016411A2E05802E $(find ~/Library/Developer/Xcode/DerivedData/BlazzOS-*/Build/Products/Release-iphoneos/BlazzOSIOS.app)
```

**Step 3: Verify real-time sync**

1. Open BlazzOS on Mac and iPad
2. Create a todo or time entry in the web app (ops.blazz.co)
3. Verify it appears on both native apps within seconds without manual refresh

**Step 4: Final commit**

```bash
git add -A apps/blazzos/
git commit -m "feat(blazzos): real-time sync via convex-swift complete"
```
