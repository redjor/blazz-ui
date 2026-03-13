# Design: Real-time sync via convex-swift

## Date: 2026-03-13

## Problem
The BlazzOS native apps (macOS + iOS) use HTTP REST queries to fetch data from Convex.
Changes made in the web app don't appear on mobile until manual refresh.

## Solution
Replace the custom HTTP `ConvexClient.swift` with the official `convex-swift` package
which provides WebSocket-based real-time subscriptions.

## Architecture

### Package
- `convex-swift` via SPM (https://github.com/get-convex/convex-swift)
- `ConvexClientWithAuth` singleton with custom `AuthProvider` reading Keychain token

### Subscriptions (Combine Publishers)
```
subscribe("todos:list") → Publisher<[TodoItem]>
subscribe("todos:listByDate", args: ["date": today]) → Publisher<[TodoItem]>
subscribe("projects:listActive") → Publisher<[Project]>
subscribe("timeEntries:listByDate", args: ["date": today]) → Publisher<[TimeEntry]>
```

### Mutations (async/await)
```
mutation("timeEntries:create", with: args)
```

### Auth
- Custom `AuthProvider` protocol implementation
- Reads JWT from Keychain (existing `AuthManager`)
- Passes token to `ConvexClientWithAuth` on init and after login

### Widget
- Stays on HTTP REST (widgets run as snapshots, no persistent WebSocket)
- `TodoProvider.swift` unchanged

## Impact

### Files to modify
- `Shared/ConvexClient.swift` → replace with convex-swift wrapper
- `Shared/Models.swift` → make models Convex-decodable
- `BlazzOSIOS/TodoStore.swift` → subscribe instead of fetch
- `BlazzOS/QuickEntryView.swift` → subscribe to projects + entries
- `project.yml` → add SPM dependency

### Files unchanged
- `Shared/AuthManager.swift` (Keychain logic stays)
- `Shared/LoginWebView.swift`
- `BlazzOSWidget/TodoProvider.swift` (stays HTTP)
- All view files (UI unchanged, just reactive data)

## Trade-offs
- **Pro**: Real-time sync, official support, less custom code
- **Pro**: Automatic reconnection handled by library
- **Con**: Adds binary dependency (Rust-based XCFramework)
- **Con**: Widget can't use it (no persistent process)
