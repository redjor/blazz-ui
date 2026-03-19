import type { InboxFilters, InboxNotification } from "@blazz/pro/components/blocks/inbox"
import {
	filterInboxItems,
	Inbox,
	InboxDetail,
	InboxDetailCard,
	InboxDetailEmpty,
	InboxHeader,
	InboxItem,
	InboxList,
	InboxPanel,
	InboxSidebar,
} from "@blazz/pro/components/blocks/inbox"
import { Button } from "@blazz/ui"
import { Archive, ExternalLink } from "lucide-react"
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
		title: "PR #142 merged on blazz-ui-app",
		description: "feat: add inbox block component",
		author: { name: "Jonathan Ruas", initials: "JR", color: "#24292f" },
		actionType: "comment",
		status: "done",
		time: "4h",
		read: false,
	},
	{
		id: "2",
		title: "Review requested on PR #143",
		description: "refactor: migrate auth middleware to new co...",
		author: { name: "Sarah Kim", initials: "SK", color: "#ec4899" },
		actionType: "mention",
		status: "in-progress",
		priority: "urgent",
		time: "5h",
		read: false,
	},
	{
		id: "3",
		title: "Deploy succeeded on main",
		description: "feat: add notifications inbox page",
		author: { name: "Vercel", initials: "VC", color: "#000000" },
		actionType: "comment",
		status: "done",
		time: "5h",
		read: false,
	},
	{
		id: "4",
		title: "Deploy failed on develop",
		description: "fix: resolve type errors in webhook handlers",
		author: { name: "Vercel", initials: "VC", color: "#000000" },
		actionType: "comment",
		status: "urgent",
		priority: "urgent",
		time: "5h",
		read: false,
	},
	{
		id: "5",
		title: "CI failed: typecheck",
		description: "Type error in convex/http.ts — Property 'sour...",
		author: { name: "GitHub Actions", initials: "GA", color: "#6e7781" },
		actionType: "comment",
		status: "urgent",
		priority: "urgent",
		time: "6h",
		read: false,
	},
	{
		id: "6",
		title: "Comment on #138",
		description: "Looks good! Just one nit: the error message sho...",
		author: { name: "Sarah Dayan", initials: "SD", color: "#f59e0b" },
		actionType: "comment",
		time: "7h",
		read: true,
	},
	{
		id: "7",
		title: "Rate limit approaching",
		description: "Database reads at 85% of quota for current...",
		author: { name: "Convex", initials: "CX", color: "#f97316" },
		actionType: "mention",
		status: "in-progress",
		priority: "urgent",
		time: "10h",
		read: true,
	},
	{
		id: "8",
		title: "Push to develop",
		description: "chore: update dependencies",
		author: { name: "Alex Chen", initials: "AC", color: "#6366f1" },
		actionType: "added",
		time: "1d",
		read: true,
	},
]

