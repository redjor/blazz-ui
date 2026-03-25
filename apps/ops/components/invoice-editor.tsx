"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useAction, useMutation, useQuery } from "convex/react"
import { Plus, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

// ── Types ─────────────────────────────────────────

interface InvoiceLine {
	id: string
	type: "project" | "custom"
	projectId?: Id<"projects">
	label: string
	quantity: number
	unitPrice: number
	discountPercent?: number
	sortOrder: number
}

type LineAction =
	| { type: "ADD_PROJECT_LINE"; line: InvoiceLine }
	| { type: "ADD_CUSTOM_LINE" }
	| { type: "UPDATE_LINE"; id: string; field: string; value: string | number }
	| { type: "REMOVE_LINE"; id: string }
	| { type: "SET_LINES"; lines: InvoiceLine[] }

type GlobalDiscount = { type: "percent" | "fixed"; value: number }

function linesReducer(state: InvoiceLine[], action: LineAction): InvoiceLine[] {
	switch (action.type) {
		case "ADD_PROJECT_LINE":
			return [...state, action.line]
		case "ADD_CUSTOM_LINE":
			return [
				...state,
				{
					id: crypto.randomUUID(),
					type: "custom",
					label: "",
					quantity: 1,
					unitPrice: 0,
					sortOrder: state.length,
				},
			]
		case "UPDATE_LINE":
			return state.map((l) => (l.id === action.id ? { ...l, [action.field]: action.value } : l))
		case "REMOVE_LINE":
			return state.filter((l) => l.id !== action.id)
		case "SET_LINES":
			return action.lines
		default:
			return state
	}
}

// ── Helpers ───────────────────────────────────────

function formatAmount(value: number): string {
	return `${value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`
}

function computeLineTotal(line: InvoiceLine): number {
	const gross = line.quantity * line.unitPrice
	const discount = line.discountPercent ? gross * (line.discountPercent / 100) : 0
	return gross - discount
}

function computeSubtotal(lines: InvoiceLine[]): number {
	return lines.reduce((sum, l) => sum + computeLineTotal(l), 0)
}

function applyGlobalDiscount(subtotal: number, gd?: GlobalDiscount): number {
	if (!gd || gd.value === 0) return subtotal
	if (gd.type === "percent") return Math.round(subtotal * (1 - gd.value / 100))
	return subtotal - gd.value
}

const INVOICE_TYPE_LABELS: Record<string, string> = {
	unique: "Facture unique",
	acompte: "Acompte",
	situation: "Situation",
}

function buildSaveDraftArgs(
	invoiceId: string | undefined,
	clientId: string,
	invoiceType: "unique" | "acompte" | "situation",
	label: string,
	lines: InvoiceLine[],
	vatRate: number,
	globalDiscount: GlobalDiscount,
	notes: string,
	internalNotes: string,
	entryIds: Id<"timeEntries">[]
) {
	return {
		id: invoiceId ? (invoiceId as Id<"invoices">) : undefined,
		clientId: clientId as Id<"clients">,
		invoiceType,
		label,
		lines: lines.map((l, i) => ({
			id: l.id,
			type: l.type,
			projectId: l.projectId,
			label: l.label,
			quantity: l.quantity,
			unitPrice: l.unitPrice,
			discountPercent: l.discountPercent,
			sortOrder: i,
		})),
		vatRate,
		globalDiscount: globalDiscount.value > 0 ? globalDiscount : undefined,
		notes: notes || undefined,
		internalNotes: internalNotes || undefined,
		entryIds: entryIds.length > 0 ? entryIds : undefined,
	}
}

// ── Sub-components ────────────────────────────────

function LineRow({
	line,
	isReadOnly,
	dispatch,
}: {
	line: InvoiceLine
	isReadOnly: boolean
	dispatch: React.Dispatch<LineAction>
}) {
	const updateField = (field: string, value: string | number) =>
		dispatch({ type: "UPDATE_LINE", id: line.id, field, value })

	return (
		<tr className="border-t border-edge h-10">
			<td className="px-3 py-1">
				{isReadOnly ? (
					<span className="text-fg">{line.label}</span>
				) : (
					<Input
						value={line.label}
						onChange={(e) => updateField("label", e.target.value)}
						className="h-7 text-[13px] border-none shadow-none bg-transparent px-0"
						placeholder="Description de la ligne"
					/>
				)}
			</td>
			<td className="px-3 py-1 text-right">
				{isReadOnly ? (
					<span className="font-mono tabular-nums text-fg">{line.quantity}</span>
				) : (
					<Input
						type="number"
						step="0.5"
						min={0}
						value={line.quantity}
						onChange={(e) => updateField("quantity", Number(e.target.value))}
						className="h-7 text-[13px] text-right border-none shadow-none bg-transparent px-0 tabular-nums"
					/>
				)}
			</td>
			<td className="px-3 py-1 text-right">
				{isReadOnly ? (
					<span className="font-mono tabular-nums text-fg">{formatAmount(line.unitPrice)}</span>
				) : (
					<Input
						type="number"
						step="0.01"
						min={0}
						value={line.unitPrice}
						onChange={(e) => updateField("unitPrice", Number(e.target.value))}
						className="h-7 text-[13px] text-right border-none shadow-none bg-transparent px-0 tabular-nums"
					/>
				)}
			</td>
			<td className="px-3 py-1 text-right">
				{isReadOnly ? (
					<span className="font-mono tabular-nums text-fg-muted">
						{line.discountPercent ? `${line.discountPercent}%` : "—"}
					</span>
				) : (
					<Input
						type="number"
						step="1"
						min={0}
						max={100}
						value={line.discountPercent ?? 0}
						onChange={(e) => updateField("discountPercent", Number(e.target.value))}
						className="h-7 text-[13px] text-right border-none shadow-none bg-transparent px-0 tabular-nums"
					/>
				)}
			</td>
			<td className="px-3 py-1 text-right font-mono tabular-nums text-fg">
				{formatAmount(computeLineTotal(line))}
			</td>
			{!isReadOnly && (
				<td className="px-2 py-1 text-right">
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => dispatch({ type: "REMOVE_LINE", id: line.id })}
					>
						<Trash2 className="size-3.5 text-fg-muted" />
					</Button>
				</td>
			)}
		</tr>
	)
}

