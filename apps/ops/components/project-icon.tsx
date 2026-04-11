import { getIcon, getIconColorClasses, ICON_SET } from "@/lib/icon-palette"

interface ProjectIconProps {
	icon?: string
	color?: string
	/** xs = 20px (select), sm = 24px (list), md = 40px (header) */
	size?: "xs" | "sm" | "md"
	className?: string
}

const SIZE_CLASSES: Record<NonNullable<ProjectIconProps["size"]>, { tile: string; icon: string }> = {
	xs: { tile: "size-5", icon: "size-3" },
	sm: { tile: "size-6", icon: "size-3.5" },
	md: { tile: "size-10", icon: "size-5" },
}

export function ProjectIcon({ icon, color, size = "sm", className }: ProjectIconProps) {
	const Icon = getIcon(icon) ?? ICON_SET[0].icon
	const classes = getIconColorClasses(color)
	const s = SIZE_CLASSES[size]
	return (
		<span className={`inline-flex shrink-0 items-center justify-center rounded-md ${s.tile} ${classes.bg} ${className ?? ""}`}>
			<Icon className={`${s.icon} ${classes.text}`} />
		</span>
	)
}
