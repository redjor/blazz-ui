/**
 * Sample data for StockBase inventory management demo
 * Mock data for inventory items, stock movements, dashboard stats, and charts
 */

/* ─── Types ─── */

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "discontinued"

export interface InventoryItem {
	id: string
	name: string
	sku: string
	category: string
	location: string
	quantity: number
	minQuantity: number
	unitPrice: number
	totalValue: number
	status: StockStatus
	lastRestocked: string
	supplier: string
}

export type MovementType = "entry" | "exit" | "transfer" | "adjustment"

export interface StockMovement {
	id: string
	itemName: string
	sku: string
	type: MovementType
	quantity: number
	fromLocation?: string
	toLocation?: string
	reason: string
	performedBy: string
	date: string
}

export interface StockbaseDashboardStats {
	totalItems: number
	totalItemsTrend: number
	totalStockValue: string
	stockValueTrend: number
	lowStockAlerts: number
	lowStockAlertsTrend: number
	movementsThisMonth: number
	movementsTrend: number
}

/* ─── Dashboard Stats ─── */

export const stockbaseDashboardStats: StockbaseDashboardStats = {
	totalItems: 847,
	totalItemsTrend: 5,
	totalStockValue: "284 620 \u20AC",
	stockValueTrend: 12,
	lowStockAlerts: 6,
	lowStockAlertsTrend: -25,
	movementsThisMonth: 43,
	movementsTrend: 8,
}

/* ─── Chart Data ─── */

export const stockValueChartData = [
	{ month: "Sep", value: 245000 },
	{ month: "Oct", value: 258000 },
	{ month: "Nov", value: 252000 },
	{ month: "Dec", value: 261000 },
	{ month: "Jan", value: 273000 },
	{ month: "Fev", value: 284620 },
]

export const movementsByCategoryChartData = [
	{ name: "Electronique", count: 18 },
	{ name: "Mobilier", count: 9 },
	{ name: "Fournitures", count: 22 },
	{ name: "Equipement", count: 11 },
	{ name: "Logistique", count: 7 },
]

/* ─── Inventory Items (20) ─── */

