"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"

type SessionKind = "focus" | "admin" | "meeting" | "break" | "personal"

type CurrentSession = {
	label: string
	projectName?: string | null
	startLabel: string
	elapsedLabel: string
	kind: SessionKind
}

type CurrentSessionCardProps = {
	session: CurrentSession | null
	onStart?: () => void
	onPause?: () => void
	onStop?: () => void
	onSwitch?: () => void
}

const KIND_BADGE_VARIANT: Record<
	SessionKind,
	"default" | "warning" | "info" | "success" | "secondary"
> = {
	focus: "default",
	admin: "warning",
	meeting: "info",
	break: "success",
	personal: "secondary",
}

const KIND_LABEL: Record<SessionKind, string> = {
	focus: "Focus",
	admin: "Admin",
	meeting: "Meeting",
	break: "Pause",
	personal: "Perso",
}

export function CurrentSessionCard({
	session,
	onStart,
	onPause,
	onStop,
	onSwitch,
}: CurrentSessionCardProps) {
	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle>Session en cours</CardTitle>
				<CardDescription>Ce que tu fais maintenant.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{session ? (
					<>
						<Badge variant={KIND_BADGE_VARIANT[session.kind]} fill="subtle" size="sm">
							{KIND_LABEL[session.kind]}
						</Badge>
						<div className="space-y-1">
							<p className="text-sm font-medium text-fg">{session.label}</p>
							{session.projectName ? (
								<p className="text-xs text-fg-muted">{session.projectName}</p>
							) : null}
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-md border border-edge bg-muted px-3 py-2">
								<p className="text-2xs uppercase tracking-wide text-fg-muted">Début</p>
								<p className="mt-1 font-mono text-sm text-fg">{session.startLabel}</p>
							</div>
							<div className="rounded-md border border-edge bg-muted px-3 py-2">
								<p className="text-2xs uppercase tracking-wide text-fg-muted">Durée</p>
								<p className="mt-1 font-mono text-sm text-fg">{session.elapsedLabel}</p>
							</div>
						</div>
					</>
				) : (
					<div className="rounded-md border border-dashed border-edge px-3 py-4 text-sm text-fg-muted">
						Aucune session en cours.
					</div>
				)}
				<div className="flex flex-wrap gap-2 pt-1">
					{session ? (
						<>
							<Button type="button" variant="outline" size="sm" onClick={onPause}>
								Pause
							</Button>
							<Button type="button" variant="outline" size="sm" onClick={onSwitch}>
								Changer
							</Button>
							<Button type="button" size="sm" onClick={onStop}>
								Terminer
							</Button>
						</>
					) : (
						<Button type="button" size="sm" onClick={onStart}>
							Démarrer une session
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
