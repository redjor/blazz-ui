# BlazzTime iOS — Todos Reader App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a native SwiftUI iOS app that displays todos from the Convex backend, Linear-style (dark, flat list, pill filters), sharing network code with the existing macOS BlazzTime app.

**Architecture:** New `BlazzTimeIOS` target in the existing BlazzTime Xcode project. Shared code (ConvexClient, AuthManager, Models) moved to a `Shared/` group used by both macOS and iOS targets. TodoStore (@Observable) fetches from Convex HTTP API. Views are iOS-only in `BlazzTimeIOS/`.

**Tech Stack:** SwiftUI (iOS 17+), URLSession, Keychain Services, WKWebView, xcodegen

**Design reference:** `docs/plans/2026-03-12-ios-todos-app-design.md`

---

### Task 1: Create Shared/ directory and move common files

Move files used by both macOS and iOS into a `Shared/` group so both targets can reference them.

**Files:**
- Create: `apps/ops/BlazzTime/Shared/` (directory)
- Move: `apps/ops/BlazzTime/BlazzTime/ConvexClient.swift` → `apps/ops/BlazzTime/Shared/ConvexClient.swift`
- Move: `apps/ops/BlazzTime/BlazzTime/AuthManager.swift` → `apps/ops/BlazzTime/Shared/AuthManager.swift`
- Move: `apps/ops/BlazzTime/BlazzTime/Models.swift` → `apps/ops/BlazzTime/Shared/Models.swift`

**Step 1: Create directory and move files**

```bash
mkdir -p apps/ops/BlazzTime/Shared
mv apps/ops/BlazzTime/BlazzTime/ConvexClient.swift apps/ops/BlazzTime/Shared/
mv apps/ops/BlazzTime/BlazzTime/AuthManager.swift apps/ops/BlazzTime/Shared/
mv apps/ops/BlazzTime/BlazzTime/Models.swift apps/ops/BlazzTime/Shared/
```

**Step 2: Update project.yml — add Shared sources to BlazzTime macOS target**

In `apps/ops/BlazzTime/project.yml`, update the `BlazzTime` target sources:

```yaml
  BlazzTime:
    type: application
    platform: macOS
    sources:
      - BlazzTime
      - Shared
```

**Step 3: Update project.yml — also add Shared to BlazzTimeWidget target**

The widget's `TodoProvider.swift` doesn't use Shared (it has its own HTTP code), so skip this. Only the macOS app and iOS app need Shared.

**Step 4: Regenerate and verify macOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -5
```

Expected: `** BUILD SUCCEEDED **`

**Step 5: Run existing tests**

```bash
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeTests -configuration Debug test 2>&1 | grep -E "(Test Suite|Tests|PASS|FAIL|BUILD)"
```

Expected: All 7 tests pass.

**Step 6: Commit**

```bash
git add -A apps/ops/BlazzTime/
git commit -m "refactor(ops): move shared Swift files to Shared/ group"
```

---

### Task 2: Add TodoItem model to Shared/Models.swift

The existing `Models.swift` has `Project`, `TimeEntry`, etc. but no `TodoItem` for the iOS app. The macOS widget has its own `TodoItem` in `TodoProvider.swift` but it's not `Decodable` from Convex JSON. We need a proper shared model.

**Files:**
- Modify: `apps/ops/BlazzTime/Shared/Models.swift`

**Step 1: Add TodoItem struct**

Add this at the end of `Shared/Models.swift`, before the `AnyCodable` section:

```swift
// MARK: - Todos

struct TodoItem: Decodable, Identifiable {
    let _id: String
    let text: String
    let description: String?
    let status: String
    let priority: String?
    let dueDate: String?
    let projectId: String?
    let categoryId: String?
    let tags: [String]?
    let createdAt: Double?

    var id: String { _id }
}
```

**Step 2: Verify build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/Shared/Models.swift
git commit -m "feat(ops): add TodoItem model to shared Swift code"
```

---

### Task 3: Add todo fetch methods to ConvexClient

The existing `ConvexClient` has `fetchProjects()` and `fetchTodayEntries()` for time tracking. Add methods for todos.

**Files:**
- Modify: `apps/ops/BlazzTime/Shared/ConvexClient.swift`

**Step 1: Add todo fetch methods**

Add these methods in the `// MARK: - Public API` section of `ConvexClient.swift`, after `fetchTodayEntries()`:

