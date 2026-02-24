import { Stepper } from "@/components/ui/stepper"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { InteractiveStepperDemo } from "./_demos"

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
		name: "orientation",
		type: '"horizontal" | "vertical"',
		default: '"horizontal"',
		description: "The layout orientation of the stepper.",
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
					title="Horizontal"
					description="The default horizontal stepper layout."
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
					title="Vertical"
					description="A vertical stepper for sidebar or narrow layouts."
					code={`<Stepper
  orientation="vertical"
  steps={[
    { label: "Account" },
    { label: "Profile" },
    { label: "Settings" },
    { label: "Complete" },
  ]}
  activeStep={2}
/>`}
				>
					<Stepper
						orientation="vertical"
						steps={[
							{ label: "Account" },
							{ label: "Profile" },
							{ label: "Settings" },
							{ label: "Complete" },
						]}
						activeStep={2}
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
					<li>Use horizontal steppers for wide layouts and vertical for narrow ones</li>
					<li>Keep step labels short and descriptive</li>
					<li>Add descriptions when the label alone is not clear enough</li>
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