function TotalsSection({
	subtotal,
	totalHT,
	tva,
	totalTTC,
	vatRate,
	setVatRate,
	globalDiscount,
	setGlobalDiscount,
	isReadOnly,
}: {
	subtotal: number
	totalHT: number
	tva: number
	totalTTC: number
	vatRate: number
	setVatRate: (v: number) => void
	globalDiscount: GlobalDiscount
	setGlobalDiscount: React.Dispatch<React.SetStateAction<GlobalDiscount>>
	isReadOnly: boolean
}) {
	return (
		<BlockStack gap="300">
			<InlineStack align="end">
				<BlockStack gap="200" className="w-80">
					<InlineStack align="space-between" className="text-sm">
						<span className="text-fg-muted">Sous-total</span>
						<span className="font-mono font-medium text-fg tabular-nums">
							{formatAmount(subtotal)}
						</span>
					</InlineStack>

					{!isReadOnly && (
						<GlobalDiscountRow
							globalDiscount={globalDiscount}
							setGlobalDiscount={setGlobalDiscount}
						/>
					)}

					{isReadOnly && globalDiscount.value > 0 && (
						<ReadOnlyDiscountRow
							globalDiscount={globalDiscount}
							discountAmount={subtotal - totalHT}
						/>
					)}

					<InlineStack align="space-between" className="text-sm">
						<span className="text-fg-muted">Total HT</span>
						<span className="font-mono font-medium text-fg tabular-nums">
							{formatAmount(totalHT)}
						</span>
					</InlineStack>

					<VatRow vatRate={vatRate} setVatRate={setVatRate} tva={tva} isReadOnly={isReadOnly} />

					<Divider />

					<InlineStack align="space-between" className="text-sm font-medium">
						<span className="text-fg">Total TTC</span>
						<span className="font-mono text-fg tabular-nums text-base">
							{formatAmount(totalTTC)}
						</span>
					</InlineStack>
				</BlockStack>
			</InlineStack>
		</BlockStack>
	)
}

