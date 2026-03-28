import type * as React from "react"
import { cn } from "../../lib/utils"

type SpaceScale = "0" | "050" | "100" | "150" | "200" | "300" | "400" | "500" | "600" | "800" | "1000" | "1200" | "1600"

const marginMap: Record<SpaceScale, string> = {
	"0": "0",
	"050": "-0.5",
	"100": "-1",
	"150": "-1.5",
	"200": "-2",
	"300": "-3",
	"400": "-4",
	"500": "-5",
	"600": "-6",
	"800": "-8",
	"1000": "-10",
	"1200": "-12",
	"1600": "-16",
}

export interface BleedProps {
	children?: React.ReactNode
	className?: string
	marginInline?: SpaceScale
	marginBlock?: SpaceScale
	marginBlockStart?: SpaceScale
	marginBlockEnd?: SpaceScale
	marginInlineStart?: SpaceScale
	marginInlineEnd?: SpaceScale
}

export function Bleed({ children, className, marginInline, marginBlock, marginBlockStart, marginBlockEnd, marginInlineStart, marginInlineEnd }: BleedProps) {
	const style: React.CSSProperties = {}

	if (marginInline) {
		style.marginInline = `calc(${marginMap[marginInline]} * 0.25rem)`
	}
	if (marginBlock) {
		style.marginBlock = `calc(${marginMap[marginBlock]} * 0.25rem)`
	}
	if (marginBlockStart) {
		style.marginBlockStart = `calc(${marginMap[marginBlockStart]} * 0.25rem)`
	}
	if (marginBlockEnd) {
		style.marginBlockEnd = `calc(${marginMap[marginBlockEnd]} * 0.25rem)`
	}
	if (marginInlineStart) {
		style.marginInlineStart = `calc(${marginMap[marginInlineStart]} * 0.25rem)`
	}
	if (marginInlineEnd) {
		style.marginInlineEnd = `calc(${marginMap[marginInlineEnd]} * 0.25rem)`
	}

	return (
		<div data-slot="bleed" className={cn(className)} style={style}>
			{children}
		</div>
	)
}
