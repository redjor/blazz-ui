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
                // Debug: log all localStorage keys
                var keys = [];
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    var val = localStorage.getItem(key);
                    keys.push(key + ' = ' + (val ? val.substring(0, 50) : 'null'));
                }
                window.webkit.messageHandlers.auth.postMessage('__debug__:' + JSON.stringify(keys));

                // Try known Convex token keys
                var token = null;
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    var val = localStorage.getItem(key);
                    if (val && val.length > 100 && (key.includes('auth') || key.includes('token') || key.includes('convex'))) {
                        token = val;
                        break;
                    }
                }
                if (token) {
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
        guard let value = message.body as? String, !value.isEmpty else { return }

        // Debug messages
        if value.hasPrefix("__debug__:") {
            let debugInfo = value.dropFirst("__debug__:".count)
            print("[LoginWebView] localStorage keys: \(debugInfo)")
            return
        }

        guard !tokenReceived else { return }
        tokenReceived = true
        print("[LoginWebView] Token received (\(value.prefix(30))...)")

        DispatchQueue.main.async {
            self.authManager.saveToken(value)
            self.onDone()
        }
    }

    // Re-check for token after each page navigation (e.g., after OAuth redirect)
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard !tokenReceived else { return }

        // Wait a moment for localStorage to be populated after redirect
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            webView.evaluateJavaScript("""
                (function() {
                    var keys = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        var val = localStorage.getItem(key);
                        keys.push(key + ' = ' + (val ? val.substring(0, 50) : 'null'));
                    }
                    window.webkit.messageHandlers.auth.postMessage('__debug__:' + JSON.stringify(keys));

                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        var val = localStorage.getItem(key);
                        if (val && val.length > 100 && (key.includes('auth') || key.includes('token') || key.includes('convex'))) {
                            window.webkit.messageHandlers.auth.postMessage(val);
                            return;
                        }
                    }
                })();
            """)
        }
    }
}
