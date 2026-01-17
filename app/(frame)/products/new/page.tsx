"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, ChevronDown, Tag, Store, Info, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, Field, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Page } from "@/components/ui/page"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { TagsInput } from "@/components/ui/tags-input"
import { ImageUpload } from "@/components/features/image-upload/image-upload"
import { productSchema, type ProductFormValues } from "@/types/product"
import type { UploadedImage } from "@/types/product"

// Mock data
const mockCategories = [
	{
		value: "snowboard-ski",
		label: "Planches de snowboard dans Ski et snowboard",
		suggested: true,
	},
	{
		value: "ski-equipment",
		label: "Équipement de ski",
		suggested: false,
	},
]

const mockCollections = [
	{ value: "winter", label: "Winter Collection" },
	{ value: "sports", label: "Sports Equipment" },
	{ value: "featured", label: "Featured Items" },
]

const mockStatuses = [
	{ value: "draft", label: "Brouillon" },
	{ value: "active", label: "Actif" },
	{ value: "archived", label: "Archivé" },
]

export default function ProductNewPage() {
	const [images, setImages] = React.useState<UploadedImage[]>([])

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			title: "",
			description: "",
			category: "",
			pricing: {
				price: 0,
				taxable: true,
			},
			inventory: {
				tracked: false,
			},
			shipping: {
				weightUnit: "kg",
				weight: 0,
				isPhysical: true,
			},
			status: "draft",
			tags: [],
			collections: [],
			organization: {
				type: "",
				vendor: "",
			},
		},
	})

	const onSubmit = (data: ProductFormValues) => {
		console.log("Form data:", data)
		console.log("Images:", images)
		// UI only - no backend
	}

	const watchInventoryTracked = form.watch("inventory.tracked")
	const watchCategory = form.watch("category")
	const selectedCategory = mockCategories.find((c) => c.value === watchCategory)

	const breadcrumb = (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/products">
						<Tag className="h-4 w-4" />
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage className="flex items-center gap-2">
						Ajouter un produit
						<Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
							Brouillon
						</Badge>
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	)

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Page
					breadcrumbs={breadcrumb}
					narrowWidth
					primaryAction={
						<div className="flex gap-2">
							<Button variant="outline" type="button">
								<Copy className="h-4 w-4 mr-2" />
								Dupliquer
							</Button>
							<Button variant="outline" type="button">
								Prévisualiser
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger
									className={cn(buttonVariants({ variant: "outline" }))}
									type="button"
								>
									Autres actions
									<ChevronDown className="ml-2 h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>Archiver le produit</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">Supprimer le produit</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					}
				>
					<div className="grid gap-4 md:grid-cols-3">
						{/* Colonne Gauche */}
						<div className="md:col-span-2 space-y-4">
							{/* Carte Titre */}
							<Card>
								<CardHeader>
									<CardTitle>Titre</CardTitle>
								</CardHeader>
								<CardContent>
									<Field
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input placeholder="Short sleeve t-shirt" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Carte Description */}
							<Card>
								<CardHeader>
									<CardTitle>Description</CardTitle>
								</CardHeader>
								<CardContent>
									<Field
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea placeholder="Décrivez votre produit..." rows={6} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Carte Supports Multimédias */}
							<Card>
								<CardHeader>
									<CardTitle>Supports multimédias</CardTitle>
								</CardHeader>
								<CardContent>
									<ImageUpload
										images={images}
										onImagesChange={setImages}
										maxFiles={10}
										maxSize={5 * 1024 * 1024}
									/>
								</CardContent>
							</Card>

							{/* Carte Catégorie */}
							<Card>
								<CardHeader>
									<CardTitle>Catégorie</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<Combobox
										value={watchCategory}
										onValueChange={(value) => form.setValue("category", value)}
										options={mockCategories}
										placeholder="Choisir une catégorie de produits"
										searchPlaceholder="Rechercher une catégorie..."
									/>
									{selectedCategory?.suggested && (
										<div className="flex items-center gap-2 text-sm">
											<span className="text-muted-foreground">{selectedCategory.label}</span>
											<Badge variant="outline" className="text-purple-600 border-purple-200">
												Suggéré
											</Badge>
										</div>
									)}
									<p className="text-sm text-muted-foreground">
										Détermine les taux de taxation et ajoute des champs méta pour améliorer la
										recherche, les filtres et les ventes intercanaux.
									</p>
								</CardContent>
							</Card>

							{/* Carte Prix */}
							<Card>
								<CardHeader>
									<CardTitle>Prix</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<Field
											control={form.control}
											name="pricing.price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Prix</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																type="number"
																step="0.01"
																{...field}
																onChange={(e) => field.onChange(e.target.valueAsNumber)}
															/>
															<span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
																€
															</span>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Tabs defaultValue="price" className="w-full">
											<TabsList className="grid w-full grid-cols-4">
												<TabsTrigger value="price">Prix avant réduction</TabsTrigger>
												<TabsTrigger value="unit">Prix unitaire</TabsTrigger>
												<TabsTrigger value="tax">Facturer la taxe</TabsTrigger>
												<TabsTrigger value="cost">Coût par article</TabsTrigger>
											</TabsList>
											<TabsContent value="price" className="mt-4">
												<Field
													control={form.control}
													name="pricing.compareAtPrice"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Prix avant réduction</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	step="0.01"
																	{...field}
																	onChange={(e) => field.onChange(e.target.valueAsNumber)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</TabsContent>
											<TabsContent value="unit" className="mt-4">
												<Field
													control={form.control}
													name="pricing.unitPrice"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Prix unitaire</FormLabel>
															<FormControl>
																<Input placeholder="ex: 10,00 € / kg" {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</TabsContent>
											<TabsContent value="tax" className="mt-4">
												<div className="flex items-center justify-between">
													<Label>Facturer la taxe sur ce produit</Label>
													<Switch
														checked={form.watch("pricing.taxable")}
														onCheckedChange={(checked) => form.setValue("pricing.taxable", checked)}
													/>
												</div>
											</TabsContent>
											<TabsContent value="cost" className="mt-4">
												<Field
													control={form.control}
													name="pricing.costPerItem"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Coût par article</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	step="0.01"
																	placeholder="0,00"
																	{...field}
																	onChange={(e) => field.onChange(e.target.valueAsNumber)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</TabsContent>
										</Tabs>
									</div>
								</CardContent>
							</Card>

							{/* Carte Stock */}
							<Card>
								<CardHeader>
									<CardTitle>Stock</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="space-y-0.5">
											<Label>Stock non suivi</Label>
										</div>
										<Switch
											checked={!watchInventoryTracked}
											onCheckedChange={(checked) => form.setValue("inventory.tracked", !checked)}
										/>
									</div>

									{watchInventoryTracked && (
										<>
											<Field
												control={form.control}
												name="inventory.sku"
												render={({ field }) => (
													<FormItem>
														<FormLabel>SKU</FormLabel>
														<div className="flex gap-2">
															<FormControl>
																<Input {...field} />
															</FormControl>
															<Badge
																variant="outline"
																className="shrink-0 h-8 px-3 bg-orange-50 text-orange-700 border-orange-200"
															>
																sku-untracked-1
															</Badge>
														</div>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Button variant="outline" type="button" className="w-fit">
												Code-barres
											</Button>

											<p className="text-sm">
												1 emplacement stocke ce produit :
												<Button variant="link" className="h-auto p-0 ml-1">
													Shop location
												</Button>
											</p>
										</>
									)}
								</CardContent>
							</Card>

							{/* Carte Expédition */}
							<Card>
								<CardHeader>
									<CardTitle>Expédition</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<Label>Produit physique</Label>
										<Switch
											checked={form.watch("shipping.isPhysical")}
											onCheckedChange={(checked) => form.setValue("shipping.isPhysical", checked)}
										/>
									</div>

									<div>
										<Label htmlFor="package">Emballage</Label>
										<Select defaultValue="default">
											<SelectTrigger id="package">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="default">
													Par défaut de la boutique • Boîte d'échantillons - 22 × 1
												</SelectItem>
												<SelectItem value="custom">Personnalisé</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<Field
										control={form.control}
										name="shipping.weight"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Poids du produit</FormLabel>
												<div className="flex gap-2">
													<FormControl>
														<Input
															type="number"
															step="0.01"
															defaultValue="0.0"
															className="flex-1"
															{...field}
															onChange={(e) => field.onChange(e.target.valueAsNumber)}
														/>
													</FormControl>
													<Select
														value={form.watch("shipping.weightUnit")}
														onValueChange={(value) =>
															form.setValue("shipping.weightUnit", value as "kg" | "lb")
														}
													>
														<SelectTrigger className="w-24">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="kg">kg</SelectItem>
															<SelectItem value="lb">lb</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Colonne Droite */}
						<div className="space-y-4">
							{/* Carte Statut */}
							<Card>
								<CardHeader>
									<CardTitle>Statut</CardTitle>
								</CardHeader>
								<CardContent>
									<Select
										value={form.watch("status")}
										onValueChange={(value) => form.setValue("status", value as any)}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{mockStatuses.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</CardContent>
							</Card>

							{/* Carte Publication */}
							<Card>
								<CardHeader>
									<CardTitle>Publication</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2 text-sm">
										<Store className="h-4 w-4 text-muted-foreground" />
										<span>Boutique en ligne</span>
									</div>
								</CardContent>
							</Card>

							{/* Carte Catalogues par Région */}
							<Card>
								<CardHeader>
									<CardTitle>Catalogues par région</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm">Mexico</p>
								</CardContent>
							</Card>

							{/* Carte Ventes */}
							<Card>
								<CardHeader>
									<CardTitle>Ventes</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<p className="text-sm text-muted-foreground">
										Aucune vente récente pour ce produit
									</p>
									<Button variant="link" className="h-auto p-0 text-sm" type="button">
										Afficher les détails
									</Button>
								</CardContent>
							</Card>

							{/* Carte Organisation du Produit */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										Organisation du produit
										<Info className="h-4 w-4 text-muted-foreground" />
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<Field
										control={form.control}
										name="organization.type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type</FormLabel>
												<FormControl>
													<Input placeholder="snowboard" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Field
										control={form.control}
										name="organization.vendor"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Fournisseur</FormLabel>
												<FormControl>
													<Input placeholder="blazz-develop" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Carte Collections */}
							<Card>
								<CardHeader>
									<CardTitle>Collections</CardTitle>
								</CardHeader>
								<CardContent>
									<Combobox
										value=""
										onValueChange={(value) => {
											const currentCollections = form.getValues("collections")
											if (!currentCollections.includes(value)) {
												form.setValue("collections", [...currentCollections, value])
											}
										}}
										options={mockCollections}
										placeholder="Rechercher des collections"
										searchPlaceholder="Rechercher..."
										icon={<Search className="h-4 w-4" />}
									/>
									{form.watch("collections").length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{form.watch("collections").map((collection) => (
												<Badge key={collection} variant="secondary">
													{mockCollections.find((c) => c.value === collection)?.label}
												</Badge>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Carte Balises */}
							<Card>
								<CardHeader>
									<CardTitle>Balises</CardTitle>
								</CardHeader>
								<CardContent>
									<TagsInput
										tags={form.watch("tags")}
										onTagsChange={(tags) => form.setValue("tags", tags)}
										suggestions={["Winter", "Sport", "Accessory", "Outdoor", "Premium"]}
										placeholder="Ajouter des balises..."
									/>
								</CardContent>
							</Card>

							{/* Carte Modèle de Thème */}
							<Card>
								<CardHeader>
									<CardTitle>Modèle de thème</CardTitle>
								</CardHeader>
								<CardContent>
									<Select defaultValue="default">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="default">Modèle par défaut : Produit</SelectItem>
											<SelectItem value="featured">Modèle vedette</SelectItem>
										</SelectContent>
									</Select>
								</CardContent>
							</Card>
						</div>
					</div>
				</Page>
			</form>
		</Form>
	)
}
