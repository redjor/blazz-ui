"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"

const toc = [
	{ id: "how-it-works", title: "How It Works" },
	{ id: "tokens", title: "Token Reference" },
	{ id: "palettes", title: "Built-in Palettes" },
	{ id: "custom-theme", title: "Create Your Own Theme" },
	{ id: "dark-mode", title: "Dark Mode" },
	{ id: "density", title: "Density & Spacing" },
]

const tokenGroups = [
	{
		title: "Surfaces",
		description: "Background layers that create visual depth.",
		tokens: [
			{ variable: "--bg-app", utility: "bg-[var(--bg-app)]", role: "Page background behind panels" },
			{ variable: "--bg-surface", utility: "bg-surface", role: "Main content areas, cards" },
			{ variable: "--bg-raised", utility: "bg-raised", role: "Elevated elements, hover states" },
			{ variable: "--bg-overlay", utility: "bg-panel", role: "Popovers, dropdowns, sheets" },
		],
	},
	{
		title: "Text",
		description: "Three levels of text emphasis.",
		tokens: [
			{ variable: "--text-primary", utility: "text-fg", role: "Headings, labels, important content" },
			{ variable: "--text-secondary", utility: "text-fg-muted", role: "Descriptions, supporting text" },
			{ variable: "--text-muted", utility: "text-fg-subtle", role: "Timestamps, metadata, disabled" },
		],
	},
	{
		title: "Borders",
		description: "Edge colors for containers and dividers.",
		tokens: [
			{ variable: "--border-default", utility: "border-edge", role: "Card borders, dividers, table rows" },
			{ variable: "--border-subtle", utility: "border-edge-subtle", role: "Light separators, nested borders" },
		],
	},
	{
		title: "Accent / Brand",
		description: "Your primary interactive color.",
		tokens: [
			{ variable: "--accent", utility: "bg-brand", role: "Primary buttons, active states, links" },
			{ variable: "--accent-hover", utility: "bg-brand-hover", role: "Hover state for accent elements" },
			{ variable: "--accent-foreground", utility: "text-brand-fg", role: "Text on accent backgrounds" },
		],
	},
	{
		title: "Semantic",
		description: "Status colors that communicate meaning.",
		tokens: [
			{ variable: "--success", utility: "bg-positive / text-positive", role: "Success states, confirmations" },
			{ variable: "--warning", utility: "bg-caution / text-caution", role: "Warnings, attention needed" },
			{ variable: "--destructive", utility: "bg-negative / text-negative", role: "Errors, destructive actions" },
			{ variable: "--info", utility: "bg-inform / text-inform", role: "Informational highlights" },
		],
	},
]

const densityTokens = [
	{ variable: "--row-height", default: "40px", role: "Table row height" },
	{ variable: "--cell-padding-x", default: "12px", role: "Horizontal cell padding" },
	{ variable: "--cell-padding-y", default: "8px", role: "Vertical cell padding" },
	{ variable: "--input-height", default: "32px", role: "Input field height" },
	{ variable: "--section-gap", default: "24px", role: "Gap between page sections" },
	{ variable: "--sidebar-width", default: "240px", role: "Sidebar expanded width" },
	{ variable: "--sidebar-collapsed", default: "64px", role: "Sidebar collapsed width" },
]

const slateCode = `/* Default — Slate (Dark flagship) */
html.dark {
  --bg-app: oklch(0.145 0.005 285);
  --bg-surface: oklch(0.178 0.005 285);
  --bg-raised: oklch(0.215 0.005 285);
  --bg-overlay: oklch(0.25 0.005 285);

  --border-default: oklch(0.35 0.005 285 / 0.6);
  --border-subtle: oklch(0.35 0.005 285 / 0.3);

  --text-primary: oklch(0.985 0 0);
  --text-secondary: oklch(0.65 0.01 285);
  --text-muted: oklch(0.5 0.01 285);

  --accent: oklch(0.585 0.22 275);
  --accent-hover: oklch(0.52 0.22 275);
  --accent-foreground: oklch(0.985 0 0);
}`