/** Detail card data keyed by notification id */
const heroDetailData: Record<string, { source: string; sourceInitials: string }> = {
	"1": { source: "GitHub", sourceInitials: "GH" },
	"2": { source: "GitHub", sourceInitials: "GH" },
	"3": { source: "Vercel", sourceInitials: "VC" },
	"4": { source: "Vercel", sourceInitials: "VC" },
	"5": { source: "GitHub Actions", sourceInitials: "GA" },
	"6": { source: "GitHub", sourceInitials: "GH" },
	"7": { source: "Convex", sourceInitials: "CX" },
	"8": { source: "GitHub", sourceInitials: "GH" },
}

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
		code: `<Inbox>
  <InboxSidebar>
    <InboxHeader
      filters={filters}
      onFiltersChange={setFilters}
      menuActions={[
        { label: "Mark all read", onClick: () => {} },
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
    {selected ? (
      <InboxDetailCard
        title={selected.title}
        description={selected.description}
        source={{ name: "Vercel", initials: "VC" }}
        time={selected.time}
        actions={
          <Button variant="outline" size="sm">
            <Archive className="mr-1.5 size-3.5" />
            Archive
          </Button>
        }
      />
    ) : (
      <InboxDetailEmpty />
    )}
  </InboxDetail>
</Inbox>`,
	},
	{
		key: "detail-card",
		code: `<InboxDetailCard
  title="Deploy succeeded on main"
  description="feat: add notifications inbox page"
  source={{ name: "Vercel", initials: "VC" }}
  time="5 hours ago"
  author={{
    name: "Jonathan Ruas",
    initials: "JR",
    color: "#6366f1",
  }}
  actions={
    <>
      <Button size="sm">
        <ExternalLink className="mr-1.5 size-3.5" />
        Open in Vercel
      </Button>
      <Button variant="outline" size="sm">
        <Archive className="mr-1.5 size-3.5" />
        Archive
      </Button>
    </>
  }
/>`,
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

const inboxDetailCardComponentProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Primary heading text.",
	},
	{
		name: "description",
		type: "string",
		description: "Secondary body text below the title.",
	},
	{
		name: "source",
		type: "{ name: string; logo?: string; initials?: string }",
		description: "Source service displayed in the header strip (e.g. Vercel, GitHub).",
	},
	{
		name: "time",
		type: "string",
		description: "Relative time shown in the header strip.",
	},
	{
		name: "author",
		type: "{ name: string; avatar?: string; initials?: string; color?: string; label?: string }",
		description: 'Author section with avatar. Hidden when author name matches source name. Defaults label to "Author".',
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description: "Action buttons rendered in the card footer.",
	},
]

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "inbox-notification-type", title: "InboxNotification Type" },
	{ id: "inbox-item-props", title: "InboxItem Props" },
	{ id: "inbox-header-props", title: "InboxHeader Props" },
	{ id: "inbox-panel-props", title: "InboxPanel Props" },
	{ id: "inbox-detail-card-props", title: "InboxDetailCard Props" },
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
	const [selectedId, setSelectedId] = useState<string | null>("3")
	const [filters, setFilters] = useState<InboxFilters>({})
	const filtered = filterInboxItems(heroItems, filters)
	const selected = filtered.find((i) => i.id === selectedId)

	return (
		<div
			className="w-full max-w-4xl rounded-lg border border-edge bg-surface overflow-hidden"
			style={{ height: 480 }}
		>
			<Inbox>
				<InboxSidebar>
					<InboxHeader
						title="Notifications"
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
						<InboxDetailCard
							title={selected.title}
							description={selected.description}
							source={{
								name: heroDetailData[selected.id]?.source ?? selected.author.name,
								initials: heroDetailData[selected.id]?.sourceInitials ?? selected.author.initials,
							}}
							time={selected.time}
							author={
								selected.author.name !== heroDetailData[selected.id]?.source
									? {
											name: selected.author.name,
											initials: selected.author.initials,
											color: selected.author.color,
										}
									: undefined
							}
							actions={
								<>
									<Button size="sm">
										<ExternalLink className="mr-1.5 size-3.5" />
										Open
									</Button>
									<Button variant="outline" size="sm">
										<Archive className="mr-1.5 size-3.5" />
										Archive
									</Button>
								</>
							}
						/>
					) : (
						<InboxDetailEmpty />
					)}
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
			subtitle="A Linear-style inbox with split-view layout, styled detail cards, action type indicators, status dots, and priority badges."
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

				<DocExampleClient
					title="Detail Card"
					description="A styled notification detail card with source header, title, description, optional author section, and action buttons. Use inside InboxDetail for the split-view pattern."
					code={examples[4].code}
					highlightedCode={html("detail-card")}
				>
					<div
						className="w-full max-w-xl rounded-lg border border-edge bg-surface overflow-hidden"
						style={{ height: 320 }}
					>
						<InboxDetailCard
							title="Deploy succeeded on main"
							description="feat: add notifications inbox page"
							source={{ name: "Vercel", initials: "VC" }}
							time="5 hours ago"
							author={{
								name: "Jonathan Ruas",
								initials: "JR",
								color: "#6366f1",
							}}
							actions={
								<>
									<Button size="sm">
										<ExternalLink className="mr-1.5 size-3.5" />
										Open in Vercel
									</Button>
									<Button variant="outline" size="sm">
										<Archive className="mr-1.5 size-3.5" />
										Archive
									</Button>
								</>
							}
						/>
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

			{/* InboxDetailCard Props */}
			<DocSection id="inbox-detail-card-props" title="InboxDetailCard Props">
				<DocPropsTable props={inboxDetailCardComponentProps} />
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
			style={{ height: 380 }}
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
						<InboxDetailCard
							title={selected.title}
							description={selected.description}
							source={{
								name: selected.author.name,
								initials: selected.author.initials,
							}}
							time={selected.time}
							actions={
								<Button variant="outline" size="sm">
									<Archive className="mr-1.5 size-3.5" />
									Archive
								</Button>
							}
						/>
					) : (
						<InboxDetailEmpty />
					)}
				</InboxDetail>
			</Inbox>
		</div>
	)
}
