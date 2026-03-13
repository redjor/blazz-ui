import Combine
import ConvexMobile
import Foundation

// MARK: - Keychain Auth Provider

/// AuthProvider that reads JWT from Keychain via AuthManager.
final class KeychainAuthProvider: AuthProvider {
    private let authManager: AuthManager

    init(authManager: AuthManager) {
        self.authManager = authManager
    }

    func login(onIdToken: @Sendable @escaping (String?) -> Void) async throws -> String {
        guard let token = authManager.getToken() else {
            throw ConvexServiceError.notAuthenticated
        }
        onIdToken(token)
        return token
    }

    func loginFromCache(onIdToken: @Sendable @escaping (String?) -> Void) async throws -> String {
        guard let token = authManager.getToken() else {
            throw ConvexServiceError.notAuthenticated
        }
        onIdToken(token)
        return token
    }

    func logout() async throws {
        authManager.deleteToken()
    }

    func extractIdToken(from authResult: String) -> String {
        authResult
    }
}

// MARK: - Convex Service

/// Singleton wrapping ConvexClientWithAuth for real-time subscriptions.
@Observable
final class ConvexService {
    // MARK: Published State

    var projects: [Project] = []
    var todayEntries: [TimeEntry] = []
    var todayTodos: [TodoItem] = []
    var allTodos: [TodoItem] = []
    var isLoading = false
    var error: String?

    // MARK: Private

    private var client: ConvexClientWithAuth<String>?
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Configuration

    func configure(authManager: AuthManager) {
        let deploymentURL = Bundle.main.infoDictionary?["ConvexURL"] as? String ?? ""
        guard !deploymentURL.isEmpty else {
            error = "ConvexURL not configured"
            return
        }

        let provider = KeychainAuthProvider(authManager: authManager)
        client = ConvexClientWithAuth(deploymentUrl: deploymentURL, authProvider: provider)

        // Authenticate from cached keychain token
        Task {
            _ = await client?.loginFromCache()
        }
    }

    // MARK: - Subscriptions

    func subscribeProjects() {
        guard let client else { return }
        client.subscribe(to: "projects:listActive", yielding: [Project].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] projects in
                self?.projects = projects
            }
            .store(in: &cancellables)
    }

    func subscribeTodayEntries() {
        guard let client else { return }
        let today = Self.todayString()
        client.subscribe(to: "timeEntries:listByDate", with: ["date": today], yielding: [TimeEntry].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] entries in
                self?.todayEntries = entries
            }
            .store(in: &cancellables)
    }

    func subscribeTodayTodos() {
        guard let client else { return }
        let today = Self.todayString()
        client.subscribe(to: "todos:listByDate", with: ["date": today], yielding: [TodoItem].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] todos in
                self?.todayTodos = todos
            }
            .store(in: &cancellables)
    }

    func subscribeAllTodos() {
        guard let client else { return }
        client.subscribe(to: "todos:list", yielding: [TodoItem].self)
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .sink { [weak self] todos in
                self?.allTodos = todos
            }
            .store(in: &cancellables)
    }

    // MARK: - Mutations

    func createTimeEntry(
        projectId: String,
        minutes: Int,
        hourlyRate: Double,
        description: String?,
        billable: Bool = true
    ) async throws {
        guard let client else { throw ConvexServiceError.notConfigured }
        var args: [String: ConvexEncodable?] = [
            "projectId": projectId,
            "date": Self.todayString(),
            "minutes": minutes,
            "hourlyRate": hourlyRate,
            "billable": billable,
        ]
        if let description, !description.isEmpty {
            args["description"] = description
        }
        try await client.mutation("timeEntries:create", with: args)
    }

    // MARK: - Helpers

    static let appURL: String = Bundle.main.infoDictionary?["AppURL"] as? String ?? ""

    static func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}

// MARK: - Errors

enum ConvexServiceError: LocalizedError {
    case notConfigured
    case notAuthenticated

    var errorDescription: String? {
        switch self {
        case .notConfigured: return "Convex not configured"
        case .notAuthenticated: return "Non authentifié"
        }
    }
}
