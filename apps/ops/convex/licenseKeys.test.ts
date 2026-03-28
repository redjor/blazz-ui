import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./test.schema"

const modules = import.meta.glob("./**/*.*s")

function setup() {
	const t = convexTest(schema, modules)
	const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
	return { t, asUser }
}

describe("licenseKeys auth", () => {
	it("list rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(t.query(api.licenseKeys.list)).rejects.toThrow("Non authentifié")
	})

	it("create rejects unauthenticated", async () => {
		const { t } = setup()
		await expect(
			t.mutation(api.licenseKeys.create, {
				key: "BLAZZ-PRO-org1-20270101-abc123",
				plan: "PRO",
				orgId: "org1",
				expiresAt: "2027-01-01",
			})
		).rejects.toThrow("Non authentifié")
	})
})

describe("licenseKeys CRUD", () => {
	it("creates and lists", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		const keys = await asUser.query(api.licenseKeys.list)
		expect(keys).toHaveLength(1)
		expect(keys[0].plan).toBe("PRO")
	})

	it("revokes a key", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		await asUser.mutation(api.licenseKeys.revoke, { id })
		const keys = await asUser.query(api.licenseKeys.list)
		expect(keys[0].revokedAt).toBeDefined()
	})

	it("cannot revoke already revoked key", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		await asUser.mutation(api.licenseKeys.revoke, { id })
		await expect(asUser.mutation(api.licenseKeys.revoke, { id })).rejects.toThrow("Déjà révoquée")
	})

	it("removes a key", async () => {
		const { asUser } = setup()
		const id = await asUser.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		await asUser.mutation(api.licenseKeys.remove, { id })
		const keys = await asUser.query(api.licenseKeys.list)
		expect(keys).toHaveLength(0)
	})
})

describe("licenseKeys isolation", () => {
	it("revoke rejects other user's key", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		await expect(user2.mutation(api.licenseKeys.revoke, { id })).rejects.toThrow("Introuvable")
	})

	it("remove rejects other user's key", async () => {
		const { t } = setup()
		const user1 = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
		const user2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })
		const id = await user1.mutation(api.licenseKeys.create, {
			key: "BLAZZ-PRO-org1-20270101-abc123",
			plan: "PRO",
			orgId: "org1",
			expiresAt: "2027-01-01",
		})
		await expect(user2.mutation(api.licenseKeys.remove, { id })).rejects.toThrow("Introuvable")
	})
})
