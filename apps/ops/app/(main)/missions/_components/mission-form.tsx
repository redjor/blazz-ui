"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation } from "convex/react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { AgentPicker } from "./agent-picker"

interface Agent {
	_id: Id<"agents">
	name: string
	role: string
	avatar?: string
	budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
	usage: { monthUsd: number; totalUsd: number; todayUsd: number; lastResetDay: string; lastResetMonth: string }
}

interface MissionFormValues {
	agentId: string
	title: string
	prompt: string
	priority: string
	mode: string
}

interface MissionFormProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	agents: Agent[]
	defaultAgentId?: Id<"agents">
}

export function MissionForm({ open, onOpenChange, agents, defaultAgentId }: MissionFormProps) {
	const createMission = useMutation(api.missions.create)
	const lockedAgent = agents.length === 1 ? agents[0] : null

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { isSubmitting },
	} = useForm<MissionFormValues>({
		defaultValues: {
			agentId: defaultAgentId ?? lockedAgent?._id ?? "",
			title: "",
			prompt: "",
			priority: "medium",
			mode: "live",
		},
	})

	async function onSubmit(data: MissionFormValues) {
		if (!data.agentId) {
			toast.error("Veuillez choisir un agent")
			return
		}

		try {
			await createMission({
				agentId: data.agentId as Id<"agents">,
				title: data.title,
				prompt: data.prompt,
				status: "todo",
				priority: data.priority as "low" | "medium" | "high" | "urgent",
				mode: data.mode as "dry-run" | "live",
			})
			toast.success("Mission creee")
			reset()
			onOpenChange(false)
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Erreur lors de la creation")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Nouvelle mission</DialogTitle>
					</DialogHeader>

					<BlockStack gap="400" className="py-4">
						{/* Agent picker — hidden when the caller already scoped to a single agent */}
						{!lockedAgent && (
							<BlockStack gap="200">
								<Label>Agent</Label>
								<Controller control={control} name="agentId" rules={{ required: true }} render={({ field }) => <AgentPicker agents={agents} value={field.value} onValueChange={field.onChange} />} />
							</BlockStack>
						)}

						{/* Title */}
						<BlockStack gap="200">
							<Label htmlFor="mission-title">Titre</Label>
							<Input id="mission-title" placeholder="ex: Audit depenses mars 2026" {...register("title", { required: true })} />
						</BlockStack>

						{/* Prompt */}
						<BlockStack gap="200">
							<Label htmlFor="mission-prompt">Prompt / Instructions</Label>
							<Textarea id="mission-prompt" placeholder="Decrivez ce que l'agent doit faire..." rows={4} {...register("prompt", { required: true })} />
						</BlockStack>

						{/* Priority + Mode */}
						<InlineStack gap="400">
							<BlockStack gap="200" className="flex-1">
								<Label>Priorite</Label>
								<Controller
									control={control}
									name="priority"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
											items={Object.fromEntries([
												["low", "Basse"],
												["medium", "Moyenne"],
												["high", "Haute"],
												["urgent", "Urgente"],
											])}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="low">Basse</SelectItem>
												<SelectItem value="medium">Moyenne</SelectItem>
												<SelectItem value="high">Haute</SelectItem>
												<SelectItem value="urgent">Urgente</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</BlockStack>

							<BlockStack gap="200" className="flex-1">
								<Label>Mode</Label>
								<Controller
									control={control}
									name="mode"
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={field.onChange}
											items={Object.fromEntries([
												["live", "Live"],
												["dry-run", "Dry Run"],
											])}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="live">Live</SelectItem>
												<SelectItem value="dry-run">Dry Run</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</BlockStack>
						</InlineStack>
					</BlockStack>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creation..." : "Creer la mission"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