```swift
    @MainActor
    func fetchAllTodos() async throws -> [TodoItem] {
        try await query("todos:list", args: [:])
    }

    @MainActor
    func fetchTodosByDate(_ date: String) async throws -> [TodoItem] {
        try await query("todos:listByDate", args: ["date": date])
    }
```

**Step 2: Verify build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/Shared/ConvexClient.swift
git commit -m "feat(ops): add todo fetch methods to ConvexClient"
```

---

### Task 4: Create iOS LoginWebView (adapted from macOS)

The macOS version uses `NSWindow` + `NSViewRepresentable`. iOS needs `UIViewRepresentable` + sheet presentation. Extract the shared JS logic and coordinator into a cross-platform file.

**Files:**
- Create: `apps/ops/BlazzTime/Shared/LoginWebView.swift`
- Delete: `apps/ops/BlazzTime/BlazzTime/LoginWebView.swift` (after moving)

**Step 1: Create the cross-platform LoginWebView**

Create `apps/ops/BlazzTime/Shared/LoginWebView.swift` with platform-conditional code:

```swift
import SwiftUI
import WebKit

// MARK: - Shared JS & Coordinator

private let tokenExtractionJS = """
(function() {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var val = localStorage.getItem(key);
        keys.push(key + ' = ' + (val ? val.substring(0, 50) : 'null'));
    }
    window.webkit.messageHandlers.auth.postMessage('__debug__:' + JSON.stringify(keys));

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var val = localStorage.getItem(key);
        if (val && val.length > 100 && (key.includes('auth') || key.includes('token') || key.includes('convex'))) {
            window.webkit.messageHandlers.auth.postMessage(val);
            return;
        }
    }
})();
"""

class AuthWebViewCoordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let authManager: AuthManager
    let onDone: () -> Void
    private var tokenReceived = false

    init(authManager: AuthManager, onDone: @escaping () -> Void) {
        self.authManager = authManager
        self.onDone = onDone
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let value = message.body as? String, !value.isEmpty else { return }

        if value.hasPrefix("__debug__:") {
            let debugInfo = value.dropFirst("__debug__:".count)
            print("[LoginWebView] localStorage keys: \(debugInfo)")
            return
        }

        guard !tokenReceived else { return }
        tokenReceived = true
        print("[LoginWebView] Token received (\(value.prefix(30))...)")

        DispatchQueue.main.async {
            self.authManager.saveToken(value)
            self.onDone()
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard !tokenReceived else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            webView.evaluateJavaScript(tokenExtractionJS)
        }
    }

    func makeWebView() -> WKWebView {
        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: "auth")

        let script = WKUserScript(
            source: tokenExtractionJS,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(script)

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self

        let loginURL = URL(string: "\(ConvexClient.appURL)/login")!
        webView.load(URLRequest(url: loginURL))

        return webView
    }
}

// MARK: - macOS

#if os(macOS)
import AppKit

struct LoginWindow {
    private static var window: NSWindow?

    static func open(authManager: AuthManager) {
        if let existing = window, existing.isVisible {
            existing.makeKeyAndOrderFront(nil)
            return
        }

        let webView = MacAuthWebView(authManager: authManager) { close() }
        let hostingView = NSHostingView(rootView: webView)

        let win = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 420, height: 560),
            styleMask: [.titled, .closable],
            backing: .buffered,
            defer: false
        )
        win.title = "Blazz Time — Connexion"
        win.contentView = hostingView
        win.center()
        win.isReleasedWhenClosed = false
        win.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        window = win
    }

    static func close() {
        window?.close()
        window = nil
    }
}

private struct MacAuthWebView: View {
    let authManager: AuthManager
    let onDone: () -> Void

    var body: some View {
        MacWebViewRepresentable(authManager: authManager, onDone: onDone)
            .frame(width: 420, height: 560)
    }
}

private struct MacWebViewRepresentable: NSViewRepresentable {
    let authManager: AuthManager
    let onDone: () -> Void

    func makeCoordinator() -> AuthWebViewCoordinator {
        AuthWebViewCoordinator(authManager: authManager, onDone: onDone)
    }

    func makeNSView(context: Context) -> WKWebView {
        context.coordinator.makeWebView()
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {}
}
#endif

// MARK: - iOS

#if os(iOS)
struct IOSWebViewRepresentable: UIViewRepresentable {
    let authManager: AuthManager
    let onDone: () -> Void

