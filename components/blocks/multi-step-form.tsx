"use client"

import { useState, type ComponentType } from "react"
import type { ZodSchema } from "zod"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Types ─── */

export interface FormStep {
	id: string
	title: string
	schema?: ZodSchema
	component: ComponentType<StepComponentProps>
}

export interface StepComponentProps {
	data: Record<string, unknown>
	onChange: (updates: Record<string, unknown>) => void
	errors?: Record<string, string>
}

export interface MultiStepFormProps {
	steps: FormStep[]
	onSubmit: (data: Record<string, unknown>) => void | Promise<void>
	onSaveDraft?: (data: Record<string, unknown>) => void | Promise<void>
	className?: string
}

/* ─── Component ─── */

export function MultiStepForm({
	steps,
	onSubmit,
	onSaveDraft,
	className,
}: MultiStepFormProps) {
	const [currentStep, setCurrentStep] = useState(0)
	const [formData, setFormData] = useState<Record<string, unknown>>({})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submitting, setSubmitting] = useState(false)

	const step = steps[currentStep]
	const isFirst = currentStep === 0
	const isLast = currentStep === steps.length - 1

	const handleChange = (updates: Record<string, unknown>) => {
		setFormData((prev) => ({ ...prev, ...updates }))
		// Clear errors for changed fields
		const clearedErrors = { ...errors }
		for (const key of Object.keys(updates)) {
			delete clearedErrors[key]
		}
		setErrors(clearedErrors)
	}

	const validateStep = (): boolean => {
		if (!step.schema) return true

		const result = step.schema.safeParse(formData)
		if (result.success) {
			setErrors({})
			return true
		}

		const fieldErrors: Record<string, string> = {}
		for (const issue of result.error.issues) {
			const path = issue.path.join(".")
			if (!fieldErrors[path]) {
				fieldErrors[path] = issue.message
			}
		}
		setErrors(fieldErrors)
		return false
	}

	const handleNext = () => {
		if (!validateStep()) return
		if (isLast) {
			handleSubmit()
		} else {
			setCurrentStep((s) => s + 1)
		}
	}

	const handleBack = () => {
		if (!isFirst) {
			setCurrentStep((s) => s - 1)
		}
	}

	const handleSubmit = async () => {
		if (!validateStep()) return
		setSubmitting(true)
		try {
			await onSubmit(formData)
		} finally {
			setSubmitting(false)
		}
	}

	const handleDraft = async () => {
		if (!onSaveDraft) return
		setSubmitting(true)
		try {
			await onSaveDraft(formData)
		} finally {
			setSubmitting(false)
		}
	}

	const StepComponent = step.component

	return (
		<div className={cn("space-y-6", className)}>
			{/* Step indicator */}
			<nav className="flex items-center gap-2">
				{steps.map((s, i) => {
					const isCompleted = i < currentStep
					const isCurrent = i === currentStep

					return (
						<div key={s.id} className="flex items-center gap-2">
							{i > 0 && <div className="h-px w-8 bg-border" />}
							<div className="flex items-center gap-2">
								<div
									className={cn(
										"flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
										isCompleted &&
											"border-fg bg-fg text-surface",
										isCurrent &&
											"border-fg text-fg",
										!isCompleted &&
											!isCurrent &&
											"border-edge text-fg-muted"
									)}
								>
									{isCompleted ? (
										<Check className="size-3.5" />
									) : (
										i + 1
									)}
								</div>
								<span
									className={cn(
										"text-sm",
										isCurrent
											? "font-medium text-fg"
											: "text-fg-muted"
									)}
								>
									{s.title}
								</span>
							</div>
						</div>
					)
				})}
			</nav>

			{/* Step content */}
			<div className="rounded-lg border p-6">
				<StepComponent
					data={formData}
					onChange={handleChange}
					errors={errors}
				/>
			</div>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
					{!isFirst && (
						<Button variant="outline" onClick={handleBack} disabled={submitting}>
							Précédent
						</Button>
					)}
					{onSaveDraft && (
						<Button
							variant="ghost"
							onClick={handleDraft}
							disabled={submitting}
						>
							Sauvegarder le brouillon
						</Button>
					)}
				</div>

				<Button onClick={handleNext} disabled={submitting}>
					{submitting
						? "Enregistrement..."
						: isLast
							? "Terminer"
							: "Suivant"}
				</Button>
			</div>
		</div>
	)
}
