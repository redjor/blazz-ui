import * as z from "zod"

// ── Company ──────────────────────────────────────────────────────────
export const companySchema = z.object({
	name: z.string().min(1, "Le nom est requis"),
	domain: z.string().optional().default(""),
	industry: z.string().optional().default(""),
	size: z.string().optional().default(""),
	revenue: z.string().optional().default(""),
	phone: z.string().optional().default(""),
	email: z.string().email("Email invalide").optional().or(z.literal("")),
	address: z.string().optional().default(""),
	city: z.string().optional().default(""),
	country: z.string().optional().default("France"),
	status: z.string().optional().default("prospect"),
})

export type CompanyFormData = z.infer<typeof companySchema>

// ── Deal ─────────────────────────────────────────────────────────────
export const dealSchema = z.object({
	title: z.string().min(1, "Le titre est requis"),
	amount: z.string().min(1, "Le montant est requis"),
	stage: z.string().optional().default("lead"),
	probability: z.string().optional().default("15"),
	expectedCloseDate: z.string().optional().default(""),
	source: z.string().optional().default(""),
	companyId: z.string().min(1, "L'entreprise est requise"),
	contactId: z.string().optional().default(""),
})

export type DealFormData = z.infer<typeof dealSchema>

// ── Login ────────────────────────────────────────────────────────────
export const loginSchema = z.object({
	email: z.string().min(1, "L'email est requis").email("Email invalide"),
	password: z.string().min(1, "Le mot de passe est requis"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ── Register ─────────────────────────────────────────────────────────
export const registerSchema = z.object({
	firstName: z.string().min(1, "Le prénom est requis"),
	lastName: z.string().min(1, "Le nom est requis"),
	email: z.string().min(1, "L'email est requis").email("Email invalide"),
	password: z.string().min(8, "8 caractères minimum"),
})

export type RegisterFormData = z.infer<typeof registerSchema>

// ── Forgot password ──────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
	email: z.string().min(1, "L'email est requis").email("Email invalide"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