function GlobalDiscountRow({
	globalDiscount,
	setGlobalDiscount,
}: {
	globalDiscount: GlobalDiscount
	setGlobalDiscount: React.Dispatch<React.SetStateAction<GlobalDiscount>>
}) {
	return (
		<InlineStack gap="200" align="space-between" blockAlign="center">
			<InlineStack gap="200" blockAlign="center" className="text-sm">
				<span className="text-fg-muted">Remise globale</span>
				<Select
					value={globalDiscount.type}
					onValueChange={(v) =>
						setGlobalDiscount((d) => ({ ...d, type: v as "percent" | "fixed" }))
					}
					items={Object.fromEntries([
						["percent", "%"],
						["fixed", "€"],
					])}
				>
					<SelectTrigger size="sm" className="w-16">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="percent">%</SelectItem>
						<SelectItem value="fixed">{"€"}</SelectItem>
					</SelectContent>
				</Select>
			</InlineStack>
			<Input
				type="number"
				step="1"
				min={0}
				value={globalDiscount.value}
				onChange={(e) => setGlobalDiscount((d) => ({ ...d, value: Number(e.target.value) }))}
				className="w-20 h-7 text-[13px] text-right tabular-nums"
			/>
		</InlineStack>
	)
}

function ReadOnlyDiscountRow({
	globalDiscount,
	discountAmount,
}: {
	globalDiscount: GlobalDiscount
	discountAmount: number
}) {
	const discountLabel =
		globalDiscount.type === "percent"
			? `(${globalDiscount.value}%)`
			: `(${formatAmount(globalDiscount.value)})`

	return (
		<InlineStack align="space-between" className="text-sm">
			<span className="text-fg-muted">Remise {discountLabel}</span>
			<span className="font-mono text-fg-muted tabular-nums">-{formatAmount(discountAmount)}</span>
		</InlineStack>
	)
}

function VatRow({
	vatRate,
	setVatRate,
	tva,
	isReadOnly,
}: {
	vatRate: number
	setVatRate: (v: number) => void
	tva: number
	isReadOnly: boolean
}) {
	return (
		<InlineStack align="space-between" blockAlign="center" className="text-sm">
			<InlineStack gap="200" blockAlign="center">
				<span className="text-fg-muted">TVA</span>
				{isReadOnly ? (
					<span className="text-fg-muted">({(vatRate * 100).toFixed(0)}%)</span>
				) : (
					<Input
						type="number"
						step="1"
						min={0}
						max={100}
						value={vatRate * 100}
						onChange={(e) => setVatRate(Number(e.target.value) / 100)}
						className="w-16 h-7 text-[13px] text-right tabular-nums"
					/>
				)}
			</InlineStack>
			<span className="font-mono text-fg-muted tabular-nums">{formatAmount(tva)}</span>
		</InlineStack>
	)
}

function NotesSection({
	notes,
	setNotes,
	internalNotes,
	setInternalNotes,
	isReadOnly,
}: {
	notes: string
	setNotes: (v: string) => void
	internalNotes: string
	setInternalNotes: (v: string) => void
	isReadOnly: boolean
}) {
	return (
		<InlineStack gap="400">
			<BlockStack gap="100" className="flex-1">
				<Label>Notes (visibles sur la facture)</Label>
				{isReadOnly ? (
					<p className="text-sm text-fg-muted whitespace-pre-wrap">{notes || "—"}</p>
				) : (
					<Textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Conditions de paiement, mentions légales…"
						rows={3}
					/>
				)}
			</BlockStack>

			<BlockStack gap="100" className="flex-1">
				<Label>Notes internes</Label>
				{isReadOnly ? (
					<p className="text-sm text-fg-muted whitespace-pre-wrap">{internalNotes || "—"}</p>
				) : (
					<Textarea
						value={internalNotes}
						onChange={(e) => setInternalNotes(e.target.value)}
						placeholder="Notes privées, contexte…"
						rows={3}
					/>
				)}
			</BlockStack>
		</InlineStack>
	)
}

