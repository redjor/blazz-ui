import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { Check, X, XIcon, Star, Zap, Crown, Shield, CircleAlert, Mail, Tag } from "lucide-react"
import { DismissableDemo } from "./_demos"

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

export default function BadgePage() {
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
				{/* ── Variants ── */}
				<DocExample
					title="Variants"
					description="Seven semantic variants for different contexts."
					code={`<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="critical">Critical</Badge>
<Badge variant="outline">Outline</Badge>`}
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
				</DocExample>

				{/* ── Fill: Solid vs Subtle ── */}
				<DocExample
					title="Fill: Solid vs Subtle"
					description="Solid fills the background with the full color. Subtle uses a tinted background with colored text and a light border."
					code={`// Solid (default)
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="critical">Critical</Badge>

// Subtle
<Badge variant="info" fill="subtle">Info</Badge>
<Badge variant="success" fill="subtle">Success</Badge>
<Badge variant="warning" fill="subtle">Warning</Badge>
<Badge variant="critical" fill="subtle">Critical</Badge>`}
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
							<Badge variant="default" fill="subtle">Default</Badge>
							<Badge variant="secondary" fill="subtle">Secondary</Badge>
							<Badge variant="info" fill="subtle">Info</Badge>
							<Badge variant="success" fill="subtle">Success</Badge>
							<Badge variant="warning" fill="subtle">Warning</Badge>
							<Badge variant="critical" fill="subtle">Critical</Badge>
						</div>
					</div>
				</DocExample>

				{/* ── Sizes ── */}
				<DocExample
					title="Sizes"
					description="Three sizes to fit different contexts — xs for inline labels, sm for general use, md for emphasis."
					code={`<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}
				>
					<div className="flex items-center gap-2">
						<Badge size="xs">Extra Small</Badge>
						<Badge size="sm">Small</Badge>
						<Badge size="md">Medium</Badge>
					</div>
				</DocExample>

				{/* ── With Dot ── */}
				<DocExample
					title="With Dot"
					description="A small colored dot before the text, ideal for status indicators."
					code={`<Badge variant="success" fill="subtle" dot>Online</Badge>
<Badge variant="warning" fill="subtle" dot>Away</Badge>
<Badge variant="secondary" fill="subtle" dot>Offline</Badge>
<Badge variant="critical" fill="subtle" dot>Busy</Badge>
<Badge variant="outline" dot>Unknown</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" fill="subtle" dot>Online</Badge>
						<Badge variant="warning" fill="subtle" dot>Away</Badge>
						<Badge variant="secondary" fill="subtle" dot>Offline</Badge>
						<Badge variant="critical" fill="subtle" dot>Busy</Badge>
						<Badge variant="outline" dot>Unknown</Badge>
					</div>
				</DocExample>

				{/* ── With Dot Solid ── */}
				<DocExample
					title="Dot + Solid Fill"
					description="Dots work with both fill modes."
					code={`<Badge variant="success" dot>Active</Badge>
<Badge variant="info" dot>Syncing</Badge>
<Badge variant="critical" dot>Error</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" dot>Active</Badge>
						<Badge variant="info" dot>Syncing</Badge>
						<Badge variant="critical" dot>Error</Badge>
					</div>
				</DocExample>

				{/* ── With Icons ── */}
				<DocExample
					title="With Icons"
					description="Pass icons as children for additional visual context. Icons are automatically sized to match the badge."
					code={`<Badge><Check /> Approved</Badge>
<Badge variant="critical"><X /> Rejected</Badge>
<Badge variant="info"><Zap /> Fast</Badge>
<Badge variant="warning"><CircleAlert /> Attention</Badge>
<Badge variant="success" fill="subtle"><Shield /> Secure</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge><Check /> Approved</Badge>
						<Badge variant="critical"><X /> Rejected</Badge>
						<Badge variant="info"><Zap /> Fast</Badge>
						<Badge variant="warning"><CircleAlert /> Attention</Badge>
						<Badge variant="success" fill="subtle"><Shield /> Secure</Badge>
					</div>
				</DocExample>

				{/* ── Icon Only ── */}
				<DocExample
					title="Icon Only"
					description="Compact icon-only badges for tight spaces."
					code={`<Badge><Check /></Badge>
<Badge variant="critical"><X /></Badge>
<Badge variant="info"><Star /></Badge>
<Badge variant="warning"><CircleAlert /></Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge><Check /></Badge>
						<Badge variant="critical"><X /></Badge>
						<Badge variant="info"><Star /></Badge>
						<Badge variant="warning"><CircleAlert /></Badge>
					</div>
				</DocExample>

				{/* ── Dismissable ── */}
				<DocExample
					title="Dismissable"
					description="Add onDismiss to show a close button. Ideal for filter tags, selected items, or removable labels."
					code={`const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"])

{tags.map((tag) => (
  <Badge
    key={tag}
    variant="secondary"
    fill="subtle"
    onDismiss={() => setTags(t => t.filter(v => v !== tag))}
  >
    {tag}
  </Badge>
))}`}
				>
					<DismissableDemo />
				</DocExample>

				{/* ── Dismissable Variants ── */}
				<DocExample
					title="Dismissable + Variants"
					description="Close buttons work with all variants and fills."
					code={`<Badge variant="default" onDismiss={() => {}}>Default</Badge>
<Badge variant="info" fill="subtle" onDismiss={() => {}}>Info</Badge>
<Badge variant="success" onDismiss={() => {}}>Success</Badge>
<Badge variant="outline" onDismiss={() => {}}>Outline</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default" onDismiss={() => {}}>Default</Badge>
						<Badge variant="info" fill="subtle" onDismiss={() => {}}>Info</Badge>
						<Badge variant="success" onDismiss={() => {}}>Success</Badge>
						<Badge variant="outline" onDismiss={() => {}}>Outline</Badge>
					</div>
				</DocExample>

				{/* ── Counts ── */}
				<DocExample
					title="Counts"
					description="Display notification counts or quantities."
					code={`<Badge>3</Badge>
<Badge variant="info">99+</Badge>
<Badge variant="critical">5</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge>3</Badge>
						<Badge variant="info">99+</Badge>
						<Badge variant="critical">5</Badge>
					</div>
				</DocExample>

				{/* ── Status Indicators ── */}
				<DocExample
					title="Status Indicators"
					description="Combine dot, fill, and variants for a complete status system."
					code={`<Badge variant="success" fill="subtle" dot>Active</Badge>
<Badge variant="info" fill="subtle" dot>Pending</Badge>
<Badge variant="warning" fill="subtle" dot>Review</Badge>
<Badge variant="critical" fill="subtle" dot>Cancelled</Badge>
<Badge variant="outline" dot>Draft</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="success" fill="subtle" dot>Active</Badge>
						<Badge variant="info" fill="subtle" dot>Pending</Badge>
						<Badge variant="warning" fill="subtle" dot>Review</Badge>
						<Badge variant="critical" fill="subtle" dot>Cancelled</Badge>
						<Badge variant="outline" dot>Draft</Badge>
					</div>
				</DocExample>

				{/* ── Composition: Filter Bar ── */}
				<DocExample
					title="Composition: Filter Bar"
					description="Real-world pattern combining icons, dismiss, and variants for an active filter display."
					code={`<Badge variant="secondary" fill="subtle" onDismiss={() => {}}>
  <Tag /> Catégorie: SaaS
</Badge>
<Badge variant="info" fill="subtle" onDismiss={() => {}}>
  <Mail /> Assigné: Jean
</Badge>
<Badge variant="success" fill="subtle" dot onDismiss={() => {}}>
  Statut: Actif
</Badge>`}
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
				</DocExample>

				{/* ── Composition: User Roles ── */}
				<DocExample
					title="Composition: User Roles"
					description="Icon badges for role indicators."
					code={`<Badge variant="default"><Crown /> Admin</Badge>
<Badge variant="info"><Shield /> Moderator</Badge>
<Badge variant="secondary">Member</Badge>
<Badge variant="outline">Guest</Badge>`}
				>
					<div className="flex flex-wrap gap-2">
						<Badge variant="default"><Crown /> Admin</Badge>
						<Badge variant="info"><Shield /> Moderator</Badge>
						<Badge variant="secondary">Member</Badge>
						<Badge variant="outline">Guest</Badge>
					</div>
				</DocExample>

				{/* ── Composition: With Avatar ── */}
				<DocExample
					title="Composition: With Avatar"
					description="Combine with Avatar for user tags — ideal for assignees, mentions, or collaborator lists."
					code={`<Badge variant="outline" size="md">
  <Avatar className="size-3.5">
    <AvatarImage src="..." />
    <AvatarFallback>AL</AvatarFallback>
  </Avatar>
  Alex
  <Button variant="ghost" size="icon" className="size-3 hover:bg-transparent">
    <XIcon />
  </Button>
</Badge>`}
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
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={badgeProps} />
				<div className="space-y-4">
					<h3 className="text-sm font-semibold text-fg">Configuration</h3>
					<p className="text-sm text-fg-muted">
						The badge border radius is configured globally via a CSS variable. Change it once in your globals.css and all badges follow.
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
					<li><code className="text-xs">--badge-radius</code> - Global border radius for all badges</li>
					<li><code className="text-xs">bg-brand / text-brand-fg</code> - Default variant</li>
					<li><code className="text-xs">bg-raised / text-fg-muted</code> - Secondary variant</li>
					<li><code className="text-xs">bg-inform</code> - Info variant</li>
					<li><code className="text-xs">bg-positive</code> - Success variant</li>
					<li><code className="text-xs">bg-caution</code> - Warning variant</li>
					<li><code className="text-xs">bg-negative</code> - Critical variant</li>
				</ul>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Keep badge text short and concise</li>
					<li>Use <strong>solid</strong> for high-emphasis badges (calls to action, key statuses)</li>
					<li>Use <strong>subtle</strong> for low-emphasis badges in dense UIs (tables, lists)</li>
					<li>Use <strong>dot</strong> for presence/connection status indicators</li>
					<li>Use <strong>onDismiss</strong> for removable tags and active filters</li>
					<li>Use consistent colors for the same status across the app</li>
					<li>Use xs size when pairing with small text (names, inline labels)</li>
					<li>Configure <code className="text-xs">--badge-radius</code> once to match your design language</li>
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
