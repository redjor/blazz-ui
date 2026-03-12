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
