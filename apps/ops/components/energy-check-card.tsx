"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { cn } from "@blazz/ui/lib/utils"

export type EnergyLevel = "high" | "medium" | "low"

type EnergyCheckCardProps = {
	value?: EnergyLevel | null
	onChange?: (value: EnergyLevel) => void
}

const OPTIONS: Array<{ value: EnergyLevel; label: string }> = [
	{ value: "high", label: "En forme" },
	{ value: "medium", label: "Neutre" },
	{ value: "low", label: "Fatigué" },
]

export function EnergyCheckCard({ value, onChange }: EnergyCheckCardProps) {
	return (
		<Card size="sm">
			<CardHeader>
				<CardTitle>Énergie</CardTitle>
				<CardDescription>Comment tu te sens maintenant ?</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-3 gap-2">
					{OPTIONS.map((option) => {
						const active = value === option.value

						return (
							<Button
								key={option.value}
								type="button"
								variant={active ? "default" : "outline"}
								size="sm"
								onClick={() => onChange?.(option.value)}
								className={cn("w-full", !active && "text-fg-muted")}
							>
								{option.label}
							</Button>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}
