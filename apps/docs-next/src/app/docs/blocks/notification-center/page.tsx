"use client"

import type { Notification } from "@blazz/pro/components/blocks/notification-center"
import {
	NotificationCenter,
	NotificationGroup,
	NotificationItem,
	NotificationList,
	NotificationTrigger,
} from "@blazz/pro/components/blocks/notification-center"
import { Button } from "@blazz/ui/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@blazz/ui/components/ui/sheet"
import { AlertCircle, DollarSign, MessageSquare, ShieldAlert, UserPlus } from "lucide-react"
import { use, useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "notification-center-props", title: "NotificationCenter Props" },
	{ id: "notification-trigger-props", title: "NotificationTrigger Props" },
	{ id: "notification-item-props", title: "NotificationItem Props" },
	{ id: "notification-type", title: "Notification Type" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const heroNotifications: Notification[] = [
	{
		id: "1",
		icon: DollarSign,
		iconVariant: "success",
		title: "Deal closed: Acme Corp",
		description: "The $48,000 deal has been marked as won.",
		time: "2m ago",
		read: false,
		actions: [{ label: "View Deal", onClick: () => {}, variant: "primary" }],
	},
	{
		id: "2",
		icon: UserPlus,
		iconVariant: "info",
		title: "New contact added",
		description: "Sarah Chen was added to your contacts.",
		time: "15m ago",
		read: false,
	},
	{
		id: "3",
		icon: MessageSquare,
		iconVariant: "warning",
		title: "Comment on Quote #1042",
		description: 'Jordan left a comment: "Can we adjust the pricing?"',
		time: "1h ago",
		read: true,
	},
	{
		id: "4",
		icon: AlertCircle,
		iconVariant: "critical",
		title: "Overdue task",
		description: "Follow-up with Globex Corp is 2 days overdue.",
		time: "3h ago",
		read: true,
		actions: [
			{ label: "Reschedule", onClick: () => {}, variant: "primary" },
			{ label: "Dismiss", onClick: () => {} },
		],
	},
]

const basicNotifications: Notification[] = [
	{
		id: "b1",
		icon: DollarSign,
		iconVariant: "success",
		title: "Payment received",
		description: "Invoice #1023 has been paid.",
		time: "5m ago",
		read: false,
	},
	{
		id: "b2",
		icon: UserPlus,
		iconVariant: "info",
		title: "New team member",
		description: "Alex Kim joined the Sales team.",
		time: "30m ago",
		read: true,
	},
	{
		id: "b3",
		icon: MessageSquare,
		iconVariant: "warning",
		title: "New message",
		description: "You have a new message from support.",
		time: "2h ago",
		read: true,
	},
]

const groupedTodayNotifications: Notification[] = [
	{
		id: "g1",
		icon: DollarSign,
		iconVariant: "success",
		title: "Deal won: TechStart Inc",
		description: "The $24,000 deal has been closed.",
		time: "10m ago",
		read: false,
	},
	{
		id: "g2",
		icon: UserPlus,
		iconVariant: "info",
		title: "Contact updated",
		description: "Mike Johnson's email was changed.",
		time: "1h ago",
		read: false,
	},
]

const groupedEarlierNotifications: Notification[] = [
	{
		id: "g3",
		icon: AlertCircle,
		iconVariant: "critical",
		title: "Task overdue",
		description: "Prepare Q4 report is 1 day overdue.",
		time: "Yesterday",
		read: true,
	},
	{
		id: "g4",
		icon: MessageSquare,
		iconVariant: "warning",
		title: "Quote feedback",
		description: "Client requested changes on Quote #998.",
		time: "2 days ago",
		read: true,
	},
]

const actionNotifications: Notification[] = [
	{
		id: "a1",
		icon: ShieldAlert,
		iconVariant: "critical",
		title: "Security alert",
		description: "Unusual login attempt detected from a new device.",
		time: "Just now",
		read: false,
		actions: [
			{ label: "Review", onClick: () => {}, variant: "primary" },
			{ label: "Dismiss", onClick: () => {} },
			{ label: "Block Device", onClick: () => {} },
		],
	},
	{
		id: "a2",
		icon: DollarSign,
		iconVariant: "success",
		title: "Invoice ready",
		description: "Invoice #1048 is ready for review.",
		time: "20m ago",
		read: false,
		actions: [
			{ label: "Approve", onClick: () => {}, variant: "primary" },
			{ label: "Edit", onClick: () => {} },
		],
	},
	{
		id: "a3",
		icon: UserPlus,
		iconVariant: "info",
		title: "Team invite",
		description: "You've been invited to join the Marketing team.",
		time: "1h ago",
		read: false,
		actions: [
			{ label: "Accept", onClick: () => {}, variant: "primary" },
			{ label: "Decline", onClick: () => {} },
		],
	},
]

const sheetNotifications: Notification[] = [
	{
		id: "s1",
		icon: DollarSign,
		iconVariant: "success",
		title: "Deal closed: Acme Corp",
		description: "The $48,000 deal has been marked as won.",
		time: "2m ago",
		read: false,
		actions: [{ label: "View Deal", onClick: () => {}, variant: "primary" }],
	},
	{
		id: "s2",
		icon: UserPlus,
		iconVariant: "info",
		title: "New contact added",
		description: "Sarah Chen was added to your contacts.",
		time: "15m ago",
		read: false,
	},
	{
		id: "s3",
		icon: AlertCircle,
		iconVariant: "critical",
		title: "Overdue task",
		description: "Follow-up with Globex Corp is 2 days overdue.",
		time: "3h ago",
		read: true,
	},
]

const notificationCenterProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		description: "Content (NotificationList, etc.).",
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
	{
		name: "onMarkAllRead",
		type: "() => void",
		description: 'Callback for "Mark all read".',
	},
	{
		name: "unreadCount",
		type: "number",
		default: "0",
		description: "Badge count in header.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes.",
	},
]

