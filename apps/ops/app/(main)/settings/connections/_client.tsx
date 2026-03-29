"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
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

// ── Connection Card ──

type UserConnection = {
	_id: Id<"connections">
	provider: string
	status: string
	accountInfo?: { email?: string; name?: string; avatar?: string }
}

function ConnectionCard({ provider, connection, onDisconnect }: { provider: ProviderDef; connection?: UserConnection; onDisconnect: (id: Id<"connections">) => void }) {
	const Icon = provider.icon

	const handleConnect = () => {
		if (provider.authType === "oauth2") {
			window.location.href = `/api/connections/${provider.id}/authorize`
		}
		// TODO: API key flow — open dialog
	}

	return (
		<Box padding="4" background="surface" border="default" borderRadius="lg">
			<BlockStack gap="300">
				<InlineStack gap="200" blockAlign="center" align="space-between">
					<InlineStack gap="200" blockAlign="center">
						<Icon className="size-5 text-fg-muted" />
						<span className="text-sm font-medium text-fg">{provider.name}</span>
					</InlineStack>
					{connection && <Badge variant={statusVariants[connection.status] ?? "outline"}>{statusLabels[connection.status] ?? connection.status}</Badge>}
				</InlineStack>

				<p className="text-xs text-fg-muted">{provider.description}</p>

				<InlineStack gap="100" wrap>
					{provider.capabilities.map((cap) => (
						<Badge key={cap} variant="outline" className="text-xs">
							{cap}
						</Badge>
					))}
				</InlineStack>

				{connection?.accountInfo?.email && <span className="text-xs text-fg-muted">{connection.accountInfo.email}</span>}

				{connection?.status === "active" ? (
					<Button variant="outline" size="sm" className="w-full" onClick={() => onDisconnect(connection._id)}>
						Déconnecter
					</Button>
				) : (
					<Button variant="secondary" size="sm" className="w-full" onClick={handleConnect}>
						Connecter
					</Button>
				)}
			</BlockStack>
		</Box>
	)
}

// ── Page ──

export function ConnectionsClient() {
	const connections = useQuery(api.connections.list)
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
	if (connections === undefined) {
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

	// Map connections by provider
	const connectionsByProvider = new Map<string, UserConnection>()
	for (const conn of connections) {
		connectionsByProvider.set(conn.provider, conn as UserConnection)
	}

	return (
		<SettingsPage>
			<SettingsHeader title="Connexions" description="Connectez vos applications externes pour les rendre accessibles à vos agents." />
			<InlineGrid columns={3} gap="300">
				{providers.map((provider) => (
					<ConnectionCard key={provider.id} provider={provider} connection={connectionsByProvider.get(provider.id)} onDisconnect={handleDisconnect} />
				))}
			</InlineGrid>
		</SettingsPage>
	)
}
