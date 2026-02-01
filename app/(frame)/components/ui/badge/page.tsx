"use client"

import { Page } from "@/components/ui/page"
import { Badge } from "@/components/ui/badge"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { Check, X } from "lucide-react"

const badgeProps: PropDefinition[] = [
	{
		name: "variant",
		type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"',
		default: '"default"',
		description: "The visual style of the badge.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The content of the badge.",
	},
]

export default function BadgePage() {
	return (
		<Page
			title="Badge"
			subtitle="Small status indicators for labeling, categorizing, or showing counts."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Variants"
						description="Different visual styles for various contexts."
						code={`<Badge variant="default">Default</Badge>
<Badge variant="info">Secondary</Badge>
<Badge variant="critical">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}
					>
						<div className="flex flex-wrap gap-2">
							<Badge variant="default">Default</Badge>
							<Badge variant="info">Info</Badge>
							<Badge variant="success">Success</Badge>
							<Badge variant="warning">Warning</Badge>
							<Badge variant="critical">Critical</Badge>
							<Badge variant="outline">Outline</Badge>
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Icons"
						description="Add icons for additional visual context."
						code={`<Badge><Check /> Approved</Badge>
<Badge variant="critical"><X /> Rejected</Badge>`}
					>
						<div className="flex flex-wrap gap-2">
							<Badge>
								<Check /> Approved
							</Badge>
							<Badge variant="critical">
								<X /> Rejected
							</Badge>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Status Indicators"
						description="Use badges to show status in lists or tables."
						code={`<Badge variant="default">Active</Badge>
<Badge variant="info">Pending</Badge>
<Badge variant="critical">Cancelled</Badge>
<Badge variant="outline">Draft</Badge>`}
					>
						<div className="flex flex-wrap gap-2">
							<Badge variant="default">Active</Badge>
							<Badge variant="info">Pending</Badge>
							<Badge variant="critical">Cancelled</Badge>
							<Badge variant="outline">Draft</Badge>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Counts"
						description="Display notification counts or quantities."
						code={`<Badge>3</Badge>
<Badge variant="info">99+</Badge>
<Badge variant="critical">5</Badge>`}
					>
						<div className="flex flex-wrap gap-2">
							<Badge>3</Badge>
							<Badge variant="info">99+</Badge>
							<Badge variant="critical">5</Badge>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={badgeProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Badge uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-fill-brand</code> - Default badge background
						</li>
						<li>
							<code className="text-xs">text-p-text-on-fill</code> - Default badge text
						</li>
						<li>
							<code className="text-xs">bg-p-info-surface</code> - Info variant background
						</li>
						<li>
							<code className="text-xs">text-p-info-text</code> - Info variant text
						</li>
						<li>
							<code className="text-xs">bg-p-success-surface</code> - Success variant background
						</li>
						<li>
							<code className="text-xs">bg-p-warning-surface</code> - Warning variant background
						</li>
						<li>
							<code className="text-xs">bg-p-critical-surface</code> - Critical variant background
						</li>
						<li>
							<code className="text-xs">rounded-p-full</code> - Fully rounded pill shape
						</li>
						<li>
							<code className="text-xs">h-5 px-p-2</code> - Badge height and padding
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Keep badge text short and concise</li>
						<li>Use consistent colors for the same status across the app</li>
						<li>Don't use badges for long text - they're meant to be glanceable</li>
						<li>Use destructive variant sparingly for error or warning states</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
