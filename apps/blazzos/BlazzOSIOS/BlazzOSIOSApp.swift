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