const corporateCode = `/* Corporate — Navy accent, pure neutral */
html[data-theme="corporate"] {
  --accent: oklch(0.40 0.18 250);
  --accent-hover: oklch(0.35 0.18 250);
  --bg-app: oklch(0.965 0 0);
  --bg-surface: oklch(1 0 0);
  --bg-raised: oklch(0.945 0 0);
  --text-primary: oklch(0.15 0 0);
  --text-secondary: oklch(0.40 0 0);
  /* ... */
}`

const warmCode = `/* Warm — Amber accent, cream surfaces */
html[data-theme="warm"] {
  --accent: oklch(0.55 0.17 70);
  --accent-hover: oklch(0.48 0.17 70);
  --bg-app: oklch(0.96 0.01 75);
  --bg-surface: oklch(0.995 0.005 75);
  --bg-raised: oklch(0.935 0.01 75);
  --text-primary: oklch(0.18 0.01 60);
  --text-secondary: oklch(0.42 0.02 60);
  /* ... */
}`

const customThemeCode = `/* 1. Add your palette in globals.css */
html[data-theme="ocean"] {
  --accent: oklch(0.55 0.2 220);
  --accent-hover: oklch(0.48 0.2 220);
  --accent-foreground: oklch(0.985 0 0);
  --bg-app: oklch(0.96 0.005 220);
  --bg-surface: oklch(0.995 0.002 220);
  --bg-raised: oklch(0.935 0.008 220);
  --bg-overlay: oklch(0.995 0.002 220);
  --border-default: oklch(0.86 0.005 220);
  --border-subtle: oklch(0.91 0.003 220);
  --text-primary: oklch(0.15 0.01 220);
  --text-secondary: oklch(0.42 0.01 220);
  --text-muted: oklch(0.55 0.008 220);
}

/* 2. Add the dark variant */
html[data-theme="ocean"].dark {
  --accent: oklch(0.60 0.2 220);
  --accent-hover: oklch(0.53 0.2 220);
  --bg-app: oklch(0.145 0.01 220);
  --bg-surface: oklch(0.178 0.01 220);
  --bg-raised: oklch(0.215 0.01 220);
  --bg-overlay: oklch(0.25 0.01 220);
  --border-default: oklch(0.35 0.01 220 / 0.6);
  --border-subtle: oklch(0.35 0.01 220 / 0.3);
  --text-primary: oklch(0.985 0 0);
  --text-secondary: oklch(0.65 0.01 220);
  --text-muted: oklch(0.50 0.01 220);
}`

const activateCode = `/* 3. Activate via data-theme attribute */
<html data-theme="ocean" class="dark">

/* Or programmatically */
document.documentElement.setAttribute("data-theme", "ocean")`

