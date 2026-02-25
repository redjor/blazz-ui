/**
 * Sample data for TalentFlow ATS demo
 * Mock data for candidates, jobs, dashboard stats, and charts
 */

/* ─── Types ─── */

export type CandidateStage = "new" | "screening" | "interview" | "technical" | "offer" | "hired" | "rejected"

export interface Candidate {
	id: string
	firstName: string
	lastName: string
	email: string
	position: string
	stage: CandidateStage
	source: string
	score: number
	appliedAt: string
}

export type JobStatus = "open" | "closed" | "draft"

export interface Job {
	id: string
	title: string
	department: string
	location: string
	candidateCount: number
	status: JobStatus
	publishedAt: string
}

export interface TalentflowDashboardStats {
	openPositions: number
	openPositionsTrend: number
	applicationsThisMonth: number
	applicationsTrend: number
	interviewsThisWeek: number
	interviewsTrend: number
	hireRate: string
	hireRateTrend: number
}

/* ─── Dashboard Stats ─── */

export const talentflowDashboardStats: TalentflowDashboardStats = {
	openPositions: 12,
	openPositionsTrend: 20,
	applicationsThisMonth: 84,
	applicationsTrend: 15,
	interviewsThisWeek: 9,
	interviewsTrend: -10,
	hireRate: "24%",
	hireRateTrend: 5,
}

/* ─── Chart Data ─── */

export const applicationsChartData = [
	{ month: "Sep", applications: 42 },
	{ month: "Oct", applications: 56 },
	{ month: "Nov", applications: 38 },
	{ month: "Dec", applications: 29 },
	{ month: "Jan", applications: 67 },
	{ month: "Fév", applications: 84 },
]

export const pipelineChartData = [
	{ name: "Nouveau", count: 28 },
	{ name: "Screening", count: 18 },
	{ name: "Entretien", count: 12 },
	{ name: "Technique", count: 8 },
	{ name: "Offre", count: 5 },
	{ name: "Embauché", count: 3 },
]

/* ─── Jobs (8) ─── */

export const jobs: Job[] = [
	{ id: "j1", title: "Développeur Full-Stack Senior", department: "Engineering", location: "Paris", candidateCount: 18, status: "open", publishedAt: "2025-12-10" },
	{ id: "j2", title: "Product Designer", department: "Design", location: "Lyon", candidateCount: 12, status: "open", publishedAt: "2026-01-05" },
	{ id: "j3", title: "Data Analyst", department: "Data", location: "Paris", candidateCount: 9, status: "open", publishedAt: "2026-01-15" },
	{ id: "j4", title: "Responsable Marketing Digital", department: "Marketing", location: "Bordeaux", candidateCount: 7, status: "open", publishedAt: "2026-01-20" },
	{ id: "j5", title: "DevOps Engineer", department: "Engineering", location: "Remote", candidateCount: 14, status: "open", publishedAt: "2026-01-08" },
	{ id: "j6", title: "Customer Success Manager", department: "Support", location: "Paris", candidateCount: 6, status: "open", publishedAt: "2026-02-01" },
	{ id: "j7", title: "Comptable Senior", department: "Finance", location: "Paris", candidateCount: 4, status: "closed", publishedAt: "2025-10-15" },
	{ id: "j8", title: "Chef de Projet IT", department: "Engineering", location: "Nantes", candidateCount: 0, status: "draft", publishedAt: "2026-02-14" },
]

/* ─── Candidates (25) ─── */

