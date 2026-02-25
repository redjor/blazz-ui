/**
 * Sample data for Forge CRM demo
 * Replaces database queries until Prisma + PostgreSQL are wired up
 *
 * Volumes: 50 companies, 120 contacts, 35 deals, 15 quotes, 20 products, 5 users
 */

/* ─── Types ─── */

export interface User {
	id: string
	firstName: string
	lastName: string
	email: string
	role: "admin" | "manager" | "sales"
	avatar?: string
}

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
	assignedTo?: string
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
	stock: number
	reorderDate: string
}

export interface QuoteLine {
	id: string
	product: string
	description: string
	quantity: number
	unitPrice: number
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

/* ─── Users (5) ─── */

export const users: User[] = [
	{ id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@forge-crm.com", role: "admin" },
	{ id: "u2", firstName: "Marc", lastName: "Leroy", email: "marc.leroy@forge-crm.com", role: "manager" },
	{ id: "u3", firstName: "Julie", lastName: "Dufresne", email: "julie.dufresne@forge-crm.com", role: "sales" },
	{ id: "u4", firstName: "Antoine", lastName: "Moreau", email: "antoine.moreau@forge-crm.com", role: "sales" },
	{ id: "u5", firstName: "Léa", lastName: "Petit", email: "lea.petit@forge-crm.com", role: "sales" },
]

const assignees = ["Sophie Martin", "Marc Leroy", "Julie Dufresne", "Antoine Moreau", "Léa Petit"]

/* ─── Companies (50) ─── */

export const companies: Company[] = [
	{ id: "c1", name: "Acme Corp", domain: "acme.com", industry: "Technologie", size: "50-200", revenue: 12000000, phone: "+33 1 42 68 53 00", email: "contact@acme.com", address: "15 rue de Rivoli", city: "Paris", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-03-15", updatedAt: "2025-01-20" },
	{ id: "c2", name: "TechVision SAS", domain: "techvision.fr", industry: "Logiciel", size: "10-50", revenue: 3500000, phone: "+33 4 72 10 20 30", email: "info@techvision.fr", address: "8 avenue Jean Jaurès", city: "Lyon", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-05-22", updatedAt: "2025-02-01" },
	{ id: "c3", name: "Industrie Dupont", domain: "dupont-industrie.fr", industry: "Industrie", size: "200-500", revenue: 45000000, phone: "+33 3 88 22 33 44", email: "commercial@dupont-industrie.fr", address: "Zone Industrielle Nord", city: "Strasbourg", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2023-11-10", updatedAt: "2025-01-15" },
	{ id: "c4", name: "GreenEnergy", domain: "greenenergy.eu", industry: "Énergie", size: "50-200", revenue: 8000000, phone: "+33 5 56 44 55 66", email: "hello@greenenergy.eu", address: "25 cours de Verdun", city: "Bordeaux", country: "France", status: "prospect", assignedTo: "Sophie Martin", createdAt: "2025-01-05", updatedAt: "2025-02-10" },
	{ id: "c5", name: "MédiaSud", domain: "mediasud.com", industry: "Média", size: "10-50", revenue: 2200000, phone: "+33 4 91 33 44 55", email: "contact@mediasud.com", address: "12 La Canebière", city: "Marseille", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-07-18", updatedAt: "2025-01-28" },
	{ id: "c6", name: "FinanceOne", domain: "financeone.fr", industry: "Finance", size: "200-500", revenue: 90000000, phone: "+33 1 55 66 77 88", email: "relations@financeone.fr", address: "1 place de la Bourse", city: "Paris", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2023-09-01", updatedAt: "2025-02-05" },
	{ id: "c7", name: "BioSanté", domain: "biosante.fr", industry: "Santé", size: "50-200", revenue: 15000000, phone: "+33 1 44 55 66 77", email: "info@biosante.fr", address: "3 rue Pasteur", city: "Paris", country: "France", status: "inactive", assignedTo: "Julie Dufresne", createdAt: "2024-01-20", updatedAt: "2024-11-15" },
	{ id: "c8", name: "LogisTrans", domain: "logistrans.fr", industry: "Logistique", size: "500+", revenue: 120000000, phone: "+33 2 40 33 44 55", email: "commercial@logistrans.fr", address: "Port de Nantes", city: "Nantes", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2023-06-12", updatedAt: "2025-02-12" },
	{ id: "c9", name: "EduPro Formation", domain: "edupro.fr", industry: "Éducation", size: "10-50", revenue: 1800000, phone: "+33 5 61 22 33 44", email: "contact@edupro.fr", address: "14 rue du Capitole", city: "Toulouse", country: "France", status: "prospect", assignedTo: "Marc Leroy", createdAt: "2025-02-01", updatedAt: "2025-02-10" },
	{ id: "c10", name: "RetailMax", domain: "retailmax.com", industry: "Commerce", size: "200-500", revenue: 55000000, phone: "+33 3 20 11 22 33", email: "partenariats@retailmax.com", address: "100 avenue Flandres", city: "Lille", country: "France", status: "churned", assignedTo: "Antoine Moreau", createdAt: "2023-04-15", updatedAt: "2024-08-20" },
	{ id: "c11", name: "CloudNine", domain: "cloudnine.io", industry: "Technologie", size: "10-50", revenue: 5000000, phone: "+33 1 70 11 22 33", email: "sales@cloudnine.io", address: "Station F", city: "Paris", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-09-10", updatedAt: "2025-02-14" },
	{ id: "c12", name: "Bâtiment Plus", domain: "batimentplus.fr", industry: "Construction", size: "50-200", revenue: 22000000, phone: "+33 4 78 55 66 77", email: "contact@batimentplus.fr", address: "Zone Artisanale Est", city: "Lyon", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2024-02-28", updatedAt: "2025-01-30" },
	{ id: "c13", name: "NovaTech", domain: "novatech.fr", industry: "Technologie", size: "10-50", revenue: 4200000, phone: "+33 1 40 22 33 44", email: "contact@novatech.fr", address: "42 rue de Monceau", city: "Paris", country: "France", status: "active", assignedTo: "Julie Dufresne", createdAt: "2024-06-01", updatedAt: "2025-01-25" },
	{ id: "c14", name: "Agroland", domain: "agroland.fr", industry: "Industrie", size: "200-500", revenue: 38000000, phone: "+33 2 99 11 22 33", email: "commercial@agroland.fr", address: "ZA de la Motte", city: "Rennes", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2024-01-15", updatedAt: "2025-02-08" },
	{ id: "c15", name: "CyberShield", domain: "cybershield.eu", industry: "Technologie", size: "10-50", revenue: 6500000, phone: "+33 1 45 67 89 01", email: "info@cybershield.eu", address: "17 rue La Boétie", city: "Paris", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-04-20", updatedAt: "2025-02-12" },
	{ id: "c16", name: "Pharma Solutions", domain: "pharmasolutions.fr", industry: "Santé", size: "500+", revenue: 250000000, phone: "+33 1 53 44 55 66", email: "business@pharmasolutions.fr", address: "8 avenue de l'Opéra", city: "Paris", country: "France", status: "prospect", assignedTo: "Marc Leroy", createdAt: "2025-01-20", updatedAt: "2025-02-14" },
	{ id: "c17", name: "Océan Digital", domain: "ocean-digital.fr", industry: "Logiciel", size: "10-50", revenue: 2800000, phone: "+33 2 40 55 66 77", email: "hello@ocean-digital.fr", address: "5 quai de la Fosse", city: "Nantes", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-08-12", updatedAt: "2025-01-18" },
	{ id: "c18", name: "AutoParts France", domain: "autoparts.fr", industry: "Industrie", size: "200-500", revenue: 72000000, phone: "+33 3 80 22 33 44", email: "ventes@autoparts.fr", address: "ZI de Longvic", city: "Dijon", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2023-10-05", updatedAt: "2025-02-06" },
	{ id: "c19", name: "Voyages Évasion", domain: "voyages-evasion.fr", industry: "Commerce", size: "50-200", revenue: 18000000, phone: "+33 4 67 11 22 33", email: "pro@voyages-evasion.fr", address: "23 place de la Comédie", city: "Montpellier", country: "France", status: "inactive", assignedTo: "Julie Dufresne", createdAt: "2024-03-10", updatedAt: "2024-10-25" },
	{ id: "c20", name: "DataForge", domain: "dataforge.ai", industry: "Technologie", size: "10-50", revenue: 8500000, phone: "+33 1 48 33 44 55", email: "contact@dataforge.ai", address: "28 rue du Sentier", city: "Paris", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-07-01", updatedAt: "2025-02-13" },
	{ id: "c21", name: "Habitat Concept", domain: "habitatconcept.fr", industry: "Construction", size: "50-200", revenue: 32000000, phone: "+33 2 35 11 22 33", email: "commercial@habitatconcept.fr", address: "12 rue de la République", city: "Rouen", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2024-05-15", updatedAt: "2025-01-22" },
	{ id: "c22", name: "Lumière Studios", domain: "lumiere-studios.com", industry: "Média", size: "10-50", revenue: 3100000, phone: "+33 4 72 33 44 55", email: "production@lumiere-studios.com", address: "8 rue du Premier Film", city: "Lyon", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-11-20", updatedAt: "2025-02-10" },
	{ id: "c23", name: "Express Logistique", domain: "express-logistique.fr", industry: "Logistique", size: "200-500", revenue: 65000000, phone: "+33 1 49 55 66 77", email: "pro@express-logistique.fr", address: "Port de Gennevilliers", city: "Gennevilliers", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2023-12-01", updatedAt: "2025-02-11" },
	{ id: "c24", name: "SolarTech", domain: "solartech.fr", industry: "Énergie", size: "50-200", revenue: 14000000, phone: "+33 4 42 11 22 33", email: "info@solartech.fr", address: "Technopôle de l'Arbois", city: "Aix-en-Provence", country: "France", status: "prospect", assignedTo: "Julie Dufresne", createdAt: "2025-01-15", updatedAt: "2025-02-14" },
	{ id: "c25", name: "BankSecure", domain: "banksecure.fr", industry: "Finance", size: "50-200", revenue: 25000000, phone: "+33 1 42 88 99 00", email: "partenariat@banksecure.fr", address: "4 rue de Berri", city: "Paris", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-02-10", updatedAt: "2025-02-01" },
	{ id: "c26", name: "MedLab", domain: "medlab.fr", industry: "Santé", size: "10-50", revenue: 4800000, phone: "+33 3 68 11 22 33", email: "direction@medlab.fr", address: "15 rue du Faubourg", city: "Strasbourg", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2024-09-05", updatedAt: "2025-01-28" },
	{ id: "c27", name: "Textiles Provence", domain: "textiles-provence.fr", industry: "Industrie", size: "50-200", revenue: 16000000, phone: "+33 4 90 11 22 33", email: "ventes@textiles-provence.fr", address: "Route de Cavaillon", city: "Avignon", country: "France", status: "inactive", assignedTo: "Léa Petit", createdAt: "2023-08-20", updatedAt: "2024-09-15" },
	{ id: "c28", name: "DigiSchool", domain: "digischool.fr", industry: "Éducation", size: "50-200", revenue: 9000000, phone: "+33 4 78 66 77 88", email: "contact@digischool.fr", address: "35 rue de la Bourse", city: "Lyon", country: "France", status: "active", assignedTo: "Julie Dufresne", createdAt: "2024-06-15", updatedAt: "2025-02-03" },
	{ id: "c29", name: "Vino Grand Cru", domain: "vinograndcru.fr", industry: "Commerce", size: "10-50", revenue: 5500000, phone: "+33 5 56 77 88 99", email: "pro@vinograndcru.fr", address: "Château de la Vigne", city: "Bordeaux", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2024-10-01", updatedAt: "2025-01-15" },
	{ id: "c30", name: "RoboFactory", domain: "robofactory.fr", industry: "Technologie", size: "50-200", revenue: 19000000, phone: "+33 3 44 11 22 33", email: "info@robofactory.fr", address: "ZI de Compiègne", city: "Compiègne", country: "France", status: "prospect", assignedTo: "Sophie Martin", createdAt: "2025-02-05", updatedAt: "2025-02-14" },
	{ id: "c31", name: "Airbus Ventures", domain: "airbus-ventures.com", industry: "Industrie", size: "500+", revenue: 500000000, phone: "+33 5 61 93 33 33", email: "partnerships@airbus-ventures.com", address: "1 rond-point Maurice Bellonte", city: "Toulouse", country: "France", status: "prospect", assignedTo: "Marc Leroy", createdAt: "2025-01-28", updatedAt: "2025-02-14" },
	{ id: "c32", name: "Mode & Style", domain: "modestyle.fr", industry: "Commerce", size: "50-200", revenue: 28000000, phone: "+33 1 42 33 44 55", email: "b2b@modestyle.fr", address: "56 avenue Montaigne", city: "Paris", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-04-12", updatedAt: "2025-02-07" },
	{ id: "c33", name: "AssurPlus", domain: "assurplus.fr", industry: "Finance", size: "200-500", revenue: 42000000, phone: "+33 1 44 77 88 99", email: "courtage@assurplus.fr", address: "20 boulevard Haussmann", city: "Paris", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2024-01-08", updatedAt: "2025-02-09" },
	{ id: "c34", name: "HealthConnect", domain: "healthconnect.fr", industry: "Santé", size: "10-50", revenue: 3200000, phone: "+33 1 55 11 22 33", email: "contact@healthconnect.fr", address: "10 rue de la Santé", city: "Paris", country: "France", status: "active", assignedTo: "Julie Dufresne", createdAt: "2024-08-25", updatedAt: "2025-01-20" },
	{ id: "c35", name: "TransAlpes", domain: "transalpes.fr", industry: "Logistique", size: "50-200", revenue: 21000000, phone: "+33 4 76 11 22 33", email: "fret@transalpes.fr", address: "Zone de Fontaine", city: "Grenoble", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2024-03-20", updatedAt: "2025-02-04" },
	{ id: "c36", name: "Cosmétique Luxe", domain: "cosmetiqueluxe.fr", industry: "Commerce", size: "50-200", revenue: 35000000, phone: "+33 1 43 22 33 44", email: "distribution@cosmetiqueluxe.fr", address: "72 rue du Faubourg Saint-Honoré", city: "Paris", country: "France", status: "churned", assignedTo: "Sophie Martin", createdAt: "2023-07-15", updatedAt: "2024-06-30" },
	{ id: "c37", name: "SmartGrid Energy", domain: "smartgrid-energy.eu", industry: "Énergie", size: "10-50", revenue: 7200000, phone: "+33 4 67 33 44 55", email: "info@smartgrid-energy.eu", address: "Parc Euromédecine", city: "Montpellier", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-11-01", updatedAt: "2025-02-13" },
	{ id: "c38", name: "Brasserie du Nord", domain: "brasseriedunord.fr", industry: "Industrie", size: "50-200", revenue: 11000000, phone: "+33 3 20 44 55 66", email: "commercial@brasseriedunord.fr", address: "18 rue de Gand", city: "Lille", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2024-02-14", updatedAt: "2025-01-10" },
	{ id: "c39", name: "Campus Online", domain: "campus-online.fr", industry: "Éducation", size: "10-50", revenue: 4100000, phone: "+33 1 40 55 66 77", email: "contact@campus-online.fr", address: "45 rue Daguerre", city: "Paris", country: "France", status: "prospect", assignedTo: "Julie Dufresne", createdAt: "2025-01-10", updatedAt: "2025-02-14" },
	{ id: "c40", name: "ArchiBuild", domain: "archibuild.fr", industry: "Construction", size: "200-500", revenue: 48000000, phone: "+33 4 72 44 55 66", email: "projets@archibuild.fr", address: "30 quai Rambaud", city: "Lyon", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2023-11-25", updatedAt: "2025-02-11" },
	{ id: "c41", name: "PixelWave", domain: "pixelwave.io", industry: "Logiciel", size: "1-10", revenue: 800000, phone: "+33 6 11 22 33 44", email: "hello@pixelwave.io", address: "La Ruche", city: "Paris", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-12-01", updatedAt: "2025-02-14" },
	{ id: "c42", name: "Aéro Composites", domain: "aerocomposites.fr", industry: "Industrie", size: "200-500", revenue: 85000000, phone: "+33 5 61 44 55 66", email: "direction@aerocomposites.fr", address: "ZI Aéroconstellation", city: "Toulouse", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-05-05", updatedAt: "2025-02-08" },
	{ id: "c43", name: "FoodTech Labs", domain: "foodtechlabs.fr", industry: "Technologie", size: "10-50", revenue: 3800000, phone: "+33 1 48 66 77 88", email: "info@foodtechlabs.fr", address: "104 avenue de France", city: "Paris", country: "France", status: "active", assignedTo: "Antoine Moreau", createdAt: "2024-09-20", updatedAt: "2025-01-30" },
	{ id: "c44", name: "Carrefour Digital", domain: "carrefour-digital.fr", industry: "Commerce", size: "500+", revenue: 180000000, phone: "+33 1 56 77 88 99", email: "digital@carrefour-digital.fr", address: "3 avenue de Boulogne", city: "Boulogne-Billancourt", country: "France", status: "prospect", assignedTo: "Marc Leroy", createdAt: "2025-02-10", updatedAt: "2025-02-14" },
	{ id: "c45", name: "Therma Solutions", domain: "therma.fr", industry: "Énergie", size: "50-200", revenue: 12500000, phone: "+33 4 42 55 66 77", email: "contact@therma.fr", address: "Parc Technologique", city: "Aix-en-Provence", country: "France", status: "active", assignedTo: "Julie Dufresne", createdAt: "2024-07-22", updatedAt: "2025-02-06" },
	{ id: "c46", name: "Cabinet Legrand", domain: "legrand-conseil.fr", industry: "Finance", size: "1-10", revenue: 1200000, phone: "+33 1 42 99 00 11", email: "contact@legrand-conseil.fr", address: "8 rue Marbeuf", city: "Paris", country: "France", status: "active", assignedTo: "Léa Petit", createdAt: "2024-10-15", updatedAt: "2025-01-25" },
	{ id: "c47", name: "Normandie Fromages", domain: "normandie-fromages.fr", industry: "Industrie", size: "50-200", revenue: 9500000, phone: "+33 2 31 11 22 33", email: "ventes@normandie-fromages.fr", address: "Route de Livarot", city: "Caen", country: "France", status: "inactive", assignedTo: "Antoine Moreau", createdAt: "2024-04-01", updatedAt: "2024-12-10" },
	{ id: "c48", name: "SportZone", domain: "sportzone.fr", industry: "Commerce", size: "200-500", revenue: 62000000, phone: "+33 4 72 88 99 00", email: "pro@sportzone.fr", address: "Centre Commercial Part-Dieu", city: "Lyon", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2024-01-20", updatedAt: "2025-02-12" },
	{ id: "c49", name: "Clinique Étoile", domain: "clinique-etoile.fr", industry: "Santé", size: "200-500", revenue: 30000000, phone: "+33 1 44 00 11 22", email: "direction@clinique-etoile.fr", address: "29 rue Copernic", city: "Paris", country: "France", status: "active", assignedTo: "Marc Leroy", createdAt: "2024-06-30", updatedAt: "2025-02-09" },
	{ id: "c50", name: "TelcoNet", domain: "telconet.fr", industry: "Technologie", size: "500+", revenue: 150000000, phone: "+33 1 57 11 22 33", email: "enterprise@telconet.fr", address: "Tour Sequoia", city: "La Défense", country: "France", status: "active", assignedTo: "Sophie Martin", createdAt: "2023-05-10", updatedAt: "2025-02-14" },
]

/* ─── Contacts (120) ─── */

const contactsRaw: Array<Omit<Contact, "companyName"> & { companyId: string }> = [
	// Acme Corp (c1) — 4 contacts
	{ id: "ct1", firstName: "Marie", lastName: "Dupont", email: "m.dupont@acme.com", phone: "+33 6 12 34 56 78", jobTitle: "Directrice Générale", isPrimary: true, status: "active", companyId: "c1", createdAt: "2024-03-15" },
	{ id: "ct2", firstName: "Pierre", lastName: "Martin", email: "p.martin@acme.com", phone: "+33 6 23 45 67 89", jobTitle: "DSI", isPrimary: false, status: "active", companyId: "c1", createdAt: "2024-04-10" },
	{ id: "ct3", firstName: "Lucie", lastName: "Garnier", email: "l.garnier@acme.com", phone: "+33 6 34 56 78 01", jobTitle: "Responsable Achats", isPrimary: false, status: "active", companyId: "c1", createdAt: "2024-05-20" },
	{ id: "ct4", firstName: "Hugo", lastName: "Blanc", email: "h.blanc@acme.com", jobTitle: "Dev Lead", isPrimary: false, status: "active", companyId: "c1", createdAt: "2024-06-15" },
	// TechVision (c2) — 3 contacts
	{ id: "ct5", firstName: "Sophie", lastName: "Bernard", email: "s.bernard@techvision.fr", phone: "+33 6 45 67 89 01", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c2", createdAt: "2024-05-22" },
	{ id: "ct6", firstName: "Maxime", lastName: "Dubois", email: "m.dubois@techvision.fr", phone: "+33 6 56 78 90 12", jobTitle: "CTO", isPrimary: false, status: "active", companyId: "c2", createdAt: "2024-06-01" },
	{ id: "ct7", firstName: "Chloé", lastName: "Fontaine", email: "c.fontaine@techvision.fr", jobTitle: "Product Manager", isPrimary: false, status: "active", companyId: "c2", createdAt: "2024-07-12" },
	// Industrie Dupont (c3) — 3 contacts
	{ id: "ct8", firstName: "Jean", lastName: "Lefebvre", email: "j.lefebvre@dupont-industrie.fr", phone: "+33 6 67 89 01 23", jobTitle: "Directeur Achats", isPrimary: true, status: "active", companyId: "c3", createdAt: "2023-11-10" },
	{ id: "ct9", firstName: "Nathalie", lastName: "Mercier", email: "n.mercier@dupont-industrie.fr", phone: "+33 6 78 90 12 34", jobTitle: "Responsable SI", isPrimary: false, status: "active", companyId: "c3", createdAt: "2024-01-15" },
	{ id: "ct10", firstName: "François", lastName: "Duval", email: "f.duval@dupont-industrie.fr", jobTitle: "Directeur Usine", isPrimary: false, status: "active", companyId: "c3", createdAt: "2024-03-01" },
	// GreenEnergy (c4) — 2 contacts
	{ id: "ct11", firstName: "Isabelle", lastName: "Moreau", email: "i.moreau@greenenergy.eu", phone: "+33 6 89 01 23 45", jobTitle: "Responsable Partenariats", isPrimary: true, status: "active", companyId: "c4", createdAt: "2025-01-05" },
	{ id: "ct12", firstName: "Romain", lastName: "Leclerc", email: "r.leclerc@greenenergy.eu", jobTitle: "Ingénieur R&D", isPrimary: false, status: "active", companyId: "c4", createdAt: "2025-01-20" },
	// MédiaSud (c5) — 2 contacts
	{ id: "ct13", firstName: "Thomas", lastName: "Petit", email: "t.petit@mediasud.com", phone: "+33 6 90 12 34 56", jobTitle: "Directeur Marketing", isPrimary: true, status: "active", companyId: "c5", createdAt: "2024-07-18" },
	{ id: "ct14", firstName: "Amandine", lastName: "Morel", email: "a.morel@mediasud.com", jobTitle: "Journaliste", isPrimary: false, status: "active", companyId: "c5", createdAt: "2024-08-01" },
	// FinanceOne (c6) — 3 contacts
	{ id: "ct15", firstName: "Claire", lastName: "Roux", email: "c.roux@financeone.fr", phone: "+33 6 01 23 45 67", jobTitle: "VP Sales", isPrimary: true, status: "active", companyId: "c6", createdAt: "2023-09-01" },
	{ id: "ct16", firstName: "Alexandre", lastName: "Simon", email: "a.simon@financeone.fr", phone: "+33 6 11 22 33 45", jobTitle: "Directeur IT", isPrimary: false, status: "active", companyId: "c6", createdAt: "2024-02-20" },
	{ id: "ct17", firstName: "Pauline", lastName: "Laurent", email: "p.laurent@financeone.fr", jobTitle: "Risk Manager", isPrimary: false, status: "active", companyId: "c6", createdAt: "2024-05-10" },
	// BioSanté (c7) — 2 contacts
	{ id: "ct18", firstName: "Antoine", lastName: "Faure", email: "a.faure@biosante.fr", phone: "+33 6 22 33 44 56", jobTitle: "DG", isPrimary: true, status: "inactive", companyId: "c7", createdAt: "2024-01-20" },
	{ id: "ct19", firstName: "Valérie", lastName: "Chevalier", email: "v.chevalier@biosante.fr", jobTitle: "Directrice R&D", isPrimary: false, status: "inactive", companyId: "c7", createdAt: "2024-03-15" },
	// LogisTrans (c8) — 3 contacts
	{ id: "ct20", firstName: "Émilie", lastName: "Girard", email: "e.girard@logistrans.fr", phone: "+33 6 33 44 55 67", jobTitle: "Directrice Commerciale", isPrimary: true, status: "active", companyId: "c8", createdAt: "2023-06-12" },
	{ id: "ct21", firstName: "David", lastName: "Bonnet", email: "d.bonnet@logistrans.fr", phone: "+33 6 44 55 66 78", jobTitle: "DSI", isPrimary: false, status: "active", companyId: "c8", createdAt: "2023-08-20" },
	{ id: "ct22", firstName: "Sandrine", lastName: "Lemoine", email: "s.lemoine@logistrans.fr", jobTitle: "Resp. Exploitation", isPrimary: false, status: "active", companyId: "c8", createdAt: "2024-01-10" },
	// EduPro Formation (c9) — 2 contacts
	{ id: "ct23", firstName: "Lucas", lastName: "Andre", email: "l.andre@edupro.fr", phone: "+33 6 55 66 77 89", jobTitle: "Fondateur", isPrimary: true, status: "active", companyId: "c9", createdAt: "2025-02-01" },
	{ id: "ct24", firstName: "Marion", lastName: "Fournier", email: "m.fournier@edupro.fr", jobTitle: "Directrice Pédagogique", isPrimary: false, status: "active", companyId: "c9", createdAt: "2025-02-05" },
	// RetailMax (c10) — 2 contacts
	{ id: "ct25", firstName: "Julien", lastName: "Renaud", email: "j.renaud@retailmax.com", phone: "+33 6 66 77 88 90", jobTitle: "Directeur E-commerce", isPrimary: true, status: "archived", companyId: "c10", createdAt: "2023-04-15" },
	{ id: "ct26", firstName: "Cécile", lastName: "Robin", email: "c.robin@retailmax.com", jobTitle: "Acheteuse", isPrimary: false, status: "archived", companyId: "c10", createdAt: "2023-06-01" },
	// CloudNine (c11) — 3 contacts
	{ id: "ct27", firstName: "Camille", lastName: "Lemaire", email: "c.lemaire@cloudnine.io", phone: "+33 6 77 88 99 01", jobTitle: "CTO", isPrimary: true, status: "active", companyId: "c11", createdAt: "2024-09-10" },
	{ id: "ct28", firstName: "Théo", lastName: "Vincent", email: "t.vincent@cloudnine.io", jobTitle: "Lead Dev", isPrimary: false, status: "active", companyId: "c11", createdAt: "2024-10-05" },
	{ id: "ct29", firstName: "Emma", lastName: "Gauthier", email: "e.gauthier@cloudnine.io", jobTitle: "Head of Sales", isPrimary: false, status: "active", companyId: "c11", createdAt: "2024-11-15" },
	// Bâtiment Plus (c12) — 2 contacts
	{ id: "ct30", firstName: "Nicolas", lastName: "Rousseau", email: "n.rousseau@batimentplus.fr", phone: "+33 6 88 99 00 12", jobTitle: "Gérant", isPrimary: true, status: "active", companyId: "c12", createdAt: "2024-02-28" },
	{ id: "ct31", firstName: "Stéphanie", lastName: "Perrin", email: "s.perrin@batimentplus.fr", jobTitle: "Conductrice de travaux", isPrimary: false, status: "active", companyId: "c12", createdAt: "2024-04-10" },
	// NovaTech (c13) — 3 contacts
	{ id: "ct32", firstName: "Raphaël", lastName: "Muller", email: "r.muller@novatech.fr", phone: "+33 6 99 00 11 23", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c13", createdAt: "2024-06-01" },
	{ id: "ct33", firstName: "Léa", lastName: "Masson", email: "l.masson@novatech.fr", jobTitle: "VP Engineering", isPrimary: false, status: "active", companyId: "c13", createdAt: "2024-07-15" },
	{ id: "ct34", firstName: "Baptiste", lastName: "Noel", email: "b.noel@novatech.fr", jobTitle: "Sales Manager", isPrimary: false, status: "active", companyId: "c13", createdAt: "2024-08-20" },
	// Agroland (c14) — 3 contacts
	{ id: "ct35", firstName: "Philippe", lastName: "Henry", email: "p.henry@agroland.fr", phone: "+33 6 00 11 22 34", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c14", createdAt: "2024-01-15" },
	{ id: "ct36", firstName: "Catherine", lastName: "Aubert", email: "c.aubert@agroland.fr", jobTitle: "DAF", isPrimary: false, status: "active", companyId: "c14", createdAt: "2024-03-10" },
	{ id: "ct37", firstName: "Yann", lastName: "Lebreton", email: "y.lebreton@agroland.fr", jobTitle: "Dir. Industriel", isPrimary: false, status: "active", companyId: "c14", createdAt: "2024-05-20" },
	// CyberShield (c15) — 2 contacts
	{ id: "ct38", firstName: "Kevin", lastName: "Arnaud", email: "k.arnaud@cybershield.eu", phone: "+33 6 10 20 30 45", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c15", createdAt: "2024-04-20" },
	{ id: "ct39", firstName: "Mélanie", lastName: "Picard", email: "m.picard@cybershield.eu", jobTitle: "Head of Product", isPrimary: false, status: "active", companyId: "c15", createdAt: "2024-06-15" },
	// Pharma Solutions (c16) — 3 contacts
	{ id: "ct40", firstName: "Bernard", lastName: "Deschamps", email: "b.deschamps@pharmasolutions.fr", phone: "+33 6 20 30 40 56", jobTitle: "Directeur Digital", isPrimary: true, status: "active", companyId: "c16", createdAt: "2025-01-20" },
	{ id: "ct41", firstName: "Christine", lastName: "Gaillard", email: "c.gaillard@pharmasolutions.fr", jobTitle: "Directrice Achats", isPrimary: false, status: "active", companyId: "c16", createdAt: "2025-01-25" },
	{ id: "ct42", firstName: "Olivier", lastName: "Barbier", email: "o.barbier@pharmasolutions.fr", jobTitle: "CTO", isPrimary: false, status: "active", companyId: "c16", createdAt: "2025-02-01" },
	// Océan Digital (c17) — 2 contacts
	{ id: "ct43", firstName: "Manon", lastName: "Rolland", email: "m.rolland@ocean-digital.fr", phone: "+33 6 30 40 50 67", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c17", createdAt: "2024-08-12" },
	{ id: "ct44", firstName: "Florian", lastName: "Maillard", email: "f.maillard@ocean-digital.fr", jobTitle: "Lead Dev", isPrimary: false, status: "active", companyId: "c17", createdAt: "2024-09-01" },
	// AutoParts France (c18) — 3 contacts
	{ id: "ct45", firstName: "Jacques", lastName: "Lambert", email: "j.lambert@autoparts.fr", phone: "+33 6 40 50 60 78", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c18", createdAt: "2023-10-05" },
	{ id: "ct46", firstName: "Véronique", lastName: "Marchand", email: "v.marchand@autoparts.fr", jobTitle: "Directrice Supply Chain", isPrimary: false, status: "active", companyId: "c18", createdAt: "2024-01-20" },
	{ id: "ct47", firstName: "Guillaume", lastName: "Fabre", email: "g.fabre@autoparts.fr", jobTitle: "Resp. IT", isPrimary: false, status: "active", companyId: "c18", createdAt: "2024-04-15" },
	// Voyages Évasion (c19) — 2 contacts
	{ id: "ct48", firstName: "Aurélie", lastName: "Carpentier", email: "a.carpentier@voyages-evasion.fr", phone: "+33 6 50 60 70 89", jobTitle: "Directrice", isPrimary: true, status: "inactive", companyId: "c19", createdAt: "2024-03-10" },
	{ id: "ct49", firstName: "Sébastien", lastName: "Fernandez", email: "s.fernandez@voyages-evasion.fr", jobTitle: "Resp. Commercial", isPrimary: false, status: "inactive", companyId: "c19", createdAt: "2024-05-01" },
	// DataForge (c20) — 3 contacts
	{ id: "ct50", firstName: "Élodie", lastName: "Caron", email: "e.caron@dataforge.ai", phone: "+33 6 60 70 80 90", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c20", createdAt: "2024-07-01" },
	{ id: "ct51", firstName: "Thibault", lastName: "Meunier", email: "t.meunier@dataforge.ai", jobTitle: "CTO", isPrimary: false, status: "active", companyId: "c20", createdAt: "2024-08-15" },
	{ id: "ct52", firstName: "Sarah", lastName: "Colin", email: "s.colin@dataforge.ai", jobTitle: "Head of Sales", isPrimary: false, status: "active", companyId: "c20", createdAt: "2024-09-20" },
	// Habitat Concept (c21) — 2 contacts
	{ id: "ct53", firstName: "Frédéric", lastName: "Dumas", email: "f.dumas@habitatconcept.fr", phone: "+33 6 70 80 90 01", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c21", createdAt: "2024-05-15" },
	{ id: "ct54", firstName: "Hélène", lastName: "Renard", email: "h.renard@habitatconcept.fr", jobTitle: "Architecte en chef", isPrimary: false, status: "active", companyId: "c21", createdAt: "2024-07-01" },
	// Lumière Studios (c22) — 2 contacts
	{ id: "ct55", firstName: "Valentin", lastName: "Brunet", email: "v.brunet@lumiere-studios.com", phone: "+33 6 80 90 01 12", jobTitle: "Directeur Artistique", isPrimary: true, status: "active", companyId: "c22", createdAt: "2024-11-20" },
	{ id: "ct56", firstName: "Inès", lastName: "Roy", email: "i.roy@lumiere-studios.com", jobTitle: "Productrice", isPrimary: false, status: "active", companyId: "c22", createdAt: "2024-12-05" },
	// Express Logistique (c23) — 3 contacts
	{ id: "ct57", firstName: "Patrick", lastName: "Gonzalez", email: "p.gonzalez@express-logistique.fr", phone: "+33 6 90 01 12 23", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c23", createdAt: "2023-12-01" },
	{ id: "ct58", firstName: "Sylvie", lastName: "Boyer", email: "s.boyer@express-logistique.fr", jobTitle: "Directrice Opérations", isPrimary: false, status: "active", companyId: "c23", createdAt: "2024-02-15" },
	{ id: "ct59", firstName: "Jérôme", lastName: "Nguyen", email: "j.nguyen@express-logistique.fr", jobTitle: "Resp. IT", isPrimary: false, status: "active", companyId: "c23", createdAt: "2024-05-20" },
	// SolarTech (c24) — 2 contacts
	{ id: "ct60", firstName: "Margaux", lastName: "Lecomte", email: "m.lecomte@solartech.fr", phone: "+33 6 01 12 23 34", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c24", createdAt: "2025-01-15" },
	{ id: "ct61", firstName: "Clément", lastName: "Gerard", email: "c.gerard@solartech.fr", jobTitle: "Directeur Technique", isPrimary: false, status: "active", companyId: "c24", createdAt: "2025-01-25" },
	// BankSecure (c25) — 2 contacts
	{ id: "ct62", firstName: "Diane", lastName: "Dupuis", email: "d.dupuis@banksecure.fr", phone: "+33 6 12 23 34 45", jobTitle: "Directrice Partenariats", isPrimary: true, status: "active", companyId: "c25", createdAt: "2024-02-10" },
	{ id: "ct63", firstName: "Marc", lastName: "Prevost", email: "m.prevost@banksecure.fr", jobTitle: "RSSI", isPrimary: false, status: "active", companyId: "c25", createdAt: "2024-04-20" },
	// MedLab (c26) — 2 contacts
	{ id: "ct64", firstName: "Anne", lastName: "Schneider", email: "a.schneider@medlab.fr", phone: "+33 6 23 34 45 56", jobTitle: "Directrice", isPrimary: true, status: "active", companyId: "c26", createdAt: "2024-09-05" },
	{ id: "ct65", firstName: "Paul", lastName: "Klein", email: "p.klein@medlab.fr", jobTitle: "Biologiste en chef", isPrimary: false, status: "active", companyId: "c26", createdAt: "2024-10-10" },
	// DigiSchool (c28) — 2 contacts
	{ id: "ct66", firstName: "Justine", lastName: "Guerin", email: "j.guerin@digischool.fr", phone: "+33 6 34 45 56 67", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c28", createdAt: "2024-06-15" },
	{ id: "ct67", firstName: "Adrien", lastName: "Berger", email: "a.berger@digischool.fr", jobTitle: "CTO", isPrimary: false, status: "active", companyId: "c28", createdAt: "2024-08-01" },
	// Vino Grand Cru (c29) — 2 contacts
	{ id: "ct68", firstName: "Thierry", lastName: "Delacroix", email: "t.delacroix@vinograndcru.fr", phone: "+33 6 45 56 67 78", jobTitle: "Propriétaire", isPrimary: true, status: "active", companyId: "c29", createdAt: "2024-10-01" },
	{ id: "ct69", firstName: "Florence", lastName: "Vasseur", email: "f.vasseur@vinograndcru.fr", jobTitle: "Directrice Export", isPrimary: false, status: "active", companyId: "c29", createdAt: "2024-11-10" },
	// RoboFactory (c30) — 2 contacts
	{ id: "ct70", firstName: "Damien", lastName: "Legrand", email: "d.legrand@robofactory.fr", phone: "+33 6 56 67 78 89", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c30", createdAt: "2025-02-05" },
	{ id: "ct71", firstName: "Céline", lastName: "Marechal", email: "c.marechal@robofactory.fr", jobTitle: "VP R&D", isPrimary: false, status: "active", companyId: "c30", createdAt: "2025-02-10" },
	// Airbus Ventures (c31) — 2 contacts
	{ id: "ct72", firstName: "Jean-Marc", lastName: "Peyrat", email: "jm.peyrat@airbus-ventures.com", phone: "+33 6 67 78 89 90", jobTitle: "Investment Director", isPrimary: true, status: "active", companyId: "c31", createdAt: "2025-01-28" },
	{ id: "ct73", firstName: "Isabelle", lastName: "Torres", email: "i.torres@airbus-ventures.com", jobTitle: "Program Manager", isPrimary: false, status: "active", companyId: "c31", createdAt: "2025-02-03" },
	// Mode & Style (c32) — 2 contacts
	{ id: "ct74", firstName: "Audrey", lastName: "Charles", email: "a.charles@modestyle.fr", phone: "+33 6 78 89 90 01", jobTitle: "Directrice Commerciale", isPrimary: true, status: "active", companyId: "c32", createdAt: "2024-04-12" },
	{ id: "ct75", firstName: "Vincent", lastName: "David", email: "v.david@modestyle.fr", jobTitle: "Resp. E-commerce", isPrimary: false, status: "active", companyId: "c32", createdAt: "2024-06-20" },
	// AssurPlus (c33) — 2 contacts
	{ id: "ct76", firstName: "Christophe", lastName: "Martinez", email: "c.martinez@assurplus.fr", phone: "+33 6 89 90 01 12", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c33", createdAt: "2024-01-08" },
	{ id: "ct77", firstName: "Laura", lastName: "Sanchez", email: "l.sanchez@assurplus.fr", jobTitle: "Directrice Technique", isPrimary: false, status: "active", companyId: "c33", createdAt: "2024-03-15" },
	// HealthConnect (c34) — 2 contacts
	{ id: "ct78", firstName: "Gabriel", lastName: "Lefevre", email: "g.lefevre@healthconnect.fr", phone: "+33 6 90 01 12 23", jobTitle: "Fondateur", isPrimary: true, status: "active", companyId: "c34", createdAt: "2024-08-25" },
	{ id: "ct79", firstName: "Marine", lastName: "Weber", email: "m.weber@healthconnect.fr", jobTitle: "Directrice Médicale", isPrimary: false, status: "active", companyId: "c34", createdAt: "2024-09-15" },
	// TransAlpes (c35) — 2 contacts
	{ id: "ct80", firstName: "Éric", lastName: "Blanc", email: "e.blanc@transalpes.fr", phone: "+33 6 01 23 34 45", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c35", createdAt: "2024-03-20" },
	{ id: "ct81", firstName: "Nadia", lastName: "Roche", email: "n.roche@transalpes.fr", jobTitle: "Resp. Flotte", isPrimary: false, status: "active", companyId: "c35", createdAt: "2024-05-10" },
	// SmartGrid Energy (c37) — 2 contacts
	{ id: "ct82", firstName: "Mathieu", lastName: "Giraud", email: "m.giraud@smartgrid-energy.eu", phone: "+33 6 12 34 45 56", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c37", createdAt: "2024-11-01" },
	{ id: "ct83", firstName: "Laure", lastName: "Colas", email: "l.colas@smartgrid-energy.eu", jobTitle: "Ingénieure Systèmes", isPrimary: false, status: "active", companyId: "c37", createdAt: "2024-12-15" },
	// Brasserie du Nord (c38) — 2 contacts
	{ id: "ct84", firstName: "Michel", lastName: "Vanderberghe", email: "m.vanderberghe@brasseriedunord.fr", phone: "+33 6 23 45 56 67", jobTitle: "Maître Brasseur", isPrimary: true, status: "active", companyId: "c38", createdAt: "2024-02-14" },
	{ id: "ct85", firstName: "Estelle", lastName: "Delattre", email: "e.delattre@brasseriedunord.fr", jobTitle: "Directrice Commerciale", isPrimary: false, status: "active", companyId: "c38", createdAt: "2024-04-20" },
	// Campus Online (c39) — 2 contacts
	{ id: "ct86", firstName: "Arnaud", lastName: "Tessier", email: "a.tessier@campus-online.fr", phone: "+33 6 34 56 67 78", jobTitle: "Fondateur", isPrimary: true, status: "active", companyId: "c39", createdAt: "2025-01-10" },
	{ id: "ct87", firstName: "Célia", lastName: "Brun", email: "c.brun@campus-online.fr", jobTitle: "Directrice Contenu", isPrimary: false, status: "active", companyId: "c39", createdAt: "2025-01-20" },
	// ArchiBuild (c40) — 3 contacts
	{ id: "ct88", firstName: "Louis", lastName: "Vidal", email: "l.vidal@archibuild.fr", phone: "+33 6 45 67 78 89", jobTitle: "DG", isPrimary: true, status: "active", companyId: "c40", createdAt: "2023-11-25" },
	{ id: "ct89", firstName: "Alexandra", lastName: "Leconte", email: "a.leconte@archibuild.fr", jobTitle: "Directrice Projets", isPrimary: false, status: "active", companyId: "c40", createdAt: "2024-02-10" },
	{ id: "ct90", firstName: "Julien", lastName: "Bouchet", email: "j.bouchet@archibuild.fr", jobTitle: "BIM Manager", isPrimary: false, status: "active", companyId: "c40", createdAt: "2024-06-01" },
	// PixelWave (c41) — 2 contacts
	{ id: "ct91", firstName: "Quentin", lastName: "Riviere", email: "q.riviere@pixelwave.io", phone: "+33 6 56 78 89 90", jobTitle: "CEO & Dev", isPrimary: true, status: "active", companyId: "c41", createdAt: "2024-12-01" },
	{ id: "ct92", firstName: "Clara", lastName: "Ferreira", email: "c.ferreira@pixelwave.io", jobTitle: "Designer", isPrimary: false, status: "active", companyId: "c41", createdAt: "2025-01-05" },
	// Aéro Composites (c42) — 3 contacts
	{ id: "ct93", firstName: "Gérard", lastName: "Bouvier", email: "g.bouvier@aerocomposites.fr", phone: "+33 6 67 89 90 01", jobTitle: "Directeur Industriel", isPrimary: true, status: "active", companyId: "c42", createdAt: "2024-05-05" },
	{ id: "ct94", firstName: "Monique", lastName: "Pascal", email: "m.pascal@aerocomposites.fr", jobTitle: "Directrice Qualité", isPrimary: false, status: "active", companyId: "c42", createdAt: "2024-07-20" },
	{ id: "ct95", firstName: "Benoit", lastName: "Guillet", email: "b.guillet@aerocomposites.fr", jobTitle: "Resp. Innovation", isPrimary: false, status: "active", companyId: "c42", createdAt: "2024-09-10" },
	// FoodTech Labs (c43) — 2 contacts
	{ id: "ct96", firstName: "Lise", lastName: "Dupuis", email: "l.dupuis@foodtechlabs.fr", phone: "+33 6 78 90 01 12", jobTitle: "CEO", isPrimary: true, status: "active", companyId: "c43", createdAt: "2024-09-20" },
	{ id: "ct97", firstName: "Rémi", lastName: "Tanguy", email: "r.tanguy@foodtechlabs.fr", jobTitle: "CTO", isPrimary: false, status: "active", companyId: "c43", createdAt: "2024-10-15" },
	// Carrefour Digital (c44) — 3 contacts
	{ id: "ct98", firstName: "Stéphane", lastName: "Hubert", email: "s.hubert@carrefour-digital.fr", phone: "+33 6 89 01 12 23", jobTitle: "VP Digital", isPrimary: true, status: "active", companyId: "c44", createdAt: "2025-02-10" },
	{ id: "ct99", firstName: "Delphine", lastName: "Joly", email: "d.joly@carrefour-digital.fr", jobTitle: "Directrice Innovation", isPrimary: false, status: "active", companyId: "c44", createdAt: "2025-02-12" },
	{ id: "ct100", firstName: "Franck", lastName: "Lemaire", email: "f.lemaire@carrefour-digital.fr", jobTitle: "Resp. Achats Tech", isPrimary: false, status: "active", companyId: "c44", createdAt: "2025-02-13" },
	// Therma Solutions (c45) — 2 contacts
	{ id: "ct101", firstName: "Sabrina", lastName: "Costa", email: "s.costa@therma.fr", phone: "+33 6 90 12 23 34", jobTitle: "Directrice", isPrimary: true, status: "active", companyId: "c45", createdAt: "2024-07-22" },
	{ id: "ct102", firstName: "Jérémie", lastName: "Prost", email: "j.prost@therma.fr", jobTitle: "Ingénieur Thermique", isPrimary: false, status: "active", companyId: "c45", createdAt: "2024-09-10" },
	// Cabinet Legrand (c46) — 1 contact
	{ id: "ct103", firstName: "Pierre-Yves", lastName: "Legrand", email: "py.legrand@legrand-conseil.fr", phone: "+33 6 01 23 45 56", jobTitle: "Fondateur", isPrimary: true, status: "active", companyId: "c46", createdAt: "2024-10-15" },
	// SportZone (c48) — 3 contacts
	{ id: "ct104", firstName: "Romain", lastName: "Charron", email: "r.charron@sportzone.fr", phone: "+33 6 12 34 56 67", jobTitle: "Directeur Retail", isPrimary: true, status: "active", companyId: "c48", createdAt: "2024-01-20" },
	{ id: "ct105", firstName: "Anaïs", lastName: "Petit", email: "a.petit@sportzone.fr", jobTitle: "Directrice Marketing", isPrimary: false, status: "active", companyId: "c48", createdAt: "2024-04-15" },
	{ id: "ct106", firstName: "Kévin", lastName: "Morin", email: "k.morin@sportzone.fr", jobTitle: "Resp. E-commerce", isPrimary: false, status: "active", companyId: "c48", createdAt: "2024-07-01" },
	// Clinique Étoile (c49) — 2 contacts
	{ id: "ct107", firstName: "Dr. Caroline", lastName: "Girard", email: "c.girard@clinique-etoile.fr", phone: "+33 6 23 45 67 78", jobTitle: "Directrice Médicale", isPrimary: true, status: "active", companyId: "c49", createdAt: "2024-06-30" },
	{ id: "ct108", firstName: "Mathias", lastName: "Poirier", email: "m.poirier@clinique-etoile.fr", jobTitle: "Administrateur", isPrimary: false, status: "active", companyId: "c49", createdAt: "2024-08-15" },
	// TelcoNet (c50) — 3 contacts
	{ id: "ct109", firstName: "Emmanuel", lastName: "Bertrand", email: "e.bertrand@telconet.fr", phone: "+33 6 34 56 78 89", jobTitle: "VP Enterprise", isPrimary: true, status: "active", companyId: "c50", createdAt: "2023-05-10" },
	{ id: "ct110", firstName: "Nathalie", lastName: "Richard", email: "n.richard@telconet.fr", jobTitle: "Directrice Grands Comptes", isPrimary: false, status: "active", companyId: "c50", createdAt: "2023-08-20" },
	{ id: "ct111", firstName: "Thomas", lastName: "Gaudin", email: "t.gaudin@telconet.fr", jobTitle: "Architecte Solutions", isPrimary: false, status: "active", companyId: "c50", createdAt: "2024-01-10" },
	// Additional contacts for depth on key companies
	{ id: "ct112", firstName: "Marina", lastName: "Kowalski", email: "m.kowalski@financeone.fr", jobTitle: "Analyste", isPrimary: false, status: "active", companyId: "c6", createdAt: "2024-08-10" },
	{ id: "ct113", firstName: "Rémy", lastName: "Garnier", email: "r.garnier@logistrans.fr", jobTitle: "Chef de projet IT", isPrimary: false, status: "active", companyId: "c8", createdAt: "2024-06-15" },
	{ id: "ct114", firstName: "Julia", lastName: "Santos", email: "j.santos@dataforge.ai", jobTitle: "Data Scientist", isPrimary: false, status: "active", companyId: "c20", createdAt: "2024-11-01" },
	{ id: "ct115", firstName: "Damien", lastName: "Fleury", email: "d.fleury@archibuild.fr", jobTitle: "Chef de chantier", isPrimary: false, status: "active", companyId: "c40", createdAt: "2024-08-20" },
	{ id: "ct116", firstName: "Virginie", lastName: "Collin", email: "v.collin@express-logistique.fr", jobTitle: "DAF", isPrimary: false, status: "active", companyId: "c23", createdAt: "2024-07-10" },
	{ id: "ct117", firstName: "Fabien", lastName: "Moulin", email: "f.moulin@aerocomposites.fr", jobTitle: "Dir. Commercial", isPrimary: false, status: "active", companyId: "c42", createdAt: "2024-11-20" },
	{ id: "ct118", firstName: "Carla", lastName: "Bianchi", email: "c.bianchi@pharmasolutions.fr", jobTitle: "Chef de Produit", isPrimary: false, status: "active", companyId: "c16", createdAt: "2025-02-08" },
	{ id: "ct119", firstName: "Yannick", lastName: "Corre", email: "y.corre@autoparts.fr", jobTitle: "Dir. Qualité", isPrimary: false, status: "active", companyId: "c18", createdAt: "2024-08-01" },
	{ id: "ct120", firstName: "Mélissa", lastName: "Huet", email: "m.huet@telconet.fr", jobTitle: "Account Manager", isPrimary: false, status: "active", companyId: "c50", createdAt: "2024-04-15" },
]

// Hydrate contacts with companyName
export const contacts: Contact[] = contactsRaw.map((c) => {
	const company = companies.find((co) => co.id === c.companyId)
	return { ...c, companyName: company?.name ?? "" }
})

/* ─── Deals (35) ─── */

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
	{ id: "d13", title: "Infra NovaTech", amount: 42000, stage: "proposal", probability: 45, expectedCloseDate: "2025-05-01", source: "Inbound", companyId: "c13", companyName: "NovaTech", contactName: "Raphaël Muller", assignedTo: "Julie Dufresne", createdAt: "2025-01-08" },
	{ id: "d14", title: "Digitalisation Agroland", amount: 180000, stage: "qualified", probability: 25, expectedCloseDate: "2025-08-01", source: "Salon", companyId: "c14", companyName: "Agroland", contactName: "Philippe Henry", assignedTo: "Antoine Moreau", createdAt: "2024-12-20" },
	{ id: "d15", title: "SOC CyberShield", amount: 56000, stage: "negotiation", probability: 75, expectedCloseDate: "2025-03-20", source: "Inbound", companyId: "c15", companyName: "CyberShield", contactName: "Kevin Arnaud", assignedTo: "Sophie Martin", createdAt: "2024-11-10" },
	{ id: "d16", title: "CRM Pharma Solutions", amount: 200000, stage: "lead", probability: 10, expectedCloseDate: "2025-09-01", source: "Outbound", companyId: "c16", companyName: "Pharma Solutions", contactName: "Bernard Deschamps", assignedTo: "Marc Leroy", createdAt: "2025-02-10" },
	{ id: "d17", title: "Site web Océan Digital", amount: 15000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-01-15", source: "Inbound", companyId: "c17", companyName: "Océan Digital", contactName: "Manon Rolland", assignedTo: "Léa Petit", createdAt: "2024-10-20" },
	{ id: "d18", title: "MES AutoParts", amount: 150000, stage: "proposal", probability: 35, expectedCloseDate: "2025-06-15", source: "Salon", companyId: "c18", companyName: "AutoParts France", contactName: "Jacques Lambert", assignedTo: "Antoine Moreau", createdAt: "2025-01-05" },
	{ id: "d19", title: "Data Platform DataForge", amount: 88000, stage: "qualified", probability: 50, expectedCloseDate: "2025-05-30", source: "Partenaire", companyId: "c20", companyName: "DataForge", contactName: "Élodie Caron", assignedTo: "Sophie Martin", createdAt: "2025-01-18" },
	{ id: "d20", title: "BIM Habitat Concept", amount: 65000, stage: "proposal", probability: 55, expectedCloseDate: "2025-04-20", source: "Inbound", companyId: "c21", companyName: "Habitat Concept", contactName: "Frédéric Dumas", assignedTo: "Marc Leroy", createdAt: "2025-01-12" },
	{ id: "d21", title: "Streaming Lumière Studios", amount: 38000, stage: "lead", probability: 20, expectedCloseDate: "2025-06-30", source: "LinkedIn", companyId: "c22", companyName: "Lumière Studios", contactName: "Valentin Brunet", assignedTo: "Léa Petit", createdAt: "2025-02-05" },
	{ id: "d22", title: "TMS Express Logistique", amount: 110000, stage: "negotiation", probability: 65, expectedCloseDate: "2025-04-01", source: "Inbound", companyId: "c23", companyName: "Express Logistique", contactName: "Patrick Gonzalez", assignedTo: "Antoine Moreau", createdAt: "2024-12-15" },
	{ id: "d23", title: "Monitoring SolarTech", amount: 52000, stage: "qualified", probability: 35, expectedCloseDate: "2025-05-15", source: "Référencement", companyId: "c24", companyName: "SolarTech", contactName: "Margaux Lecomte", assignedTo: "Julie Dufresne", createdAt: "2025-02-01" },
	{ id: "d24", title: "Compliance BankSecure", amount: 78000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-02-10", source: "Partenaire", companyId: "c25", companyName: "BankSecure", contactName: "Diane Dupuis", assignedTo: "Sophie Martin", createdAt: "2024-09-15" },
	{ id: "d25", title: "LIMS MedLab", amount: 44000, stage: "proposal", probability: 45, expectedCloseDate: "2025-04-30", source: "Outbound", companyId: "c26", companyName: "MedLab", contactName: "Anne Schneider", assignedTo: "Marc Leroy", createdAt: "2025-01-22" },
	{ id: "d26", title: "LMS DigiSchool", amount: 32000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-01-20", source: "Inbound", companyId: "c28", companyName: "DigiSchool", contactName: "Justine Guerin", assignedTo: "Julie Dufresne", createdAt: "2024-10-05" },
	{ id: "d27", title: "E-commerce Vino Grand Cru", amount: 22000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-02-05", source: "LinkedIn", companyId: "c29", companyName: "Vino Grand Cru", contactName: "Thierry Delacroix", assignedTo: "Antoine Moreau", createdAt: "2024-11-15" },
	{ id: "d28", title: "MES RoboFactory", amount: 95000, stage: "lead", probability: 15, expectedCloseDate: "2025-07-01", source: "Salon", companyId: "c30", companyName: "RoboFactory", contactName: "Damien Legrand", assignedTo: "Sophie Martin", createdAt: "2025-02-12" },
	{ id: "d29", title: "Portail Mode & Style", amount: 48000, stage: "negotiation", probability: 70, expectedCloseDate: "2025-03-25", source: "Outbound", companyId: "c32", companyName: "Mode & Style", contactName: "Audrey Charles", assignedTo: "Léa Petit", createdAt: "2024-12-10" },
	{ id: "d30", title: "CRM AssurPlus", amount: 68000, stage: "qualified", probability: 30, expectedCloseDate: "2025-05-20", source: "Partenaire", companyId: "c33", companyName: "AssurPlus", contactName: "Christophe Martinez", assignedTo: "Antoine Moreau", createdAt: "2025-01-28" },
	{ id: "d31", title: "Télémédecine HealthConnect", amount: 36000, stage: "proposal", probability: 50, expectedCloseDate: "2025-04-15", source: "Inbound", companyId: "c34", companyName: "HealthConnect", contactName: "Gabriel Lefevre", assignedTo: "Julie Dufresne", createdAt: "2025-01-30" },
	{ id: "d32", title: "Gestion flotte TransAlpes", amount: 55000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-01-28", source: "Inbound", companyId: "c35", companyName: "TransAlpes", contactName: "Éric Blanc", assignedTo: "Marc Leroy", createdAt: "2024-10-01" },
	{ id: "d33", title: "IoT SmartGrid Energy", amount: 72000, stage: "qualified", probability: 35, expectedCloseDate: "2025-06-01", source: "Référencement", companyId: "c37", companyName: "SmartGrid Energy", contactName: "Mathieu Giraud", assignedTo: "Léa Petit", createdAt: "2025-02-03" },
	{ id: "d34", title: "BIM ArchiBuild", amount: 125000, stage: "proposal", probability: 40, expectedCloseDate: "2025-05-15", source: "Salon", companyId: "c40", companyName: "ArchiBuild", contactName: "Louis Vidal", assignedTo: "Marc Leroy", createdAt: "2025-01-14" },
	{ id: "d35", title: "Network TelcoNet", amount: 190000, stage: "closed_lost", probability: 0, expectedCloseDate: "2025-02-01", source: "Outbound", companyId: "c50", companyName: "TelcoNet", contactName: "Emmanuel Bertrand", assignedTo: "Sophie Martin", createdAt: "2024-08-20" },
]

/* ─── Quotes (15) ─── */

export const quotes: Quote[] = [
	{ id: "q1", reference: "DEV-2025-001", status: "sent", dealTitle: "Migration cloud Acme", companyName: "Acme Corp", total: 85000, validUntil: "2025-03-31", createdBy: "Sophie Martin", createdAt: "2025-01-25" },
	{ id: "q2", reference: "DEV-2025-002", status: "draft", dealTitle: "Licence SaaS TechVision", companyName: "TechVision SAS", total: 24000, validUntil: "2025-04-30", createdBy: "Sophie Martin", createdAt: "2025-02-05" },
	{ id: "q3", reference: "DEV-2025-003", status: "accepted", dealTitle: "Refonte site MédiaSud", companyName: "MédiaSud", total: 18000, validUntil: "2025-02-28", createdBy: "Sophie Martin", createdAt: "2025-01-10" },
	{ id: "q4", reference: "DEV-2025-004", status: "sent", dealTitle: "Plateforme trading FinanceOne", companyName: "FinanceOne", total: 450000, validUntil: "2025-05-31", createdBy: "Marc Leroy", createdAt: "2025-02-01" },
	{ id: "q5", reference: "DEV-2025-005", status: "accepted", dealTitle: "CRM Bâtiment Plus", companyName: "Bâtiment Plus", total: 28000, validUntil: "2025-03-01", createdBy: "Marc Leroy", createdAt: "2024-12-15" },
	{ id: "q6", reference: "DEV-2025-006", status: "rejected", dealTitle: "Support premium Acme", companyName: "Acme Corp", total: 12000, validUntil: "2025-01-31", createdBy: "Sophie Martin", createdAt: "2024-12-20" },
	{ id: "q7", reference: "DEV-2025-007", status: "draft", dealTitle: "App mobile LogisTrans", companyName: "LogisTrans", total: 95000, validUntil: "2025-04-15", createdBy: "Sophie Martin", createdAt: "2025-02-10" },
	{ id: "q8", reference: "DEV-2025-008", status: "expired", dealTitle: "ERP Industrie Dupont", companyName: "Industrie Dupont", total: 320000, validUntil: "2025-01-15", createdBy: "Marc Leroy", createdAt: "2024-11-01" },
	{ id: "q9", reference: "DEV-2025-009", status: "accepted", dealTitle: "Compliance BankSecure", companyName: "BankSecure", total: 78000, validUntil: "2025-03-15", createdBy: "Sophie Martin", createdAt: "2024-12-01" },
	{ id: "q10", reference: "DEV-2025-010", status: "sent", dealTitle: "SOC CyberShield", companyName: "CyberShield", total: 56000, validUntil: "2025-04-20", createdBy: "Sophie Martin", createdAt: "2025-02-01" },
	{ id: "q11", reference: "DEV-2025-011", status: "accepted", dealTitle: "Gestion flotte TransAlpes", companyName: "TransAlpes", total: 55000, validUntil: "2025-02-28", createdBy: "Marc Leroy", createdAt: "2024-11-15" },
	{ id: "q12", reference: "DEV-2025-012", status: "draft", dealTitle: "TMS Express Logistique", companyName: "Express Logistique", total: 110000, validUntil: "2025-05-01", createdBy: "Antoine Moreau", createdAt: "2025-02-08" },
	{ id: "q13", reference: "DEV-2025-013", status: "accepted", dealTitle: "LMS DigiSchool", companyName: "DigiSchool", total: 32000, validUntil: "2025-02-15", createdBy: "Julie Dufresne", createdAt: "2024-12-10" },
	{ id: "q14", reference: "DEV-2025-014", status: "sent", dealTitle: "Portail Mode & Style", companyName: "Mode & Style", total: 48000, validUntil: "2025-04-25", createdBy: "Léa Petit", createdAt: "2025-02-05" },
	{ id: "q15", reference: "DEV-2025-015", status: "rejected", dealTitle: "Network TelcoNet", companyName: "TelcoNet", total: 190000, validUntil: "2025-02-15", createdBy: "Sophie Martin", createdAt: "2024-12-18" },
]

/* ─── Products (20) ─── */

export const products: Product[] = [
	{ id: "p1", name: "Forge CRM — Starter", description: "Licence CRM pour petites équipes (jusqu'à 5 utilisateurs)", sku: "CRM-START-01", unitPrice: 49, currency: "EUR", category: "Licence", status: "active", stock: 320, reorderDate: "2025-03-15" },
	{ id: "p2", name: "Forge CRM — Business", description: "Licence CRM pour équipes moyennes (jusqu'à 25 utilisateurs)", sku: "CRM-BIZ-01", unitPrice: 149, currency: "EUR", category: "Licence", status: "active", stock: 185, reorderDate: "2025-04-01" },
	{ id: "p3", name: "Forge CRM — Enterprise", description: "Licence CRM illimitée avec support dédié", sku: "CRM-ENT-01", unitPrice: 499, currency: "EUR", category: "Licence", status: "active", stock: 42, reorderDate: "2025-03-20" },
	{ id: "p4", name: "Migration données", description: "Service de migration depuis un CRM existant", sku: "SRV-MIG-01", unitPrice: 2500, currency: "EUR", category: "Service", status: "active", stock: 15, reorderDate: "2025-06-01" },
	{ id: "p5", name: "Formation utilisateur", description: "Formation d'une journée pour l'équipe commerciale", sku: "SRV-FORM-01", unitPrice: 800, currency: "EUR", category: "Service", status: "active", stock: 50, reorderDate: "2025-05-10" },
	{ id: "p6", name: "Intégration API", description: "Développement sur mesure d'intégrations API", sku: "SRV-API-01", unitPrice: 5000, currency: "EUR", category: "Service", status: "active", stock: 8, reorderDate: "2025-04-15" },
	{ id: "p7", name: "Support Premium", description: "Support prioritaire 24/7 avec SLA garanti", sku: "SUP-PREM-01", unitPrice: 200, currency: "EUR", category: "Support", status: "active", stock: 200, reorderDate: "2025-03-01" },
	{ id: "p8", name: "Module Analytics", description: "Add-on reporting et analytics avancés", sku: "MOD-ANA-01", unitPrice: 79, currency: "EUR", category: "Module", status: "active", stock: 410, reorderDate: "2025-07-01" },
	{ id: "p9", name: "Module Email", description: "Add-on campagnes email intégrées", sku: "MOD-MAIL-01", unitPrice: 59, currency: "EUR", category: "Module", status: "active", stock: 375, reorderDate: "2025-06-15" },
	{ id: "p10", name: "Ancien CRM v1", description: "Ancienne version du CRM (obsolète)", sku: "CRM-V1-01", unitPrice: 29, currency: "EUR", category: "Licence", status: "discontinued", stock: 0, reorderDate: "2024-01-01" },
	{ id: "p11", name: "Module Devis", description: "Génération et suivi de devis automatisés", sku: "MOD-DEVIS-01", unitPrice: 69, currency: "EUR", category: "Module", status: "active", stock: 290, reorderDate: "2025-05-20" },
	{ id: "p12", name: "Formation Admin", description: "Formation administration et configuration avancée (2 jours)", sku: "SRV-FORM-02", unitPrice: 1500, currency: "EUR", category: "Service", status: "active", stock: 25, reorderDate: "2025-04-10" },
	{ id: "p13", name: "Module Téléphonie", description: "Intégration CTI pour appels depuis le CRM", sku: "MOD-TEL-01", unitPrice: 89, currency: "EUR", category: "Module", status: "active", stock: 155, reorderDate: "2025-08-01" },
	{ id: "p14", name: "Support Standard", description: "Support par email du lundi au vendredi", sku: "SUP-STD-01", unitPrice: 50, currency: "EUR", category: "Support", status: "active", stock: 500, reorderDate: "2025-03-10" },
	{ id: "p15", name: "Module Import/Export", description: "Import et export de données en masse (CSV, Excel)", sku: "MOD-IMP-01", unitPrice: 39, currency: "EUR", category: "Module", status: "active", stock: 440, reorderDate: "2025-09-01" },
	{ id: "p16", name: "Audit Sécurité", description: "Audit complet de sécurité et conformité RGPD", sku: "SRV-AUDIT-01", unitPrice: 3500, currency: "EUR", category: "Service", status: "active", stock: 10, reorderDate: "2025-05-01" },
	{ id: "p17", name: "Module Signature", description: "Signature électronique intégrée pour devis et contrats", sku: "MOD-SIGN-01", unitPrice: 99, currency: "EUR", category: "Module", status: "active", stock: 230, reorderDate: "2025-06-20" },
	{ id: "p18", name: "Connecteur ERP", description: "Synchronisation bidirectionnelle avec ERP (SAP, Sage, etc.)", sku: "SRV-ERP-01", unitPrice: 8000, currency: "EUR", category: "Service", status: "active", stock: 3, reorderDate: "2025-04-20" },
	{ id: "p19", name: "Module Prévisions", description: "Prédiction de CA et scoring de deals par IA", sku: "MOD-PREV-01", unitPrice: 129, currency: "EUR", category: "Module", status: "inactive", stock: 60, reorderDate: "2025-10-01" },
	{ id: "p20", name: "Pack Onboarding", description: "Migration + Formation + 3 mois de support premium", sku: "PKG-ONB-01", unitPrice: 4500, currency: "EUR", category: "Service", status: "active", stock: 12, reorderDate: "2025-03-25" },
]

/* ─── Dashboard Stats ─── */

export const dashboardStats: DashboardStats = {
	activeClients: 34,
	activeClientsTrend: 12.5,
	monthlyDeals: 8,
	dealsTrend: 25,
	revenue: "3 847 000 €",
	revenueTrend: 8.3,
	avgDealSize: "87 477 €",
	avgDealTrend: -3.2,
}

export const revenueChartData = [
	{ month: "Sep", revenue: 165000 },
	{ month: "Oct", revenue: 198000 },
	{ month: "Nov", revenue: 245000 },
	{ month: "Déc", revenue: 188000 },
	{ month: "Jan", revenue: 313000 },
	{ month: "Fév", revenue: 380000 },
]

export const dealsByStageData = [
	{ name: "Lead", count: 5 },
	{ name: "Qualifié", count: 7 },
	{ name: "Proposition", count: 8 },
	{ name: "Négociation", count: 6 },
	{ name: "Gagné", count: 7 },
	{ name: "Perdu", count: 2 },
]

export const recentActivities: Activity[] = [
	{ date: "2025-02-14T10:30:00", user: "Sophie Martin", action: "Deal mis à jour", detail: "Consulting FinanceOne → Négociation" },
	{ date: "2025-02-14T09:15:00", user: "Léa Petit", action: "Devis envoyé", detail: "DEV-2025-014 à Mode & Style" },
	{ date: "2025-02-13T16:45:00", user: "Marc Leroy", action: "Devis créé", detail: "DEV-2025-007 pour LogisTrans" },
	{ date: "2025-02-13T14:20:00", user: "Antoine Moreau", action: "Deal créé", detail: "TMS Express Logistique (110 000 €)" },
	{ date: "2025-02-12T11:00:00", user: "Julie Dufresne", action: "Appel client", detail: "Justine Guerin (DigiSchool) — suivi post-vente" },
	{ date: "2025-02-12T09:15:00", user: "Sophie Martin", action: "Contact ajouté", detail: "Camille Lemaire (CloudNine)" },
	{ date: "2025-02-11T17:30:00", user: "Marc Leroy", action: "Deal gagné", detail: "Gestion flotte TransAlpes (55 000 €)" },
	{ date: "2025-02-10T14:00:00", user: "Sophie Martin", action: "Entreprise créée", detail: "GreenEnergy ajoutée au CRM" },
	{ date: "2025-02-10T10:45:00", user: "Léa Petit", action: "Email envoyé", detail: "Relance SmartGrid Energy — proposition IoT" },
	{ date: "2025-02-08T11:30:00", user: "Marc Leroy", action: "Deal créé", detail: "LMS EduPro (35 000 €)" },
	{ date: "2025-02-07T16:15:00", user: "Antoine Moreau", action: "RDV client", detail: "Christophe Martinez (AssurPlus) — démo CRM" },
	{ date: "2025-02-06T09:00:00", user: "Julie Dufresne", action: "Deal qualifié", detail: "Monitoring SolarTech → Qualifié" },
	{ date: "2025-02-05T17:00:00", user: "Sophie Martin", action: "Devis envoyé", detail: "DEV-2025-002 à TechVision SAS" },
	{ date: "2025-02-05T14:30:00", user: "Léa Petit", action: "Appel prospect", detail: "Valentin Brunet (Lumière Studios) — qualification" },
	{ date: "2025-02-04T11:15:00", user: "Marc Leroy", action: "Entreprise créée", detail: "Carrefour Digital ajouté au CRM" },
	{ date: "2025-02-03T15:45:00", user: "Sophie Martin", action: "Deal mis à jour", detail: "SOC CyberShield → Négociation" },
	{ date: "2025-02-01T10:00:00", user: "Marc Leroy", action: "Devis accepté", detail: "DEV-2025-005 par Bâtiment Plus" },
	{ date: "2025-01-31T14:00:00", user: "Antoine Moreau", action: "Note ajoutée", detail: "Agroland — potentiel ERP, budget en cours de validation" },
	{ date: "2025-01-30T09:30:00", user: "Julie Dufresne", action: "Deal créé", detail: "Télémédecine HealthConnect (36 000 €)" },
	{ date: "2025-01-28T16:00:00", user: "Sophie Martin", action: "Email client", detail: "Rappel devis à CyberShield — échéance proche" },
]

/* ─── Chart Data for Reports ─── */

export const dealsBySourceData = [
	{ name: "Inbound", value: 10 },
	{ name: "Outbound", value: 5 },
	{ name: "Salon", value: 5 },
	{ name: "Partenaire", value: 5 },
	{ name: "LinkedIn", value: 3 },
	{ name: "Référencement", value: 3 },
	{ name: "Upsell", value: 2 },
]

export const dealsByAssigneeData = [
	{ name: "Sophie Martin", count: 12 },
	{ name: "Marc Leroy", count: 9 },
	{ name: "Julie Dufresne", count: 5 },
	{ name: "Antoine Moreau", count: 5 },
	{ name: "Léa Petit", count: 4 },
]

/* ─── Quote Lines (sample) ─── */

export const quoteLines: Record<string, QuoteLine[]> = {
	q1: [
		{ id: "ql1", product: "CRM Enterprise", description: "Licence annuelle — 50 utilisateurs", quantity: 1, unitPrice: 24000 },
		{ id: "ql2", product: "Module Reporting", description: "Dashboards + exports PDF", quantity: 1, unitPrice: 8500 },
		{ id: "ql3", product: "Formation", description: "2 jours sur site", quantity: 2, unitPrice: 1500 },
		{ id: "ql4", product: "Support Premium", description: "12 mois, SLA 4h", quantity: 1, unitPrice: 6000 },
	],
	q2: [
		{ id: "ql5", product: "ERP Standard", description: "Licence perpétuelle", quantity: 1, unitPrice: 35000 },
		{ id: "ql6", product: "Migration données", description: "Import historique 3 ans", quantity: 1, unitPrice: 12000 },
		{ id: "ql7", product: "Formation", description: "5 jours — 15 personnes", quantity: 5, unitPrice: 1800 },
	],
	q3: [
		{ id: "ql8", product: "Plateforme IoT", description: "Base 500 capteurs", quantity: 1, unitPrice: 18000 },
		{ id: "ql9", product: "Dashboard temps réel", description: "Visualisation + alertes", quantity: 1, unitPrice: 7500 },
		{ id: "ql10", product: "API Gateway", description: "Accès données brutes", quantity: 1, unitPrice: 4500 },
	],
}

export function getQuoteLines(quoteId: string): QuoteLine[] {
	return quoteLines[quoteId] ?? []
}

/* ─── Forecast Data ─── */

export const forecastData = [
	{ period: "Sep", actual: 165000, target: 180000 },
	{ period: "Oct", actual: 198000, target: 200000 },
	{ period: "Nov", actual: 245000, target: 220000 },
	{ period: "Déc", actual: 188000, target: 240000 },
	{ period: "Jan", actual: 313000, target: 260000 },
	{ period: "Fév", actual: 380000, target: 280000 },
	{ period: "Mar", forecast: 340000, target: 300000 },
	{ period: "Avr", forecast: 365000, target: 320000 },
	{ period: "Mai", forecast: 410000, target: 340000 },
	{ period: "Jun", forecast: 445000, target: 360000 },
]

/* ─── Funnel Data ─── */

export const pipelineFunnelData = [
	{ label: "Leads", value: 5 },
	{ label: "Qualifiés", value: 7 },
	{ label: "Propositions", value: 8 },
	{ label: "Négociations", value: 6 },
	{ label: "Gagnés", value: 7 },
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

export function getUserByName(name: string): User | undefined {
	return users.find((u) => `${u.firstName} ${u.lastName}` === name)
}
