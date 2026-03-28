import { cn } from "../../lib/utils"

export interface DividerProps {
	borderColor?: "default" | "secondary" | "inverse" | "transparent"
	borderWidth?: "025" | "050" | "100"
	className?: string
}

const borderColorMap = {
	default: "border-separator",
	secondary: "border-separator/50",
	inverse: "border-fg/20",
	transparent: "border-transparent",
}

const borderWidthMap = {
	"025": "border-t",
	"050": "border-t-2",
	"100": "border-t-4",
}

export function Divider({ borderColor = "secondary", borderWidth = "025", className }: DividerProps) {
	return <hr data-slot="divider" className={cn("w-full border-0", borderColorMap[borderColor], borderWidthMap[borderWidth], className)} />
}
