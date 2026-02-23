"use client"

import { useState } from "react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	DocPropsTable,
	type DocProp,
} from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { OrgMenu } from "@/components/blocks/org-menu"
import type { Organization } from "@/components/blocks/org-menu"

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "org-menu-props", title: "OrgMenu Props" },
	{ id: "organization-type", title: "Organization Type" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const organizations: Organization[] = [
	{
		id: "1",
		name: "Acme Corporation",
		slug: "acme-corp",
		plan: "Pro",
	},
	{
		id: "2",
		name: "Beta Industries",
		slug: "beta-industries",
		plan: "Enterprise",
	},
	{
		id: "3",
		name: "Startup Labs",
		slug: "startup-labs",
		plan: "Free",
	},
]

const manyOrganizations: Organization[] = [
	...organizations,
	{
		id: "4",
		name: "Globex Corporation",
		slug: "globex-corp",
		plan: "Pro",
	},
	{
		id: "5",
		name: "Initech Systems",
		slug: "initech-systems",
		plan: "Enterprise",
	},
	{
		id: "6",
		name: "Umbrella Corp",
		slug: "umbrella-corp",
		plan: "Pro",
	},
]

const singleOrg: Organization[] = [
	{
		id: "1",
		name: "Acme Corporation",
		slug: "acme-corp",
		plan: "Pro",
	},
]

// ---------------------------------------------------------------------------
// Props tables
// ---------------------------------------------------------------------------

const orgMenuProps: DocProp[] = [
	{
		name: "organizations",
		type: "Organization[]",
		description: "List of organizations the user belongs to.",
	},
	{
		name: "activeOrganization",
		type: "Organization",
		description: "Currently active organization.",
	},
	{
		name: "onSelect",
		type: "(org: Organization) => void",
		description: "Called when the user selects a different organization.",
	},
	{
		name: "onCreate",
		type: "() => void",
		description: 'Shows "Create organization" action when provided.',
	},
	{
		name: "onManage",
		type: "() => void",
		description: 'Shows "Manage organizations" action when provided.',
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the trigger.",
	},
]

const organizationTypeProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier.",
	},
	{
		name: "name",
		type: "string",
		description: "Display name.",
	},
	{
		name: "slug",
		type: "string",
		description: "URL-friendly identifier.",
	},
	{
		name: "avatar",
		type: "string",
		description: "Avatar image URL. Falls back to initials.",
	},
	{
		name: "plan",
		type: "string",
		description: 'Subscription plan label (e.g. "Free", "Pro").',
	},
]

// ---------------------------------------------------------------------------
// Interactive demos
// ---------------------------------------------------------------------------

function SwitchableDemo() {
	const [active, setActive] = useState(organizations[0])

	return (
		<div className="w-64">
			<OrgMenu
				organizations={organizations}
				activeOrganization={active}
				onSelect={setActive}
				onCreate={() => {}}
				onManage={() => {}}
			/>
		</div>
	)
}

function ManyOrgsDemo() {
	const [active, setActive] = useState(manyOrganizations[0])

	return (
		<div className="w-64">
			<OrgMenu
				organizations={manyOrganizations}
				activeOrganization={active}
				onSelect={setActive}
			/>
		</div>
	)
}

function SingleOrgDemo() {
	const [active, setActive] = useState(singleOrg[0])

	return (
		<div className="w-64">
			<OrgMenu
				organizations={singleOrg}
				activeOrganization={active}
				onSelect={setActive}
				onCreate={() => {}}
			/>
		</div>
	)
}

function EmptyDemo() {
	return (
		<div className="w-64">
			<OrgMenu
				organizations={[]}
				activeOrganization={{ id: "0", name: "No Org", slug: "no-org" }}
				onSelect={() => {}}
				onCreate={() => {}}
			/>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OrgMenuPage() {
	return (
		<DocPage
			title="OrgMenu"
			subtitle="A workspace switcher dropdown for the sidebar. Lets users switch between organizations, create new ones, and access org settings."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<SwitchableDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				{/* Basic */}
				<DocExample
					title="Basic"
					description="A workspace switcher with multiple organizations, create and manage actions."
					code={`<OrgMenu
  organizations={organizations}
  activeOrganization={active}
  onSelect={setActive}
  onCreate={() => {}}
  onManage={() => {}}
/>`}
				>
					<SwitchableDemo />
				</DocExample>

				{/* Many organizations */}
				<DocExample
					title="Many Organizations"
					description="With many organizations, the dropdown scrolls naturally. No actions shown when callbacks are omitted."
					code={`<OrgMenu
  organizations={manyOrganizations}
  activeOrganization={active}
  onSelect={setActive}
/>`}
				>
					<ManyOrgsDemo />
				</DocExample>

				{/* Single organization */}
				<DocExample
					title="Single Organization"
					description="With a single organization, the dropdown still allows creating a new one."
					code={`<OrgMenu
  organizations={[org]}
  activeOrganization={org}
  onSelect={setActive}
  onCreate={() => {}}
/>`}
				>
					<SingleOrgDemo />
				</DocExample>

				{/* Empty state */}
				<DocExample
					title="Empty State"
					description="When no organizations exist, a helpful empty state is displayed with a prompt to create one."
					code={`<OrgMenu
  organizations={[]}
  activeOrganization={placeholder}
  onSelect={() => {}}
  onCreate={() => {}}
/>`}
				>
					<EmptyDemo />
				</DocExample>
			</DocSection>

			{/* OrgMenu Props */}
			<DocSection id="org-menu-props" title="OrgMenu Props">
				<DocPropsTable props={orgMenuProps} />
			</DocSection>

			{/* Organization Type */}
			<DocSection id="organization-type" title="Organization Type">
				<DocPropsTable props={organizationTypeProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Place at the top of the sidebar, above the navigation items</li>
					<li>Always show the active organization name and plan in the trigger</li>
					<li>Use square-rounded avatars (rounded-lg) to differentiate from user avatars (rounded-full)</li>
					<li>Keep organization names short — long names are truncated with a tooltip</li>
					<li>Provide onCreate to allow users to add organizations inline</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "DropdownMenu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Underlying primitive for the menu.",
						},
						{
							title: "Avatar",
							href: "/docs/components/ui/avatar",
							description: "Used for organization avatars.",
						},
						{
							title: "Nav Menu",
							href: "/docs/components/ui/nav-menu",
							description: "Sidebar navigation below the org menu.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
