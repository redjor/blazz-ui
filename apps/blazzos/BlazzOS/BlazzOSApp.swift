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
                if authManager.isAuthenticated {
                    convex.configure(authManager: authManager)
                }
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
