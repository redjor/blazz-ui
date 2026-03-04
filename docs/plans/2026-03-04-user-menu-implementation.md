# UserMenu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `patterns/user-menu.tsx` to be callback-driven (remove Next.js deps), then create its documentation page and add it to the nav.

**Architecture:** Three sequential tasks — refactor the component, create the doc page, update the nav config. No new files in `packages/ui/` beyond the refactored component. Doc page mirrors `blocks/org-menu.tsx` structure.

**Tech Stack:** React 19, TypeScript strict, TanStack Router (docs app), `@blazz/ui` components, Shiki (code highlighting via `highlightCode` loader function)

---

### Task 1: Refactor `patterns/user-menu.tsx`

**Files:**
- Modify: `packages/ui/src/components/patterns/user-menu.tsx`

**Step 1: Read the current file**

Read `packages/ui/src/components/patterns/user-menu.tsx` to confirm the current state before editing.

**Step 2: Rewrite the component**

Replace the entire file with the following:

```tsx
"use client"

import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export interface UserMenuUser {
	name: string
	email?: string
	avatar?: string
	role?: string
}

export interface UserMenuProps {
	user?: UserMenuUser
	onProfile?: () => void
	onSettings?: () => void
	onLogout?: () => void
	className?: string
}

function getUserInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

export function UserMenu({ user, onProfile, onSettings, onLogout, className }: UserMenuProps) {
	const displayName = user?.name ?? "Jean Dupont"
	const displayRole = user?.role ?? "Administrateur"
	const initials = getUserInitials(displayName)

	const hasActions = onProfile || onSettings
	const hasDestructive = Boolean(onLogout)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
			>
				<Avatar>
					<AvatarImage src={user?.avatar} alt={displayName} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col text-left">
					<div className="flex items-center gap-1.5">
						<span className="text-sm font-semibold text-fg">{displayName}</span>
						<Badge variant="default" size="xs">Pro</Badge>
					</div>
					<span className="text-xs text-fg-muted">{displayRole}</span>
				</div>
				<ChevronDown className="size-3.5 shrink-0 text-fg-muted" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end" sideOffset={8}>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<Avatar className="size-8">
						<AvatarImage src={user?.avatar} alt={displayName} />
						<AvatarFallback className="bg-brand/20 text-xs font-semibold text-brand">
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left leading-tight">
						<span className="truncate text-sm font-semibold text-fg">{displayName}</span>
						{displayRole && (
							<span className="truncate text-xs text-fg-muted font-medium">{displayRole}</span>
						)}
					</div>
				</div>

				{hasActions && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{onProfile && (
								<DropdownMenuItem onClick={onProfile}>
									<UserIcon className="mr-2 size-4" />
									Profil
								</DropdownMenuItem>
							)}
							{onSettings && (
								<DropdownMenuItem onClick={onSettings}>
									<Settings className="mr-2 size-4" />
									Paramètres
								</DropdownMenuItem>
							)}
						</DropdownMenuGroup>
					</>
				)}

				{hasDestructive && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={onLogout}
								className="text-negative focus:text-negative"
							>
								<LogOut className="mr-2 size-4" />
								Se déconnecter
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
```

**Step 3: Verify the TypeScript compiles**

Run from monorepo root:
```bash
pnpm --filter @blazz/ui build
```
Expected: build succeeds with no errors.

**Step 4: Commit**

```bash
git add packages/ui/src/components/patterns/user-menu.tsx
git commit -m "refactor(ui): make UserMenu callback-driven, remove next/navigation"
```

---

### Task 2: Create the doc page

**Files:**
- Create: `apps/docs/src/routes/_docs/docs/components/patterns/user-menu.tsx`

**Step 1: Write the file**

Create `apps/docs/src/routes/_docs/docs/components/patterns/user-menu.tsx`:

```tsx
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
		description: "User data to display. Falls back to default placeholder if not provided.",
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
		description: 'Shows "Se déconnecter" action when provided. Rendered in a destructive style.',
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
		description: "User email. Not currently displayed but available for future use.",
	},
	{
		name: "avatar",
		type: "string",
		description: "Avatar image URL. Falls back to initials when not provided.",
	},
	{
		name: "role",
		type: "string",
		description: 'Role label shown below the name (e.g. "Administrateur", "Manager").',
	},
]

function BasicDemo() {
	return (
		<UserMenu
			user={mockUser}
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
			{/* Hero */}
			<DocHero>
				<BasicDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="Full configuration: user info, profile, settings and logout."
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
					description="No callbacks provided — no action items are rendered. Useful for read-only contexts."
					code={examples[3].code}
					highlightedCode={html("minimal")}
				>
					<MinimalDemo />
				</DocExampleClient>
			</DocSection>

			{/* Props */}
			<DocSection id="user-menu-props" title="UserMenu Props">
				<DocPropsTable props={userMenuProps} />
			</DocSection>

			{/* UserMenuUser Type */}
			<DocSection id="user-menu-user-type" title="UserMenuUser Type">
				<DocPropsTable props={userMenuUserProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Place in the top bar (align="end") or sidebar footer — never both</li>
					<li>Always wire onLogout to your auth provider's signOut — never handle it inline</li>
					<li>Keep the role label short (1-2 words): "Admin", "Manager", "Viewer"</li>
					<li>Use round avatars (rounded-full) here to differentiate from org avatars (rounded-lg)</li>
					<li>Omit onSettings for users without settings access rather than disabling the item</li>
				</ul>
			</DocSection>

			{/* Related */}
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
```

**Step 2: Start the docs app and verify visually**

```bash
pnpm dev:docs
```

Navigate to `http://localhost:3100/docs/components/patterns/user-menu`. Verify:
- Page renders without errors
- Hero shows the dropdown trigger
- All 4 examples render and open on click
- Props tables are populated
- No TypeScript errors in console

**Step 3: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/user-menu.tsx
git commit -m "docs: add UserMenu documentation page"
```

---

### Task 3: Add UserMenu to the navigation config

**Files:**
- Modify: `apps/docs/src/config/navigation.ts`

**Step 1: Read the file**

Read `apps/docs/src/config/navigation.ts` and locate the `pat-utilities` section (around line 559).

**Step 2: Add the nav entry**

In the `pat-utilities` items array, add after the `Page Header Shell` entry:

```ts
{
  title: "User Menu",
  url: "/docs/components/patterns/user-menu",
  keywords: ["user", "account", "profile", "logout", "avatar menu", "user dropdown"],
},
```

**Step 3: Verify the docs sidebar shows the new entry**

With `pnpm dev:docs` running, reload the browser. Confirm "User Menu" appears under Patterns → Utilities in the sidebar and links to the correct page.

**Step 4: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "docs: add UserMenu to patterns navigation"
```
