import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"

const toc = [
	{ id: "col-namespace", title: "col.* Namespace" },
	{ id: "custom-columns", title: "Custom Columns" },
	{ id: "column-visibility", title: "Column Visibility" },
	{ id: "column-pinning", title: "Column Pinning" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/columns")({
	component: ColumnsPage,
})

function ColumnsPage() {
	const readOnlyColumns = [
		{ name: "col.text", signature: `col.text<T>("name", { showInlineFilter: true })`, desc: "Texte brut avec filtre text optionnel" },
		{ name: "col.numeric", signature: `col.numeric<T>("stock", { title: "Stock" })`, desc: "Nombre aligne a droite, filtre number" },
		{ name: "col.currency", signature: `col.currency<T>("price", { currency: "EUR", locale: "fr-FR" })`, desc: "Montant formate avec devise et locale" },
		{ name: "col.date", signature: `col.date<T>("createdAt", { format: "dd/MM/yyyy" })`, desc: "Date formatee avec locale" },
		{ name: "col.relativeDate", signature: `col.relativeDate<T>("updatedAt")`, desc: "Date relative — \"Il y a 2h\", \"Dans 3 jours\"" },
		{ name: "col.status", signature: `col.status<T>("status", { statusMap: { active: { label: "Actif", variant: "success" } } })`, desc: "Badge colore selon une map de statuts" },
		{ name: "col.select", signature: `col.select<T>("category", { options: [{ label: "...", value: "..." }] })`, desc: "Texte avec filtre dropdown" },
		{ name: "col.boolean", signature: `col.boolean<T>("isActive")`, desc: "Checkbox, badge ou icone vrai/faux" },
		{ name: "col.tags", signature: `col.tags<T>("labels")`, desc: "Tableau de strings affiche en badges inline" },
		{ name: "col.progress", signature: `col.progress<T>("completion")`, desc: "Barre de progression 0-100" },
		{ name: "col.rating", signature: `col.rating<T>("score", { max: 5 })`, desc: "Etoiles ou dots pour une note" },
		{ name: "col.link", signature: `col.link<T>("website")`, desc: "Lien cliquable (URL, email, telephone)" },
		{ name: "col.user", signature: `col.user<T>("assignee")`, desc: "Avatar circulaire + nom + sous-titre optionnel" },
		{ name: "col.duration", signature: `col.duration<T>("timeSpent")`, desc: "Duree lisible — \"2h 30m\", \"45s\"" },
		{ name: "col.colorDot", signature: `col.colorDot<T>("priority")`, desc: "Dot colore + label texte" },
		{ name: "col.image", signature: `col.image<T>("thumbnail")`, desc: "Miniature image avec bords arrondis" },
		{ name: "col.sparkline", signature: `col.sparkline<T>("trend")`, desc: "Mini graphique SVG inline (line ou bar)" },
		{ name: "col.twoLines", signature: `col.twoLines<T>("title", { subtitleAccessor: "subtitle" })`, desc: "Ligne principale + sous-titre muted" },
		{ name: "col.keyValue", signature: `col.keyValue<T>("metadata")`, desc: "Paire \"label: value\" inline" },
		{ name: "col.imageText", signature: `col.imageText<T>("name", { imageAccessor: "avatar" })`, desc: "Image + texte cote a cote" },
		{ name: "col.avatarGroup", signature: `col.avatarGroup<T>("members")`, desc: "Avatars circulaires superposes" },
	]

	const editableColumns = [
		{ name: "col.editableText", signature: `col.editableText<T>("name", { onCellEdit })`, desc: "Texte editable au clic ou F2" },
		{ name: "col.editableNumber", signature: `col.editableNumber<T>("price", { onCellEdit })`, desc: "Nombre editable avec validation" },
		{ name: "col.editableCurrency", signature: `col.editableCurrency<T>("amount", { onCellEdit, currency: "EUR" })`, desc: "Montant editable avec formatage devise" },
		{ name: "col.editableSelect", signature: `col.editableSelect<T>("status", { onCellEdit, options: [...] })`, desc: "Dropdown editable avec options" },
		{ name: "col.editableDate", signature: `col.editableDate<T>("dueDate", { onCellEdit })`, desc: "Date editable avec date picker" },
	]

	const specialColumns = [
		{ name: "col.selection", signature: `col.selection<T>()`, desc: "Checkbox de selection (header = select-all, cell = par ligne)" },
		{ name: "col.expand", signature: `col.expand<T>()`, desc: "Chevron pour expand/collapse le detail panel" },
	]

	return (
		<DocPage title="Columns" subtitle="Reference complete des factories col.*, colonnes custom, visibilite et pinning." toc={toc}>
			<DocSection id="col-namespace" title="col.* Namespace">
				<p className="text-fg-muted mb-4">
					Le namespace <code>col</code> fournit des factories pour creer des colonnes en une ligne.
					Le <code>title</code> est auto-derive de la cle (<code>"companyName"</code> → <code>"Company Name"</code>)
					mais peut toujours etre surcharge.
				</p>

				<p className="text-sm font-medium mb-3 mt-6">Read-only</p>
				<div className="space-y-3">
					{readOnlyColumns.map((c) => (
						<div key={c.name} className="border border-separator rounded-lg p-3">
							<div className="flex items-baseline gap-2 mb-1">
								<code className="text-brand font-mono text-xs">{c.name}</code>
								<span className="text-fg-muted text-xs">— {c.desc}</span>
							</div>
							<pre className="bg-surface-3 rounded p-2 text-xs overflow-x-auto mt-1">{c.signature}</pre>
						</div>
					))}
				</div>

				<p className="text-sm font-medium mb-3 mt-8">Editable</p>
				<p className="text-fg-muted mb-3 text-sm">
					Les colonnes editables necessitent <code>enableCellEditing</code> sur le DataTable
					et un callback <code>onCellEdit</code>.
				</p>
				<div className="space-y-3">
					{editableColumns.map((c) => (
						<div key={c.name} className="border border-separator rounded-lg p-3">
							<div className="flex items-baseline gap-2 mb-1">
								<code className="text-brand font-mono text-xs">{c.name}</code>
								<span className="text-fg-muted text-xs">— {c.desc}</span>
							</div>
							<pre className="bg-surface-3 rounded p-2 text-xs overflow-x-auto mt-1">{c.signature}</pre>
						</div>
					))}
				</div>

				<p className="text-sm font-medium mb-3 mt-8">Special</p>
				<div className="space-y-3">
					{specialColumns.map((c) => (
						<div key={c.name} className="border border-separator rounded-lg p-3">
							<div className="flex items-baseline gap-2 mb-1">
								<code className="text-brand font-mono text-xs">{c.name}</code>
								<span className="text-fg-muted text-xs">— {c.desc}</span>
							</div>
							<pre className="bg-surface-3 rounded p-2 text-xs overflow-x-auto mt-1">{c.signature}</pre>
						</div>
					))}
				</div>
			</DocSection>

			<DocSection id="custom-columns" title="Custom Columns">
				<p className="text-fg-muted mb-4">
					Quand aucune factory <code>col.*</code> ne correspond a votre besoin, definissez une colonne
					manuellement avec le type <code>DataTableColumnDef&lt;T&gt;</code> :
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`import type { DataTableColumnDef } from "@blazz/pro/components/blocks/data-table"

const customColumn: DataTableColumnDef<Product> = {
  id: "custom-score",
  accessorKey: "score",
  header: "Score",
  cell: ({ row }) => {
    const score = row.getValue("score") as number
    return (
      <div className="flex items-center gap-2">
        <div
          className="h-2 rounded-full bg-brand"
          style={{ width: \`\${score}%\` }}
        />
        <span className="text-xs text-fg-muted">{score}%</span>
      </div>
    )
  },
  filterConfig: {
    type: "number",
    min: 0,
    max: 100,
    showInlineFilter: true,
  },
  enableSorting: true,
}`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Le type etend <code>ColumnDef</code> de TanStack Table avec un <code>filterConfig</code> optionnel.
					Vous avez acces a toutes les props TanStack (<code>cell</code>, <code>header</code>,{" "}
					<code>enableSorting</code>, <code>size</code>, etc.).
				</p>
			</DocSection>

			<DocSection id="column-visibility" title="Column Visibility">
				<p className="text-fg-muted mb-4">
					Masquez des colonnes par defaut avec <code>defaultColumnVisibility</code>.
					Les colonnes masquees restent disponibles pour le tri et les filtres.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`<DataTable
  columns={columns}
  defaultColumnVisibility={{
    createdAt: false,  // Masquee par defaut
    internalId: false, // Masquee mais filtrable
    name: true,        // Visible (defaut)
  }}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					L'utilisateur peut basculer la visibilite via l'icone colonnes dans le toolbar (si present).
					Les views peuvent aussi definir leur propre <code>columnVisibility</code>.
				</p>
			</DocSection>

			<DocSection id="column-pinning" title="Column Pinning">
				<p className="text-fg-muted mb-4">
					Activez <code>enableColumnPinning</code> pour permettre de figer des colonnes a gauche ou a droite
					lors du scroll horizontal.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`<DataTable
  enableColumnPinning
  defaultColumnPinning={{
    left: ["name"],     // "name" reste visible a gauche
    right: ["actions"], // "actions" reste visible a droite
  }}
  onColumnPinningChange={(pinning) => {
    console.log(pinning) // { left: [...], right: [...] }
  }}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Les colonnes pinnees ont un fond opaque et une ombre pour se distinguer visuellement
					du contenu scrollable.
				</p>
			</DocSection>
		</DocPage>
	)
}
