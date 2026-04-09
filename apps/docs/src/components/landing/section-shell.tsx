import type { ReactNode } from "react"

interface SectionShellProps {
	id?: string
	eyebrow?: string
	title?: ReactNode
	description?: ReactNode
	children: ReactNode
	align?: "left" | "center"
	size?: "default" | "tight"
	className?: string
	headerSlot?: ReactNode
}

/**
 * Shared shell for landing sections — unifies vertical rhythm,
 * max-width, and header typography (eyebrow + H2 + description).
 */
export function SectionShell({ id, eyebrow, title, description, children, align = "left", size = "default", className, headerSlot }: SectionShellProps) {
	const verticalPadding = size === "tight" ? "py-16" : "py-24 md:py-28"
	const alignment = align === "center" ? "text-center mx-auto" : ""

	return (
		<section id={id} className={`${verticalPadding} px-6 ${className ?? ""}`}>
			<div className="mx-auto max-w-6xl">
				{(eyebrow || title || description || headerSlot) && (
					<div className={`mb-14 max-w-2xl ${alignment}`}>
						{eyebrow && <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-brand">{eyebrow}</p>}
						{title && <h2 className="text-balance text-3xl font-semibold tracking-tight text-fg md:text-4xl lg:text-5xl leading-[1.05]">{title}</h2>}
						{description && <p className="mt-5 text-base leading-relaxed text-fg-muted md:text-[17px]">{description}</p>}
						{headerSlot}
					</div>
				)}
				{children}
			</div>
		</section>
	)
}
