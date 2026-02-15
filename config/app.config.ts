/**
 * Blazz UI App - Configuration Centralisée
 *
 * Ce fichier contient toute la configuration de l'application.
 * Modifiez ces valeurs pour personnaliser votre application.
 */

import { sidebarConfig } from "./navigation"

/**
 * Configuration des métadonnées de l'application
 */
export const appMetadata = {
	/** Nom de l'application (affiché dans l'UI, meta tags, etc.) */
	name: process.env.NEXT_PUBLIC_APP_NAME || "Blazz UI App",

	/** Description de l'application (pour SEO, meta tags) */
	description:
		"Boilerplate Next.js production-ready avec bibliothèque de composants UI et intégration LLM optimale",

	/** Version de l'application */
	version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

	/** URL de l'application */
	url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3100",

	/** Environnement (development, staging, production) */
	environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",

	/** Keywords pour SEO */
	keywords: [
		"next.js",
		"react",
		"typescript",
		"tailwind",
		"ui components",
		"dashboard",
		"admin",
		"saas",
	],

	/** Auteur / Organisation */
	author: {
		name: "Votre Organisation",
		url: "https://votre-site.com",
		email: "contact@votre-site.com",
	},

	/** Open Graph (réseaux sociaux) */
	openGraph: {
		type: "website",
		siteName: "Blazz UI App",
		locale: "fr_FR",
		// image: "/og-image.png", // Décommenter et ajouter image
	},

	/** Twitter Card */
	twitter: {
		card: "summary_large_image",
		// site: "@votre_compte", // Décommenter et ajouter
		// creator: "@votre_compte",
	},
} as const

/**
 * Configuration de la navigation
 * Importée depuis navigation.ts
 */
export const navigation = {
	/** Configuration de la sidebar */
	sidebar: sidebarConfig,

	/** Footer de la sidebar (optionnel) */
	footer: {
		showVersion: true,
		showSupport: false,
		links: [
			// { title: "Documentation", url: "/docs" },
			// { title: "Support", url: "/support" },
			// { title: "API", url: "/api/docs" },
		],
	},
} as const

/**
 * Configuration du thème
 */
export const theme = {
	/** Mode par défaut: 'light', 'dark', ou 'system' */
	defaultMode: "light" as "light" | "dark" | "system",

	/** Fichier CSS contenant les variables de thème */
	cssVarsFile: "./app/globals.css",

	/** Autoriser le changement de thème par l'utilisateur */
	allowThemeToggle: true,

	/** Stratégie de stockage du thème ('localStorage', 'cookie', 'none') */
	storage: "localStorage" as "localStorage" | "cookie" | "none",

	/** Palettes de couleurs personnalisées (pour futures versions) */
	customPalettes: {
		// purple: {
		// 	primary: "oklch(0.55 0.25 280)",
		// 	primaryForeground: "oklch(0.985 0 0)",
		// },
	},
} as const

/**
 * Configuration des fonctionnalités (feature flags)
 */
export const features = {
	/** Command Palette (⌘K / Ctrl+K) */
	commandPalette: {
		enabled:
			process.env.NEXT_PUBLIC_ENABLE_COMMAND_PALETTE === "true" ||
			process.env.NEXT_PUBLIC_ENABLE_COMMAND_PALETTE === undefined,
		shortcut: "⌘K",
	},

	/** Analytics */
	analytics: {
		enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
		provider: "none" as "google" | "vercel" | "posthog" | "mixpanel" | "none",
		// config: {
		// 	measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
		// },
	},

	/** Internationalisation (i18n) */
	i18n: {
		enabled: process.env.NEXT_PUBLIC_ENABLE_I18N === "true",
		defaultLocale: "fr",
		locales: ["fr", "en"],
	},

	/** Dark Mode */
	darkMode: {
		enabled:
			process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === "true" ||
			process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === undefined,
	},

	/** Mode maintenance */
	maintenance: {
		enabled: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
		message:
			"L'application est actuellement en maintenance. Nous serons de retour bientôt.",
	},

	/** Debug mode */
	debug: {
		enabled: process.env.NEXT_PUBLIC_DEBUG === "true",
		showLogs: process.env.NODE_ENV === "development",
	},

	/** Notifications */
	notifications: {
		enabled: true,
		position: "top-right" as
			| "top-left"
			| "top-center"
			| "top-right"
			| "bottom-left"
			| "bottom-center"
			| "bottom-right",
		duration: 5000, // ms
	},
} as const

