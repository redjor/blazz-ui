export function LicenseBanner() {
	return (
		<div
			style={{
				position: "absolute",
				bottom: 4,
				right: 4,
				padding: "2px 8px",
				fontSize: 10,
				lineHeight: "16px",
				fontFamily: "system-ui, sans-serif",
				color: "rgba(255,255,255,0.8)",
				backgroundColor: "rgba(0,0,0,0.6)",
				borderRadius: 4,
				pointerEvents: "none",
				zIndex: 9999,
				userSelect: "none",
			}}
		>
			Unlicensed — blazz.dev
		</div>
	)
}
