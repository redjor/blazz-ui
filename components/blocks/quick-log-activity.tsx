"use client"

import { useState } from "react"
import { Phone, Mail, StickyNote, Calendar, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type ActivityType = "call" | "email" | "note" | "meeting"

export interface QuickLogActivityProps {
	onLog: (activity: { type: ActivityType; note: string }) => void | Promise<void>
	trigger?: React.ReactNode
	className?: string
}

const activityTypes: { type: ActivityType; label: string; icon: typeof Phone }[] = [
	{ type: "call", label: "Appel", icon: Phone },
	{ type: "email", label: "Email", icon: Mail },
	{ type: "note", label: "Note", icon: StickyNote },
	{ type: "meeting", label: "RDV", icon: Calendar },
]

export function QuickLogActivity({ onLog, trigger, className }: QuickLogActivityProps) {
	const [open, setOpen] = useState(false)
	const [type, setType] = useState<ActivityType>("call")
	const [note, setNote] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (!note.trim()) return
		setLoading(true)
		try {
			await onLog({ type, note: note.trim() })
			setNote("")
			setOpen(false)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm" className={className}>
						<StickyNote className="size-4" data-icon="inline-start" />
						Activité
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-3">
					<Label className="text-sm font-medium">Type d&apos;activité</Label>
					<div className="grid grid-cols-4 gap-1.5">
						{activityTypes.map((at) => (
							<button
								key={at.type}
								type="button"
								onClick={() => setType(at.type)}
								className={cn(
									"flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors",
									type === at.type
										? "border-foreground bg-foreground text-background"
										: "border-border hover:bg-muted"
								)}
							>
								<at.icon className="size-4" />
								{at.label}
							</button>
						))}
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="activity-note" className="text-sm">
							Note
						</Label>
						<textarea
							id="activity-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="Résumé de l'activité..."
							rows={3}
							className={cn(
								"flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
								"placeholder:text-muted-foreground",
								"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							)}
						/>
					</div>

					<Button
						className="w-full"
						size="sm"
						disabled={!note.trim() || loading}
						onClick={handleSubmit}
					>
						<Send className="size-3.5" data-icon="inline-start" />
						{loading ? "Enregistrement..." : "Enregistrer"}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}
