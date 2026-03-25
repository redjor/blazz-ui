import { CheckIcon } from "lucide-react"
import { cn } from "../../lib/utils"

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
	/** Visual variant. @default "default" */
	variant?: "default" | "progress-bar" | "segmented"
	/** Orientation (only applies to "default" variant). @default "horizontal" */
	orientation?: "horizontal" | "vertical"
	className?: string
}

/* ---------------------------------------------------------------------------
 * Variant: progress-bar — Thick bar segments with step labels below
 * --------------------------------------------------------------------------- */

function StepperProgressBar({
	steps,
	activeStep,
	className,
}: Pick<StepperProps, "steps" | "activeStep" | "className">) {
	return (
		<div
			data-slot="stepper"
			role="list"
			aria-label="Progress"
			className={cn("flex gap-3", className)}
		>
			{steps.map((step, index) => {
				const status =
					index < activeStep ? "completed" : index === activeStep ? "active" : "pending"

				return (
					<div key={step.label} role="listitem" data-status={status} className="flex-1 space-y-2">
						<div
							className={cn(
								"h-1 rounded-full transition-colors",
								status === "pending" ? "bg-edge" : "bg-fg"
							)}
						/>
						<p
							className={cn(
								"text-sm font-medium",
								status === "pending" ? "text-fg-muted" : "text-fg"
							)}
						>
							{step.label}
						</p>
					</div>
				)
			})}
		</div>
	)
}

/* ---------------------------------------------------------------------------
 * Variant: segmented — Single progress bar with step counter
 * --------------------------------------------------------------------------- */

function StepperSegmented({
	steps,
	activeStep,
	className,
}: Pick<StepperProps, "steps" | "activeStep" | "className">) {
	return (
		<div
			data-slot="stepper"
			role="list"
			aria-label="Progress"
			className={cn("space-y-2", className)}
		>
			<div className="flex gap-1.5">
				{steps.map((step, index) => {
					const status =
						index < activeStep ? "completed" : index === activeStep ? "active" : "pending"

					return (
						<div
							key={step.label}
							role="listitem"
							data-status={status}
							className={cn(
								"h-2 flex-1 rounded-full transition-colors",
								status === "pending" ? "bg-edge" : "bg-fg"
							)}
						/>
					)
				})}
			</div>
			<p className="text-right text-sm text-fg-muted tabular-nums">
				{Math.min(activeStep + 1, steps.length)}{" "}
				<span className="text-fg-muted/60">/ {steps.length}</span>
			</p>
		</div>
	)
}

/* ---------------------------------------------------------------------------
 * Variant: default — Circles with connectors (horizontal / vertical)
 * --------------------------------------------------------------------------- */

function StepperDefault({
	steps,
	activeStep,
	orientation = "horizontal",
	className,
}: Pick<StepperProps, "steps" | "activeStep" | "orientation" | "className">) {
	return (
		<div
			data-slot="stepper"
			role="list"
			aria-label="Progress"
			className={cn(orientation === "horizontal" ? "flex items-start" : "flex flex-col", className)}
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
							orientation === "horizontal" ? "flex flex-1 items-start" : "flex items-start"
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
								{/* Connector before */}
								{(orientation === "horizontal" || index > 0) && (
									<div
										className={cn(
											orientation === "horizontal" ? "h-0.5 flex-1" : "w-0.5 h-6",
											index === 0 ? "bg-transparent" : index <= activeStep ? "bg-brand" : "bg-edge"
										)}
									/>
								)}

								{/* Circle */}
								<div
									className={cn(
										"flex shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
										"size-7",
										status === "completed" && "bg-brand text-brand-fg",
										status === "active" && "border-2 border-brand text-brand bg-card",
										status === "pending" && "border border-edge text-fg-muted bg-card"
									)}
								>
									{status === "completed" ? (
										<CheckIcon className="size-3.5" />
									) : (
										<span className="tabular-nums">{index + 1}</span>
									)}
								</div>

								{/* Connector after */}
								{(orientation === "horizontal" || index < steps.length - 1) && (
									<div
										className={cn(
											orientation === "horizontal" ? "h-0.5 flex-1" : "w-0.5 h-6",
											index === steps.length - 1
												? "bg-transparent"
												: index < activeStep
													? "bg-brand"
													: "bg-edge"
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

/* ---------------------------------------------------------------------------
 * Stepper — Root entry point
 * --------------------------------------------------------------------------- */

function Stepper({ variant = "default", ...props }: StepperProps) {
	if (variant === "progress-bar") return <StepperProgressBar {...props} />
	if (variant === "segmented") return <StepperSegmented {...props} />
	return <StepperDefault {...props} />
}

export { Stepper }
