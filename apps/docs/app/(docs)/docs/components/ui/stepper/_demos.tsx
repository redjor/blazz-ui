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
