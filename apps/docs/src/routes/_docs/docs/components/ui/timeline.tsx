import { createFileRoute } from "@tanstack/react-router"
import { CheckIcon, AlertCircleIcon, MailIcon } from "lucide-react"
import {
	Timeline,
	TimelineItem,
	TimelineIndicator,
	TimelineContent,
	TimelineTitle,
	TimelineDescription,
	TimelineTime,
} from "@blazz/ui/components/ui/timeline"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "sub-components", title: "Sub-components" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const examples = [
	{
		key: "basic",
		code: `<Timeline>
  <TimelineItem>
    <TimelineIndicator />
    <TimelineContent>
      <TimelineTitle>First event</TimelineTitle>
      <TimelineDescription>Something happened.</TimelineDescription>
      <TimelineTime>3 days ago</TimelineTime>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineIndicator />
    <TimelineContent>
      <TimelineTitle>Second event</TimelineTitle>
      <TimelineDescription>Something else happened.</TimelineDescription>
      <TimelineTime>2 days ago</TimelineTime>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem showLine={false}>
    <TimelineIndicator />
    <TimelineContent>
      <TimelineTitle>Third event</TimelineTitle>
      <TimelineDescription>And another thing.</TimelineDescription>
      <TimelineTime>1 day ago</TimelineTime>
    </TimelineContent>
  </TimelineItem>
</Timeline>`,
	},
	{
		key: "with-icons",
		code: `import { CheckIcon, AlertCircleIcon, MailIcon } from "lucide-react"

<Timeline>
  <TimelineItem>
    <TimelineIndicator>
      <CheckIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Task completed</TimelineTitle>
      <TimelineDescription>The task was marked as done.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineIndicator>
      <MailIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Email sent</TimelineTitle>
      <TimelineDescription>Notification was dispatched.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem showLine={false}>
    <TimelineIndicator>
      <AlertCircleIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Review needed</TimelineTitle>
      <TimelineDescription>Action required from the team.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
</Timeline>`,
	},
	{
		key: "custom-indicators",
		code: `<Timeline>
  <TimelineItem>
    <TimelineIndicator className="bg-positive text-white border-positive">
      <CheckIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Success</TimelineTitle>
      <TimelineDescription>Operation completed.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineIndicator className="bg-warning text-white border-warning">
      <AlertCircleIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Warning</TimelineTitle>
      <TimelineDescription>Needs attention.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
  <TimelineItem showLine={false}>
    <TimelineIndicator className="bg-negative text-white border-negative">
      <AlertCircleIcon />
    </TimelineIndicator>
    <TimelineContent>
      <TimelineTitle>Error</TimelineTitle>
      <TimelineDescription>Something went wrong.</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
</Timeline>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/timeline")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: TimelinePage,
})

function TimelinePage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Timeline"
			subtitle="A composable timeline component for displaying a sequence of events in chronological order. Built with flexible sub-components for custom layouts."
			toc={toc}
		>
			<DocHero>
				<Timeline className="max-w-md">
					<TimelineItem>
						<TimelineIndicator>
							<CheckIcon />
						</TimelineIndicator>
						<TimelineContent>
							<TimelineTitle>Order confirmed</TimelineTitle>
							<TimelineDescription>Your order has been placed successfully.</TimelineDescription>
							<TimelineTime>2 hours ago</TimelineTime>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem>
						<TimelineIndicator>
							<MailIcon />
						</TimelineIndicator>
						<TimelineContent>
							<TimelineTitle>Shipping update</TimelineTitle>
							<TimelineDescription>Package is on its way.</TimelineDescription>
							<TimelineTime>1 hour ago</TimelineTime>
						</TimelineContent>
					</TimelineItem>
					<TimelineItem showLine={false}>
						<TimelineIndicator>
							<AlertCircleIcon />
						</TimelineIndicator>
						<TimelineContent>
							<TimelineTitle>Delivery pending</TimelineTitle>
							<TimelineDescription>Estimated arrival tomorrow.</TimelineDescription>
							<TimelineTime>Just now</TimelineTime>
						</TimelineContent>
					</TimelineItem>
				</Timeline>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple timeline with text content."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<Timeline className="max-w-md">
						<TimelineItem>
							<TimelineIndicator />
							<TimelineContent>
								<TimelineTitle>First event</TimelineTitle>
								<TimelineDescription>Something happened.</TimelineDescription>
								<TimelineTime>3 days ago</TimelineTime>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem>
							<TimelineIndicator />
							<TimelineContent>
								<TimelineTitle>Second event</TimelineTitle>
								<TimelineDescription>Something else happened.</TimelineDescription>
								<TimelineTime>2 days ago</TimelineTime>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem showLine={false}>
							<TimelineIndicator />
							<TimelineContent>
								<TimelineTitle>Third event</TimelineTitle>
								<TimelineDescription>And another thing.</TimelineDescription>
								<TimelineTime>1 day ago</TimelineTime>
							</TimelineContent>
						</TimelineItem>
					</Timeline>
				</DocExampleClient>

				<DocExampleClient
					title="With Icons"
					description="Use icons inside the timeline indicator for visual context."
					code={examples[1].code}
					highlightedCode={html("with-icons")}
				>
					<Timeline className="max-w-md">
						<TimelineItem>
							<TimelineIndicator>
								<CheckIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Task completed</TimelineTitle>
								<TimelineDescription>The task was marked as done.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem>
							<TimelineIndicator>
								<MailIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Email sent</TimelineTitle>
								<TimelineDescription>Notification was dispatched.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem showLine={false}>
							<TimelineIndicator>
								<AlertCircleIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Review needed</TimelineTitle>
								<TimelineDescription>Action required from the team.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
					</Timeline>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Indicators"
					description="Customize indicator colors and styles."
					code={examples[2].code}
					highlightedCode={html("custom-indicators")}
				>
					<Timeline className="max-w-md">
						<TimelineItem>
							<TimelineIndicator className="bg-positive text-white border-positive">
								<CheckIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Success</TimelineTitle>
								<TimelineDescription>Operation completed.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem>
							<TimelineIndicator className="bg-warning text-white border-warning">
								<AlertCircleIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Warning</TimelineTitle>
								<TimelineDescription>Needs attention.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem showLine={false}>
							<TimelineIndicator className="bg-negative text-white border-negative">
								<AlertCircleIcon />
							</TimelineIndicator>
							<TimelineContent>
								<TimelineTitle>Error</TimelineTitle>
								<TimelineDescription>Something went wrong.</TimelineDescription>
							</TimelineContent>
						</TimelineItem>
					</Timeline>
				</DocExampleClient>
			</DocSection>

			<DocSection id="sub-components" title="Sub-components">
				<div className="space-y-4 text-sm text-fg-muted">
					<p>Timeline is built from composable sub-components:</p>
					<ul className="list-inside list-disc space-y-2">
						<li><code className="text-xs">Timeline</code> - Root container</li>
						<li><code className="text-xs">TimelineItem</code> - Individual event wrapper (accepts <code className="text-xs">showLine</code> prop, default true)</li>
						<li><code className="text-xs">TimelineIndicator</code> - The circle indicator, optionally containing an icon</li>
						<li><code className="text-xs">TimelineContent</code> - Content wrapper for the event</li>
						<li><code className="text-xs">TimelineTitle</code> - Event title text</li>
						<li><code className="text-xs">TimelineDescription</code> - Event description text</li>
						<li><code className="text-xs">TimelineTime</code> - Timestamp display</li>
					</ul>
				</div>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Set showLine to false on the last TimelineItem to avoid a trailing connector</li>
					<li>Use icons to visually distinguish event types</li>
					<li>Keep timeline items concise for readability</li>
					<li>Order events chronologically (newest first or last, be consistent)</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Stepper",
							href: "/docs/components/ui/stepper",
							description: "Step indicator for multi-step workflows.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
