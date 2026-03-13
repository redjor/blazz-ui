import Foundation

enum TodoStoreHelpers {
    static func todosFiltered(from todos: [TodoItem], by status: String?) -> [TodoItem] {
        let source = status == nil ? todos : todos.filter { $0.status == status }
        return sortedByPriority(source)
    }

    static func todayGroupedByPriority(_ todos: [TodoItem]) -> [(String, [TodoItem])] {
        let order = ["urgent", "high", "normal", "low"]
        let grouped = Dictionary(grouping: todos) { $0.priority ?? "normal" }
        return order.compactMap { key in
            guard let items = grouped[key], !items.isEmpty else { return nil }
            return (key, items)
        }
    }

    private static func sortedByPriority(_ todos: [TodoItem]) -> [TodoItem] {
        let order: [String: Int] = ["urgent": 0, "high": 1, "normal": 2, "low": 3]
        return todos.sorted { (order[$0.priority ?? "normal"] ?? 2) < (order[$1.priority ?? "normal"] ?? 2) }
    }
}
