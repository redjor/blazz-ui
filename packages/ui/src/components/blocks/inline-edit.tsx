"use client"

import { Check, Pencil, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { withProGuard } from "../../lib/with-pro-guard"
import { Input } from "../ui/input"

export interface InlineEditProps {
	value: string
	onSave: (value: string) => void | Promise<void>
	type?: "text" | "number"
	placeholder?: string
	className?: string
	inputClassName?: string
	renderValue?: (value: string) => React.ReactNode
}

function InlineEditBase({
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
				"group inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-sm transition-colors hover:bg-surface-3",
				!value && "text-fg-muted",
				className
			)}
		>
			{renderValue ? renderValue(value) : value || placeholder}
			<Pencil className="size-3 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
		</button>
	)
}

export const InlineEdit = withProGuard(InlineEditBase, "InlineEdit")
