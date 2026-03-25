"use client"

import { useEffect, useRef } from "react"
import { CodeEditor } from "./code-editor"

// ── Default theme CSS (dark theme tokens, editable) ──

export const DEFAULT_THEME_CSS = `/* Blazz Dark Theme — Edit to customize */
/* Changes apply live to the preview */

:root {
  --radius: 0.5rem;

  /* Semantic surfaces */
  --page: oklch(0.145 0.005 285);
  --background: oklch(0.179 0.005 285);
  --card: oklch(0.213 0.005 285);
  --muted: oklch(0.246 0.005 285);
  --popover: oklch(0.28 0.005 285);

  /* Borders */
  --border-default: oklch(0.35 0.005 285 / 0.6);
  --border-subtle: oklch(0.35 0.005 285 / 0.3);

  /* Text */
  --text-primary: oklch(0.985 0 0);
  --text-secondary: oklch(0.65 0.01 285);
  --text-muted: oklch(0.5 0.01 285);

  /* Accent — Indigo/Violet */
  --accent: oklch(0.585 0.22 275);
  --accent-hover: oklch(0.52 0.22 275);
  --accent-foreground: oklch(0.985 0 0);

  /* Semantic */
  --success: oklch(0.6 0.18 145);
  --warning: oklch(0.7 0.15 70);
  --destructive: oklch(0.6 0.2 25);
  --info: oklch(0.55 0.2 265);

  /* Density */
  --row-height: 40px;
  --cell-padding-x: 12px;
  --cell-padding-y: 8px;
  --input-height: 32px;
  --section-gap: 24px;
  --inset: 1rem;

  /* Badge */
  --badge-radius: var(--radius-md);
}`

// ── Theme Editor ────────────────────────────────

interface ThemeEditorProps {
	value: string
	onChange: (value: string) => void
}

export function ThemeEditor({ value, onChange }: ThemeEditorProps) {
	const styleRef = useRef<HTMLStyleElement | null>(null)

	// Inject/update a <style> tag in <head> with the user's CSS
	useEffect(() => {
		if (!styleRef.current) {
			const style = document.createElement("style")
			style.setAttribute("data-sandbox-theme", "true")
			document.head.appendChild(style)
			styleRef.current = style
		}

		// Scope the CSS to the preview container
		// Replace `:root` with `#sandbox-preview-container` so it only affects the preview
		const scopedCss = value.replace(/:root\s*\{/g, "#sandbox-preview-container {")

		styleRef.current.textContent = scopedCss

		return () => {
			// Don't remove on every change, only on unmount
		}
	}, [value])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (styleRef.current) {
				styleRef.current.remove()
				styleRef.current = null
			}
		}
	}, [])

	return (
		<div className="h-full w-full">
			<CodeEditor value={value} onChange={onChange} language="css" />
		</div>
	)
}
