import AuthenticationServices
import SwiftUI

// MARK: - ASWebAuthenticationSession login

/// Opens the system browser for Google OAuth, then catches the `blazzos://auth?token=` callback.
final class BrowserAuth: NSObject, ASWebAuthenticationPresentationContextProviding {
    private static let shared = BrowserAuth()
    private static var activeSession: ASWebAuthenticationSession?

    static func login(authManager: AuthManager, completion: (() -> Void)? = nil) {
        let loginURL = URL(string: "\(ConvexService.appURL)/login/mobile")!

        let session = ASWebAuthenticationSession(
            url: loginURL,
            callbackURLScheme: "blazzos"
        ) { callbackURL, error in
            activeSession = nil

            guard let callbackURL, error == nil,
                  let components = URLComponents(url: callbackURL, resolvingAgainstBaseURL: false),
                  let token = components.queryItems?.first(where: { $0.name == "token" })?.value
            else {
                print("[BrowserAuth] Auth cancelled or failed: \(error?.localizedDescription ?? "no callback")")
                return
            }

            print("[BrowserAuth] Token received (\(token.prefix(30))...)")
            DispatchQueue.main.async {
                authManager.saveToken(token)
                completion?()
            }
        }

        session.presentationContextProvider = shared
        session.prefersEphemeralWebBrowserSession = false
        activeSession = session
        session.start()
    }

    // MARK: - ASWebAuthenticationPresentationContextProviding

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        #if os(macOS)
        return NSApp.keyWindow ?? NSApp.windows.first ?? ASPresentationAnchor()
        #else
        return UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap { $0.windows }
            .first(where: { $0.isKeyWindow }) ?? ASPresentationAnchor()
        #endif
    }
}

// MARK: - macOS

#if os(macOS)
struct LoginWindow {
    static func open(authManager: AuthManager) {
        BrowserAuth.login(authManager: authManager)
    }
}
#endif