// ── Project Line Loader ───────────────────────────

function ProjectLineLoader({
	projectId,
	allProjects,
	onLoaded,
	onError,
	sortOrder,
}: {
	projectId: Id<"projects">
	allProjects: Array<{ _id: Id<"projects">; name: string; tjm: number; hoursPerDay: number }>
	onLoaded: (line: InvoiceLine, entryIds: Id<"timeEntries">[]) => void
	onError: () => void
	sortOrder: number
}) {
	const entries = useQuery(api.timeEntries.listForRecap, { projectId })
	const project = allProjects.find((p) => p._id === projectId)

	useEffect(() => {
		if (entries === undefined) return

		if (!project) {
			toast.error("Projet introuvable")
			onError()
			return
		}

		const billable = entries.filter(
			(e) => e.billable && !e.invoicedAt && e.status !== "invoiced" && e.status !== "paid"
		)

		if (billable.length === 0) {
			toast.error("Aucune entrée facturable pour ce projet")
			onError()
			return
		}

		const totalMinutes = billable.reduce((sum, e) => sum + e.minutes, 0)
		const days = totalMinutes / 60 / project.hoursPerDay

		const line: InvoiceLine = {
			id: crypto.randomUUID(),
			type: "project",
			projectId,
			label: `${project.name} — ${days.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} jours`,
			quantity: Number.parseFloat(days.toFixed(2)),
			unitPrice: project.tjm,
			sortOrder,
		}

		onLoaded(
			line,
			billable.map((e) => e._id)
		)
	}, [entries, project, projectId, onLoaded, onError, sortOrder])

	return (
		<InlineStack gap="200" blockAlign="center" className="px-3 py-2">
			<Skeleton className="h-4 w-4 rounded-full" />
			<span className="text-xs text-fg-muted">Chargement des entrées…</span>
		</InlineStack>
	)
}

// ── Props ─────────────────────────────────────────

interface InvoiceEditorProps {
	invoiceId?: string
}

// ── Main Component ────────────────────────────────

