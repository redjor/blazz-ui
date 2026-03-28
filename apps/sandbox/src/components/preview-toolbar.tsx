"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Copy, Maximize2, Monitor, Moon, MousePointer2, Smartphone, Sun, Tablet } from "lucide-react"

export type Viewport = "desktop" | "tablet" | "mobile"
export type Theme = "light" | "dark"

interface PreviewToolbarProps {
	viewport: Viewport
	onViewportChange: (v: Viewport) => void
	theme: Theme
	onThemeChange: (t: Theme) => void
	onCopy: () => void
	onFullscreen: () => void
	inspectMode?: boolean
	onInspectModeChange?: (v: boolean) => void
}

const viewportOptions: { value: Viewport; icon: typeof Monitor; label: string }[] = [
	{ value: "desktop", icon: Monitor, label: "Desktop" },
	{ value: "tablet", icon: Tablet, label: "Tablet" },
	{ value: "mobile", icon: Smartphone, label: "Mobile" },
]

export function PreviewToolbar({ viewport, onViewportChange, theme, onThemeChange, onCopy, onFullscreen, inspectMode, onInspectModeChange }: PreviewToolbarProps) {
	return (
		<div className="flex items-center gap-1 px-2 py-1 border-b border-edge">
			{/* Viewport buttons */}
			{viewportOptions.map(({ value, icon: Icon, label }) => (
				<Button key={value} variant="ghost" size="icon-sm" onClick={() => onViewportChange(value)} className={viewport === value ? "bg-muted" : ""} aria-label={label}>
					<Icon className="size-3.5" />
				</Button>
			))}

			{/* Inspect mode toggle */}
			{onInspectModeChange && (
				<>
					<div className="w-px h-4 bg-edge mx-1" />
					<Button variant="ghost" size="icon-sm" onClick={() => onInspectModeChange(!inspectMode)} className={inspectMode ? "bg-brand/10 text-brand" : ""} aria-label="Inspect elements">
						<MousePointer2 className="size-3.5" />
					</Button>
				</>
			)}

			<div className="flex-1" />

			{/* Theme toggle */}
			<Button variant="ghost" size="icon-sm" onClick={() => onThemeChange(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
				{theme === "light" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
			</Button>

			{/* Copy code */}
			<Button variant="ghost" size="icon-sm" onClick={onCopy} aria-label="Copy code">
				<Copy className="size-3.5" />
			</Button>

			{/* Fullscreen */}
			<Button variant="ghost" size="icon-sm" onClick={onFullscreen} aria-label="Fullscreen">
				<Maximize2 className="size-3.5" />
			</Button>
		</div>
	)
}
