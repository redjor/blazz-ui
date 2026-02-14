/**
 * Sample data for Forge CRM demo
 * Replaces database queries until Prisma + PostgreSQL are wired up
 */

/* ─── Types ─── */

export interface Company {
	id: string
	name: string
	domain?: string
	industry: string
	size: string
	revenue?: number
	phone?: string
	email?: string
	address?: string
	city?: string
	country: string
	status: "prospect" | "active" | "inactive" | "churned"
	createdAt: string
	updatedAt: string
}

export interface Contact {
	id: string
	firstName: string
	lastName: string
	email: string
	phone?: string
	jobTitle?: string
	isPrimary: boolean
	status: "active" | "inactive" | "archived"
	companyId: string
	companyName: string
	createdAt: string
}

export interface Deal {
	id: string
	title: string
	amount: number
	stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost"
	probability: number
	expectedCloseDate: string
	source: string
	companyId: string
	companyName: string
	contactName: string
	assignedTo: string
	createdAt: string
}

export interface Quote {
	id: string
	reference: string
	status: "draft" | "sent" | "accepted" | "rejected" | "expired"
	dealTitle: string
	companyName: string
	total: number
	validUntil: string
	createdBy: string
	createdAt: string
}

export interface Product {
	id: string
	name: string
	description: string
	sku: string
	unitPrice: number
	currency: string
	category: string
	status: "active" | "inactive" | "discontinued"
}

export interface Activity {
	date: string
	user: string
	action: string
	detail?: string
}

export interface DashboardStats {
	activeClients: number
	activeClientsTrend: number
	monthlyDeals: number
	dealsTrend: number
	revenue: string
	revenueTrend: number
	avgDealSize: string
	avgDealTrend: number
}

/* ─── Companies ─── */

export const companies: Company[] = [
	{ id: "c1", name: "Acme Corp", domain: "acme.com", industry: "Technologie", size: "50-200", revenue: 12000000, phone: "+33 1 42 68 53 00", email: "contact@acme.com", address: "15 rue de Rivoli", city: "Paris", country: "France", status: "active", createdAt: "2024-03-15", updatedAt: "2025-01-20" },
	{ id: "c2", name: "TechVision SAS", domain: "techvision.fr", industry: "Logiciel", size: "10-50", revenue: 3500000, phone: "+33 4 72 10 20 30", email: "info@techvision.fr", address: "8 avenue Jean Jaurès", city: "Lyon", country: "France", status: "active", createdAt: "2024-05-22", updatedAt: "2025-02-01" },
	{ id: "c3", name: "Industrie Dupont", domain: "dupont-industrie.fr", industry: "Industrie", size: "200-500", revenue: 45000000, phone: "+33 3 88 22 33 44", email: "commercial@dupont-industrie.fr", address: "Zone Industrielle Nord", city: "Strasbourg", country: "France", status: "active", createdAt: "2023-11-10", updatedAt: "2025-01-15" },
	{ id: "c4", name: "GreenEnergy", domain: "greenenergy.eu", industry: "Énergie", size: "50-200", revenue: 8000000, phone: "+33 5 56 44 55 66", email: "hello@greenenergy.eu", address: "25 cours de Verdun", city: "Bordeaux", country: "France", status: "prospect", createdAt: "2025-01-05", updatedAt: "2025-02-10" },
	{ id: "c5", name: "MédiaSud", domain: "mediasud.com", industry: "Média", size: "10-50", revenue: 2200000, phone: "+33 4 91 33 44 55", email: "contact@mediasud.com", address: "12 La Canebière", city: "Marseille", country: "France", status: "active", createdAt: "2024-07-18", updatedAt: "2025-01-28" },
	{ id: "c6", name: "FinanceOne", domain: "financeone.fr", industry: "Finance", size: "200-500", revenue: 90000000, phone: "+33 1 55 66 77 88", email: "relations@financeone.fr", address: "1 place de la Bourse", city: "Paris", country: "France", status: "active", createdAt: "2023-09-01", updatedAt: "2025-02-05" },
	{ id: "c7", name: "BioSanté", domain: "biosante.fr", industry: "Santé", size: "50-200", revenue: 15000000, phone: "+33 1 44 55 66 77", email: "info@biosante.fr", address: "3 rue Pasteur", city: "Paris", country: "France", status: "inactive", createdAt: "2024-01-20", updatedAt: "2024-11-15" },
	{ id: "c8", name: "LogisTrans", domain: "logistrans.fr", industry: "Logistique", size: "500+", revenue: 120000000, phone: "+33 2 40 33 44 55", email: "commercial@logistrans.fr", address: "Port de Nantes", city: "Nantes", country: "France", status: "active", createdAt: "2023-06-12", updatedAt: "2025-02-12" },
	{ id: "c9", name: "EduPro Formation", domain: "edupro.fr", industry: "Éducation", size: "10-50", revenue: 1800000, phone: "+33 5 61 22 33 44", email: "contact@edupro.fr", address: "14 rue du Capitole", city: "Toulouse", country: "France", status: "prospect", createdAt: "2025-02-01", updatedAt: "2025-02-10" },
	{ id: "c10", name: "RetailMax", domain: "retailmax.com", industry: "Commerce", size: "200-500", revenue: 55000000, phone: "+33 3 20 11 22 33", email: "partenariats@retailmax.com", address: "100 avenue Flandres", city: "Lille", country: "France", status: "churned", createdAt: "2023-04-15", updatedAt: "2024-08-20" },
	{ id: "c11", name: "CloudNine", domain: "cloudnine.io", industry: "Technologie", size: "10-50", revenue: 5000000, phone: "+33 1 70 11 22 33", email: "sales@cloudnine.io", address: "Station F", city: "Paris", country: "France", status: "active", createdAt: "2024-09-10", updatedAt: "2025-02-14" },
	{ id: "c12", name: "Bâtiment Plus", domain: "batimentplus.fr", industry: "Construction", size: "50-200", revenue: 22000000, phone: "+33 4 78 55 66 77", email: "contact@batimentplus.fr", address: "Zone Artisanale Est", city: "Lyon", country: "France", status: "active", createdAt: "2024-02-28", updatedAt: "2025-01-30" },
]

