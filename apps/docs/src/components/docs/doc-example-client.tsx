"use client"

import { cn } from "@blazz/ui/lib/utils"
import { Check, ChevronDown, Copy } from "lucide-react"
import * as React from "react"

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

function escapeHtml(str: string) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Client-safe variant of DocExample — skips Shiki highlighting.
 * Use this when the parent page is a Client Component ('use client').
 */
export function DocExampleSync({ code, ...props }: Omit<DocExampleClientProps, "highlightedCode">) {
	return (
		<DocExampleClient
			{...props}
			code={code}
			highlightedCode={`<pre class="shiki" style="background-color:transparent"><code>${escapeHtml(code)}</code></pre>`}
		/>
	)
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
					{description && <p className="text-[13px] text-fg-muted">{description}</p>}
				</div>
			)}

			{/* Preview */}
			<div className={cn("rounded-lg border border-container bg-muted p-6", previewClassName)}>
				{children}
			</div>

			{/* Code block with header bar */}
			<div className="overflow-hidden rounded-lg border border-container bg-muted/30">
				{/* Header bar */}
				<div className="flex items-center justify-between border-b border-container bg-muted/50 px-4 py-2">
					<button
						type="button"
						onClick={() => setShowCode(!showCode)}
						className="flex items-center gap-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
					>
						<ChevronDown
							className={cn("size-3.5 transition-transform duration-200", showCode && "rotate-180")}
						/>
						{showCode ? "Hide code" : "Show code"}
					</button>
					<button
						type="button"
						onClick={copyToClipboard}
						className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors hover:text-fg hover:bg-muted"
					>
						{copied ? <Check className="size-3.5 text-positive" /> : <Copy className="size-3.5" />}
					</button>
				</div>

				{/* Collapsible code */}
				{showCode && (
					<div
						className="[&_.shiki]:overflow-x-auto [&_.shiki]:p-4 [&_.shiki]:text-[13px] [&_.shiki]:leading-relaxed [&_code]:font-mono"
						dangerouslySetInnerHTML={{ __html: highlightedCode }}
					/>
				)}
			</div>
		</div>
	)
}
