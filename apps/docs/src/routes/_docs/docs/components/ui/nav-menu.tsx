import { createFileRoute } from "@tanstack/react-router"
import {
	Home,
	Settings,
	Users,
	CreditCard,
	Bell,
	Shield,
	Palette,
	Mail,
} from "lucide-react"
import { NavMenu, NavMenuGroup, NavMenuItem, NavMenuSeparator } from "@blazz/ui/components/ui/nav-menu"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@blazz/ui/components/ui/dialog"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight.server"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "best-practices", title: "Best Practices" },
]

const navMenuItemProps: DocProp[] = [
	{
		name: "active",
		type: "boolean",
		default: "false",
		description: "Highlights the item as the currently active navigation target.",
	},
	{
		name: "asChild",
		type: "boolean",
		default: "false",
		description:
			"Renders the child element instead of the default anchor. Use with Next.js Link or router components.",
	},
]

const navMenuGroupProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Optional heading displayed above the group items.",
	},
]

const examples = [
	{
		key: "basic",
		code: `<NavMenu>
  <NavMenuItem href="/dashboard" active>
    <Home /> <span>Dashboard</span>
  </NavMenuItem>
  <NavMenuItem href="/team">
    <Users /> <span>Team</span>
  </NavMenuItem>
  <NavMenuItem href="/settings">
    <Settings /> <span>Settings</span>
  </NavMenuItem>
</NavMenu>`,
	},
	{
		key: "groups",
		code: `<NavMenu>
  <NavMenuGroup label="Account">
    <NavMenuItem href="/profile" active>
      <Users /> <span>Profile</span>
    </NavMenuItem>
    <NavMenuItem href="/notifications">
      <Bell /> <span>Notifications</span>
    </NavMenuItem>
  </NavMenuGroup>
  <NavMenuSeparator />
  <NavMenuGroup label="Billing">
    <NavMenuItem href="/plans">
      <CreditCard /> <span>Plans</span>
    </NavMenuItem>
  </NavMenuGroup>
</NavMenu>`,
	},
	{
		key: "no-icons",
		code: `<NavMenu>
  <NavMenuGroup label="Settings">
    <NavMenuItem href="/general" active>General</NavMenuItem>
    <NavMenuItem href="/security">Security</NavMenuItem>
    <NavMenuItem href="/appearance">Appearance</NavMenuItem>
  </NavMenuGroup>
</NavMenu>`,
	},
	{
		key: "in-dialog",
		code: `<Dialog>
  <DialogTrigger render={<Button />}>
    Settings
  </DialogTrigger>
  <DialogContent size="lg">
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
    </DialogHeader>
    <div className="flex gap-4">
      <NavMenu className="w-40 shrink-0">
        <NavMenuItem active>General</NavMenuItem>
        <NavMenuItem>Security</NavMenuItem>
        <NavMenuItem>Appearance</NavMenuItem>
      </NavMenu>
      <div className="flex-1">Content here</div>
    </div>
  </DialogContent>
</Dialog>`,
	},
	{
		key: "sidebar",
		code: `<div className="flex">
  <aside className="w-56 shrink-0 border-r p-4">
    <NavMenu>
      <NavMenuGroup label="General">
        <NavMenuItem href="/settings/profile" active>
          <Users /> <span>Profile</span>
        </NavMenuItem>
        <NavMenuItem href="/settings/team">
          <Users /> <span>Team</span>
        </NavMenuItem>
      </NavMenuGroup>
    </NavMenu>
  </aside>
  <main className="flex-1 p-6">Content</main>
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/nav-menu")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: NavMenuPage,
})

function NavMenuPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Nav Menu"
			subtitle="Lightweight vertical navigation menu. Use in page sidebars, dialogs, sheets, or any panel that needs a list of links."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-48">
					<NavMenu>
						<NavMenuGroup label="General">
							<NavMenuItem href="#" active>
								<Home /> <span>Dashboard</span>
							</NavMenuItem>
							<NavMenuItem href="#">
								<Users /> <span>Team</span>
							</NavMenuItem>
							<NavMenuItem href="#">
								<Settings /> <span>Settings</span>
							</NavMenuItem>
						</NavMenuGroup>
					</NavMenu>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple navigation menu with an active item."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-48">
						<NavMenu>
							<NavMenuItem href="#" active>
								<Home /> <span>Dashboard</span>
							</NavMenuItem>
							<NavMenuItem href="#">
								<Users /> <span>Team</span>
							</NavMenuItem>
							<NavMenuItem href="#">
								<Settings /> <span>Settings</span>
							</NavMenuItem>
						</NavMenu>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Groups"
					description="Organize items into labeled sections with separators."
					code={examples[1].code}
					highlightedCode={html("groups")}
				>
					<div className="w-48">
						<NavMenu>
							<NavMenuGroup label="Account">
								<NavMenuItem href="#" active>
									<Users /> <span>Profile</span>
								</NavMenuItem>
								<NavMenuItem href="#">
									<Bell /> <span>Notifications</span>
								</NavMenuItem>
								<NavMenuItem href="#">
									<Mail /> <span>Email</span>
								</NavMenuItem>
							</NavMenuGroup>
							<NavMenuSeparator />
							<NavMenuGroup label="Billing">
								<NavMenuItem href="#">
									<CreditCard /> <span>Plans</span>
								</NavMenuItem>
							</NavMenuGroup>
						</NavMenu>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Without Icons"
					description="Items work fine without icons for simpler menus."
					code={examples[2].code}
					highlightedCode={html("no-icons")}
				>
					<div className="w-48">
						<NavMenu>
							<NavMenuGroup label="Settings">
								<NavMenuItem href="#" active>
									General
								</NavMenuItem>
								<NavMenuItem href="#">Security</NavMenuItem>
								<NavMenuItem href="#">Appearance</NavMenuItem>
							</NavMenuGroup>
						</NavMenu>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Inside a Dialog"
					description="NavMenu works in any context — here inside a dialog for a settings panel."
					code={examples[3].code}
					highlightedCode={html("in-dialog")}
				>
					<Dialog>
						<DialogTrigger render={<Button />}>Open Settings</DialogTrigger>
						<DialogContent size="lg">
							<DialogHeader>
								<DialogTitle>Settings</DialogTitle>
								<DialogDescription>Manage your account preferences.</DialogDescription>
							</DialogHeader>
							<div className="flex gap-4">
								<NavMenu className="w-40 shrink-0">
									<NavMenuItem active>
										<Settings /> <span>General</span>
									</NavMenuItem>
									<NavMenuItem>
										<Shield /> <span>Security</span>
									</NavMenuItem>
									<NavMenuItem>
										<Palette /> <span>Appearance</span>
									</NavMenuItem>
									<NavMenuItem>
										<Bell /> <span>Notifications</span>
									</NavMenuItem>
								</NavMenu>
								<div className="flex-1 text-sm text-fg-muted">
									<p>Select a section from the menu to configure your settings.</p>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</DocExampleClient>

				<DocExampleClient
					title="Page Sidebar"
					description="Use as a sticky sidebar in a page layout with border."
					code={examples[4].code}
					highlightedCode={html("sidebar")}
				>
					<div className="flex w-full rounded-lg border bg-surface">
						<aside className="w-48 shrink-0 border-r p-3">
							<NavMenu>
								<NavMenuGroup label="General">
									<NavMenuItem href="#" active>
										<Users /> <span>Profile</span>
									</NavMenuItem>
									<NavMenuItem href="#">
										<Shield /> <span>Security</span>
									</NavMenuItem>
								</NavMenuGroup>
								<NavMenuSeparator />
								<NavMenuGroup label="Preferences">
									<NavMenuItem href="#">
										<Palette /> <span>Appearance</span>
									</NavMenuItem>
									<NavMenuItem href="#">
										<Bell /> <span>Notifications</span>
									</NavMenuItem>
								</NavMenuGroup>
							</NavMenu>
						</aside>
						<div className="flex-1 p-4 text-sm text-fg-muted">
							<p>Page content goes here.</p>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "NavMenuItem", props: navMenuItemProps },
						{ title: "NavMenuGroup", props: navMenuGroupProps },
					]}
				/>
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use NavMenu for secondary navigation within a page, not for app-level navigation</li>
					<li>Group related items with NavMenuGroup and use labels to provide context</li>
					<li>Use the asChild prop with Next.js Link for client-side navigation</li>
					<li>Keep menus short — if you have more than 10 items, consider splitting into tabs</li>
					<li>The parent controls width and positioning — NavMenu is layout-agnostic</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
