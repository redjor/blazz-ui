"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { Check, Eye, EyeOff, Settings2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { type ProviderDef, providers } from "@/lib/connections/providers"

// ── Status helpers ──

const statusLabels: Record<string, string> = {
	active: "Connecté",
	expired: "Expiré",
	error: "Erreur",
	disconnected: "Déconnecté",
}

const statusVariants: Record<string, "success" | "warning" | "destructive" | "outline"> = {
	active: "success",
	expired: "warning",
	error: "destructive",
	disconnected: "outline",
}

// ── Types ──

type UserConnection = {
	_id: Id<"connections">
	provider: string
	status: string
	accountInfo?: { email?: string; name?: string; avatar?: string }
}

type ProviderConfig = {
	_id: Id<"providerConfigs">
	provider: string
	clientId: string
	hasSecret: boolean
	configuredAt: number
}

// ── Setup Form (inline) ──

function ProviderSetupForm({ provider, existingConfig }: { provider: ProviderDef; existingConfig?: ProviderConfig }) {
	const upsert = useMutation(api.providerConfigs.upsert)
	const [clientId, setClientId] = useState(existingConfig?.clientId ?? "")
	const [clientSecret, setClientSecret] = useState("")
	const [showSecret, setShowSecret] = useState(false)
	const [saving, setSaving] = useState(false)

	const handleSave = async () => {
		if (!clientId.trim() || !clientSecret.trim()) {
			toast.error("Les deux champs sont requis")
			return
		}
		setSaving(true)
		try {
			await upsert({ provider: provider.id, clientId: clientId.trim(), clientSecret: clientSecret.trim() })
			toast.success("Credentials sauvegardées")
			setClientSecret("")
		} catch {
			toast.error("Erreur lors de la sauvegarde")
		} finally {
			setSaving(false)
		}
	}

	return (
		<BlockStack gap="200">
			<Input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} className="text-xs" />
			<div className="relative">
				<Input placeholder="Client Secret" type={showSecret ? "text" : "password"} value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} className="text-xs pr-8" />
				<button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg">
					{showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
				</button>
			</div>
			<Button variant="secondary" size="sm" className="w-full" onClick={handleSave} disabled={saving}>
				{saving ? "Enregistrement..." : "Enregistrer"}
			</Button>
		</BlockStack>
	)
}

// ── Connection Card ──

function ConnectionCard({
	provider,
	connection,
	config,
	onDisconnect,
}: {
	provider: ProviderDef
	connection?: UserConnection
	config?: ProviderConfig
	onDisconnect: (id: Id<"connections">) => void
}) {
	const Icon = provider.icon
	const isConfigured = provider.authType === "api_key" || !!config?.hasSecret
	const [showSetup, setShowSetup] = useState(false)

	const handleConnect = () => {
		if (provider.authType === "oauth2") {
			window.location.href = `/api/connections/${provider.id}/authorize`
		}
		// TODO: API key flow
	}

	return (
		<Box padding="4" background="surface" border="default" borderRadius="lg">
			<BlockStack gap="300">
				{/* Header */}
				<InlineStack gap="200" blockAlign="center" align="space-between">
					<InlineStack gap="200" blockAlign="center">
						<Icon className="size-5 text-fg-muted" />
						<span className="text-sm font-medium text-fg">{provider.name}</span>
					</InlineStack>
					{connection ? (
						<Badge variant={statusVariants[connection.status] ?? "outline"}>{statusLabels[connection.status] ?? connection.status}</Badge>
					) : isConfigured ? (
						<Badge variant="outline">
							<Check className="size-3 mr-1" />
							Configuré
						</Badge>
					) : null}
				</InlineStack>

				<p className="text-xs text-fg-muted">{provider.description}</p>

				{/* Capabilities */}
				<InlineStack gap="100" wrap>
					{provider.capabilities.map((cap) => (
						<Badge key={cap} variant="outline" className="text-xs">
							{cap}
						</Badge>
					))}
				</InlineStack>

				{/* Account info if connected */}
				{connection?.accountInfo?.email && <span className="text-xs text-fg-muted">{connection.accountInfo.email}</span>}

				{/* Setup form (OAuth providers only) */}
				{provider.authType === "oauth2" && showSetup && <ProviderSetupForm provider={provider} existingConfig={config} />}

				{/* Actions */}
				{connection?.status === "active" ? (
					<InlineStack gap="200">
						<Button variant="outline" size="sm" className="flex-1" onClick={() => onDisconnect(connection._id)}>
							Déconnecter
						</Button>
						{provider.authType === "oauth2" && (
							<Button variant="ghost" size="sm" onClick={() => setShowSetup(!showSetup)}>
								<Settings2 className="size-3.5" />
							</Button>
						)}
					</InlineStack>
				) : isConfigured ? (
					<InlineStack gap="200">
						<Button variant="secondary" size="sm" className="flex-1" onClick={handleConnect}>
							Connecter
						</Button>
						{provider.authType === "oauth2" && (
							<Button variant="ghost" size="sm" onClick={() => setShowSetup(!showSetup)}>
								<Settings2 className="size-3.5" />
							</Button>
						)}
					</InlineStack>
				) : (
					<Button variant="outline" size="sm" className="w-full" onClick={() => setShowSetup(!showSetup)}>
						<Settings2 className="size-3.5 mr-1.5" />
						Configurer
					</Button>
				)}
			</BlockStack>
		</Box>
	)
}

