"use client"

import {
	useState,
	useMemo,
	useEffect,
	useCallback,
	useRef,
	Component,
	type ReactNode,
	type ErrorInfo,
} from "react"
import { runCode } from "~/lib/code-runner"
import {
	CallbackToast,
	type CallbackEvent,
} from "~/components/callback-toast"
import {
	PreviewToolbar,
	type Viewport,
	type Theme,
} from "~/components/preview-toolbar"
import {
	useElementInspector,
	InspectorOverlay,
	type InspectedElement,
} from "~/components/element-inspector"

// ── Error Boundary ──────────────────────────────

interface ErrorBoundaryProps {
	children: ReactNode
	onError: (error: string) => void
	resetKey: string
}

interface ErrorBoundaryState {
	error: string | null
}

class PreviewErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { error: null }

	static getDerivedStateFromError(error: Error) {
		return { error: error.message }
	}

	componentDidCatch(error: Error, _info: ErrorInfo) {
		this.props.onError(error.message)
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
			this.setState({ error: null })
		}
	}

	render() {
		if (this.state.error) return null
		return this.props.children
	}
}

// ── Viewport widths ─────────────────────────────

const VIEWPORT_MAX_WIDTH: Record<Viewport, string> = {
	desktop: "100%",
	tablet: "768px",
	mobile: "375px",
}

// ── Preview Panel ───────────────────────────────

interface PreviewPanelProps {
	code: string
	extraScope?: Record<string, unknown>
	inspectMode?: boolean
	onInspectModeChange?: (v: boolean) => void
	onElementSelect?: (el: InspectedElement | null) => void
}

export type { InspectedElement }

export function PreviewPanel({
	code,
	extraScope,
	inspectMode = false,
	onInspectModeChange,
	onElementSelect,
}: PreviewPanelProps) {
	const [viewport, setViewport] = useState<Viewport>("desktop")
	const [theme, setTheme] = useState<Theme>("light")
	const [callbackEvents, setCallbackEvents] = useState<CallbackEvent[]>([])
	const [renderError, setRenderError] = useState<string | null>(null)
	const previewAreaRef = useRef<HTMLDivElement>(null)
	const { hovered, selected, setSelected } = useElementInspector(
		previewAreaRef,
		inspectMode,
	)

	// Notify parent when selection changes
	useEffect(() => {
		onElementSelect?.(selected)
	}, [selected, onElementSelect])

	// Debounced code to avoid constant re-renders
	const [debouncedCode, setDebouncedCode] = useState(code)
	const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

	useEffect(() => {
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => setDebouncedCode(code), 300)
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [code])

	// Clear render error when code changes
	useEffect(() => {
		setRenderError(null)
	}, [debouncedCode])

	const { element, error } = useMemo(
		() => runCode(debouncedCode, extraScope),
		[debouncedCode, extraScope],
	)

	const displayError = renderError || error

	const handleDismissToast = useCallback((id: string) => {
		setCallbackEvents((prev) => prev.filter((e) => e.id !== id))
	}, [])

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code)
	}, [code])

	const handleFullscreen = useCallback(() => {
		const el = document.getElementById("sandbox-preview-container")
		if (el) {
			if (document.fullscreenElement) {
				document.exitFullscreen()
			} else {
				el.requestFullscreen()
			}
		}
	}, [])

	const handleRenderError = useCallback((msg: string) => {
		setRenderError(msg)
	}, [])

	return (
		<div
			id="sandbox-preview-container"
			className="flex flex-col h-full bg-surface"
		>
			<PreviewToolbar
				viewport={viewport}
				onViewportChange={setViewport}
				theme={theme}
				onThemeChange={setTheme}
				onCopy={handleCopy}
				onFullscreen={handleFullscreen}
				inspectMode={inspectMode}
				onInspectModeChange={onInspectModeChange}
			/>

			{/* Preview area */}
			<div
				ref={previewAreaRef}
				className={`flex-1 relative overflow-auto bg-[radial-gradient(circle,_var(--color-edge)_1px,_transparent_1px)] bg-[length:16px_16px] ${inspectMode ? "cursor-crosshair" : ""}`}
			>
				<div
					className="mx-auto h-full transition-[max-width] duration-200"
					style={{ maxWidth: VIEWPORT_MAX_WIDTH[viewport] }}
				>
					<div className={theme === "dark" ? "dark" : ""}>
						<div className="p-6">
							<PreviewErrorBoundary
								resetKey={debouncedCode}
								onError={handleRenderError}
							>
								{element}
							</PreviewErrorBoundary>
						</div>
					</div>
				</div>

				{inspectMode && (
					<InspectorOverlay hovered={hovered} selected={selected} />
				)}

				<CallbackToast
					events={callbackEvents}
					onDismiss={handleDismissToast}
				/>
			</div>

			{/* Error bar */}
			{displayError && (
				<div className="bg-negative/10 text-negative border-t border-negative/20 px-3 py-2 text-xs font-mono whitespace-pre-wrap">
					{displayError}
				</div>
			)}
		</div>
	)
}

// ── Callback proxy factory ──────────────────────

let eventCounter = 0

export function createCallbackProxy(
	name: string,
	addEvent: (event: CallbackEvent) => void,
): (...args: unknown[]) => void {
	return (..._args: unknown[]) => {
		eventCounter++
		addEvent({
			id: `${name}-${eventCounter}-${Date.now()}`,
			name,
			timestamp: Date.now(),
		})
	}
}
