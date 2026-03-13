import { Button } from "@blazz/ui/components/ui/button"
import { toast, toastProgress } from "@blazz/ui/components/ui/toast"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "setup",
		code: `// 1. Dans le layout racine
import { Toaster } from "@blazz/ui"

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

// 2. N'importe où dans l'app
import { toast } from "@blazz/ui"

toast("Message envoyé")`,
	},
	{
		key: "default",
		code: `import { toast } from "@blazz/ui"

toast("Fichier sauvegardé")`,
	},
	{
		key: "types",
		code: `import { toast } from "@blazz/ui"

toast.success("Client créé avec succès")
toast.error("Une erreur est survenue")
toast.warning("Quota presque atteint")
toast.info("Mise à jour disponible")`,
	},
	{
		key: "description",
		code: `import { toast } from "@blazz/ui"

toast.success("Facture générée", {
  description: "La facture FA-2024-042 a été envoyée par email.",
})`,
	},
	{
		key: "promise",
		code: `import { toast } from "@blazz/ui"

toast.promise(saveClient(data), {
  loading: "Enregistrement en cours…",
  success: "Client enregistré",
  error: "Impossible d'enregistrer le client",
})`,
	},
	{
		key: "dismiss",
		code: `import { toast } from "@blazz/ui"

// Toast persistant
const id = toast.loading("Import en cours…")

// Plus tard, après l'opération
toast.dismiss(id)

// Ou remplacer par un succès
toast.success("Import terminé", { id })`,
	},
	{
		key: "progress-types",
		code: `import { toastProgress } from "@blazz/ui"

toastProgress.success("Données sauvegardées", {
  description: "Toutes les modifications ont été appliquées.",
})
toastProgress.error("Échec de l'opération", {
  description: "Impossible de joindre le serveur.",
})
toastProgress.warning("Quota presque atteint", {
  description: "Il vous reste 5% d'espace disponible.",
})
toastProgress.info("Nouvelle version disponible", {
  description: "Rechargez la page pour profiter des dernières fonctionnalités.",
})`,
	},
	{
		key: "progress-options",
		code: `import { toastProgress } from "@blazz/ui"

// Barre seule (sans texte de countdown)
toastProgress.success("Sauvegarde terminée", {
  showCountdown: false,
})

// Countdown seul (sans barre)
toastProgress.info("Redirection dans quelques secondes…", {
  showProgress: false,
  duration: 8000,
})

// Durée personnalisée
toastProgress.warning("Session expire bientôt", {
  description: "Vous serez déconnecté automatiquement.",
  duration: 10000,
})`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/toast")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ToastPage,
})

