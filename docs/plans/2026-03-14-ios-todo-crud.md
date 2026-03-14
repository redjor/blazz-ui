# iOS Todo CRUD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add full CRUD (create, read, update, delete) for todos in the BlazzOSIOS app, using existing Convex backend mutations.

**Architecture:** Style Linear — TodoDetailView becomes editable with tap-to-edit fields. New TodoCreateSheet for creation. Swipe actions on rows for quick status change and delete. ConvexService gets 4 new mutation methods.

**Tech Stack:** SwiftUI, ConvexMobile SDK, @Observable pattern

---

### Task 1: Add todo mutation methods to ConvexService

**Files:**
- Modify: `apps/blazzos/Shared/ConvexService.swift:132-163`

**Step 1: Add createTodo method**

Add after the `createTimeEntry` method (line 153):

```swift
// MARK: - Todo Mutations

func createTodo(
    text: String,
    description: String? = nil,
    status: String = "triage",
    priority: String? = nil,
    dueDate: String? = nil,
    tags: [String]? = nil
) async throws {
    guard let client else { throw ConvexServiceError.notConfigured }
    var args: [String: ConvexEncodable?] = [
        "text": text,
        "status": status,
    ]
    if let description, !description.isEmpty { args["description"] = description }
    if let priority { args["priority"] = priority }
    if let dueDate { args["dueDate"] = dueDate }
    if let tags, !tags.isEmpty { args["tags"] = tags }
    try await client.mutation("todos:create", with: args)
}

func updateTodo(
    id: String,
    text: String? = nil,
    description: String? = nil,
    priority: String? = nil,
    dueDate: String? = nil,
    tags: [String]? = nil
) async throws {
    guard let client else { throw ConvexServiceError.notConfigured }
    var args: [String: ConvexEncodable?] = [
        "id": id,
    ]
    if let text { args["text"] = text }
    if let description { args["description"] = description }
    if let priority { args["priority"] = priority }
    if let dueDate { args["dueDate"] = dueDate }
    if let tags { args["tags"] = tags }
    try await client.mutation("todos:update", with: args)
}

func updateTodoStatus(id: String, status: String) async throws {
    guard let client else { throw ConvexServiceError.notConfigured }
    try await client.mutation("todos:updateStatus", with: [
        "id": id,
        "status": status,
    ])
}

func deleteTodo(id: String) async throws {
    guard let client else { throw ConvexServiceError.notConfigured }
    try await client.mutation("todos:remove", with: [
        "id": id,
    ])
}
```

