import WidgetKit
import SwiftUI

struct BlazzTimeWidget: Widget {
    let kind = "BlazzTimeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: TodoProvider()) { entry in
            TodoWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Blazz Todos")
        .description("Vos tâches du jour")
        .supportedFamilies([.systemMedium])
    }
}

// MARK: - Widget View

struct TodoWidgetView: View {
    let entry: TodoEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            // Header
            HStack {
                Image(systemName: "checklist")
                    .foregroundStyle(.secondary)
                Text("Aujourd'hui")
                    .font(.headline)
                Spacer()
                Text("\(entry.todos.count) tâche\(entry.todos.count > 1 ? "s" : "")")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            if let error = entry.error {
                Spacer()
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
                Spacer()
            } else if entry.todos.isEmpty {
                Spacer()
                HStack {
                    Spacer()
                    VStack(spacing: 4) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.title2)
                            .foregroundStyle(.green)
                        Text("Rien pour aujourd'hui")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                }
                Spacer()
            } else {
                ForEach(entry.todos) { todo in
                    HStack(spacing: 6) {
                        Circle()
                            .fill(priorityColor(todo.priority))
                            .frame(width: 8, height: 8)
                        Text(todo.text)
                            .font(.callout)
                            .lineLimit(1)
                        Spacer()
                    }
                }

                if entry.todos.count < 5 {
                    Spacer()
                }
            }

            // Footer
            HStack {
                Spacer()
                Text("Mis à jour à \(timeString(entry.lastUpdated))")
                    .font(.caption2)
                    .foregroundStyle(.quaternary)
            }
        }
        .padding(2)
    }

    private func priorityColor(_ priority: String?) -> Color {
        switch priority {
        case "urgent": return .red
        case "high": return .orange
        case "normal": return .blue
        case "low": return .gray
        default: return .blue
        }
    }

    private func timeString(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}

// MARK: - Preview

#Preview(as: .systemMedium) {
    BlazzTimeWidget()
} timeline: {
    TodoEntry.placeholder
    TodoEntry.empty
}
