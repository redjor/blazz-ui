"use client"
import { use } from "react"

import { Label } from "@blazz/ui/components/ui/label"
import { Switch } from "@blazz/ui/components/ui/switch"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const switchProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "default"',
		default: '"default"',
		description: "The size of the switch.",
	},
	{
		name: "checked",
		type: "boolean",
		description: "Whether the switch is on.",
	},
	{
		name: "defaultChecked",
		type: "boolean",
		description: "The default state for uncontrolled usage.",
	},
	{
		name: "onCheckedChange",
		type: "(checked: boolean) => void",
		description: "Callback when the state changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the switch is disabled.",
	},
]

const examples = [
	{
		key: "default",
		code: `<Switch />`,
	},
	{
		key: "with-label",
		code: `<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane Mode</Label>
</div>`,
	},
	{
		key: "sizes",
		code: `<Switch size="sm" />
<Switch size="default" />`,
	},
	{
		key: "controlled",
		code: `const [enabled, setEnabled] = React.useState(false)

<div className="flex items-center gap-2">
  <Switch
    id="controlled"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="controlled">
    {enabled ? "Enabled" : "Disabled"}
  </Label>
</div>`,
	},
	{
		key: "disabled",
		code: `<Switch disabled />
<Switch disabled defaultChecked />`,
	},
	{
		key: "settings-list",
		code: `<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label htmlFor="notifications">Notifications</Label>
    <Switch id="notifications" defaultChecked />
  </div>
  <div className="flex items-center justify-between">
    <Label htmlFor="marketing">Marketing emails</Label>
    <Switch id="marketing" />
  </div>
</div>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

function ControlledSwitchDemo() {
	const [enabled, setEnabled] = React.useState(false)

	return (
		<div className="flex items-center gap-2">
			<Switch id="controlled" checked={enabled} onCheckedChange={setEnabled} />
			<Label htmlFor="controlled">{enabled ? "Enabled" : "Disabled"}</Label>
		</div>
	)
}

export default function SwitchPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Switch"
			subtitle="A toggle control for turning options on or off. Use for binary settings that take effect immediately."
			toc={toc}
		>
			<DocHero>
				<div className="flex items-center gap-2">
					<Switch id="hero-switch" defaultChecked />
					<Label htmlFor="hero-switch">Notifications</Label>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic switch toggle."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Switch />
				</DocExampleClient>

				<DocExampleClient
					title="With Label"
					description="Switch with an associated label."
					code={examples[1].code}
					highlightedCode={html("with-label")}
				>
					<div className="flex items-center gap-2">
						<Switch id="airplane" />
						<Label htmlFor="airplane">Airplane Mode</Label>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Sizes"
					description="Available switch sizes."
					code={examples[2].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Switch id="small" size="sm" />
							<Label htmlFor="small">Small</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch id="default-size" size="default" />
							<Label htmlFor="default-size">Default</Label>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Controlled"
					description="Control the switch state programmatically."
					code={examples[3].code}
					highlightedCode={html("controlled")}
				>
					<ControlledSwitchDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled switches prevent interaction."
					code={examples[4].code}
					highlightedCode={html("disabled")}
				>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Switch id="disabled-off" disabled />
							<Label htmlFor="disabled-off" className="opacity-50">
								Disabled off
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch id="disabled-on" disabled defaultChecked />
							<Label htmlFor="disabled-on" className="opacity-50">
								Disabled on
							</Label>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Settings List"
					description="Use switches in a settings list."
					code={examples[5].code}
					highlightedCode={html("settings-list")}
				>
					<div className="w-full max-w-sm space-y-4">
						<div className="flex items-center justify-between">
							<Label htmlFor="notifications">Notifications</Label>
							<Switch id="notifications" defaultChecked />
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="marketing">Marketing emails</Label>
							<Switch id="marketing" />
						</div>
						<div className="flex items-center justify-between">
							<Label htmlFor="updates">Product updates</Label>
							<Switch id="updates" defaultChecked />
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={switchProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Switch uses the design system for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface-3</code> - Unchecked background
					</li>
					<li>
						<code className="text-xs">bg-brand</code> - Checked background
					</li>
					<li>
						<code className="text-xs">rounded-full</code> - Pill-shaped container
					</li>
					<li>
						<code className="text-xs">shadow-sm</code> - Subtle elevation
					</li>
					<li>
						<code className="text-xs">transition-p-150</code> - Smooth state transitions
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use switches for settings that take effect immediately</li>
					<li>Use checkboxes instead when changes require a submit action</li>
					<li>Always provide a label to describe what the switch controls</li>
					<li>Place the label on the left for settings lists</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Checkbox",
							href: "/docs/components/ui/checkbox",
							description: "For selections that require a submit action.",
						},
						{
							title: "Label",
							href: "/docs/components/ui/input",
							description: "Accessible labels for form controls.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
