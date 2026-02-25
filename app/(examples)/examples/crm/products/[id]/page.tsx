"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { toast } from "sonner"
import {
	Edit,
	Copy,
	Trash2,
	Archive,
	ChevronDown,
	Package,
	ImageOff,
	Layers,
	Plus,
	Upload,
	ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { FieldGrid, Field } from "@/components/blocks/field-grid"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardAction,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Empty } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { products, formatCurrency, formatDate } from "@/lib/sample-data"

// ---------------------------------------------------------------------------
// Permission helpers — in real app, comes from auth context / server
// ---------------------------------------------------------------------------

type Permission = "read" | "update"

function usePermissions(): { permissions: Permission[] } {
	// Simulated — toggle to "read" only to see the READ-only mode
	return { permissions: ["read", "update"] }
}

// ---------------------------------------------------------------------------
// Status mappings
// ---------------------------------------------------------------------------

const statusConfig: Record<
	string,
	{ label: string; variant: "success" | "outline" | "critical" }
> = {
	active: { label: "Actif", variant: "success" },
	inactive: { label: "Inactif", variant: "outline" },
	discontinued: { label: "Arrêté", variant: "critical" },
}

// ---------------------------------------------------------------------------
// Extended product data (simulating the full PIM data from the screenshot)
// ---------------------------------------------------------------------------

interface ProductExtended {
	code: string
	pole: string
	famille: string
	sousFamille: string | null
	marque: string
	paysOrigine: string | null
	// Taxes
	tvaVente: string | null
	tvaAchat: string | null
	taxesSpecifiques: { label: string; montant: string }[]
	// Logistique
	emplacement: string | null
	tracabilite: boolean
	dureeVie: string | null
	categorieFleg: string | null
	calibreFleg: string | null
	// Unites
	uniteAchat: string | null
	uniteVente: string | null
	uniteStock: string | null
	contenance: string | null
	// Poids & dimensions
	poidsNet: string | null
	poidsBrut: string | null
	poidsVariable: boolean
	peseCaisse: boolean
	longueur: string | null
	largeur: string | null
	hauteur: string | null
	// Certifications
	certifications: string[]
	// Notes
	notesInternes: string | null
	// Variantes
	variantes: { id: string; nom: string; sku: string; prix: number }[]
	optionsDeclinaison: string | null
}

// Simulated extra data per product
const extendedData: Record<string, ProductExtended> = {
	p1: {
		code: "BOI-003",
		pole: "Boissons",
		famille: "Jus de fruits",
		sousFamille: null,
		marque: "Coca-Cola",
		paysOrigine: null,
		tvaVente: null,
		tvaAchat: null,
		taxesSpecifiques: [
			{ label: "Taxe sur les boissons sucrées", montant: "0.7000 EUR" },
		],
		emplacement: null,
		tracabilite: false,
		dureeVie: "365 jours",
		categorieFleg: null,
		calibreFleg: null,
		uniteAchat: null,
		uniteVente: null,
		uniteStock: null,
		contenance: null,
		poidsNet: null,
		poidsBrut: null,
		poidsVariable: false,
		peseCaisse: false,
		longueur: null,
		largeur: null,
		hauteur: null,
		certifications: [],
		notesInternes: null,
		variantes: [],
		optionsDeclinaison: null,
	},
}

