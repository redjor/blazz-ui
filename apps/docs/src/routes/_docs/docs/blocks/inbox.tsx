import type { InboxFilters, InboxNotification } from "@blazz/ui/components/blocks/inbox"
import {
	filterInboxItems,
	Inbox,
	InboxDetail,
	InboxDetailEmpty,
	InboxHeader,
	InboxItem,
	InboxList,
	InboxPanel,
	InboxSidebar,
} from "@blazz/ui/components/blocks/inbox"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const heroItems: InboxNotification[] = [
	{
		id: "1",
		title: "CEN-206 Impossible d'enregistrer un nouveau...",
		description: "Saif Warradi commented: Oui je vois, ce qui es...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "comment",
		status: "cancelled",
		priority: "urgent",
		time: "19h",
		read: false,
	},
	{
		id: "2",
		title: "CEN-205 Impossible d'enregistrer un nouvel a...",
		description: "Saif Warradi replied: Oui j'ai vu que tu as test...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reply",
		status: "cancelled",
		priority: "urgent",
		time: "19h",
		read: false,
	},
	{
		id: "3",
		title: "CEN-57 Créer article avec code auto et hiérar...",
		description: "Saif Warradi reacted to: fait un ticket en me disant...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reaction",
		status: "done",
		time: "24h",
		read: false,
	},
	{
		id: "4",
		title: "CEN-115 US-CLI-013: Filtrer automatiquemen...",
		description: "Saif Warradi replied: On n'a pas vu ça, super ...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reply",
		status: "done",
		priority: "urgent",
		time: "29d",
		read: false,
	},
	{
		id: "5",
		title: "CEN-61 Associer article-fournisseur avec con...",
		description: "Saif Warradi replied: Oui il s'agit bien du prix ...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reply",
		status: "done",
		priority: "urgent",
		time: "30d",
		read: false,
	},
	{
		id: "6",
		title: "CEN-82 Gérer paramètres de préparation (lieu...",
		description: "Saif Warradi replied: Oui dans le module logistiqu...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reply",
		status: "in-progress",
		time: "30d",
		read: true,
	},
	{
		id: "7",
		title: "CEN-104 US-CLI-002: Créer client Particulier ...",
		description: "Saif Warradi mentioned you: @Jonathan RUAS ye...",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "mention",
		status: "in-progress",
		time: "30d",
		read: true,
	},
	{
		id: "8",
		title: "CEN-91 Historiser modifications prix fourniss...",
		description: "Saif Warradi reacted to: @jeremy.ruas@adservio....",
		author: { name: "Saif Warradi", initials: "SW", color: "#4a8c5c" },
		actionType: "reaction",
		status: "done",
		time: "30d",
		read: true,
	},
	{
		id: "9",
		title: "Module 2 - Articles/Clients/Fournisseurs",
		description: "Added as a project member by jeremy.ruas@adser...",
		author: { name: "Jeremy Ruas", initials: "JR", color: "#3b82f6" },
		actionType: "added",
		status: "in-progress",
		time: "5w",
		read: true,
	},
]

