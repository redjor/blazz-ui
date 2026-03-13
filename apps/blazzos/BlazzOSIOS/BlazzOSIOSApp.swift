import SwiftUI

@main
struct BlazzOSIOSApp: App {
    @StateObject private var authManager = AuthManager()
    @State private var convex = ConvexService()

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    MainTabView(convex: convex, authManager: authManager)
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
    let authManager: AuthManager

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

            SettingsView(authManager: authManager)
                .tabItem {
                    Label("Réglages", systemImage: "gear")
                }
        }
        .tint(.white)
    }
}

struct SettingsView: View {
    @ObservedObject var authManager: AuthManager

    var body: some View {
        NavigationStack {
            List {
                Button(role: .destructive) {
                    authManager.deleteToken()
                } label: {
                    Label("Se déconnecter", systemImage: "rectangle.portrait.and.arrow.right")
                }
            }
            .navigationTitle("Réglages")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