    func makeCoordinator() -> AuthWebViewCoordinator {
        AuthWebViewCoordinator(authManager: authManager, onDone: onDone)
    }

    func makeUIView(context: Context) -> WKWebView {
        context.coordinator.makeWebView()
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
#endif
```

**Step 2: Delete the old macOS-only file**

```bash
rm apps/ops/BlazzTime/BlazzTime/LoginWebView.swift
```

**Step 3: Verify macOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 4: Commit**

```bash
git add -A apps/ops/BlazzTime/
git commit -m "refactor(ops): make LoginWebView cross-platform (macOS + iOS)"
```

---

### Task 5: Create BlazzTimeIOS target in project.yml

Add the new iOS app target to xcodegen config.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/` (directory)
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/Info.plist`
- Modify: `apps/ops/BlazzTime/project.yml`

**Step 1: Create the iOS directory and Info.plist**

```bash
mkdir -p apps/ops/BlazzTime/BlazzTimeIOS
```

Create `apps/ops/BlazzTime/BlazzTimeIOS/Info.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleDisplayName</key>
    <string>Blazz Todos</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>UILaunchScreen</key>
    <dict/>
</dict>
</plist>
```

**Step 2: Add BlazzTimeIOS target to project.yml**

Add this target after `BlazzTimeWidget` in `project.yml`:

```yaml
  BlazzTimeIOS:
    type: application
    platform: iOS
    sources:
      - path: BlazzTimeIOS
        excludes:
          - Info.plist
      - Shared
    settings:
      base:
        INFOPLIST_FILE: BlazzTimeIOS/Info.plist
        PRODUCT_BUNDLE_IDENTIFIER: dev.blazz.blazztime.ios
        MARKETING_VERSION: "1.0.0"
        CURRENT_PROJECT_VERSION: "1"
        SWIFT_VERSION: "5.9"
        IPHONEOS_DEPLOYMENT_TARGET: "17.0"
        TARGETED_DEVICE_FAMILY: "1,2"
        SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD: "NO"
```

Also update the `options` section to include iOS deployment target:

```yaml
options:
  bundleIdPrefix: dev.blazz
  deploymentTarget:
    macOS: "14.0"
    iOS: "17.0"
  xcodeVersion: "16.0"
```

**Step 3: Create a minimal App entry point**

Create `apps/ops/BlazzTime/BlazzTimeIOS/BlazzTimeIOSApp.swift`:

```swift
import SwiftUI

@main
struct BlazzTimeIOSApp: App {
    var body: some Scene {
        WindowGroup {
            Text("Blazz Todos")
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color.black)
        }
    }
}
```

**Step 4: Generate and verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5
```

Expected: `** BUILD SUCCEEDED **`

**Step 5: Verify macOS build still works**

```bash
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 6: Commit**

```bash
git add -A apps/ops/BlazzTime/
git commit -m "feat(ops): add BlazzTimeIOS target for iPhone/iPad"
```

---

### Task 6: Create TodoStore (@Observable)

The store manages todo data, loading state, and error state. Views observe it.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/TodoStore.swift`

**Step 1: Create the store**

```swift
import Foundation

@Observable
final class TodoStore {
    var todayTodos: [TodoItem] = []
    var allTodos: [TodoItem] = []
    var isLoading = false
    var error: String?

    private let client: ConvexClient

    init(client: ConvexClient) {
        self.client = client
    }

    @MainActor
    func fetchToday() async {
        isLoading = true
        error = nil
        do {
            let date = ConvexClient.todayString()
            todayTodos = try await client.fetchTodosByDate(date)
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func fetchAll() async {
        isLoading = true
        error = nil
        do {
            allTodos = try await client.fetchAllTodos()
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func todosFiltered(by status: String?) -> [TodoItem] {
        let source = status == nil ? allTodos : allTodos.filter { $0.status == status }
        return sortedByPriority(source)
    }

    func todayGroupedByPriority() -> [(String, [TodoItem])] {
        let order = ["urgent", "high", "normal", "low"]
        let grouped = Dictionary(grouping: todayTodos) { $0.priority ?? "normal" }
        return order.compactMap { key in
            guard let items = grouped[key], !items.isEmpty else { return nil }
            return (key, items)
        }
    }

    private func sortedByPriority(_ todos: [TodoItem]) -> [TodoItem] {
        let order: [String: Int] = ["urgent": 0, "high": 1, "normal": 2, "low": 3]
        return todos.sorted { (order[$0.priority ?? "normal"] ?? 2) < (order[$1.priority ?? "normal"] ?? 2) }
    }
}
```

**Step 2: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/TodoStore.swift
git commit -m "feat(ops): add TodoStore for iOS todos data management"
```

---

### Task 7: Create StatusCircleView and TodoRowView

The core reusable cell components, Linear-style.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/StatusCircleView.swift`
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/TodoRowView.swift`

**Step 1: Create StatusCircleView**

```swift
import SwiftUI

struct StatusCircleView: View {
    let status: String
    private let size: CGFloat = 18

