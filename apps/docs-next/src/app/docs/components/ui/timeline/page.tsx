import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@blazz/ui/components/ui/collapsible"
import { Frame, FrameHeader, FramePanel } from "@blazz/ui/components/ui/frame-panel"
import { Spinner } from "@blazz/ui/components/ui/spinner"
import {
	Timeline,
	TimelineContent,
	TimelineDescription,
	TimelineIndicator,
	TimelineItem,
	TimelineTime,
	TimelineTitle,
} from "@blazz/ui/components/ui/timeline"
import { cn } from "@blazz/ui/lib/utils"
import { AlertCircleIcon, CheckIcon, ChevronRightIcon, CircleIcon, MailIcon } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

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
	{
		key: "pipeline",
		code: `import { CheckIcon, CircleIcon, ChevronRightIcon } from "lucide-react"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Spinner } from "@blazz/ui/components/ui/spinner"
import { Avatar, AvatarImage, AvatarFallback } from "@blazz/ui/components/ui/avatar"
import { Frame, FramePanel, FrameHeader } from "@blazz/ui/components/ui/frame-panel"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@blazz/ui/components/ui/collapsible"

const pipelineSteps = [
  {
    id: 1,
    title: "Source Code Checkout",
    duration: "12s",
    status: "completed",
    description: "Successfully fetched latest changes from the main branch.",
    user: { name: "Alex Johnson", avatar: "https://..." },
  },
  // ...
]

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckIcon className="size-3.5" />
  if (status === "active") return <Spinner className="size-3.5" />
  return <CircleIcon className="size-3.5 opacity-50" />
}

<Timeline className="max-w-lg">
  {pipelineSteps.map((step, i) => (
    <TimelineItem key={step.id} showLine={i < pipelineSteps.length - 1}>
      <TimelineIndicator
        className={cn(
          step.status === "completed" && "bg-brand text-brand-fg border-brand",
          step.status === "active" && "bg-inform/15 text-inform border-inform/30 ring-2 ring-inform/20",
          step.status === "pending" && "opacity-50",
        )}
      >
        <StatusIcon status={step.status} />
      </TimelineIndicator>
      <TimelineContent>
        <div className="mb-1.5 flex items-center gap-2">
          <TimelineTitle>{step.title}</TimelineTitle>
          <Badge
            variant={step.status === "completed" ? "success" : step.status === "active" ? "info" : "warning"}
            fill="subtle"
            size="sm"
          >
            {step.duration}
          </Badge>
        </div>
        <Frame stacked spacing="sm">
          <Collapsible defaultOpen={step.status !== "pending"} className="group">
            <CollapsibleTrigger className="flex w-full">
              <FrameHeader className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                    <AvatarImage src={step.user.avatar} alt={step.user.name} />
                    <AvatarFallback>{step.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-fg-muted">{step.user.name}</span>
                </div>
                <ChevronRightIcon className="size-4 text-fg-muted transition-transform duration-150 [[aria-expanded=true]_&]:rotate-90" />
              </FrameHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <FramePanel>
                <p className="text-sm leading-relaxed text-fg-muted">{step.description}</p>
              </FramePanel>
            </CollapsibleContent>
          </Collapsible>
        </Frame>
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// --- Pipeline example data & helpers ---

const pipelineSteps = [
	{
		id: 1,
		title: "Source Code Checkout",
		duration: "12s",
		status: "completed",
		description: "Successfully fetched latest changes from the main branch.",
		user: {
			name: "Alex Johnson",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
		},
	},
	{
		id: 2,
		title: "Dependency Installation",
		duration: "1m 45s",
		status: "completed",
		description: "All npm packages installed and cached for future builds.",
		user: {
			name: "Sarah Chen",
			avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
		},
	},
	{
		id: 3,
		title: "Unit & Integration Tests",
		duration: "Running",
		status: "active",
		description: "Running 142 test suites across the entire codebase...",
		user: {
			name: "Michael Rodriguez",
			avatar: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80",
		},
	},
	{
		id: 4,
		title: "Production Build",
		duration: "Pending",
		status: "pending",
		description: "Optimizing assets and generating static site pages.",
		user: {
			name: "Emma Wilson",
			avatar: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80",
		},
	},
]

function PipelineStatusIcon({ status }: { status: string }) {
	if (status === "completed") return <CheckIcon className="size-3.5" />
	if (status === "active") return <Spinner className="size-3.5" />
	return <CircleIcon className="size-3.5 opacity-50" />
}

function PipelineExample() {
	return (
		<Timeline className="max-w-lg">
			{pipelineSteps.map((step, i) => (
				<TimelineItem key={step.id} showLine={i < pipelineSteps.length - 1}>
					<TimelineIndicator
						className={cn(
							step.status === "completed" && "bg-brand text-brand-fg border-brand",
							step.status === "active" &&
								"bg-inform/15 text-inform border-inform/30 ring-2 ring-inform/20",
							step.status === "pending" && "opacity-50"
						)}
					>
						<PipelineStatusIcon status={step.status} />
					</TimelineIndicator>
					<TimelineContent>
						<div className="mb-1.5 flex items-center gap-2">
							<TimelineTitle>{step.title}</TimelineTitle>
							<Badge
								variant={
									step.status === "completed"
										? "success"
										: step.status === "active"
											? "info"
											: "warning"
								}
								fill="subtle"
								size="sm"
							>
								{step.duration}
							</Badge>
						</div>
						<Frame stacked spacing="sm">
							<Collapsible defaultOpen={step.status !== "pending"}>
								<CollapsibleTrigger className="flex w-full">
									<FrameHeader className="flex w-full items-center justify-between gap-2">
										<div className="flex items-center gap-2">
											<Avatar className="size-5">
												<AvatarImage src={step.user.avatar} alt={step.user.name} />
												<AvatarFallback>{step.user.name[0]}</AvatarFallback>
											</Avatar>
											<span className="text-xs font-medium text-fg-muted">{step.user.name}</span>
										</div>
										<ChevronRightIcon className="size-4 text-fg-muted transition-transform duration-150 [[aria-expanded=true]_&]:rotate-90" />
									</FrameHeader>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<FramePanel>
										<p className="text-sm leading-relaxed text-fg-muted">{step.description}</p>
									</FramePanel>
								</CollapsibleContent>
							</Collapsible>
						</Frame>
					</TimelineContent>
				</TimelineItem>
			))}
		</Timeline>
	)
}

// --- Page ---

export default async function TimelinePage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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

				<DocExampleClient
					title="Pipeline"
					description="A CI/CD-style pipeline with status indicators, badges, and collapsible details per step."
					code={examples[3].code}
					highlightedCode={html("pipeline")}
				>
					<PipelineExample />
				</DocExampleClient>
			</DocSection>

			<DocSection id="sub-components" title="Sub-components">
				<div className="space-y-4 text-sm text-fg-muted">
					<p>Timeline is built from composable sub-components:</p>
					<ul className="list-inside list-disc space-y-2">
						<li>
							<code className="text-xs">Timeline</code> - Root container. Accepts{" "}
							<code className="text-xs">orientation</code> (
							<code className="text-xs">"vertical" | "horizontal"</code>, default{" "}
							<code className="text-xs">"vertical"</code>)
						</li>
						<li>
							<code className="text-xs">TimelineItem</code> - Individual event wrapper. Accepts{" "}
							<code className="text-xs">showLine</code> prop (default{" "}
							<code className="text-xs">true</code>)
						</li>
						<li>
							<code className="text-xs">TimelineIndicator</code> - The circle indicator, optionally
							containing an icon
						</li>
						<li>
							<code className="text-xs">TimelineHeader</code> - Optional wrapper to group date and
							title above/below the indicator
						</li>
						<li>
							<code className="text-xs">TimelineContent</code> - Content wrapper for the event
						</li>
						<li>
							<code className="text-xs">TimelineTitle</code> - Event title text
						</li>
						<li>
							<code className="text-xs">TimelineDescription</code> - Event description text
						</li>
						<li>
							<code className="text-xs">TimelineTime</code> /{" "}
							<code className="text-xs">TimelineDate</code> - Timestamp display
						</li>
					</ul>
				</div>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Set <code className="text-xs">showLine={false}</code> on the last{" "}
						<code className="text-xs">TimelineItem</code> to avoid a trailing connector
					</li>
					<li>Use icons to visually distinguish event types</li>
					<li>Keep timeline items concise for readability</li>
					<li>Order events chronologically (newest first or last, be consistent)</li>
					<li>
						Use <code className="text-xs">orientation="horizontal"</code> for step-by-step workflows
						with few items
					</li>
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
