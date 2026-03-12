import SwiftUI

struct TodoRowView: View {
    let todo: TodoItem

    var body: some View {
        HStack(spacing: 10) {
            priorityIcon
                .frame(width: 16)

            StatusCircleView(status: todo.status)

            Text(todo.text)
                .font(.body)
                .foregroundStyle(.white)
                .lineLimit(1)

            Spacer()
        }
        .padding(.vertical, 10)
        .contentShape(Rectangle())
    }

    @ViewBuilder
    private var priorityIcon: some View {
        switch todo.priority {
        case "urgent":
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 12))
                .foregroundStyle(.red)
        case "high":
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 12))
                .foregroundStyle(.orange)
        case "normal":
            Image(systemName: "minus")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.blue)
        case "low":
            Image(systemName: "arrow.down")
                .font(.system(size: 12))
                .foregroundStyle(.gray)
        default:
            Image(systemName: "minus")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.blue)
        }
    }
}