export function InvoiceEditorClient({ invoiceId }: InvoiceEditorProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const invoice = useQuery(
		api.invoices.get,
		invoiceId ? { id: invoiceId as Id<"invoices"> } : "skip"
	)
	const clients = useQuery(api.clients.list)
	const allProjects = useQuery(api.projects.listAll)
	const saveDraft = useMutation(api.invoices.saveDraft)
	const createQontoInvoice = useAction(api.qonto.createInvoice)

	const [clientId, setClientId] = useState<string>("")
	const [invoiceType, setInvoiceType] = useState<"unique" | "acompte" | "situation">("unique")
	const [label, setLabel] = useState("")
	const [vatRate, setVatRate] = useState(0.2)
	const [notes, setNotes] = useState("")
	const [internalNotes, setInternalNotes] = useState("")
	const [globalDiscount, setGlobalDiscount] = useState<GlobalDiscount>({
		type: "percent",
		value: 0,
	})
	const [lines, dispatch] = useReducer(linesReducer, [])
	const [saving, setSaving] = useState(false)
	const [entryIds, setEntryIds] = useState<Id<"timeEntries">[]>([])
	const [initialized, setInitialized] = useState(false)
	const [addingProjectId, setAddingProjectId] = useState<string | null>(null)

	const isReadOnly = invoice != null && invoice.status !== "draft"
	const isEditMode = !!invoiceId
	const clientProjects = useMemo(
		() => allProjects?.filter((p) => p.clientId === clientId && p.status === "active") ?? [],
		[allProjects, clientId]
	)
	const addedProjectIds = useMemo(
		() => new Set(lines.filter((l) => l.projectId).map((l) => l.projectId)),
		[lines]
	)
	const availableProjects = useMemo(
		() => clientProjects.filter((p) => !addedProjectIds.has(p._id)),
		[clientProjects, addedProjectIds]
	)

	const subtotal = computeSubtotal(lines)
	const totalHT = applyGlobalDiscount(subtotal, globalDiscount)
	const tva = totalHT * vatRate
	const totalTTC = totalHT + tva

	const breadcrumbLabel = invoiceId ? (invoice?.qontoNumber ?? "Brouillon") : "Nouvelle facture"

	// ── Initialize from invoice (edit mode) ──
	useEffect(() => {
		if (!invoice || initialized) return
		setClientId(invoice.clientId)
		setInvoiceType(invoice.invoiceType ?? "unique")
		setLabel(invoice.label)
		setVatRate(invoice.vatRate)
		setNotes(invoice.notes ?? "")
		setInternalNotes(invoice.internalNotes ?? "")
		if (invoice.globalDiscount) setGlobalDiscount(invoice.globalDiscount)
		if (invoice.lines) dispatch({ type: "SET_LINES", lines: invoice.lines as InvoiceLine[] })
		setInitialized(true)
	}, [invoice, initialized])

	// ── URL params pre-fill (create mode) ──
	useEffect(() => {
		if (isEditMode || initialized) return
		const paramClientId = searchParams.get("clientId")
		const paramProjectId = searchParams.get("projectId")
		if (paramClientId) setClientId(paramClientId)
		if (paramProjectId) setAddingProjectId(paramProjectId)
		setInitialized(true)
	}, [isEditMode, initialized, searchParams])

	const handleSaveDraft = useCallback(async () => {
		if (!clientId || !label) {
			toast.error("Client et libellé sont requis")
			return
		}
		setSaving(true)
		try {
			const args = buildSaveDraftArgs(
				invoiceId,
				clientId,
				invoiceType,
				label,
				lines,
				vatRate,
				globalDiscount,
				notes,
				internalNotes,
				entryIds
			)
			const id = await saveDraft(args)
			toast.success("Brouillon enregistré")
			router.push(`/invoices/${id}`)
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur lors de la sauvegarde")
		} finally {
			setSaving(false)
		}
	}, [
		invoiceId,
		clientId,
		invoiceType,
		label,
		lines,
		vatRate,
		globalDiscount,
		notes,
		internalNotes,
		entryIds,
		saveDraft,
		router,
	])

	const handleCreate = useCallback(async () => {
		if (!clientId || !label) {
			toast.error("Client et libellé sont requis")
			return
		}
		setSaving(true)
		try {
			const args = buildSaveDraftArgs(
				invoiceId,
				clientId,
				invoiceType,
				label,
				lines,
				vatRate,
				globalDiscount,
				notes,
				internalNotes,
				entryIds
			)
			const id = await saveDraft(args)

			const selectedClient = clients?.find((c) => c._id === clientId)
			await createQontoInvoice({
				invoiceId: id,
				qontoClientId: selectedClient?.qontoClientId ?? "",
				label,
				lines: lines.map((l) => ({
					label: l.label,
					quantity: l.quantity,
					unitPrice: Math.round(l.unitPrice * 100),
					discountPercent: l.discountPercent,
				})),
				vatRate,
			})

			toast.success("Facture créée")
			router.push("/invoices")
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erreur lors de la création")
		} finally {
			setSaving(false)
		}
	}, [
		invoiceId,
		clientId,
		invoiceType,
		label,
		lines,
		vatRate,
		globalDiscount,
		notes,
		internalNotes,
		entryIds,
		saveDraft,
		createQontoInvoice,
		clients,
		router,
	])

	const topBarActions = useMemo(
		() =>
			isReadOnly ? (
				<Button size="sm" variant="outline" onClick={() => router.push("/invoices")}>
					Retour
				</Button>
			) : (
				<InlineStack gap="200">
					<Button
						size="sm"
						variant="ghost"
						onClick={() => router.push("/invoices")}
						disabled={saving}
					>
						Annuler
					</Button>
					<Button size="sm" variant="outline" onClick={handleSaveDraft} disabled={saving}>
						{saving ? "Enregistrement…" : "Brouillon"}
					</Button>
					<Button size="sm" onClick={handleCreate} disabled={saving || lines.length === 0}>
						{saving ? "Envoi…" : "Créer la facture"}
					</Button>
				</InlineStack>
			),
		[isReadOnly, saving, lines.length, handleSaveDraft, handleCreate, router]
	)

	useAppTopBar(
		[{ label: "Factures", href: "/invoices" }, { label: breadcrumbLabel }],
		topBarActions
	)

	if (isEditMode && !invoice) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-24 w-full" />
			</BlockStack>
		)
	}

	if (!clients || !allProjects) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-6">
			<HeaderSection
				invoiceType={invoiceType}
				setInvoiceType={setInvoiceType}
				clientId={clientId}
				setClientId={setClientId}
				label={label}
				setLabel={setLabel}
				clients={clients}
				isReadOnly={isReadOnly}
				lines={lines}
				dispatch={dispatch}
			/>

			<Divider />

			<LinesSection
				lines={lines}
				dispatch={dispatch}
				isReadOnly={isReadOnly}
				clientId={clientId}
				availableProjects={availableProjects}
				addingProjectId={addingProjectId}
				setAddingProjectId={setAddingProjectId}
				allProjects={allProjects}
				entryIds={entryIds}
				setEntryIds={setEntryIds}
			/>

			<Divider />

			<TotalsSection
				subtotal={subtotal}
				totalHT={totalHT}
				tva={tva}
				totalTTC={totalTTC}
				vatRate={vatRate}
				setVatRate={setVatRate}
				globalDiscount={globalDiscount}
				setGlobalDiscount={setGlobalDiscount}
				isReadOnly={isReadOnly}
			/>

			<Divider />

			<NotesSection
				notes={notes}
				setNotes={setNotes}
				internalNotes={internalNotes}
				setInternalNotes={setInternalNotes}
				isReadOnly={isReadOnly}
			/>
		</BlockStack>
	)
}

