"use client"

import * as React from "react"
import { Check, Copy, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	TOKEN_GROUPS,
	PRESETS,
	DENSITY_TOKENS,
	oklchToString,
	tokensToInlineStyles,
	densityToInlineStyles,
	generateExportCss,
	getDefaultDensity,
	type TokenKey,
	type TokenValues,
	type PresetName,
	type OklchColor,
	type DensityToken,
	type DensityValues,
} from "./theme-presets"

// ---------------------------------------------------------------------------
// Slider sub-components
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
	const decimals = label === "H" ? 0 : label === "A" ? 2 : 3
	return (
		<label className="flex items-center gap-1.5">
			<span className="w-2 shrink-0 text-[10px] font-mono text-fg-subtle">{label}</span>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number.parseFloat(e.target.value))}
				className="w-full cursor-pointer"
			/>
			<span className="w-10 shrink-0 text-right text-[10px] font-mono text-fg-subtle tabular-nums">
				{value.toFixed(decimals)}
			</span>
		</label>
	)
}

function TokenSliderRow({
	tokenKey,
	color,
	onChange,
}: {
	tokenKey: TokenKey
	color: OklchColor
	onChange: (field: keyof OklchColor, value: number) => void
}) {
	const hasAlpha = color.a !== undefined

	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2">
				<div
					className="size-5 shrink-0 rounded border border-container"
					style={{ backgroundColor: oklchToString(color) }}
				/>
				<span className="truncate text-xs font-mono text-fg">--{tokenKey}</span>
				<span className="ml-auto text-2xs font-mono text-fg-subtle whitespace-nowrap">
					{oklchToString(color)}
				</span>
			</div>
			<div className="space-y-0.5 pl-7">
				<SliderField label="L" value={color.l} min={0} max={1} step={0.005} onChange={(v) => onChange("l", v)} />
				<SliderField label="C" value={color.c} min={0} max={0.4} step={0.005} onChange={(v) => onChange("c", v)} />
				<SliderField label="H" value={color.h} min={0} max={360} step={1} onChange={(v) => onChange("h", v)} />
				{hasAlpha && (
					<SliderField label="A" value={color.a!} min={0} max={1} step={0.05} onChange={(v) => onChange("a", v)} />
				)}
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Density slider
// ---------------------------------------------------------------------------

function DensitySliderRow({
	token,
	value,
	onChange,
}: {
	token: DensityToken
	value: number
	onChange: (v: number) => void
}) {
	const decimals = token.unit === "rem" ? 3 : token.step < 1 ? 1 : 0
	return (
		<div className="flex items-center gap-2">
			<span className="w-28 shrink-0 text-xs text-fg-muted">{token.label}</span>
			<input
				type="range"
				min={token.min}
				max={token.max}
				step={token.step}
				value={value}
				onChange={(e) => onChange(Number.parseFloat(e.target.value))}
				className="w-full cursor-pointer"
			/>
			<span className="w-14 shrink-0 text-right text-xs font-mono text-fg-subtle tabular-nums">
				{value.toFixed(decimals)}
				{token.unit}
			</span>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Preview panel
// ---------------------------------------------------------------------------

function PreviewPanel() {
	return (
		<div className="space-y-4 p-4" style={{ backgroundColor: "var(--bg-app)", color: "var(--text-primary)" }}>
			{/* Surface depth */}
			<div>
				<p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
					Surface Depth
				</p>
				<div className="flex gap-1.5">
					{(
						[
							{ label: "app", style: { backgroundColor: "var(--bg-app)" } },
							{ label: "surface", className: "bg-surface" },
							{ label: "raised", className: "bg-raised" },
							{ label: "overlay", className: "bg-panel" },
						] as const
					).map((s) => (
						<div
							key={s.label}
							className={cn(
								"flex-1 rounded-md border border-container p-2 text-center text-[10px] font-mono text-fg-muted",
								"className" in s && s.className,
							)}
							style={"style" in s ? s.style : undefined}
						>
							{s.label}
						</div>
					))}
				</div>
			</div>

			{/* Text hierarchy */}
			<div className="space-y-0.5">
				<p className="text-sm font-semibold text-fg">Primary text</p>
				<p className="text-xs text-fg-muted">Secondary text (descriptions)</p>
				<p className="text-xs text-fg-subtle">Muted text (timestamps)</p>
			</div>

			{/* Card */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card description text</CardDescription>
				</CardHeader>
				<CardContent className="pb-3">
					<Input placeholder="Type something..." />
				</CardContent>
				<CardFooter>
					<span className="text-xs text-fg-muted">Footer</span>
					<Button size="sm" className="ml-auto">
						Save
					</Button>
				</CardFooter>
			</Card>

			{/* Buttons */}
			<div className="flex flex-wrap gap-1.5">
				<Button size="xs">Default</Button>
				<Button size="xs" variant="outline">
					Outline
				</Button>
				<Button size="xs" variant="secondary">
					Secondary
				</Button>
				<Button size="xs" variant="ghost">
					Ghost
				</Button>
				<Button size="xs" variant="destructive">
					Destructive
				</Button>
			</div>

			{/* Badges */}
			<div className="flex flex-wrap gap-1.5">
				<Badge size="xs">Default</Badge>
				<Badge size="xs" variant="secondary">
					Secondary
				</Badge>
				<Badge size="xs" variant="success">
					Success
				</Badge>
				<Badge size="xs" variant="warning">
					Warning
				</Badge>
				<Badge size="xs" variant="critical">
					Critical
				</Badge>
				<Badge size="xs" variant="info">
					Info
				</Badge>
			</div>

			{/* Semantic swatches */}
			<div className="grid grid-cols-4 gap-1.5">
				{(
					[
						{ label: "Success", className: "bg-positive" },
						{ label: "Warning", className: "bg-caution" },
						{ label: "Error", className: "bg-negative" },
						{ label: "Info", className: "bg-inform" },
					] as const
				).map((s) => (
					<div
						key={s.label}
						className={cn(
							"rounded-md p-2 text-center text-[10px] font-medium text-white",
							s.className,
						)}
					>
						{s.label}
					</div>
				))}
			</div>

			{/* Density demo table */}
			<div>
				<p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
					Density
				</p>
				<div className="overflow-hidden rounded-lg border border-container">
					<div
						className="flex items-center border-b border-separator bg-raised text-[10px] font-medium text-fg-muted"
						style={{ height: "var(--row-height)", paddingInline: "var(--cell-padding-x)" }}
					>
						<span className="flex-1">Name</span>
						<span className="w-16 text-right">Amount</span>
					</div>
					{[
						{ name: "Acme Corp", amount: "$12,500" },
						{ name: "Globex Inc", amount: "$8,200" },
					].map((row) => (
						<div
							key={row.name}
							className="flex items-center border-b border-edge-subtle last:border-0 text-xs text-fg"
							style={{ height: "var(--row-height)", paddingInline: "var(--cell-padding-x)" }}
						>
							<span className="flex-1">{row.name}</span>
							<span className="w-16 text-right font-mono text-fg-muted">{row.amount}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Main editor
// ---------------------------------------------------------------------------

export function ThemeEditor() {
	const [presetName, setPresetName] = React.useState<PresetName>("slate")
	const [lightTokens, setLightTokens] = React.useState<TokenValues>(() =>
		structuredClone(PRESETS[0].light),
	)
	const [darkTokens, setDarkTokens] = React.useState<TokenValues>(() =>
		structuredClone(PRESETS[0].dark),
	)
	const [densityValues, setDensityValues] = React.useState<DensityValues>(getDefaultDensity)
	const [mode, setMode] = React.useState<"light" | "dark">("dark")
	const [copied, setCopied] = React.useState(false)

	const tokens = mode === "light" ? lightTokens : darkTokens
	const setTokens = mode === "light" ? setLightTokens : setDarkTokens

	const handlePresetChange = (name: PresetName) => {
		const p = PRESETS.find((x) => x.name === name)!
		setPresetName(name)
		setLightTokens(structuredClone(p.light))
		setDarkTokens(structuredClone(p.dark))
	}

	const updateToken = (key: TokenKey, field: keyof OklchColor, value: number) => {
		setTokens((prev) => ({
			...prev,
			[key]: { ...prev[key], [field]: value },
		}))
	}

	const updateDensity = (key: string, value: number) => {
		setDensityValues((prev) => ({ ...prev, [key]: value }))
	}

	const handleExport = async () => {
		const css = generateExportCss(lightTokens, darkTokens, densityValues)
		await navigator.clipboard.writeText(css)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const inlineStyles = {
		...tokensToInlineStyles(tokens),
		...densityToInlineStyles(densityValues),
	}

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-2">
				{/* Preset picker */}
				<div className="flex items-center gap-0.5 rounded-lg border border-container bg-raised p-1">
					{PRESETS.map((p) => (
						<button
							key={p.name}
							type="button"
							onClick={() => handlePresetChange(p.name)}
							className={cn(
								"rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
								presetName === p.name
									? "bg-surface text-fg shadow-sm"
									: "text-fg-muted hover:text-fg",
							)}
						>
							{p.label}
						</button>
					))}
				</div>

				{/* Light / Dark toggle */}
				<div className="flex items-center gap-0.5 rounded-lg border border-container bg-raised p-1">
					<button
						type="button"
						onClick={() => setMode("light")}
						className={cn(
							"inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
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
						onClick={() => setMode("dark")}
						className={cn(
							"inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
							mode === "dark"
								? "bg-surface text-fg shadow-sm"
								: "text-fg-muted hover:text-fg",
						)}
					>
						<Moon className="size-3" />
						Dark
					</button>
				</div>

				{/* Export */}
				<Button variant="outline" size="sm" onClick={handleExport} className="ml-auto gap-1.5">
					{copied ? (
						<>
							<Check className="size-3 text-positive" />
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

			{/* Two-column layout */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Left: Token sliders */}
				<div className="space-y-6 lg:max-h-[640px] lg:overflow-y-auto lg:pr-3">
					{TOKEN_GROUPS.map((group) => (
						<div key={group.title} className="space-y-3">
							<h3 className="text-xs font-semibold uppercase tracking-wider text-fg-muted sticky top-0 bg-surface py-1 z-10">
								{group.title}
							</h3>
							{group.tokens.map((tokenKey) => (
								<TokenSliderRow
									key={tokenKey}
									tokenKey={tokenKey}
									color={tokens[tokenKey]}
									onChange={(field, value) => updateToken(tokenKey, field, value)}
								/>
							))}
						</div>
					))}

					{/* Density & Spacing */}
					<div className="space-y-3">
						<h3 className="text-xs font-semibold uppercase tracking-wider text-fg-muted sticky top-0 bg-surface py-1 z-10">
							Density & Spacing
						</h3>
						{DENSITY_TOKENS.map((token) => (
							<DensitySliderRow
								key={token.key}
								token={token}
								value={densityValues[token.key]}
								onChange={(v) => updateDensity(token.key, v)}
							/>
						))}
					</div>
				</div>

				{/* Right: Live preview */}
				<div className="lg:sticky lg:top-6 lg:self-start">
					<div
						className="overflow-hidden rounded-lg border border-container"
						style={{
							...inlineStyles,
							colorScheme: mode,
							fontSize: `${densityValues["base-font-size"]}px`,
						} as React.CSSProperties}
					>
						<PreviewPanel />
					</div>
				</div>
			</div>
		</div>
	)
}
