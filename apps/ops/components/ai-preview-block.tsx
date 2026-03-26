"use client"

import { useCompletion } from "@ai-sdk/react"
import { Button } from "@blazz/ui/components/ui/button"
import { Card } from "@blazz/ui/components/ui/card"
import { ArrowUp, Check, Loader2, RefreshCw, Sparkles, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export type AIAction = "ask" | "continue" | "summarize" | "fix" | "translate" | "tone_professional" | "tone_casual" | "tone_friendly" | "tone_concise"

interface AIPreviewBlockProps {
	action: AIAction
	initialPrompt?: string
	editorContext: string
	onApply: (text: string) => void
	onDiscard: () => void
}

export function AIPreviewBlock({ action, initialPrompt, editorContext, onApply, onDiscard }: AIPreviewBlockProps) {
	const [refinementInput, setRefinementInput] = useState("")
	const [currentPrompt, setCurrentPrompt] = useState(initialPrompt ?? "")
	const inputRef = useRef<HTMLInputElement>(null)

	const { completion, isLoading, complete } = useCompletion({
		api: "/api/ai/editor",
		streamProtocol: "text",
		body: { action, context: editorContext },
	})

	// Auto-trigger on mount (except "ask" which needs prompt first)
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only effect
	useEffect(() => {
		if (action === "ask" && !initialPrompt) return
		complete(currentPrompt || editorContext)
	}, [])

	const handleTryAgain = useCallback(() => {
		complete(currentPrompt || editorContext)
	}, [complete, currentPrompt, editorContext])

	const handleRefinement = useCallback(() => {
		if (!refinementInput.trim()) return
		const newPrompt = `Previous result:\n${completion}\n\nRefinement: ${refinementInput}`
		setCurrentPrompt(newPrompt)
		setRefinementInput("")
		complete(newPrompt)
	}, [refinementInput, completion, complete])

	const needsInitialPrompt = action === "ask" && !initialPrompt && !completion && !isLoading

	return (
		<Card className="border-brand/30 bg-raised shadow-lg overflow-hidden">
			{(completion || isLoading) && (
				<div className="px-4 py-3 text-sm text-fg leading-relaxed whitespace-pre-wrap">
					{completion || (
						<span className="flex items-center gap-2 text-fg-muted">
							<Loader2 className="size-3.5 animate-spin" />
							Generation en cours…
						</span>
					)}
				</div>
			)}

			{needsInitialPrompt && (
				<div className="px-4 py-3">
					<div className="flex items-center gap-2">
						<Sparkles className="size-4 text-brand shrink-0" />
						<input
							ref={inputRef}
							type="text"
							placeholder="Ask AI what you want..."
							className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-muted outline-none"
							value={currentPrompt}
							onChange={(e) => setCurrentPrompt(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && currentPrompt.trim()) {
									complete(currentPrompt)
								}
								if (e.key === "Escape") onDiscard()
							}}
							// biome-ignore lint/a11y/noAutofocus: AI prompt input needs immediate focus
							autoFocus
						/>
						<button type="button" onClick={() => currentPrompt.trim() && complete(currentPrompt)} disabled={!currentPrompt.trim()} className="p-1 rounded-full bg-brand text-white disabled:opacity-40">
							<ArrowUp className="size-3.5" />
						</button>
					</div>
				</div>
			)}

			{(completion || isLoading) && (
				<div className="border-t border-separator px-3 py-2 space-y-2">
					{!isLoading && completion && (
						<div className="flex items-center gap-2">
							<Sparkles className="size-3.5 text-brand shrink-0" />
							<input
								type="text"
								placeholder="Tell AI what else needs to be changed..."
								className="flex-1 bg-transparent text-xs text-fg placeholder:text-fg-muted outline-none"
								value={refinementInput}
								onChange={(e) => setRefinementInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") handleRefinement()
									if (e.key === "Escape") onDiscard()
								}}
							/>
							{refinementInput.trim() && (
								<button type="button" onClick={handleRefinement} className="p-1 rounded-full bg-brand text-white">
									<ArrowUp className="size-3" />
								</button>
							)}
						</div>
					)}

					<div className="flex items-center justify-between">
						<Button variant="ghost" size="sm" onClick={handleTryAgain} disabled={isLoading}>
							<RefreshCw className="size-3 mr-1" />
							Try again
						</Button>
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" onClick={onDiscard}>
								<X className="size-3 mr-1" />
								Discard
							</Button>
							<Button size="sm" onClick={() => onApply(completion)} disabled={isLoading || !completion}>
								<Check className="size-3 mr-1" />
								Apply
							</Button>
						</div>
					</div>
				</div>
			)}
		</Card>
	)
}
