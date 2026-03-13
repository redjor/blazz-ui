import { Badge } from "@blazz/ui/components/ui/badge"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "install-claude",
		code: `// .claude/mcp.json (ou .mcp.json à la racine)
{
  "mcpServers": {
    "blazz": {
      "command": "npx",
      "args": ["@blazz/mcp"],
      "env": {
        "BLAZZ_ROOT": "/path/to/blazz-ui-app"
      }
    }
  }
}`,
	},
	{
		key: "install-cursor",
		code: `// .cursor/mcp.json
{
  "mcpServers": {
    "blazz": {
      "command": "npx",
      "args": ["@blazz/mcp"],
      "env": {
        "BLAZZ_ROOT": "/path/to/blazz-ui-app"
      }
    }
  }
}`,
	},
	{
		key: "tool-list-components",
		code: `// list_components — aucun argument
// Retourne un tableau JSON :
[
  {
    "name": "Button",
    "category": "Primitives (@/components/ui/)",
    "description": "Variants: primary, secondary, ghost, destructive, outline."
  },
  {
    "name": "DataGrid",
    "category": "Blocks Data (@/components/blocks/)",
    "description": "Table avancée pour données paginées."
  },
  // ... 30+ composants
]`,
	},
	{
		key: "tool-get-component",
		code: `// get_component({ name: "Button" })
// Retourne la doc Markdown complète :
// - Props avec types et defaults
// - Variants disponibles
// - Exemples d'usage canoniques
// - Gotchas et pièges courants

## Button

### Props
| Prop      | Type                                           | Default     |
|-----------|-------------------------------------------------|-------------|
| variant   | "primary" \\| "secondary" \\| "ghost" \\| ...    | "primary"   |
| size      | "sm" \\| "md" \\| "lg"                           | "md"        |
| loading   | boolean                                         | false       |
| disabled  | boolean                                         | false       |

### Usage
\`\`\`tsx
<Button variant="outline" size="sm">
  Exporter
</Button>
\`\`\``,
	},
	{
		key: "tool-get-pattern",
		code: `// get_pattern({ name: "resource-list" })
// Retourne le pattern complet avec :
// - Structure de fichiers recommandée
// - Code skeleton de la page
// - Conventions de colonnes DataTable
// - États : loading, empty, error, success

// Patterns disponibles :
// resource-list       — Page de liste avec DataTable + filtres
// resource-detail     — Page de détail avec tabs + FieldGrid
// resource-create-edit — Formulaire create/edit avec FormSections
// resource-import     — Import CSV/Excel avec preview
// dashboard           — Dashboard avec KPIs + charts
// pipeline-kanban     — Vue Kanban avec drag & drop
// reporting           — Page de reporting avec graphiques`,
	},
	{
		key: "tool-get-rules",
		code: `// get_rules — aucun argument
// Retourne les règles non négociables :
// - Architecture : Server Components par défaut
// - Formulaires : react-hook-form + zod TOUJOURS
// - 4 états obligatoires : loading, empty, error, success
// - Imports : @blazz/ui/components/ui/button
// - Conventions : pas de asChild, utiliser render prop`,
	},
	{
		key: "tool-get-design",
		code: `// get_design_principles — aucun argument
// Retourne les principes de design :
// - Tufte : data-ink ratio, supprimer le superflu
// - Gestalt : proximité, similarité, enclosure
// - Densité : 13px tables, 40px rows, 32px inputs
// - Espacement : échelle de 4px stricte
// - Typographie : Inter, tabular-nums, 3 niveaux max
// - Couleurs : sémantiques uniquement, pas décoratives`,
	},
	{
		key: "tool-get-tokens",
		code: `// get_tokens — aucun argument
// Retourne le fichier tokens.css complet :
:root {
  /* Surfaces */
  --app:     oklch(0.985 0.002 260);
  --surface: oklch(1.00 0 0);
  --raised:  oklch(0.97 0.002 260);

  /* Text */
  --fg:           oklch(0.15 0.01 260);
  --fg-secondary: oklch(0.40 0.01 260);
  --fg-muted:     oklch(0.55 0.01 260);

  /* Brand */
  --brand: oklch(0.50 0.22 275);
  // ... 25 tokens au total, light + dark
}`,
	},
	{
		key: "workflow-example",
		code: `// Conversation type avec un AI assistant utilisant le MCP :

// 1. L'IA appelle get_rules() au démarrage
//    → Comprend les conventions du projet

// 2. Tu demandes : "Crée une page de liste de produits"
//    → L'IA appelle get_pattern({ name: "resource-list" })
//    → Obtient le skeleton complet avec DataTable + filtres

// 3. L'IA a besoin des props DataTable
//    → Appelle get_component({ name: "DataGrid" })
//    → Obtient l'API complète avec exemples

// 4. L'IA vérifie les tokens pour le styling
//    → Appelle get_tokens()
//    → Utilise les bonnes variables CSS

// Résultat : du code qui respecte le design system
// dès le premier essai, sans aller-retour.`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/mcp")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: McpPage,
})

