"use client"

import { use } from "react"
import {
	SettingsDanger,
	SettingsHeader,
	SettingsPage,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@blazz/ui/components/ui/item"
import { Switch } from "@blazz/ui/components/ui/switch"
import { Bell, Globe, Lock, Moon, Palette, Trash2, User } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { SettingsPage, SettingsHeader, SettingsSection } from "@blazz/pro/components/blocks/settings-block"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemMedia } from "@blazz/ui/components/ui/item"
import { Switch } from "@blazz/ui/components/ui/switch"
import { Bell, Moon, Globe } from "lucide-react"

<SettingsPage>
  <SettingsHeader
    title="Settings"
    description="Manage your account preferences"
  />
  <SettingsSection title="General">
    <Item>
      <ItemMedia variant="icon"><Globe /></ItemMedia>
      <ItemContent>
        <ItemTitle>Language</ItemTitle>
        <ItemDescription>Choose your preferred language</ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-sm text-fg-muted">English</span>
      </ItemActions>
    </Item>
    <Item>
      <ItemMedia variant="icon"><Moon /></ItemMedia>
      <ItemContent>
        <ItemTitle>Dark mode</ItemTitle>
        <ItemDescription>Use dark theme across the app</ItemDescription>
      </ItemContent>
      <ItemActions><Switch /></ItemActions>
    </Item>
    <Item>
      <ItemMedia variant="icon"><Bell /></ItemMedia>
      <ItemContent>
        <ItemTitle>Notifications</ItemTitle>
        <ItemDescription>Receive email notifications</ItemDescription>
      </ItemContent>
      <ItemActions><Switch defaultChecked /></ItemActions>
    </Item>
  </SettingsSection>
</SettingsPage>`,
	},
	{
		key: "sections",
		code: `import { SettingsPage, SettingsHeader, SettingsSection } from "@blazz/pro/components/blocks/settings-block"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemMedia } from "@blazz/ui/components/ui/item"
import { Switch } from "@blazz/ui/components/ui/switch"
import { User, Lock, Palette, Bell } from "lucide-react"

<SettingsPage>
  <SettingsHeader title="Account" description="Manage your account and preferences" />
  <SettingsSection title="Profile" description="Your personal information">
    <Item>
      <ItemMedia variant="icon"><User /></ItemMedia>
      <ItemContent>
        <ItemTitle>Display name</ItemTitle>
        <ItemDescription>How others see you in the app</ItemDescription>
      </ItemContent>
      <ItemActions>
        <span className="text-sm text-fg-muted">Sophie Martin</span>
      </ItemActions>
    </Item>
  </SettingsSection>
  <SettingsSection title="Security" description="Authentication and access">
    <Item>
      <ItemMedia variant="icon"><Lock /></ItemMedia>
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription>Add an extra layer of security</ItemDescription>
      </ItemContent>
      <ItemActions><Switch /></ItemActions>
    </Item>
  </SettingsSection>
</SettingsPage>`,
	},
	{
		key: "danger",
		code: `import { SettingsPage, SettingsHeader, SettingsSection, SettingsDanger } from "@blazz/pro/components/blocks/settings-block"
import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@blazz/ui/components/ui/item"
import { Button } from "@blazz/ui/components/ui/button"
import { Trash2 } from "lucide-react"

<SettingsPage>
  <SettingsHeader title="Account" />
  <SettingsSection title="General">
    <Item>
      <ItemContent>
        <ItemTitle>Export data</ItemTitle>
        <ItemDescription>Download a copy of all your data</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">Export</Button>
      </ItemActions>
    </Item>
  </SettingsSection>
  <SettingsDanger title="Danger zone" description="Irreversible actions">
    <Item>
      <ItemContent>
        <ItemTitle>Delete account</ItemTitle>
        <ItemDescription>Permanently delete your account and all data</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="destructive" size="sm">
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </ItemActions>
    </Item>
  </SettingsDanger>
