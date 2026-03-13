import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { Check, CircleAlert, Crown, Mail, Shield, Star, Tag, X, XIcon, Zap } from "lucide-react"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "variants",
		code: `<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="critical">Critical</Badge>
<Badge variant="outline">Outline</Badge>`,
	},
	{
		key: "fill",
		code: `// Solid (default)
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="critical">Critical</Badge>

// Subtle
<Badge variant="info" fill="subtle">Info</Badge>
<Badge variant="success" fill="subtle">Success</Badge>
<Badge variant="warning" fill="subtle">Warning</Badge>
<Badge variant="critical" fill="subtle">Critical</Badge>`,
	},
	{
		key: "sizes",
		code: `<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`,
	},
	{
		key: "with-dot",
		code: `<Badge variant="success" fill="subtle" dot>Online</Badge>
<Badge variant="warning" fill="subtle" dot>Away</Badge>
<Badge variant="secondary" fill="subtle" dot>Offline</Badge>
<Badge variant="critical" fill="subtle" dot>Busy</Badge>
<Badge variant="outline" dot>Unknown</Badge>`,
	},
	{
		key: "dot-solid",
		code: `<Badge variant="success" dot>Active</Badge>
<Badge variant="info" dot>Syncing</Badge>
<Badge variant="critical" dot>Error</Badge>`,
	},
	{
		key: "with-icons",
		code: `<Badge><Check /> Approved</Badge>
<Badge variant="critical"><X /> Rejected</Badge>
<Badge variant="info"><Zap /> Fast</Badge>
<Badge variant="warning"><CircleAlert /> Attention</Badge>
<Badge variant="success" fill="subtle"><Shield /> Secure</Badge>`,
	},
	{
		key: "icon-only",
		code: `<Badge><Check /></Badge>
<Badge variant="critical"><X /></Badge>
<Badge variant="info"><Star /></Badge>
<Badge variant="warning"><CircleAlert /></Badge>`,
	},
	{
		key: "dismissable",
		code: `const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"])

{tags.map((tag) => (
  <Badge
    key={tag}
    variant="secondary"
    fill="subtle"
    onDismiss={() => setTags(t => t.filter(v => v !== tag))}
  >
    {tag}
  </Badge>
))}`,
	},
	{
		key: "dismissable-variants",
		code: `<Badge variant="default" onDismiss={() => {}}>Default</Badge>
<Badge variant="info" fill="subtle" onDismiss={() => {}}>Info</Badge>
<Badge variant="success" onDismiss={() => {}}>Success</Badge>
<Badge variant="outline" onDismiss={() => {}}>Outline</Badge>`,
	},
	{
		key: "counts",
		code: `<Badge>3</Badge>
<Badge variant="info">99+</Badge>
<Badge variant="critical">5</Badge>`,
	},
	{
		key: "status",
		code: `<Badge variant="success" fill="subtle" dot>Active</Badge>
<Badge variant="info" fill="subtle" dot>Pending</Badge>
<Badge variant="warning" fill="subtle" dot>Review</Badge>
<Badge variant="critical" fill="subtle" dot>Cancelled</Badge>
<Badge variant="outline" dot>Draft</Badge>`,
	},
	{
		key: "filter-bar",
		code: `<Badge variant="secondary" fill="subtle" onDismiss={() => {}}>
  <Tag /> Catégorie: SaaS
</Badge>
<Badge variant="info" fill="subtle" onDismiss={() => {}}>
  <Mail /> Assigné: Jean
</Badge>
<Badge variant="success" fill="subtle" dot onDismiss={() => {}}>
  Statut: Actif
</Badge>`,
	},
	{
		key: "user-roles",
		code: `<Badge variant="default"><Crown /> Admin</Badge>
<Badge variant="info"><Shield /> Moderator</Badge>
<Badge variant="secondary">Member</Badge>
<Badge variant="outline">Guest</Badge>`,
	},
	{
		key: "with-avatar",
		code: `<Badge variant="outline" size="md">
  <Avatar className="size-3.5">
    <AvatarImage src="..." />
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
  Alex
  <Button variant="ghost" size="icon" className="size-3 hover:bg-transparent">
    <XIcon />
  </Button>
</Badge>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/badge")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: BadgePage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const badgeProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "secondary" | "info" | "success" | "warning" | "critical" | "outline"',
		default: '"default"',
		description: "The semantic color variant.",
	},
	{
		name: "size",
		type: '"xs" | "sm" | "md"',
		default: '"sm"',
		description: "The size of the badge.",
	},
	{
		name: "fill",
		type: '"solid" | "subtle"',
		default: '"solid"',
		description: "Solid fills the background, subtle uses a tinted background with colored text.",
	},
	{
		name: "dot",
		type: "boolean",
		default: "false",
		description: "Show a small colored dot before the content.",
	},
	{
		name: "onDismiss",
		type: "() => void",
		description: "When provided, shows a close button and calls this function on click.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content of the badge.",
	},
]

/* ── Inline demo for Dismissable example ── */
function DismissableDemo() {
	const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Next.js"])

	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<Badge
					key={tag}
					variant="secondary"
					fill="subtle"
					onDismiss={() => setTags((t) => t.filter((v) => v !== tag))}
				>
					{tag}
				</Badge>
			))}
			{tags.length === 0 && (
				<button
					type="button"
					className="text-xs text-fg-muted hover:text-fg transition-colors"
					onClick={() => setTags(["React", "TypeScript", "Tailwind", "Next.js"])}
				>
					Reset tags
				</button>
			)}
		</div>
	)
}

function BadgePage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/ui/badge" })

	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Badge"
			subtitle="Small status indicators for labeling, categorizing, or showing counts."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="default">Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="info">Info</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="critical">Critical</Badge>
					<Badge variant="outline">Outline</Badge>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				{/* Variants */}
				<DocExampleClient
					title="Variants"
					description="Seven semantic variants for different contexts."
					code={examples[0].code}
					highlightedCode={html("variants")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default">Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="info">Info</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="critical">Critical</Badge>
						<Badge variant="outline">Outline</Badge>
					</div>
				</DocExampleClient>

				{/* Fill: Solid vs Subtle */}
				<DocExampleClient
					title="Fill: Solid vs Subtle"
					description="Solid fills the background with the full color. Subtle uses a tinted background with colored text and a light border."
					code={examples[1].code}
					highlightedCode={html("fill")}
				>
					<div className="flex flex-col gap-3">
						<div className="flex flex-wrap gap-2">
							<span className="w-12 text-xs text-fg-muted self-center">Solid</span>
							<Badge variant="default">Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="info">Info</Badge>
							<Badge variant="success">Success</Badge>
							<Badge variant="warning">Warning</Badge>
							<Badge variant="critical">Critical</Badge>
						</div>
						<div className="flex flex-wrap gap-2">
							<span className="w-12 text-xs text-fg-muted self-center">Subtle</span>
							<Badge variant="default" fill="subtle">
								Default
							</Badge>
							<Badge variant="secondary" fill="subtle">
								Secondary
							</Badge>
							<Badge variant="info" fill="subtle">
								Info
							</Badge>
							<Badge variant="success" fill="subtle">
								Success
							</Badge>
							<Badge variant="warning" fill="subtle">
								Warning
							</Badge>
							<Badge variant="critical" fill="subtle">
								Critical
							</Badge>
						</div>
					</div>
				</DocExampleClient>

				{/* Sizes */}
				<DocExampleClient
					title="Sizes"
					description="Three sizes to fit different contexts -- xs for inline labels, sm for general use, md for emphasis."
					code={examples[2].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex items-center gap-2">
						<Badge size="xs">Extra Small</Badge>
						<Badge size="sm">Small</Badge>
						<Badge size="md">Medium</Badge>
					</div>
				</DocExampleClient>

				{/* With Dot */}
				<DocExampleClient
					title="With Dot"
					description="A small colored dot before the text, ideal for status indicators."
					code={examples[3].code}
					highlightedCode={html("with-dot")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" fill="subtle" dot>
							Online
						</Badge>
						<Badge variant="warning" fill="subtle" dot>
							Away
						</Badge>
						<Badge variant="secondary" fill="subtle" dot>
							Offline
						</Badge>
						<Badge variant="critical" fill="subtle" dot>
							Busy
						</Badge>
						<Badge variant="outline" dot>
							Unknown
						</Badge>
					</div>
				</DocExampleClient>

				{/* Dot + Solid Fill */}
				<DocExampleClient
					title="Dot + Solid Fill"
					description="Dots work with both fill modes."
					code={examples[4].code}
					highlightedCode={html("dot-solid")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" dot>
							Active
						</Badge>
						<Badge variant="info" dot>
							Syncing
						</Badge>
						<Badge variant="critical" dot>
							Error
						</Badge>
					</div>
				</DocExampleClient>

				{/* With Icons */}
				<DocExampleClient
					title="With Icons"
					description="Pass icons as children for additional visual context. Icons are automatically sized to match the badge."
					code={examples[5].code}
					highlightedCode={html("with-icons")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge>
							<Check /> Approved
						</Badge>
						<Badge variant="critical">
							<X /> Rejected
						</Badge>
						<Badge variant="info">
							<Zap /> Fast
						</Badge>
						<Badge variant="warning">
							<CircleAlert /> Attention
						</Badge>
						<Badge variant="success" fill="subtle">
							<Shield /> Secure
						</Badge>
					</div>
				</DocExampleClient>

				{/* Icon Only */}
				<DocExampleClient
					title="Icon Only"
					description="Compact icon-only badges for tight spaces."
					code={examples[6].code}
					highlightedCode={html("icon-only")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge>
							<Check />
						</Badge>
						<Badge variant="critical">
							<X />
						</Badge>
						<Badge variant="info">
							<Star />
						</Badge>
						<Badge variant="warning">
							<CircleAlert />
						</Badge>
					</div>
				</DocExampleClient>

				{/* Dismissable */}
				<DocExampleClient
					title="Dismissable"
					description="Add onDismiss to show a close button. Ideal for filter tags, selected items, or removable labels."
					code={examples[7].code}
					highlightedCode={html("dismissable")}
				>
					<DismissableDemo />
				</DocExampleClient>

				{/* Dismissable + Variants */}
				<DocExampleClient
					title="Dismissable + Variants"
					description="Close buttons work with all variants and fills."
					code={examples[8].code}
					highlightedCode={html("dismissable-variants")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default" onDismiss={() => {}}>
							Default
						</Badge>
						<Badge variant="info" fill="subtle" onDismiss={() => {}}>
							Info
						</Badge>
						<Badge variant="success" onDismiss={() => {}}>
							Success
						</Badge>
						<Badge variant="outline" onDismiss={() => {}}>
							Outline
						</Badge>
					</div>
				</DocExampleClient>

				{/* Counts */}
				<DocExampleClient
					title="Counts"
					description="Display notification counts or quantities."
					code={examples[9].code}
					highlightedCode={html("counts")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge>3</Badge>
						<Badge variant="info">99+</Badge>
						<Badge variant="critical">5</Badge>
					</div>
				</DocExampleClient>

				{/* Status Indicators */}
				<DocExampleClient
					title="Status Indicators"
					description="Combine dot, fill, and variants for a complete status system."
					code={examples[10].code}
					highlightedCode={html("status")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" fill="subtle" dot>
							Active
						</Badge>
						<Badge variant="info" fill="subtle" dot>
							Pending
						</Badge>
						<Badge variant="warning" fill="subtle" dot>
							Review
						</Badge>
						<Badge variant="critical" fill="subtle" dot>
							Cancelled
						</Badge>
						<Badge variant="outline" dot>
							Draft
						</Badge>
					</div>
				</DocExampleClient>

				{/* Composition: Filter Bar */}
				<DocExampleClient
					title="Composition: Filter Bar"
					description="Real-world pattern combining icons, dismiss, and variants for an active filter display."
					code={examples[11].code}
					highlightedCode={html("filter-bar")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary" fill="subtle" onDismiss={() => {}}>
							<Tag /> Catégorie: SaaS
						</Badge>
						<Badge variant="info" fill="subtle" onDismiss={() => {}}>
							<Mail /> Assigné: Jean
						</Badge>
						<Badge variant="success" fill="subtle" dot onDismiss={() => {}}>
							Statut: Actif
						</Badge>
					</div>
				</DocExampleClient>

				{/* Composition: User Roles */}
				<DocExampleClient
					title="Composition: User Roles"
					description="Icon badges for role indicators."
					code={examples[12].code}
					highlightedCode={html("user-roles")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default">
							<Crown /> Admin
						</Badge>
						<Badge variant="info">
							<Shield /> Moderator
						</Badge>
						<Badge variant="secondary">Member</Badge>
						<Badge variant="outline">Guest</Badge>
					</div>
				</DocExampleClient>

				{/* Composition: With Avatar */}
				<DocExampleClient
					title="Composition: With Avatar"
					description="Combine with Avatar for user tags -- ideal for assignees, mentions, or collaborator lists."
					code={examples[13].code}
					highlightedCode={html("with-avatar")}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="outline" size="md">
							<Avatar className="size-3.5">
								<AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80" />
								<AvatarFallback>AL</AvatarFallback>
							</Avatar>
							Alex
							<Button variant="ghost" size="icon" className="size-3 hover:bg-transparent">
								<XIcon />
							</Button>
						</Badge>
						<Badge variant="outline" size="md">
							<Avatar className="size-3.5">
								<AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80" />
								<AvatarFallback>SC</AvatarFallback>
							</Avatar>
							Sarah
							<Button variant="ghost" size="icon" className="size-3 hover:bg-transparent">
								<XIcon />
							</Button>
						</Badge>
						<Badge variant="outline" size="md">
							<Avatar className="size-3.5">
								<AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=96&h=96&dpr=2&q=80" />
								<AvatarFallback>MK</AvatarFallback>
							</Avatar>
							Marc
						</Badge>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={badgeProps} />
				<div className="space-y-4">
					<h3 className="text-sm font-semibold text-fg">Configuration</h3>
					<p className="text-sm text-fg-muted">
						The badge border radius is configured globally via a CSS variable. Change it once in
						your globals.css and all badges follow.
					</p>
					<div className="rounded-lg border border-edge-subtle bg-raised p-4">
						<pre className="text-xs text-fg-muted">
							{`/* globals.css */
--badge-radius: 9999px;           /* pill (default) */
--badge-radius: var(--radius-md);  /* rounded corners */
--badge-radius: 0px;              /* square */`}
						</pre>
					</div>
				</div>
			</DocSection>

			{/* Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Badge uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">--badge-radius</code> - Global border radius for all badges
					</li>
					<li>
						<code className="text-xs">bg-brand / text-brand-fg</code> - Default variant
					</li>
					<li>
						<code className="text-xs">bg-raised / text-fg-muted</code> - Secondary variant
					</li>
					<li>
						<code className="text-xs">bg-inform</code> - Info variant
					</li>
					<li>
						<code className="text-xs">bg-positive</code> - Success variant
					</li>
					<li>
						<code className="text-xs">bg-caution</code> - Warning variant
					</li>
					<li>
						<code className="text-xs">bg-negative</code> - Critical variant
					</li>
				</ul>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Keep badge text short and concise</li>
					<li>
						Use <strong>solid</strong> for high-emphasis badges (calls to action, key statuses)
					</li>
					<li>
						Use <strong>subtle</strong> for low-emphasis badges in dense UIs (tables, lists)
					</li>
					<li>
						Use <strong>dot</strong> for presence/connection status indicators
					</li>
					<li>
						Use <strong>onDismiss</strong> for removable tags and active filters
					</li>
					<li>Use consistent colors for the same status across the app</li>
					<li>Use xs size when pairing with small text (names, inline labels)</li>
					<li>
						Configure <code className="text-xs">--badge-radius</code> once to match your design
						language
					</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Avatar",
							href: "/docs/components/ui/avatar",
							description: "User profile images that pair well with badges.",
						},
						{
							title: "Button",
							href: "/docs/components/ui/button",
							description: "Actions that can include badge counters.",
						},
						{
							title: "Data Table",
							href: "/docs/components/ui/data-table",
							description: "Tables with status badge columns.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