export default function ThemingPage() {
	return (
		<DocPage
			title="Theming"
			subtitle="Customize every color, spacing and density token to match your brand. All tokens are CSS custom properties — no build step needed."
			toc={toc}
		>
			{/* How It Works */}
			<DocSection id="how-it-works" title="How It Works">
				<div className="space-y-4 text-sm text-fg-muted">
					<p>
						Pro UI Kit uses <strong className="text-fg">25 CSS custom properties</strong> defined in{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-fg">globals.css</code>.
						Every component reads from these tokens — change a token, and the entire UI updates instantly.
					</p>
					<div className="rounded-lg border border-edge bg-raised p-4 space-y-3">
						<p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Architecture</p>
						<div className="flex items-center gap-3 text-xs">
							<div className="rounded-md border border-edge bg-surface px-3 py-2 text-fg">
								<span className="font-mono">globals.css</span>
								<span className="block text-fg-subtle">25 CSS variables</span>
							</div>
							<span className="text-fg-subtle">&rarr;</span>
							<div className="rounded-md border border-edge bg-surface px-3 py-2 text-fg">
								<span className="font-mono">@theme inline</span>
								<span className="block text-fg-subtle">Tailwind mapping</span>
							</div>
							<span className="text-fg-subtle">&rarr;</span>
							<div className="rounded-md border border-edge bg-surface px-3 py-2 text-fg">
								<span className="font-mono">bg-surface</span>
								<span className="block text-fg-subtle">Utility classes</span>
							</div>
						</div>
					</div>
					<p>
						Colors use the <strong className="text-fg">oklch</strong> color space for perceptual uniformity
						— lightness values are predictable across hues, making it easy to create harmonious palettes.
					</p>
				</div>
			</DocSection>

			{/* Token Reference */}
			<DocSection id="tokens" title="Token Reference">
				<div className="space-y-8">
					{tokenGroups.map((group) => (
						<div key={group.title} className="space-y-3">
							<div>
								<h3 className="text-sm font-semibold text-fg">{group.title}</h3>
								<p className="text-xs text-fg-muted">{group.description}</p>
							</div>
							<div className="overflow-x-auto rounded-lg border border-edge">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-edge bg-raised">
											<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">CSS Variable</th>
											<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">Tailwind</th>
											<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">Role</th>
											<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted w-12">Preview</th>
										</tr>
									</thead>
									<tbody>
										{group.tokens.map((token) => (
											<tr key={token.variable} className="border-b border-edge-subtle last:border-0">
												<td className="px-3 py-2">
													<code className="font-mono text-xs text-fg">{token.variable}</code>
												</td>
												<td className="px-3 py-2">
													<code className="font-mono text-xs text-fg-muted">{token.utility}</code>
												</td>
												<td className="px-3 py-2 text-xs text-fg-muted">{token.role}</td>
												<td className="px-3 py-2">
													<div
														className="size-6 rounded border border-edge"
														style={{ backgroundColor: `var(${token.variable})` }}
													/>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					))}
				</div>
			</DocSection>

			{/* Built-in Palettes */}
			<DocSection id="palettes" title="Built-in Palettes">
				<p className="text-sm text-fg-muted mb-4">
					Three palettes ship with the kit. Use the palette switcher in the top bar to preview them live.
				</p>

				<div className="grid gap-4 sm:grid-cols-3">
					{[
						{
							name: "Slate",
							description: "Default flagship. Indigo accent with cool-toned surfaces.",
							mode: "Dark",
							accent: "var(--accent)",
							surface: "oklch(0.178 0.005 285)",
							selector: "html.dark (default)",
						},
						{
							name: "Corporate",
							description: "Navy accent with pure neutral surfaces. Notion/Stripe vibe.",
							mode: "Light",
							accent: "oklch(0.40 0.18 250)",
							surface: "oklch(1 0 0)",
							selector: 'html[data-theme="corporate"]',
						},
						{
							name: "Warm",
							description: "Amber accent with cream-tinted surfaces. Intercom/HelpScout vibe.",
							mode: "Light",
							accent: "oklch(0.55 0.17 70)",
							surface: "oklch(0.995 0.005 75)",
							selector: 'html[data-theme="warm"]',
						},
					].map((palette) => (
						<div key={palette.name} className="rounded-lg border border-edge p-4 space-y-3">
							<div className="flex items-center gap-2">
								<div
									className="size-4 rounded-full border border-edge"
									style={{ backgroundColor: palette.accent }}
								/>
								<h3 className="text-sm font-semibold text-fg">{palette.name}</h3>
								<span className="ml-auto text-[11px] text-fg-subtle">{palette.mode}</span>
							</div>
							<p className="text-xs text-fg-muted">{palette.description}</p>
							<code className="block text-[11px] font-mono text-fg-subtle">{palette.selector}</code>
						</div>
					))}
				</div>

				<div className="mt-6 space-y-4">
					<h3 className="text-sm font-semibold text-fg">Slate (default)</h3>
					<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">
						{slateCode}
					</pre>

					<h3 className="text-sm font-semibold text-fg">Corporate</h3>
					<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">
						{corporateCode}
					</pre>

					<h3 className="text-sm font-semibold text-fg">Warm</h3>
					<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">
						{warmCode}
					</pre>
				</div>
			</DocSection>

			{/* Create Your Own Theme */}
			<DocSection id="custom-theme" title="Create Your Own Theme">
				<div className="space-y-4">
					<p className="text-sm text-fg-muted">
						Creating a custom theme takes 3 steps. Copy an existing palette, adjust the oklch values, and activate it.
					</p>

					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-fg">Step 1 & 2: Define light and dark variants</h3>
						<p className="text-xs text-fg-muted">
							Add a new <code className="rounded bg-raised px-1 py-0.5 font-mono text-fg">html[data-theme="your-name"]</code> block
							in <code className="rounded bg-raised px-1 py-0.5 font-mono text-fg">globals.css</code>.
							Override all 13 color tokens for both light and dark.
						</p>
						<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">
							{customThemeCode}
						</pre>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-fg">Step 3: Activate</h3>
						<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">
							{activateCode}
						</pre>
					</div>

					<div className="rounded-lg border border-edge bg-raised/50 p-4">
						<p className="text-xs font-semibold text-fg mb-2">oklch Cheat Sheet</p>
						<div className="space-y-1 text-xs text-fg-muted font-mono">
							<p>oklch(<span className="text-fg">L</span> <span className="text-fg">C</span> <span className="text-fg">H</span>)</p>
							<p><span className="text-fg">L</span> = Lightness (0 = black, 1 = white)</p>
							<p><span className="text-fg">C</span> = Chroma (0 = grey, 0.4 = vivid)</p>
							<p><span className="text-fg">H</span> = Hue angle (0-360: 0=red, 70=amber, 145=green, 220=blue, 275=indigo)</p>
						</div>
						<p className="text-xs text-fg-subtle mt-3">
							Tip: Keep the same L values as an existing palette and only change H to shift the hue.
							This preserves contrast ratios and readability.
						</p>
					</div>
				</div>
			</DocSection>

			{/* Dark Mode */}
			<DocSection id="dark-mode" title="Dark Mode">
				<div className="space-y-4 text-sm text-fg-muted">
					<p>
						Dark mode is handled by <code className="rounded bg-raised px-1 py-0.5 font-mono text-xs text-fg">next-themes</code> via
						the <code className="rounded bg-raised px-1 py-0.5 font-mono text-xs text-fg">.dark</code> class on{" "}
						<code className="rounded bg-raised px-1 py-0.5 font-mono text-xs text-fg">&lt;html&gt;</code>.
					</p>
					<p>
						Each palette defines two blocks: a light set (on the bare selector) and a dark set
						(with <code className="rounded bg-raised px-1 py-0.5 font-mono text-xs text-fg">.dark</code>).
						The theme toggle switches the class, and all tokens update instantly.
					</p>
					<pre className="overflow-x-auto rounded-lg border border-edge bg-raised p-4 text-xs font-mono text-fg-muted leading-relaxed">{`/* Light */
html[data-theme="ocean"] {
  --bg-surface: oklch(0.995 0.002 220);
}

/* Dark — same selector + .dark class */
html[data-theme="ocean"].dark {
  --bg-surface: oklch(0.178 0.01 220);
}`}</pre>
				</div>
			</DocSection>

			{/* Density & Spacing */}
			<DocSection id="density" title="Density & Spacing">
				<div className="space-y-4">
					<p className="text-sm text-fg-muted">
						Spacing tokens control the density of data-heavy interfaces. Override these in your theme block to make the UI more compact or spacious.
					</p>
					<div className="overflow-x-auto rounded-lg border border-edge">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-edge bg-raised">
									<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">Variable</th>
									<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">Default</th>
									<th className="px-3 py-2 text-left text-xs font-medium text-fg-muted">Role</th>
								</tr>
							</thead>
							<tbody>
								{densityTokens.map((token) => (
									<tr key={token.variable} className="border-b border-edge-subtle last:border-0">
										<td className="px-3 py-2">
											<code className="font-mono text-xs text-fg">{token.variable}</code>
										</td>
										<td className="px-3 py-2">
											<code className="rounded bg-raised px-1.5 py-0.5 font-mono text-xs text-fg-muted">
												{token.default}
											</code>
										</td>
										<td className="px-3 py-2 text-xs text-fg-muted">{token.role}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</DocSection>
		</DocPage>
	)
}
