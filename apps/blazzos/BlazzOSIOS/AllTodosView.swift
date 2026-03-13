import SwiftUI

struct AllTodosView: View {
    let convex: ConvexService
    @State private var selectedStatus: String? = nil

    private let filterOptions: [(label: String, value: String?)] = [
        ("Toutes", nil),
        ("Triage", "triage"),
        ("Todo", "todo"),
        ("In Progress", "in_progress"),
        ("Blocked", "blocked"),
        ("Done", "done"),
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                PillFilterView(options: filterOptions, selected: $selectedStatus)
                    .padding(.vertical, 12)

                ScrollView {
                    LazyVStack(spacing: 0) {
                        let todos = TodoStoreHelpers.todosFiltered(from: convex.allTodos, by: selectedStatus)
                        if todos.isEmpty {
                            Text("Aucune tâche")
                                .font(.callout)
                                .foregroundStyle(.white.opacity(0.5))
                                .padding(.top, 80)
                        } else {
                            ForEach(todos) { todo in
                                NavigationLink(value: todo) {
                                    TodoRowView(todo: todo)
                                }
                                .buttonStyle(.plain)
                                .padding(.horizontal)
                            }
                        }
                    }
                }
                .navigationDestination(for: TodoItem.self) { todo in
                    TodoDetailView(todo: todo)
                }
            }
            .background(Color.black)
            .navigationTitle("Tâches")
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}
