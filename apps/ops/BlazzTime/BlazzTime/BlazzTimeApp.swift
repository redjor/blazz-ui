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
