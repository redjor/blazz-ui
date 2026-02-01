"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const switchProps: PropDefinition[] = [
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

export default function SwitchPage() {
	const [enabled, setEnabled] = React.useState(false)

	return (
		<Page
			title="Switch"
			subtitle="A toggle control for turning options on or off. Use for binary settings that take effect immediately."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic switch toggle."
						code={`<Switch />`}
					>
						<Switch />
					</ComponentExample>

					<ComponentExample
						title="With Label"
						description="Switch with an associated label."
						code={`<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane Mode</Label>
</div>`}
					>
						<div className="flex items-center gap-2">
							<Switch id="airplane" />
							<Label htmlFor="airplane">Airplane Mode</Label>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Sizes"
						description="Available switch sizes."
						code={`<Switch size="sm" />
<Switch size="default" />`}
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
					</ComponentExample>

					<ComponentExample
						title="Controlled"
						description="Control the switch state programmatically."
						code={`const [enabled, setEnabled] = React.useState(false)

<div className="flex items-center gap-2">
  <Switch
    id="controlled"
    checked={enabled}
    onCheckedChange={setEnabled}
  />
  <Label htmlFor="controlled">
    {enabled ? "Enabled" : "Disabled"}
  </Label>
</div>`}
					>
						<div className="flex items-center gap-2">
							<Switch id="controlled" checked={enabled} onCheckedChange={setEnabled} />
							<Label htmlFor="controlled">{enabled ? "Enabled" : "Disabled"}</Label>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled switches prevent interaction."
						code={`<Switch disabled />
<Switch disabled defaultChecked />`}
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
					</ComponentExample>

					<ComponentExample
						title="Settings List"
						description="Use switches in a settings list."
						code={`<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label htmlFor="notifications">Notifications</Label>
    <Switch id="notifications" defaultChecked />
  </div>
  <div className="flex items-center justify-between">
    <Label htmlFor="marketing">Marketing emails</Label>
    <Switch id="marketing" />
  </div>
</div>`}
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={switchProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Switch uses the design system for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-fill-secondary</code> - Unchecked background
						</li>
						<li>
							<code className="text-xs">bg-p-fill-brand</code> - Checked background
						</li>
						<li>
							<code className="text-xs">rounded-p-full</code> - Pill-shaped container
						</li>
						<li>
							<code className="text-xs">shadow-p-sm</code> - Subtle elevation
						</li>
						<li>
							<code className="text-xs">transition-p-150</code> - Smooth state transitions
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use switches for settings that take effect immediately</li>
						<li>Use checkboxes instead when changes require a submit action</li>
						<li>Always provide a label to describe what the switch controls</li>
						<li>Place the label on the left for settings lists</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