const toc = [
	{ id: "concept", title: "Le concept" },
	{ id: "installation", title: "Installation" },
	{ id: "tools", title: "Les 6 tools" },
	{ id: "tool-list-components", title: "list_components" },
	{ id: "tool-get-component", title: "get_component" },
	{ id: "tool-get-pattern", title: "get_pattern" },
	{ id: "tool-get-rules", title: "get_rules" },
	{ id: "tool-get-design-principles", title: "get_design_principles" },
	{ id: "tool-get-tokens", title: "get_tokens" },
	{ id: "workflow", title: "Workflow type" },
	{ id: "compatibilite", title: "Compatibilité" },
	{ id: "related", title: "Voir aussi" },
]

function McpPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="MCP Server"
			subtitle="Serveur Model Context Protocol qui expose le design system Blazz aux assistants AI. 6 tools pour que l'IA comprenne vos composants, patterns, tokens et conventions."
			category="Outils"
			toc={toc}
		>
			{/* Concept */}
			<DocSection id="concept" title="Le concept">
				<div className="space-y-4 text-sm text-fg-secondary leading-relaxed">
					<p>
						<strong className="text-fg">@blazz/mcp</strong> est un serveur{" "}
						<strong className="text-fg">Model Context Protocol</strong> qui donne à votre assistant
						AI (Claude, Cursor, Copilot) un accès structuré au design system Blazz.
					</p>
					<p>
						Au lieu de copier-coller de la documentation dans vos prompts, l'IA interroge
						directement le MCP pour obtenir les props d'un composant, le skeleton d'une page, ou les
						tokens CSS. Le code généré respecte les conventions{" "}
						<strong className="text-fg">dès le premier essai</strong>.
					</p>

					<div className="grid gap-4 sm:grid-cols-3">
						<div className="rounded-lg border border-container p-4 space-y-2">
							<p className="text-xs font-medium text-fg uppercase tracking-wider">Sans MCP</p>
							<p className="text-[13px] text-fg-muted">
								L'IA invente des props, utilise des patterns non standards, et ignore les
								conventions du projet. Aller-retour constants.
							</p>
						</div>
						<div className="rounded-lg border border-container p-4 space-y-2">
							<p className="text-xs font-medium text-fg uppercase tracking-wider">Avec MCP</p>
							<p className="text-[13px] text-fg-muted">
								L'IA interroge l'API des composants, récupère les patterns exacts, et génère du code
								conforme au design system.
							</p>
						</div>
						<div className="rounded-lg border border-container p-4 space-y-2">
							<p className="text-xs font-medium text-fg uppercase tracking-wider">6 tools</p>
							<p className="text-[13px] text-fg-muted">
								Composants, patterns de pages, tokens CSS, principes de design, et conventions de
								code — tout est accessible.
							</p>
						</div>
					</div>
				</div>
			</DocSection>

			{/* Installation */}
			<DocSection id="installation" title="Installation">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Le serveur MCP se configure dans le fichier de config de votre éditeur. Il utilise{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">
							npx @blazz/mcp
						</code>{" "}
						— aucune installation globale nécessaire.
					</p>
					<p>
						La variable{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">BLAZZ_ROOT</code>{" "}
						pointe vers la racine du monorepo. Si omise, le serveur remonte l'arborescence pour
						trouver le dossier{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">ai/</code>.
					</p>
				</div>

				<DocExampleClient
					title="Claude Code"
					description="Fichier .claude/mcp.json ou .mcp.json à la racine du projet."
					code={examples[0].code}
					highlightedCode={html("install-claude")}
				>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-[10px]">
								Claude Code
							</Badge>
							<span className="text-xs text-fg-muted">.claude/mcp.json</span>
						</div>
						<p className="text-xs text-fg-muted">
							Claude Code charge automatiquement les serveurs MCP au démarrage.
						</p>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Cursor"
					description="Fichier .cursor/mcp.json dans le projet."
					code={examples[1].code}
					highlightedCode={html("install-cursor")}
				>
					<div className="space-y-2 text-sm">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-[10px]">
								Cursor
							</Badge>
							<span className="text-xs text-fg-muted">.cursor/mcp.json</span>
						</div>
						<p className="text-xs text-fg-muted">
							Cursor détecte les serveurs MCP au rechargement de la fenêtre.
						</p>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Les 6 tools */}
			<DocSection id="tools" title="Les 6 tools">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Le serveur expose <strong className="text-fg">6 tools</strong> que l'assistant AI peut
						appeler à tout moment pendant une conversation. Chaque tool retourne du contenu
						structuré — JSON ou Markdown — que l'IA utilise pour générer du code.
					</p>
				</div>

				<div className="overflow-hidden rounded-lg border border-container">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-separator bg-raised/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Tool</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">
									Arguments
								</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">
									Description
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-separator">
							{[
								{
									tool: "list_components",
									args: "—",
									desc: "Liste les 30+ composants avec nom, catégorie et description",
								},
								{
									tool: "get_component",
									args: "name: string",
									desc: "Doc complète d'un composant : props, exemples, gotchas",
								},
								{
									tool: "get_pattern",
									args: "name: string",
									desc: "Pattern de page complet avec structure, code et conventions",
								},
								{
									tool: "get_rules",
									args: "—",
									desc: "Conventions de code non négociables du projet",
								},
								{
									tool: "get_design_principles",
									args: "—",
									desc: "Principes de design : Tufte, Gestalt, densité, typographie",
								},
								{
									tool: "get_tokens",
									args: "—",
									desc: "Tokens CSS complets : surfaces, textes, couleurs, densité",
								},
							].map((row) => (
								<tr key={row.tool}>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-brand">{row.tool}</code>
									</td>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-fg-muted">{row.args}</code>
									</td>
									<td className="px-4 py-2 text-xs text-fg-muted">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</DocSection>

			{/* list_components */}
			<DocSection id="tool-list-components" title="list_components">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne la liste complète des composants disponibles. L'IA utilise cette tool pour
						savoir quel composant chercher avant d'appeler{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">get_component</code>
						.
					</p>
				</div>

				<DocExampleClient
					title="Réponse"
					description="Tableau JSON avec name, category et description pour chaque composant."
					code={examples[2].code}
					highlightedCode={html("tool-list-components")}
				>
					<div className="space-y-2">
						<p className="text-xs font-medium text-fg">Catégories retournées</p>
						<div className="flex flex-wrap gap-2">
							{["Primitives (ui/)", "Blocks Data (blocks/)", "Layouts"].map((cat) => (
								<Badge key={cat} variant="outline" className="text-[10px]">
									{cat}
								</Badge>
							))}
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* get_component */}
			<DocSection id="tool-get-component" title="get_component">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne la documentation complète d'un composant : props avec types et defaults,
						exemples d'usage canoniques, et gotchas à éviter. Le contenu vient de{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">
							ai/components.md
						</code>
						.
					</p>
				</div>

				<DocExampleClient
					title="Exemple : Button"
					description="La section Markdown complète du composant, extraite automatiquement."
					code={examples[3].code}
					highlightedCode={html("tool-get-component")}
				>
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<code className="rounded bg-raised px-2 py-1 text-xs font-mono text-brand">
								name: "Button"
							</code>
							<span className="text-xs text-fg-muted">ou "DataGrid", "PageHeader", etc.</span>
						</div>
						<p className="text-xs text-fg-muted">
							Si le composant n'existe pas, retourne une erreur avec la suggestion d'utiliser{" "}
							<code className="text-brand">list_components</code>.
						</p>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* get_pattern */}
			<DocSection id="tool-get-pattern" title="get_pattern">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne un pattern de page complet avec la structure de fichiers, le code skeleton, les
						conventions spécifiques et les 4 états (loading, empty, error, success). Source :{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">
							ai/patterns/*.md
						</code>
						.
					</p>
				</div>

				<DocExampleClient
					title="Patterns disponibles"
					description="7 patterns couvrant les types de pages les plus courants en enterprise."
					code={examples[4].code}
					highlightedCode={html("tool-get-pattern")}
				>
					<div className="grid gap-3 sm:grid-cols-2">
						{[
							{ name: "resource-list", desc: "DataTable + filtres + pagination" },
							{ name: "resource-detail", desc: "Tabs + FieldGrid + timeline" },
							{ name: "resource-create-edit", desc: "FormSections + validation" },
							{ name: "resource-import", desc: "Import CSV/Excel + preview" },
							{ name: "dashboard", desc: "KPIs + charts + mini tables" },
							{ name: "pipeline-kanban", desc: "Kanban drag & drop" },
							{ name: "reporting", desc: "Graphiques + export" },
						].map((p) => (
							<div key={p.name} className="flex items-start gap-2">
								<code className="shrink-0 rounded bg-raised px-1.5 py-0.5 text-[11px] font-mono text-brand">
									{p.name}
								</code>
								<span className="text-xs text-fg-muted">{p.desc}</span>
							</div>
						))}
					</div>
				</DocExampleClient>
			</DocSection>

			{/* get_rules */}
			<DocSection id="tool-get-rules" title="get_rules">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne les conventions de code non négociables : architecture (Server Components par
						défaut), formulaires (react-hook-form + zod), les 4 états obligatoires, et les
						conventions d'import. Source :{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">ai/rules.md</code>.
					</p>
				</div>

				<DocExampleClient
					title="Contenu"
					description="Les règles que l'IA doit respecter pour générer du code conforme."
					code={examples[5].code}
					highlightedCode={html("tool-get-rules")}
				>
					<div className="space-y-2">
						<p className="text-xs font-medium text-fg">Points couverts</p>
						<div className="grid gap-2 sm:grid-cols-2">
							{[
								"Server Components par défaut",
								"react-hook-form + zod toujours",
								"4 états : loading, empty, error, success",
								"Imports : @blazz/ui/components/...",
								"render prop (pas asChild)",
								"Select avec items obligatoire",
							].map((rule) => (
								<div key={rule} className="flex items-center gap-2">
									<span className="size-1.5 shrink-0 rounded-full bg-brand" />
									<span className="text-xs text-fg-muted">{rule}</span>
								</div>
							))}
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* get_design_principles */}
			<DocSection id="tool-get-design-principles" title="get_design_principles">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne les principes de design du kit : ratio data-ink de Tufte, lois de Gestalt,
						densité enterprise, échelle de 4px, typographie Inter, couleurs sémantiques. Source :{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">ai/design.md</code>.
					</p>
				</div>

				<DocExampleClient
					title="Contenu"
					description="Les principes que l'IA utilise pour prendre des décisions visuelles."
					code={examples[6].code}
					highlightedCode={html("tool-get-design")}
				>
					<div className="space-y-2">
						<p className="text-xs font-medium text-fg">Principes couverts</p>
						<div className="grid gap-2 sm:grid-cols-2">
							{[
								"Data-ink ratio (Tufte)",
								"Gestalt : proximité, similarité",
								"Densité : 13px, 40px rows",
								"Espacement : échelle de 4px",
								"Typographie : Inter, 3 niveaux",
								"Couleurs : sémantiques uniquement",
							].map((p) => (
								<div key={p} className="flex items-center gap-2">
									<span className="size-1.5 shrink-0 rounded-full bg-brand" />
									<span className="text-xs text-fg-muted">{p}</span>
								</div>
							))}
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* get_tokens */}
			<DocSection id="tool-get-tokens" title="get_tokens">
				<div className="space-y-2 text-sm text-fg-secondary leading-relaxed">
					<p>
						Retourne le fichier{" "}
						<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono">tokens.css</code>{" "}
						complet avec les 25 tokens oklch pour les thèmes light et dark. L'IA les utilise pour
						appliquer les bonnes variables CSS au lieu de hardcoder des couleurs.
					</p>
				</div>

				<DocExampleClient
					title="Exemple de tokens"
					description="Variables CSS en oklch pour surfaces, textes, bordures et accents."
					code={examples[7].code}
					highlightedCode={html("tool-get-tokens")}
				>
					<div className="grid gap-3 sm:grid-cols-3">
						{[
							{ label: "Surfaces", tokens: ["--app", "--surface", "--raised"] },
							{ label: "Textes", tokens: ["--fg", "--fg-secondary", "--fg-muted"] },
							{ label: "Accents", tokens: ["--brand", "--info", "--success"] },
						].map((group) => (
							<div key={group.label} className="space-y-1.5">
								<p className="text-[11px] font-medium text-fg uppercase tracking-wider">
									{group.label}
								</p>
								{group.tokens.map((t) => (
									<code key={t} className="block text-xs font-mono text-fg-muted">
										{t}
									</code>
								))}
							</div>
						))}
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Workflow */}
			<DocSection id="workflow" title="Workflow type">
				<div className="space-y-4 text-sm text-fg-secondary leading-relaxed">
					<p>
						Voici comment un assistant AI utilise le MCP en pratique. Les tools sont appelées{" "}
						<strong className="text-fg">automatiquement</strong> par l'IA — tu n'as pas besoin de
						les invoquer manuellement.
					</p>
				</div>

				<DocExampleClient
					title="Conversation type"
					description="L'IA combine les tools pour générer du code conforme au design system."
					code={examples[8].code}
					highlightedCode={html("workflow-example")}
				>
					<div className="space-y-3">
						{[
							{ step: "1", label: "get_rules", desc: "Charger les conventions au démarrage" },
							{ step: "2", label: "get_pattern", desc: "Obtenir le skeleton de la page demandée" },
							{
								step: "3",
								label: "get_component",
								desc: "Récupérer les props des composants utilisés",
							},
							{ step: "4", label: "get_tokens", desc: "Vérifier les tokens pour le styling" },
						].map((s) => (
							<div key={s.step} className="flex items-start gap-3">
								<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
									{s.step}
								</span>
								<div className="space-y-0.5">
									<code className="text-xs font-mono text-brand">{s.label}</code>
									<p className="text-xs text-fg-muted">{s.desc}</p>
								</div>
							</div>
						))}
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Compatibilité */}
			<DocSection id="compatibilite" title="Compatibilité">
				<div className="overflow-hidden rounded-lg border border-container">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-separator bg-raised/50">
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Client</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Config</th>
								<th className="px-4 py-2.5 text-left text-xs font-medium text-fg-muted">Statut</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-separator">
							{[
								{ client: "Claude Code", config: ".claude/mcp.json", status: "Supporté" },
								{
									client: "Claude Desktop",
									config: "claude_desktop_config.json",
									status: "Supporté",
								},
								{ client: "Cursor", config: ".cursor/mcp.json", status: "Supporté" },
								{ client: "Windsurf", config: ".windsurf/mcp.json", status: "Supporté" },
								{ client: "Continue", config: ".continue/config.json", status: "Supporté" },
							].map((row) => (
								<tr key={row.client}>
									<td className="px-4 py-2 text-xs font-medium text-fg">{row.client}</td>
									<td className="px-4 py-2">
										<code className="text-xs font-mono text-fg-muted">{row.config}</code>
									</td>
									<td className="px-4 py-2">
										<div className="flex items-center gap-1.5">
											<span className="size-1.5 rounded-full bg-success" />
											<span className="text-xs text-fg-muted">{row.status}</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Voir aussi">
				<DocRelated
					items={[
						{
							title: "Colors",
							href: "/docs/components/colors",
							description: "Palette de tokens oklch et leurs classes Tailwind.",
						},
						{
							title: "Inset",
							href: "/docs/components/layout/inset",
							description: "Le token unique pour le padding des containers.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description: "Le composant DataTable documenté via le MCP.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
