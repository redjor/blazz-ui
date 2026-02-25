"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
	/** Show password visibility toggle. @default true */
	showToggle?: boolean
}

function PasswordInput({ className, showToggle = true, ...props }: PasswordInputProps) {
	const [visible, setVisible] = React.useState(false)

	return (
		<div className="relative">
			<input
				type={visible ? "text" : "password"}
				data-slot="password-input"
				className={cn(
					"w-full min-w-0 outline-none",
					"bg-surface",
					"hover:bg-raised",
					"border border-edge",
					"hover:border-edge",
					"focus:border-brand",
					"focus:ring-[3px] focus:ring-brand/20",
					"h-8 rounded-md px-2.5 py-1",
					showToggle && "pr-8",
					"text-sm text-fg",
					"placeholder:text-fg-subtle",
					"transition-colors duration-150 ease-out",
					"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
					"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20",
					className
				)}
				{...props}
			/>
			{showToggle && (
				<button
					type="button"
					tabIndex={-1}
					onClick={() => setVisible((v) => !v)}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors outline-none"
					aria-label={visible ? "Hide password" : "Show password"}
				>
					{visible ? (
						<EyeOffIcon className="size-4" />
					) : (
						<EyeIcon className="size-4" />
					)}
				</button>
			)}
		</div>
	)
}

export { PasswordInput }
