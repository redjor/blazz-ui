"use client"

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Toaster as SonnerToaster, toast } from "sonner"

import { cn } from "../../lib/utils"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

function Toaster(props: ToasterProps) {
	return (
		<SonnerToaster
			position="bottom-right"
			theme="system"
			richColors
			gap={8}
			offset={16}
			toastOptions={{
				style: {
					"--normal-bg": "var(--bg-overlay)",
					"--normal-border": "var(--border-default)",
					"--normal-text": "var(--text-primary)",
					"--normal-description": "var(--text-secondary)",
				} as React.CSSProperties,
			}}
			{...props}
		/>
	)
}

// --- Progress Toast ---

type ProgressToastType = "success" | "error" | "warning" | "info" | "default"

export interface ProgressToastOptions {
	description?: string
	duration?: number
	/** Show the shrinking progress bar at the bottom. Default: true */
	showProgress?: boolean
	/** Show "Dismissing in X seconds" countdown. Default: true */
	showCountdown?: boolean
}

interface ProgressToastContentProps {
	id: string | number
	title: string
	type: ProgressToastType
	description?: string
	duration: number
	showProgress: boolean
	showCountdown: boolean
}

const ICON_MAP = {
	success: CheckCircle2,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
	default: null,
} as const

const ICON_COLOR: Record<ProgressToastType, string> = {
	success: "text-emerald-500",
	error: "text-red-500",
	warning: "text-amber-500",
	info: "text-blue-500",
	default: "text-fg-muted",
}

const PROGRESS_COLOR: Record<ProgressToastType, string> = {
	success: "bg-emerald-500",
	error: "bg-red-500",
	warning: "bg-amber-500",
	info: "bg-blue-500",
	default: "bg-brand",
}

function ProgressToastContent({
	id,
	title,
	type,
	description,
	duration,
	showProgress,
	showCountdown,
}: ProgressToastContentProps) {
	const [remaining, setRemaining] = useState(Math.ceil(duration / 1000))
	const progressBarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const start = Date.now()
		let raf: number

		const tick = () => {
			const elapsed = Date.now() - start
			const rem = Math.max(0, duration - elapsed)

			if (showProgress && progressBarRef.current) {
				progressBarRef.current.style.width = `${(rem / duration) * 100}%`
			}

			if (showCountdown) {
				setRemaining(Math.ceil(rem / 1000))
			}

			if (rem > 0) raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [duration, showProgress, showCountdown])

	const IconComponent = ICON_MAP[type]

	return (
		<div
			className="relative overflow-hidden rounded-[var(--toast-radius,10px)] border w-[356px]"
			style={{
				background: "var(--bg-overlay)",
				borderColor: "var(--border-default)",
				boxShadow: "0 4px 12px rgb(0 0 0 / 0.08), 0 1px 3px rgb(0 0 0 / 0.05)",
			}}
		>
			<div className="flex items-start gap-3 p-4 pb-3">
				{IconComponent && (
					<IconComponent className={cn("size-5 mt-0.5 shrink-0", ICON_COLOR[type])} />
				)}
				<div className="flex-1 min-w-0">
					<p className="text-sm font-semibold leading-5" style={{ color: "var(--text-primary)" }}>
						{title}
					</p>
					{description && (
						<p className="text-sm mt-0.5 leading-5" style={{ color: "var(--text-secondary)" }}>
							{description}
						</p>
					)}
				</div>
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					className="shrink-0 rounded p-0.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
					style={{ color: "var(--text-primary)" }}
				>
					<X className="size-4" />
				</button>
			</div>

			{showCountdown && (
				<div
					className="px-4 pt-2 pb-3 text-xs"
					style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border-default)" }}
				>
					Dismissing in {remaining} second{remaining !== 1 ? "s" : ""}
				</div>
			)}

			{showProgress && (
				<div
					className="absolute bottom-0 left-0 right-0 h-[3px]"
					style={{ background: "rgb(0 0 0 / 0.06)" }}
				>
					<div ref={progressBarRef} className={cn("h-full w-full", PROGRESS_COLOR[type])} />
				</div>
			)}
		</div>
	)
}

function createProgressToast(type: ProgressToastType) {
	return (title: string, options: ProgressToastOptions = {}) => {
		const { description, duration = 5000, showProgress = true, showCountdown = true } = options
		return toast.custom(
			(id) => (
				<ProgressToastContent
					id={id}
					title={title}
					type={type}
					description={description}
					duration={duration}
					showProgress={showProgress}
					showCountdown={showCountdown}
				/>
			),
			{ duration }
		)
	}
}

const toastProgress = {
	success: createProgressToast("success"),
	error: createProgressToast("error"),
	warning: createProgressToast("warning"),
	info: createProgressToast("info"),
	default: createProgressToast("default"),
}

export { Toaster, toast, toastProgress }
