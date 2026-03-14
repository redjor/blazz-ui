import SwiftUI

struct TodoCreateSheet: View {
    let convex: ConvexService
    @Environment(\.dismiss) private var dismiss

    @State private var text = ""
    @State private var descriptionText = ""
    @State private var status = "triage"
    @State private var priority = "normal"
    @State private var hasDueDate = false
    @State private var dueDate = Date()
    @State private var tagsText = ""
    @State private var isSaving = false

    private let statuses = ["triage", "todo", "in_progress", "blocked"]
    private let priorities = ["urgent", "high", "normal", "low"]

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Titre", text: $text)
                    TextField("Description (optionnel)", text: $descriptionText, axis: .vertical)
                        .lineLimit(3...6)
                }

                Section {
                    Picker("Status", selection: $status) {
                        ForEach(statuses, id: \.self) { s in
                            Text(statusLabel(s)).tag(s)
                        }
                    }
                    Picker("Priorité", selection: $priority) {
                        ForEach(priorities, id: \.self) { p in
                            Text(p.capitalized).tag(p)
                        }
                    }
                }

                Section {
                    Toggle("Date d'échéance", isOn: $hasDueDate)
                    if hasDueDate {
                        DatePicker("Date", selection: $dueDate, displayedComponents: .date)
                    }
                }

                Section {
                    TextField("Tags (séparés par des virgules)", text: $tagsText)
                        .textInputAutocapitalization(.never)
                }
            }
            .navigationTitle("Nouvelle tâche")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuler") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Créer") {
                        Task { await createTodo() }
                    }
                    .disabled(text.trimmingCharacters(in: .whitespaces).isEmpty || isSaving)
                }
            }
        }
    }

    private func createTodo() async {
        isSaving = true
        defer { isSaving = false }

        let tags = tagsText
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        let dueDateString: String? = hasDueDate ? formatDate(dueDate) : nil

        do {
            try await convex.createTodo(
                text: text.trimmingCharacters(in: .whitespaces),
                description: descriptionText.isEmpty ? nil : descriptionText,
                status: status,
                priority: priority,
                dueDate: dueDateString,
                tags: tags.isEmpty ? nil : tags
            )
            dismiss()
        } catch {
            // Convex subscription will reflect any server-side errors
        }
    }

    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    private func statusLabel(_ status: String) -> String {
        switch status {
        case "triage": return "Triage"
        case "todo": return "Todo"
        case "in_progress": return "In Progress"
        case "blocked": return "Blocked"
        default: return status
        }
    }
}
