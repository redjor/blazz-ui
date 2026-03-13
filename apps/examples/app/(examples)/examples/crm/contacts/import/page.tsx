"use client"

import { MultiStepForm, type StepComponentProps } from "@blazz/ui/components/blocks/multi-step-form"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function UploadStep({ data, onChange }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-semibold">1. Choisissez un fichier</h3>
			<p className="text-sm text-fg-muted">Formats acceptés : CSV, XLSX. Taille max : 5 Mo.</p>
			<div className="space-y-1.5">
				<Label htmlFor="file">Fichier</Label>
				<Input
					id="file"
					type="file"
					accept=".csv,.xlsx"
					onChange={(e) => {
						const input = e.target as HTMLInputElement
						onChange({ fileName: input.files?.[0]?.name ?? "" })
					}}
				/>
			</div>
			{data.fileName && (
				<p className="text-sm text-fg-muted">
					Fichier sélectionné : <strong>{data.fileName as string}</strong>
				</p>
			)}
		</div>
	)
}

function MappingStep({ data, onChange }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-semibold">2. Correspondance des colonnes</h3>
			<p className="text-sm text-fg-muted">
				Associez les colonnes de votre fichier aux champs CRM.
			</p>
			<div className="rounded-md border p-4 text-sm text-fg-muted">
				Aperçu des colonnes détectées dans votre fichier.
				<br />
				(Simulation — en production, les colonnes seraient parsées du fichier)
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label>Colonne "Nom" → Champ CRM</Label>
					<select className="flex h-8 w-full rounded-md border px-3 text-sm">
						<option>lastName</option>
						<option>firstName</option>
						<option>email</option>
					</select>
				</div>
				<div className="space-y-1.5">
					<Label>Colonne "Email" → Champ CRM</Label>
					<select className="flex h-8 w-full rounded-md border px-3 text-sm">
						<option>email</option>
						<option>lastName</option>
						<option>firstName</option>
					</select>
				</div>
			</div>
		</div>
	)
}

function ReviewStep({ data }: StepComponentProps) {
	return (
		<div className="space-y-4">
			<h3 className="text-sm font-semibold">3. Récapitulatif</h3>
			<div className="rounded-md border p-4 space-y-2">
				<p className="text-sm">
					<span className="text-fg-muted">Fichier :</span>{" "}
					<strong>{(data.fileName as string) || "Non sélectionné"}</strong>
				</p>
				<p className="text-sm">
					<span className="text-fg-muted">Contacts à importer :</span> <strong>42</strong>{" "}
					(simulation)
				</p>
				<p className="text-sm">
					<span className="text-fg-muted">Doublons détectés :</span> <strong>3</strong>
				</p>
			</div>
			<p className="text-xs text-fg-muted">Cliquez sur "Terminer" pour lancer l'import.</p>
		</div>
	)
}

export default function ImportContactsPage() {
	const router = useRouter()

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Importer des contacts"
				description="Importez des contacts depuis un fichier CSV ou Excel"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Contacts", href: "/examples/crm/contacts" },
					{ label: "Importer" },
				]}
			/>

			<div className="max-w-2xl">
				<MultiStepForm
					steps={[
						{ id: "upload", title: "Fichier", component: UploadStep },
						{ id: "mapping", title: "Correspondance", component: MappingStep },
						{ id: "review", title: "Récapitulatif", component: ReviewStep },
					]}
					onSubmit={async () => {
						await new Promise((r) => setTimeout(r, 1000))
						toast.success("Import terminé — 42 contacts importés")
						router.push("/examples/crm/contacts")
					}}
				/>
			</div>
		</div>
	)
}
