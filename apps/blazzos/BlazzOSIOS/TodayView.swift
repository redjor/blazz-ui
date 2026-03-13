import SwiftUI

struct TodayView: View {
    let store: TodoStore

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Text("\(formattedDate) — \(store.todayTodos.count) tâche\(store.todayTodos.count > 1 ? "s" : "")")
                        .font(.subheadline)
                        .foregroundStyle(.white.opacity(0.5))
                        .padding(.horizontal)
                        .padding(.bottom, 20)

                    if let error = store.error {
                        errorView(error)
                    } else if store.isLoading && store.todayTodos.isEmpty {
                        loadingView
                    } else if store.todayTodos.isEmpty {
                        emptyView
                    } else {
                        todoList
                    }
                }
            }
            .background(Color.black)
            .navigationTitle("Aujourd'hui")
            .toolbarColorScheme(.dark, for: .navigationBar)
            .refreshable {
                await store.fetchToday()
            }
        }
        .task {
            await store.fetchToday()
        }
    }

    @ViewBuilder
    private var todoList: some View {
        let grouped = store.todayGroupedByPriority()
        ForEach(grouped, id: \.0) { priority, todos in
            Section {
                ForEach(todos) { todo in
                    NavigationLink(value: todo) {
                        TodoRowView(todo: todo)
                    }
                    .buttonStyle(.plain)
                }
            } header: {
                Text(priorityLabel(priority))
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(.white.opacity(0.3))
                    .textCase(.uppercase)
                    .padding(.horizontal)
                    .padding(.top, 20)
                    .padding(.bottom, 6)
            }
            .padding(.horizontal)
        }
        .navigationDestination(for: TodoItem.self) { todo in
            TodoDetailView(todo: todo)
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
            Button("Réessayer") {
                Task { await store.fetchToday() }
            }
            .buttonStyle(.bordered)
            .tint(.white)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 80)
    }

    private var loadingView: some View {
        ProgressView()
            .tint(.white)
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
}
