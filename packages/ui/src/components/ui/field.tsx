"use client"

import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "../../lib/utils"
import { Label } from "./label"

type FieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName
}

const FieldContext = React.createContext<FieldContextValue>({} as FieldContextValue)

const FormItemContext = React.createContext<{ id: string }>({ id: "" })

const Field = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FieldContext.Provider>
	)
}

const useFieldContext = () => {
	const fieldContext = React.useContext(FieldContext)
	const itemContext = React.useContext(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error("useFieldContext must be used within Field")
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	}
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const id = React.useId()

		return (
			<FormItemContext.Provider value={{ id }}>
				<div ref={ref} className={cn("space-y-2", className)} {...props} />
			</FormItemContext.Provider>
		)
	}
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
	React.ElementRef<typeof Label>,
	React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFieldContext()

	return (
		<Label
			ref={ref}
			className={cn(error && "text-negative", className)}
			htmlFor={formItemId}
			{...props}
		/>
	)
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ ...props }, ref) => {
		const { error, formItemId, formDescriptionId, formMessageId } = useFieldContext()

		return (
			<div
				ref={ref}
				id={formItemId}
				aria-describedby={
					!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
				}
				aria-invalid={!!error}
				{...props}
			/>
		)
	}
)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFieldContext()

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn("text-sm text-fg-muted", className)}
			{...props}
		/>
	)
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
	({ className, children, ...props }, ref) => {
		const { error, formMessageId } = useFieldContext()
		const body = error ? String(error?.message) : children

		if (!body) {
			return null
		}

		return (
			<p
				ref={ref}
				id={formMessageId}
				className={cn("text-sm font-medium text-negative", className)}
				{...props}
			>
				{body}
			</p>
		)
	}
)
FormMessage.displayName = "FormMessage"

export {
	useFieldContext,
	Field,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormProvider as Form,
}
