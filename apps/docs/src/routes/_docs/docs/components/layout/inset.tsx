import { createFileRoute } from "@tanstack/react-router"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocDoDont } from "~/components/docs/doc-do-dont"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "container-basic",
		code: `/* tokens.css */
:root {
  --inset: 1rem; /* 16px */
}

/* Utility classes */
@utility p-inset  { padding: var(--inset); }
@utility px-inset { padding-inline: var(--inset); }
@utility py-inset { padding-block: var(--inset); }
@utility pt-inset { padding-top: var(--inset); }`,
	},
	{
		key: "container-card",
		code: `<Card>
  <CardHeader>         {/* px-inset pt-inset */}
    <CardTitle>Projet Alpha</CardTitle>
    <CardDescription>Détails du projet</CardDescription>
  </CardHeader>
  <CardContent>        {/* p-inset */}
    <p>Le contenu hérite du même token.</p>
  </CardContent>
  <CardFooter>         {/* p-inset */}
    <Button>Enregistrer</Button>
  </CardFooter>
</Card>`,
	},
	{
		key: "bleed-pattern",
		code: `{/* Dialog header — pleine largeur */}
<DialogHeader>
  {/* -mx-inset -mt-inset p-inset */}
  <DialogTitle>Confirmation</DialogTitle>
</DialogHeader>

{/* Dialog footer — pleine largeur avec bordure */}
<DialogFooter>
  {/* -mx-inset -mb-inset p-inset border-t */}
  <Button>Confirmer</Button>
</DialogFooter>`,
	},
	{
		key: "asymmetric",
		code: `{/* Sheet header — vertical compressé à 75% */}
<SheetHeader>
  {/* px-inset + paddingBlock: calc(var(--inset) * 0.75) */}
  <SheetTitle>Filtres</SheetTitle>
</SheetHeader>

{/* Alert — vertical compressé à 50% */}
<Alert>
  {/* px-inset + paddingBlock: calc(var(--inset) * 0.5) */}
  <AlertTitle>Information</AlertTitle>
</Alert>`,
	},
	{
		key: "wrapper-page",
		code: `{/* Wrapper inset — padding de page/section */}
<div className="px-inset py-inset">
  <h1>Titre de la page</h1>
  <p>Contenu de la section...</p>
</div>

{/* Un élément enfant peut "saigner" dans le wrapper */}
<div className="px-inset">
  <div className="-mx-inset px-inset border-t border-separator">
    Contenu pleine largeur avec sa propre bordure
  </div>
</div>`,
	},
	{
		key: "override-dense",
		code: `/* Override local — section dense */
.section-dense {
  --inset: 0.5rem; /* 8px */
}

/* Override local — section spacieuse */
.section-spacious {
  --inset: 1.5rem; /* 24px */
}`,
	},
	{
		key: "override-usage",
		code: `{/* Tout enfant hérite automatiquement du nouveau --inset */}
<div className="section-dense">
  <Card>
    <CardContent>
      {/* p-inset résout à 0.5rem au lieu de 1rem */}
      Contenu compact
    </CardContent>
  </Card>

  <Dialog>
    <DialogContent>
      {/* Le dialog aussi est plus compact */}
    </DialogContent>
  </Dialog>
</div>`,
	},
	{
		key: "negative-margins",
		code: `/* Marges négatives pour les bleeds */
@utility -mx-inset { margin-inline: calc(-1 * var(--inset)); }
@utility -mt-inset { margin-top: calc(-1 * var(--inset)); }
@utility -mb-inset { margin-bottom: calc(-1 * var(--inset)); }

{/* Usage: header qui "saigne" dans le container parent */}
<div className="-mx-inset -mt-inset p-inset bg-raised">
  Contenu pleine largeur
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/inset")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: InsetPage,
})

const toc = [
	{ id: "concept", title: "Le concept" },
	{ id: "container-inset", title: "Container Inset" },
	{ id: "wrapper-inset", title: "Wrapper Inset" },
	{ id: "bleed-pattern", title: "Pattern Bleed" },
	{ id: "asymmetric", title: "Padding asymétrique" },
	{ id: "overrides", title: "Overrides de densité" },
	{ id: "utilities", title: "Utilitaires disponibles" },
	{ id: "components", title: "Composants concernés" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Voir aussi" },
]

function InsetPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Inset"
			subtitle="Un token unique pour gérer le padding de tous les containers et wrappers. Modulable, cohérent et facile à overrider."
			category="Layout and Structure"
			toc={toc}
		>
			{/* Concept */}
			<DocSection id="concept" title="Le concept">
				<div className="space-y-4 text-sm text-fg-secondary leading-relaxed">
					<p>
						Le design system utilise un <strong className="text-fg">token unique <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">--inset</code></strong> pour
						contrôler le padding interne des containers. Au lieu de hardcoder{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">p-4</code>,{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">p-2.5</code> ou{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">px-4</code> dans chaque composant,
						tous consomment la même variable CSS.
					</p>
					<p>
						Ce token s'utilise dans deux contextes distincts — qu'on appelle <strong className="text-fg">Container Inset</strong> et <strong className="text-fg">Wrapper Inset</strong> :
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-lg border border-container p-4 space-y-2">
							<div className="flex items-center gap-2">
								<Badge variant="outline">Container</Badge>
							</div>
							<p className="text-[13px] text-fg-muted">
								Padding <strong className="text-fg">à l'intérieur</strong> des composants surfaciques : Card, Dialog, Sheet, Popover, HoverCard, Alert. Le composant gère son propre inset.
							</p>
						</div>
						<div className="rounded-lg border border-container p-4 space-y-2">
							<div className="flex items-center gap-2">
								<Badge variant="outline">Wrapper</Badge>
							</div>
							<p className="text-[13px] text-fg-muted">
								Padding <strong className="text-fg">autour du contenu</strong> dans les wrappers de page ou de section. Le wrapper utilise le même token pour aligner ses marges internes avec les containers qu'il contient.
							</p>
						</div>
					</div>
					<p>
						L'avantage : changer <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">--inset</code> à un endroit
						ajuste <strong className="text-fg">tous les paddings simultanément</strong> — containers et wrappers — sans toucher un seul composant.
					</p>
				</div>

				<DocExampleClient
					title="Le token et ses utilitaires"
					description="Défini dans tokens.css, consommé via des classes Tailwind."
					code={examples[0].code}
					highlightedCode={html("container-basic")}
				>
					<div className="space-y-3 text-sm">
						<div className="flex items-center gap-3">
							<code className="shrink-0 rounded bg-raised px-2 py-1 text-xs font-mono text-brand">--inset: 1rem</code>
							<span className="text-fg-muted">→ 16px — valeur par défaut</span>
						</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{[
								{ cls: "p-inset", desc: "Tous les côtés" },
								{ cls: "px-inset", desc: "Horizontal" },
								{ cls: "py-inset", desc: "Vertical" },
								{ cls: "pt-inset", desc: "Haut seul" },
							].map((u) => (
								<div key={u.cls} className="rounded border border-container px-3 py-2">
									<code className="block text-xs font-mono text-fg">{u.cls}</code>
									<span className="text-[11px] text-fg-muted">{u.desc}</span>
								</div>
							))}
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Container Inset */}
			<DocSection id="container-inset" title="Container Inset">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Le <strong className="text-fg">container inset</strong> est le padding géré par les composants surfaciques eux-mêmes.
						Quand tu utilises une Card, un Dialog ou un Sheet, le padding est déjà câblé sur <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">--inset</code> — tu n'as rien à faire.
					</p>
				</div>

				<DocExampleClient
					title="Card — container inset automatique"
					description="CardHeader, CardContent et CardFooter utilisent tous p-inset ou px-inset."
					code={examples[1].code}
					highlightedCode={html("container-card")}
				>
					<Card className="max-w-sm">
						<CardHeader>
							<CardTitle>Projet Alpha</CardTitle>
							<CardDescription>Détails du projet</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-fg-muted">Le contenu hérite du même token.</p>
						</CardContent>
						<CardFooter>
							<Button size="sm">Enregistrer</Button>
						</CardFooter>
					</Card>
				</DocExampleClient>
			</DocSection>

			{/* Wrapper Inset */}
			<DocSection id="wrapper-inset" title="Wrapper Inset">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Le <strong className="text-fg">wrapper inset</strong> est le même token appliqué aux wrappers de page ou de section.
						En utilisant <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">px-inset</code> ou{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">p-inset</code> sur un wrapper,
						tu garantis que ses marges internes s'alignent parfaitement avec le padding des containers enfants.
					</p>
					<p>
						Le pattern bleed (marges négatives) fonctionne aussi dans ce contexte : un enfant peut utiliser{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">-mx-inset</code> pour s'étendre jusqu'aux bords du wrapper.
					</p>
				</div>

				<DocExampleClient
					title="Wrapper de section avec bleed"
					description="Le padding du wrapper et les marges négatives des enfants utilisent le même token."
					code={examples[4].code}
					highlightedCode={html("wrapper-page")}
				>
					<div className="rounded-lg border border-container overflow-hidden">
						<div className="px-[var(--inset)] py-[var(--inset)]">
							<h3 className="text-sm font-medium text-fg">Titre de la page</h3>
							<p className="mt-1 text-xs text-fg-muted">Contenu de la section...</p>
						</div>
						<div className="px-[var(--inset)]">
							<div className="mx-[calc(-1*var(--inset))] px-[var(--inset)] border-t border-separator py-3">
								<p className="text-xs text-fg-muted">Contenu pleine largeur avec sa propre bordure</p>
							</div>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Bleed pattern */}
			<DocSection id="bleed-pattern" title="Pattern Bleed">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Les headers et footers de Dialog et Sheet utilisent des <strong className="text-fg">marges négatives</strong> pour
						occuper toute la largeur du container, indépendamment du padding parent. Les marges négatives et le padding
						positif consomment le même token, donc ils restent synchronisés.
					</p>
				</div>

				<DocExampleClient
					title="Dialog — header et footer en pleine largeur"
					description="Les marges négatives (-mx-inset, -mt-inset, -mb-inset) annulent le padding parent."
					code={examples[2].code}
					highlightedCode={html("bleed-pattern")}
				>
					<div className="max-w-sm rounded-xl border border-container bg-surface overflow-hidden">
						<div className="p-[var(--inset)]">
							{/* Simulated dialog header */}
							<div className="mx-[calc(-1*var(--inset))] mt-[calc(-1*var(--inset))] p-[var(--inset)] border-b border-separator bg-raised/50">
								<p className="text-sm font-semibold text-fg">Confirmation</p>
								<p className="text-xs text-fg-muted mt-0.5">Voulez-vous continuer ?</p>
							</div>

							<div className="py-4">
								<p className="text-sm text-fg-muted">Contenu du dialog avec padding standard.</p>
							</div>

							{/* Simulated dialog footer */}
							<div className="mx-[calc(-1*var(--inset))] mb-[calc(-1*var(--inset))] p-[var(--inset)] border-t border-separator flex justify-end gap-2">
								<Button variant="outline" size="sm">Annuler</Button>
								<Button size="sm">Confirmer</Button>
							</div>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Asymmetric */}
			<DocSection id="asymmetric" title="Padding asymétrique">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Certains composants ont intentionnellement <strong className="text-fg">moins de padding vertical</strong> que horizontal.
						Au lieu de hardcoder, on utilise <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">calc(var(--inset) * ratio)</code> pour que
						tout scale ensemble quand on change le token.
					</p>
				</div>

				<DocExampleClient
					title="Ratios d'asymétrie"
					description="75% pour Sheet header/footer, 50% pour Alert."
					code={examples[3].code}
					highlightedCode={html("asymmetric")}
				>
					<div className="space-y-3">
						<div className="rounded-lg border border-container overflow-hidden">
							<div className="px-[var(--inset)] bg-raised/50" style={{ paddingBlock: "calc(var(--inset) * 0.75)" }}>
								<p className="text-xs font-medium text-fg">Sheet Header</p>
								<p className="text-[11px] text-fg-muted">paddingBlock = inset × 0.75</p>
							</div>
						</div>
						<div className="rounded-lg border border-container overflow-hidden">
							<div className="px-[var(--inset)] bg-info/10" style={{ paddingBlock: "calc(var(--inset) * 0.5)" }}>
								<p className="text-xs font-medium text-fg">Alert</p>
								<p className="text-[11px] text-fg-muted">paddingBlock = inset × 0.5</p>
							</div>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Overrides */}
			<DocSection id="overrides" title="Overrides de densité">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Puisque <code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">--inset</code> est une variable CSS,
						n'importe quel parent peut la redéfinir. Tous les enfants — containers et wrappers — héritent automatiquement de la nouvelle valeur.
					</p>
				</div>

				<DocExampleClient
					title="Override CSS"
					description="Définir une classe qui change --inset pour créer des zones de densité différente."
					code={examples[5].code}
					highlightedCode={html("override-dense")}
				>
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<Badge variant="outline" className="text-[10px]">Dense — 0.5rem</Badge>
							<div style={{ ["--inset" as string]: "0.5rem" }}>
								<Card>
									<CardContent>
										<p className="text-xs text-fg-muted">Padding compact</p>
									</CardContent>
								</Card>
							</div>
						</div>
						<div className="space-y-2">
							<Badge variant="outline" className="text-[10px]">Default — 1rem</Badge>
							<Card>
								<CardContent>
									<p className="text-xs text-fg-muted">Padding standard</p>
								</CardContent>
							</Card>
						</div>
						<div className="space-y-2">
							<Badge variant="outline" className="text-[10px]">Spacieux — 1.5rem</Badge>
							<div style={{ ["--inset" as string]: "1.5rem" }}>
								<Card>
									<CardContent>
										<p className="text-xs text-fg-muted">Padding large</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Cascade automatique"
					description="Un seul override affecte tous les composants enfants."
					code={examples[6].code}
					highlightedCode={html("override-usage")}
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<div style={{ ["--inset" as string]: "0.5rem" }} className="space-y-2">
							<p className="text-[11px] font-medium text-fg-muted uppercase tracking-wider">--inset: 0.5rem</p>
							<Card>
								<CardHeader>
									<CardTitle className="text-sm">Compact</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-xs text-fg-muted">Tous les sous-composants sont compacts.</p>
								</CardContent>
								<CardFooter>
									<Button size="sm" variant="outline">Action</Button>
								</CardFooter>
							</Card>
						</div>
						<div style={{ ["--inset" as string]: "1.5rem" }} className="space-y-2">
							<p className="text-[11px] font-medium text-fg-muted uppercase tracking-wider">--inset: 1.5rem</p>
							<Card>
								<CardHeader>
									<CardTitle className="text-sm">Spacieux</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-xs text-fg-muted">Tous les sous-composants sont spacieux.</p>
								</CardContent>
								<CardFooter>
									<Button size="sm" variant="outline">Action</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Utilities reference */}
			<DocSection id="utilities" title="Utilitaires disponibles">
				<div className="overflow-hidden rounded-lg border border-container">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-separator bg-raised/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Classe</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">CSS généré</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Usage</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-separator">
							{[
								{ cls: "p-inset", css: "padding: var(--inset)", usage: "Container / wrapper full" },
								{ cls: "px-inset", css: "padding-inline: var(--inset)", usage: "Horizontal seul" },
								{ cls: "py-inset", css: "padding-block: var(--inset)", usage: "Vertical seul" },
								{ cls: "pt-inset", css: "padding-top: var(--inset)", usage: "Haut seul (headers)" },
								{ cls: "-mx-inset", css: "margin-inline: calc(-1 * var(--inset))", usage: "Bleed horizontal" },
								{ cls: "-mt-inset", css: "margin-top: calc(-1 * var(--inset))", usage: "Bleed en haut" },
								{ cls: "-mb-inset", css: "margin-bottom: calc(-1 * var(--inset))", usage: "Bleed en bas" },
							].map((row) => (
								<tr key={row.cls}>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-brand">{row.cls}</code>
									</td>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-fg-muted">{row.css}</code>
									</td>
									<td className="px-4 py-2 text-xs text-fg-muted">{row.usage}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</DocSection>

			{/* Components table */}
			<DocSection id="components" title="Composants concernés">
				<div className="space-y-4 text-sm text-fg-secondary leading-relaxed">
					<p>
						Seuls les composants <strong className="text-fg">surfaciques plats</strong> utilisent le token. Les menus
						(Dropdown, ContextMenu, Select), les tooltips et les composants avec leur propre système de spacing (Sidebar, Table, Accordion) ne sont pas affectés.
					</p>
				</div>

				<div className="overflow-hidden rounded-lg border border-container">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-separator bg-raised/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Composant</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Classes inset</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Pattern</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-separator">
							{[
								{ comp: "CardContent", cls: "p-inset", pattern: "Container" },
								{ comp: "CardHeader", cls: "px-inset pt-inset", pattern: "Container" },
								{ comp: "CardFooter", cls: "p-inset", pattern: "Container" },
								{ comp: "DialogHeader", cls: "-mx-inset -mt-inset p-inset", pattern: "Bleed" },
								{ comp: "DialogFooter", cls: "-mx-inset -mb-inset p-inset", pattern: "Bleed" },
								{ comp: "SheetHeader", cls: "px-inset + calc(× 0.75)", pattern: "Asymétrique" },
								{ comp: "SheetFooter", cls: "px-inset + calc(× 0.75)", pattern: "Asymétrique" },
								{ comp: "HoverCardContent", cls: "p-inset", pattern: "Container" },
								{ comp: "Alert", cls: "px-inset + calc(× 0.5)", pattern: "Asymétrique" },
							].map((row) => (
								<tr key={row.comp}>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-fg">{row.comp}</code>
									</td>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-fg-muted">{row.cls}</code>
									</td>
									<td className="px-4 py-2">
										<Badge variant="outline" className="text-[10px]">{row.pattern}</Badge>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<DocDoDont
					doExample={
						<div className="space-y-2 text-xs font-mono">
							<p className="text-fg-muted">{"/* Utiliser les utilitaires inset */"}</p>
							<p className="text-fg">{"<div className=\"p-inset\">"}</p>
							<p className="text-fg">{"<div className=\"px-inset\">"}</p>
							<p className="text-fg">{"<div className=\"-mx-inset p-inset\">"}</p>
						</div>
					}
					doText="Utiliser les classes p-inset, px-inset etc. pour que le padding s'adapte automatiquement au contexte de densité."
					dontExample={
						<div className="space-y-2 text-xs font-mono">
							<p className="text-fg-muted">{"/* Hardcoder le padding */"}</p>
							<p className="text-fg">{"<div className=\"p-4\">"}</p>
							<p className="text-fg">{"<div className=\"px-4\">"}</p>
							<p className="text-fg">{"<div className=\"-mx-4 p-4\">"}</p>
						</div>
					}
					dontText="Ne pas hardcoder p-4 ou px-4 dans les containers — le padding ne s'adaptera pas quand on change la densité."
				/>

				<DocDoDont
					doExample={
						<div className="space-y-2 text-xs font-mono">
							<p className="text-fg-muted">{"/* Override via variable CSS */"}</p>
							<p className="text-fg">{"<div style={{ '--inset': '0.5rem' }}>"}</p>
							<p className="text-fg">{"  <Card>...</Card>"}</p>
							<p className="text-fg">{"</div>"}</p>
						</div>
					}
					doText="Overrider --inset sur un parent pour ajuster la densité d'une zone entière d'un coup."
					dontExample={
						<div className="space-y-2 text-xs font-mono">
							<p className="text-fg-muted">{"/* Override composant par composant */"}</p>
							<p className="text-fg">{"<Card className=\"p-2\">"}</p>
							<p className="text-fg">{"<Dialog className=\"p-2\">"}</p>
							<p className="text-fg">{"<Sheet className=\"p-2\">"}</p>
						</div>
					}
					dontText="Ne pas overrider le padding composant par composant — ça casse la cohérence et le bleed pattern."
				/>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Voir aussi">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Container principal utilisant le token --inset.",
						},
						{
							title: "Bleed",
							href: "/docs/components/layout/bleed",
							description: "Composant utilitaire pour les marges négatives.",
						},
						{
							title: "Box",
							href: "/docs/components/layout/box",
							description: "Primitive de layout avec accès aux design tokens.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
