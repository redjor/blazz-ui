"use client"

import { Paintbrush, Check } from "lucide-react"
import { useThemePalette, type ThemePalette } from "../../lib/theme-context"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../ui/dropdown-menu"

const palettes: { id: ThemePalette; label: string; color: string }[] = [
	{ id: "slate", label: "Slate", color: "oklch(0.585 0.22 275)" },
	{ id: "corporate", label: "Corporate", color: "oklch(0.40 0.18 250)" },
	{ id: "warm", label: "Warm", color: "oklch(0.55 0.17 70)" },
]

export function ThemePaletteSwitcher() {
	const { palette, setPalette } = useThemePalette()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="rounded-lg p-2 transition-colors hover:bg-gray-800"
						aria-label="Changer la palette"
					>
						<Paintbrush className="h-4 w-4 text-gray-300" />
					</button>
				}
			/>
			<DropdownMenuContent align="end" sideOffset={8}>
				{palettes.map((p) => (
					<DropdownMenuItem key={p.id} onClick={() => setPalette(p.id)}>
						<span
							className="h-3 w-3 rounded-full shrink-0"
							style={{ backgroundColor: p.color }}
						/>
						<span className="flex-1">{p.label}</span>
						{palette === p.id && <Check className="h-3.5 w-3.5 text-fg-muted" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
