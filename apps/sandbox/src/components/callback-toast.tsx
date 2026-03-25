"use client"

import { useEffect } from "react"

export interface CallbackEvent {
	id: string
	name: string
	timestamp: number
}

interface CallbackToastProps {
	events: CallbackEvent[]
	onDismiss: (id: string) => void
}

export function CallbackToast({ events, onDismiss }: CallbackToastProps) {
	const visible = events.slice(-3)

	return (
		<div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-50">
			{visible.map((event) => (
				<ToastItem key={event.id} event={event} onDismiss={onDismiss} />
			))}
		</div>
	)
}

function ToastItem({
	event,
	onDismiss,
}: {
	event: CallbackEvent
	onDismiss: (id: string) => void
}) {
	useEffect(() => {
		const timer = setTimeout(() => onDismiss(event.id), 3000)
		return () => clearTimeout(timer)
	}, [event.id, onDismiss])

	return (
		<div className="bg-muted border border-edge rounded-md px-3 py-1.5 text-xs text-fg-muted shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
			<span className="font-mono">{event.name}</span> called
		</div>
	)
}
