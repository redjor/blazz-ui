import SwiftUI
import WebKit

// MARK: - Shared JS & Coordinator

private let tokenExtractionJS = """
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
"""

class AuthWebViewCoordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let authManager: AuthManager
    let onDone: () -> Void
    private var tokenReceived = false

    init(authManager: AuthManager, onDone: @escaping () -> Void) {
        self.authManager = authManager
        self.onDone = onDone
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let value = message.body as? String, !value.isEmpty else { return }

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

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard !tokenReceived else { return }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            webView.evaluateJavaScript(tokenExtractionJS)
        }
    }

    func makeWebView() -> WKWebView {
        let config = WKWebViewConfiguration()
        config.userContentController.add(self, name: "auth")

        let script = WKUserScript(
            source: tokenExtractionJS,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: false
        )
        config.userContentController.addUserScript(script)

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self

        let loginURL = URL(string: "\(ConvexClient.appURL)/login")!
        webView.load(URLRequest(url: loginURL))

        return webView
    }
}

// MARK: - macOS

#if os(macOS)
import AppKit

struct LoginWindow {
    private static var window: NSWindow?

    static func open(authManager: AuthManager) {
        if let existing = window, existing.isVisible {
            existing.makeKeyAndOrderFront(nil)
            return
        }

        let webView = MacAuthWebView(authManager: authManager) { close() }
        let hostingView = NSHostingView(rootView: webView)

        let win = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 420, height: 560),
            styleMask: [.titled, .closable],
            backing: .buffered,
            defer: false
        )
        win.title = "BlazzOS — Connexion"
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

private struct MacAuthWebView: View {
    let authManager: AuthManager
    let onDone: () -> Void

    var body: some View {
        MacWebViewRepresentable(authManager: authManager, onDone: onDone)
            .frame(width: 420, height: 560)
    }
}

private struct MacWebViewRepresentable: NSViewRepresentable {
    let authManager: AuthManager
    let onDone: () -> Void

    func makeCoordinator() -> AuthWebViewCoordinator {
        AuthWebViewCoordinator(authManager: authManager, onDone: onDone)
    }

    func makeNSView(context: Context) -> WKWebView {
        context.coordinator.makeWebView()
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {}
}
#endif

// MARK: - iOS

#if os(iOS)
struct IOSWebViewRepresentable: UIViewRepresentable {
    let authManager: AuthManager
    let onDone: () -> Void

    func makeCoordinator() -> AuthWebViewCoordinator {
        AuthWebViewCoordinator(authManager: authManager, onDone: onDone)
    }

    func makeUIView(context: Context) -> WKWebView {
        context.coordinator.makeWebView()
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
#endif
