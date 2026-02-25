"use client"

import { Page } from "@blazz/ui/components/ui/page"

interface ColorToken {
	name: string
	cssVar: string
	utility: string
}

const surfaces: ColorToken[] = [
	{ name: "App", cssVar: "--bg-app", utility: "bg-[var(--bg-app)]" },
	{ name: "Surface", cssVar: "--bg-surface", utility: "bg-surface" },
	{ name: "Raised", cssVar: "--bg-raised", utility: "bg-raised" },
	{ name: "Overlay", cssVar: "--bg-overlay", utility: "bg-panel" },
]

const text: ColorToken[] = [
	{ name: "Primary", cssVar: "--text-primary", utility: "text-fg" },
	{ name: "Secondary", cssVar: "--text-secondary", utility: "text-fg-muted" },
	{ name: "Muted", cssVar: "--text-muted", utility: "text-fg-subtle" },
]

const borders: ColorToken[] = [
	{ name: "Default", cssVar: "--border-default", utility: "border-edge" },
	{ name: "Subtle", cssVar: "--border-subtle", utility: "border-edge-subtle" },
]

const accent: ColorToken[] = [
	{ name: "Accent", cssVar: "--accent", utility: "bg-brand" },
	{ name: "Accent Hover", cssVar: "--accent-hover", utility: "bg-brand-hover" },
	{ name: "Accent Foreground", cssVar: "--accent-foreground", utility: "text-brand-fg" },
]

const semantic: ColorToken[] = [
	{ name: "Success", cssVar: "--success", utility: "bg-positive" },
	{ name: "Warning", cssVar: "--warning", utility: "bg-caution" },
	{ name: "Destructive", cssVar: "--destructive", utility: "bg-negative" },
	{ name: "Info", cssVar: "--info", utility: "bg-inform" },
]

function ColorSwatch({ token }: { token: ColorToken }) {
	return (
		<div className="flex items-center gap-3">
			<div
				className="size-10 shrink-0 rounded-lg border border-edge"
				style={{ backgroundColor: `var(${token.cssVar})` }}
			/>
			<div className="min-w-0">
				<p className="text-sm font-medium text-fg">{token.name}</p>
				<p className="text-xs text-fg-subtle font-mono">{token.utility}</p>
			</div>
		</div>
	)
}

function ColorGroup({ title, description, tokens }: { title: string; description: string; tokens: ColorToken[] }) {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">{title}</h2>
				<p className="text-sm text-fg-muted">{description}</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{tokens.map((token) => (
					<ColorSwatch key={token.cssVar} token={token} />
				))}
			</div>
		</section>
	)
}

function SemanticPreview() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">Semantic Usage</h2>
				<p className="text-sm text-fg-muted">How semantic colors work in context.</p>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{[
					{ label: "Success", bg: "var(--success)", fg: "#fff" },
					{ label: "Warning", bg: "var(--warning)", fg: "#fff" },
					{ label: "Destructive", bg: "var(--destructive)", fg: "#fff" },
					{ label: "Info", bg: "var(--info)", fg: "#fff" },
				].map((item) => (
					<div
						key={item.label}
						className="flex h-20 items-center justify-center rounded-lg text-sm font-medium"
						style={{ backgroundColor: item.bg, color: item.fg }}
					>
						{item.label}
					</div>
				))}
			</div>
		</section>
	)
}

function SurfaceStack() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">Surface Hierarchy</h2>
				<p className="text-sm text-fg-muted">Layered surfaces create visual depth. Each level is slightly lighter/darker.</p>
			</div>
			<div
				className="rounded-xl p-6"
				style={{ backgroundColor: "var(--bg-app)" }}
			>
				<p className="text-xs font-mono text-fg-subtle mb-3">bg-app</p>
				<div
					className="rounded-lg p-5 border border-edge"
					style={{ backgroundColor: "var(--bg-surface)" }}
				>
					<p className="text-xs font-mono text-fg-subtle mb-3">bg-surface</p>
					<div
						className="rounded-md p-4"
						style={{ backgroundColor: "var(--bg-raised)" }}
					>
						<p className="text-xs font-mono text-fg-subtle mb-3">bg-raised</p>
						<div
							className="rounded-md p-3 border border-edge"
							style={{ backgroundColor: "var(--bg-overlay)" }}
						>
							<p className="text-xs font-mono text-fg-subtle">bg-overlay (panel)</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

