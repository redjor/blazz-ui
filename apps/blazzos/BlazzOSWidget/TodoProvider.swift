import WidgetKit
import Foundation
import Security

struct TodoItem: Identifiable {
    let id: String
    let text: String
    let priority: String?
    let status: String
}

struct TodoEntry: TimelineEntry {
    let date: Date
    let todos: [TodoItem]
    let error: String?
    let lastUpdated: Date

    static var placeholder: TodoEntry {
        TodoEntry(
            date: Date(),
            todos: [
                TodoItem(id: "1", text: "Envoyer facture client", priority: "urgent", status: "todo"),
                TodoItem(id: "2", text: "Revoir PR design system", priority: "high", status: "in_progress"),
                TodoItem(id: "3", text: "Préparer démo vendredi", priority: "normal", status: "todo"),
            ],
            error: nil,
            lastUpdated: Date()
        )
    }

    static var empty: TodoEntry {
        TodoEntry(date: Date(), todos: [], error: nil, lastUpdated: Date())
    }
}

struct TodoProvider: TimelineProvider {
    private static let deploymentURL = "https://rightful-guineapig-376.eu-west-1.convex.cloud"

    func placeholder(in context: Context) -> TodoEntry {
        .placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (TodoEntry) -> Void) {
        if context.isPreview {
            completion(.placeholder)
            return
        }
        fetchTodos { entry in
            completion(entry)
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<TodoEntry>) -> Void) {
        fetchTodos { entry in
            // Refresh in 30 minutes
            let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
            let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
            completion(timeline)
        }
    }

    // MARK: - Convex HTTP

    private func fetchTodos(completion: @escaping (TodoEntry) -> Void) {
        guard let token = getToken() else {
            completion(TodoEntry(date: Date(), todos: [], error: "Non connecté", lastUpdated: Date()))
            return
        }

        let today = todayString()
        let url = URL(string: "\(Self.deploymentURL)/api/query")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "path": "todos:listByDate",
            "args": ["date": today],
            "format": "json"
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let value = json["value"] as? [[String: Any]] else {
                let errorMsg = error?.localizedDescription ?? "Erreur réseau"
                completion(TodoEntry(date: Date(), todos: [], error: errorMsg, lastUpdated: Date()))
                return
            }

            let todos = value.prefix(5).map { item in
                TodoItem(
                    id: item["_id"] as? String ?? UUID().uuidString,
                    text: item["text"] as? String ?? "",
                    priority: item["priority"] as? String,
                    status: item["status"] as? String ?? "todo"
                )
            }

            completion(TodoEntry(date: Date(), todos: Array(todos), error: nil, lastUpdated: Date()))
        }.resume()
    }

    // MARK: - Keychain (same as AuthManager)

    private func getToken() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: "dev.blazz.blazzos",
            kSecAttrAccount as String: "convex-token",
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    private func todayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: Date())
    }
}
