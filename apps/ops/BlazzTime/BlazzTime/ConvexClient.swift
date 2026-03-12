import Foundation

final class ConvexClient: ObservableObject {
    /// Set this to your Convex deployment URL, e.g. "https://your-deployment-123.convex.cloud"
    static let deploymentURL = "https://rightful-guineapig-376.eu-west-1.convex.cloud"

    @Published var projects: [Project] = []
    @Published var todayEntries: [TimeEntry] = []
    @Published var isLoading = false
    @Published var error: String?

    private let authManager: AuthManager

    init(authManager: AuthManager) {
        self.authManager = authManager
    }

    // MARK: - Public API

    @MainActor
    func fetchProjects() async {
        do {
            let result: [Project] = try await query("projects:listActive", args: [:])
            projects = result
        } catch {
            self.error = "Erreur projets: \(error.localizedDescription)"
        }
    }

    @MainActor
    func fetchTodayEntries() async {
        let today = Self.todayString()
        do {
            let result: [TimeEntry] = try await query("timeEntries:listByDate", args: ["date": today])
            todayEntries = result
            self.error = nil
        } catch {
            self.error = "Erreur entrées: \(error.localizedDescription)"
        }
    }

    @MainActor
    func createEntry(projectId: String, minutes: Int, hourlyRate: Double, description: String?) async throws {
        let today = Self.todayString()
        var args: [String: Any] = [
            "projectId": projectId,
            "date": today,
            "minutes": minutes,
            "hourlyRate": hourlyRate,
            "billable": true,
        ]
        if let description, !description.isEmpty {
            args["description"] = description
        }
        let _: String? = try await mutation("timeEntries:create", args: args)
        // Refresh today's entries after creation
        await fetchTodayEntries()
    }

    // MARK: - HTTP

    private func query<T: Decodable>(_ path: String, args: [String: Any]) async throws -> T {
        try await request(endpoint: "query", path: path, args: args)
    }

    private func mutation<T: Decodable>(_ path: String, args: [String: Any]) async throws -> T {
        try await request(endpoint: "mutation", path: path, args: args)
    }

    private func request<T: Decodable>(endpoint: String, path: String, args: [String: Any]) async throws -> T {
        guard let token = authManager.getToken() else {
            throw ConvexClientError.notAuthenticated
        }

        let url = URL(string: "\(Self.deploymentURL)/api/\(endpoint)")!
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = ["path": path, "args": args, "format": "json"]
        urlRequest.httpBody = try JSONSerialization.data(withJSONObject: body)

        print("[ConvexClient] \(endpoint) \(path) → \(Self.deploymentURL)/api/\(endpoint)")

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw ConvexClientError.invalidResponse
        }

        let responseBody = String(data: data, encoding: .utf8) ?? "(empty)"
        print("[ConvexClient] \(path) → HTTP \(httpResponse.statusCode): \(responseBody.prefix(500))")

        if httpResponse.statusCode == 401 {
            await MainActor.run { authManager.deleteToken() }
            throw ConvexClientError.notAuthenticated
        }

        guard httpResponse.statusCode == 200 else {
            throw ConvexClientError.serverError(httpResponse.statusCode, responseBody)
        }

        let decoded = try JSONDecoder().decode(ConvexQueryResponse<T>.self, from: data)
        return decoded.value
    }

    // MARK: - Helpers

    static func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}

private struct ConvexQueryResponse<T: Decodable>: Decodable {
    let value: T
    let status: String?
}

enum ConvexClientError: LocalizedError {
    case notAuthenticated
    case invalidResponse
    case serverError(Int, String)

    var errorDescription: String? {
        switch self {
        case .notAuthenticated: return "Non authentifié"
        case .invalidResponse: return "Réponse invalide"
        case .serverError(let code, let body): return "Erreur \(code): \(body)"
        }
    }
}
