import SwiftUI
import ServiceManagement

@main
struct BlazzOSApp: App {
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
            if offlineBuffer.hasPending {
                Label("BlazzOS", systemImage: "clock.badge.exclamationmark")
            } else {
                Image("MenuBarIcon")
            }
        }
        .menuBarExtraStyle(.window)
    }
}
