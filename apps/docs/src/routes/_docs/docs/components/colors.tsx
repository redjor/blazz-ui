import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute } from "@tanstack/react-router"
import { CategoryPageHero } from "~/components/docs/component-card"

export const Route = createFileRoute("/_docs/docs/components/colors")({
	component: ColorsPage,
})

interface ColorToken {
	name: string
	cssVar: string
	utility: string
}

const surfaces: ColorToken[] = [
	{ name: "Nav Shell", cssVar: "--surface-0", utility: "bg-surface-0" },
	{ name: "Main Area", cssVar: "--surface-1", utility: "bg-surface-1" },
	{ name: "Card", cssVar: "--surface-2", utility: "bg-surface-2" },
	{ name: "Inset", cssVar: "--surface-3", utility: "bg-surface-3" },
	{ name: "Overlay", cssVar: "--surface-4", utility: "bg-surface-4" },
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

function ColorGroup({
	title,
	description,
	tokens,
}: {
	title: string
	description: string
	tokens: ColorToken[]
}) {
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
				<p className="text-sm text-fg-muted">
					5 levels of visual importance. Lower = more recessive (navigation), higher = more
					prominent (content).
				</p>
			</div>
			<div className="rounded-xl p-6" style={{ backgroundColor: "var(--surface-0)" }}>
				<p className="text-xs font-mono text-fg-subtle mb-3">surface-0 — nav shell</p>
				<div className="rounded-lg p-5" style={{ backgroundColor: "var(--surface-1)" }}>
					<p className="text-xs font-mono text-fg-subtle mb-3">surface-1 — main area</p>
					<div
						className="rounded-lg p-5 border border-edge"
						style={{ backgroundColor: "var(--surface-2)" }}
					>
						<p className="text-xs font-mono text-fg-subtle mb-3">surface-2 — card</p>
						<div className="rounded-md p-4" style={{ backgroundColor: "var(--surface-3)" }}>
							<p className="text-xs font-mono text-fg-subtle mb-3">surface-3 — inset</p>
							<div
								className="rounded-md p-3 border border-edge"
								style={{ backgroundColor: "var(--surface-4)" }}
							>
								<p className="text-xs font-mono text-fg-subtle">surface-4 — overlay</p>
							</div>
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
				<p className="text-sm text-fg-muted">
					Three levels of text emphasis for content hierarchy.
				</p>
			</div>
			<div className="space-y-3 rounded-lg border border-edge bg-surface-3 p-6">
				<p className="text-base text-fg font-medium">
					Primary text — headings, labels, key content
				</p>
				<p className="text-sm text-fg-muted">
					Secondary text — descriptions, supporting information
				</p>
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
				<p className="text-sm text-fg-muted">
					The accent color for interactive elements and focus states.
				</p>
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

function ColorsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Colors"
				description="Design tokens for surfaces, text, borders, and semantic meaning. All colors use oklch for perceptual uniformity."
			/>
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
					<p className="text-sm text-fg-muted">
						All design tokens are CSS custom properties defined in globals.css, mapped to Tailwind
						utilities via <code className="font-mono text-fg-subtle">@theme inline</code>.
					</p>
					<div className="overflow-x-auto rounded-lg border border-edge">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-edge bg-surface-3">
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
				<section className="space-y-4">
					<h2 className="text-lg font-semibold text-fg">Theming</h2>
					<p className="text-sm text-fg-muted">
						The surface scale is generated from just 2 values per theme using{" "}
						<code className="font-mono text-fg-subtle">color-mix(in oklch)</code>. To create a
						custom theme, override <code className="font-mono text-fg-subtle">--surface-base</code>{" "}
						(most recessive) and <code className="font-mono text-fg-subtle">--surface-top</code>{" "}
						(most prominent). The 3 intermediate levels are computed automatically.
					</p>
					<div className="rounded-lg border border-edge bg-surface-3 p-6 space-y-4">
						<p className="text-xs font-mono text-fg-subtle">
							{"/* Custom theme — 2 values only */"}
						</p>
						<pre className="text-sm font-mono text-fg whitespace-pre overflow-x-auto">
							{`html[data-theme="ocean"] {
  --surface-base: oklch(0.93 0.02 230);
  --surface-top:  oklch(0.99 0.01 230);
}

html[data-theme="ocean"].dark {
  --surface-base: oklch(0.14 0.02 230);
  --surface-top:  oklch(0.28 0.02 230);
}`}
						</pre>
					</div>
					<div className="rounded-lg border border-edge overflow-hidden">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-edge bg-surface-3">
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Level</th>
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Mix</th>
									<th className="px-4 py-2 text-left font-medium text-fg-muted">Role</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ level: "surface-0", mix: "base (100%)", role: "Sidebar, topbar" },
									{ level: "surface-1", mix: "75% base / 25% top", role: "Main area background" },
									{ level: "surface-2", mix: "50% / 50%", role: "Card, section, panel" },
									{ level: "surface-3", mix: "25% base / 75% top", role: "Nested element, table" },
									{ level: "surface-4", mix: "top (100%)", role: "Overlay, deep nesting" },
								].map((row) => (
									<tr key={row.level} className="border-b border-edge-subtle">
										<td className="px-4 py-2 font-mono text-fg">{row.level}</td>
										<td className="px-4 py-2 font-mono text-fg-subtle">{row.mix}</td>
										<td className="px-4 py-2 text-fg-muted">{row.role}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="text-sm text-fg-muted">
						All other tokens (accent, text, borders, semantic) can be overridden independently in
						the same theme block.
					</p>
				</section>
			</div>
		</Page>
	)
}
