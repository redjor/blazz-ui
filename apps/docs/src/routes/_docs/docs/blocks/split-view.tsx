import { SplitView } from "@blazz/ui/components/blocks/split-view"
import { createFileRoute } from "@tanstack/react-router"
import { Building2, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "split-view-props", title: "SplitView Props" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

interface Contact {
	id: string
	name: string
	role: string
	company: string
	email: string
	phone: string
	city: string
}

const contacts: Contact[] = [
	{
		id: "1",
		name: "Marie Dupont",
		role: "Directrice technique",
		company: "Nextera Solutions",
		email: "m.dupont@nextera.fr",
		phone: "+33 1 42 68 55 00",
		city: "Paris",
	},
	{
		id: "2",
		name: "Thomas Bernard",
		role: "Chef de projet",
		company: "Groupe Artémis",
		email: "t.bernard@artemis.fr",
		phone: "+33 4 91 22 33 44",
		city: "Marseille",
	},
	{
		id: "3",
		name: "Sophie Lemaire",
		role: "Responsable produit",
		company: "Atelier Numérique",
		email: "s.lemaire@atelier-num.fr",
		phone: "+33 1 55 12 78 90",
		city: "Lyon",
	},
	{
		id: "4",
		name: "Nicolas Moreau",
		role: "Lead developer",
		company: "DevFactory",
		email: "n.moreau@devfactory.io",
		phone: "+33 6 12 34 56 78",
		city: "Bordeaux",
	},
	{
		id: "5",
		name: "Claire Martin",
		role: "DRH",
		company: "TalentFlow",
		email: "c.martin@talentflow.fr",
		phone: "+33 1 40 20 10 05",
		city: "Paris",
	},
	{
		id: "6",
		name: "Julien Petit",
		role: "Architecte logiciel",
		company: "CloudScale",
		email: "j.petit@cloudscale.io",
		phone: "+33 6 98 76 54 32",
		city: "Toulouse",
	},
]

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const splitViewProps: DocProp[] = [
	{
		name: "master",
		type: "React.ReactNode",
		description: "Content rendered in the left (master) panel.",
	},
	{
		name: "detail",
		type: "React.ReactNode",
		description: "Content rendered in the right (detail) panel.",
	},
	{
		name: "emptyDetail",
		type: "React.ReactNode",
		description: "Fallback content shown when detail is empty/falsy.",
	},
	{
		name: "defaultRatio",
		type: "number",
		default: "0.4",
		description: "Initial width ratio of the master panel (0 to 1).",
	},
	{
		name: "minRatio",
		type: "number",
		default: "0.25",
		description: "Minimum width ratio the master panel can be resized to.",
	},
	{
		name: "maxRatio",
		type: "number",
		default: "0.6",
		description: "Maximum width ratio the master panel can be resized to.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the outer container.",
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `const [selected, setSelected] = useState<string | null>(null)

<SplitView
  master={
    <ul>
      {contacts.map((c) => (
        <li key={c.id} onClick={() => setSelected(c.id)}>
          <p className="font-medium">{c.name}</p>
          <p className="text-fg-muted">{c.company}</p>
        </li>
      ))}
    </ul>
  }
  detail={
    selected ? (
      <div className="p-6">
        <h2>{selectedContact.name}</h2>
        <p>{selectedContact.role}</p>
      </div>
    ) : null
  }
  emptyDetail={
    <div className="flex h-full items-center justify-center text-fg-muted">
      Sélectionnez un contact
    </div>
  }
/>`,
	},
	{
		key: "empty-state",
		code: `<SplitView
  master={<div className="p-4 text-sm text-fg-muted">Liste vide</div>}
  detail={null}
  emptyDetail={
    <div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
      <Users className="size-8 opacity-50" />
      <p>Aucun élément sélectionné</p>
    </div>
  }
/>`,
	},
	{
		key: "custom-ratio",
		code: `<SplitView
  defaultRatio={0.3}
  minRatio={0.2}
  maxRatio={0.5}
  master={<nav>...</nav>}
  detail={<main>...</main>}
/>`,
	},
] as const

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_docs/docs/blocks/split-view")({
	loader: async () => {
		const highlighted = await Promise.all(
			[...examples].map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: SplitViewPage,
})

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function SplitViewPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="SplitView"
			subtitle="A resizable two-pane layout with a draggable handle, independent scrolling, and customizable ratios. Perfect for master-detail interfaces."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div
					className="w-full max-w-3xl rounded-lg border border-edge bg-surface overflow-hidden"
					style={{ height: 400 }}
				>
					<HeroDemo />
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic (List + Detail)"
					description="A contact list on the left with a detail view on the right. Click a contact to see their information. Drag the handle to resize."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-3xl overflow-hidden" style={{ height: 400 }}>
						<BasicDemo />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Empty State"
					description="When no item is selected, the emptyDetail fallback is shown. Useful for guiding the user."
					code={examples[1].code}
					highlightedCode={html("empty-state")}
				>
					<div className="w-full max-w-3xl overflow-hidden" style={{ height: 300 }}>
						<SplitView
							master={
								<div className="p-4">
									<p className="text-sm font-medium text-fg">Contacts</p>
									<p className="mt-1 text-xs text-fg-muted">Aucun contact dans cette vue</p>
								</div>
							}
							detail={null}
							emptyDetail={
								<div className="flex h-full flex-col items-center justify-center gap-2 text-fg-muted">
									<Mail className="size-8 opacity-40" />
									<p className="text-sm">Aucun élément sélectionné</p>
									<p className="text-xs">Sélectionnez un contact dans la liste</p>
								</div>
							}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Ratio"
					description="Adjust the default, minimum, and maximum panel ratios. Here the master panel starts at 30% width and can be resized between 20% and 50%."
					code={examples[2].code}
					highlightedCode={html("custom-ratio")}
				>
					<div className="w-full max-w-3xl overflow-hidden" style={{ height: 300 }}>
						<CustomRatioDemo />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="split-view-props" title="SplitView Props">
				<DocPropsTable props={splitViewProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Detail Panel",
							href: "/docs/blocks/detail-panel",
							description: "Side panel for record details with tabs and actions.",
						},
						{
							title: "Inbox",
							href: "/docs/blocks/inbox",
							description: "Linear-style notification inbox with built-in split view.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description: "Full-featured data table with sorting, filtering, and selection.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}

// ---------------------------------------------------------------------------
// Contact List Item (shared)
// ---------------------------------------------------------------------------

function ContactListItem({
	contact,
	selected,
	onClick,
}: {
	contact: Contact
	selected: boolean
	onClick: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full px-4 py-3 text-left transition-colors border-b border-edge last:border-0 ${
				selected ? "bg-raised" : "hover:bg-raised/50"
			}`}
		>
			<p className="text-sm font-medium text-fg">{contact.name}</p>
			<p className="text-xs text-fg-muted">{contact.company}</p>
		</button>
	)
}

// ---------------------------------------------------------------------------
// Contact Detail (shared)
// ---------------------------------------------------------------------------

function ContactDetail({ contact }: { contact: Contact }) {
	return (
		<div className="p-6 space-y-4">
			<div>
				<h2 className="text-lg font-semibold text-fg">{contact.name}</h2>
				<p className="text-sm text-fg-muted">{contact.role}</p>
			</div>
			<div className="space-y-2">
				<div className="flex items-center gap-2 text-sm text-fg-muted">
					<Building2 className="size-4 shrink-0" />
					<span>{contact.company}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-fg-muted">
					<Mail className="size-4 shrink-0" />
					<span>{contact.email}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-fg-muted">
					<Phone className="size-4 shrink-0" />
					<span>{contact.phone}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-fg-muted">
					<MapPin className="size-4 shrink-0" />
					<span>{contact.city}</span>
				</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Hero Demo
// ---------------------------------------------------------------------------

function HeroDemo() {
	const [selectedId, setSelectedId] = useState<string | null>("1")
	const selected = contacts.find((c) => c.id === selectedId)

	return (
		<SplitView
			master={
				<div>
					<div className="px-4 py-3 border-b border-edge">
						<p className="text-sm font-semibold text-fg">Contacts</p>
						<p className="text-xs text-fg-muted">{contacts.length} résultats</p>
					</div>
					{contacts.map((c) => (
						<ContactListItem
							key={c.id}
							contact={c}
							selected={c.id === selectedId}
							onClick={() => setSelectedId(c.id)}
						/>
					))}
				</div>
			}
			detail={selected ? <ContactDetail contact={selected} /> : null}
			emptyDetail={
				<div className="flex h-full items-center justify-center text-sm text-fg-muted">
					Sélectionnez un contact
				</div>
			}
		/>
	)
}

// ---------------------------------------------------------------------------
// Basic Demo
// ---------------------------------------------------------------------------

function BasicDemo() {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const selected = contacts.find((c) => c.id === selectedId)

	return (
		<SplitView
			master={
				<div>
					{contacts.map((c) => (
						<ContactListItem
							key={c.id}
							contact={c}
							selected={c.id === selectedId}
							onClick={() => setSelectedId(c.id)}
						/>
					))}
				</div>
			}
			detail={selected ? <ContactDetail contact={selected} /> : null}
			emptyDetail={
				<div className="flex h-full items-center justify-center text-sm text-fg-muted">
					Sélectionnez un contact
				</div>
			}
		/>
	)
}

// ---------------------------------------------------------------------------
// Custom Ratio Demo
// ---------------------------------------------------------------------------

function CustomRatioDemo() {
	const [selectedId, setSelectedId] = useState<string | null>("2")
	const selected = contacts.find((c) => c.id === selectedId)

	return (
		<SplitView
			defaultRatio={0.3}
			minRatio={0.2}
			maxRatio={0.5}
			master={
				<div>
					{contacts.slice(0, 4).map((c) => (
						<ContactListItem
							key={c.id}
							contact={c}
							selected={c.id === selectedId}
							onClick={() => setSelectedId(c.id)}
						/>
					))}
				</div>
			}
			detail={selected ? <ContactDetail contact={selected} /> : null}
			emptyDetail={
				<div className="flex h-full items-center justify-center text-sm text-fg-muted">
					Sélectionnez un contact
				</div>
			}
		/>
	)
}
