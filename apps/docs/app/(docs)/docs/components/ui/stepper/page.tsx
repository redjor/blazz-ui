import { Stepper } from "@blazz/ui/components/ui/stepper"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import {
	InteractiveStepperDemo,
	ProgressBarStepperDemo,
	SegmentedStepperDemo,
	VerticalStepperDemo,
} from "./_demos"

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
		description: "The current active step index (0-based). Steps before this index are marked as completed.",
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

export default function StepperPage() {
	return (
		<DocPage
			title="Stepper"
			subtitle="A step indicator component for multi-step workflows. Displays progress through a sequence of steps with completed, active, and pending states."
			toc={toc}
		>
			{/* Hero */}
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

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Stepper with progress bar and titles"
					description="Thick bar segments above step labels. Completed and active steps are highlighted."
					code={`<Stepper
  variant="progress-bar"
  steps={[
    { label: "User Details" },
    { label: "Payment Info" },
    { label: "Auth OTP" },
    { label: "Preview Form" },
  ]}
  activeStep={1}
/>`}
				>
					<ProgressBarStepperDemo />
				</DocExample>

				<DocExample
					title="Stepper with segmented progress bar"
					description="A segmented bar with a step counter. Ideal for minimal wizard-style flows."
					code={`<Stepper
  variant="segmented"
  steps={[
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
    { label: "Step 4" },
  ]}
  activeStep={0}
/>`}
				>
					<SegmentedStepperDemo />
				</DocExample>

				<DocExample
					title="Vertical stepper"
					description="A vertical stepper with labels and descriptions. Ideal for sidebar or narrow layouts."
					code={`<Stepper
  orientation="vertical"
  steps={[
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Set up your profile" },
    { label: "Review", description: "Confirm your details" },
  ]}
  activeStep={1}
/>`}
				>
					<VerticalStepperDemo />
				</DocExample>

				<DocExample
					title="Horizontal (default)"
					description="The default horizontal stepper with circles and connectors."
					code={`<Stepper
  steps={[
    { label: "Account" },
    { label: "Profile" },
    { label: "Settings" },
    { label: "Complete" },
  ]}
  activeStep={1}
/>`}
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
				</DocExample>

				<DocExample
					title="All States"
					description="Demonstrating completed, active, and pending step states."
					code={`{/* All pending */}
<Stepper steps={steps} activeStep={0} />

{/* Middle step active */}
<Stepper steps={steps} activeStep={2} />

{/* All completed */}
<Stepper steps={steps} activeStep={4} />`}
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
				</DocExample>

				<DocExample
					title="With Descriptions"
					description="Steps can include descriptions for additional context."
					code={`<Stepper
  steps={[
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Set up your profile" },
    { label: "Settings", description: "Configure preferences" },
    { label: "Complete", description: "All done" },
  ]}
  activeStep={1}
/>`}
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
				</DocExample>

				<DocExample
					title="Interactive"
					description="An interactive stepper with Previous and Next buttons."
					code={`const [activeStep, setActiveStep] = React.useState(0)

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
</button>`}
				>
					<InteractiveStepperDemo />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Stepper Props">
				<DocPropsTable props={stepperProps} />
			</DocSection>

			<DocSection id="stepper-step" title="StepperStep">
				<DocPropsTable props={stepperStepProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use <code className="text-fg text-xs">progress-bar</code> variant for form wizards where step names matter</li>
					<li>Use <code className="text-fg text-xs">segmented</code> variant for minimal flows where only progress matters</li>
					<li>Use <code className="text-fg text-xs">default</code> vertical for sidebar or narrow layouts with descriptions</li>
					<li>Keep step labels short and descriptive</li>
					<li>Manage activeStep externally to control navigation</li>
					<li>Use 3-7 steps for the best user experience</li>
				</ul>
			</DocSection>

			{/* Related */}
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
