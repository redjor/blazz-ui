import Foundation

@Observable
final class TodoStore {
    var todayTodos: [TodoItem] = []
    var allTodos: [TodoItem] = []
    var isLoading = false
    var error: String?

    private let client: ConvexClient

    init(client: ConvexClient) {
        self.client = client
    }

    @MainActor
    func fetchToday() async {
        isLoading = true
        error = nil
        do {
            let date = ConvexClient.todayString()
            todayTodos = try await client.fetchTodosByDate(date)
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    @MainActor
    func fetchAll() async {
        isLoading = true
        error = nil
        do {
            allTodos = try await client.fetchAllTodos()
        } catch {
            self.error = error.localizedDescription
        }
        isLoading = false
    }

    func todosFiltered(by status: String?) -> [TodoItem] {
        let source = status == nil ? allTodos : allTodos.filter { $0.status == status }
        return sortedByPriority(source)
    }

    func todayGroupedByPriority() -> [(String, [TodoItem])] {
        let order = ["urgent", "high", "normal", "low"]
        let grouped = Dictionary(grouping: todayTodos) { $0.priority ?? "normal" }
        return order.compactMap { key in
            guard let items = grouped[key], !items.isEmpty else { return nil }
            return (key, items)
        }
    }

    private func sortedByPriority(_ todos: [TodoItem]) -> [TodoItem] {
        let order: [String: Int] = ["urgent": 0, "high": 1, "normal": 2, "low": 3]
        return todos.sorted { (order[$0.priority ?? "normal"] ?? 2) < (order[$1.priority ?? "normal"] ?? 2) }
    }
}
