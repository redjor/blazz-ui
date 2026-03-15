"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@blazz/ui/components/ui/tabs"
import { Button } from "@blazz/ui/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { ComponentEntry } from "~/lib/registry"
import { loadState, saveState, clearState } from "~/lib/persistence"
import { PreviewPanel, createCallbackProxy } from "~/components/preview-panel"
import type { CallbackEvent } from "~/components/callback-toast"
import { PropsPanel } from "~/components/props-panel"
import { CodeEditor } from "~/components/code-editor"

// ── Helpers ─────────────────────────────────────

function getDefaultProps(entry: ComponentEntry): Record<string, unknown> {
	const defaults: Record<string, unknown> = {}
	for (const prop of entry.props) {
		if (prop.default !== undefined) {
			defaults[prop.name] = prop.default
		}
	}
	return defaults
}

// ── SandboxShell ────────────────────────────────

interface SandboxShellProps {
	entry: ComponentEntry
}

export function SandboxShell({ entry }: SandboxShellProps) {
	const persisted = useMemo(() => loadState(entry.slug), [entry.slug])

	const [code, setCode] = useState(
		() => persisted?.code ?? entry.defaultCode,
	)
	const [propValues, setPropValues] = useState<Record<string, unknown>>(
		() => persisted?.props ?? getDefaultProps(entry),
	)
	const [activeTab, setActiveTab] = useState<"controls" | "code">("controls")
	const [callbackEvents, setCallbackEvents] = useState<CallbackEvent[]>([])
	const [splitRatio, setSplitRatio] = useState(0.6)

	// ── Callback proxies ──────────────────────────
	const callbackProxies = useMemo(() => {
		const proxies: Record<string, unknown> = {}
		for (const prop of entry.props) {
			if (prop.type === "function") {
				proxies[prop.name] = createCallbackProxy(prop.name, (event) => {
					setCallbackEvents((prev) => [...prev.slice(-2), event])
				})
			}
		}
		return proxies
	}, [entry.props])

	// ── Extra scope: prop values + callback proxies ──
	const extraScope = useMemo(
		() => ({ ...propValues, ...callbackProxies }),
		[propValues, callbackProxies],
	)

	// ── Auto-save (debounced) ─────────────────────
	useEffect(() => {
		const timer = setTimeout(() => {
			saveState(entry.slug, { code, props: propValues })
		}, 500)
		return () => clearTimeout(timer)
	}, [code, propValues, entry.slug])

	// ── Reset ─────────────────────────────────────
	const handleReset = useCallback(() => {
		clearState(entry.slug)
		setCode(entry.defaultCode)
		setPropValues(getDefaultProps(entry))
		setCallbackEvents([])
	}, [entry])

	// ── Prop change handler ───────────────────────
	const handlePropChange = useCallback(
		(name: string, value: unknown) => {
			setPropValues((prev) => ({ ...prev, [name]: value }))
		},
		[],
	)

	// ── Resizable split drag ──────────────────────
	const containerRef = useRef<HTMLDivElement>(null)
	const isDragging = useRef(false)

	const handleDragStart = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			isDragging.current = true

			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!isDragging.current || !containerRef.current) return
				const rect = containerRef.current.getBoundingClientRect()
				const y = moveEvent.clientY - rect.top
				const ratio = Math.min(0.8, Math.max(0.2, y / rect.height))
				setSplitRatio(ratio)
			}

			const handleMouseUp = () => {
				isDragging.current = false
				document.removeEventListener("mousemove", handleMouseMove)
				document.removeEventListener("mouseup", handleMouseUp)
			}

			document.addEventListener("mousemove", handleMouseMove)
			document.addEventListener("mouseup", handleMouseUp)
		},
		[],
	)

	return (
		<div ref={containerRef} className="flex flex-col h-full">
			{/* Title bar */}
			<div className="flex items-center justify-between px-4 py-2 border-b border-edge">
				<div className="flex items-center gap-2">
					<h1 className="text-sm font-semibold">{entry.name}</h1>
					<span className="text-xs text-fg-muted bg-raised px-1.5 py-0.5 rounded">
						{entry.category}
					</span>
				</div>
			</div>

			{/* Preview panel (top) */}
			<div style={{ flex: splitRatio }} className="min-h-0 overflow-hidden">
				<PreviewPanel code={code} extraScope={extraScope} />
			</div>

			{/* Drag handle */}
			<div
				role="separator"
				aria-orientation="horizontal"
				className="h-1 cursor-row-resize bg-edge/50 hover:bg-brand/30 transition-colors flex-shrink-0"
				onMouseDown={handleDragStart}
			/>

			{/* Bottom panel (tabs) */}
			<div
				style={{ flex: 1 - splitRatio }}
				className="min-h-0 overflow-hidden flex flex-col"
			>
				<Tabs
					value={activeTab}
					onValueChange={(v) =>
						setActiveTab(v as "controls" | "code")
					}
					className="flex flex-col h-full"
				>
					<div className="flex items-center border-b border-edge px-2">
						<TabsList className="bg-transparent">
							<TabsTrigger value="controls" className="text-xs">
								Controls
							</TabsTrigger>
							<TabsTrigger value="code" className="text-xs">
								Code
							</TabsTrigger>
						</TabsList>
						<div className="flex-1" />
						<Button
							variant="ghost"
							size="xs"
							onClick={handleReset}
							title="Reset to defaults"
						>
							<RotateCcw className="size-3 mr-1" />
							<span className="text-xs">Reset</span>
						</Button>
					</div>

					<TabsContent value="controls" className="flex-1 min-h-0 m-0">
						<PropsPanel
							props={entry.props}
							values={propValues}
							onChange={handlePropChange}
							onReset={handleReset}
						/>
					</TabsContent>

					<TabsContent value="code" className="flex-1 min-h-0 m-0">
						<CodeEditor value={code} onChange={setCode} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}