export const candidates: Candidate[] = [
	{ id: "ca1", firstName: "Lucas", lastName: "Moreau", email: "l.moreau@gmail.com", position: "Développeur Full-Stack Senior", stage: "technical", source: "LinkedIn", score: 88, appliedAt: "2026-01-12" },
	{ id: "ca2", firstName: "Emma", lastName: "Leroy", email: "emma.leroy@outlook.fr", position: "Product Designer", stage: "interview", source: "Welcome to the Jungle", score: 82, appliedAt: "2026-01-18" },
	{ id: "ca3", firstName: "Thomas", lastName: "Petit", email: "t.petit@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "offer", source: "Cooptation", score: 92, appliedAt: "2025-12-20" },
	{ id: "ca4", firstName: "Léa", lastName: "Fontaine", email: "lea.fontaine@gmail.com", position: "Data Analyst", stage: "screening", source: "Indeed", score: 75, appliedAt: "2026-02-01" },
	{ id: "ca5", firstName: "Hugo", lastName: "Girard", email: "hugo.girard@proton.me", position: "DevOps Engineer", stage: "new", source: "LinkedIn", score: 70, appliedAt: "2026-02-10" },
	{ id: "ca6", firstName: "Camille", lastName: "Dupont", email: "c.dupont@gmail.com", position: "Responsable Marketing Digital", stage: "interview", source: "Site carrière", score: 85, appliedAt: "2026-01-25" },
	{ id: "ca7", firstName: "Nathan", lastName: "Bernard", email: "n.bernard@outlook.fr", position: "Développeur Full-Stack Senior", stage: "hired", source: "LinkedIn", score: 95, appliedAt: "2025-11-15" },
	{ id: "ca8", firstName: "Chloé", lastName: "Roux", email: "chloe.roux@gmail.com", position: "Product Designer", stage: "new", source: "Welcome to the Jungle", score: 68, appliedAt: "2026-02-12" },
	{ id: "ca9", firstName: "Maxime", lastName: "Lefebvre", email: "m.lefebvre@yahoo.fr", position: "Data Analyst", stage: "technical", source: "Cooptation", score: 80, appliedAt: "2026-01-10" },
	{ id: "ca10", firstName: "Inès", lastName: "Martinez", email: "ines.m@gmail.com", position: "Customer Success Manager", stage: "screening", source: "Indeed", score: 72, appliedAt: "2026-02-05" },
	{ id: "ca11", firstName: "Arthur", lastName: "Duval", email: "a.duval@proton.me", position: "DevOps Engineer", stage: "interview", source: "LinkedIn", score: 87, appliedAt: "2026-01-22" },
	{ id: "ca12", firstName: "Manon", lastName: "Simon", email: "manon.simon@gmail.com", position: "Développeur Full-Stack Senior", stage: "rejected", source: "Indeed", score: 45, appliedAt: "2026-01-05" },
	{ id: "ca13", firstName: "Raphaël", lastName: "Laurent", email: "r.laurent@outlook.fr", position: "Responsable Marketing Digital", stage: "new", source: "LinkedIn", score: 63, appliedAt: "2026-02-13" },
	{ id: "ca14", firstName: "Julie", lastName: "Morel", email: "j.morel@yahoo.fr", position: "Product Designer", stage: "technical", source: "Cooptation", score: 90, appliedAt: "2026-01-08" },
	{ id: "ca15", firstName: "Alexandre", lastName: "Thomas", email: "alex.thomas@gmail.com", position: "DevOps Engineer", stage: "offer", source: "Site carrière", score: 91, appliedAt: "2025-12-18" },
	{ id: "ca16", firstName: "Sarah", lastName: "Garcia", email: "s.garcia@proton.me", position: "Data Analyst", stage: "new", source: "Welcome to the Jungle", score: 66, appliedAt: "2026-02-14" },
	{ id: "ca17", firstName: "Paul", lastName: "Robert", email: "paul.r@gmail.com", position: "Développeur Full-Stack Senior", stage: "screening", source: "LinkedIn", score: 78, appliedAt: "2026-02-03" },
	{ id: "ca18", firstName: "Zoé", lastName: "Richard", email: "zoe.richard@outlook.fr", position: "Customer Success Manager", stage: "new", source: "Indeed", score: 71, appliedAt: "2026-02-11" },
	{ id: "ca19", firstName: "Louis", lastName: "Dumont", email: "l.dumont@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "interview", source: "Cooptation", score: 83, appliedAt: "2026-01-28" },
	{ id: "ca20", firstName: "Clara", lastName: "Fournier", email: "clara.f@gmail.com", position: "Responsable Marketing Digital", stage: "rejected", source: "Site carrière", score: 40, appliedAt: "2026-01-15" },
	{ id: "ca21", firstName: "Gabriel", lastName: "Chevalier", email: "g.chevalier@proton.me", position: "DevOps Engineer", stage: "screening", source: "LinkedIn", score: 76, appliedAt: "2026-02-07" },
	{ id: "ca22", firstName: "Ambre", lastName: "Bonnet", email: "ambre.b@outlook.fr", position: "Product Designer", stage: "hired", source: "Welcome to the Jungle", score: 93, appliedAt: "2025-11-20" },
	{ id: "ca23", firstName: "Théo", lastName: "Lemaire", email: "theo.l@gmail.com", position: "Data Analyst", stage: "interview", source: "LinkedIn", score: 84, appliedAt: "2026-01-30" },
	{ id: "ca24", firstName: "Jade", lastName: "Michel", email: "jade.m@yahoo.fr", position: "Développeur Full-Stack Senior", stage: "new", source: "Indeed", score: 69, appliedAt: "2026-02-15" },
	{ id: "ca25", firstName: "Enzo", lastName: "Blanc", email: "enzo.blanc@gmail.com", position: "Customer Success Manager", stage: "technical", source: "Cooptation", score: 81, appliedAt: "2026-01-20" },
]
