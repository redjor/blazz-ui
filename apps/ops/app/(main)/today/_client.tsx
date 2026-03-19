"use client"

import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { Button } from "@blazz/ui/components/ui/button"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Card, CardAction, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Banner } from "@blazz/ui/components/ui/banner"
import { Banknote, CheckCircle2, Circle, Clock, Droplets, Plus, Wind } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { useMissingDays } from "@/lib/use-missing-days"
import { getWeatherInfo, useWeather } from "@/lib/use-weather"

export default function TodayPageClient() {
	const router = useRouter()
	const today = format(new Date(), "yyyy-MM-dd")

	const todayEntries = useQuery(api.timeEntries.list, { from: today, to: today })
	const activeProjects = useQuery(api.projects.listActive)
	const todos = useQuery(api.todos.list, {})

	const isLoading =
		todayEntries === undefined || activeProjects === undefined || todos === undefined

	const billableEntries = todayEntries?.filter((e) => e.billable) ?? []
	const totalMinutesToday = billableEntries.reduce((s, e) => s + e.minutes, 0)
	const totalAmountToday = billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)

	const activeTodos = todos?.filter((t) => t.status !== "done") ?? []
	const projectList = activeProjects ?? []

	const { missingDays } = useMissingDays()
	const weather = useWeather()

	const [addOpen, setAddOpen] = useState(false)
	const [addDate, setAddDate] = useState<string | null>(null)
	const [editingEntry, setEditingEntry] = useState<Doc<"timeEntries"> | null>(null)
	useAppTopBar([{ label: "Aujourd'hui" }])

	const now = new Date()
	const dayNumber = format(now, "d")
	const dayName = format(now, "EEEE", { locale: fr })
	const monthYear = format(now, "MMMM yyyy", { locale: fr })

	return (
		<BlockStack gap="600" className="mx-auto w-full max-w-3xl px-4 py-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="font-pixel text-5xl tabular-nums leading-none text-fg">{dayNumber}</span>
					<BlockStack gap="050">
						<span className="text-sm font-medium capitalize text-fg">{dayName}</span>
						<span className="text-sm capitalize text-fg-muted">{monthYear}</span>
					</BlockStack>
				</div>
				{!weather.loading && weather.data && (() => {
					const info = getWeatherInfo(weather.data.weatherCode)
					return (
						<div className="flex items-center gap-3">
							<span className="text-3xl leading-none">{info.icon}</span>
							<BlockStack gap="050" className="items-end">
								<div className="flex items-baseline gap-1.5">
									<span className="text-2xl font-semibold tabular-nums text-fg">
										{weather.data.temperature}°
									</span>
									<span className="text-xs text-fg-muted">
										{weather.data.tempMax}° / {weather.data.tempMin}°
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1">
										<Droplets className="size-3 text-fg-muted/60" />
										<span className="text-xs tabular-nums text-fg-muted">{weather.data.humidity}%</span>
									</div>
									<div className="flex items-center gap-1">
										<Wind className="size-3 text-fg-muted/60" />
										<span className="text-xs tabular-nums text-fg-muted">{weather.data.windSpeed} km/h</span>
									</div>
								</div>
							</BlockStack>
						</div>
					)
				})()}
			</div>

			<StatsGrid
				columns={2}
				loading={isLoading}
				stats={[
					{
						label: "Temps facturé",
						value: formatMinutes(totalMinutesToday),
						icon: Clock,
					},
					{
						label: "Montant facturé",
						value: formatCurrency(totalAmountToday),
						icon: Banknote,
					},
				]}
			/>

			{missingDays && missingDays.length > 0 && (
				<Banner
					tone="warning"
					title={`${missingDays.length} jour${missingDays.length > 1 ? "s" : ""} sans saisie`}
				>
					<InlineStack gap="150" wrap>
						{missingDays.map((day) => (
							<button
								key={day.date}
								type="button"
								className="rounded-md border border-separator bg-surface px-2.5 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-brand hover:text-brand"
								onClick={() => {
									setAddDate(day.date)
									setAddOpen(true)
								}}
							>
								{day.label}
							</button>
						))}
					</InlineStack>
				</Banner>
			)}

			{/* --- Todos --- */}
			<Card>
				<CardHeader className="border-b border-separator">
					<CardTitle>Todos</CardTitle>
					<CardAction>
						<span className="text-xs tabular-nums text-fg-muted">{activeTodos.length}</span>
					</CardAction>
				</CardHeader>
				<div>
					{todos === undefined ? (
						<p className="px-inset py-6 text-sm text-fg-muted">Chargement…</p>
					) : activeTodos.length === 0 ? (
						<InlineStack gap="200" blockAlign="center" className="px-inset py-6">
							<CheckCircle2 className="size-4 text-success" />
							<span className="text-sm text-fg-muted">Tout est fait.</span>
						</InlineStack>
					) : (
						<ul className="divide-y divide-separator">
							{activeTodos.slice(0, 6).map((todo) => (
								<li key={todo._id}>
									<button
										type="button"
										className="flex w-full items-center gap-2.5 px-inset py-2.5 text-left transition-colors hover:bg-surface-3/50"
										onClick={() => router.push(`/todos/${todo._id}`)}
									>
										<Circle className="size-3.5 shrink-0 text-fg-muted/50" />
										<span className="min-w-0 flex-1 truncate text-sm text-fg">{todo.text}</span>
									</button>
								</li>
							))}
							{activeTodos.length > 6 && (
								<li>
									<button
										type="button"
										className="w-full px-inset py-2.5 text-left text-xs text-fg-muted transition-colors hover:bg-surface-3/50"
										onClick={() => router.push("/todos")}
									>
										Voir les {activeTodos.length - 6} autres…
									</button>
								</li>
							)}
						</ul>
					)}
				</div>
			</Card>

			{/* --- Entrées du jour --- */}
			<Card>
					<CardHeader className="border-b border-separator">
						<CardTitle>Entrées du jour</CardTitle>
						<CardAction>
							<Button type="button" variant="ghost" size="sm" onClick={() => setAddOpen(true)}>
								<Plus className="size-3.5" />
								Ajouter
							</Button>
						</CardAction>
					</CardHeader>
					<div>
						{todayEntries === undefined ? (
							<p className="px-inset py-8 text-sm text-fg-muted">Chargement…</p>
						) : todayEntries.length === 0 ? (
							<BlockStack gap="200" className="px-inset py-10 items-center">
								<Clock className="size-8 text-fg-muted/40" />
								<p className="text-sm font-medium text-fg">Aucune entrée</p>
								<p className="text-xs text-fg-muted">
									Utilisez les projets à droite pour logger du temps.
								</p>
							</BlockStack>
						) : (
							<ul className="divide-y divide-separator">
								{todayEntries.map((entry) => {
									const project = projectList.find((p) => p._id === entry.projectId)
									return (
										<li key={entry._id}>
											<button
												type="button"
												className="flex w-full items-center gap-3 px-inset py-3 text-left transition-colors hover:bg-surface-3/50"
												onClick={() => setEditingEntry(entry)}
											>
												<span
													className="size-1.5 shrink-0 rounded-full"
													style={{
														backgroundColor: entry.billable
															? "var(--color-brand)"
															: "var(--color-fg-muted)",
													}}
												/>
												<span className="min-w-0 flex-1">
													<span className="truncate text-sm text-fg block">
														{entry.description || project?.name || "—"}
													</span>
													{entry.tags && entry.tags.length > 0 && (
														<span className="flex gap-1 mt-0.5">
															{entry.tags.map((tag) => (
																<span
																	key={tag}
																	className="inline-block rounded-full bg-surface-3 px-1.5 py-0 text-[11px] text-fg-muted"
																>
																	{tag}
																</span>
															))}
														</span>
													)}
												</span>
												<span className="shrink-0 text-xs text-fg-muted">
													{project?.name ?? "—"}
												</span>
												<span className="shrink-0 font-mono text-sm tabular-nums text-fg-muted">
													{formatMinutes(entry.minutes)}
												</span>
											</button>
										</li>
									)
								})}
							</ul>
						)}
					</div>
			</Card>

			{/* Dialog nouvelle entrée */}
			<Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) setAddDate(null) }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouvelle entrée</DialogTitle>
					</DialogHeader>
					<TimeEntryForm
						key={addDate ?? "today"}
						defaultDate={addDate ?? undefined}
						onSuccess={() => { setAddOpen(false); setAddDate(null) }}
						onCancel={() => { setAddOpen(false); setAddDate(null) }}
					/>
				</DialogContent>
			</Dialog>

			{/* Dialog édition entrée */}
			<Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier l'entrée</DialogTitle>
					</DialogHeader>
					{editingEntry && (
						<TimeEntryForm
							defaultValues={{
								id: editingEntry._id,
								projectId: editingEntry.projectId,
								date: editingEntry.date,
								minutes: editingEntry.minutes,
								description: editingEntry.description,
								billable: editingEntry.billable,
								status: editingEntry.status,
								tags: editingEntry.tags,
							}}
							onSuccess={() => setEditingEntry(null)}
							onCancel={() => setEditingEntry(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

		</BlockStack>
	)
}
