import * as z from "zod"

export const productSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	description: z.string().optional(),
	images: z.array(z.string()).optional(),
	category: z.string().optional(),
	pricing: z.object({
		price: z.number().min(0, "Le prix doit être positif"),
		compareAtPrice: z.number().optional(),
		unitPrice: z.string().optional(),
		taxable: z.boolean(),
		costPerItem: z.number().optional(),
	}),
	inventory: z.object({
		tracked: z.boolean(),
		sku: z.string().optional(),
		barcode: z.string().optional(),
		location: z.string().optional(),
	}),
	shipping: z.object({
		packageType: z.string().optional(),
		weight: z.number().optional(),
		weightUnit: z.enum(["kg", "lb"]),
		isPhysical: z.boolean(),
	}),
	status: z.enum(["draft", "active", "archived"]),
	publication: z.string().optional(),
	region: z.string().optional(),
	organization: z.object({
		type: z.string().optional(),
		vendor: z.string().optional(),
	}),
	collections: z.array(z.string()),
	tags: z.array(z.string()),
	themeTemplate: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

export interface UploadedImage {
	id: string
	file: File
	preview: string
}