// ── Page ──

export function ConnectionsClient() {
	const connections = useQuery(api.connections.list)
	const configs = useQuery(api.providerConfigs.list)
	const removeConnection = useMutation(api.connections.remove)
	const searchParams = useSearchParams()
	const router = useRouter()

	// Handle OAuth callback feedback
	useEffect(() => {
		if (searchParams.get("success") === "true") {
			toast.success("Connexion réussie")
			router.replace("/settings/connections")
		}
		const error = searchParams.get("error")
		if (error) {
			const messages: Record<string, string> = {
				state_mismatch: "Erreur de sécurité — réessayez.",
				state_expired: "La demande a expiré — réessayez.",
				token_exchange_failed: "Échec de l'authentification.",
				health_check_failed: "La connexion ne fonctionne pas — vérifiez les permissions.",
				not_authenticated: "Vous devez être connecté.",
				provider_not_configured: "Provider non configuré — ajoutez les credentials d'abord.",
			}
			toast.error(messages[error] ?? `Erreur: ${error}`)
			router.replace("/settings/connections")
		}
	}, [searchParams, router])

	const handleDisconnect = async (id: Id<"connections">) => {
		try {
			await removeConnection({ id })
			toast.success("Connexion supprimée")
		} catch {
			toast.error("Erreur lors de la déconnexion")
		}
	}

	// Loading state
	if (connections === undefined || configs === undefined) {
		return (
			<SettingsPage>
				<SettingsHeader title="Connexions" description="Connectez vos applications externes." />
				<InlineGrid columns={3} gap="300">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-44 w-full rounded-lg" />
					))}
				</InlineGrid>
			</SettingsPage>
		)
	}

	// Map by provider
	const connectionsByProvider = new Map<string, UserConnection>()
	for (const conn of connections) {
		connectionsByProvider.set(conn.provider, conn as UserConnection)
	}

	const configsByProvider = new Map<string, ProviderConfig>()
	for (const cfg of configs) {
		configsByProvider.set(cfg.provider, cfg as ProviderConfig)
	}

	return (
		<SettingsPage>
			<SettingsHeader title="Connexions" description="Connectez vos applications externes pour les rendre accessibles à vos agents." />
			<InlineGrid columns={3} gap="300">
				{providers.map((provider) => (
					<ConnectionCard key={provider.id} provider={provider} connection={connectionsByProvider.get(provider.id)} config={configsByProvider.get(provider.id)} onDisconnect={handleDisconnect} />
				))}
			</InlineGrid>
		</SettingsPage>
	)
}