const notificationTriggerProps: DocProp[] = [
	{
		name: "unreadCount",
		type: "number",
		default: "0",
		description: "Number of unread notifications. Shows a red dot when > 0.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes.",
	},
]

const notificationItemProps: DocProp[] = [
	{
		name: "notification",
		type: "Notification",
		description: "Notification data object.",
	},
	{
		name: "onClick",
		type: "(notification: Notification) => void",
		description: "Click handler.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes.",
	},
]

const notificationTypeProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Lucide icon component.",
	},
	{
		name: "iconVariant",
		type: '"info" | "success" | "warning" | "critical"',
		description: "Icon color variant.",
	},
	{
		name: "title",
		type: "string",
		description: "Title text.",
	},
	{
		name: "description",
		type: "string",
		description: "Description text.",
	},
	{
		name: "time",
		type: "string",
		description: "Time display.",
	},
	{
		name: "read",
		type: "boolean",
		default: "false",
		description: "Read state.",
	},
	{
		name: "actions",
		type: "NotificationAction[]",
		description: "Available actions.",
	},
]

const examples = [
	{
		key: "basic",
		code: `<NotificationCenter unreadCount={1}>
  <NotificationList>
    <NotificationItem
      notification={{
        id: "1",
        icon: DollarSign,
        iconVariant: "success",
        title: "Payment received",
        description: "Invoice #1023 has been paid.",
        time: "5m ago",
        read: false,
      }}
    />
  </NotificationList>
</NotificationCenter>`,
	},
	{
		key: "groups",
		code: `<NotificationCenter unreadCount={2} onMarkAllRead={() => {}}>
  <NotificationList>
    <NotificationGroup label="Today">
      <NotificationItem notification={...} />
      <NotificationItem notification={...} />
    </NotificationGroup>
    <NotificationGroup label="Earlier">
      <NotificationItem notification={...} />
      <NotificationItem notification={...} />
    </NotificationGroup>
  </NotificationList>
</NotificationCenter>`,
	},
	{
		key: "actions",
		code: `<NotificationItem
  notification={{
    id: "1",
    icon: ShieldAlert,
    iconVariant: "critical",
    title: "Security alert",
    description: "Unusual login attempt detected.",
    time: "Just now",
    read: false,
    actions: [
      { label: "Review", onClick: () => {}, variant: "primary" },
      { label: "Dismiss", onClick: () => {} },
      { label: "Block Device", onClick: () => {} },
    ],
  }}
/>`,
	},
	{
		key: "loading",
		code: `<NotificationCenter loading />`,
	},
	{
		key: "empty",
		code: `<NotificationCenter>
  {/* No children — empty state renders automatically */}
</NotificationCenter>`,
	},
	{
		key: "trigger",
		code: `<NotificationTrigger unreadCount={count} />

// The bell-ring and dot-pulse animations trigger
// automatically when unreadCount increases.`,
	},
	{
		key: "sheet",
		code: `<Sheet>
  <SheetTrigger
    render={<NotificationTrigger unreadCount={2} />}
  />
  <SheetContent side="right" size="sm">
    <NotificationCenter
      unreadCount={2}
      onMarkAllRead={() => {}}
    >
      <NotificationList>
        <NotificationItem notification={...} />
        <NotificationItem notification={...} />
      </NotificationList>
    </NotificationCenter>
  </SheetContent>
</Sheet>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

,
			}))
		)
		return { highlighted }
	},
	component: NotificationCenterPage,
})

function TriggerDemo() {
	const [count, setCount] = useState(0)

	return (
		<div className="flex items-center gap-4">
			<NotificationTrigger unreadCount={count} />
			<Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
				Simulate notification
			</Button>
			{count > 0 && (
				<Button variant="ghost" size="sm" onClick={() => setCount(0)} className="text-fg-muted">
					Reset
				</Button>
			)}
		</div>
	)
}

export default function NotificationCenterPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="NotificationCenter"
			subtitle="A composable notification panel with grouped lists, actions, and built-in loading/empty/error states."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
					<NotificationCenter unreadCount={2} onMarkAllRead={() => {}}>
						<NotificationList>
							{heroNotifications.map((n) => (
								<NotificationItem key={n.id} notification={n} />
							))}
						</NotificationList>
					</NotificationCenter>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A flat list of notifications without groups or actions."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
						<NotificationCenter unreadCount={1}>
							<NotificationList>
								{basicNotifications.map((n) => (
									<NotificationItem key={n.id} notification={n} />
								))}
							</NotificationList>
						</NotificationCenter>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Groups"
					description='Use NotificationGroup to organize notifications by time period (e.g. "Today" / "Earlier").'
					code={examples[1].code}
					highlightedCode={html("groups")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
						<NotificationCenter unreadCount={2} onMarkAllRead={() => {}}>
							<NotificationList>
								<NotificationGroup label="Today">
									{groupedTodayNotifications.map((n) => (
										<NotificationItem key={n.id} notification={n} />
									))}
								</NotificationGroup>
								<NotificationGroup label="Earlier">
									{groupedEarlierNotifications.map((n) => (
										<NotificationItem key={n.id} notification={n} />
									))}
								</NotificationGroup>
							</NotificationList>
						</NotificationCenter>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Actions"
					description='Notifications can include primary actions and secondary actions. Use variant: "primary" for the main action.'
					code={examples[2].code}
					highlightedCode={html("actions")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
						<NotificationCenter unreadCount={3}>
							<NotificationList>
								{actionNotifications.map((n) => (
									<NotificationItem key={n.id} notification={n} />
								))}
							</NotificationList>
						</NotificationCenter>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Loading State"
					description="Pass the loading prop to show skeleton placeholders while data is being fetched."
					code={examples[3].code}
					highlightedCode={html("loading")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
						<NotificationCenter loading />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Empty State"
					description="When there are no notifications, a built-in empty state is displayed automatically."
					code={examples[4].code}
					highlightedCode={html("empty")}
				>
					<div className="w-full max-w-md rounded-lg border border-edge bg-surface">
						<NotificationCenter />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Trigger"
					description="NotificationTrigger renders a Bell icon with an unread dot. When the unread count increases, the bell rings and the dot pulses."
					code={examples[5].code}
					highlightedCode={html("trigger")}
				>
					<TriggerDemo />
				</DocExampleClient>

				<DocExampleClient
					title="In a Sheet"
					description="Combine NotificationCenter with Sheet and NotificationTrigger for a slide-in panel experience."
					code={examples[6].code}
					highlightedCode={html("sheet")}
				>
					<Sheet>
						<SheetTrigger render={<NotificationTrigger unreadCount={2} />} />
						<SheetContent side="right" size="sm">
							<NotificationCenter unreadCount={2} onMarkAllRead={() => {}}>
								<NotificationList>
									{sheetNotifications.map((n) => (
										<NotificationItem key={n.id} notification={n} />
									))}
								</NotificationList>
							</NotificationCenter>
						</SheetContent>
					</Sheet>
				</DocExampleClient>
			</DocSection>

			{/* NotificationCenter Props */}
			<DocSection id="notification-center-props" title="NotificationCenter Props">
				<DocPropsTable props={notificationCenterProps} />
			</DocSection>

			{/* NotificationTrigger Props */}
			<DocSection id="notification-trigger-props" title="NotificationTrigger Props">
				<DocPropsTable props={notificationTriggerProps} />
			</DocSection>

			{/* NotificationItem Props */}
			<DocSection id="notification-item-props" title="NotificationItem Props">
				<DocPropsTable props={notificationItemProps} />
			</DocSection>

			{/* Notification Type */}
			<DocSection id="notification-type" title="Notification Type">
				<DocPropsTable props={notificationTypeProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use NotificationGroup to organize notifications by time period</li>
					<li>Keep action labels short (1-2 words)</li>
					<li>
						Use <code className="text-xs">variant: "primary"</code> for the main action only
					</li>
					<li>Use iconVariant to convey notification intent at a glance</li>
					<li>Combine with Sheet for slide-in panel UX</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Sheet",
							href: "/docs/components/ui/sheet",
							description: "Slide-in panel container for notifications.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "Used for unread count display.",
						},
						{
							title: "DropdownMenu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Powers secondary actions on notification items.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
