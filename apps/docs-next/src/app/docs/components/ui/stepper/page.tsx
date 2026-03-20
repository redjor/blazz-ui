import { Stepper } from "@blazz/ui/components/ui/stepper"
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
	{ id: "stepper-step", title: "StepperStep" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const stepperProps: DocProp[] = [
	{
		name: "steps",
		type: "StepperStep[]",
		description: "Array of step objects to render.",
	},
	{
		name: "activeStep",
		type: "number",
		description:
			"The current active step index (0-based). Steps before this index are marked as completed.",
	},
	{
		name: "variant",
		type: '"default" | "progress-bar" | "segmented"',
		default: '"default"',
		description: "The visual variant of the stepper.",
	},
	{
		name: "orientation",
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description: 'The layout orientation (only applies to the "default" variant).',
	},
]

const stepperStepProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "The label text for the step.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description text displayed below the label.",
	},
]

const examples = [
	{
		key: "progress-bar",
		code: `<Stepper
  variant="progress-bar"
  steps={[
    { label: "User Details" },
    { label: "Payment Info" },
    { label: "Auth OTP" },
    { label: "Preview Form" },
  ]}
  activeStep={1}
/>`,
	},
	{
		key: "segmented",
		code: `<Stepper
  variant="segmented"
  steps={[
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
    { label: "Step 4" },
  ]}
  activeStep={0}
/>`,
	},
	{
		key: "vertical",
		code: `<Stepper
  orientation="vertical"
  steps={[
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Set up your profile" },
    { label: "Review", description: "Confirm your details" },
  ]}
  activeStep={1}
/>`,
	},
	{
		key: "horizontal",
		code: `<Stepper
  steps={[
    { label: "Account" },
    { label: "Profile" },
    { label: "Settings" },
    { label: "Complete" },
  ]}
  activeStep={1}
/>`,
	},
	{
		key: "all-states",
		code: `{/* All pending */}
<Stepper steps={steps} activeStep={0} />

{/* Middle step active */}
<Stepper steps={steps} activeStep={2} />

{/* All completed */}
<Stepper steps={steps} activeStep={4} />`,
	},
	{
		key: "with-descriptions",
		code: `<Stepper
  steps={[
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Set up your profile" },
    { label: "Settings", description: "Configure preferences" },
    { label: "Complete", description: "All done" },
  ]}
  activeStep={1}
/>`,
	},
	{
		key: "interactive",
		code: `const [activeStep, setActiveStep] = React.useState(0)

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Set up your profile" },
  { label: "Settings", description: "Configure preferences" },
  { label: "Complete", description: "All done" },
]

<Stepper steps={steps} activeStep={activeStep} />
<button onClick={() => setActiveStep(s => Math.max(0, s - 1))}>
  Previous
</button>
<button onClick={() => setActiveStep(s => Math.min(steps.length, s + 1))}>
  Next
</button>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const interactiveSteps = [
	{ label: "Account", description: "Create your account" },
	{ label: "Profile", description: "Set up your profile" },
	{ label: "Settings", description: "Configure preferences" },
	{ label: "Complete", description: "All done" },
]

function InteractiveStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(0)

	return (
		<div className="space-y-6">
			<Stepper steps={interactiveSteps} activeStep={activeStep} />
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 disabled:opacity-50 disabled:pointer-events-none"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.min(interactiveSteps.length, s + 1))}
					disabled={activeStep === interactiveSteps.length}
					className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					Next
				</button>
			</div>
			<p className="text-center text-xs text-fg-muted">
				Step {activeStep + 1} of {interactiveSteps.length}
			</p>
		</div>
	)
}

const progressBarSteps = [
	{ label: "User Details" },
	{ label: "Payment Info" },
	{ label: "Auth OTP" },
	{ label: "Preview Form" },
]

function ProgressBarStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(1)

	return (
		<div className="space-y-6">
			<Stepper variant="progress-bar" steps={progressBarSteps} activeStep={activeStep} />
			<p className="text-center text-sm text-fg-muted">
				{progressBarSteps[activeStep]?.label} content
			</p>
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 disabled:opacity-50 disabled:pointer-events-none"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.min(progressBarSteps.length - 1, s + 1))}
					disabled={activeStep === progressBarSteps.length - 1}
					className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					Next
				</button>
			</div>
		</div>
	)
}

function SegmentedStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(0)
	const totalSteps = 4
	const segmentedSteps = Array.from({ length: totalSteps }, (_, i) => ({
		label: `Step ${i + 1}`,
	}))

	return (
		<div className="space-y-6">
			<Stepper variant="segmented" steps={segmentedSteps} activeStep={activeStep} />
			<p className="text-center text-sm text-fg-muted">Step {activeStep + 1} content</p>
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 disabled:opacity-50 disabled:pointer-events-none"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.min(totalSteps - 1, s + 1))}
					disabled={activeStep === totalSteps - 1}
					className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					Next
				</button>
			</div>
		</div>
	)
}

function VerticalStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(1)

	const verticalSteps = [
		{ label: "Account", description: "Create your account" },
		{ label: "Profile", description: "Set up your profile" },
		{ label: "Review", description: "Confirm your details" },
	]

	return (
		<div className="space-y-6">
			<Stepper orientation="vertical" steps={verticalSteps} activeStep={activeStep} />
			<p className="text-center text-sm text-fg-muted">
				{verticalSteps[activeStep]?.label} content
			</p>
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-surface-3 disabled:opacity-50 disabled:pointer-events-none"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.min(verticalSteps.length - 1, s + 1))}
					disabled={activeStep === verticalSteps.length - 1}
					className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default async function StepperPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Stepper"
			subtitle="A step indicator component for multi-step workflows. Displays progress through a sequence of steps with completed, active, and pending states."
			toc={toc}
		>
			<DocHero>
				<Stepper
					steps={[
						{ label: "Account" },
						{ label: "Profile" },
						{ label: "Settings" },
						{ label: "Complete" },
					]}
					activeStep={1}
				/>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Stepper with progress bar and titles"
					description="Thick bar segments above step labels. Completed and active steps are highlighted."
					code={examples[0].code}
					highlightedCode={html("progress-bar")}
				>
					<ProgressBarStepperDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Stepper with segmented progress bar"
					description="A segmented bar with a step counter. Ideal for minimal wizard-style flows."
					code={examples[1].code}
					highlightedCode={html("segmented")}
				>
					<SegmentedStepperDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Vertical stepper"
					description="A vertical stepper with labels and descriptions. Ideal for sidebar or narrow layouts."
					code={examples[2].code}
					highlightedCode={html("vertical")}
				>
					<VerticalStepperDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Horizontal (default)"
					description="The default horizontal stepper with circles and connectors."
					code={examples[3].code}
					highlightedCode={html("horizontal")}
				>
					<Stepper
						steps={[
							{ label: "Account" },
							{ label: "Profile" },
							{ label: "Settings" },
							{ label: "Complete" },
						]}
						activeStep={1}
					/>
				</DocExampleClient>

				<DocExampleClient
					title="All States"
					description="Demonstrating completed, active, and pending step states."
					code={examples[4].code}
					highlightedCode={html("all-states")}
				>
					<div className="space-y-8">
						<div>
							<p className="mb-2 text-xs text-fg-muted">First step active</p>
							<Stepper
								steps={[
									{ label: "Account" },
									{ label: "Profile" },
									{ label: "Settings" },
									{ label: "Complete" },
								]}
								activeStep={0}
							/>
						</div>
						<div>
							<p className="mb-2 text-xs text-fg-muted">Middle step active</p>
							<Stepper
								steps={[
									{ label: "Account" },
									{ label: "Profile" },
									{ label: "Settings" },
									{ label: "Complete" },
								]}
								activeStep={2}
							/>
						</div>
						<div>
							<p className="mb-2 text-xs text-fg-muted">All completed</p>
							<Stepper
								steps={[
									{ label: "Account" },
									{ label: "Profile" },
									{ label: "Settings" },
									{ label: "Complete" },
								]}
								activeStep={4}
							/>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Descriptions"
					description="Steps can include descriptions for additional context."
					code={examples[5].code}
					highlightedCode={html("with-descriptions")}
				>
					<Stepper
						steps={[
							{ label: "Account", description: "Create your account" },
							{ label: "Profile", description: "Set up your profile" },
							{ label: "Settings", description: "Configure preferences" },
							{ label: "Complete", description: "All done" },
						]}
						activeStep={1}
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Interactive"
					description="An interactive stepper with Previous and Next buttons."
					code={examples[6].code}
					highlightedCode={html("interactive")}
				>
					<InteractiveStepperDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Stepper Props">
				<DocPropsTable props={stepperProps} />
			</DocSection>

			<DocSection id="stepper-step" title="StepperStep">
				<DocPropsTable props={stepperStepProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						Use <code className="text-fg text-xs">progress-bar</code> variant for form wizards where
						step names matter
					</li>
					<li>
						Use <code className="text-fg text-xs">segmented</code> variant for minimal flows where
						only progress matters
					</li>
					<li>
						Use <code className="text-fg text-xs">default</code> vertical for sidebar or narrow
						layouts with descriptions
					</li>
					<li>Keep step labels short and descriptive</li>
					<li>Manage activeStep externally to control navigation</li>
					<li>Use 3-7 steps for the best user experience</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Timeline",
							href: "/docs/components/ui/timeline",
							description: "Display a sequence of events in chronological order.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
