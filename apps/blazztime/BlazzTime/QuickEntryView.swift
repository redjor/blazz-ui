import SwiftUI
import ServiceManagement

struct QuickEntryView: View {
    @ObservedObject var client: ConvexClient
    @ObservedObject var authManager: AuthManager
    @ObservedObject var offlineBuffer: OfflineBuffer

    @State private var selectedProjectId: String = ""
    @State private var duration: Double = 1.0
    @State private var note: String = ""
    @State private var showSuccess = false
    @State private var isSubmitting = false

    private var selectedProject: Project? {
        client.projects.first { $0._id == selectedProjectId }
    }

    private var todayTotalMinutes: Int {
        client.todayEntries.reduce(0) { $0 + $1.minutes }
    }

    private var todayTotalRevenue: Double {
        client.todayEntries.reduce(0.0) { $0 + $1.revenue }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: "clock.fill")
                    .foregroundStyle(.secondary)
                Text("Blazz Time")
                    .font(.headline)
                Spacer()
                if offlineBuffer.hasPending {
                    Image(systemName: "circle.fill")
                        .foregroundStyle(.orange)
                        .font(.system(size: 8))
                        .help("\(offlineBuffer.pending.count) entrée(s) en attente")
                }
            }

            if !authManager.isAuthenticated {
                notAuthenticatedView
            } else if client.isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity)
            } else {
                formView
                Divider()
                todaySummaryView
                Divider()
                settingsView
            }
        }
        .padding(16)
        .frame(width: 300)
        .task {
            guard authManager.isAuthenticated else { return }
            client.isLoading = true
            async let p: () = client.fetchProjects()
            async let e: () = client.fetchTodayEntries()
            _ = await (p, e)
            client.isLoading = false
            await flushPendingEntries()
        }
    }

    // MARK: - Subviews

    private var notAuthenticatedView: some View {
        VStack(spacing: 12) {
            Image(systemName: "person.crop.circle.badge.questionmark")
                .font(.system(size: 32))
                .foregroundStyle(.secondary)
            Text("Connectez-vous pour commencer")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Button(action: {
                LoginWindow.open(authManager: authManager)
            }) {
                HStack(spacing: 6) {
                    Image(systemName: "globe")
                        .font(.caption)
                    Text("Se connecter avec Google")
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private var formView: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Project picker
            Picker("Projet", selection: $selectedProjectId) {
                Text("Choisir...").tag("")
                ForEach(client.projects) { project in
                    Text(project.name).tag(project._id)
                }
            }
            .pickerStyle(.menu)

            // Duration
            HStack {
                Text("Durée")
                Spacer()
                TextField("", value: $duration, format: .number)
                    .frame(width: 60)
                    .textFieldStyle(.roundedBorder)
                    .multilineTextAlignment(.trailing)
                Stepper("", value: $duration, in: 0.25...24, step: 0.25)
                    .labelsHidden()
                Text("h")
                    .foregroundStyle(.secondary)
            }

            // Note
            TextField("Note (optionnel)", text: $note)
                .textFieldStyle(.roundedBorder)
                .font(.callout)

            // Submit
            Button(action: submit) {
                HStack {
                    if isSubmitting {
                        ProgressView()
                            .controlSize(.small)
                    }
                    Text(showSuccess ? "✓ Enregistré" : "Enregistrer")
                }
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(showSuccess ? .green : .accentColor)
            .disabled(selectedProjectId.isEmpty || isSubmitting)
            .keyboardShortcut(.return, modifiers: .command)

            // Error
            if let error = client.error {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
            }
        }
    }

    private var todaySummaryView: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Aujourd'hui")
                    .font(.subheadline.weight(.medium))
                Spacer()
                Text(formatMinutes(todayTotalMinutes))
                    .font(.subheadline.weight(.semibold))
                Text("·")
                    .foregroundStyle(.secondary)
                Text(formatCurrency(todayTotalRevenue))
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.green)
            }

            ForEach(client.todayEntries) { entry in
                HStack {
                    Text(entry.formattedDuration)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .frame(width: 40, alignment: .leading)
                    Text(projectName(for: entry.projectId))
                        .font(.caption)
                        .lineLimit(1)
                    Spacer()
                    Image(systemName: "checkmark.circle.fill")
                        .font(.caption2)
                        .foregroundStyle(.green)
                }
            }
        }
    }

    private var settingsView: some View {
        HStack {
            Toggle("Lancer au démarrage", isOn: Binding(
                get: { SMAppService.mainApp.status == .enabled },
                set: { newValue in
                    do {
                        if newValue {
                            try SMAppService.mainApp.register()
                        } else {
                            try SMAppService.mainApp.unregister()
                        }
                    } catch {
                        print("Launch at login error: \(error)")
                    }
                }
            ))
            .font(.caption)
            .toggleStyle(.switch)
            .controlSize(.mini)

            Spacer()

            Button(action: { authManager.deleteToken() }) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.caption)
            }
            .buttonStyle(.plain)
            .help("Déconnecter")
        }
    }

    // MARK: - Actions

    private func submit() {
        guard let project = selectedProject else { return }
        let minutes = Int(duration * 60)
        let desc = note.isEmpty ? nil : note

        isSubmitting = true
        client.error = nil

        Task {
            do {
                try await client.createEntry(
                    projectId: project._id,
                    minutes: minutes,
                    hourlyRate: project.hourlyRate,
                    description: desc
                )
                showSuccess = true
                NSSound(named: "Tink")?.play()
                note = ""
                // Reset success after 2s
                try? await Task.sleep(for: .seconds(2))
                showSuccess = false
            } catch {
                // Offline: buffer the entry
                let pending = PendingEntry(
                    id: UUID(),
                    projectId: project._id,
                    date: ConvexClient.todayString(),
                    minutes: minutes,
                    hourlyRate: project.hourlyRate,
                    description: desc,
                    billable: true,
                    createdAt: Date()
                )
                offlineBuffer.add(pending)
                client.error = "Sauvé hors-ligne (sync auto)"
            }
            isSubmitting = false
        }
    }

    private func flushPendingEntries() async {
        for entry in offlineBuffer.pending {
            do {
                try await client.createEntry(
                    projectId: entry.projectId,
                    minutes: entry.minutes,
                    hourlyRate: entry.hourlyRate,
                    description: entry.description
                )
                offlineBuffer.remove(entry.id)
            } catch {
                break // Stop flushing on first error
            }
        }
    }

    // MARK: - Formatting

    private func formatMinutes(_ total: Int) -> String {
        let h = total / 60
        let m = total % 60
        if m == 0 { return "\(h)h" }
        return "\(h)h\(String(format: "%02d", m))"
    }

    private func formatCurrency(_ amount: Double) -> String {
        "\(Int(amount))€"
    }

    private func projectName(for projectId: String) -> String {
        client.projects.first { $0._id == projectId }?.name ?? "?"
    }
}
