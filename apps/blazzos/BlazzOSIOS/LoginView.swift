import SwiftUI

struct LoginView: View {
    let authManager: AuthManager
    @State private var showWebView = false

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 64))
                .foregroundStyle(.white)

            Text("BlazzOS")
                .font(.largeTitle.bold())
                .foregroundStyle(.white)

            Text("Vos tâches, partout.")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.5))

            Spacer()

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
