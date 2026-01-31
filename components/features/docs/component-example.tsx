"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComponentExampleProps {
	title?: string
	description?: string
	children: React.ReactNode
	code: string
	className?: string
}

function highlightCode(code: string): React.ReactNode[] {
	const lines = code.split("\n")

	return lines.map((line, lineIndex) => {
		const tokens: React.ReactNode[] = []
		let remaining = line
		let keyIndex = 0

		while (remaining.length > 0) {
			// Comments
			const commentMatch = remaining.match(/^(\/\/.*|\/\*[\s\S]*?\*\/)/)
			if (commentMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-emerald-600 dark:text-emerald-400">
						{commentMatch[0]}
					</span>
				)
				remaining = remaining.slice(commentMatch[0].length)
				continue
			}

			// Strings (double quotes, single quotes, template literals)
			const stringMatch = remaining.match(/^("[^"]*"|'[^']*'|`[^`]*`)/)
			if (stringMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-amber-600 dark:text-amber-400">
						{stringMatch[0]}
					</span>
				)
				remaining = remaining.slice(stringMatch[0].length)
				continue
			}

			// JSX tags
			const tagMatch = remaining.match(/^(<\/?[A-Z][a-zA-Z0-9.]*|<\/?[a-z][a-z0-9-]*)/)
			if (tagMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-pink-600 dark:text-pink-400">
						{tagMatch[0]}
					</span>
				)
				remaining = remaining.slice(tagMatch[0].length)
				continue
			}

			// Closing bracket for JSX
			const closingMatch = remaining.match(/^(\/>|>)/)
			if (closingMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-pink-600 dark:text-pink-400">
						{closingMatch[0]}
					</span>
				)
				remaining = remaining.slice(closingMatch[0].length)
				continue
			}

			// Props/attributes
			const propMatch = remaining.match(/^([a-zA-Z][a-zA-Z0-9]*)(?==)/)
			if (propMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-sky-600 dark:text-sky-400">
						{propMatch[0]}
					</span>
				)
				remaining = remaining.slice(propMatch[0].length)
				continue
			}

			// Keywords
			const keywordMatch = remaining.match(
				/^(const|let|var|function|return|import|export|from|if|else|for|while|class|extends|new|this|true|false|null|undefined|async|await)\b/
			)
			if (keywordMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-purple-600 dark:text-purple-400">
						{keywordMatch[0]}
					</span>
				)
				remaining = remaining.slice(keywordMatch[0].length)
				continue
			}

			// Numbers
			const numberMatch = remaining.match(/^(\d+\.?\d*)/)
			if (numberMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-orange-600 dark:text-orange-400">
						{numberMatch[0]}
					</span>
				)
				remaining = remaining.slice(numberMatch[0].length)
				continue
			}

			// Braces and brackets
			const braceMatch = remaining.match(/^([{}[\]()=])/)
			if (braceMatch) {
				tokens.push(
					<span key={keyIndex++} className="text-muted-foreground">
						{braceMatch[0]}
					</span>
				)
				remaining = remaining.slice(braceMatch[0].length)
				continue
			}

			// Default: take one character
			tokens.push(
				<span key={keyIndex++} className="text-foreground">
					{remaining[0]}
				</span>
			)
			remaining = remaining.slice(1)
		}

		return (
			<div key={lineIndex} className="table-row">
				<span className="table-cell select-none pr-4 text-right text-muted-foreground/50">
					{lineIndex + 1}
				</span>
				<span className="table-cell">{tokens}</span>
			</div>
		)
	})
}

export function ComponentExample({
	title,
	description,
	children,
	code,
	className,
}: ComponentExampleProps) {
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
					{title && <h3 className="text-sm font-medium">{title}</h3>}
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
			)}

			<Tabs defaultValue="preview" className="w-full">
				<TabsList>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>

				<TabsContent value="preview" className="mt-3">
					<Card className="p-6">{children}</Card>
				</TabsContent>

				<TabsContent value="code" className="mt-3">
					<div className="relative overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900">
						<div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 dark:bg-zinc-800/50">
							<span className="text-xs font-medium text-zinc-400">tsx</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={copyToClipboard}
								className="h-7 gap-1.5 px-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
							>
								{copied ? (
									<>
										<Check className="h-3.5 w-3.5 text-green-500" />
										<span>Copied!</span>
									</>
								) : (
									<>
										<Copy className="h-3.5 w-3.5" />
										<span>Copy</span>
									</>
								)}
							</Button>
						</div>
						<div className="overflow-x-auto p-4">
							<pre className="table text-[13px] leading-relaxed">
								<code>{highlightCode(code)}</code>
							</pre>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
