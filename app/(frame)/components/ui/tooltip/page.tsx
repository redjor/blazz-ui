"use client"

import { Page } from "@/components/ui/page"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { HelpCircle, Plus, Settings } from "lucide-react"

const tooltipContentProps: PropDefinition[] = [
	{
		name: "side",
		type: '"top" | "right" | "bottom" | "left"',
		default: '"top"',
		description: "The preferred side of the trigger to render against.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "4",
		description: "The distance in pixels from the trigger.",
	},
	{
		name: "align",
		type: '"start" | "center" | "end"',
		default: '"center"',
		description: "The preferred alignment against the trigger.",
	},
	{
		name: "alignOffset",
		type: "number",
		default: "0",
		description: "The offset in pixels from the alignment.",
	},
]

export default function TooltipPage() {
	return (
		<Page
			title="Tooltip"
			subtitle="A popup that displays information related to an element when it receives hover or keyboard focus."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic tooltip on hover."
						code={`<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>
    Hover me
  </TooltipTrigger>
  <TooltipContent>
    This is a tooltip
  </TooltipContent>
</Tooltip>`}
					>
						<Tooltip>
							<TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
							<TooltipContent>This is a tooltip</TooltipContent>
						</Tooltip>
					</ComponentExample>

					<ComponentExample
						title="Positions"
						description="Tooltips can appear on different sides."
						code={`<Tooltip>
  <TooltipTrigger>...</TooltipTrigger>
  <TooltipContent side="top">Top</TooltipContent>
</Tooltip>
<Tooltip>
  <TooltipTrigger>...</TooltipTrigger>
  <TooltipContent side="bottom">Bottom</TooltipContent>
</Tooltip>`}
					>
						<div className="flex gap-4">
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" />}>Top</TooltipTrigger>
								<TooltipContent side="top">Tooltip on top</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" />}>Right</TooltipTrigger>
								<TooltipContent side="right">Tooltip on right</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" />}>Bottom</TooltipTrigger>
								<TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" />}>Left</TooltipTrigger>
								<TooltipContent side="left">Tooltip on left</TooltipContent>
							</Tooltip>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Icon Buttons"
						description="Use tooltips to explain icon-only buttons."
						code={`<Tooltip>
  <TooltipTrigger render={<Button variant="outline" size="icon" />}>
    <Plus />
  </TooltipTrigger>
  <TooltipContent>Add new item</TooltipContent>
</Tooltip>`}
					>
						<div className="flex gap-2">
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" size="icon" />}>
									<Plus />
								</TooltipTrigger>
								<TooltipContent>Add new item</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger render={<Button variant="outline" size="icon" />}>
									<Settings />
								</TooltipTrigger>
								<TooltipContent>Settings</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger render={<Button variant="ghost" size="icon" />}>
									<HelpCircle />
								</TooltipTrigger>
								<TooltipContent>Help & Documentation</TooltipContent>
							</Tooltip>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Longer Content"
						description="Tooltips can contain longer text."
						code={`<Tooltip>
  <TooltipTrigger>
    <HelpCircle />
  </TooltipTrigger>
  <TooltipContent>
    This tooltip contains more detailed information
    about the feature or action.
  </TooltipContent>
</Tooltip>`}
					>
						<Tooltip>
							<TooltipTrigger render={<Button variant="ghost" size="icon" />}>
								<HelpCircle />
							</TooltipTrigger>
							<TooltipContent className="max-w-xs">
								This tooltip contains more detailed information about the feature or
								action. Keep it concise but informative.
							</TooltipContent>
						</Tooltip>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">TooltipContent Props</h2>
					<PropsTable props={tooltipContentProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Tooltip uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-popover</code> - Tooltip background color
						</li>
						<li>
							<code className="text-xs">text-popover-foreground</code> - Tooltip text color
						</li>
						<li>
							<code className="text-xs">shadow-md</code> - Medium shadow for elevation
						</li>
						<li>
							<code className="text-xs">rounded-md</code> - Medium border radius (0.375rem)
						</li>
						<li>
							<code className="text-xs">px-p-2 py-p-1</code> - Compact padding
						</li>
						<li>
							<code className="text-xs">text-p-xs</code> - Small text size (0.6875rem)
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Always provide tooltips for icon-only buttons</li>
						<li>Keep tooltip text short and informative</li>
						<li>Don't put essential information only in tooltips</li>
						<li>Ensure tooltips are accessible via keyboard focus</li>
						<li>Avoid tooltips on touch-only devices - they can't hover</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Accessibility</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Tooltips are shown on keyboard focus as well as hover</li>
						<li>Content is announced by screen readers</li>
						<li>Use aria-label on the trigger for icon-only buttons</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
