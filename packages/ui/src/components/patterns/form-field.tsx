"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export interface FormFieldOption {
	value: string
	label: string
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
	name: FieldPath<TFieldValues>
	label: string
	control: Control<TFieldValues>
	type?: "text" | "email" | "tel" | "number" | "password" | "select" | "textarea"
	placeholder?: string
	description?: string
	required?: boolean
	options?: FormFieldOption[]
	rows?: number
	span?: number
	className?: string
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
	name,
	label,
	control,
	type = "text",
	placeholder,
	description,
	required,
	options,
	rows = 3,
	span,
	className,
}: FormFieldProps<TFieldValues>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<div
					className={cn("space-y-1.5", className)}
					style={span ? { gridColumn: `span ${span}` } : undefined}
				>
					<Label htmlFor={name}>
						{label}
						{required && <span className="text-negative ml-0.5">*</span>}
					</Label>

					{type === "select" && options ? (
						<select
							id={name}
							className={cn(
								"flex h-8 w-full rounded-md border border-field bg-card px-3 py-1 text-sm shadow-sm transition-colors",
								"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand",
								"disabled:cursor-not-allowed disabled:opacity-50",
								fieldState.error && "border-negative"
							)}
							value={field.value ?? ""}
							onChange={field.onChange}
							onBlur={field.onBlur}
						>
							<option value="">Sélectionner...</option>
							{options.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					) : type === "textarea" ? (
						<textarea
							id={name}
							className={cn(
								"flex w-full rounded-md border border-field bg-card px-3 py-2 text-sm shadow-sm transition-colors",
								"placeholder:text-fg-muted",
								"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand",
								"disabled:cursor-not-allowed disabled:opacity-50",
								fieldState.error && "border-negative"
							)}
							rows={rows}
							placeholder={placeholder}
							value={field.value ?? ""}
							onChange={field.onChange}
							onBlur={field.onBlur}
						/>
					) : (
						<Input
							id={name}
							type={type}
							placeholder={placeholder}
							className={cn(fieldState.error && "border-negative")}
							value={field.value ?? ""}
							onChange={field.onChange}
							onBlur={field.onBlur}
						/>
					)}

					{description && !fieldState.error && (
						<p className="text-xs text-fg-muted">{description}</p>
					)}
					{fieldState.error && <p className="text-xs text-negative">{fieldState.error.message}</p>}
				</div>
			)}
		/>
	)
}
