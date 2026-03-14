import SwiftUI

// MARK: - Read-only detail view (tap from list)

struct TodoDetailView: View {
    let todoId: String
    let convex: ConvexService
    @State private var showEditSheet = false

    private var todo: TodoItem? {
        convex.allTodos.first { $0._id == todoId }
            ?? convex.todayTodos.first { $0._id == todoId }
    }

    var body: some View {
        Group {
            if let todo {
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        Text(todo.text)
                            .font(.title.bold())
                            .foregroundStyle(.white)

                        // Status & Priority pills
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                MetadataPill(
                                    icon: nil,
                                    text: statusLabel(todo.status),
                                    color: statusColor(todo.status)
                                )

                                if let priority = todo.priority {
                                    MetadataPill(
                                        icon: "exclamationmark.triangle.fill",
                                        text: priority.capitalized,
                                        color: priorityColor(priority)
                                    )
                                }

                                if let dueDate = todo.dueDate {
                                    MetadataPill(
                                        icon: "calendar",
                                        text: dueDate,
                                        color: .gray
                                    )
                                }
                            }
                        }

                        if let description = todo.description, !description.isEmpty {
                            let cleaned = Self.stripHTML(description)
                            if !cleaned.isEmpty {
                                Text(cleaned)
                                    .font(.body)
                                    .foregroundStyle(.white.opacity(0.7))
                                    .lineSpacing(4)
                            }
                        }

                        if let tags = todo.tags, !tags.isEmpty {
                            FlowLayout(spacing: 8) {
                                ForEach(tags, id: \.self) { tag in
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
                    .padding()
                }
            } else {
                ContentUnavailableView("Tâche introuvable", systemImage: "questionmark.circle")
            }
        }
        .background(Color.black)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showEditSheet = true
                } label: {
                    Image(systemName: "pencil")
                }
            }
        }
        .sheet(isPresented: $showEditSheet) {
            TodoEditSheet(todoId: todoId, convex: convex)
        }
    }

    static func stripHTML(_ html: String) -> String {
        guard html.contains("<") else { return html }
        var text = html
        text = text.replacingOccurrences(of: "<br\\s*/?>", with: "\n", options: .regularExpression)
        text = text.replacingOccurrences(of: "</p>\\s*<p>", with: "\n", options: .regularExpression)
        text = text.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
        text = text.replacingOccurrences(of: "&amp;", with: "&")
        text = text.replacingOccurrences(of: "&lt;", with: "<")
        text = text.replacingOccurrences(of: "&gt;", with: ">")
        text = text.replacingOccurrences(of: "&quot;", with: "\"")
        text = text.replacingOccurrences(of: "&#39;", with: "'")
        text = text.replacingOccurrences(of: "&nbsp;", with: " ")
        return text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

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

// MARK: - Edit sheet (modal dialog, Linear-style)

struct TodoEditSheet: View {
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

    private let statuses = ["triage", "todo", "in_progress", "blocked", "done"]
    private let priorities = ["urgent", "high", "normal", "low"]

    private var todo: TodoItem? {
        convex.allTodos.first { $0._id == todoId }
            ?? convex.todayTodos.first { $0._id == todoId }
    }

    var body: some View {
        NavigationStack {
            Group {
                if todo != nil {
                    formContent
                } else {
                    ContentUnavailableView("Tâche introuvable", systemImage: "questionmark.circle")
                }
            }
            .background(Color(white: 0.12))
            .navigationTitle("Edit issue")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                            .foregroundStyle(.white.opacity(0.7))
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task {
                            await save()
                            dismiss()
                        }
                    } label: {
                        Image(systemName: "checkmark")
                            .foregroundStyle(hasChanges ? .white : .white.opacity(0.3))
                    }
                    .disabled(text.trimmingCharacters(in: .whitespaces).isEmpty || isSaving)
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.hidden)
        .onAppear { initializeFields() }
    }

    @ViewBuilder
    private var formContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                TextField("Titre", text: $text, axis: .vertical)
                    .font(.title2.bold())
                    .foregroundStyle(.white)
                    .lineLimit(1...4)

                TextField("Ajouter une description...", text: Binding(
                    get: { TodoDetailView.stripHTML(descriptionText) },
                    set: { descriptionText = $0 }
                ), axis: .vertical)
                    .font(.body)
                    .foregroundStyle(.white.opacity(0.7))
                    .lineLimit(3...20)

                Divider().background(Color.white.opacity(0.1))

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
                        MetadataPill(icon: nil, text: statusLabel(status), color: statusColor(status))
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
                        MetadataPill(icon: "exclamationmark.triangle.fill", text: priority.capitalized, color: priorityColor(priority))
                    }

                    Spacer()
                }

                HStack {
                    Toggle("Échéance", isOn: $hasDueDate)
                        .foregroundStyle(.white.opacity(0.7))
                        .font(.subheadline)
                }
                if hasDueDate {
                    DatePicker("", selection: $dueDate, displayedComponents: .date)
                        .datePickerStyle(.compact)
                        .labelsHidden()
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("Tags")
                        .font(.caption)
                        .foregroundStyle(.white.opacity(0.4))
                    TextField("Séparés par des virgules", text: $tagsText)
                        .textInputAutocapitalization(.never)
                        .font(.subheadline)
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

    // MARK: - State

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

    private var parsedTags: [String] {
        tagsText.split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
    }

    private var hasChanges: Bool {
        guard let todo else { return false }
        if text != todo.text { return true }
        let strippedOriginal = TodoDetailView.stripHTML(todo.description ?? "")
        let strippedCurrent = TodoDetailView.stripHTML(descriptionText)
        if strippedCurrent != strippedOriginal { return true }
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

    private func save() async {
        guard hasChanges else { return }
        isSaving = true
        defer { isSaving = false }

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dueDateString: String? = hasDueDate ? formatter.string(from: dueDate) : nil

        if let todo, status != todo.status {
            try? await convex.updateTodoStatus(id: todoId, status: status)
        }

        let cleanDescription = TodoDetailView.stripHTML(descriptionText)
        try? await convex.updateTodo(
            id: todoId,
            text: text.trimmingCharacters(in: .whitespaces),
            description: cleanDescription.isEmpty ? nil : cleanDescription,
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

// MARK: - Shared components

struct MetadataPill: View {
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

struct FlowLayout: Layout {
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
