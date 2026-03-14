import SwiftUI

struct AllTodosView: View {
    let convex: ConvexService
    @State private var selectedStatus: String? = nil
    @State private var showCreateSheet = false
    @State private var editingTodoId: String?

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
                                TodoRowView(todo: todo)
                                    .padding(.horizontal)
                                    .onTapGesture {
                                        editingTodoId = todo._id
                                    }
                                    .contextMenu {
                                        Button {
                                            Task {
                                                let next = nextStatus(todo.status)
                                                try? await convex.updateTodoStatus(id: todo._id, status: next)
                                            }
                                        } label: {
                                            Label(nextStatusLabel(todo.status), systemImage: nextStatusIcon(todo.status))
                                        }
                                        Button(role: .destructive) {
                                            Task {
                                                try? await convex.deleteTodo(id: todo._id)
                                            }
                                        } label: {
                                            Label("Supprimer", systemImage: "trash")
                                        }
                                    }
                            }
                        }
                    }
                }
            }
            .background(Color.black)
            .navigationTitle("Tâches")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showCreateSheet = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showCreateSheet) {
                TodoCreateSheet(convex: convex)
            }
            .sheet(item: Binding(
                get: { editingTodoId.map { EditingTodo(id: $0) } },
                set: { editingTodoId = $0?.id }
            )) { item in
                TodoEditSheet(todoId: item.id, convex: convex)
            }
        }
    }

    private func nextStatus(_ current: String) -> String {
        switch current {
        case "triage": return "todo"
        case "todo": return "in_progress"
        case "in_progress": return "done"
        case "blocked": return "todo"
        case "done": return "triage"
        default: return "todo"
        }
    }

    private func nextStatusLabel(_ current: String) -> String {
        switch nextStatus(current) {
        case "todo": return "Todo"
        case "in_progress": return "En cours"
        case "done": return "Terminé"
        case "triage": return "Triage"
        default: return "Avancer"
        }
    }

    private func nextStatusIcon(_ current: String) -> String {
        switch nextStatus(current) {
        case "todo": return "circle"
        case "in_progress": return "play.circle"
        case "done": return "checkmark.circle.fill"
        case "triage": return "arrow.counterclockwise"
        default: return "arrow.right.circle"
        }
    }

    private func nextStatusColor(_ current: String) -> Color {
        switch nextStatus(current) {
        case "todo": return .white
        case "in_progress": return .yellow
        case "done": return .green
        case "triage": return .gray
        default: return .blue
        }
    }
}
