"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { LayoutGrid, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CallbackEvent } from "~/components/callback-toast"
import { CodeEditor } from "~/components/code-editor"
import { ElementPanel } from "~/components/element-panel"
import { ExamplesPanel } from "~/components/examples-panel"
import type { InspectedElement } from "~/components/preview-panel"
import { createCallbackProxy, PreviewPanel } from "~/components/preview-panel"
import { PropsPanel } from "~/components/props-panel"
import { DEFAULT_THEME_CSS, ThemeEditor } from "~/components/theme-editor"
import { VariantsGrid } from "~/components/variants-grid"
import { clearState, loadState, saveState } from "~/lib/persistence"
import type { ComponentEntry } from "~/lib/registry"

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

	const [code, setCode] = useState(() => persisted?.code ?? entry.defaultCode)
	const [propValues, setPropValues] = useState<Record<string, unknown>>(() => persisted?.props ?? getDefaultProps(entry))
	const [activeTab, setActiveTab] = useState<"controls" | "code" | "examples" | "element" | "theme">("controls")
	const [themeCss, setThemeCss] = useState(DEFAULT_THEME_CSS)
	const [_callbackEvents, setCallbackEvents] = useState<CallbackEvent[]>([])
	const [showVariants, setShowVariants] = useState(false)
	const [splitRatio, setSplitRatio] = useState(0.6)
	const [inspectMode, setInspectMode] = useState(false)
	const [selectedElement, setSelectedElement] = useState<InspectedElement | null>(null)

	// When an element is selected in inspect mode, switch to Element tab
	const handleElementSelect = useCallback((el: InspectedElement | null) => {
		setSelectedElement(el)
		if (el) setActiveTab("element")
	}, [])

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
	const extraScope = useMemo(() => ({ ...propValues, ...callbackProxies }), [propValues, callbackProxies])

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

	// ── Keyboard shortcuts ───────────────────────
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			// Cmd+S or Ctrl+S → prevent browser save (state auto-saves)
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault()
			}

			// Cmd+Shift+C → copy current code to clipboard
			if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
				e.preventDefault()
				navigator.clipboard.writeText(code)
			}

			// Cmd+Shift+R → reset to defaults
			if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "R") {
				e.preventDefault()
				handleReset()
			}

			// Cmd+1/2/3 → switch tabs
			if ((e.metaKey || e.ctrlKey) && e.key === "1") {
				e.preventDefault()
				setActiveTab("controls")
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "2") {
				e.preventDefault()
				setActiveTab("code")
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "3") {
				e.preventDefault()
				setActiveTab("examples")
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [code, handleReset])

	// ── Example select handler ───────────────────
	const handleExampleSelect = useCallback(
		(code: string) => {
			setCode(code)
			setPropValues(getDefaultProps(entry))
		},
		[entry]
	)

	// ── Prop change handler ───────────────────────
	const handlePropChange = useCallback((name: string, value: unknown) => {
		setPropValues((prev) => ({ ...prev, [name]: value }))
	}, [])

	// ── Resizable split drag ──────────────────────
	const containerRef = useRef<HTMLDivElement>(null)
	const isDragging = useRef(false)

	const handleDragStart = useCallback((e: React.MouseEvent) => {
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
	}, [])

	return (
		<div ref={containerRef} className="flex flex-col h-full">
			{/* Title bar */}
			<div className="flex items-center justify-between px-4 py-2 border-b border-edge">
				<div className="flex items-center gap-2">
					<h1 className="text-sm font-semibold">{entry.name}</h1>
					<span className="text-xs text-fg-muted bg-muted px-1.5 py-0.5 rounded">{entry.category}</span>
				</div>
				<Button variant="ghost" size="xs" onClick={() => setShowVariants((v) => !v)} title="Toggle variants grid" className={showVariants ? "bg-muted" : ""}>
					<LayoutGrid className="size-3 mr-1" />
					<span className="text-xs">Variants</span>
				</Button>
			</div>

			{/* Preview panel (top) */}
			<div style={{ flex: splitRatio }} className="min-h-0 overflow-hidden">
				{showVariants ? (
					<VariantsGrid entry={entry} extraScope={callbackProxies} />
				) : (
					<PreviewPanel code={code} extraScope={extraScope} inspectMode={inspectMode} onInspectModeChange={setInspectMode} onElementSelect={handleElementSelect} />
				)}
			</div>

			{/* Drag handle */}
			<div
				role="separator"
				aria-orientation="horizontal"
				aria-valuenow={Math.round(splitRatio * 100)}
				className="h-1 cursor-row-resize bg-edge/50 hover:bg-brand/30 transition-colors flex-shrink-0"
				onMouseDown={handleDragStart}
			/>

			{/* Bottom panel (tabs) */}
			<div style={{ flex: 1 - splitRatio }} className="min-h-0 overflow-hidden flex flex-col">
				<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "controls" | "code" | "examples")} className="flex flex-col h-full">
					<div className="flex items-center border-b border-edge px-2">
						<TabsList className="bg-transparent">
							<TabsTrigger value="controls" className="text-xs">
								Controls
							</TabsTrigger>
							<TabsTrigger value="code" className="text-xs">
								Code
							</TabsTrigger>
							<TabsTrigger value="examples" className="text-xs">
								Examples
							</TabsTrigger>
							<TabsTrigger value="theme" className="text-xs">
								Theme
							</TabsTrigger>
							{selectedElement && (
								<TabsTrigger value="element" className="text-xs">
									Element
								</TabsTrigger>
							)}
						</TabsList>
						<div className="flex-1" />
						<Button variant="ghost" size="xs" onClick={handleReset} title="Reset to defaults">
							<RotateCcw className="size-3 mr-1" />
							<span className="text-xs">Reset</span>
						</Button>
					</div>

					<TabsContent value="controls" className="flex-1 min-h-0 m-0">
						<PropsPanel props={entry.props} values={propValues} onChange={handlePropChange} onReset={handleReset} />
					</TabsContent>

					<TabsContent value="code" className="flex-1 min-h-0 m-0">
						<CodeEditor value={code} onChange={setCode} />
					</TabsContent>

					<TabsContent value="examples" className="flex-1 min-h-0 m-0">
						<ExamplesPanel examples={entry.examples ?? []} onSelect={handleExampleSelect} />
					</TabsContent>

					<TabsContent value="theme" className="flex-1 min-h-0 m-0">
						<ThemeEditor value={themeCss} onChange={setThemeCss} />
					</TabsContent>

					{selectedElement && (
						<TabsContent value="element" className="flex-1 min-h-0 m-0">
							<ElementPanel
								element={selectedElement}
								code={code}
								onCodeChange={setCode}
								onDeselect={() => {
									setSelectedElement(null)
									setActiveTab("controls")
								}}
							/>
						</TabsContent>
					)}
				</Tabs>
			</div>
		</div>
	)
}