/**
 * Configuration de l'authentification
 */
export const auth = {
	/** Authentification activée */
	enabled: false,

	/** Provider d'authentification */
	provider: "none" as
		| "nextauth"
		| "clerk"
		| "auth0"
		| "supabase"
		| "firebase"
		| "none",

	/** Pages d'authentification */
	pages: {
		signIn: "/auth/login",
		signUp: "/auth/signup",
		signOut: "/auth/logout",
		error: "/auth/error",
		verifyRequest: "/auth/verify",
		newUser: "/auth/welcome",
	},

	/** Redirection après connexion */
	redirectAfterSignIn: "/examples/crm/dashboard",

	/** Redirection après déconnexion */
	redirectAfterSignOut: "/",

	/** Session */
	session: {
		strategy: "jwt" as "jwt" | "database",
		maxAge: 30 * 24 * 60 * 60, // 30 jours
	},
} as const

/**
 * Configuration de l'API
 */
export const api = {
	/** URL de base de l'API */
	baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

	/** Timeout des requêtes (ms) */
	timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,

	/** Headers par défaut */
	defaultHeaders: {
		"Content-Type": "application/json",
	},

	/** Rate limiting */
	rateLimit: {
		max: Number(process.env.RATE_LIMIT_MAX) || 100,
		windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
	},
} as const

/**
 * Configuration du stockage
 */
export const storage = {
	/** Provider de stockage */
	provider: "none" as "s3" | "cloudinary" | "uploadthing" | "local" | "none",

	/** Taille maximale de fichier (bytes) */
	maxFileSize: 10 * 1024 * 1024, // 10 MB

	/** Types de fichiers acceptés */
	acceptedFileTypes: {
		images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
		documents: [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		],
		spreadsheets: [
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		],
	},
} as const

/**
 * Configuration de l'email
 */
export const email = {
	/** Email activé */
	enabled: false,

	/** Provider d'email */
	provider: "none" as "smtp" | "sendgrid" | "resend" | "mailgun" | "none",

	/** Email par défaut "from" */
	from: {
		name: appMetadata.name,
		email: process.env.EMAIL_FROM || "noreply@example.com",
	},

	/** Templates d'email */
	templates: {
		welcome: "welcome",
		passwordReset: "password-reset",
		emailVerification: "email-verification",
	},
} as const

/**
 * Configuration des paiements
 */
export const payments = {
	/** Paiements activés */
	enabled: false,

	/** Provider de paiement */
	provider: "none" as "stripe" | "paypal" | "none",

	/** Devise par défaut */
	currency: "EUR",

	/** Locales de devise */
	locale: "fr-FR",
} as const

/**
 * Configuration du support/aide
 */
export const support = {
	/** Email de support */
	email: "support@example.com",

	/** Lien documentation */
	docsUrl: "/docs",

	/** Chat support activé */
	chat: {
		enabled: false,
		provider: "none" as "intercom" | "crisp" | "zendesk" | "none",
	},

	/** Lien status page */
	statusUrl: "https://status.example.com",
} as const

/**
 * Configuration des limites
 */
export const limits = {
	/** Pagination */
	pagination: {
		defaultPageSize: 20,
		maxPageSize: 100,
		pageSizeOptions: [10, 20, 50, 100],
	},

	/** Upload */
	upload: {
		maxFiles: 10,
		maxTotalSize: 50 * 1024 * 1024, // 50 MB
	},

	/** Formulaires */
	forms: {
		maxTextLength: 5000,
		maxTitleLength: 255,
		maxDescriptionLength: 1000,
	},
} as const

/**
 * Configuration complète de l'application
 * Export par défaut pour import simplifié
 */
export const appConfig = {
	metadata: appMetadata,
	navigation,
	theme,
	features,
	auth,
	api,
	storage,
	email,
	payments,
	support,
	limits,
} as const

/**
 * Type helper pour accéder à la config dans votre code
 *
 * @example
 * import { appConfig } from '@/config/app.config'
 *
 * const appName = appConfig.metadata.name
 * const isDarkModeEnabled = appConfig.features.darkMode.enabled
 */
export type AppConfig = typeof appConfig

/**
 * Export par défaut
 */
export default appConfig