const basicItems: InboxNotification[] = [
	{
		id: "b1",
		title: "PROJ-42 Fix login page regression",
		description: "Alex Chen commented: I found the root cause...",
		author: { name: "Alex Chen", initials: "AC", color: "#6366f1" },
		actionType: "comment",
		status: "urgent",
		priority: "high",
		time: "5m",
		read: false,
	},
	{
		id: "b2",
		title: "PROJ-38 Update API documentation",
		description: "Sarah Kim replied: Looks good, merging now.",
		author: { name: "Sarah Kim", initials: "SK", color: "#ec4899" },
		actionType: "reply",
		status: "done",
		time: "2h",
		read: false,
	},
	{
		id: "b3",
		title: "PROJ-55 Redesign settings page",
		description: "Jordan Lee mentioned you: @you can you review...",
		author: { name: "Jordan Lee", initials: "JL", color: "#f59e0b" },
		actionType: "mention",
		status: "in-progress",
		time: "1d",
		read: true,
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `const [filters, setFilters] = useState<InboxFilters>({})
const filtered = filterInboxItems(items, filters)

<InboxPanel>
  <InboxHeader
    filters={filters}
    onFiltersChange={setFilters}
  />
  <InboxList>
    {filtered.map((item) => (
      <InboxItem
        key={item.id}
        item={item}
        onClick={(n) => console.log(n)}
      />
    ))}
  </InboxList>
</InboxPanel>`,
	},
	{
		key: "split",
		code: `const [filters, setFilters] = useState<InboxFilters>({})
const filtered = filterInboxItems(items, filters)

<Inbox>
  <InboxSidebar>
    <InboxHeader
      filters={filters}
      onFiltersChange={setFilters}
      menuActions={[
        { label: "Mark all read", onClick: () => {} },
        { label: "Clear all", onClick: () => {}, variant: "destructive" },
      ]}
    />
    <InboxList>
      {filtered.map((item) => (
        <InboxItem
          key={item.id}
          item={item}
          selected={item.id === selectedId}
          onClick={(n) => setSelectedId(n.id)}
        />
      ))}
    </InboxList>
  </InboxSidebar>
  <InboxDetail>
    {selectedId ? (
      <div>{/* detail content */}</div>
    ) : (
      <InboxDetailEmpty />
    )}
  </InboxDetail>
</Inbox>`,
	},
	{
		key: "loading",
		code: `<InboxPanel loading />`,
	},
	{
		key: "empty",
		code: `<InboxPanel>
  <InboxHeader />
  {/* No InboxList children — empty state renders automatically */}
</InboxPanel>`,
	},
] as const

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const inboxNotificationProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier.",
	},
	{
		name: "title",
		type: "string",
		description: "Primary text (e.g. ticket ref + title).",
	},
	{
		name: "description",
		type: "string",
		description: "Secondary text (e.g. author action + message excerpt).",
	},
	{
		name: "author",
		type: "InboxAuthor",
		description: "Author info: name, initials, color, avatarUrl.",
	},
	{
		name: "actionType",
		type: '"comment" | "reply" | "reaction" | "mention" | "added"',
		description: "Type of action, shown as a small icon on the avatar.",
	},
	{
		name: "status",
		type: '"urgent" | "done" | "in-progress" | "cancelled" | "default"',
		description: "Status dot indicator.",
	},
	{
		name: "priority",
		type: '"urgent" | "high" | "medium" | "low" | "none"',
		description: "Priority badge. Only urgent/high show a visual indicator.",
	},
	{
		name: "time",
		type: "string",
		description: "Relative time display (e.g. 19h, 2d, 5w).",
	},
	{
		name: "read",
		type: "boolean",
		default: "false",
		description: "Read state. Unread items have bolder text.",
	},
]

const inboxItemComponentProps: DocProp[] = [
	{
		name: "item",
		type: "InboxNotification",
		description: "Notification data object.",
	},
	{
		name: "selected",
		type: "boolean",
		default: "false",
		description: "Whether this item is selected (highlighted background).",
	},
	{
		name: "onClick",
		type: "(item: InboxNotification) => void",
		description: "Click handler.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes.",
	},
]

const inboxHeaderComponentProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Inbox"',
		description: "Header title.",
	},
	{
		name: "menuActions",
		type: "InboxMenuAction[]",
		description: 'Actions for the "..." dropdown menu.',
	},
	{
		name: "filters",
		type: "InboxFilters",
		description: "Current filter state. Required to show the filter button.",
	},
	{
		name: "onFiltersChange",
		type: "(filters: InboxFilters) => void",
		description: "Callback when filters change. Required to enable the filter toggle.",
	},
]

const inboxPanelComponentProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "Content (InboxHeader + InboxList).",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description: "Show skeleton loading state.",
	},
	{
		name: "error",
		type: "boolean",
		default: "false",
		description: "Show error state.",
	},
	{
		name: "onRetry",
		type: "() => void",
		description: "Callback for error retry.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "inbox-notification-type", title: "InboxNotification Type" },
	{ id: "inbox-item-props", title: "InboxItem Props" },
	{ id: "inbox-header-props", title: "InboxHeader Props" },
	{ id: "inbox-panel-props", title: "InboxPanel Props" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_docs/docs/blocks/inbox")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: InboxPage,
})

// ---------------------------------------------------------------------------
// Interactive demo for hero
// ---------------------------------------------------------------------------