export const inventoryItems: InventoryItem[] = [
	{
		id: "inv1",
		name: 'Ecran Dell 27" 4K',
		sku: "ELEC-001",
		category: "Electronique",
		location: "Entrepot A",
		quantity: 45,
		minQuantity: 10,
		unitPrice: 389,
		totalValue: 17505,
		status: "in_stock",
		lastRestocked: "2026-02-05",
		supplier: "Dell France",
	},
	{
		id: "inv2",
		name: "Clavier mécanique Logitech",
		sku: "ELEC-002",
		category: "Electronique",
		location: "Entrepot A",
		quantity: 120,
		minQuantity: 30,
		unitPrice: 129,
		totalValue: 15480,
		status: "in_stock",
		lastRestocked: "2026-01-20",
		supplier: "Logitech",
	},
	{
		id: "inv3",
		name: "Souris ergonomique MX Master",
		sku: "ELEC-003",
		category: "Electronique",
		location: "Entrepot B",
		quantity: 8,
		minQuantity: 15,
		unitPrice: 99,
		totalValue: 792,
		status: "low_stock",
		lastRestocked: "2025-12-15",
		supplier: "Logitech",
	},
	{
		id: "inv4",
		name: "Bureau assis-debout 160cm",
		sku: "MOBI-001",
		category: "Mobilier",
		location: "Entrepot C",
		quantity: 22,
		minQuantity: 5,
		unitPrice: 649,
		totalValue: 14278,
		status: "in_stock",
		lastRestocked: "2026-01-10",
		supplier: "Flexispot",
	},
	{
		id: "inv5",
		name: "Chaise ergonomique Herman Miller",
		sku: "MOBI-002",
		category: "Mobilier",
		location: "Entrepot C",
		quantity: 3,
		minQuantity: 5,
		unitPrice: 1290,
		totalValue: 3870,
		status: "low_stock",
		lastRestocked: "2025-11-20",
		supplier: "Herman Miller",
	},
	{
		id: "inv6",
		name: "Ramettes papier A4 (lot 5)",
		sku: "FOUR-001",
		category: "Fournitures",
		location: "Entrepot A",
		quantity: 200,
		minQuantity: 50,
		unitPrice: 24,
		totalValue: 4800,
		status: "in_stock",
		lastRestocked: "2026-02-01",
		supplier: "Office Depot",
	},
	{
		id: "inv7",
		name: "Cartouches encre HP 305XL",
		sku: "FOUR-002",
		category: "Fournitures",
		location: "Entrepot A",
		quantity: 0,
		minQuantity: 20,
		unitPrice: 32,
		totalValue: 0,
		status: "out_of_stock",
		lastRestocked: "2025-10-05",
		supplier: "HP France",
	},
	{
		id: "inv8",
		name: "Casque audio Jabra Evolve2",
		sku: "ELEC-004",
		category: "Electronique",
		location: "Entrepot B",
		quantity: 35,
		minQuantity: 10,
		unitPrice: 249,
		totalValue: 8715,
		status: "in_stock",
		lastRestocked: "2026-01-25",
		supplier: "Jabra",
	},
	{
		id: "inv9",
		name: "Webcam Logitech Brio 4K",
		sku: "ELEC-005",
		category: "Electronique",
		location: "Entrepot A",
		quantity: 18,
		minQuantity: 10,
		unitPrice: 199,
		totalValue: 3582,
		status: "in_stock",
		lastRestocked: "2026-02-08",
		supplier: "Logitech",
	},
	{
		id: "inv10",
		name: "Station d'accueil USB-C",
		sku: "ELEC-006",
		category: "Electronique",
		location: "Entrepot B",
		quantity: 4,
		minQuantity: 10,
		unitPrice: 179,
		totalValue: 716,
		status: "low_stock",
		lastRestocked: "2025-12-20",
		supplier: "CalDigit",
	},
	{
		id: "inv11",
		name: "Caisson de rangement 3 tiroirs",
		sku: "MOBI-003",
		category: "Mobilier",
		location: "Entrepot C",
		quantity: 15,
		minQuantity: 5,
		unitPrice: 189,
		totalValue: 2835,
		status: "in_stock",
		lastRestocked: "2026-01-15",
		supplier: "IKEA Pro",
	},
	{
		id: "inv12",
		name: "Lampe de bureau LED",
		sku: "EQUI-001",
		category: "Equipement",
		location: "Entrepot A",
		quantity: 60,
		minQuantity: 15,
		unitPrice: 69,
		totalValue: 4140,
		status: "in_stock",
		lastRestocked: "2026-01-30",
		supplier: "BenQ",
	},
	{
		id: "inv13",
		name: "Multiprise parafoudre 8 prises",
		sku: "EQUI-002",
		category: "Equipement",
		location: "Entrepot B",
		quantity: 40,
		minQuantity: 20,
		unitPrice: 45,
		totalValue: 1800,
		status: "in_stock",
		lastRestocked: "2026-02-10",
		supplier: "Belkin",
	},
	{
		id: "inv14",
		name: "Cable Ethernet Cat6 3m",
		sku: "LOGI-001",
		category: "Logistique",
		location: "Entrepot A",
		quantity: 250,
		minQuantity: 100,
		unitPrice: 8,
		totalValue: 2000,
		status: "in_stock",
		lastRestocked: "2026-02-12",
		supplier: "Amazon Business",
	},
	{
		id: "inv15",
		name: "Etiquettes expedition (rouleau)",
		sku: "LOGI-002",
		category: "Logistique",
		location: "Entrepot B",
		quantity: 12,
		minQuantity: 20,
		unitPrice: 15,
		totalValue: 180,
		status: "low_stock",
		lastRestocked: "2025-12-28",
		supplier: "Avery",
	},
	{
		id: "inv16",
		name: "Cle USB 64Go Sandisk",
		sku: "ELEC-007",
		category: "Electronique",
		location: "Entrepot A",
		quantity: 75,
		minQuantity: 20,
		unitPrice: 12,
		totalValue: 900,
		status: "in_stock",
		lastRestocked: "2026-02-03",
		supplier: "Sandisk",
	},
	{
		id: "inv17",
		name: "Tableau blanc magnetique 120x90",
		sku: "EQUI-003",
		category: "Equipement",
		location: "Entrepot C",
		quantity: 0,
		minQuantity: 3,
		unitPrice: 89,
		totalValue: 0,
		status: "out_of_stock",
		lastRestocked: "2025-09-15",
		supplier: "Nobo",
	},
	{
		id: "inv18",
		name: "Cartons d'expedition 40x30x20",
		sku: "LOGI-003",
		category: "Logistique",
		location: "Entrepot B",
		quantity: 500,
		minQuantity: 100,
		unitPrice: 2,
		totalValue: 1000,
		status: "in_stock",
		lastRestocked: "2026-02-14",
		supplier: "Raja",
	},
	{
		id: "inv19",
		name: "Support ecran reglable",
		sku: "EQUI-004",
		category: "Equipement",
		location: "Entrepot A",
		quantity: 28,
		minQuantity: 10,
		unitPrice: 59,
		totalValue: 1652,
		status: "in_stock",
		lastRestocked: "2026-01-18",
		supplier: "Ergotron",
	},
	{
		id: "inv20",
		name: "Imprimante laser Samsung M2020",
		sku: "ELEC-008",
		category: "Electronique",
		location: "Entrepot C",
		quantity: 2,
		minQuantity: 3,
		unitPrice: 159,
		totalValue: 318,
		status: "low_stock",
		lastRestocked: "2025-11-10",
		supplier: "Samsung",
	},
]

/* ─── Stock Movements (15) ─── */

