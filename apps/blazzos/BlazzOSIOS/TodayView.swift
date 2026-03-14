import SwiftUI

struct TodayView: View {
    let convex: ConvexService
    @State private var showCreateSheet = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("\(formattedDate) — \(convex.todayTodos.count) tâche\(convex.todayTodos.count > 1 ? "s" : "")")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.5))
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                }

                if let error = convex.error {
                    Section {
                        errorView(error)
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                    }
                } else if convex.todayTodos.isEmpty {
                    Section {
                        emptyView
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                    }
                } else {
                    todoList
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(Color.black)
            .navigationTitle("Aujourd'hui")
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
        }
    }

    @ViewBuilder
    private var todoList: some View {
        let grouped = TodoStoreHelpers.todayGroupedByPriority(convex.todayTodos)
        ForEach(grouped, id: \.0) { priority, todos in
            Section {
                ForEach(todos) { todo in
                    NavigationLink(value: todo) {
                        TodoRowView(todo: todo)
                    }
                    .listRowBackground(Color.black)
                    .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                        Button(role: .destructive) {
                            Task {
                                try? await convex.deleteTodo(id: todo._id)
                            }
                        } label: {
                            Label("Supprimer", systemImage: "trash")
                        }
                    }
                    .swipeActions(edge: .leading, allowsFullSwipe: true) {
                        Button {
                            Task {
                                let next = nextStatus(todo.status)
                                try? await convex.updateTodoStatus(id: todo._id, status: next)
                            }
                        } label: {
                            Label(nextStatusLabel(todo.status), systemImage: nextStatusIcon(todo.status))
                        }
                        .tint(nextStatusColor(todo.status))
                    }
                }
            } header: {
                Text(priorityLabel(priority))
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white.opacity(0.3))
                    .textCase(.uppercase)
            }
        }
        .navigationDestination(for: TodoItem.self) { todo in
            TodoDetailView(todoId: todo._id, convex: convex)
        }
    }

    @ViewBuilder
    private func errorView(_ error: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle")
                .font(.title)
                .foregroundStyle(.red)
            Text(error)
                .font(.caption)
                .foregroundStyle(.red)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var emptyView: some View {
        VStack(spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 40))
                .foregroundStyle(.green)
            Text("Rien pour aujourd'hui")
                .font(.callout)
                .foregroundStyle(.white.opacity(0.5))
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "fr_FR")
        formatter.dateFormat = "EEE d MMMM"
        return formatter.string(from: Date())
    }

    private func priorityLabel(_ priority: String) -> String {
        switch priority {
        case "urgent": return "Urgent"
        case "high": return "High"
        case "normal": return "Normal"
        case "low": return "Low"
        default: return priority
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
