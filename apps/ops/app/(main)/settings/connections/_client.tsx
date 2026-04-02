"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Item, ItemActions, ItemContent, ItemTitle } from "@blazz/ui/components/ui/item"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { providers } from "@/lib/connections/providers"

// ── Status helpers ──

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "outline" }> = {
	active: { label: "Connecté", variant: "success" },
	expired: { label: "Expiré", variant: "warning" },
	error: { label: "Erreur", variant: "destructive" },
	disconnected: { label: "Déconnecté", variant: "outline" },
}

type UserConnection = {
	_id: Id<"connections">
	provider: string
	status: string
	accountInfo?: { email?: string; name?: string; avatar?: string }
}

type ProviderConfig = {
	provider: string
	clientId: string
	hasSecret: boolean
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

	// Loading
	if (connections === undefined || configs === undefined) {
		return (
			<SettingsPage>
				<SettingsHeader title="Connexions" description="Connectez vos applications externes pour les rendre accessibles à vos agents." />
				<BlockStack gap="100">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="h-12 w-full rounded-lg" />
					))}
				</BlockStack>
			</SettingsPage>
		)
	}

	// Maps
	const connectionsByProvider = new Map<string, UserConnection>()
	for (const conn of connections) {
		connectionsByProvider.set(conn.provider, conn as UserConnection)
	}
	const configsByKey = new Map<string, ProviderConfig>()
	for (const cfg of configs) {
		configsByKey.set(cfg.provider, cfg as ProviderConfig)
	}

	return (
		<SettingsPage>
			<SettingsHeader title="Connexions" description="Connectez vos applications externes pour les rendre accessibles à vos agents." />

			<BlockStack gap="none">
				{providers.map((provider) => {
					const conn = connectionsByProvider.get(provider.id)
					const config = configsByKey.get(provider.credentialsKey ?? provider.id)
					const isConfigured = provider.authType === "api_key" || !!config?.hasSecret
					const status = statusBadge[conn?.status ?? ""]
					const Icon = provider.icon

					return (
						<Item key={provider.id}>
							<InlineStack gap="200" blockAlign="center">
								<Icon className="size-5 text-fg-muted" />
							</InlineStack>
							<ItemContent>
								<ItemTitle>
									{provider.name}
									{status && (
										<Badge variant={status.variant} className="ml-2">
											{status.label}
										</Badge>
									)}
									{!conn && isConfigured && (
										<Badge variant="outline" className="ml-2">
											Configuré
										</Badge>
									)}
								</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Button variant="outline" size="sm" onClick={() => router.push(`/settings/connections/${provider.id}`)}>
									Configurer
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
										<MoreHorizontal className="size-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{!conn && isConfigured && (
											<DropdownMenuItem
												onSelect={() => {
													window.location.href = `/api/connections/${provider.id}/authorize`
												}}
											>
												Connecter
											</DropdownMenuItem>
										)}
										{conn && (
											<DropdownMenuItem className="text-destructive" onSelect={() => handleDisconnect(conn._id)}>
												<Trash2 className="size-3.5 mr-2" />
												Déconnecter
											</DropdownMenuItem>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</ItemActions>
						</Item>
					)
				})}
			</BlockStack>
		</SettingsPage>
	)
}
