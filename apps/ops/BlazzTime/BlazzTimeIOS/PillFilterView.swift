import SwiftUI

struct PillFilterView: View {
    let options: [(label: String, value: String?)]
    @Binding var selected: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(options, id: \.label) { option in
                    Button {
                        selected = option.value
                    } label: {
                        Text(option.label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(selected == option.value ? Color.white : Color.clear)
                            .foregroundStyle(selected == option.value ? .black : .white.opacity(0.5))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal)
        }
    }
}
