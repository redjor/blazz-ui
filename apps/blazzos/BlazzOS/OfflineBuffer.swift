import Foundation

final class OfflineBuffer: ObservableObject {
    @Published private(set) var pending: [PendingEntry] = []

    private let fileURL: URL

    init(directory: URL? = nil) {
        let dir = directory ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
            .appendingPathComponent("BlazzOS")
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        fileURL = dir.appendingPathComponent("pending.json")
        load()
    }

    var hasPending: Bool { !pending.isEmpty }

    func add(_ entry: PendingEntry) {
        pending.append(entry)
        save()
    }

    func remove(_ id: UUID) {
        pending.removeAll { $0.id == id }
        save()
    }

    // MARK: - Persistence

    private func load() {
        guard let data = try? Data(contentsOf: fileURL) else { return }
        pending = (try? JSONDecoder().decode([PendingEntry].self, from: data)) ?? []
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(pending) else { return }
        try? data.write(to: fileURL, options: .atomic)
    }
}