function getExtendedData(productId: string): ProductExtended {
	return (
		extendedData[productId] ?? {
			code: "N/A",
			pole: "—",
			famille: "—",
			sousFamille: null,
			marque: "—",
			paysOrigine: null,
			tvaVente: null,
			tvaAchat: null,
			taxesSpecifiques: [],
			emplacement: null,
			tracabilite: false,
			dureeVie: null,
			categorieFleg: null,
			calibreFleg: null,
			uniteAchat: null,
			uniteVente: null,
			uniteStock: null,
			contenance: null,
			poidsNet: null,
			poidsBrut: null,
			poidsVariable: false,
			peseCaisse: false,
			longueur: null,
			largeur: null,
			hauteur: null,
			certifications: [],
			notesInternes: null,
			variantes: [],
			optionsDeclinaison: null,
		}
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const product = products.find((p) => p.id === id)

	if (!product) notFound()

	const { permissions } = usePermissions()
	const canEdit = permissions.includes("update")
	const ext = getExtendedData(product.id)
	const status = statusConfig[product.status] ?? statusConfig.inactive

	return (
		<div className="p-6 space-y-6">
			{/* ── Header: breadcrumbs + title + badge + actions ── */}
			<PageHeader
				title={product.name}
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Produits", href: "/examples/crm/products" },
					{ label: product.name },
				]}
				className="pb-0"
			/>

			<div className="flex items-start justify-between gap-4">
				<Badge variant={status.variant}>{status.label}</Badge>

				{canEdit && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								toast.success(`${product.name} publié`)
							}
						>
							Publier
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="outline" size="sm">
										Autres actions
										<ChevronDown
											className="size-3.5"
											data-icon="inline-end"
										/>
									</Button>
								}
							/>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() =>
										toast.success("Produit dupliqué")
									}
								>
									<Copy className="size-4" />
									Dupliquer
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										toast.success("Produit archivé")
									}
								>
									<Archive className="size-4" />
									Archiver
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-negative"
									onClick={() =>
										toast.error("Produit supprimé")
									}
								>
									<Trash2 className="size-4" />
									Supprimer
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
			</div>

			{/* ── KPI Strip ── */}
			<StatsStrip
				stats={[
					{
						label: "Prix unitaire",
						value: formatCurrency(product.unitPrice, product.currency),
					},
					{
						label: "Stock",
						value: `${product.stock} unités`,
						chart: [12, 18, 15, 22, 30, 28, product.stock > 100 ? 35 : 8],
					},
					{ label: "Catégorie", value: product.category },
					{ label: "SKU", value: product.sku },
				]}
			/>

			{/* ── Tabs ── */}
			<Tabs defaultValue="general">
				<TabsList variant="line">
					<TabsTrigger value="general">Général</TabsTrigger>
					<TabsTrigger value="achats">Achats</TabsTrigger>
					<TabsTrigger value="tarifs">Tarifs</TabsTrigger>
					<TabsTrigger value="promotions">Promotions</TabsTrigger>
					<TabsTrigger value="stock">Stock</TabsTrigger>
				</TabsList>

				{/* ── Tab: Général ── */}
				<TabsContent value="general">
					<div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-3">
						{/* ---- Main column (2/3) ---- */}
						<div className="space-y-6 lg:col-span-2">
							{/* Informations produit */}
							<Card>
								<CardHeader>
									<CardTitle>Informations de base</CardTitle>
									{canEdit && (
										<CardAction>
											<Button
												variant="ghost"
												size="xs"
												onClick={() =>
													toast.info("Ouvrir éditeur")
												}
											>
												<Edit
													className="size-3.5"
													data-icon="inline-start"
												/>
												Modifier
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent>
									<FieldGrid columns={3}>
										<Field label="Code" value={ext.code} />
										<Field label="Nom" value={product.name} />
										<Field
											label="Description"
											value={product.description}
											span={3}
										/>
										<Field label="Pôle" value={ext.pole} />
										<Field label="Famille" value={ext.famille} />
										<Field
											label="Sous-famille"
											value={ext.sousFamille ?? "—"}
										/>
										<Field label="Marque" value={ext.marque} />
										<Field
											label="Pays d'origine"
											value={ext.paysOrigine ?? "—"}
										/>
									</FieldGrid>
								</CardContent>
							</Card>

							{/* Images */}
							<Card>
								<CardHeader>
									<CardTitle>Images</CardTitle>
									{canEdit && (
										<CardAction>
											<Button variant="ghost" size="xs">
												<Upload
													className="size-3.5"
													data-icon="inline-start"
												/>
												Ajouter
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent>
									<Empty
										size="sm"
										icon={ImageOff}
										title="Aucune image"
										description="Ajoutez des photos pour illustrer ce produit"
										action={
											canEdit
												? {
														label: "Importer des images",
														icon: Upload,
														onClick: () =>
															toast.info(
																"Ouverture upload..."
															),
													}
												: undefined
										}
									/>
								</CardContent>
							</Card>

							{/* Variantes & Déclinaisons (merged) */}
							<Card>
								<CardHeader>
									<CardTitle>
										Variantes & Déclinaisons
									</CardTitle>
									{canEdit && (
										<CardAction>
											<Button variant="ghost" size="xs">
												<Plus
													className="size-3.5"
													data-icon="inline-start"
												/>
												Créer
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent>
									{ext.optionsDeclinaison ? (
										<p className="text-sm text-fg-muted mb-4">
											{ext.optionsDeclinaison}
										</p>
									) : (
										<p className="text-xs text-fg-muted mb-4">
											Les options permettent de définir des
											attributs personnalisés sur chaque
											variante (ex: taille, couleur).
										</p>
									)}
									<Separator />
									{ext.variantes.length > 0 ? (
										<div className="divide-y mt-2">
											{ext.variantes.map((v) => (
												<div
													key={v.id}
													className="flex items-center justify-between py-2.5"
												>
													<div>
														<p className="text-sm font-medium">
															{v.nom}
														</p>
														<p className="text-xs text-fg-muted">
															{v.sku}
														</p>
													</div>
													<span className="text-sm font-semibold">
														{formatCurrency(v.prix)}
													</span>
												</div>
											))}
										</div>
									) : (
										<Empty
											size="sm"
											icon={Layers}
											title="Aucune variante"
											description="Créez des variantes pour gérer différentes déclinaisons"
										/>
									)}
								</CardContent>
							</Card>

							{/* Caractéristiques physiques (merged: Unités + Poids) */}
							<Card>
								<CardHeader>
									<CardTitle>
										Caractéristiques physiques
									</CardTitle>
									{canEdit && (
										<CardAction>
											<Button
												variant="ghost"
												size="xs"
												onClick={() =>
													toast.info("Ouvrir éditeur")
												}
											>
												<Edit
													className="size-3.5"
													data-icon="inline-start"
												/>
												Modifier
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Unites */}
									<div>
										<h4 className="text-xs font-medium text-fg-muted uppercase tracking-wider mb-3">
											Unités et conditionnement
										</h4>
										<FieldGrid columns={4}>
											<Field
												label="Unité d'achat"
												value={ext.uniteAchat ?? "—"}
											/>
											<Field
												label="Unité de vente"
												value={ext.uniteVente ?? "—"}
											/>
											<Field
												label="Unité de stock"
												value={ext.uniteStock ?? "—"}
											/>
											<Field
												label="Contenance"
												value={ext.contenance ?? "—"}
											/>
										</FieldGrid>
									</div>

									<Separator />

									{/* Poids & dimensions */}
									<div>
										<h4 className="text-xs font-medium text-fg-muted uppercase tracking-wider mb-3">
											Poids et dimensions
										</h4>
										<FieldGrid columns={4}>
											<Field
												label="Poids net"
												value={ext.poidsNet ?? "—"}
											/>
											<Field
												label="Poids brut"
												value={ext.poidsBrut ?? "—"}
											/>
											<Field
												label="Poids variable"
												value={
													ext.poidsVariable
														? "Oui"
														: "Non"
												}
											/>
											<Field
												label="Pesé en caisse"
												value={
													ext.peseCaisse
														? "Oui"
														: "Non"
												}
											/>
											<Field
												label="Longueur"
												value={ext.longueur ?? "—"}
											/>
											<Field
												label="Largeur"
												value={ext.largeur ?? "—"}
											/>
											<Field
												label="Hauteur"
												value={ext.hauteur ?? "—"}
											/>
										</FieldGrid>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* ---- Sidebar (1/3) ---- */}
						<div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
							{/* Taxes */}
							<Card>
								<CardHeader>
									<CardTitle>Taxes</CardTitle>
									{canEdit && (
										<CardAction>
											<Button
												variant="ghost"
												size="xs"
												onClick={() =>
													toast.info("Gérer les taxes")
												}
											>
												<Edit className="size-3.5" data-icon="inline-start" />
												Modifier
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent className="space-y-4">
									<FieldGrid columns={2}>
										<Field
											label="TVA vente"
											value={ext.tvaVente ?? "—"}
										/>
										<Field
											label="TVA achat"
											value={ext.tvaAchat ?? "—"}
										/>
									</FieldGrid>

									{ext.taxesSpecifiques.length > 0 && (
										<div>
											<p className="text-xs text-fg-muted mb-2">
												Taxes spécifiques
											</p>
											<div className="divide-y">
												{ext.taxesSpecifiques.map(
													(t, i) => (
														<div
															key={i}
															className="flex items-center justify-between py-2"
														>
															<span className="text-sm">
																{t.label}
															</span>
															<span className="text-sm font-medium tabular-nums">
																{t.montant}
															</span>
														</div>
													)
												)}
											</div>
											{canEdit && (
												<Button
													variant="link"
													size="xs"
													className="mt-2 px-0"
													onClick={() =>
														toast.info(
															"Gérer les taxes spécifiques"
														)
													}
												>
													Gérer les taxes spécifiques
												</Button>
											)}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Logistique */}
							<Card>
								<CardHeader>
									<CardTitle>Logistique</CardTitle>
									{canEdit && (
										<CardAction>
											<Button
												variant="ghost"
												size="xs"
												onClick={() =>
													toast.info("Modifier logistique")
												}
											>
												<Edit className="size-3.5" data-icon="inline-start" />
												Modifier
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent>
									<FieldGrid columns={1}>
										<Field
											label="Emplacement"
											value={ext.emplacement ?? "—"}
										/>
										<Field
											label="Traçabilité DLC/Lot"
											value={
												ext.tracabilite ? "Oui" : "Non"
											}
										/>
										<Field
											label="Durée de vie"
											value={ext.dureeVie ?? "—"}
										/>
										<Field
											label="Catégorie FLEG"
											value={ext.categorieFleg ?? "—"}
										/>
										<Field
											label="Calibre FLEG"
											value={ext.calibreFleg ?? "—"}
										/>
									</FieldGrid>
								</CardContent>
							</Card>

							{/* Certifications */}
							<Card>
								<CardHeader>
									<CardTitle>Certifications</CardTitle>
								</CardHeader>
								<CardContent>
									{ext.certifications.length > 0 ? (
										<div className="flex flex-wrap gap-2">
											{ext.certifications.map((c) => (
												<Badge
													key={c}
													variant="outline"
												>
													{c}
												</Badge>
											))}
										</div>
									) : (
										<Empty
											size="sm"
											icon={ShieldCheck}
											title="Aucune certification"
											action={
												canEdit
													? {
															label: "Gérer les certifications",
															onClick: () =>
																toast.info(
																	"Gérer certifications"
																),
														}
													: undefined
											}
										/>
									)}
								</CardContent>
							</Card>

							{/* Notes internes */}
							<Card>
								<CardHeader>
									<CardTitle>Notes internes</CardTitle>
									{canEdit && (
										<CardAction>
											<Button
												variant="ghost"
												size="xs"
												onClick={() =>
													toast.info(
														"Modifier les notes"
													)
												}
											>
												<Edit className="size-3.5" data-icon="inline-start" />
												Modifier
											</Button>
										</CardAction>
									)}
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">
										{ext.notesInternes ?? "—"}
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</TabsContent>

				{/* ── Placeholder tabs ── */}
				<TabsContent value="achats">
					<div className="pt-4">
						<Card>
							<CardContent>
								<Empty
									icon={Package}
									title="Achats"
									description="Les informations d'achat seront disponibles ici : fournisseurs, prix d'achat, historique commandes."
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="tarifs">
					<div className="pt-4">
						<Card>
							<CardContent>
								<Empty
									icon={Package}
									title="Tarifs"
									description="Grilles tarifaires, remises par volume et conditions spéciales."
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="promotions">
					<div className="pt-4">
						<Card>
							<CardContent>
								<Empty
									icon={Package}
									title="Promotions"
									description="Promotions actives et planifiées pour ce produit."
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="stock">
					<div className="pt-4">
						<Card>
							<CardContent>
								<Empty
									icon={Package}
									title="Stock"
									description="Niveaux de stock, mouvements et alertes de réapprovisionnement."
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