    var body: some View {
        ZStack {
            switch status {
            case "triage":
                Circle()
                    .strokeBorder(style: StrokeStyle(lineWidth: 1.5, dash: [3, 2]))
                    .foregroundStyle(Color.gray)
            case "todo":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.white.opacity(0.6))
            case "in_progress":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.yellow)
                Circle()
                    .trim(from: 0, to: 0.5)
                    .fill(Color.yellow)
                    .rotationEffect(.degrees(-90))
                    .padding(3)
            case "blocked":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.red)
                Image(systemName: "xmark")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundStyle(Color.red)
            case "done":
                Circle()
                    .fill(Color.green)
                Image(systemName: "checkmark")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Color.black)
            default:
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.gray)
            }
        }
        .frame(width: size, height: size)
    }
}
```

**Step 2: Create TodoRowView**

```swift
import SwiftUI

struct TodoRowView: View {
    let todo: TodoItem

    var body: some View {
        HStack(spacing: 10) {
            // Priority indicator
            priorityIcon
                .frame(width: 16)

            // Status circle
            StatusCircleView(status: todo.status)

            // Todo text
            Text(todo.text)
                .font(.body)
                .foregroundStyle(.white)
                .lineLimit(1)

            Spacer()
        }
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }

    @ViewBuilder
    private var priorityIcon: some View {
        switch todo.priority {
        case "urgent":
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 12))
                .foregroundStyle(.red)
        case "high":
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 12))
                .foregroundStyle(.orange)
        case "normal":
            Image(systemName: "minus")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.blue)
        case "low":
            Image(systemName: "arrow.down")
                .font(.system(size: 12))
                .foregroundStyle(.gray)
        default:
            Image(systemName: "minus")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.blue)
        }
    }
}
```

**Step 3: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/StatusCircleView.swift apps/ops/BlazzTime/BlazzTimeIOS/TodoRowView.swift
git commit -m "feat(ops): add StatusCircleView and TodoRowView (Linear-style)"
```

---

### Task 8: Create TodayView

The main tab — shows today's todos grouped by priority.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/TodayView.swift`

**Step 1: Create TodayView**

