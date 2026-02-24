"use client"

import { useState } from "react"
import { Check, ChevronDown, Copy, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	TOKEN_GROUPS,
	PRESETS,
	DENSITY_TOKENS,
	generateExportCss,
	type TokenKey,
	type TokenValues,
	type PresetName,
	type OklchColor,
	type DensityValues,
} from "@/components/features/docs/theme-editor/theme-presets"
import { TokenColorInput } from "./token-color-input"

// ---------------------------------------------------------------------------
// PlaygroundSidebar — Left panel of the playground page.
// Contains preset picker, light/dark toggle, collapsible token groups,
// density sliders, and an export CSS button.
// ---------------------------------------------------------------------------

interface PlaygroundSidebarProps {
	presetName: PresetName
	mode: "light" | "dark"
	tokens: TokenValues
	densityValues: DensityValues
	lightTokens: TokenValues
	darkTokens: TokenValues
	onPresetChange: (name: PresetName) => void
	onModeChange: (mode: "light" | "dark") => void
	onTokenChange: (key: TokenKey, color: OklchColor) => void
	onDensityChange: (key: string, value: number) => void
}

export function PlaygroundSidebar({
	presetName,
	mode,
	tokens,
	densityValues,
	lightTokens,
	darkTokens,
	onPresetChange,
	onModeChange,
	onTokenChange,
	onDensityChange,
}: PlaygroundSidebarProps) {
	// Collapsed state for each group — all expanded by default
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

	// Export button copy feedback
	const [copied, setCopied] = useState(false)

	function toggleGroup(key: string) {
		setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
	}

	async function handleExport() {
		const css = generateExportCss(lightTokens, darkTokens, densityValues)
		await navigator.clipboard.writeText(css)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<aside className="flex w-[280px] shrink-0 flex-col border-r border-container bg-surface">
			{/* ----------------------------------------------------------------- */}
			{/* Header — Preset picker + Light/Dark toggle                        */}
			{/* ----------------------------------------------------------------- */}
			<div className="space-y-2 border-b border-separator p-3">
				{/* Preset picker */}
				<div className="flex items-center gap-0.5 rounded-lg border border-edge-subtle bg-raised p-0.5">
					{PRESETS.map((preset) => (
						<button
							key={preset.name}
							type="button"
							onClick={() => onPresetChange(preset.name)}
							className={cn(
								"flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
								presetName === preset.name
									? "bg-surface text-fg shadow-sm"
									: "text-fg-muted hover:text-fg",
							)}
						>
							{preset.label}
						</button>
					))}
				</div>

				{/* Light / Dark toggle */}
				<div className="flex items-center gap-0.5 rounded-lg border border-edge-subtle bg-raised p-0.5">
					<button
						type="button"
						onClick={() => onModeChange("light")}
						className={cn(
							"flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
							mode === "light"
								? "bg-surface text-fg shadow-sm"
								: "text-fg-muted hover:text-fg",
						)}
					>
						<Sun className="size-3" />
						Light
					</button>
					<button
						type="button"
						onClick={() => onModeChange("dark")}
						className={cn(
							"flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
							mode === "dark"
								? "bg-surface text-fg shadow-sm"
								: "text-fg-muted hover:text-fg",
						)}
					>
						<Moon className="size-3" />
						Dark
					</button>
				</div>
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Scrollable token area                                             */}
			{/* ----------------------------------------------------------------- */}
			<div className="flex-1 space-y-1 overflow-y-auto p-3">
				{/* Color token groups */}
				{TOKEN_GROUPS.map((group) => {
					const isCollapsed = collapsed[group.title] ?? false
					return (
						<div key={group.title}>
							<button
								type="button"
								onClick={() => toggleGroup(group.title)}
								className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted"
							>
								<ChevronDown
									className={cn(
										"size-3 transition-transform",
										isCollapsed && "-rotate-90",
									)}
								/>
								{group.title}
							</button>
							{!isCollapsed && (
								<div className="space-y-1.5 pb-3 pl-1">
									{group.tokens.map((tokenKey) => (
										<TokenColorInput
											key={tokenKey}
											label={tokenKey}
											color={tokens[tokenKey]}
											onChange={(color) => onTokenChange(tokenKey, color)}
										/>
									))}
								</div>
							)}
						</div>
					)
				})}

				{/* Density & Spacing group */}
				<div>
					<button
						type="button"
						onClick={() => toggleGroup("density")}
						className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-muted"
					>
						<ChevronDown
							className={cn(
								"size-3 transition-transform",
								(collapsed.density ?? false) && "-rotate-90",
							)}
						/>
						Density & Spacing
					</button>
					{!(collapsed.density ?? false) && (
						<div className="space-y-3 pb-3 pl-1">
							{DENSITY_TOKENS.map((token) => (
								<div key={token.key}>
									<div className="mb-1 flex items-center justify-between">
										<span className="text-xs text-fg-muted">
											{token.label}
										</span>
										<span className="text-2xs font-mono text-fg-subtle tabular-nums">
											{densityValues[token.key]}
											{token.unit}
										</span>
									</div>
									<input
										type="range"
										min={token.min}
										max={token.max}
										step={token.step}
										value={densityValues[token.key]}
										onChange={(e) =>
											onDensityChange(token.key, Number(e.target.value))
										}
										className="w-full cursor-pointer"
									/>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ----------------------------------------------------------------- */}
			{/* Footer — Export CSS button                                        */}
			{/* ----------------------------------------------------------------- */}
			<div className="border-t border-separator p-3">
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={handleExport}
				>
					{copied ? (
						<>
							<Check className="size-3" />
							Copied!
						</>
					) : (
						<>
							<Copy className="size-3" />
							Export CSS
						</>
					)}
				</Button>
			</div>
		</aside>
	)
}
