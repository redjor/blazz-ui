import * as z from "zod"

export const productSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	description: z.string().optional(),
	images: z.array(z.any()).optional(),
	category: z.string().optional(),
	pricing: z.object({
		price: z.number().min(0, "Le prix doit être positif"),
		compareAtPrice: z.number().optional(),
		unitPrice: z.string().optional(),
		taxable: z.boolean().default(true),
		costPerItem: z.number().optional(),
	}),
	inventory: z.object({
		tracked: z.boolean().default(false),
		sku: z.string().optional(),
		barcode: z.string().optional(),
		location: z.string().optional(),
	}),
	shipping: z.object({
		packageType: z.string().optional(),
		weight: z.number().optional(),
		weightUnit: z.enum(["kg", "lb"]).default("kg"),
		isPhysical: z.boolean().default(true),
	}),
	status: z.enum(["draft", "active", "archived"]).default("draft"),
	publication: z.string().default("Boutique en ligne"),
	region: z.string().default("Mexico"),
	organization: z.object({
		type: z.string().optional(),
		vendor: z.string().optional(),
	}),
	collections: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	themeTemplate: z.string().default("default"),
})

export type ProductFormValues = z.infer<typeof productSchema>

export interface UploadedImage {
	id: string
	file: File
	preview: string
}