// ── Header Section ────────────────────────────────

function HeaderSection({
	invoiceType,
	setInvoiceType,
	clientId,
	setClientId,
	label,
	setLabel,
	clients,
	isReadOnly,
	lines,
	dispatch,
}: {
	invoiceType: string
	setInvoiceType: (v: "unique" | "acompte" | "situation") => void
	clientId: string
	setClientId: (v: string) => void
	label: string
	setLabel: (v: string) => void
	clients: Array<{ _id: string; name: string }>
	isReadOnly: boolean
	lines: InvoiceLine[]
	dispatch: React.Dispatch<LineAction>
}) {
	return (
		<BlockStack gap="400">
			<InlineStack gap="400">
				<BlockStack gap="100" className="flex-1">
					<Label>Type de facture</Label>
					{isReadOnly ? (
						<p className="text-sm text-fg">{INVOICE_TYPE_LABELS[invoiceType] ?? invoiceType}</p>
					) : (
						<Select
							value={invoiceType}
							onValueChange={(v) => setInvoiceType(v as "unique" | "acompte" | "situation")}
							items={Object.fromEntries([
								["unique", "Facture unique"],
								["acompte", "Acompte"],
								["situation", "Situation"],
							])}
						>
							<SelectTrigger>
								<SelectValue placeholder="Type de facture" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="unique">Facture unique</SelectItem>
								<SelectItem value="acompte">Acompte</SelectItem>
								<SelectItem value="situation">Situation</SelectItem>
							</SelectContent>
						</Select>
					)}
				</BlockStack>

				<BlockStack gap="100" className="flex-1">
					<Label>Client</Label>
					{isReadOnly ? (
						<p className="text-sm text-fg">
							{clients.find((c) => c._id === clientId)?.name ?? "—"}
						</p>
					) : (
						<Select
							value={clientId}
							onValueChange={(v) => {
								setClientId(v)
								dispatch({ type: "SET_LINES", lines: lines.filter((l) => l.type === "custom") })
							}}
							items={Object.fromEntries(clients.map((c) => [c._id, c.name]))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionner un client" />
							</SelectTrigger>
							<SelectContent>
								{clients.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</BlockStack>
			</InlineStack>

			<BlockStack gap="100">
				<Label>Libellé</Label>
				{isReadOnly ? (
					<p className="text-sm text-fg">{label}</p>
				) : (
					<Input
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						placeholder="Prestation développement — Mars 2026"
					/>
				)}
			</BlockStack>
		</BlockStack>
	)
}

// ── Lines Section ─────────────────────────────────

function LinesSection({
	lines,
	dispatch,
	isReadOnly,
	clientId,
	availableProjects,
	addingProjectId,
	setAddingProjectId,
	allProjects,
	entryIds: _entryIds,
	setEntryIds,
}: {
	lines: InvoiceLine[]
	dispatch: React.Dispatch<LineAction>
	isReadOnly: boolean
	clientId: string
	availableProjects: Array<{ _id: string; name: string }>
	addingProjectId: string | null
	setAddingProjectId: (v: string | null) => void
	allProjects: Array<{ _id: Id<"projects">; name: string; tjm: number; hoursPerDay: number }>
	entryIds: Id<"timeEntries">[]
	setEntryIds: React.Dispatch<React.SetStateAction<Id<"timeEntries">[]>>
}) {
	return (
		<BlockStack gap="300">
			<InlineStack align="space-between" blockAlign="center">
				<p className="text-sm font-medium text-fg">Lignes</p>
				{!isReadOnly && (
					<InlineStack gap="200">
						{clientId && availableProjects.length > 0 && (
							<Select
								value=""
								onValueChange={(pid) => {
									if (pid) setAddingProjectId(pid)
								}}
								items={Object.fromEntries(availableProjects.map((p) => [p._id, p.name]))}
							>
								<SelectTrigger size="sm">
									<InlineStack gap="100" blockAlign="center">
										<Plus className="size-3.5" />
										<span className="text-xs">Ajouter un projet</span>
									</InlineStack>
								</SelectTrigger>
								<SelectContent>
									{availableProjects.map((p) => (
										<SelectItem key={p._id} value={p._id}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
						<Button
							size="sm"
							variant="outline"
							onClick={() => dispatch({ type: "ADD_CUSTOM_LINE" })}
						>
							<Plus className="size-3.5 mr-1" />
							Ligne libre
						</Button>
					</InlineStack>
				)}
			</InlineStack>

			{addingProjectId && (
				<ProjectLineLoader
					projectId={addingProjectId as Id<"projects">}
					allProjects={allProjects}
					onLoaded={(line, ids) => {
						dispatch({ type: "ADD_PROJECT_LINE", line })
						setEntryIds((prev) => [...prev, ...ids])
						setAddingProjectId(null)
					}}
					onError={() => setAddingProjectId(null)}
					sortOrder={lines.length}
				/>
			)}

			<div className="border border-edge rounded-lg overflow-hidden">
				<table className="w-full text-[13px]">
					<thead>
						<tr className="bg-muted">
							<th className="text-left px-3 py-2 font-medium text-fg-muted text-xs w-[40%]">
								Libellé
							</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs w-[12%]">
								Qté
							</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs w-[16%]">
								Prix unit.
							</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs w-[12%]">
								Remise %
							</th>
							<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs w-[16%]">
								Total HT
							</th>
							{!isReadOnly && (
								<th className="text-right px-3 py-2 font-medium text-fg-muted text-xs w-[4%]" />
							)}
						</tr>
					</thead>
					<tbody>
						{lines.length === 0 ? (
							<tr>
								<td
									colSpan={isReadOnly ? 5 : 6}
									className="px-3 py-8 text-center text-sm text-fg-muted"
								>
									Aucune ligne — ajoutez un projet ou une ligne libre.
								</td>
							</tr>
						) : (
							lines.map((line) => (
								<LineRow key={line.id} line={line} isReadOnly={isReadOnly} dispatch={dispatch} />
							))
						)}
					</tbody>
				</table>
			</div>
		</BlockStack>
	)
}