```swift
import SwiftUI

struct TodayView: View {
    let store: TodoStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    // Subtitle
                    Text("\(formattedDate) — \(store.todayTodos.count) tâche\(store.todayTodos.count > 1 ? "s" : "")")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.5))
                        .padding(.horizontal)
                        .padding(.bottom, 20)

                    if let error = store.error {
                        errorView(error)
                    } else if store.isLoading && store.todayTodos.isEmpty {
                        loadingView
                    } else if store.todayTodos.isEmpty {
                        emptyView
                    } else {
                        todoList
                    }
                }
            }
            .background(Color.black)
            .navigationTitle("Aujourd'hui")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .refreshable {
                await store.fetchToday()
            }
        }
        .task {
            await store.fetchToday()
        }
    }

    // MARK: - Todo List

    @ViewBuilder
    private var todoList: some View {
        let grouped = store.todayGroupedByPriority()
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

    // MARK: - States

    @ViewBuilder
    private func errorView(_ error: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.title)
                .foregroundStyle(.red)
            Text(error)
                .font(.caption)
                .foregroundStyle(.red)
            Button("Réessayer") {
                Task { await store.fetchToday() }
            }
            .buttonStyle(.bordered)
            .tint(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var loadingView: some View {
        ProgressView()
            .tint(.white)
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

    // MARK: - Helpers

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

**Step 2: Make TodoItem conform to Hashable (needed for NavigationLink)**

In `Shared/Models.swift`, change the TodoItem declaration:

```swift
struct TodoItem: Decodable, Identifiable, Hashable {
```

**Step 3: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/TodayView.swift apps/ops/BlazzTime/Shared/Models.swift
git commit -m "feat(ops): add TodayView with priority-grouped todo list"
```

---

### Task 9: Create PillFilterView and AllTodosView

The second tab with horizontal pill filters for status.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/PillFilterView.swift`
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/AllTodosView.swift`

**Step 1: Create PillFilterView**

```swift
import SwiftUI

struct PillFilterView: View {
    let options: [(label: String, value: String?)]
    @Binding var selected: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(options, id: \.label) { option in
                    Button {
                        selected = option.value
                    } label: {
                        Text(option.label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(selected == option.value ? Color.white : Color.clear)
                            .foregroundStyle(selected == option.value ? .black : .white.opacity(0.5))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal)
        }
    }
}
```

**Step 2: Create AllTodosView**

```swift
import SwiftUI

struct AllTodosView: View {
    let store: TodoStore
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
                        let todos = store.todosFiltered(by: selectedStatus)
                        if store.isLoading && todos.isEmpty {
                            ProgressView()
                                .tint(.white)
                                .padding(.top, 80)
                        } else if todos.isEmpty {
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
            .refreshable {
                await store.fetchAll()
            }
        }
        .task {
            await store.fetchAll()
        }
    }
}
```

**Step 3: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 4: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/PillFilterView.swift apps/ops/BlazzTime/BlazzTimeIOS/AllTodosView.swift
git commit -m "feat(ops): add AllTodosView with pill status filters"
```

---

### Task 10: Create TodoDetailView

Detail view when tapping a todo — metadata pills + description + tags.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/TodoDetailView.swift`

**Step 1: Create TodoDetailView**

```swift
import SwiftUI

struct TodoDetailView: View {
    let todo: TodoItem

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Title
                Text(todo.text)
                    .font(.title.bold())
                    .foregroundStyle(.white)

                // Metadata pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        // Status pill
                        MetadataPill(
                            icon: nil,
                            text: statusLabel(todo.status),
                            color: statusColor(todo.status)
                        )

                        // Priority pill
                        if let priority = todo.priority {
                            MetadataPill(
                                icon: "exclamationmark.triangle.fill",
                                text: priority.capitalized,
                                color: priorityColor(priority)
                            )
                        }

                        // Due date pill
                        if let dueDate = todo.dueDate {
                            MetadataPill(
                                icon: "calendar",
                                text: dueDate,
                                color: .gray
                            )
                        }
                    }
                }

                // Description
                if let description = todo.description, !description.isEmpty {
                    Text(description)
                        .font(.body)
                        .foregroundStyle(.white.opacity(0.7))
                        .lineSpacing(4)
                }

                // Tags
                if let tags = todo.tags, !tags.isEmpty {
                    FlowLayout(spacing: 8) {
                        ForEach(tags, id: \.self) { tag in
                            Text(tag)
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.7))
                                .padding(.horizontal, 10)
                                .padding(.vertical, 4)
                                .background(Color.white.opacity(0.1))
                                .clipShape(Capsule())
                        }
                    }
                }
            }
            .padding()
        }
        .background(Color.black)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    // MARK: - Helpers

    private func statusLabel(_ status: String) -> String {
        switch status {
        case "triage": return "Triage"
        case "todo": return "Todo"
        case "in_progress": return "In Progress"
        case "blocked": return "Blocked"
        case "done": return "Done"
        default: return status
        }
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "triage": return .gray
        case "todo": return .white
        case "in_progress": return .yellow
        case "blocked": return .red
        case "done": return .green
        default: return .gray
        }
    }

    private func priorityColor(_ priority: String) -> Color {
        switch priority {
        case "urgent": return .red
        case "high": return .orange
        case "normal": return .blue
        case "low": return .gray
        default: return .blue
        }
    }
}

// MARK: - MetadataPill

private struct MetadataPill: View {
    let icon: String?
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 10))
            }
            Text(text)
                .font(.caption)
                .fontWeight(.medium)
        }
        .foregroundStyle(color)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(color.opacity(0.15))
        .clipShape(Capsule())
    }
}

// MARK: - FlowLayout (simple tag layout)

private struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposableSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrange(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposableSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: proposal, subviews: subviews)
        for (index, position) in result.positions.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + position.x, y: bounds.minY + position.y), proposal: .unspecified)
        }
    }

    private func arrange(proposal: ProposableSize, subviews: Subviews) -> (size: CGSize, positions: [CGPoint]) {
        let maxWidth = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(CGPoint(x: x, y: y))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), positions)
    }
}
```

**Step 2: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 3: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/TodoDetailView.swift
git commit -m "feat(ops): add TodoDetailView with metadata pills and tags"
```

---

### Task 11: Create LoginView and wire up the app entry point

Login screen + TabView + auth gating.

**Files:**
- Create: `apps/ops/BlazzTime/BlazzTimeIOS/LoginView.swift`
- Modify: `apps/ops/BlazzTime/BlazzTimeIOS/BlazzTimeIOSApp.swift`

**Step 1: Create LoginView**

```swift
import SwiftUI

struct LoginView: View {
    let authManager: AuthManager
    @State private var showWebView = false

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            // Logo
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 64))
                .foregroundStyle(.white)

            Text("Blazz Todos")
                .font(.largeTitle.bold())
                .foregroundStyle(.white)

            Text("Vos tâches, partout.")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.5))

            Spacer()

            // Login button
            Button {
                showWebView = true
            } label: {
                Text("Se connecter avec Google")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.black)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(Color.white)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 48)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.black)
        .sheet(isPresented: $showWebView) {
            IOSWebViewRepresentable(authManager: authManager) {
                showWebView = false
            }
            .ignoresSafeArea()
        }
    }
}
```

**Step 2: Update BlazzTimeIOSApp.swift**

Replace the placeholder with the full app:

```swift
import SwiftUI

