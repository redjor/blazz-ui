"use client"

import { Page } from "@/components/ui/page"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { User, Settings, CreditCard } from "lucide-react"

const tabsProps: PropDefinition[] = [
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

const tabsListProps: PropDefinition[] = [
	{
		name: "variant",
		type: '"default" | "line"',
		default: '"default"',
		description: "The visual style of the tabs list.",
	},
]

export default function TabsPage() {
	return (
		<Page
			title="Tabs"
			subtitle="Organize content into separate views where only one view is visible at a time."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="Basic tabs with content panels."
						code={`<Tabs defaultValue="account">
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
</Tabs>`}
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
										<CardDescription>
											Make changes to your account here.
										</CardDescription>
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
					</ComponentExample>

					<ComponentExample
						title="Line Variant"
						description="Tabs with an underline indicator."
						code={`<Tabs defaultValue="profile">
  <TabsList variant="line">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  ...
</Tabs>`}
					>
						<Tabs defaultValue="profile" className="w-full max-w-md">
							<TabsList variant="line">
								<TabsTrigger value="profile">Profile</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
								<TabsTrigger value="billing">Billing</TabsTrigger>
							</TabsList>
							<TabsContent value="profile" className="pt-4">
								<p className="text-sm text-muted-foreground">
									Your profile information and settings.
								</p>
							</TabsContent>
							<TabsContent value="settings" className="pt-4">
								<p className="text-sm text-muted-foreground">
									Application settings and preferences.
								</p>
							</TabsContent>
							<TabsContent value="billing" className="pt-4">
								<p className="text-sm text-muted-foreground">
									Manage your billing and subscription.
								</p>
							</TabsContent>
						</Tabs>
					</ComponentExample>

					<ComponentExample
						title="With Icons"
						description="Add icons to tab triggers for visual context."
						code={`<TabsList>
  <TabsTrigger value="profile">
    <User /> Profile
  </TabsTrigger>
  <TabsTrigger value="settings">
    <Settings /> Settings
  </TabsTrigger>
</TabsList>`}
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
								<p className="text-sm text-muted-foreground">Manage your profile.</p>
							</TabsContent>
							<TabsContent value="settings" className="pt-4">
								<p className="text-sm text-muted-foreground">Configure settings.</p>
							</TabsContent>
							<TabsContent value="billing" className="pt-4">
								<p className="text-sm text-muted-foreground">Manage billing.</p>
							</TabsContent>
						</Tabs>
					</ComponentExample>

					<ComponentExample
						title="Vertical"
						description="Tabs arranged vertically."
						code={`<Tabs defaultValue="general" orientation="vertical">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  ...
</Tabs>`}
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
										<p className="text-sm text-muted-foreground">
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
										<p className="text-sm text-muted-foreground">
											Manage your security preferences.
										</p>
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="notifications" className="flex-1">
								<Card>
									<CardHeader>
										<CardTitle>Notification Settings</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											Control your notification preferences.
										</p>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Tabs Props</h2>
					<PropsTable props={tabsProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">TabsList Props</h2>
					<PropsTable props={tabsListProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use tabs to organize related content into logical sections</li>
						<li>Keep tab labels short and descriptive</li>
						<li>Don't use tabs for sequential steps - use a stepper instead</li>
						<li>Limit to 5-7 tabs maximum for usability</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
