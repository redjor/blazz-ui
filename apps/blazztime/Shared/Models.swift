import Foundation

// MARK: - Convex API

struct ConvexResponse<T: Decodable>: Decodable {
    let value: T
}

struct ConvexError: Decodable {
    let code: String?
    let message: String?
}

struct ConvexErrorResponse: Decodable {
    let code: String
    let message: String
}

// MARK: - Domain

struct Project: Decodable, Identifiable, Hashable {
    let _id: String
    let clientId: String
    let name: String
    let tjm: Double
    let hoursPerDay: Double
    let status: String
    let description: String?

    var id: String { _id }

    var hourlyRate: Double {
        guard hoursPerDay > 0 else { return 0 }
        return tjm / hoursPerDay
    }
}

struct Client: Decodable, Identifiable {
    let _id: String
    let name: String

    var id: String { _id }
}

struct TimeEntry: Decodable, Identifiable {
    let _id: String
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool

    var id: String { _id }

    var hours: Double {
        Double(minutes) / 60.0
    }

    var revenue: Double {
        hours * hourlyRate
    }

    var formattedDuration: String {
        let h = minutes / 60
        let m = minutes % 60
        if m == 0 { return "\(h)h" }
        return "\(h)h\(String(format: "%02d", m))"
    }
}

// MARK: - Offline Buffer

struct PendingEntry: Codable, Identifiable {
    let id: UUID
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool
    let createdAt: Date
}

// MARK: - Todos

struct TodoItem: Decodable, Identifiable, Hashable {
    let _id: String
    let text: String
    let description: String?
    let status: String
    let priority: String?
    let dueDate: String?
    let projectId: String?
    let categoryId: String?
    let tags: [String]?
    let createdAt: Double?

    var id: String { _id }
}

// MARK: - Convex Mutation Payloads

struct CreateTimeEntryArgs: Encodable {
    let projectId: String
    let date: String
    let minutes: Int
    let hourlyRate: Double
    let description: String?
    let billable: Bool
}

struct ConvexRequest: Encodable {
    let path: String
    let args: [String: AnyCodable]
}

/// Type-erased Encodable wrapper for Convex args
struct AnyCodable: Encodable {
    private let _encode: (Encoder) throws -> Void

    init<T: Encodable>(_ value: T) {
        _encode = { try value.encode(to: $0) }
    }

    func encode(to encoder: Encoder) throws {
        try _encode(encoder)
    }
}