**Step 2: Build to verify compilation**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5`
Expected: BUILD SUCCEEDED

**Step 3: Commit**

```bash
git add apps/blazzos/Shared/ConvexService.swift
git commit -m "feat(ios): add todo CRUD mutations to ConvexService"
```

---

### Task 2: Add swipe actions to TodoRowView and list views

**Files:**
- Modify: `apps/blazzos/BlazzOSIOS/TodayView.swift`
- Modify: `apps/blazzos/BlazzOSIOS/AllTodosView.swift`

Swipe actions must be applied at the list/ForEach level (on the NavigationLink), not inside TodoRowView itself, because `.swipeActions` requires a List context or works best on the item level in ForEach.

**Step 1: Add swipe actions to TodayView**

In `TodayView.swift`, replace the ForEach inside `todoList` (lines 36-41):

```swift
ForEach(todos) { todo in
    NavigationLink(value: todo) {
        TodoRowView(todo: todo)
    }
    .buttonStyle(.plain)
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
```

Add these helper methods to TodayView:

```swift
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
```

**Step 2: Add same swipe actions to AllTodosView**

In `AllTodosView.swift`, replace the ForEach (lines 31-37):

```swift
ForEach(todos) { todo in
    NavigationLink(value: todo) {
        TodoRowView(todo: todo)
    }
    .buttonStyle(.plain)
    .padding(.horizontal)
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
```

Add the same 4 helper methods (`nextStatus`, `nextStatusLabel`, `nextStatusIcon`, `nextStatusColor`) to AllTodosView.

> **Note:** The helpers are duplicated in both views. This is intentional — extracting them into a shared helper adds indirection for 4 tiny functions. YAGNI.

**Step 3: Build to verify**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5`
Expected: BUILD SUCCEEDED

**Step 4: Commit**

```bash
git add apps/blazzos/BlazzOSIOS/TodayView.swift apps/blazzos/BlazzOSIOS/AllTodosView.swift
git commit -m "feat(ios): add swipe actions for status change and delete on todo rows"
```

---

### Task 3: Create TodoCreateSheet

**Files:**
- Create: `apps/blazzos/BlazzOSIOS/TodoCreateSheet.swift`

**Step 1: Create the sheet file**

```swift
import SwiftUI

struct TodoCreateSheet: View {
    let convex: ConvexService
    @Environment(\.dismiss) private var dismiss

    @State private var text = ""
    @State private var description = ""
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
                    TextField("Description (optionnel)", text: $description, axis: .vertical)
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
                description: description.isEmpty ? nil : description,
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
```

**Step 2: Build to verify**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5`
Expected: BUILD SUCCEEDED

**Step 3: Commit**

```bash
git add apps/blazzos/BlazzOSIOS/TodoCreateSheet.swift
git commit -m "feat(ios): add TodoCreateSheet for creating new todos"
```

---

### Task 4: Add "+" button to TodayView and AllTodosView

**Files:**
- Modify: `apps/blazzos/BlazzOSIOS/TodayView.swift`
- Modify: `apps/blazzos/BlazzOSIOS/AllTodosView.swift`

**Step 1: Add sheet state and toolbar button to TodayView**

Add a `@State` property at the top of `TodayView`:

```swift
@State private var showCreateSheet = false
```

Add `.toolbar` and `.sheet` modifiers after `.toolbarColorScheme(.dark, for: .navigationBar)` (line 27):

```swift
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
```

**Step 2: Add same to AllTodosView**

Add a `@State` property:

```swift
@State private var showCreateSheet = false
```

Add `.toolbar` and `.sheet` modifiers after `.toolbarColorScheme(.dark, for: .navigationBar)` (line 47):

```swift
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
```

**Step 3: Build to verify**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5`
Expected: BUILD SUCCEEDED

**Step 4: Commit**

```bash
git add apps/blazzos/BlazzOSIOS/TodayView.swift apps/blazzos/BlazzOSIOS/AllTodosView.swift
git commit -m "feat(ios): add create todo button (+) to TodayView and AllTodosView"
```

---

### Task 5: Make TodoDetailView editable

**Files:**
- Modify: `apps/blazzos/BlazzOSIOS/TodoDetailView.swift`

This is the biggest change. The view switches from displaying a `let todo: TodoItem` to loading the todo via its ID and allowing inline editing.

**Step 1: Rewrite TodoDetailView**

Replace the entire content of `TodoDetailView.swift` (keep MetadataPill and FlowLayout at the bottom):

```swift
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
                    TextField("Ajouter une description...", text: $descriptionText, axis: .vertical)
                        .lineLimit(3...10)
                        .foregroundStyle(.white.opacity(0.7))
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
```

Keep the existing `MetadataPill` and `FlowLayout` structs at the bottom of the file — they are unchanged.

**Step 2: Update navigation destinations to pass todoId + convex**

Since `TodoDetailView` now takes `todoId` and `convex` instead of `todo`, update the `.navigationDestination` in both views.

In `TodayView.swift`, change line 54-56:

```swift
.navigationDestination(for: TodoItem.self) { todo in
    TodoDetailView(todoId: todo._id, convex: convex)
}
```

In `AllTodosView.swift`, change line 41-43:

```swift
.navigationDestination(for: TodoItem.self) { todo in
    TodoDetailView(todoId: todo._id, convex: convex)
}
```

**Step 3: Build to verify**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -5`
Expected: BUILD SUCCEEDED

**Step 4: Commit**

```bash
git add apps/blazzos/BlazzOSIOS/TodoDetailView.swift apps/blazzos/BlazzOSIOS/TodayView.swift apps/blazzos/BlazzOSIOS/AllTodosView.swift
git commit -m "feat(ios): make TodoDetailView editable with inline editing and delete"
```

---

### Task 6: Final integration test

**Step 1: Run full build**

Run: `cd apps/blazzos && xcodebuild -scheme BlazzOSIOS -destination 'platform=iOS Simulator,name=iPhone 16' build 2>&1 | tail -10`
Expected: BUILD SUCCEEDED

**Step 2: Manual verification checklist**

- [ ] App launches without crash
- [ ] TodayView shows "+" button in toolbar
- [ ] AllTodosView shows "+" button in toolbar
- [ ] Tapping "+" opens TodoCreateSheet
- [ ] Creating a todo with title works (appears in list via subscription)
- [ ] Tapping a todo opens editable detail view
- [ ] Editing title and pressing "Enregistrer" saves
- [ ] Changing status via pill menu works
- [ ] Changing priority via pill menu works
- [ ] Toggling due date on/off works
- [ ] Swipe left on row shows delete action
- [ ] Swipe right on row shows status advance action
- [ ] Delete from detail view (trash icon) shows confirmation then deletes

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(ios): address integration issues from todo CRUD testing"
```
