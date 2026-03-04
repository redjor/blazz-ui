import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { UserMenu } from "@blazz/ui/components/patterns/user-menu"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "user-menu-props", title: "UserMenu Props" },
	{ id: "user-menu-user-type", title: "UserMenuUser Type" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const mockUser = {
	name: "Sophie Martin",
	email: "sophie@acme.com",
	role: "Administratrice",
}

const mockUserWithAvatar = {
	name: "Alex Dupont",
	email: "alex@acme.com",
	role: "Manager",
	avatar: "https://i.pravatar.cc/150?u=alex",
}

const examples = [
	{
		key: "basic",
		code: `<UserMenu
  user={{ name: "Sophie Martin", email: "sophie@acme.com", role: "Administratrice" }}
  badge="Pro"
  onProfile={() => router.push("/settings/profile")}
  onSettings={() => router.push("/settings")}
  onLogout={async () => {
    await signOut()
    router.push("/login")
  }}
/>`,
	},
	{
		key: "profile-only",
		code: `// Only show Profile — no Settings, no Logout
<UserMenu
  user={{ name: "Sophie Martin", role: "Viewer" }}
  onProfile={() => router.push("/profile")}
/>`,
	},
	{
		key: "with-avatar",
		code: `<UserMenu
  user={{
    name: "Alex Dupont",
    role: "Manager",
    avatar: "https://cdn.acme.com/avatars/alex.jpg",
  }}
  badge="Pro"
  onProfile={() => router.push("/profile")}
  onSettings={() => router.push("/settings")}
  onLogout={signOut}
/>`,
	},
	{
		key: "minimal",
		code: `// No actions — display only (e.g. read-only context)
<UserMenu user={{ name: "Sophie Martin", role: "Administratrice" }} />`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/user-menu")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: UserMenuPage,
})

const userMenuProps: DocProp[] = [
	{
		name: "user",
		type: "UserMenuUser",
		description: "User data to display. Name, role, avatar and email.",
	},
	{
		name: "badge",
		type: "string",
		description: 'Optional badge label shown next to the name (e.g. "Pro", "Admin").',
	},
	{
		name: "onProfile",
		type: "() => void",
		description: 'Shows "Profil" action when provided.',
	},
	{
		name: "onSettings",
		type: "() => void",
		description: 'Shows "Paramètres" action when provided.',
	},
	{
		name: "onLogout",
		type: "() => void",
		description: 'Shows "Se déconnecter" action when provided. Rendered in destructive style.',
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the trigger button.",
	},
]

const userMenuUserProps: DocProp[] = [
	{
		name: "name",
		type: "string",
		required: true,
		description: "Display name. Used to generate initials as fallback.",
	},
	{
		name: "email",
		type: "string",
		description: "User email. Available for consumer use.",
	},
	{
		name: "avatar",
		type: "string",
		description: "Avatar image URL. Falls back to initials when not provided.",
	},
	{
		name: "role",
		type: "string",
		description: 'Role label shown below the name (e.g. "Admin", "Manager", "Viewer").',
	},
]

function BasicDemo() {
	return (
		<UserMenu
			user={mockUser}
			badge="Pro"
			onProfile={() => {}}
			onSettings={() => {}}
			onLogout={() => {}}
		/>
	)
}

function ProfileOnlyDemo() {
	return (
		<UserMenu
			user={{ name: "Sophie Martin", role: "Viewer" }}
			onProfile={() => {}}
		/>
	)
}

function WithAvatarDemo() {
	return (
		<UserMenu
			user={mockUserWithAvatar}
			badge="Pro"
			onProfile={() => {}}
			onSettings={() => {}}
			onLogout={() => {}}
		/>
	)
}

function MinimalDemo() {
	return <UserMenu user={mockUser} />
}

function UserMenuPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="UserMenu"
			subtitle="A user account dropdown for the top bar or sidebar footer. Shows name, role and avatar, with configurable actions for profile, settings and logout."
			toc={toc}
		>
			<DocHero>
				<BasicDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="Full configuration: user info, badge, profile, settings and logout."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Profile Only"
					description="Omit onSettings and onLogout to hide those actions. Useful for restricted roles."
					code={examples[1].code}
					highlightedCode={html("profile-only")}
				>
					<ProfileOnlyDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Avatar"
					description="Provide an avatar URL to replace the initials fallback."
					code={examples[2].code}
					highlightedCode={html("with-avatar")}
				>
					<WithAvatarDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Minimal (display only)"
					description="No callbacks — no action items rendered. Useful for read-only contexts."
					code={examples[3].code}
					highlightedCode={html("minimal")}
				>
					<MinimalDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="user-menu-props" title="UserMenu Props">
				<DocPropsTable props={userMenuProps} />
			</DocSection>

			<DocSection id="user-menu-user-type" title="UserMenuUser Type">
				<DocPropsTable props={userMenuUserProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Place in the top bar (align="end") or sidebar footer — never both</li>
					<li>Always wire onLogout to your auth provider's signOut — never handle it inline</li>
					<li>Keep the role label short (1-2 words): "Admin", "Manager", "Viewer"</li>
					<li>Use the badge prop to surface plan or role tier next to the user's name</li>
					<li>Omit onSettings for users without settings access rather than disabling the item</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "OrgMenu",
							href: "/docs/components/blocks/org-menu",
							description: "Workspace/organization switcher — pair with UserMenu in the sidebar.",
						},
						{
							title: "DropdownMenu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Underlying primitive for the menu.",
						},
						{
							title: "Avatar",
							href: "/docs/components/ui/avatar",
							description: "Used for user avatars and initials fallback.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