export const stockMovements: StockMovement[] = [
	{
		id: "mv1",
		itemName: 'Ecran Dell 27" 4K',
		sku: "ELEC-001",
		type: "entry",
		quantity: 20,
		toLocation: "Entrepot A",
		reason: "Reapprovisionnement fournisseur",
		performedBy: "Pierre Martin",
		date: "2026-02-14",
	},
	{
		id: "mv2",
		itemName: "Souris ergonomique MX Master",
		sku: "ELEC-003",
		type: "exit",
		quantity: -5,
		fromLocation: "Entrepot B",
		reason: "Dotation equipe Marketing",
		performedBy: "Sophie Durand",
		date: "2026-02-13",
	},
	{
		id: "mv3",
		itemName: "Bureau assis-debout 160cm",
		sku: "MOBI-001",
		type: "transfer",
		quantity: 3,
		fromLocation: "Entrepot C",
		toLocation: "Entrepot A",
		reason: "Transfert inter-sites",
		performedBy: "Pierre Martin",
		date: "2026-02-12",
	},
	{
		id: "mv4",
		itemName: "Ramettes papier A4 (lot 5)",
		sku: "FOUR-001",
		type: "entry",
		quantity: 100,
		toLocation: "Entrepot A",
		reason: "Commande trimestrielle",
		performedBy: "Julie Lambert",
		date: "2026-02-11",
	},
	{
		id: "mv5",
		itemName: "Casque audio Jabra Evolve2",
		sku: "ELEC-004",
		type: "exit",
		quantity: -8,
		fromLocation: "Entrepot B",
		reason: "Dotation nouveaux arrivants",
		performedBy: "Sophie Durand",
		date: "2026-02-10",
	},
	{
		id: "mv6",
		itemName: "Cable Ethernet Cat6 3m",
		sku: "LOGI-001",
		type: "entry",
		quantity: 150,
		toLocation: "Entrepot A",
		reason: "Reapprovisionnement",
		performedBy: "Pierre Martin",
		date: "2026-02-09",
	},
	{
		id: "mv7",
		itemName: "Chaise ergonomique Herman Miller",
		sku: "MOBI-002",
		type: "exit",
		quantity: -2,
		fromLocation: "Entrepot C",
		reason: "Installation bureau direction",
		performedBy: "Marc Lefevre",
		date: "2026-02-08",
	},
	{
		id: "mv8",
		itemName: "Cartouches encre HP 305XL",
		sku: "FOUR-002",
		type: "adjustment",
		quantity: -5,
		fromLocation: "Entrepot A",
		reason: "Correction inventaire physique",
		performedBy: "Julie Lambert",
		date: "2026-02-07",
	},
	{
		id: "mv9",
		itemName: "Webcam Logitech Brio 4K",
		sku: "ELEC-005",
		type: "entry",
		quantity: 10,
		toLocation: "Entrepot A",
		reason: "Reapprovisionnement fournisseur",
		performedBy: "Pierre Martin",
		date: "2026-02-06",
	},
	{
		id: "mv10",
		itemName: "Etiquettes expedition (rouleau)",
		sku: "LOGI-002",
		type: "exit",
		quantity: -8,
		fromLocation: "Entrepot B",
		reason: "Consommation expedition",
		performedBy: "Marc Lefevre",
		date: "2026-02-05",
	},
	{
		id: "mv11",
		itemName: "Station d'accueil USB-C",
		sku: "ELEC-006",
		type: "transfer",
		quantity: 2,
		fromLocation: "Entrepot A",
		toLocation: "Entrepot B",
		reason: "Equilibrage stock",
		performedBy: "Sophie Durand",
		date: "2026-02-04",
	},
	{
		id: "mv12",
		itemName: "Lampe de bureau LED",
		sku: "EQUI-001",
		type: "entry",
		quantity: 25,
		toLocation: "Entrepot A",
		reason: "Commande groupee",
		performedBy: "Pierre Martin",
		date: "2026-02-03",
	},
	{
		id: "mv13",
		itemName: "Cle USB 64Go Sandisk",
		sku: "ELEC-007",
		type: "exit",
		quantity: -15,
		fromLocation: "Entrepot A",
		reason: "Distribution equipe IT",
		performedBy: "Julie Lambert",
		date: "2026-02-02",
	},
	{
		id: "mv14",
		itemName: "Cartons d'expedition 40x30x20",
		sku: "LOGI-003",
		type: "entry",
		quantity: 200,
		toLocation: "Entrepot B",
		reason: "Reapprovisionnement mensuel",
		performedBy: "Marc Lefevre",
		date: "2026-02-01",
	},
	{
		id: "mv15",
		itemName: "Support ecran reglable",
		sku: "EQUI-004",
		type: "adjustment",
		quantity: 3,
		toLocation: "Entrepot A",
		reason: "Retour apres reparation",
		performedBy: "Sophie Durand",
		date: "2026-01-30",
	},
]
