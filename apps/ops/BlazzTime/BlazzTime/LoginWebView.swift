import SwiftUI
import WebKit

/// Opens a native window with a WKWebView that loads the Blazz Ops login page.
/// After Google OAuth completes, extracts the Convex JWT from localStorage
/// and passes it back via the onToken callback.
struct LoginWindow {
    private static var window: NSWindow?

    static func open(authManager: AuthManager) {
        if let existing = window, existing.isVisible {
            existing.makeKeyAndOrderFront(nil)
            return
        }

        let webView = AuthWebView(authManager: authManager) {
            close()
        }
        let hostingView = NSHostingView(rootView: webView)

        let win = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 420, height: 560),
            styleMask: [.titled, .closable],
            backing: .buffered,
            defer: false
        )
        win.title = "Blazz Time — Connexion"
        win.contentView = hostingView
        win.center()
        win.isReleasedWhenClosed = false
        win.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)

        window = win
    }

    static func close() {
        window?.close()
        window = nil
    }
}

// MARK: - SwiftUI wrapper for WKWebView

private struct AuthWebView: View {
    let authManager: AuthManager
    let onDone: () -> Void

    var body: some View {
        WebViewRepresentable(authManager: authManager, onDone: onDone)
            .frame(width: 420, height: 560)
    }
}

private struct WebViewRepresentable: NSViewRepresentable {
    let authManager: AuthManager
    let onDone: () -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(authManager: authManager, onDone: onDone)
    }

    func makeNSView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()

        // Add message handler for receiving the token from JS
        config.userContentController.add(context.coordinator, name: "auth")

        // Inject script that checks for token after each navigation
        let script = WKUserScript(
            source: """
            (function checkToken() {
                var token = localStorage.getItem('__convexAuthJWT');
                if (token && token.length > 10) {
                    window.webkit.messageHandlers.auth.postMessage(token);
                }
            })();
            """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(script)

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator

        // Load the login page
        let loginURL = URL(string: "\(ConvexClient.appURL)/login")!
        webView.load(URLRequest(url: loginURL))

        return webView
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {}
}

// MARK: - Coordinator

private class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let authManager: AuthManager
    let onDone: () -> Void
    private var tokenReceived = false

    init(authManager: AuthManager, onDone: @escaping () -> Void) {
        self.authManager = authManager
        self.onDone = onDone
    }

    // Called when JS sends a message via webkit.messageHandlers.auth
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard !tokenReceived,
              let token = message.body as? String,
              !token.isEmpty else { return }

        tokenReceived = true
        print("[LoginWebView] Token received (\(token.prefix(20))...)")

        DispatchQueue.main.async {
            self.authManager.saveToken(token)
            self.onDone()
        }
    }

    // Re-check for token after each page navigation (e.g., after OAuth redirect)
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard !tokenReceived else { return }

        // Wait a moment for localStorage to be populated after redirect
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            webView.evaluateJavaScript("""
                (function() {
                    var token = localStorage.getItem('__convexAuthJWT');
                    if (token && token.length > 10) {
                        window.webkit.messageHandlers.auth.postMessage(token);
                    }
                })();
            """)
        }
    }
}
