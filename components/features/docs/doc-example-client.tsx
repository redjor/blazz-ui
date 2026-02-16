"use client"

import * as React from "react"
import { Check, ChevronDown, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DocExampleClientProps {
	title?: string
	description?: string
	code: string
	highlightedCode: string
	children: React.ReactNode
	className?: string
	previewClassName?: string
	defaultExpanded?: boolean
}

export function DocExampleClient({
	title,
	description,
	code,
	highlightedCode,
	children,
	className,
	previewClassName,
	defaultExpanded = false,
}: DocExampleClientProps) {
	const [showCode, setShowCode] = React.useState(defaultExpanded)
	const [copied, setCopied] = React.useState(false)

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className={cn("space-y-3", className)}>
			{(title || description) && (
				<div className="space-y-1">
					{title && <h3 className="text-sm font-medium text-fg">{title}</h3>}
					{description && (
						<p className="text-[13px] text-fg-muted">{description}</p>
					)}
				</div>
			)}

			{/* Preview */}
			<div className={cn("rounded-lg border border-edge bg-surface p-6", previewClassName)}>{children}</div>

			{/* Code toggle bar */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setShowCode(!showCode)}
					className="flex items-center gap-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
				>
					<ChevronDown
						className={cn(
							"size-3.5 transition-transform duration-200",
							showCode && "rotate-180"
						)}
					/>
					{showCode ? "Hide code" : "Show code"}
				</button>
				<Button
					variant="ghost"
					size="sm"
					onClick={copyToClipboard}
					className="ml-auto h-6 gap-1 px-2 text-xs text-fg-muted"
				>
					{copied ? (
						<>
							<Check className="size-3 text-positive" />
							Copied
						</>
					) : (
						<>
							<Copy className="size-3" />
							Copy
						</>
					)}
				</Button>
			</div>

			{/* Code block (collapsible) */}
			{showCode && (
				<div
					className="overflow-hidden rounded-lg border border-edge [&_.shiki]:overflow-x-auto [&_.shiki]:p-4 [&_.shiki]:text-[13px] [&_.shiki]:leading-relaxed [&_code]:font-mono"
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
				/>
			)}
		</div>
	)
}
