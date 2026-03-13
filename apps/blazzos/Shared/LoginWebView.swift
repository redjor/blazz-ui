import AuthenticationServices
import SwiftUI

// MARK: - ASWebAuthenticationSession login

/// Opens the system browser for Google OAuth, then catches the `blazzos://auth?token=` callback.
final class BrowserAuth {
    static func login(authManager: AuthManager, completion: (() -> Void)? = nil) {
        let loginURL = URL(string: "\(ConvexService.appURL)/login/mobile")!

        let session = ASWebAuthenticationSession(
            url: loginURL,
            callbackURLScheme: "blazzos"
        ) { callbackURL, error in
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

        #if os(macOS)
        session.presentationContextProvider = MacPresentationContext.shared
        #endif

        session.prefersEphemeralWebBrowserSession = false // Use existing browser session
        session.start()
    }
}

// MARK: - macOS

#if os(macOS)
import AppKit

struct LoginWindow {
    static func open(authManager: AuthManager) {
        BrowserAuth.login(authManager: authManager)
    }
}

private class MacPresentationContext: NSObject, ASWebAuthenticationPresentationContextProviding {
    static let shared = MacPresentationContext()

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        NSApp.keyWindow ?? NSApp.windows.first ?? ASPresentationAnchor()
    }
}
#endif
