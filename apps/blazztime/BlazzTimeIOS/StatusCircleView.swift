import SwiftUI

struct StatusCircleView: View {
    let status: String
    private let size: CGFloat = 18

    var body: some View {
        ZStack {
            switch status {
            case "triage":
                Circle()
                    .strokeBorder(style: StrokeStyle(lineWidth: 1.5, dash: [3, 2]))
                    .foregroundStyle(Color.gray)
            case "todo":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.white.opacity(0.6))
            case "in_progress":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.yellow)
                Circle()
                    .trim(from: 0, to: 0.5)
                    .fill(Color.yellow)
                    .rotationEffect(.degrees(-90))
                    .padding(3)
            case "blocked":
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.red)
                Image(systemName: "xmark")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundStyle(Color.red)
            case "done":
                Circle()
                    .fill(Color.green)
                Image(systemName: "checkmark")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Color.black)
            default:
                Circle()
                    .strokeBorder(lineWidth: 1.5)
                    .foregroundStyle(Color.gray)
            }
        }
        .frame(width: size, height: size)
    }
}
