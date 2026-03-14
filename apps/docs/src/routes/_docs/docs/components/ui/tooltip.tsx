import { Button } from "@blazz/ui/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@blazz/ui/components/ui/tooltip"
import { createFileRoute } from "@tanstack/react-router"
import { HelpCircle, Plus, Settings } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const tooltipContentProps: DocProp[] = [
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

const examples = [
	{
		key: "default",
		code: `<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>
    Hover me
  </TooltipTrigger>
  <TooltipContent>
    This is a tooltip
  </TooltipContent>
</Tooltip>`,
	},
	{
		key: "positions",
		code: `<Tooltip>
  <TooltipTrigger>...</TooltipTrigger>
  <TooltipContent side="top">Top</TooltipContent>
</Tooltip>
<Tooltip>
  <TooltipTrigger>...</TooltipTrigger>
  <TooltipContent side="bottom">Bottom</TooltipContent>
</Tooltip>`,
	},
	{
		key: "icon-buttons",
		code: `<Tooltip>
  <TooltipTrigger render={<Button variant="outline" size="icon" />}>
    <Plus />
  </TooltipTrigger>
  <TooltipContent>Add new item</TooltipContent>
</Tooltip>`,
	},
	{
		key: "longer-content",
		code: `<Tooltip>
  <TooltipTrigger>
    <HelpCircle />
  </TooltipTrigger>
  <TooltipContent>
    This tooltip contains more detailed information
    about the feature or action.
  </TooltipContent>
</Tooltip>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/tooltip")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TooltipPage,
})

function TooltipPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Tooltip"
			subtitle="A popup that displays information related to an element when it receives hover or keyboard focus."
			toc={toc}
		>
			<DocHero>
				<Tooltip>
					<TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
					<TooltipContent>This is a tooltip</TooltipContent>
				</Tooltip>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic tooltip on hover."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Tooltip>
						<TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
						<TooltipContent>This is a tooltip</TooltipContent>
					</Tooltip>
				</DocExampleClient>

				<DocExampleClient
					title="Positions"
					description="Tooltips can appear on different sides."
					code={examples[1].code}
					highlightedCode={html("positions")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Icon Buttons"
					description="Use tooltips to explain icon-only buttons."
					code={examples[2].code}
					highlightedCode={html("icon-buttons")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Longer Content"
					description="Tooltips can contain longer text."
					code={examples[3].code}
					highlightedCode={html("longer-content")}
				>
					<Tooltip>
						<TooltipTrigger render={<Button variant="ghost" size="icon" />}>
							<HelpCircle />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							This tooltip contains more detailed information about the feature or action. Keep it
							concise but informative.
						</TooltipContent>
					</Tooltip>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={tooltipContentProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Tooltip uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface-3</code> - Tooltip background color
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Tooltip text color
					</li>
					<li>
						<code className="text-xs">shadow-md</code> - Medium shadow for elevation
					</li>
					<li>
						<code className="text-xs">rounded-md</code> - Medium border radius (0.375rem)
					</li>
					<li>
						<code className="text-xs">px-2 py-1</code> - Compact padding
					</li>
					<li>
						<code className="text-xs">text-xs</code> - Small text size (0.6875rem)
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Always provide tooltips for icon-only buttons</li>
					<li>Keep tooltip text short and informative</li>
					<li>Don't put essential information only in tooltips</li>
					<li>Ensure tooltips are accessible via keyboard focus</li>
					<li>Avoid tooltips on touch-only devices - they can't hover</li>
					<li>Tooltips are shown on keyboard focus as well as hover</li>
					<li>Content is announced by screen readers</li>
					<li>Use aria-label on the trigger for icon-only buttons</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Popover",
							href: "/docs/components/ui/popover",
							description: "Interactive popups with richer content than tooltips.",
						},
						{
							title: "Button",
							href: "/docs/components/ui/button",
							description: "Icon buttons that benefit from tooltip labels.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
