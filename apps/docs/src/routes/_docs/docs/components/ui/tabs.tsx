import { Button } from "@blazz/ui/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { createFileRoute } from "@tanstack/react-router"
import { CreditCard, Settings, User } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "tabs-props", title: "Tabs Props" },
	{ id: "tabslist-props", title: "TabsList Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
]

const tabsProps: DocProp[] = [
	{
		name: "defaultValue",
		type: "string",
		description: "The value of the tab that should be active by default.",
	},
	{
		name: "value",
		type: "string",
		description: "The controlled value of the active tab.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when the active tab changes.",
	},
	{
		name: "orientation",
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description: "The orientation of the tabs.",
	},
]

const tabsListProps: DocProp[] = [
	{
		name: "variant",
		type: '"default" | "line"',
		default: '"default"',
		description: "The visual style of the tabs list.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account content here.
  </TabsContent>
  <TabsContent value="password">
    Password content here.
  </TabsContent>
</Tabs>`,
	},
	{
		key: "line",
		code: `<Tabs defaultValue="profile">
  <TabsList variant="line">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  ...
</Tabs>`,
	},
	{
		key: "with-icons",
		code: `<TabsList>
  <TabsTrigger value="profile">
    <User /> Profile
  </TabsTrigger>
  <TabsTrigger value="settings">
    <Settings /> Settings
  </TabsTrigger>
</TabsList>`,
	},
	{
		key: "vertical",
		code: `<Tabs defaultValue="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  ...
</Tabs>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/tabs")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TabsPage,
})

function TabsPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Tabs"
			subtitle="Organize content into separate views where only one view is visible at a time."
			toc={toc}
		>
			<DocHero>
				<Tabs defaultValue="account" className="w-full max-w-sm">
					<TabsList>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="password">Password</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
				</Tabs>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="Basic tabs with content panels."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Tabs defaultValue="account" className="w-full max-w-md">
						<TabsList>
							<TabsTrigger value="account">Account</TabsTrigger>
							<TabsTrigger value="password">Password</TabsTrigger>
						</TabsList>
						<TabsContent value="account">
							<Card>
								<CardHeader>
									<CardTitle>Account</CardTitle>
									<CardDescription>Make changes to your account here.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input id="name" defaultValue="John Doe" />
									</div>
									<Button>Save changes</Button>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="password">
							<Card>
								<CardHeader>
									<CardTitle>Password</CardTitle>
									<CardDescription>Change your password here.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="current">Current password</Label>
										<Input id="current" type="password" />
									</div>
									<Button>Update password</Button>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</DocExampleClient>

				<DocExampleClient
					title="Line Variant"
					description="Tabs with an underline indicator."
					code={examples[1].code}
					highlightedCode={html("line")}
				>
					<Tabs defaultValue="profile" className="w-full max-w-md">
						<TabsList variant="line">
							<TabsTrigger value="profile">Profile</TabsTrigger>
							<TabsTrigger value="settings">Settings</TabsTrigger>
							<TabsTrigger value="billing">Billing</TabsTrigger>
						</TabsList>
						<TabsContent value="profile" className="pt-4">
							<p className="text-sm text-fg-muted">Your profile information and settings.</p>
						</TabsContent>
						<TabsContent value="settings" className="pt-4">
							<p className="text-sm text-fg-muted">Application settings and preferences.</p>
						</TabsContent>
						<TabsContent value="billing" className="pt-4">
							<p className="text-sm text-fg-muted">Manage your billing and subscription.</p>
						</TabsContent>
					</Tabs>
				</DocExampleClient>

				<DocExampleClient
					title="With Icons"
					description="Add icons to tab triggers for visual context."
					code={examples[2].code}
					highlightedCode={html("with-icons")}
				>
					<Tabs defaultValue="profile" className="w-full max-w-md">
						<TabsList>
							<TabsTrigger value="profile">
								<User /> Profile
							</TabsTrigger>
							<TabsTrigger value="settings">
								<Settings /> Settings
							</TabsTrigger>
							<TabsTrigger value="billing">
								<CreditCard /> Billing
							</TabsTrigger>
						</TabsList>
						<TabsContent value="profile" className="pt-4">
							<p className="text-sm text-fg-muted">Manage your profile.</p>
						</TabsContent>
						<TabsContent value="settings" className="pt-4">
							<p className="text-sm text-fg-muted">Configure settings.</p>
						</TabsContent>
						<TabsContent value="billing" className="pt-4">
							<p className="text-sm text-fg-muted">Manage billing.</p>
						</TabsContent>
					</Tabs>
				</DocExampleClient>

				<DocExampleClient
					title="Vertical"
					description="Tabs arranged vertically."
					code={examples[3].code}
					highlightedCode={html("vertical")}
				>
					<Tabs defaultValue="general" orientation="vertical" className="w-full max-w-lg">
						<TabsList>
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="security">Security</TabsTrigger>
							<TabsTrigger value="notifications">Notifications</TabsTrigger>
						</TabsList>
						<TabsContent value="general" className="flex-1">
							<Card>
								<CardHeader>
									<CardTitle>General Settings</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">
										Configure your general application settings.
									</p>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="security" className="flex-1">
							<Card>
								<CardHeader>
									<CardTitle>Security Settings</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">Manage your security preferences.</p>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="notifications" className="flex-1">
							<Card>
								<CardHeader>
									<CardTitle>Notification Settings</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">Control your notification preferences.</p>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</DocExampleClient>
			</DocSection>

			<DocSection id="tabs-props" title="Tabs Props">
				<DocPropsTable props={tabsProps} />
			</DocSection>

			<DocSection id="tabslist-props" title="TabsList Props">
				<DocPropsTable props={tabsListProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Tabs uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-raised</code> - Tab list background color
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> - Inactive tab text
					</li>
					<li>
						<code className="text-xs">bg-surface</code> - Active tab background
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Active tab text
					</li>
					<li>
						<code className="text-xs">shadow-sm</code> - Active tab shadow
					</li>
					<li>
						<code className="text-xs">rounded-md</code> - Tab list and trigger radius
					</li>
					<li>
						<code className="text-xs">gap-1</code> - Spacing between tabs (0.25rem)
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use tabs to organize related content into logical sections</li>
					<li>Keep tab labels short and descriptive</li>
					<li>Don't use tabs for sequential steps - use a stepper instead</li>
					<li>Limit to 5-7 tabs maximum for usability</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
