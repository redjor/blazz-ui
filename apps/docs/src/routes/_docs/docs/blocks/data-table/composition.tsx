import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"

const toc = [
	{ id: "overview", title: "Overview" },
	{ id: "toolbar-slots", title: "Toolbar Slots" },
	{ id: "render-group-header", title: "renderGroupHeader" },
	{ id: "render-group-header-content", title: "renderGroupHeaderContent" },
	{ id: "render-row-actions", title: "renderRowActions" },
	{ id: "render-pagination", title: "renderPagination" },
	{ id: "footer-slot", title: "footerSlot" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/composition")({
	component: CompositionPage,
})

function CompositionPage() {
	return (
		<DocPage
			title="Composition & Slots"
			subtitle="Points d'injection pour customiser le toolbar, les group headers, les actions, la pagination et le footer."
			toc={toc}
		>
			<DocSection id="overview" title="Overview">
				<p className="text-fg-muted mb-4">
					Le DataTable expose des <strong>render props</strong> pour remplacer le rendu par defaut
					et des <strong>slots ReactNode</strong> pour ajouter du contenu sans rien remplacer.
				</p>
				<div className="bg-surface-3 rounded-lg p-4 text-sm font-mono space-y-1">
					<p className="text-fg-muted">{"// Render props — remplacent le defaut"}</p>
					<p>
						renderGroupHeader, renderGroupHeaderContent, renderRowActions, renderPagination,
						renderRow
					</p>
					<p className="text-fg-muted mt-3">{"// Slots — ajoutent sans remplacer"}</p>
					<p>toolbarLeadingSlot, toolbarTrailingSlot, toolbarBelowSlot, footerSlot</p>
				</div>
			</DocSection>

			<DocSection id="toolbar-slots" title="Toolbar Slots">
				<p className="text-fg-muted mb-4">Trois positions d'injection dans le toolbar :</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  toolbarLeadingSlot={<MyLogo />}       // Before view pills
  toolbarTrailingSlot={<ExportButton />} // After icon actions
  toolbarBelowSlot={<StatsStrip />}      // Between toolbar and table
/>`}
				</pre>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto mt-4 text-fg-muted">
					{`┌──────────────────────────────────────────────────┐
│ [leading] [view pills...] ← → [icons] [trailing] │ Row 1
├──────────────────────────────────────────────────┤
│ [search]                                         │ Row 2
├──────────────────────────────────────────────────┤
│ [filters]                                        │ Row 3
├──────────────────────────────────────────────────┤
│ [toolbarBelowSlot]                               │ Row 4
├──────────────────────────────────────────────────┤
│ <table> ...                                      │
└──────────────────────────────────────────────────┘`}
				</pre>
			</DocSection>

			<DocSection id="render-group-header" title="renderGroupHeader">
				<p className="text-fg-muted mb-4">
					Remplacement total du group header. Recoit la row et le contenu par defaut comme fallback.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`renderGroupHeader={(row, defaultContent) => (
  <div className="my-custom-wrapper">
    {defaultContent}  {/* Use the default as base */}
    <span className="ml-auto">Custom action</span>
  </div>
)}`}
				</pre>
			</DocSection>

			<DocSection id="render-group-header-content" title="renderGroupHeaderContent">
				<p className="text-fg-muted mb-4">
					Remplace uniquement le contenu central (entre le chevron et les agregations). Le DataTable
					gere toujours le chevron expand/collapse et la checkbox.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`renderGroupHeaderContent={({ row, groupValue, subRowCount, aggregations }) => (
  <span className="flex items-center gap-2">
    <StatusIcon status={groupValue} />
    <span className="font-medium">{statusLabel[groupValue]}</span>
    <Badge>{subRowCount}</Badge>
    {Object.values(aggregations).map((v, i) => <span key={i}>{v}</span>)}
  </span>
)}`}
				</pre>
				<p className="text-fg-muted mt-3 text-sm">
					Priorite : <code>renderGroupHeader</code> {">"} <code>renderGroupHeaderContent</code>{" "}
					{">"} defaut.
				</p>
			</DocSection>

			<DocSection id="render-row-actions" title="renderRowActions">
				<p className="text-fg-muted mb-4">
					Remplace le menu ... par un composant custom (boutons inline, switch, icones...).
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`renderRowActions={(row) => (
  <div className="flex items-center gap-1">
    <Button size="icon-sm" variant="ghost" onClick={() => edit(row.original)}>
      <Pencil className="size-3.5" />
    </Button>
    <Button size="icon-sm" variant="ghost" onClick={() => remove(row.original)}>
      <Trash2 className="size-3.5" />
    </Button>
  </div>
)}`}
				</pre>
				<p className="text-fg-muted mt-3 text-sm">
					Priorite : <code>renderRowActions</code> {">"} <code>rowActions[]</code>.
				</p>
			</DocSection>

			<DocSection id="render-pagination" title="renderPagination">
				<p className="text-fg-muted mb-4">
					Remplace la pagination par defaut. Recoit un objet simplifie (pas d'acces au table
					TanStack).
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`renderPagination={({ page, pageCount, canNextPage, canPrevPage, onNextPage, onPrevPage }) => (
  <div className="flex items-center justify-center gap-2 py-2">
    <Button disabled={!canPrevPage} onClick={onPrevPage}>Prev</Button>
    <span>{page + 1} / {pageCount}</span>
    <Button disabled={!canNextPage} onClick={onNextPage}>Next</Button>
  </div>
)}`}
				</pre>
				<p className="text-fg-muted mt-3 text-sm">
					Props disponibles : <code>page</code>, <code>pageCount</code>, <code>pageSize</code>,{" "}
					<code>pageSizeOptions</code>, <code>totalRows</code>, <code>onNextPage</code>,{" "}
					<code>onPrevPage</code>, <code>onFirstPage</code>, <code>onLastPage</code>,{" "}
					<code>onPageSizeChange</code>, <code>canNextPage</code>, <code>canPrevPage</code>.
				</p>
			</DocSection>

			<DocSection id="footer-slot" title="footerSlot">
				<p className="text-fg-muted mb-4">
					ReactNode statique injecte apres la table et la pagination.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  footerSlot={
    <div className="p-3 text-sm text-fg-muted text-center border-t border-separator">
      Total: {data.length} items — Last updated: {new Date().toLocaleDateString()}
    </div>
  }
/>`}
				</pre>
			</DocSection>
		</DocPage>
	)
}
