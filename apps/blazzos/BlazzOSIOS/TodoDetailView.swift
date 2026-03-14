import SwiftUI

struct TodoDetailView: View {
    let todoId: String
    let convex: ConvexService

    @Environment(\.dismiss) private var dismiss

    @State private var text: String = ""
    @State private var descriptionText: String = ""
    @State private var status: String = "triage"
    @State private var priority: String = "normal"
    @State private var hasDueDate: Bool = false
    @State private var dueDate: Date = Date()
    @State private var tagsText: String = ""
    @State private var isInitialized = false
    @State private var isSaving = false
    @State private var showDeleteConfirmation = false
    @State private var isEditing = false

    private let statuses = ["triage", "todo", "in_progress", "blocked", "done"]
    private let priorities = ["urgent", "high", "normal", "low"]

    /// Find the current todo from the live Convex subscription
    private var todo: TodoItem? {
        convex.allTodos.first { $0._id == todoId }
            ?? convex.todayTodos.first { $0._id == todoId }
    }

    var body: some View {
        Group {
            if todo != nil {
                formContent
            } else {
                ContentUnavailableView("Tâche introuvable", systemImage: "questionmark.circle")
            }
        }
        .background(Color.black)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                if hasChanges {
                    Button("Enregistrer") {
                        Task { await save() }
                    }
                    .disabled(text.trimmingCharacters(in: .whitespaces).isEmpty || isSaving)
                }
            }
            ToolbarItem(placement: .destructiveAction) {
                Button(role: .destructive) {
                    showDeleteConfirmation = true
                } label: {
                    Image(systemName: "trash")
                        .foregroundStyle(.red)
                }
            }
        }
        .confirmationDialog("Supprimer cette tâche ?", isPresented: $showDeleteConfirmation, titleVisibility: .visible) {
            Button("Supprimer", role: .destructive) {
                Task {
                    try? await convex.deleteTodo(id: todoId)
                    dismiss()
                }
            }
        }
        .onAppear { initializeFields() }
    }

    @ViewBuilder
    private var formContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Title
                TextField("Titre", text: $text)
                    .font(.title.bold())
                    .foregroundStyle(.white)

                // Status & Priority pickers
                HStack(spacing: 12) {
                    Menu {
                        ForEach(statuses, id: \.self) { s in
                            Button {
                                status = s
                            } label: {
                                Label(statusLabel(s), systemImage: status == s ? "checkmark" : "")
                            }
                        }
                    } label: {
                        MetadataPill(
                            icon: nil,
                            text: statusLabel(status),
                            color: statusColor(status)
                        )
                    }

                    Menu {
                        ForEach(priorities, id: \.self) { p in
                            Button {
                                priority = p
                            } label: {
                                Label(p.capitalized, systemImage: priority == p ? "checkmark" : "")
                            }
                        }
                    } label: {
                        MetadataPill(
                            icon: "exclamationmark.triangle.fill",
                            text: priority.capitalized,
                            color: priorityColor(priority)
                        )
                    }
                }

                // Due Date
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Date d'échéance", isOn: $hasDueDate)
                        .foregroundStyle(.white.opacity(0.7))
                    if hasDueDate {
                        DatePicker("", selection: $dueDate, displayedComponents: .date)
                            .datePickerStyle(.compact)
                            .labelsHidden()
                    }
                }

                // Description
                VStack(alignment: .leading, spacing: 6) {
                    Text("Description")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.4))
                    if isEditing {
                        TextField("Ajouter une description...", text: $descriptionText, axis: .vertical)
                            .lineLimit(3...10)
                            .foregroundStyle(.white.opacity(0.7))
                    } else if let rendered = renderedDescription {
                        Text(rendered)
                            .font(.body)
                            .foregroundStyle(.white.opacity(0.7))
                            .lineSpacing(4)
                            .onTapGesture { isEditing = true }
                    } else {
                        Text("Ajouter une description...")
                            .font(.body)
                            .foregroundStyle(.white.opacity(0.3))
                            .onTapGesture { isEditing = true }
                    }
                }

                // Tags
                VStack(alignment: .leading, spacing: 6) {
                    Text("Tags")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.4))
                    TextField("Séparés par des virgules", text: $tagsText)
                        .textInputAutocapitalization(.never)
                        .foregroundStyle(.white.opacity(0.7))

                    if !parsedTags.isEmpty {
                        FlowLayout(spacing: 8) {
                            ForEach(parsedTags, id: \.self) { tag in
                                Text(tag)
                                    .font(.caption)
                                    .foregroundStyle(.white.opacity(0.7))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .background(Color.white.opacity(0.1))
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }
            }
            .padding()
        }
    }

    // MARK: - State Management

    private static func stripHTML(_ html: String) -> String {
        guard html.contains("<") else { return html }
        var text = html
        // Replace <br>, <br/>, </p><p> with newlines
        text = text.replacingOccurrences(of: "<br\\s*/?>", with: "\n", options: .regularExpression)
        text = text.replacingOccurrences(of: "</p>\\s*<p>", with: "\n", options: .regularExpression)
        // Strip all remaining tags
        text = text.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
        // Decode common HTML entities
        text = text.replacingOccurrences(of: "&amp;", with: "&")
        text = text.replacingOccurrences(of: "&lt;", with: "<")
        text = text.replacingOccurrences(of: "&gt;", with: ">")
        text = text.replacingOccurrences(of: "&quot;", with: "\"")
        text = text.replacingOccurrences(of: "&#39;", with: "'")
        text = text.replacingOccurrences(of: "&nbsp;", with: " ")
        return text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func initializeFields() {
        guard !isInitialized, let todo else { return }
        text = todo.text
        descriptionText = todo.description ?? ""
        status = todo.status
        priority = todo.priority ?? "normal"
        if let d = todo.dueDate {
            hasDueDate = true
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            dueDate = formatter.date(from: d) ?? Date()
        }
        tagsText = (todo.tags ?? []).joined(separator: ", ")
        isInitialized = true
    }

    /// Strips HTML tags and returns plain text for display
    private var renderedDescription: String? {
        let raw = descriptionText
        guard !raw.isEmpty else { return nil }
        let stripped = Self.stripHTML(raw)
        return stripped.isEmpty ? nil : stripped
    }

    private var parsedTags: [String] {
        tagsText.split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
    }

    private var hasChanges: Bool {
        guard let todo else { return false }
        if text != todo.text { return true }
        if descriptionText != (todo.description ?? "") { return true }
        if status != todo.status { return true }
        if priority != (todo.priority ?? "normal") { return true }
        let currentTags = (todo.tags ?? []).joined(separator: ", ")
        if tagsText != currentTags { return true }
        if hasDueDate != (todo.dueDate != nil) { return true }
        if hasDueDate, let d = todo.dueDate {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if formatter.string(from: dueDate) != d { return true }
        }
        return false
    }

    // MARK: - Actions

    private func save() async {
        isSaving = true
        defer { isSaving = false }

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dueDateString: String? = hasDueDate ? formatter.string(from: dueDate) : nil

        // Update status separately if changed (uses dedicated mutation)
        if let todo, status != todo.status {
            try? await convex.updateTodoStatus(id: todoId, status: status)
        }

        try? await convex.updateTodo(
            id: todoId,
            text: text.trimmingCharacters(in: .whitespaces),
            description: descriptionText.isEmpty ? nil : descriptionText,
            priority: priority,
            dueDate: dueDateString,
            tags: parsedTags.isEmpty ? nil : parsedTags
        )
    }

    // MARK: - Helpers

    private func statusLabel(_ status: String) -> String {
        switch status {
        case "triage": return "Triage"
        case "todo": return "Todo"
        case "in_progress": return "In Progress"
        case "blocked": return "Blocked"
        case "done": return "Done"
        default: return status
        }
    }

    private func statusColor(_ status: String) -> Color {
        switch status {
        case "triage": return .gray
        case "todo": return .white
        case "in_progress": return .yellow
        case "blocked": return .red
        case "done": return .green
        default: return .gray
        }
    }

    private func priorityColor(_ priority: String) -> Color {
        switch priority {
        case "urgent": return .red
        case "high": return .orange
        case "normal": return .blue
        case "low": return .gray
        default: return .blue
        }
    }
}

private struct MetadataPill: View {
    let icon: String?
    let text: String
    let color: Color

    var body: some View {
        HStack(spacing: 4) {
            if let icon {
                Image(systemName: icon)
                    .font(.system(size: 10))
            }
            Text(text)
                .font(.caption)
                .fontWeight(.medium)
        }
        .foregroundStyle(color)
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(color.opacity(0.15))
        .clipShape(Capsule())
    }
}

private struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrange(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: ProposedViewSize(width: bounds.width, height: bounds.height), subviews: subviews)
        for (index, position) in result.positions.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + position.x, y: bounds.minY + position.y), proposal: .unspecified)
        }
    }

    private func arrange(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, positions: [CGPoint]) {
        let maxWidth = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(CGPoint(x: x, y: y))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
        }

        return (CGSize(width: maxWidth, height: y + rowHeight), positions)
    }
}