/* ─── Contacts ─── */

export const contacts: Contact[] = [
	{ id: "ct1", firstName: "Marie", lastName: "Dupont", email: "m.dupont@acme.com", phone: "+33 6 12 34 56 78", jobTitle: "Directrice Générale", isPrimary: true, status: "active", companyId: "c1", companyName: "Acme Corp", createdAt: "2024-03-15" },
	{ id: "ct2", firstName: "Pierre", lastName: "Martin", email: "p.martin@acme.com", phone: "+33 6 23 45 67 89", jobTitle: "DSI", isPrimary: false, status: "active", companyId: "c1", companyName: "Acme Corp", createdAt: "2024-04-10" },
	{ id: "ct3", firstName: "Sophie", lastName: "Bernard", email: "s.bernard@techvision.fr", phone: "+33 6 34 56 78 90", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c2", companyName: "TechVision SAS", createdAt: "2024-05-22" },
	{ id: "ct4", firstName: "Jean", lastName: "Lefebvre", email: "j.lefebvre@dupont-industrie.fr", phone: "+33 6 45 67 89 01", jobTitle: "Directeur Achats", isPrimary: true, status: "active", companyId: "c3", companyName: "Industrie Dupont", createdAt: "2023-11-10" },
	{ id: "ct5", firstName: "Isabelle", lastName: "Moreau", email: "i.moreau@greenenergy.eu", phone: "+33 6 56 78 90 12", jobTitle: "Responsable Partenariats", isPrimary: true, status: "active", companyId: "c4", companyName: "GreenEnergy", createdAt: "2025-01-05" },
	{ id: "ct6", firstName: "Thomas", lastName: "Petit", email: "t.petit@mediasud.com", phone: "+33 6 67 89 01 23", jobTitle: "Directeur Marketing", isPrimary: true, status: "active", companyId: "c5", companyName: "MédiaSud", createdAt: "2024-07-18" },
	{ id: "ct7", firstName: "Claire", lastName: "Roux", email: "c.roux@financeone.fr", phone: "+33 6 78 90 12 34", jobTitle: "VP Sales", isPrimary: true, status: "active", companyId: "c6", companyName: "FinanceOne", createdAt: "2023-09-01" },
	{ id: "ct8", firstName: "Antoine", lastName: "Faure", email: "a.faure@biosante.fr", phone: "+33 6 89 01 23 45", jobTitle: "DG", isPrimary: true, status: "inactive", companyId: "c7", companyName: "BioSanté", createdAt: "2024-01-20" },
	{ id: "ct9", firstName: "Émilie", lastName: "Girard", email: "e.girard@logistrans.fr", phone: "+33 6 90 12 34 56", jobTitle: "Directrice Commerciale", isPrimary: true, status: "active", companyId: "c8", companyName: "LogisTrans", createdAt: "2023-06-12" },
	{ id: "ct10", firstName: "Lucas", lastName: "Andre", email: "l.andre@edupro.fr", phone: "+33 6 01 23 45 67", jobTitle: "Fondateur", isPrimary: true, status: "active", companyId: "c9", companyName: "EduPro Formation", createdAt: "2025-02-01" },
	{ id: "ct11", firstName: "Camille", lastName: "Lemaire", email: "c.lemaire@cloudnine.io", phone: "+33 6 11 22 33 44", jobTitle: "CTO", isPrimary: true, status: "active", companyId: "c11", companyName: "CloudNine", createdAt: "2024-09-10" },
	{ id: "ct12", firstName: "Nicolas", lastName: "Rousseau", email: "n.rousseau@batimentplus.fr", phone: "+33 6 22 33 44 55", jobTitle: "Gérant", isPrimary: true, status: "active", companyId: "c12", companyName: "Bâtiment Plus", createdAt: "2024-02-28" },
]

/* ─── Deals ─── */

export const deals: Deal[] = [
	{ id: "d1", title: "Migration cloud Acme", amount: 85000, stage: "negotiation", probability: 70, expectedCloseDate: "2025-03-15", source: "Inbound", companyId: "c1", companyName: "Acme Corp", contactName: "Marie Dupont", assignedTo: "Sophie Martin", createdAt: "2024-11-20" },
	{ id: "d2", title: "Licence SaaS TechVision", amount: 24000, stage: "proposal", probability: 50, expectedCloseDate: "2025-04-01", source: "Outbound", companyId: "c2", companyName: "TechVision SAS", contactName: "Sophie Bernard", assignedTo: "Sophie Martin", createdAt: "2025-01-10" },
	{ id: "d3", title: "ERP Industrie Dupont", amount: 320000, stage: "qualified", probability: 30, expectedCloseDate: "2025-06-30", source: "Salon", companyId: "c3", companyName: "Industrie Dupont", contactName: "Jean Lefebvre", assignedTo: "Marc Leroy", createdAt: "2024-12-05" },
	{ id: "d4", title: "Dashboard GreenEnergy", amount: 45000, stage: "lead", probability: 15, expectedCloseDate: "2025-05-15", source: "Référencement", companyId: "c4", companyName: "GreenEnergy", contactName: "Isabelle Moreau", assignedTo: "Sophie Martin", createdAt: "2025-02-01" },
	{ id: "d5", title: "Refonte site MédiaSud", amount: 18000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-01-31", source: "Inbound", companyId: "c5", companyName: "MédiaSud", contactName: "Thomas Petit", assignedTo: "Sophie Martin", createdAt: "2024-10-15" },
	{ id: "d6", title: "Plateforme trading FinanceOne", amount: 450000, stage: "proposal", probability: 40, expectedCloseDate: "2025-07-01", source: "Partenaire", companyId: "c6", companyName: "FinanceOne", contactName: "Claire Roux", assignedTo: "Marc Leroy", createdAt: "2025-01-15" },
	{ id: "d7", title: "App mobile LogisTrans", amount: 95000, stage: "negotiation", probability: 80, expectedCloseDate: "2025-03-01", source: "Inbound", companyId: "c8", companyName: "LogisTrans", contactName: "Émilie Girard", assignedTo: "Sophie Martin", createdAt: "2024-09-20" },
	{ id: "d8", title: "LMS EduPro", amount: 35000, stage: "lead", probability: 10, expectedCloseDate: "2025-06-01", source: "LinkedIn", companyId: "c9", companyName: "EduPro Formation", contactName: "Lucas Andre", assignedTo: "Marc Leroy", createdAt: "2025-02-08" },
	{ id: "d9", title: "API CloudNine", amount: 62000, stage: "qualified", probability: 40, expectedCloseDate: "2025-04-15", source: "Inbound", companyId: "c11", companyName: "CloudNine", contactName: "Camille Lemaire", assignedTo: "Sophie Martin", createdAt: "2025-01-20" },
	{ id: "d10", title: "CRM Bâtiment Plus", amount: 28000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-02-01", source: "Outbound", companyId: "c12", companyName: "Bâtiment Plus", contactName: "Nicolas Rousseau", assignedTo: "Marc Leroy", createdAt: "2024-08-10" },
	{ id: "d11", title: "Support premium Acme", amount: 12000, stage: "closed_lost", probability: 0, expectedCloseDate: "2025-01-15", source: "Upsell", companyId: "c1", companyName: "Acme Corp", contactName: "Pierre Martin", assignedTo: "Sophie Martin", createdAt: "2024-12-01" },
	{ id: "d12", title: "Consulting FinanceOne", amount: 75000, stage: "negotiation", probability: 60, expectedCloseDate: "2025-04-30", source: "Partenaire", companyId: "c6", companyName: "FinanceOne", contactName: "Claire Roux", assignedTo: "Sophie Martin", createdAt: "2025-01-25" },
]

/* ─── Quotes ─── */

export const quotes: Quote[] = [
	{ id: "q1", reference: "DEV-2025-001", status: "sent", dealTitle: "Migration cloud Acme", companyName: "Acme Corp", total: 85000, validUntil: "2025-03-31", createdBy: "Sophie Martin", createdAt: "2025-01-25" },
	{ id: "q2", reference: "DEV-2025-002", status: "draft", dealTitle: "Licence SaaS TechVision", companyName: "TechVision SAS", total: 24000, validUntil: "2025-04-30", createdBy: "Sophie Martin", createdAt: "2025-02-05" },
	{ id: "q3", reference: "DEV-2025-003", status: "accepted", dealTitle: "Refonte site MédiaSud", companyName: "MédiaSud", total: 18000, validUntil: "2025-02-28", createdBy: "Sophie Martin", createdAt: "2025-01-10" },
	{ id: "q4", reference: "DEV-2025-004", status: "sent", dealTitle: "Plateforme trading FinanceOne", companyName: "FinanceOne", total: 450000, validUntil: "2025-05-31", createdBy: "Marc Leroy", createdAt: "2025-02-01" },
	{ id: "q5", reference: "DEV-2025-005", status: "accepted", dealTitle: "CRM Bâtiment Plus", companyName: "Bâtiment Plus", total: 28000, validUntil: "2025-03-01", createdBy: "Marc Leroy", createdAt: "2024-12-15" },
	{ id: "q6", reference: "DEV-2025-006", status: "rejected", dealTitle: "Support premium Acme", companyName: "Acme Corp", total: 12000, validUntil: "2025-01-31", createdBy: "Sophie Martin", createdAt: "2024-12-20" },
	{ id: "q7", reference: "DEV-2025-007", status: "draft", dealTitle: "App mobile LogisTrans", companyName: "LogisTrans", total: 95000, validUntil: "2025-04-15", createdBy: "Sophie Martin", createdAt: "2025-02-10" },
	{ id: "q8", reference: "DEV-2025-008", status: "expired", dealTitle: "ERP Industrie Dupont", companyName: "Industrie Dupont", total: 320000, validUntil: "2025-01-15", createdBy: "Marc Leroy", createdAt: "2024-11-01" },
]

/* ─── Products ─── */

export const products: Product[] = [
	{ id: "p1", name: "Forge CRM — Starter", description: "Licence CRM pour petites équipes (jusqu'à 5 utilisateurs)", sku: "CRM-START-01", unitPrice: 49, currency: "EUR", category: "Licence", status: "active" },
	{ id: "p2", name: "Forge CRM — Business", description: "Licence CRM pour équipes moyennes (jusqu'à 25 utilisateurs)", sku: "CRM-BIZ-01", unitPrice: 149, currency: "EUR", category: "Licence", status: "active" },
	{ id: "p3", name: "Forge CRM — Enterprise", description: "Licence CRM illimitée avec support dédié", sku: "CRM-ENT-01", unitPrice: 499, currency: "EUR", category: "Licence", status: "active" },
	{ id: "p4", name: "Migration données", description: "Service de migration depuis un CRM existant", sku: "SRV-MIG-01", unitPrice: 2500, currency: "EUR", category: "Service", status: "active" },
	{ id: "p5", name: "Formation utilisateur", description: "Formation d'une journée pour l'équipe commerciale", sku: "SRV-FORM-01", unitPrice: 800, currency: "EUR", category: "Service", status: "active" },
	{ id: "p6", name: "Intégration API", description: "Développement sur mesure d'intégrations API", sku: "SRV-API-01", unitPrice: 5000, currency: "EUR", category: "Service", status: "active" },
	{ id: "p7", name: "Support Premium", description: "Support prioritaire 24/7 avec SLA garanti", sku: "SUP-PREM-01", unitPrice: 200, currency: "EUR", category: "Support", status: "active" },
	{ id: "p8", name: "Module Analytics", description: "Add-on reporting et analytics avancés", sku: "MOD-ANA-01", unitPrice: 79, currency: "EUR", category: "Module", status: "active" },
	{ id: "p9", name: "Module Email", description: "Add-on campagnes email intégrées", sku: "MOD-MAIL-01", unitPrice: 59, currency: "EUR", category: "Module", status: "inactive" },
	{ id: "p10", name: "Ancien CRM v1", description: "Ancienne version du CRM (obsolète)", sku: "CRM-V1-01", unitPrice: 29, currency: "EUR", category: "Licence", status: "discontinued" },
]

/* ─── Dashboard Stats ─── */

export const dashboardStats: DashboardStats = {
	activeClients: 9,
	activeClientsTrend: 12.5,
	monthlyDeals: 5,
	dealsTrend: 25,
	revenue: "1 249 000 €",
	revenueTrend: 8.3,
	avgDealSize: "99 917 €",
	avgDealTrend: -3.2,
}

export const revenueChartData = [
	{ month: "Sep", revenue: 65000 },
	{ month: "Oct", revenue: 78000 },
	{ month: "Nov", revenue: 95000 },
	{ month: "Déc", revenue: 88000 },
	{ month: "Jan", revenue: 113000 },
	{ month: "Fév", revenue: 130000 },
]

export const dealsByStageData = [
	{ name: "Lead", count: 2 },
	{ name: "Qualifié", count: 2 },
	{ name: "Proposition", count: 2 },
	{ name: "Négociation", count: 3 },
	{ name: "Gagné", count: 2 },
	{ name: "Perdu", count: 1 },
]

export const recentActivities: Activity[] = [
	{ date: "2025-02-14T10:30:00", user: "Sophie Martin", action: "Deal mis à jour", detail: "Consulting FinanceOne → Négociation" },
	{ date: "2025-02-13T16:45:00", user: "Marc Leroy", action: "Devis créé", detail: "DEV-2025-007 pour LogisTrans" },
	{ date: "2025-02-12T09:15:00", user: "Sophie Martin", action: "Contact ajouté", detail: "Camille Lemaire (CloudNine)" },
	{ date: "2025-02-10T14:00:00", user: "Sophie Martin", action: "Entreprise créée", detail: "GreenEnergy ajoutée au CRM" },
	{ date: "2025-02-08T11:30:00", user: "Marc Leroy", action: "Deal créé", detail: "LMS EduPro (35 000 €)" },
	{ date: "2025-02-05T17:00:00", user: "Sophie Martin", action: "Devis envoyé", detail: "DEV-2025-002 à TechVision SAS" },
	{ date: "2025-02-01T10:00:00", user: "Marc Leroy", action: "Devis accepté", detail: "DEV-2025-005 par Bâtiment Plus" },
]

/* ─── Helpers ─── */

export function formatCurrency(amount: number, currency = "EUR"): string {
	return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)
}

export function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})
}

export function getCompanyById(id: string): Company | undefined {
	return companies.find((c) => c.id === id)
}

export function getContactById(id: string): Contact | undefined {
	return contacts.find((c) => c.id === id)
}

export function getDealById(id: string): Deal | undefined {
	return deals.find((d) => d.id === id)
}

export function getQuoteById(id: string): Quote | undefined {
	return quotes.find((q) => q.id === id)
}

export function getContactsByCompany(companyId: string): Contact[] {
	return contacts.filter((c) => c.companyId === companyId)
}

export function getDealsByCompany(companyId: string): Deal[] {
	return deals.filter((d) => d.companyId === companyId)
}
