import { faker } from "@faker-js/faker"

export interface Product {
	id: string
	name: string
	price: number
	stock: number
	status: "active" | "inactive" | "discontinued"
	category: "electronics" | "clothing" | "food" | "furniture" | "other"
	createdAt: Date
}

/**
 * Generate mock product data
 * @param count Number of products to generate
 * @returns Array of mock products
 */
export function generateProducts(count: number): Product[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `product-${i + 1}`,
		name: faker.commerce.productName(),
		price: Number.parseFloat(faker.commerce.price({ min: 10, max: 500 })),
		stock: faker.number.int({ min: 0, max: 200 }),
		status: faker.helpers.arrayElement(["active", "inactive", "discontinued"]),
		category: faker.helpers.arrayElement([
			"electronics",
			"clothing",
			"food",
			"furniture",
			"other",
		]),
		createdAt: faker.date.past(),
	}))
}

/**
 * Single mock product for simple examples
 */
export const mockProduct: Product = {
	id: "product-1",
	name: "Wireless Mouse",
	price: 29.99,
	stock: 45,
	status: "active",
	category: "electronics",
	createdAt: new Date("2024-01-15"),
}
