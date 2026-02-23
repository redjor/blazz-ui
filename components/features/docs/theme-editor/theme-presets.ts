// ---------------------------------------------------------------------------
// Theme Editor — Types, presets & helpers
// ---------------------------------------------------------------------------

export type OklchColor = {
	l: number // 0-1
	c: number // 0-0.4
	h: number // 0-360
	a?: number // 0-1 (optional alpha)
}

export const TOKEN_KEYS = [
	"bg-app",
	"bg-surface",
	"bg-raised",
	"bg-overlay",
	"text-primary",
	"text-secondary",
	"text-muted",
	"border-default",
	"border-subtle",
	"accent",
	"accent-hover",
	"accent-foreground",
	"success",
	"warning",
	"destructive",
	"info",
	"top-background",
	"main-background",
	"sidebar-background",
	"sidebar-foreground",
	"sidebar-primary",
	"sidebar-primary-foreground",
	"sidebar-accent",
	"sidebar-accent-foreground",
	"sidebar-border",
	"sidebar-ring",
] as const

export type TokenKey = (typeof TOKEN_KEYS)[number]
export type TokenValues = Record<TokenKey, OklchColor>

// ---------------------------------------------------------------------------
// Token groups (drives slider UI)
// ---------------------------------------------------------------------------

export const TOKEN_GROUPS: { title: string; tokens: TokenKey[] }[] = [
	{ title: "Surfaces", tokens: ["bg-app", "bg-surface", "bg-raised", "bg-overlay"] },
	{ title: "Text", tokens: ["text-primary", "text-secondary", "text-muted"] },
	{ title: "Borders", tokens: ["border-default", "border-subtle"] },
	{ title: "Accent", tokens: ["accent", "accent-hover", "accent-foreground"] },
	{ title: "Semantic", tokens: ["success", "warning", "destructive", "info"] },
	{ title: "Layout", tokens: ["top-background", "main-background"] },
	{ title: "Sidebar", tokens: ["sidebar-background", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"] },
]

// ---------------------------------------------------------------------------
// Density / spacing tokens
// ---------------------------------------------------------------------------

export interface DensityToken {
	key: string
	label: string
	unit: "px" | "rem"
	min: number
	max: number
	step: number
	defaultValue: number
}

export const DENSITY_TOKENS: DensityToken[] = [
	{ key: "row-height", label: "Row Height", unit: "px", min: 28, max: 56, step: 2, defaultValue: 40 },
	{ key: "cell-padding-x", label: "Cell Padding X", unit: "px", min: 4, max: 24, step: 2, defaultValue: 12 },
	{ key: "cell-padding-y", label: "Cell Padding Y", unit: "px", min: 2, max: 16, step: 2, defaultValue: 8 },
	{ key: "input-height", label: "Input Height", unit: "px", min: 24, max: 44, step: 2, defaultValue: 32 },
	{ key: "section-gap", label: "Section Gap", unit: "px", min: 8, max: 48, step: 4, defaultValue: 24 },
	{ key: "radius", label: "Border Radius", unit: "rem", min: 0, max: 1.5, step: 0.125, defaultValue: 0.5 },
	{ key: "base-font-size", label: "Base Font Size", unit: "px", min: 11, max: 16, step: 0.5, defaultValue: 13 },
	{ key: "topbar-height", label: "Topbar Height", unit: "px", min: 40, max: 72, step: 2, defaultValue: 56 },
	{ key: "tabbar-height", label: "Tabbar Height", unit: "px", min: 28, max: 48, step: 2, defaultValue: 36 },
	{ key: "main-radius", label: "Main Radius", unit: "px", min: 0, max: 20, step: 2, defaultValue: 10 },
	{ key: "sidebar-width", label: "Sidebar Width", unit: "px", min: 180, max: 320, step: 10, defaultValue: 240 },
	{ key: "sidebar-collapsed", label: "Sidebar Collapsed", unit: "px", min: 48, max: 80, step: 4, defaultValue: 64 },
]

export type DensityValues = Record<string, number>

export function getDefaultDensity(): DensityValues {
	const values: DensityValues = {}
	for (const t of DENSITY_TOKENS) {
		values[t.key] = t.defaultValue
	}
	return values
}

// ---------------------------------------------------------------------------
// Raw token → Tailwind alias mapping
// ---------------------------------------------------------------------------

const TAILWIND_ALIASES: Partial<Record<TokenKey, string>> = {
	"bg-surface": "--color-surface",
	"bg-raised": "--color-raised",
	"bg-overlay": "--color-panel",
	"text-primary": "--color-fg",
	"text-secondary": "--color-fg-muted",
	"text-muted": "--color-fg-subtle",
	"border-default": "--color-edge",
	"border-subtle": "--color-edge-subtle",
	accent: "--color-brand",
	"accent-hover": "--color-brand-hover",
	"accent-foreground": "--color-brand-fg",
	success: "--color-positive",
	warning: "--color-caution",
	destructive: "--color-negative",
	info: "--color-inform",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function oklchToString(color: OklchColor): string {
	const l = Number(color.l.toFixed(3))
	const c = Number(color.c.toFixed(3))
	const h = Math.round(color.h)
	if (color.a !== undefined && color.a < 1) {
		return `oklch(${l} ${c} ${h} / ${Number(color.a.toFixed(2))})`
	}
	return `oklch(${l} ${c} ${h})`
}

/** Produces inline style object with both raw tokens and Tailwind aliases. */
export function tokensToInlineStyles(tokens: TokenValues): Record<string, string> {
	const styles: Record<string, string> = {}
	for (const key of TOKEN_KEYS) {
		const value = oklchToString(tokens[key])
		styles[`--${key}`] = value
		const alias = TAILWIND_ALIASES[key]
		if (alias) styles[alias] = value
	}
	return styles
}

/** Density token → Tailwind spacing alias mapping. */
const DENSITY_ALIASES: Record<string, string> = {
	"cell-padding-x": "--spacing-cell-x",
	"cell-padding-y": "--spacing-cell-y",
	"section-gap": "--spacing-section",
}

/** Produces inline style object for density/spacing tokens. */
export function densityToInlineStyles(values: DensityValues): Record<string, string> {
	const styles: Record<string, string> = {}
	for (const token of DENSITY_TOKENS) {
		if (token.key === "base-font-size") continue // applied as fontSize separately
		if (token.key === "radius") {
			const r = values.radius
			styles["--radius"] = `${r}rem`
			styles["--radius-sm"] = `calc(${r}rem - 4px)`
			styles["--radius-md"] = `calc(${r}rem - 2px)`
			styles["--radius-lg"] = `${r}rem`
			styles["--radius-xl"] = `calc(${r}rem + 4px)`
			styles["--radius-2xl"] = `calc(${r}rem + 8px)`
			styles["--badge-radius"] = `calc(${r}rem - 2px)`
			continue
		}
		const cssValue = `${values[token.key]}${token.unit}`
		styles[`--${token.key}`] = cssValue
		const alias = DENSITY_ALIASES[token.key]
		if (alias) styles[alias] = cssValue
	}
	return styles
}

/** Generates a self-contained CSS block for both light and dark modes + density. */
export function generateExportCss(
	light: TokenValues,
	dark: TokenValues,
	density?: DensityValues,
): string {
	let css = "/* Custom Theme — Generated by Pro UI Kit Theme Editor */\n\n"
	css += 'html[data-theme="custom"] {\n'
	// Density (shared, only in light block — inherited by dark)
	if (density) {
		for (const token of DENSITY_TOKENS) {
			if (token.key === "base-font-size") continue
			if (token.key === "radius") {
				css += `  --radius: ${density.radius}rem;\n`
				continue
			}
			css += `  --${token.key}: ${density[token.key]}${token.unit};\n`
		}
		css += "\n"
	}
	for (const key of TOKEN_KEYS) {
		css += `  --${key}: ${oklchToString(light[key])};\n`
	}
	css += "}\n\n"
	css += 'html[data-theme="custom"].dark {\n'
	for (const key of TOKEN_KEYS) {
		css += `  --${key}: ${oklchToString(dark[key])};\n`
	}
	css += "}\n"
	if (density && density["base-font-size"] !== 13) {
		css += `\n/* Base font size */\nbody { font-size: ${density["base-font-size"]}px; }\n`
	}
	return css
}

// ---------------------------------------------------------------------------
// Preset data (extracted from globals.css)
// ---------------------------------------------------------------------------

export type PresetName = "slate" | "corporate" | "warm"

export interface ThemePreset {
	name: PresetName
	label: string
	light: TokenValues
	dark: TokenValues
}

const SEMANTIC_LIGHT = {
	success: { l: 0.45, c: 0.18, h: 145 },
	warning: { l: 0.55, c: 0.15, h: 70 },
	destructive: { l: 0.5, c: 0.2, h: 25 },
	info: { l: 0.45, c: 0.2, h: 265 },
} as const

const SEMANTIC_DARK = {
	success: { l: 0.6, c: 0.18, h: 145 },
	warning: { l: 0.7, c: 0.15, h: 70 },
	destructive: { l: 0.6, c: 0.2, h: 25 },
	info: { l: 0.55, c: 0.2, h: 265 },
} as const

// Shared sidebar colors (from globals.css :root)
const SIDEBAR_LIGHT = {
	"sidebar-background": { l: 0.94, c: 0, h: 0 },
	"sidebar-foreground": { l: 0.4, c: 0, h: 0 },
	"sidebar-primary": { l: 0.3, c: 0, h: 0 },
	"sidebar-primary-foreground": { l: 0.99, c: 0, h: 0 },
	"sidebar-accent": { l: 1, c: 0, h: 0 },
	"sidebar-accent-foreground": { l: 0.18, c: 0, h: 0 },
	"sidebar-border": { l: 0.82, c: 0, h: 0 },
	"sidebar-ring": { l: 0.3, c: 0, h: 0 },
} as const

const SIDEBAR_DARK = {
	"sidebar-background": { l: 0.175, c: 0, h: 0 },
	"sidebar-foreground": { l: 0.85, c: 0, h: 0 },
	"sidebar-primary": { l: 0.85, c: 0, h: 0 },
	"sidebar-primary-foreground": { l: 0.175, c: 0, h: 0 },
	"sidebar-accent": { l: 0.22, c: 0.002, h: 264 },
	"sidebar-accent-foreground": { l: 0.95, c: 0, h: 0 },
	"sidebar-border": { l: 0.25, c: 0.002, h: 264 },
	"sidebar-ring": { l: 0.85, c: 0, h: 0 },
} as const

export const PRESETS: ThemePreset[] = [
	{
		name: "slate",
		label: "Slate",
		light: {
			"bg-app": { l: 0.97, c: 0, h: 0 },
			"bg-surface": { l: 1, c: 0, h: 0 },
			"bg-raised": { l: 0.94, c: 0, h: 0 },
			"bg-overlay": { l: 1, c: 0, h: 0 },
			"text-primary": { l: 0.14, c: 0, h: 0 },
			"text-secondary": { l: 0.45, c: 0, h: 0 },
			"text-muted": { l: 0.55, c: 0, h: 0 },
			"border-default": { l: 0.87, c: 0, h: 0 },
			"border-subtle": { l: 0.92, c: 0, h: 0 },
			accent: { l: 0.5, c: 0.22, h: 275 },
			"accent-hover": { l: 0.44, c: 0.22, h: 275 },
			"accent-foreground": { l: 0.985, c: 0, h: 0 },
			...SEMANTIC_LIGHT,
			"top-background": { l: 0.175, c: 0.002, h: 264 },
			"main-background": { l: 0.96, c: 0, h: 0 },
			...SIDEBAR_LIGHT,
		},
		dark: {
			"bg-app": { l: 0.145, c: 0.005, h: 285 },
			"bg-surface": { l: 0.178, c: 0.005, h: 285 },
			"bg-raised": { l: 0.215, c: 0.005, h: 285 },
			"bg-overlay": { l: 0.25, c: 0.005, h: 285 },
			"text-primary": { l: 0.985, c: 0, h: 0 },
			"text-secondary": { l: 0.65, c: 0.01, h: 285 },
			"text-muted": { l: 0.5, c: 0.01, h: 285 },
			"border-default": { l: 0.35, c: 0.005, h: 285, a: 0.6 },
			"border-subtle": { l: 0.35, c: 0.005, h: 285, a: 0.3 },
			accent: { l: 0.585, c: 0.22, h: 275 },
			"accent-hover": { l: 0.52, c: 0.22, h: 275 },
			"accent-foreground": { l: 0.985, c: 0, h: 0 },
			...SEMANTIC_DARK,
			"top-background": { l: 0.145, c: 0.005, h: 285 },
			"main-background": { l: 0.178, c: 0.005, h: 285 },
			...SIDEBAR_DARK,
		},
	},
	{
		name: "corporate",
		label: "Corporate",
		light: {
			"bg-app": { l: 0.965, c: 0, h: 0 },
			"bg-surface": { l: 1, c: 0, h: 0 },
			"bg-raised": { l: 0.945, c: 0, h: 0 },
			"bg-overlay": { l: 1, c: 0, h: 0 },
			"text-primary": { l: 0.15, c: 0, h: 0 },
			"text-secondary": { l: 0.4, c: 0, h: 0 },
			"text-muted": { l: 0.55, c: 0, h: 0 },
			"border-default": { l: 0.88, c: 0, h: 0 },
			"border-subtle": { l: 0.93, c: 0, h: 0 },
			accent: { l: 0.4, c: 0.18, h: 250 },
			"accent-hover": { l: 0.35, c: 0.18, h: 250 },
			"accent-foreground": { l: 0.985, c: 0, h: 0 },
			...SEMANTIC_LIGHT,
			"top-background": { l: 0.175, c: 0.002, h: 264 },
			"main-background": { l: 0.96, c: 0, h: 0 },
			...SIDEBAR_LIGHT,
		},
		dark: {
			"bg-app": { l: 0.145, c: 0, h: 0 },
			"bg-surface": { l: 0.178, c: 0, h: 0 },
			"bg-raised": { l: 0.215, c: 0, h: 0 },
			"bg-overlay": { l: 0.25, c: 0, h: 0 },
			"text-primary": { l: 0.985, c: 0, h: 0 },
			"text-secondary": { l: 0.65, c: 0, h: 0 },
			"text-muted": { l: 0.5, c: 0, h: 0 },
			"border-default": { l: 0.35, c: 0, h: 0, a: 0.6 },
			"border-subtle": { l: 0.35, c: 0, h: 0, a: 0.3 },
			accent: { l: 0.55, c: 0.18, h: 250 },
			"accent-hover": { l: 0.48, c: 0.18, h: 250 },
			"accent-foreground": { l: 0.985, c: 0, h: 0 },
			...SEMANTIC_DARK,
			"top-background": { l: 0.145, c: 0, h: 0 },
			"main-background": { l: 0.178, c: 0, h: 0 },
			...SIDEBAR_DARK,
		},
	},
	{
		name: "warm",
		label: "Warm",
		light: {
			"bg-app": { l: 0.96, c: 0.01, h: 75 },
			"bg-surface": { l: 0.995, c: 0.005, h: 75 },
			"bg-raised": { l: 0.935, c: 0.01, h: 75 },
			"bg-overlay": { l: 0.995, c: 0.005, h: 75 },
			"text-primary": { l: 0.18, c: 0.01, h: 60 },
			"text-secondary": { l: 0.42, c: 0.02, h: 60 },
			"text-muted": { l: 0.55, c: 0.015, h: 60 },
			"border-default": { l: 0.86, c: 0.01, h: 75 },
			"border-subtle": { l: 0.91, c: 0.008, h: 75 },
			accent: { l: 0.55, c: 0.17, h: 70 },
			"accent-hover": { l: 0.48, c: 0.17, h: 70 },
			"accent-foreground": { l: 0.985, c: 0, h: 0 },
			...SEMANTIC_LIGHT,
			"top-background": { l: 0.175, c: 0.002, h: 264 },
			"main-background": { l: 0.96, c: 0.01, h: 75 },
			...SIDEBAR_LIGHT,
		},
		dark: {
			"bg-app": { l: 0.155, c: 0.01, h: 60 },
			"bg-surface": { l: 0.19, c: 0.01, h: 60 },
			"bg-raised": { l: 0.225, c: 0.01, h: 60 },
			"bg-overlay": { l: 0.26, c: 0.01, h: 60 },
			"text-primary": { l: 0.97, c: 0.01, h: 75 },
			"text-secondary": { l: 0.65, c: 0.015, h: 60 },
			"text-muted": { l: 0.5, c: 0.01, h: 60 },
			"border-default": { l: 0.35, c: 0.01, h: 60, a: 0.6 },
			"border-subtle": { l: 0.35, c: 0.01, h: 60, a: 0.3 },
			accent: { l: 0.7, c: 0.15, h: 70 },
			"accent-hover": { l: 0.63, c: 0.15, h: 70 },
			"accent-foreground": { l: 0.15, c: 0, h: 0 },
			...SEMANTIC_DARK,
			"top-background": { l: 0.155, c: 0.01, h: 60 },
			"main-background": { l: 0.19, c: 0.01, h: 60 },
			...SIDEBAR_DARK,
		},
	},
]
