"use client"

import * as React from "react"
import { Stepper } from "@blazz/ui/components/ui/stepper"

const steps = [
	{ label: "Account", description: "Create your account" },
	{ label: "Profile", description: "Set up your profile" },
	{ label: "Settings", description: "Configure preferences" },
	{ label: "Complete", description: "All done" },
]

export function InteractiveStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(0)

	return (
		<div className="space-y-6">
			<Stepper steps={steps} activeStep={activeStep} />
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:opacity-50 disabled:pointer-events-none"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.min(steps.length, s + 1))}
					disabled={activeStep === steps.length}
					className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-sm font-medium text-brand-fg transition-colors hover:bg-brand/90 disabled:opacity-50 disabled:pointer-events-none"
				>
					Next
				</button>
			</div>
			<p className="text-center text-xs text-fg-muted">
				Step {activeStep + 1} of {steps.length}
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

export function ProgressBarStepperDemo() {
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
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:opacity-50 disabled:pointer-events-none"
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

export function SegmentedStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(0)
	const totalSteps = 4
	const segmentedSteps = Array.from({ length: totalSteps }, (_, i) => ({
		label: `Step ${i + 1}`,
	}))

	return (
		<div className="space-y-6">
			<Stepper variant="segmented" steps={segmentedSteps} activeStep={activeStep} />
			<p className="text-center text-sm text-fg-muted">
				Step {activeStep + 1} content
			</p>
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:opacity-50 disabled:pointer-events-none"
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

export function VerticalStepperDemo() {
	const [activeStep, setActiveStep] = React.useState(1)

	const verticalSteps = [
		{ label: "Account", description: "Create your account" },
		{ label: "Profile", description: "Set up your profile" },
		{ label: "Review", description: "Confirm your details" },
	]

	return (
		<div className="space-y-6">
			<Stepper
				orientation="vertical"
				steps={verticalSteps}
				activeStep={activeStep}
			/>
			<p className="text-center text-sm text-fg-muted">
				{verticalSteps[activeStep]?.label} content
			</p>
			<div className="flex items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
					disabled={activeStep === 0}
					className="inline-flex h-8 items-center rounded-md border border-edge bg-surface px-3 text-sm font-medium text-fg transition-colors hover:bg-raised disabled:opacity-50 disabled:pointer-events-none"
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