@main
struct BlazzTimeIOSApp: App {
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    MainTabView(authManager: authManager)
                } else {
                    LoginView(authManager: authManager)
                }
            }
            .preferredColorScheme(.dark)
        }
    }
}

struct MainTabView: View {
    let authManager: AuthManager
    @State private var store: TodoStore

    init(authManager: AuthManager) {
        self.authManager = authManager
        self._store = State(initialValue: TodoStore(client: ConvexClient(authManager: authManager)))
    }

    var body: some View {
        TabView {
            TodayView(store: store)
                .tabItem {
                    Label("Aujourd'hui", systemImage: "sun.max")
                }

            AllTodosView(store: store)
                .tabItem {
                    Label("Tâches", systemImage: "checklist")
                }
        }
        .tint(.white)
    }
}
```

**Step 3: Verify iOS build**

```bash
cd apps/ops/BlazzTime
xcodegen generate
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 4: Verify macOS build still works**

```bash
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTime -configuration Debug build 2>&1 | tail -3
```

Expected: `** BUILD SUCCEEDED **`

**Step 5: Commit**

```bash
git add apps/ops/BlazzTime/BlazzTimeIOS/
git commit -m "feat(ops): wire up iOS app with login, tab bar, and all views"
```

---

### Task 12: Launch in Simulator and verify

Run the app in the iOS Simulator to confirm everything works end-to-end.

**Step 1: Boot simulator**

```bash
xcrun simctl boot "iPhone 16" 2>/dev/null; open -a Simulator
```

**Step 2: Build and run**

```bash
cd apps/ops/BlazzTime
xcodebuild -project BlazzTime.xcodeproj -scheme BlazzTimeIOS -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5
```

**Step 3: Install and launch**

```bash
xcrun simctl install booted /Users/jonathanruas/Library/Developer/Xcode/DerivedData/BlazzTime-dtbprcdgluoqjdheldlzsfkpsjnj/Build/Products/Debug-iphonesimulator/BlazzTimeIOS.app
xcrun simctl launch booted dev.blazz.blazztime.ios
```

**Step 4: Verify**

- App launches to LoginView (black screen, white "Se connecter avec Google" button)
- Tapping login opens WebView sheet
- After OAuth → TabView with "Aujourd'hui" and "Tâches" tabs
- Pull-to-refresh works on both tabs
- Tapping a todo opens detail view

**Step 5: Final commit**

```bash
git add -A apps/ops/BlazzTime/
git commit -m "feat(ops): BlazzTime iOS todos app — complete V1"
```