function TextPreview() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">Text Hierarchy</h2>
				<p className="text-sm text-fg-muted">Three levels of text emphasis for content hierarchy.</p>
			</div>
			<div className="space-y-3 rounded-lg border border-edge bg-raised p-6">
				<p className="text-base text-fg font-medium">Primary text — headings, labels, key content</p>
				<p className="text-sm text-fg-muted">Secondary text — descriptions, supporting information</p>
				<p className="text-xs text-fg-subtle">Muted text — timestamps, metadata, disabled states</p>
			</div>
		</section>
	)
}

function AccentPreview() {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">Accent in Context</h2>
				<p className="text-sm text-fg-muted">The accent color for interactive elements and focus states.</p>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<button
					type="button"
					className="rounded-lg px-4 py-2 text-sm font-medium"
					style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}
				>
					Primary Action
				</button>
				<button
					type="button"
					className="rounded-lg px-4 py-2 text-sm font-medium"
					style={{ backgroundColor: "var(--accent-hover)", color: "var(--accent-foreground)" }}
				>
					Hover State
				</button>
				<span className="text-sm font-medium" style={{ color: "var(--accent)" }}>
					Accent as text link
				</span>
			</div>
		</section>
	)
}

export default function ColorsPage() {
	return (
		<Page
			title="Colors"
			subtitle="Design tokens for surfaces, text, borders, and semantic meaning. All colors use oklch for perceptual uniformity."
		>
			<div className="space-y-12">
				<ColorGroup
					title="Surfaces"
					description="Background layers that create visual depth and separation."
					tokens={surfaces}
				/>

				<SurfaceStack />

				<ColorGroup
					title="Text"
					description="Three levels of text emphasis for content hierarchy."
					tokens={text}
				/>

				<TextPreview />

				<ColorGroup
					title="Borders"
					description="Edge colors for containers and dividers."
					tokens={borders}
				/>

				<ColorGroup
					title="Accent / Brand"
					description="Primary interactive color for buttons, links, and focus rings."
					tokens={accent}
				/>

				<AccentPreview />

				<ColorGroup
					title="Semantic"
					description="Status colors that communicate meaning — success, warning, danger, info."
					tokens={semantic}
				/>

				<SemanticPreview />

				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-fg">Token Reference</h2>
					<p className="text-sm text-fg-muted">All design tokens are CSS custom properties defined in globals.css, mapped to Tailwind utilities via <code className="font-mono text-fg-subtle">@theme inline</code>.</p>
					<div className="overflow-x-auto rounded-lg border border-edge">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-edge bg-raised">
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Token</th>
									<th className="px-4 py-2 text-left font-medium text-fg-muted">CSS Variable</th>
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Tailwind</th>
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Swatch</th>
								</tr>
							</thead>
							<tbody>
								{[...surfaces, ...text, ...borders, ...accent, ...semantic].map((token) => (
									<tr key={token.cssVar} className="border-b border-edge-subtle">
										<td className="px-4 py-2 text-fg">{token.name}</td>
										<td className="px-4 py-2 font-mono text-fg-subtle">{token.cssVar}</td>
										<td className="px-4 py-2 font-mono text-fg-subtle">{token.utility}</td>
										<td className="px-4 py-2">
											<div
												className="size-6 rounded border border-edge"
												style={{ backgroundColor: `var(${token.cssVar})` }}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</Page>
	)
}
