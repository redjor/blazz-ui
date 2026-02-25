// ---------------------------------------------------------------------------
// oklch <-> hex conversion utilities
// Bridge between native <input type="color"> (hex) and oklch design tokens.
// ---------------------------------------------------------------------------

import type { OklchColor } from "@/components/docs/theme-editor/theme-presets"

// ---------------------------------------------------------------------------
// oklchToHex — Convert an OklchColor to a hex string (e.g. "#5b3aff")
// Uses a hidden canvas for browser-native oklch -> sRGB conversion.
// ---------------------------------------------------------------------------

export function oklchToHex(color: OklchColor): string {
	if (typeof document === "undefined") return "#808080"

	const canvas = document.createElement("canvas")
	canvas.width = 1
	canvas.height = 1
	const ctx = canvas.getContext("2d")
	if (!ctx) return "#808080"

	const alphaStr = color.a !== undefined ? ` / ${color.a}` : ""
	ctx.fillStyle = `oklch(${color.l} ${color.c} ${color.h}${alphaStr})`
	ctx.fillRect(0, 0, 1, 1)

	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

// ---------------------------------------------------------------------------
// hexToOklch — Convert a hex string to an approximate OklchColor
// Uses sRGB -> linear sRGB -> OKLab -> oklch math.
// ---------------------------------------------------------------------------

export function hexToOklch(hex: string): OklchColor {
	if (typeof document === "undefined") return { l: 0.5, c: 0, h: 0 }

	// Parse hex to RGB (0-255)
	const cleaned = hex.replace("#", "")
	const r = Number.parseInt(cleaned.slice(0, 2), 16) / 255
	const g = Number.parseInt(cleaned.slice(2, 4), 16) / 255
	const b = Number.parseInt(cleaned.slice(4, 6), 16) / 255

	// sRGB to linear sRGB
	const toLinear = (s: number) => (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4)
	const lr = toLinear(r)
	const lg = toLinear(g)
	const lb = toLinear(b)

	// Linear sRGB -> LMS (cone responses)
	const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
	const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
	const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

	// Cube root
	const l_3 = Math.cbrt(l_)
	const m_3 = Math.cbrt(m_)
	const s_3 = Math.cbrt(s_)

	// LMS -> OKLab
	const L = 0.2104542553 * l_3 + 0.793617785 * m_3 - 0.0040720468 * s_3
	const a = 1.9779984951 * l_3 - 2.428592205 * m_3 + 0.4505937099 * s_3
	const bLab = 0.0259040371 * l_3 + 0.7827717662 * m_3 - 0.808675766 * s_3

	// OKLab -> oklch
	const C = Math.sqrt(a * a + bLab * bLab)
	let H = (Math.atan2(bLab, a) * 180) / Math.PI
	if (H < 0) H += 360

	return {
		l: Math.round(L * 1000) / 1000,
		c: Math.round(C * 1000) / 1000,
		h: Math.round(H),
	}
}

// ---------------------------------------------------------------------------
// parseOklchString — Parse "oklch(0.5 0.22 275)" or "oklch(0.35 0.005 285 / 0.6)"
// Returns null if parsing fails.
// ---------------------------------------------------------------------------

const OKLCH_RE = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/

export function parseOklchString(str: string): OklchColor | null {
	const match = str.match(OKLCH_RE)
	if (!match) return null

	const l = Number.parseFloat(match[1])
	const c = Number.parseFloat(match[2])
	const h = Number.parseFloat(match[3])

	if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) return null

	const color: OklchColor = { l, c, h }

	if (match[4] !== undefined) {
		const a = Number.parseFloat(match[4])
		if (!Number.isNaN(a)) color.a = a
	}

	return color
}
