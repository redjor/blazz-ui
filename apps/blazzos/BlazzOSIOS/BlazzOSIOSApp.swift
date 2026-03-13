import SwiftUI

@main
struct BlazzOSIOSApp: App {
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
