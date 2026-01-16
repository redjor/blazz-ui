import { faker } from "@faker-js/faker"

export interface User {
	id: string
	name: string
	email: string
	avatar: string
	role: "admin" | "user" | "viewer"
	status: "active" | "inactive" | "pending"
	createdAt: Date
}

/**
 * Generate mock user data
 * @param count Number of users to generate
 * @returns Array of mock users
 */
export function generateUsers(count: number): User[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `user-${i + 1}`,
		name: faker.person.fullName(),
		email: faker.internet.email(),
		avatar: faker.image.avatar(),
		role: faker.helpers.arrayElement(["admin", "user", "viewer"]),
		status: faker.helpers.arrayElement(["active", "inactive", "pending"]),
		createdAt: faker.date.past(),
	}))
}

/**
 * Single mock user for simple examples
 */
export const mockUser: User = {
	id: "user-1",
	name: "John Doe",
	email: "john.doe@example.com",
	avatar: "https://i.pravatar.cc/150?u=john",
	role: "admin",
	status: "active",
	createdAt: new Date("2024-01-01"),
}
