"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Label } from "./label"

/* ─── Context ──────────────────────────────────────────── */

type FieldContextValue = {
	id: string
	descriptionId: string
	errorId: string
	hasError: boolean
	setHasError: (v: boolean) => void
}

const FieldContext = React.createContext<FieldContextValue | null>(null)

function useFieldContext() {
	const ctx = React.useContext(FieldContext)
	if (!ctx) throw new Error("Field.* components must be used within <Field>")
	return ctx
}

/* ─── Field (root) ─────────────────────────────────────── */

type FieldProps = React.ComponentProps<"div"> & {
	orientation?: "vertical" | "horizontal"
}

function Field({ orientation = "vertical", className, ...props }: FieldProps) {
	const id = React.useId()
	const [hasError, setHasError] = React.useState(false)

	const ctx = React.useMemo<FieldContextValue>(
		() => ({
			id,
			descriptionId: `${id}-description`,
			errorId: `${id}-error`,
			hasError,
			setHasError,
		}),
		[id, hasError]
	)

	return (
		<FieldContext.Provider value={ctx}>
			<div
				data-slot="field"
				data-invalid={hasError || undefined}
				className={cn(
					orientation === "horizontal"
						? "grid grid-cols-[minmax(120px,auto)_1fr] items-start gap-x-4 gap-y-1"
						: "flex flex-col gap-1.5",
					className
				)}
				{...props}
			/>
		</FieldContext.Provider>
	)
}

/* ─── FieldGroup ──────────────────────────────────────── */

type FieldGroupProps = React.ComponentProps<"div">

function FieldGroup({ className, ...props }: FieldGroupProps) {
	return (
		<div
			data-slot="field-group"
			className={cn("flex flex-col gap-4", className)}
			{...props}
		/>
	)
}

/* ─── FieldTitle ──────────────────────────────────────── */

type FieldTitleProps = React.ComponentProps<"span">

function FieldTitle({ className, ...props }: FieldTitleProps) {
	return (
		<span
			data-slot="field-title"
			className={cn("text-sm font-medium leading-none", className)}
			{...props}
		/>
	)
}

/* ─── FieldLabel ───────────────────────────────────────── */

type FieldLabelProps = React.ComponentProps<typeof Label>

function FieldLabel({ className, ...props }: FieldLabelProps) {
	const ctx = React.useContext(FieldContext)

	return (
		<Label
			htmlFor={ctx?.id}
			className={cn(ctx?.hasError && "text-negative", className)}
			{...props}
		/>
	)
}

/* ─── FieldContent ─────────────────────────────────────── */

type FieldContentProps = React.ComponentProps<"div">

function FieldContent({ className, ...props }: FieldContentProps) {
	return (
		<div
			data-slot="field-content"
			className={cn("flex flex-col gap-1.5", className)}
			{...props}
		/>
	)
}

/* ─── FieldControl ─────────────────────────────────────── */

type FieldControlProps = {
	children: React.ReactElement<Record<string, unknown>>
	/** Render function alternative — receives { id, descriptionId, errorId, hasError } */
	render?: (ctx: { id: string; descriptionId: string; errorId: string; hasError: boolean }) => React.ReactNode
}

function FieldControl({ children, render }: FieldControlProps) {
	const { id, descriptionId, errorId, hasError } = useFieldContext()

	if (render) {
		return <>{render({ id, descriptionId, errorId, hasError })}</>
	}

	return React.cloneElement(children, {
		id,
		"aria-describedby": hasError ? `${descriptionId} ${errorId}` : descriptionId,
		"aria-invalid": hasError || undefined,
	} as Record<string, unknown>)
}

/* ─── FieldDescription ─────────────────────────────────── */

type FieldDescriptionProps = React.ComponentProps<"p">

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
	const { descriptionId } = useFieldContext()

	return (
		<p
			id={descriptionId}
			data-slot="field-description"
			className={cn("text-sm text-fg-muted", className)}
			{...props}
		/>
	)
}

/* ─── FieldError ───────────────────────────────────────── */

type FieldErrorProps = React.ComponentProps<"p"> & {
	errors?: string[]
}

function FieldError({ errors, children, className, ...props }: FieldErrorProps) {
	const { errorId, setHasError } = useFieldContext()

	const messages = errors?.length ? errors : children ? [children] : []
	const hasMessages = messages.length > 0

	React.useEffect(() => {
		setHasError(hasMessages)
		return () => setHasError(false)
	}, [hasMessages, setHasError])

	if (!hasMessages) return null

	return (
		<div id={errorId} data-slot="field-error" aria-live="polite">
			{(errors ?? []).map((msg) => (
				<p
					key={msg}
					className={cn("text-sm text-negative", className)}
					{...props}
				>
					{msg}
				</p>
			))}
			{!errors && children && (
				<p className={cn("text-sm text-negative", className)} {...props}>
					{children}
				</p>
			)}
		</div>
	)
}

/* ─── Exports ──────────────────────────────────────────── */

export {
	Field,
	FieldGroup,
	FieldTitle,
	FieldLabel,
	FieldContent,
	FieldControl,
	FieldDescription,
	FieldError,
	useFieldContext,
}

export type {
	FieldProps,
	FieldGroupProps,
	FieldTitleProps,
	FieldLabelProps,
	FieldContentProps,
	FieldControlProps,
	FieldDescriptionProps,
	FieldErrorProps,
}
