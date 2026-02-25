import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * Stepper
 * --------------------------------------------------------------------------- */

export interface StepperStep {
	label: string
	description?: string
}

export interface StepperProps {
	steps: StepperStep[]
	/** Current active step (0-indexed) */
	activeStep: number
	/** Orientation. @default "horizontal" */
	orientation?: "horizontal" | "vertical"
	className?: string
}

function Stepper({
	steps,
	activeStep,
	orientation = "horizontal",
	className,
}: StepperProps) {
	return (
		<div
			data-slot="stepper"
			role="list"
			aria-label="Progress"
			className={cn(
				orientation === "horizontal"
					? "flex items-start"
					: "flex flex-col",
				className
			)}
		>
			{steps.map((step, index) => {
				const status =
					index < activeStep ? "completed" : index === activeStep ? "active" : "pending"

				return (
					<div
						key={step.label}
						role="listitem"
						data-status={status}
						className={cn(
							orientation === "horizontal"
								? "flex flex-1 items-start"
								: "flex items-start"
						)}
					>
						{/* Step indicator + connector */}
						<div
							className={cn(
								orientation === "horizontal"
									? "flex flex-1 flex-col items-center gap-1.5"
									: "flex items-start gap-3"
							)}
						>
							{/* Circle + line */}
							<div
								className={cn(
									orientation === "horizontal"
										? "flex w-full items-center"
										: "flex flex-col items-center"
								)}
							>
								{/* Connector before (not for first) */}
								{index > 0 && (
									<div
										className={cn(
											orientation === "horizontal"
												? "h-0.5 flex-1"
												: "w-0.5 h-6",
											index <= activeStep ? "bg-brand" : "bg-edge"
										)}
									/>
								)}

								{/* Circle */}
								<div
									className={cn(
										"flex shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
										"size-7",
										status === "completed" && "bg-brand text-brand-fg",
										status === "active" && "border-2 border-brand text-brand bg-surface",
										status === "pending" && "border border-edge text-fg-muted bg-surface"
									)}
								>
									{status === "completed" ? (
										<CheckIcon className="size-3.5" />
									) : (
										<span className="tabular-nums">{index + 1}</span>
									)}
								</div>

								{/* Connector after (not for last) */}
								{index < steps.length - 1 && (
									<div
										className={cn(
											orientation === "horizontal"
												? "h-0.5 flex-1"
												: "w-0.5 h-6",
											index < activeStep ? "bg-brand" : "bg-edge"
										)}
									/>
								)}
							</div>

							{/* Label + description */}
							{orientation === "horizontal" && (
								<div className="text-center">
									<p
										className={cn(
											"text-xs font-medium",
											status === "active" ? "text-fg" : "text-fg-muted"
										)}
									>
										{step.label}
									</p>
									{step.description && (
										<p className="text-xs text-fg-muted mt-0.5">{step.description}</p>
									)}
								</div>
							)}
						</div>

						{/* Vertical labels */}
						{orientation === "vertical" && (
							<div className="pb-6">
								<p
									className={cn(
										"text-sm font-medium",
										status === "active" ? "text-fg" : "text-fg-muted"
									)}
								>
									{step.label}
								</p>
								{step.description && (
									<p className="text-xs text-fg-muted mt-0.5">{step.description}</p>
								)}
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export { Stepper }
