"use client"

import { Page } from "@/components/ui/page"
import { Button } from "@/components/ui/button"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { Mail, ChevronRight, Loader2, Plus } from "lucide-react"

const buttonProps: PropDefinition[] = [
	{
		name: "variant",
		type: '"default" | "outline" | "secondary" | "tertiary" | "ghost" | "destructive" | "link"',
		default: '"default"',
		description: "The visual style of the button.",
	},
	{
		name: "size",
		type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
		default: '"default"',
		description: "The size of the button.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the button is disabled.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content of the button.",
	},
]

export default function ButtonPage() {
	return (
		<Page
			title="Button"
			subtitle="Buttons trigger actions and events. Use them to submit forms, navigate, or perform operations."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Variants"
						description="Different visual styles for various use cases."
						code={`<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`}
					>
						<div className="flex flex-wrap gap-2">
							<Button variant="default">Default</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="tertiary">Tertiary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="link">Link</Button>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Sizes"
						description="Available button sizes for different contexts."
						code={`<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}
					>
						<div className="flex flex-wrap items-center gap-2">
							<Button size="xs">Extra Small</Button>
							<Button size="sm">Small</Button>
							<Button size="default">Default</Button>
							<Button size="lg">Large</Button>
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Icons"
						description="Add icons to buttons for visual context."
						code={`<Button>
  <Mail /> Send Email
</Button>
<Button variant="outline">
  Next <ChevronRight />
</Button>`}
					>
						<div className="flex flex-wrap gap-2">
							<Button>
								<Mail /> Send Email
							</Button>
							<Button variant="outline">
								Next <ChevronRight />
							</Button>
							<Button variant="secondary">
								<Plus /> Add Item
							</Button>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Icon Only"
						description="Use icon sizes for compact icon-only buttons."
						code={`<Button size="icon-xs"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>`}
					>
						<div className="flex items-center gap-2">
							<Button size="icon-xs" variant="outline">
								<Plus />
							</Button>
							<Button size="icon-sm" variant="outline">
								<Plus />
							</Button>
							<Button size="icon" variant="outline">
								<Plus />
							</Button>
							<Button size="icon-lg" variant="outline">
								<Plus />
							</Button>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Loading State"
						description="Show a loading indicator while an action is processing."
						code={`<Button disabled>
  <Loader2 className="animate-spin" />
  Please wait
</Button>`}
					>
						<Button disabled>
							<Loader2 className="animate-spin" />
							Please wait
						</Button>
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled buttons prevent interaction."
						code={`<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Disabled</Button>`}
					>
						<div className="flex gap-2">
							<Button disabled>Disabled</Button>
							<Button variant="outline" disabled>
								Disabled
							</Button>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={buttonProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use clear, action-oriented labels (e.g., "Save changes" not "Submit")</li>
						<li>Use the default variant for primary actions</li>
						<li>Use destructive variant only for irreversible actions</li>
						<li>Limit to one primary button per section</li>
						<li>Provide loading feedback for async operations</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
