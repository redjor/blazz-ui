import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemGroup,
	ItemHeader,
	ItemMedia,
	ItemSeparator,
	ItemTitle,
} from "@blazz/ui/components/ui/item"
import { Progress } from "@blazz/ui/components/ui/progress"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import {
	Archive,
	Bell,
	Building2,
	Calendar,
	ChevronRight,
	CreditCard,
	FileSpreadsheet,
	FileText,
	Folder,
	GitBranch,
	Image,
	Inbox,
	Mail,
	MoreHorizontal,
	Phone,
	Send,
	Shield,
	Star,
	Trash2,
	User,
} from "lucide-react"
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
		code: `<Item variant="default">
  <ItemContent>
    <ItemTitle>Default</ItemTitle>
    <ItemDescription>Transparent, clean look.</ItemDescription>
  </ItemContent>
</Item>
<Item variant="outline">
  <ItemContent>
    <ItemTitle>Outline</ItemTitle>
    <ItemDescription>Visible border for separation.</ItemDescription>
  </ItemContent>
</Item>
<Item variant="muted">
  <ItemContent>
    <ItemTitle>Muted</ItemTitle>
    <ItemDescription>Subtle background tint.</ItemDescription>
  </ItemContent>
</Item>`,
	},
	{
		key: "icon-actions",
		code: `<Item variant="outline">
  <ItemMedia variant="icon">
    <Mail />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Email Notifications</ItemTitle>
    <ItemDescription>Receive updates via email</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button variant="outline" size="sm">Configure</Button>
  </ItemActions>
</Item>
<Item variant="outline">
  <ItemMedia variant="icon">
    <Bell />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Push Notifications</ItemTitle>
    <ItemDescription>Get notified on your device</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="sm">Enable</Button>
  </ItemActions>
</Item>`,
	},
	{
		key: "user-follow",
		code: `<Item variant="outline" size="xs">
  <ItemMedia>
    <Avatar>
      <AvatarImage src="..." alt="Alex Johnson" />
      <AvatarFallback>AJ</AvatarFallback>
    </Avatar>
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Alex Johnson</ItemTitle>
    <ItemDescription>Senior Software Engineer</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button variant="outline" size="sm">Follow</Button>
  </ItemActions>
</Item>`,
	},
	{
		key: "navigation",
		code: `<ItemGroup className="gap-0">
  <Item render={<a href="#" />} size="xs">
    <ItemMedia variant="icon"><User /></ItemMedia>
    <ItemContent>
      <ItemTitle>Profile</ItemTitle>
      <ItemDescription>Manage your account details</ItemDescription>
    </ItemContent>
    <ItemActions>
      <ChevronRight className="text-muted-foreground size-4" />
    </ItemActions>
  </Item>
  <ItemSeparator />
  <Item render={<a href="#" />} size="xs">
    <ItemMedia variant="icon"><Shield /></ItemMedia>
    <ItemContent>
      <ItemTitle>Security</ItemTitle>
      <ItemDescription>Password and two-factor auth</ItemDescription>
    </ItemContent>
    <ItemActions>
      <ChevronRight className="text-muted-foreground size-4" />
    </ItemActions>
  </Item>
  <ItemSeparator />
  <Item render={<a href="#" />} size="xs">
    <ItemMedia variant="icon"><CreditCard /></ItemMedia>
    <ItemContent>
      <ItemTitle>Billing</ItemTitle>
      <ItemDescription>Plans, invoices, and payment</ItemDescription>
    </ItemContent>
    <ItemActions>
      <ChevronRight className="text-muted-foreground size-4" />
    </ItemActions>
  </Item>
</ItemGroup>`,
	},
	{
		key: "status-badges",
		code: `<ItemGroup>
  <Item variant="outline" size="xs">
    <ItemMedia>
      <Avatar>
        <AvatarImage src="..." alt="Sarah Chen" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Sarah Chen</ItemTitle>
      <ItemDescription>Team Lead</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge variant="success" fill="subtle" dot>Online</Badge>
    </ItemActions>
  </Item>
  {/* ... more items */}
</ItemGroup>`,
	},
	{
		key: "files",
		code: `<Item variant="outline" size="xs">
  <ItemMedia variant="icon"><FileText /></ItemMedia>
  <ItemContent>
    <ItemTitle>Quarterly Report.pdf</ItemTitle>
    <ItemDescription>2.4 MB · Updated 2 hours ago</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Badge variant="success" fill="subtle">Final</Badge>
    <Button variant="outline" size="sm">Open</Button>
  </ItemActions>
</Item>`,
	},
	{
		key: "mailbox",
		code: `{menuItems.map((item) => (
  <Item key={item.label} size="xs" render={<a href="#" />}>
    <ItemMedia variant="icon">{item.icon}</ItemMedia>
    <ItemContent>
      <ItemTitle>{item.label}</ItemTitle>
    </ItemContent>
    {item.count > 0 && (
      <ItemActions>
        <Badge variant="success" fill="subtle" size="xs">
          {item.count}
        </Badge>
      </ItemActions>
    )}
  </Item>
))}`,
	},
	{
		key: "team-dropdown",
		code: `<Item variant="outline" size="xs">
  <ItemMedia>
    <Avatar>
      <AvatarImage src="..." alt="Sarah Chen" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Sarah Chen</ItemTitle>
    <ItemDescription>sarah@example.com</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Badge variant="default">Admin</Badge>
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Change Role</DropdownMenuItem>
        <DropdownMenuItem>View Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ItemActions>
</Item>`,
	},
	{
		key: "project-card",
		code: `<Item variant="outline">
  <ItemHeader>
    <div className="flex items-center gap-2">
      <Folder className="text-muted-foreground size-3.5" />
      <span className="text-muted-foreground text-xs">Project</span>
    </div>
    <Badge variant="info" fill="subtle" size="xs">In Progress</Badge>
  </ItemHeader>
  <ItemContent>
    <ItemTitle>Website Redesign</ItemTitle>
    <ItemDescription>
      Complete overhaul of the marketing site with a focus on
      conversion optimization.
    </ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button variant="outline" size="sm">Open</Button>
  </ItemActions>
  <ItemFooter>
    <AvatarGroup>...</AvatarGroup>
    <div className="flex items-center gap-2">
      <Progress value={65} className="w-20" />
      <span className="text-muted-foreground text-xs">65%</span>
    </div>
  </ItemFooter>
</Item>`,
	},
	{
		key: "integrations",
		code: `<ItemGroup>
  <Item variant="outline" size="xs">
    <ItemMedia variant="icon"><GitBranch /></ItemMedia>
    <ItemContent>
      <ItemTitle>GitHub</ItemTitle>
      <ItemDescription>Connect repositories and sync code</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge variant="success" fill="subtle">Connected</Badge>
    </ItemActions>
  </Item>
  <Item variant="outline" size="xs">
    <ItemMedia variant="icon"><Mail /></ItemMedia>
    <ItemContent>
      <ItemTitle>Slack</ItemTitle>
      <ItemDescription>Send notifications to channels</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button variant="outline" size="sm">Connect</Button>
    </ItemActions>
  </Item>
</ItemGroup>`,
	},
	{
		key: "activity-feed",
		code: `<ItemGroup>
  {activities.map((activity) => (
    <Item variant="outline" size="xs" key={activity.name}>
      <ItemMedia>
        <Avatar size="sm">
          <AvatarImage src={activity.avatar} alt={activity.name} />
          <AvatarFallback>{activity.initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{activity.name}</ItemTitle>
        <ItemDescription>
          <Badge variant="info" fill="subtle" size="xs" className="mr-1">
            {activity.action}
          </Badge>
          {activity.target}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {activity.time}
        </span>
      </ItemActions>
    </Item>
  ))}
</ItemGroup>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/item")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ItemPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const itemProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "outline" | "muted"',
		default: '"default"',
		description: "Visual style variant. Default is transparent, outline adds a border, muted adds a background tint.",
	},
	{
		name: "size",
		type: '"default" | "sm" | "xs"',
		default: '"default"',
		description: "Controls padding and gap. Use xs for dense lists.",
	},
	{
		name: "render",
		type: "React.ReactElement",
		description: "Render as a custom element (e.g. <a> or <Link>) using Base UI's render prop pattern.",
	},
]

const itemMediaProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "icon" | "image"',
		default: '"default"',
		description:
			"default: no sizing. icon: auto-sizes SVGs to 16px. image: fixed size container (40/32/24px based on Item size) with object-cover.",
	},
]

const itemGroupProps: DocProp[] = [
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes. The group auto-adjusts gap based on child Item sizes.",
	},
]

/* ── Inline data for examples ── */
const mailboxItems = [
	{ icon: <Inbox />, label: "Inbox", count: 12 },
	{ icon: <Send />, label: "Sent", count: 0 },
	{ icon: <FileText />, label: "Drafts", count: 3 },
	{ icon: <Archive />, label: "Archive", count: 0 },
	{ icon: <Trash2 />, label: "Trash", count: 0 },
]

const members = [
	{
		name: "Sarah Chen",
		email: "sarah@example.com",
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
		role: "Admin",
		roleVariant: "default" as const,
	},
	{
		name: "Alex Johnson",
		email: "alex@example.com",
		avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
		role: "Editor",
		roleVariant: "info" as const,
	},
	{
		name: "Emily Park",
		email: "emily@example.com",
		avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
		role: "Viewer",
		roleVariant: "outline" as const,
	},
]

const activities = [
	{
		name: "Sarah Chen",
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
		initials: "SC",
		action: "deployed",
		target: "v2.4.1 to production",
		time: "5 min ago",
	},
	{
		name: "Marcus Johnson",
		avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
		initials: "MJ",
		action: "merged",
		target: "feat/dark-mode into main",
		time: "32 min ago",
	},
	{
		name: "Emily Park",
		avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80",
		initials: "EP",
		action: "opened",
		target: "issue #284: Fix mobile nav",
		time: "1 hour ago",
	},
]

function ItemPage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/ui/item" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Item"
			subtitle="Flexible list item component for displaying records, contacts, notifications, and any structured row content."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-full max-w-md">
					<ItemGroup>
						<Item variant="outline" size="xs">
							<ItemMedia>
								<Avatar>
									<AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80" />
									<AvatarFallback>SC</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Sarah Chen</ItemTitle>
								<ItemDescription>Team Lead</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="success" fill="subtle" dot>
									Online
								</Badge>
							</ItemActions>
						</Item>
						<Item variant="outline" size="xs">
							<ItemMedia>
								<Avatar>
									<AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80" />
									<AvatarFallback>AJ</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Alex Johnson</ItemTitle>
								<ItemDescription>Developer</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="warning" fill="subtle" dot>
									Away
								</Badge>
							</ItemActions>
						</Item>
						<Item variant="outline" size="xs">
							<ItemMedia>
								<Avatar>
									<AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80" />
									<AvatarFallback>DK</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>David Kim</ItemTitle>
								<ItemDescription>Designer</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="outline" dot>
									Offline
								</Badge>
							</ItemActions>
						</Item>
					</ItemGroup>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				{/* 1 — Variants */}
				<DocExampleClient
					title="Variants"
					description="Three visual variants: default (transparent), outline (bordered), and muted (tinted background)."
					code={examples[0].code}
					highlightedCode={html("variants")}
				>
					<div className="max-w-md flex flex-col gap-2">
						<Item variant="default">
							<ItemContent>
								<ItemTitle>Default</ItemTitle>
								<ItemDescription>Transparent, clean look.</ItemDescription>
							</ItemContent>
						</Item>
						<Item variant="outline">
							<ItemContent>
								<ItemTitle>Outline</ItemTitle>
								<ItemDescription>Visible border for separation.</ItemDescription>
							</ItemContent>
						</Item>
						<Item variant="muted">
							<ItemContent>
								<ItemTitle>Muted</ItemTitle>
								<ItemDescription>Subtle background tint.</ItemDescription>
							</ItemContent>
						</Item>
					</div>
				</DocExampleClient>

				{/* 2 — Icon Media + Actions */}
				<DocExampleClient
					title="With Icon & Actions"
					description="Items with icon media and action buttons for settings-style lists."
					code={examples[1].code}
					highlightedCode={html("icon-actions")}
				>
					<div className="max-w-md flex flex-col gap-2">
						<Item variant="outline">
							<ItemMedia variant="icon">
								<Mail />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Email Notifications</ItemTitle>
								<ItemDescription>Receive updates via email</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button variant="outline" size="sm">
									Configure
								</Button>
							</ItemActions>
						</Item>
						<Item variant="outline">
							<ItemMedia variant="icon">
								<Bell />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Push Notifications</ItemTitle>
								<ItemDescription>Get notified on your device</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button size="sm">Enable</Button>
							</ItemActions>
						</Item>
					</div>
				</DocExampleClient>

				{/* 3 — User Follow */}
				<DocExampleClient
					title="User with Avatar"
					description="User items with avatar, info, and follow button."
					code={examples[2].code}
					highlightedCode={html("user-follow")}
				>
					<div className="max-w-md flex flex-col gap-2">
						<Item variant="outline" size="xs">
							<ItemMedia>
								<Avatar>
									<AvatarImage
										src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
										alt="Alex Johnson"
									/>
									<AvatarFallback>AJ</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Alex Johnson</ItemTitle>
								<ItemDescription>Senior Software Engineer</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button variant="outline" size="sm">
									Follow
								</Button>
							</ItemActions>
						</Item>
						<Item variant="outline" size="xs">
							<ItemMedia>
								<Avatar>
									<AvatarImage
										src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
										alt="Sarah Chen"
									/>
									<AvatarFallback>SC</AvatarFallback>
								</Avatar>
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Sarah Chen</ItemTitle>
								<ItemDescription>Product Designer</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button size="sm">Following</Button>
							</ItemActions>
						</Item>
					</div>
				</DocExampleClient>

				{/* 4 — Navigation with Chevrons */}
				<DocExampleClient
					title="Navigation Items"
					description="Clickable navigation items with icons, descriptions, chevrons, and separators."
					code={examples[3].code}
					highlightedCode={html("navigation")}
				>
					<div className="max-w-md">
						<ItemGroup className="gap-0">
							<Item render={<a href="#navigation" />} size="xs">
								<ItemMedia variant="icon">
									<User />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Profile</ItemTitle>
									<ItemDescription>Manage your account details</ItemDescription>
								</ItemContent>
								<ItemActions>
									<ChevronRight className="text-muted-foreground size-4" />
								</ItemActions>
							</Item>
							<ItemSeparator />
							<Item render={<a href="#navigation" />} size="xs">
								<ItemMedia variant="icon">
									<Shield />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Security</ItemTitle>
									<ItemDescription>Password and two-factor auth</ItemDescription>
								</ItemContent>
								<ItemActions>
									<ChevronRight className="text-muted-foreground size-4" />
								</ItemActions>
							</Item>
							<ItemSeparator />
							<Item render={<a href="#navigation" />} size="xs">
								<ItemMedia variant="icon">
									<CreditCard />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Billing</ItemTitle>
									<ItemDescription>Plans, invoices, and payment</ItemDescription>
								</ItemContent>
								<ItemActions>
									<ChevronRight className="text-muted-foreground size-4" />
								</ItemActions>
							</Item>
						</ItemGroup>
					</div>
				</DocExampleClient>

				{/* 5 — Status Badges */}
				<DocExampleClient
					title="Status Badges"
					description="Team list with avatar and status badges."
					code={examples[4].code}
					highlightedCode={html("status-badges")}
				>
					<div className="max-w-md">
						<ItemGroup>
							<Item variant="outline" size="xs">
								<ItemMedia>
									<Avatar>
										<AvatarImage
											src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
											alt="Sarah Chen"
										/>
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Sarah Chen</ItemTitle>
									<ItemDescription>Team Lead</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Badge variant="success" fill="subtle" dot>
										Online
									</Badge>
								</ItemActions>
							</Item>
							<Item variant="outline" size="xs">
								<ItemMedia>
									<Avatar>
										<AvatarImage
											src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
											alt="Alex Johnson"
										/>
										<AvatarFallback>AJ</AvatarFallback>
									</Avatar>
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Alex Johnson</ItemTitle>
									<ItemDescription>Developer</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Badge variant="warning" fill="subtle" dot>
										Away
									</Badge>
								</ItemActions>
							</Item>
							<Item variant="outline" size="xs">
								<ItemMedia>
									<Avatar>
										<AvatarImage
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80"
											alt="David Kim"
										/>
										<AvatarFallback>DK</AvatarFallback>
									</Avatar>
								</ItemMedia>
								<ItemContent>
									<ItemTitle>David Kim</ItemTitle>
									<ItemDescription>Designer</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Badge variant="outline" dot>
										Offline
									</Badge>
								</ItemActions>
							</Item>
						</ItemGroup>
					</div>
				</DocExampleClient>

				{/* 6 — File Items */}
				<DocExampleClient
					title="File List"
					description="File items with icon media, metadata, badges, and action buttons."
					code={examples[5].code}
					highlightedCode={html("files")}
				>
					<div className="max-w-md flex flex-col gap-2">
						<Item variant="outline" size="xs">
							<ItemMedia variant="icon">
								<FileText />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Quarterly Report.pdf</ItemTitle>
								<ItemDescription>2.4 MB &middot; Updated 2 hours ago</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="success" fill="subtle">
									Final
								</Badge>
								<Button variant="outline" size="sm">
									Open
								</Button>
							</ItemActions>
						</Item>
						<Item variant="outline" size="xs">
							<ItemMedia variant="icon">
								<FileSpreadsheet />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Budget 2025.xlsx</ItemTitle>
								<ItemDescription>856 KB &middot; Updated yesterday</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="warning" fill="subtle">
									Draft
								</Badge>
								<Button variant="outline" size="sm">
									Open
								</Button>
							</ItemActions>
						</Item>
						<Item variant="outline" size="xs">
							<ItemMedia variant="icon">
								<Image />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Hero Banner.png</ItemTitle>
								<ItemDescription>4.1 MB &middot; Updated 3 days ago</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Badge variant="info" fill="subtle">
									Review
								</Badge>
								<Button variant="outline" size="sm">
									Open
								</Button>
							</ItemActions>
						</Item>
					</div>
				</DocExampleClient>

				{/* 7 — Mailbox Sidebar */}
				<DocExampleClient
					title="Mailbox Sidebar"
					description="Compact navigation items with count badges -- ideal for sidebar menus."
					code={examples[6].code}
					highlightedCode={html("mailbox")}
				>
					<div className="max-w-64 flex flex-col gap-0.5">
						{mailboxItems.map((item) => (
							<Item key={item.label} size="xs" render={<a href="#mailbox" />}>
								<ItemMedia variant="icon">{item.icon}</ItemMedia>
								<ItemContent>
									<ItemTitle>{item.label}</ItemTitle>
								</ItemContent>
								{item.count > 0 && (
									<ItemActions>
										<Badge variant="success" fill="subtle" size="xs">
											{item.count}
										</Badge>
									</ItemActions>
								)}
							</Item>
						))}
					</div>
				</DocExampleClient>

				{/* 8 — Team with Dropdown */}
				<DocExampleClient
					title="Team Members with Actions"
					description="Team members with role badges and a dropdown menu for actions."
					code={examples[7].code}
					highlightedCode={html("team-dropdown")}
				>
					<div className="max-w-md">
						<ItemGroup>
							{members.map((member) => (
								<Item key={member.email} variant="outline" size="xs">
									<ItemMedia>
										<Avatar>
											<AvatarImage src={member.avatar} alt={member.name} />
											<AvatarFallback>
												{member.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{member.name}</ItemTitle>
										<ItemDescription>{member.email}</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Badge variant={member.roleVariant} fill="subtle">
											{member.role}
										</Badge>
										<DropdownMenu>
											<DropdownMenuTrigger
												render={<Button variant="ghost" size="icon-sm" className="size-7" />}
											>
												<MoreHorizontal />
												<span className="sr-only">Actions</span>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>Change Role</DropdownMenuItem>
												<DropdownMenuItem>View Profile</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</ItemActions>
								</Item>
							))}
						</ItemGroup>
					</div>
				</DocExampleClient>

				{/* 9 — Project Card */}
				<DocExampleClient
					title="Project Card"
					description="Item with header, footer, avatar group, and progress bar."
					code={examples[8].code}
					highlightedCode={html("project-card")}
				>
					<div className="max-w-xs">
						<Item variant="outline">
							<ItemHeader>
								<div className="flex items-center gap-2">
									<Folder className="text-muted-foreground size-3.5" aria-hidden="true" />
									<span className="text-muted-foreground text-xs">Project</span>
								</div>
								<Badge variant="info" fill="subtle" size="xs">
									In Progress
								</Badge>
							</ItemHeader>
							<ItemContent>
								<ItemTitle>Website Redesign</ItemTitle>
								<ItemDescription>
									Complete overhaul of the marketing site with a focus on conversion optimization and
									modern design patterns.
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Button variant="outline" size="sm">
									Open
								</Button>
							</ItemActions>
							<ItemFooter>
								<div className="flex -space-x-1">
									<Avatar className="size-6 border-2 border-background">
										<AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80" />
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
									<Avatar className="size-6 border-2 border-background">
										<AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80" />
										<AvatarFallback>AJ</AvatarFallback>
									</Avatar>
									<Avatar className="size-6 border-2 border-background">
										<AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80" />
										<AvatarFallback>EP</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex items-center gap-2">
									<Progress value={65} className="w-20" />
									<span className="text-muted-foreground text-xs">65%</span>
								</div>
							</ItemFooter>
						</Item>
					</div>
				</DocExampleClient>

				{/* 10 — Integrations */}
				<DocExampleClient
					title="Integrations"
					description="Integration items showing connected status or connect action."
					code={examples[9].code}
					highlightedCode={html("integrations")}
				>
					<div className="max-w-md">
						<ItemGroup>
							<Item variant="outline" size="xs">
								<ItemMedia variant="icon">
									<GitBranch />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>GitHub</ItemTitle>
									<ItemDescription>Connect repositories and sync code</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Badge variant="success" fill="subtle">
										Connected
									</Badge>
								</ItemActions>
							</Item>
							<Item variant="outline" size="xs">
								<ItemMedia variant="icon">
									<Building2 />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Figma</ItemTitle>
									<ItemDescription>Import designs and sync components</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Badge variant="success" fill="subtle">
										Connected
									</Badge>
								</ItemActions>
							</Item>
							<Item variant="outline" size="xs">
								<ItemMedia variant="icon">
									<Mail />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Slack</ItemTitle>
									<ItemDescription>Send notifications to channels</ItemDescription>
								</ItemContent>
								<ItemActions>
									<Button variant="outline" size="sm">
										Connect
									</Button>
								</ItemActions>
							</Item>
						</ItemGroup>
					</div>
				</DocExampleClient>

				{/* 11 — Activity Feed */}
				<DocExampleClient
					title="Activity Feed"
					description="Activity feed items with avatars, inline action badges, and relative timestamps."
					code={examples[10].code}
					highlightedCode={html("activity-feed")}
				>
					<div className="max-w-md">
						<ItemGroup>
							{activities.map((activity) => (
								<Item key={activity.name} variant="outline" size="xs">
									<ItemMedia>
										<Avatar className="size-7">
											<AvatarImage src={activity.avatar} alt={activity.name} />
											<AvatarFallback>{activity.initials}</AvatarFallback>
										</Avatar>
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{activity.name}</ItemTitle>
										<ItemDescription>
											<Badge variant="info" fill="subtle" size="xs" className="mr-1 align-text-top">
												{activity.action}
											</Badge>
											{activity.target}
										</ItemDescription>
									</ItemContent>
									<ItemActions>
										<span className="text-muted-foreground text-xs whitespace-nowrap">
											{activity.time}
										</span>
									</ItemActions>
								</Item>
							))}
						</ItemGroup>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<div className="space-y-8">
					<div>
						<h3 className="mb-3 text-sm font-semibold text-fg">Item</h3>
						<DocPropsTable props={itemProps} />
					</div>
					<div>
						<h3 className="mb-3 text-sm font-semibold text-fg">ItemMedia</h3>
						<DocPropsTable props={itemMediaProps} />
					</div>
					<div>
						<h3 className="mb-3 text-sm font-semibold text-fg">ItemGroup</h3>
						<DocPropsTable props={itemGroupProps} />
					</div>
					<div>
						<h3 className="mb-3 text-sm font-semibold text-fg">Sub-components</h3>
						<p className="text-sm text-fg-muted">
							<code className="text-xs">ItemContent</code>, <code className="text-xs">ItemTitle</code>,{" "}
							<code className="text-xs">ItemDescription</code>, <code className="text-xs">ItemActions</code>,{" "}
							<code className="text-xs">ItemHeader</code>, <code className="text-xs">ItemFooter</code>, and{" "}
							<code className="text-xs">ItemSeparator</code> accept standard div/p props including{" "}
							<code className="text-xs">className</code> for customization.
						</p>
					</div>
				</div>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use <strong>ItemGroup</strong> to wrap items -- it provides consistent spacing and{" "}
						<code className="text-xs">role="list"</code> for accessibility.
					</li>
					<li>
						Use <strong>variant="outline"</strong> when items need clear visual boundaries (e.g. cards in a list).
					</li>
					<li>
						Use <strong>variant="muted"</strong> for highlighted or selected items.
					</li>
					<li>
						Use <strong>size="xs"</strong> inside dropdown menus or dense sidebars.
					</li>
					<li>
						Use <strong>ItemMedia variant="icon"</strong> for icons and{" "}
						<strong>variant="image"</strong> for avatars/thumbnails. Use default variant (no sizing) when
						combining with Avatar directly.
					</li>
					<li>
						Use the <strong>render</strong> prop to make items clickable links -- never wrap Item in an anchor.
					</li>
					<li>
						<strong>ItemHeader</strong> and <strong>ItemFooter</strong> span the full width and are ideal for
						metadata rows with badges, progress bars, or avatar groups.
					</li>
					<li>
						Combine with <strong>Badge</strong> in ItemActions for status indicators, role labels, or count
						badges.
					</li>
					<li>
						Use <strong>DropdownMenu</strong> in ItemActions for secondary actions on team member or resource
						lists.
					</li>
					<li>Keep ItemDescription to 2 lines max (line-clamp-2 is built in).</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Container for grouped content. Use Item inside cards for structured lists.",
						},
						{
							title: "Property",
							href: "/docs/components/ui/property",
							description: "Key-value display for metadata. Pairs well with Item for detail pages.",
						},
						{
							title: "Avatar",
							href: "/docs/components/ui/avatar",
							description: "User images that work inside ItemMedia.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "Status indicators for ItemActions.",
						},
						{
							title: "Timeline",
							href: "/docs/components/ui/timeline",
							description: "For chronological event display. Item is better for non-chronological lists.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