const toc = [
	{ id: "setup", title: "Setup" },
	{ id: "examples", title: "Examples" },
	{ id: "progress", title: "toastProgress" },
	{ id: "props", title: "Toaster Props" },
	{ id: "api", title: "toast() API" },
	{ id: "progress-api", title: "toastProgress Options" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const toasterProps: DocProp[] = [
	{
		name: "position",
		type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
		default: '"bottom-right"',
		description: "Position des toasts à l'écran.",
	},
	{
		name: "theme",
		type: '"light" | "dark" | "system"',
		default: '"system"',
		description:
			"Thème des toasts. Passer resolvedTheme de next-themes pour synchroniser avec le thème de l'app.",
	},
	{
		name: "richColors",
		type: "boolean",
		default: "true",
		description: "Active les couleurs sémantiques renforcées pour success, error, warning, info.",
	},
	{
		name: "expand",
		type: "boolean",
		default: "false",
		description: "Expand toasts par défaut au lieu de les empiler.",
	},
	{
		name: "visibleToasts",
		type: "number",
		default: "3",
		description: "Nombre maximum de toasts visibles simultanément.",
	},
	{
		name: "closeButton",
		type: "boolean",
		default: "false",
		description: "Affiche un bouton de fermeture sur chaque toast.",
	},
	{
		name: "duration",
		type: "number",
		default: "4000",
		description: "Durée d'affichage en millisecondes.",
	},
	{
		name: "offset",
		type: "number | string",
		default: "16",
		description: "Distance par rapport aux bords de l'écran.",
	},
	{
		name: "gap",
		type: "number",
		default: "8",
		description: "Espacement entre les toasts empilés.",
	},
]

const toastProgressProps: DocProp[] = [
	{
		name: "description",
		type: "string",
		description: "Texte secondaire sous le titre.",
	},
	{
		name: "duration",
		type: "number",
		default: "5000",
		description: "Durée d'affichage en millisecondes. Contrôle aussi la vitesse de la barre.",
	},
	{
		name: "showProgress",
		type: "boolean",
		default: "true",
		description: "Affiche la barre de progression qui se réduit jusqu'à la disparition.",
	},
	{
		name: "showCountdown",
		type: "boolean",
		default: "true",
		description: 'Affiche le texte "Dismissing in X seconds" sous le message.',
	},
]

const toastApiProps: DocProp[] = [
	{
		name: "toast(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast neutre par défaut.",
	},
	{
		name: "toast.success(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast de succès (fond vert).",
	},
	{
		name: "toast.error(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast d'erreur (fond rouge).",
	},
	{
		name: "toast.warning(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast d'avertissement (fond ambre).",
	},
	{
		name: "toast.info(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast d'information (fond bleu).",
	},
	{
		name: "toast.loading(message)",
		type: "(message: string, options?) => string | number",
		description: "Toast avec spinner de chargement. Persistant jusqu'à dismiss().",
	},
	{
		name: "toast.promise(promise, messages)",
		type: "(promise: Promise, { loading, success, error }) => string | number",
		description: "Gère automatiquement les états loading → success/error.",
	},
	{
		name: "toast.dismiss(id?)",
		type: "(id?: string | number) => void",
		description: "Ferme un toast par son ID, ou tous les toasts si aucun ID.",
	},
]

function ToastPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	function handlePromise() {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
			loading: "Enregistrement en cours…",
			success: "Client enregistré",
			error: "Impossible d'enregistrer",
		})
	}

	return (
		<DocPage
			title="Toast"
			subtitle="Notifications temporaires déclenchées de manière impérative. Idéal pour le feedback après une action utilisateur."
			toc={toc}
		>
			<DocHero>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm" onClick={() => toast("Fichier sauvegardé")}>
						Default
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => toast.success("Client créé avec succès")}
					>
						Success
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => toast.error("Une erreur est survenue")}
					>
						Error
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => toast.warning("Quota presque atteint")}
					>
						Warning
					</Button>
					<Button variant="outline" size="sm" onClick={() => toast.info("Mise à jour disponible")}>
						Info
					</Button>
				</div>
			</DocHero>

			<DocSection id="setup" title="Setup">
				<DocExampleClient
					title="Installation"
					description="Placer <Toaster /> dans le layout racine une seule fois. Ensuite, appeler toast() depuis n'importe quel composant."
					code={examples[0].code}
					highlightedCode={html("setup")}
				>
					<p className="text-sm text-fg-muted">
						Le composant <code className="text-xs bg-raised px-1 py-0.5 rounded">Toaster</code> est
						déjà présent dans ce layout — essaie les boutons ci-dessous.
					</p>
				</DocExampleClient>
			</DocSection>

			<DocSection id="progress" title="toastProgress">
				<DocExampleClient
					title="Types sémantiques"
					description="Même API que toast — remplace toast.success() par toastProgress.success() pour obtenir la barre et le countdown automatiquement."
					code={examples[6].code}
					highlightedCode={html("progress-types")}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.success("Données sauvegardées", {
									description: "Toutes les modifications ont été appliquées.",
								})
							}
						>
							Success
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.error("Échec de l'opération", {
									description: "Impossible de joindre le serveur.",
								})
							}
						>
							Error
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.warning("Quota presque atteint", {
									description: "Il vous reste 5% d'espace disponible.",
								})
							}
						>
							Warning
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.info("Nouvelle version disponible", {
									description: "Rechargez la page pour profiter des dernières fonctionnalités.",
								})
							}
						>
							Info
						</Button>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Options"
					description="showProgress et showCountdown sont indépendants. duration contrôle à la fois la durée d'affichage et la vitesse de la barre."
					code={examples[7].code}
					highlightedCode={html("progress-options")}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.success("Sauvegarde terminée", {
									showCountdown: false,
								})
							}
						>
							Barre seule
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.info("Redirection dans quelques secondes…", {
									showProgress: false,
									duration: 8000,
								})
							}
						>
							Countdown seul
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toastProgress.warning("Session expire bientôt", {
									description: "Vous serez déconnecté automatiquement.",
									duration: 10000,
								})
							}
						>
							10 secondes
						</Button>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="Toast neutre pour les messages simples."
					code={examples[1].code}
					highlightedCode={html("default")}
				>
					<Button variant="outline" size="sm" onClick={() => toast("Fichier sauvegardé")}>
						Afficher le toast
					</Button>
				</DocExampleClient>

				<DocExampleClient
					title="Types sémantiques"
					description="Utilise success, error, warning et info pour transmettre le statut de l'opération."
					code={examples[2].code}
					highlightedCode={html("types")}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => toast.success("Client créé avec succès")}
						>
							Success
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => toast.error("Une erreur est survenue")}
						>
							Error
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => toast.warning("Quota presque atteint")}
						>
							Warning
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => toast.info("Mise à jour disponible")}
						>
							Info
						</Button>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Avec description"
					description="Ajoute un sous-texte pour donner plus de contexte."
					code={examples[3].code}
					highlightedCode={html("description")}
				>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							toast.success("Facture générée", {
								description: "La facture FA-2024-042 a été envoyée par email.",
							})
						}
					>
						Afficher le toast
					</Button>
				</DocExampleClient>

				<DocExampleClient
					title="Promise"
					description="Gère automatiquement les états loading → success/error d'une promesse."
					code={examples[4].code}
					highlightedCode={html("promise")}
				>
					<Button variant="outline" size="sm" onClick={handlePromise}>
						Lancer la promesse
					</Button>
				</DocExampleClient>

				<DocExampleClient
					title="Dismiss"
					description="Contrôle la durée de vie d'un toast via son ID retourné."
					code={examples[5].code}
					highlightedCode={html("dismiss")}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const id = toast.loading("Import en cours…")
								setTimeout(() => toast.success("Import terminé", { id }), 2500)
							}}
						>
							Loading → Success
						</Button>
						<Button variant="outline" size="sm" onClick={() => toast.dismiss()}>
							Tout fermer
						</Button>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Toaster Props">
				<p className="text-sm text-fg-muted mb-4">
					Le composant <code className="text-xs bg-raised px-1 py-0.5 rounded">Toaster</code> de{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">@blazz/ui</code> pre-configure les
					valeurs optimales pour le design system. Toutes les props peuvent être surchargées.
				</p>
				<DocPropsTable props={toasterProps} />
			</DocSection>

			<DocSection id="api" title="toast() API">
				<DocPropsTable props={toastApiProps} />
			</DocSection>

			<DocSection id="progress-api" title="toastProgress Options">
				<p className="text-sm text-fg-muted mb-4">
					Options passées en second argument de{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">toastProgress.success()</code> et
					ses variantes. Les méthodes disponibles sont{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">.success()</code>,{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">.error()</code>,{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">.warning()</code>,{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">.info()</code> et{" "}
					<code className="text-xs bg-raised px-1 py-0.5 rounded">.default()</code>.
				</p>
				<DocPropsTable props={toastProgressProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Placer {"<Toaster />"} une seule fois dans le layout racine</li>
					<li>
						Utiliser <code className="text-xs">toast.promise()</code> pour les opérations async —
						évite de gérer manuellement les états
					</li>
					<li>
						Toujours utiliser les variants sémantiques (success, error, warning) plutôt que le toast
						neutre pour les retours d'actions
					</li>
					<li>Garder les messages courts — max 60 caractères pour le titre</li>
					<li>
						Pour les alertes persistantes inline (non temporaires), utiliser{" "}
						<code className="text-xs">Alert</code> à la place
					</li>
					<li>
						Passer <code className="text-xs">theme={"{resolvedTheme}"}</code> depuis next-themes
						pour synchroniser avec le thème de l'app
					</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Alert",
							href: "/docs/components/ui/alert",
							description: "Messages inline persistants dans le contenu.",
						},
						{
							title: "Banner",
							href: "/docs/components/ui/banner",
							description: "Notifications pleine largeur au niveau de la page.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Confirmation modale pour les actions critiques.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
