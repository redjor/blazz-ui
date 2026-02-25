"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Check, X, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface InlineEditProps {
	value: string
	onSave: (value: string) => void | Promise<void>
	type?: "text" | "number"
	placeholder?: string
	className?: string
	inputClassName?: string
	renderValue?: (value: string) => React.ReactNode
}

export function InlineEdit({
	value,
	onSave,
	type = "text",
	placeholder = "—",
	className,
	inputClassName,
	renderValue,
}: InlineEditProps) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(value)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus()
			inputRef.current?.select()
		}
	}, [editing])

	useEffect(() => {
		setDraft(value)
	}, [value])

	const save = useCallback(async () => {
		if (draft !== value) {
			await onSave(draft)
		}
		setEditing(false)
	}, [draft, value, onSave])

	const cancel = useCallback(() => {
		setDraft(value)
		setEditing(false)
	}, [value])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault()
				save()
			} else if (e.key === "Escape") {
				cancel()
			}
		},
		[save, cancel]
	)

	if (editing) {
		return (
			<div className={cn("flex items-center gap-1", className)}>
				<Input
					ref={inputRef}
					type={type}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onBlur={save}
					onKeyDown={handleKeyDown}
					className={cn("h-7 text-sm", inputClassName)}
				/>
				<button
					type="button"
					onMouseDown={(e) => e.preventDefault()}
					onClick={save}
					className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-fg-muted hover:text-fg"
				>
					<Check className="size-3.5" />
				</button>
				<button
					type="button"
					onMouseDown={(e) => e.preventDefault()}
					onClick={cancel}
					className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-fg-muted hover:text-negative"
				>
					<X className="size-3.5" />
				</button>
			</div>
		)
	}

	return (
		<button
			type="button"
			onClick={() => setEditing(true)}
			className={cn(
				"group inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-sm transition-colors hover:bg-raised",
				!value && "text-fg-muted",
				className
			)}
		>
			{renderValue ? renderValue(value) : value || placeholder}
			<Pencil className="size-3 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
		</button>
	)
}