function InboxHeroDemo() {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filters, setFilters] = useState<InboxFilters>({})
	const filtered = filterInboxItems(heroItems, filters)

	return (
		<div
			className="w-full max-w-4xl rounded-lg border border-edge bg-surface overflow-hidden"
			style={{ height: 480 }}
		>
			<Inbox>
				<InboxSidebar>
					<InboxHeader
						menuActions={[{ label: "Mark all read", onClick: () => {} }]}
						filters={filters}
						onFiltersChange={setFilters}
					/>
					<InboxList>
						{filtered.map((item) => (
							<InboxItem
								key={item.id}
								item={item}
								selected={item.id === selectedId}
								onClick={(n) => setSelectedId(n.id)}
							/>
						))}
					</InboxList>
				</InboxSidebar>
				<InboxDetail>
					<InboxDetailEmpty />
				</InboxDetail>
			</Inbox>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function InboxPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Inbox"
			subtitle="A Linear-style inbox with split-view layout, action type indicators, status dots, and priority badges."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<InboxHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic List"
					description="A standalone inbox list with toggleable filters. Click the filter icon to reveal filter chips."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicListDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Split View"
					description="Full inbox with a left sidebar (notification list) and a right detail panel. Inspired by Linear's inbox."
					code={examples[1].code}
					highlightedCode={html("split")}
				>
					<SplitViewDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Loading State"
					description="Pass the loading prop to InboxPanel to show skeleton placeholders."
					code={examples[2].code}
					highlightedCode={html("loading")}
				>
					<div
						className="w-full max-w-sm rounded-lg border border-edge bg-surface overflow-hidden"
						style={{ height: 280 }}
					>
						<InboxPanel loading />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Empty State"
					description="When there are no items, a built-in empty state is displayed."
					code={examples[3].code}
					highlightedCode={html("empty")}
				>
					<div
						className="w-full max-w-sm rounded-lg border border-edge bg-surface overflow-hidden"
						style={{ height: 200 }}
					>
						<InboxPanel>
							<InboxHeader />
						</InboxPanel>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* InboxNotification Type */}
			<DocSection id="inbox-notification-type" title="InboxNotification Type">
				<DocPropsTable props={inboxNotificationProps} />
			</DocSection>

			{/* InboxItem Props */}
			<DocSection id="inbox-item-props" title="InboxItem Props">
				<DocPropsTable props={inboxItemComponentProps} />
			</DocSection>

			{/* InboxHeader Props */}
			<DocSection id="inbox-header-props" title="InboxHeader Props">
				<DocPropsTable props={inboxHeaderComponentProps} />
			</DocSection>

			{/* InboxPanel Props */}
			<DocSection id="inbox-panel-props" title="InboxPanel Props">
				<DocPropsTable props={inboxPanelComponentProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "NotificationCenter",
							href: "/docs/blocks/notification-center",
							description: "General-purpose notification panel with groups and actions.",
						},
						{
							title: "Split View",
							href: "/docs/blocks/split-view",
							description: "Two-pane master-detail layout.",
						},
						{
							title: "Activity Timeline",
							href: "/docs/blocks/activity-timeline",
							description: "Chronological event feed.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}

// ---------------------------------------------------------------------------
// Split View Demo (interactive)
// ---------------------------------------------------------------------------

function BasicListDemo() {
	const [filters, setFilters] = useState<InboxFilters>({})
	const filtered = filterInboxItems(basicItems, filters)

	return (
		<div
			className="w-full max-w-sm rounded-lg border border-edge bg-surface overflow-hidden"
			style={{ height: 320 }}
		>
			<InboxPanel>
				<InboxHeader filters={filters} onFiltersChange={setFilters} />
				<InboxList>
					{filtered.map((item) => (
						<InboxItem key={item.id} item={item} />
					))}
				</InboxList>
			</InboxPanel>
		</div>
	)
}

function SplitViewDemo() {
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filters, setFilters] = useState<InboxFilters>({})
	const filtered = filterInboxItems(basicItems, filters)
	const selected = filtered.find((i) => i.id === selectedId)

	return (
		<div
			className="w-full max-w-3xl rounded-lg border border-edge bg-surface overflow-hidden"
			style={{ height: 320 }}
		>
			<Inbox>
				<InboxSidebar width={300}>
					<InboxHeader
						menuActions={[{ label: "Mark all read", onClick: () => {} }]}
						filters={filters}
						onFiltersChange={setFilters}
					/>
					<InboxList>
						{filtered.map((item) => (
							<InboxItem
								key={item.id}
								item={item}
								selected={item.id === selectedId}
								onClick={(n) => setSelectedId(n.id)}
							/>
						))}
					</InboxList>
				</InboxSidebar>
				<InboxDetail>
					{selected ? (
						<div className="flex flex-col gap-3 p-6">
							<h3 className="text-sm font-semibold text-fg">{selected.title}</h3>
							<p className="text-sm text-fg-muted">{selected.description}</p>
							<div className="flex items-center gap-2 text-xs text-fg-muted">
								<div
									className="flex size-5 items-center justify-center rounded-full text-[8px] font-semibold text-white"
									style={{ backgroundColor: selected.author.color }}
								>
									{selected.author.initials}
								</div>
								<span>{selected.author.name}</span>
								<span>·</span>
								<span>{selected.time}</span>
							</div>
						</div>
					) : (
						<InboxDetailEmpty />
					)}
				</InboxDetail>
			</Inbox>
		</div>
	)
}
