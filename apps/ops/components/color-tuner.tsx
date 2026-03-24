"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@blazz/ui/components/ui/button"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Palette, Copy, RotateCcw, X } from "lucide-react"

// ---------------------------------------------------------------------------
// oklch type + format
// ---------------------------------------------------------------------------

interface Oklch {
	l: number // 0–1
	c: number // 0–0.4
	h: number // 0–360
}

function fmt(v: Oklch): string {
	return `oklch(${v.l.toFixed(3)} ${v.c.toFixed(3)} ${v.h.toFixed(0)})`
}

// ---------------------------------------------------------------------------
// Token definitions with hardcoded defaults from globals.css
// ---------------------------------------------------------------------------

interface TokenDef {
	variable: string
	label: string
	light: Oklch
	dark: Oklch
}

interface TokenGroup {
	name: string
	tokens: TokenDef[]
}

const TOKEN_GROUPS: TokenGroup[] = [
	{
		name: "Surfaces",
		tokens: [
			{ variable: "--surface-base", label: "surface-0 (base)", light: { l: 0.95, c: 0, h: 0 }, dark: { l: 0.145, c: 0.005, h: 270 } },
			{ variable: "--surface-top", label: "surface-4 (top)", light: { l: 1, c: 0, h: 0 }, dark: { l: 0.28, c: 0.005, h: 270 } },
		],
	},
	{
		name: "Text",
		tokens: [
			{ variable: "--text-primary", label: "text-primary", light: { l: 0.14, c: 0, h: 0 }, dark: { l: 0.985, c: 0, h: 0 } },
			{ variable: "--text-secondary", label: "text-secondary", light: { l: 0.45, c: 0, h: 0 }, dark: { l: 0.65, c: 0.01, h: 270 } },
			{ variable: "--text-muted", label: "text-muted", light: { l: 0.55, c: 0, h: 0 }, dark: { l: 0.58, c: 0.01, h: 270 } },
		],
	},
	{
		name: "Borders",
		tokens: [
			{ variable: "--border-default", label: "border-default", light: { l: 0.92, c: 0, h: 0 }, dark: { l: 0.35, c: 0.005, h: 270 } },
			{ variable: "--border-subtle", label: "border-subtle", light: { l: 0.95, c: 0, h: 0 }, dark: { l: 0.35, c: 0.005, h: 270 } },
		],
	},
	{
		name: "Accent",
		tokens: [
			{ variable: "--accent", label: "accent", light: { l: 0.49, c: 0.19, h: 270 }, dark: { l: 0.64, c: 0.19, h: 270 } },
			{ variable: "--accent-hover", label: "accent-hover", light: { l: 0.42, c: 0.19, h: 270 }, dark: { l: 0.57, c: 0.19, h: 270 } },
			{ variable: "--accent-foreground", label: "accent-fg", light: { l: 0.985, c: 0, h: 0 }, dark: { l: 0.985, c: 0, h: 0 } },
		],
	},
	{
		name: "Semantic",
		tokens: [
			{ variable: "--success", label: "success", light: { l: 0.47, c: 0.15, h: 162 }, dark: { l: 0.64, c: 0.15, h: 162 } },
			{ variable: "--warning", label: "warning", light: { l: 0.54, c: 0.14, h: 78 }, dark: { l: 0.72, c: 0.14, h: 78 } },
			{ variable: "--destructive", label: "destructive", light: { l: 0.49, c: 0.17, h: 15 }, dark: { l: 0.64, c: 0.17, h: 15 } },
			{ variable: "--info", label: "info", light: { l: 0.49, c: 0.14, h: 238 }, dark: { l: 0.64, c: 0.14, h: 238 } },
		],
	},
	{
		name: "Chart",
		tokens: [
			{ variable: "--chart-1", label: "chart-1", light: { l: 0.52, c: 0.12, h: 270 }, dark: { l: 0.66, c: 0.12, h: 270 } },
			{ variable: "--chart-2", label: "chart-2", light: { l: 0.50, c: 0.11, h: 162 }, dark: { l: 0.64, c: 0.11, h: 162 } },
			{ variable: "--chart-3", label: "chart-3", light: { l: 0.56, c: 0.10, h: 78 }, dark: { l: 0.70, c: 0.10, h: 78 } },
			{ variable: "--chart-4", label: "chart-4", light: { l: 0.50, c: 0.12, h: 330 }, dark: { l: 0.64, c: 0.12, h: 330 } },
			{ variable: "--chart-5", label: "chart-5", light: { l: 0.50, c: 0.10, h: 15 }, dark: { l: 0.64, c: 0.10, h: 15 } },
		],
	},
	{
		name: "Sidebar",
		tokens: [
			{ variable: "--sidebar-foreground", label: "sidebar-fg", light: { l: 0.4, c: 0, h: 0 }, dark: { l: 0.85, c: 0, h: 0 } },
			{ variable: "--sidebar-primary", label: "sidebar-primary", light: { l: 0.3, c: 0, h: 0 }, dark: { l: 0.85, c: 0, h: 0 } },
			{ variable: "--sidebar-primary-foreground", label: "sidebar-primary-fg", light: { l: 0.99, c: 0, h: 0 }, dark: { l: 0.175, c: 0, h: 0 } },
			{ variable: "--sidebar-accent", label: "sidebar-accent", light: { l: 1, c: 0, h: 0 }, dark: { l: 0.22, c: 0.002, h: 264 } },
			{ variable: "--sidebar-accent-foreground", label: "sidebar-accent-fg", light: { l: 0.18, c: 0, h: 0 }, dark: { l: 0.95, c: 0, h: 0 } },
			{ variable: "--sidebar-border", label: "sidebar-border", light: { l: 0.82, c: 0, h: 0 }, dark: { l: 0.25, c: 0.002, h: 264 } },
			{ variable: "--sidebar-ring", label: "sidebar-ring", light: { l: 0.3, c: 0, h: 0 }, dark: { l: 0.85, c: 0, h: 0 } },
		],
	},
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SliderField({
	label,
	value,
	min,
	max,
	step,
	onChange,
}: {
	label: string
	value: number
	min: number
	max: number
	step: number
	onChange: (v: number) => void
}) {
	return (
		<BlockStack gap="050">
			<InlineStack blockAlign="center" align="space-between" gap="100">
				<span className="text-2xs text-fg-muted">{label}</span>
				<span className="text-2xs text-fg-muted font-mono tabular-nums">
					{label === "H" ? value.toFixed(0) : value.toFixed(3)}
				</span>
			</InlineStack>
			<input
				type="range"
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={(e) => onChange(Number.parseFloat(e.target.value))}
				aria-label={label}
				className="w-full h-1.5 accent-brand"
			/>
		</BlockStack>
	)
}

function TokenRow({
	token,
	value,
	onChange,
}: {
	token: TokenDef
	value: Oklch
	onChange: (v: Oklch) => void
}) {
	return (
		<BlockStack gap="150">
			<InlineStack blockAlign="center" gap="200">
				<div
					className="size-4 shrink-0 rounded-sm border border-edge"
					style={{ backgroundColor: fmt(value) }}
				/>
				<span className="text-xs font-medium text-fg">{token.label}</span>
				<span className="ml-auto text-2xs text-fg-muted font-mono">
					{fmt(value)}
				</span>
			</InlineStack>
			<div className="grid grid-cols-3 gap-2">
				<SliderField
					label="L"
					value={value.l}
					min={0}
					max={1}
					step={0.005}
					onChange={(l) => onChange({ ...value, l })}
				/>
				<SliderField
					label="C"
					value={value.c}
					min={0}
					max={0.4}
					step={0.005}
					onChange={(c) => onChange({ ...value, c })}
				/>
				<SliderField
					label="H"
					value={value.h}
					min={0}
					max={360}
					step={1}
					onChange={(h) => onChange({ ...value, h })}
				/>
			</div>
		</BlockStack>
	)
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type TokenValues = Record<string, Oklch>

function isDark(): boolean {
	return document.documentElement.classList.contains("dark")
}

function getDefaults(): TokenValues {
	const dark = isDark()
	const result: TokenValues = {}
	for (const group of TOKEN_GROUPS) {
		for (const token of group.tokens) {
			result[token.variable] = { ...(dark ? token.dark : token.light) }
		}
	}
	return result
}

export function ColorTuner() {
	const [open, setOpen] = useState(false)
	const [values, setValues] = useState<TokenValues>({})
	const originalsRef = useRef<TokenValues>({})
	const modifiedRef = useRef<Set<string>>(new Set())

	const handleOpen = useCallback(() => {
		const defaults = getDefaults()
		setValues(defaults)
		originalsRef.current = structuredClone(defaults)
		modifiedRef.current = new Set()
		setOpen(true)
	}, [])

	const handleTokenChange = useCallback(
		(variable: string, newValue: Oklch) => {
			setValues((prev) => ({ ...prev, [variable]: newValue }))
			modifiedRef.current.add(variable)
			document.documentElement.style.setProperty(variable, fmt(newValue))
		},
		[]
	)

	const handleReset = useCallback(() => {
		for (const group of TOKEN_GROUPS) {
			for (const token of group.tokens) {
				document.documentElement.style.removeProperty(token.variable)
			}
		}
		modifiedRef.current.clear()
		const defaults = getDefaults()
		originalsRef.current = structuredClone(defaults)
		setValues(defaults)
	}, [])

	const handleCopyCss = useCallback(() => {
		const modified = modifiedRef.current
		if (modified.size === 0) return
		const lines: string[] = []
		for (const variable of modified) {
			const val = values[variable]
			if (val) lines.push(`  ${variable}: ${fmt(val)};`)
		}
		navigator.clipboard.writeText(`:root {\n${lines.join("\n")}\n}`)
	}, [values])

	return (
		<>
			<Button
				variant="outline"
				size="icon"
				onClick={() => (open ? setOpen(false) : handleOpen())}
				className="fixed bottom-4 right-4 z-50 size-9 rounded-full shadow-lg"
			>
				<Palette className="size-4" />
			</Button>

			{open && (
				<div className="fixed top-2 bottom-2 right-2 z-50 flex w-[320px] flex-col bg-surface-4 shadow-lg border border-container rounded-xl overflow-hidden">
					<div className="flex items-center justify-between px-4 py-3 border-b border-separator">
						<span className="text-sm font-medium text-fg">Color Tuner</span>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setOpen(false)}
						>
							<X className="size-3.5" />
						</Button>
					</div>

					<div className="flex-1 overflow-y-auto p-4">
						<BlockStack gap="600">
							{TOKEN_GROUPS.map((group) => (
								<BlockStack key={group.name} gap="200">
									<h3 className="text-xs uppercase text-fg-muted tracking-wider font-medium">
										{group.name}
									</h3>
									<BlockStack gap="300">
										{group.tokens.map((token) => (
											<TokenRow
												key={token.variable}
												token={token}
												value={values[token.variable] ?? token.dark}
												onChange={(v) =>
													handleTokenChange(token.variable, v)
												}
											/>
										))}
									</BlockStack>
								</BlockStack>
							))}
						</BlockStack>
					</div>

					<div className="flex gap-2 justify-end px-4 py-3 border-t border-separator bg-surface-3">
						<Button variant="outline" size="sm" onClick={handleReset}>
							<RotateCcw className="size-3.5" />
							Reset
						</Button>
						<Button size="sm" onClick={handleCopyCss}>
							<Copy className="size-3.5" />
							Copy CSS
						</Button>
					</div>
				</div>
			)}
		</>
	)
}