</SettingsPage>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const settingsPageProps: DocProp[] = [
	{
		name: "children",
		type: "ReactNode",
		description: "Content — typically SettingsHeader and SettingsSection components.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root container.",
	},
]

const settingsHeaderProps: DocProp[] = [
	{
		name: "title",
		type: "ReactNode",
		required: true,
		description: "Main heading text.",
	},
	{
		name: "description",
		type: "ReactNode",
		description: "Secondary text below the title.",
	},
	{
		name: "children",
		type: "ReactNode",
		description: "Extra content rendered to the right of the title (e.g. action buttons).",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes.",
	},
]

const settingsSectionProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		required: true,
		description: "Section heading.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description text below the section title.",
	},
	{
		name: "children",
		type: "ReactNode",
		description:
			"Section content — use Item components for each setting row. Rendered inside an ItemGroup with bordered card styling. ItemSeparator is automatically inserted between each child.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes on the wrapping <section>.",
	},
]

const settingsDangerProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Danger zone"',
		description: "Section heading, defaults to 'Danger zone'.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description text below the title.",
	},
	{
		name: "children",
		type: "ReactNode",
		description:
			"Section content — use Item components for destructive actions. Rendered inside an ItemGroup with red-tinted border and background. ItemSeparator is automatically inserted between each child.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes on the wrapping <section>.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "settings-page-props", title: "SettingsPage Props" },
	{ id: "settings-header-props", title: "SettingsHeader Props" },
	{ id: "settings-section-props", title: "SettingsSection Props" },
	{ id: "settings-danger-props", title: "SettingsDanger Props" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Hero demo
// ---------------------------------------------------------------------------

function SettingsBlockHeroDemo() {
	return (
		<div className="w-full max-w-2xl">
			<SettingsPage>
				<SettingsHeader title="Settings" description="Manage your account preferences" />
				<SettingsSection title="Appearance">
					<Item>
						<ItemMedia variant="icon">
							<Moon />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Dark mode</ItemTitle>
							<ItemDescription>Use dark theme across the app</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Switch />
						</ItemActions>
					</Item>
					<Item>
						<ItemMedia variant="icon">
							<Palette />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Accent color</ItemTitle>
							<ItemDescription>Customize the primary color</ItemDescription>
						</ItemContent>
						<ItemActions>
							<span className="text-sm text-fg-muted">Indigo</span>
						</ItemActions>
					</Item>
				</SettingsSection>
				<SettingsSection title="Notifications">
					<Item>
						<ItemMedia variant="icon">
							<Bell />
						</ItemMedia>
						<ItemContent>
							<ItemTitle>Email notifications</ItemTitle>
							<ItemDescription>Receive updates via email</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Switch defaultChecked />
						</ItemActions>
					</Item>
				</SettingsSection>
				<SettingsDanger>
					<Item>
						<ItemContent>
							<ItemTitle>Delete account</ItemTitle>
							<ItemDescription>Permanently delete your account and all data</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button variant="destructive" size="sm">
								<Trash2 className="size-3.5" />
								Delete
							</Button>
						</ItemActions>
					</Item>
				</SettingsDanger>
			</SettingsPage>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsBlockPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Settings Block"
			subtitle="A compound component for building structured settings pages. Uses ItemGroup and ItemSeparator internally to wrap Item rows inside bordered sections with automatic dividers — including a danger zone variant."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<SettingsBlockHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A settings page with a header and a single section containing Item rows with icons and controls."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-2xl">
						<SettingsPage>
							<SettingsHeader title="Settings" description="Manage your account preferences" />
							<SettingsSection title="General">
								<Item>
									<ItemMedia variant="icon">
										<Globe />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Language</ItemTitle>
										<ItemDescription>Choose your preferred language</ItemDescription>
									</ItemContent>
									<ItemActions>
										<span className="text-sm text-fg-muted">English</span>
									</ItemActions>
								</Item>
								<Item>
									<ItemMedia variant="icon">
										<Moon />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Dark mode</ItemTitle>
										<ItemDescription>Use dark theme across the app</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Switch />
									</ItemActions>
								</Item>
								<Item>
									<ItemMedia variant="icon">
										<Bell />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Notifications</ItemTitle>
										<ItemDescription>Receive email notifications</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Switch defaultChecked />
									</ItemActions>
								</Item>
							</SettingsSection>
						</SettingsPage>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Multiple Sections"
					description="Use multiple SettingsSection components to group related settings together, each with its own title and description."
					code={examples[1].code}
					highlightedCode={html("sections")}
				>
					<div className="w-full max-w-2xl">
						<SettingsPage>
							<SettingsHeader title="Account" description="Manage your account and preferences" />
							<SettingsSection title="Profile" description="Your personal information">
								<Item>
									<ItemMedia variant="icon">
										<User />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Display name</ItemTitle>
										<ItemDescription>How others see you in the app</ItemDescription>
									</ItemContent>
									<ItemActions>
										<span className="text-sm text-fg-muted">Sophie Martin</span>
									</ItemActions>
								</Item>
							</SettingsSection>
							<SettingsSection title="Security" description="Authentication and access">
								<Item>
									<ItemMedia variant="icon">
										<Lock />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>Two-factor authentication</ItemTitle>
										<ItemDescription>Add an extra layer of security</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Switch />
									</ItemActions>
								</Item>
							</SettingsSection>
						</SettingsPage>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Danger Zone"
					description="Use SettingsDanger for destructive or irreversible actions. It renders with a red-tinted border and background."
					code={examples[2].code}
					highlightedCode={html("danger")}
				>
					<div className="w-full max-w-2xl">
						<SettingsPage>
							<SettingsHeader title="Account" />
							<SettingsSection title="General">
								<Item>
									<ItemContent>
										<ItemTitle>Export data</ItemTitle>
										<ItemDescription>Download a copy of all your data</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Button variant="outline" size="sm">
											Export
										</Button>
									</ItemActions>
								</Item>
							</SettingsSection>
							<SettingsDanger title="Danger zone" description="Irreversible actions">
								<Item>
									<ItemContent>
										<ItemTitle>Delete account</ItemTitle>
										<ItemDescription>Permanently delete your account and all data</ItemDescription>
									</ItemContent>
									<ItemActions>
										<Button variant="destructive" size="sm">
											<Trash2 className="size-3.5" />
											Delete
										</Button>
									</ItemActions>
								</Item>
							</SettingsDanger>
						</SettingsPage>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* SettingsPage Props */}
			<DocSection id="settings-page-props" title="SettingsPage Props">
				<DocPropsTable props={settingsPageProps} />
			</DocSection>

			{/* SettingsHeader Props */}
			<DocSection id="settings-header-props" title="SettingsHeader Props">
				<DocPropsTable props={settingsHeaderProps} />
			</DocSection>

			{/* SettingsSection Props */}
			<DocSection id="settings-section-props" title="SettingsSection Props">
				<DocPropsTable props={settingsSectionProps} />
			</DocSection>

			{/* SettingsDanger Props */}
			<DocSection id="settings-danger-props" title="SettingsDanger Props">
				<DocPropsTable props={settingsDangerProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Item",
							href: "/docs/components/ui/item",
							description: "The row component used inside settings sections.",
						},
						{
							title: "Item Group",
							href: "/docs/components/ui/item",
							description:
								"The grouping primitive used internally by SettingsSection and SettingsDanger.",
						},
						{
							title: "Detail Panel",
							href: "/docs/blocks/detail-panel",
							description: "Structured detail views with header and sections.",
						},
						{
							title: "Property Card",
							href: "/docs/blocks/property-card",
							description: "Compact card for displaying key-value properties.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
