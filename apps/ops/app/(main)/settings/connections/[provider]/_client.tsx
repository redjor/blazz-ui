"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Item, ItemActions, ItemContent, ItemTitle } from "@blazz/ui/components/ui/item"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { ExternalLink, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { providerMap } from "@/lib/connections/providers"

// ── Credentials Form ──

function CredentialsForm({ providerId, credentialsKey }: { providerId: string; credentialsKey: string }) {
	const config = useQuery(api.providerConfigs.getByProvider, { provider: credentialsKey })
	const upsert = useMutation(api.providerConfigs.upsert)
	const [clientId, setClientId] = useState("")
	const [clientSecret, setClientSecret] = useState("")
	const [showSecret, setShowSecret] = useState(false)
	const [saving, setSaving] = useState(false)
	const [initialized, setInitialized] = useState(false)

	// Initialize from existing config
	if (config && !initialized) {
		setClientId(config.clientId)
		setInitialized(true)
	}

	const handleSave = async () => {
		if (!clientId.trim()) {
			toast.error("Client ID requis")
			return
		}
		// If updating, secret can be empty (keep existing)
		if (!config?.hasSecret && !clientSecret.trim()) {
			toast.error("Client Secret requis")
			return
		}
		setSaving(true)
		try {
			await upsert({
				provider: credentialsKey,
				clientId: clientId.trim(),
				clientSecret: clientSecret.trim() || "KEEP_EXISTING",
			})
			toast.success("Credentials sauvegardées")
			setClientSecret("")
		} catch {
			toast.error("Erreur lors de la sauvegarde")
		} finally {
			setSaving(false)
		}
	}

	if (config === undefined) {
		return (
			<BlockStack gap="200">
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-full" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="300">
			<BlockStack gap="100">
				<label className="text-xs font-medium text-fg-muted">Client ID</label>
				<Input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
			</BlockStack>
			<BlockStack gap="100">
				<label className="text-xs font-medium text-fg-muted">
					Client Secret
					{config?.hasSecret && <span className="text-fg-muted/60 ml-1">(laissez vide pour garder l'existant)</span>}
				</label>
				<div className="relative">
					<Input
						placeholder={config?.hasSecret ? "••••••••••••" : "Client Secret"}
						type={showSecret ? "text" : "password"}
						value={clientSecret}
						onChange={(e) => setClientSecret(e.target.value)}
						className="pr-9"
					/>
					<button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg">
						{showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
					</button>
				</div>
			</BlockStack>
			<InlineStack align="end">
				<Button size="sm" onClick={handleSave} disabled={saving}>
					{saving ? "Enregistrement..." : "Enregistrer"}
				</Button>
			</InlineStack>
		</BlockStack>
	)
}

// ── Tools List ──

function ToolsList({ tools }: { tools: string[] }) {
	return (
		<BlockStack gap="none">
			{tools.map((tool) => (
				<Item key={tool}>
					<ItemContent>
						<ItemTitle className="font-mono text-xs">{tool}</ItemTitle>
					</ItemContent>
					<ItemActions>
						<Badge variant="outline" className="text-xs">
							Lecture
						</Badge>
					</ItemActions>
				</Item>
			))}
		</BlockStack>
	)
}

// ── Detail Page ──

export function ConnectionDetailClient({ providerId }: { providerId: string }) {
	const provider = providerMap[providerId]
	const connections = useQuery(api.connections.list)
	const removeConnection = useMutation(api.connections.remove)

	if (!provider) {
		return (
			<SettingsPage>
				<SettingsHeader title="Connexion introuvable" description="Ce provider n'existe pas." />
			</SettingsPage>
		)
	}

	const conn = connections?.find((c) => c.provider === providerId)
	const credKey = provider.credentialsKey ?? providerId
	const handleConnect = () => {
		window.location.href = `/api/connections/${providerId}/authorize`
	}

	const handleDisconnect = async () => {
		if (!conn) return
		try {
			await removeConnection({ id: conn._id })
			toast.success("Connexion supprimée")
		} catch {
			toast.error("Erreur lors de la déconnexion")
		}
	}

	return (
		<SettingsPage>
			<SettingsHeader
				title={
					<InlineStack gap="200" blockAlign="center">
						<img src={provider.logo} alt={provider.name} className="size-5" />
						<span>{provider.name}</span>
					</InlineStack>
				}
				description={provider.description}
			>
				{conn?.status === "active" ? (
					<Button variant="outline" size="sm" onClick={handleDisconnect}>
						Déconnecter
					</Button>
				) : (
					<Button variant="secondary" size="sm" onClick={handleConnect}>
						Connecter
					</Button>
				)}
			</SettingsHeader>

			{/* Connection status */}
			{conn && (
				<>
					<InlineStack gap="200" blockAlign="center">
						<Badge variant={conn.status === "active" ? "success" : "warning"}>{conn.status === "active" ? "Connecté" : conn.status}</Badge>
						{conn.accountInfo?.email && <span className="text-sm text-fg-muted">{conn.accountInfo.email}</span>}
					</InlineStack>
					<Divider />
				</>
			)}

			{/* Credentials */}
			{provider.authType === "oauth2" && (
				<BlockStack gap="300">
					<InlineStack align="space-between" blockAlign="center">
						<span className="text-sm font-medium">Credentials OAuth</span>
						<a
							href={credKey === "google" ? "https://console.cloud.google.com/apis/credentials" : "#"}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-fg-muted hover:text-fg inline-flex items-center gap-1"
						>
							Obtenir des credentials
							<ExternalLink className="size-3" />
						</a>
					</InlineStack>
					<CredentialsForm providerId={providerId} credentialsKey={credKey} />
				</BlockStack>
			)}

			<Divider />

			{/* Tools */}
			<BlockStack gap="300">
				<InlineStack align="space-between" blockAlign="center">
					<span className="text-sm font-medium">Outils disponibles</span>
					<Badge variant="outline">{provider.tools.length}</Badge>
				</InlineStack>
				<p className="text-xs text-fg-muted">Outils que les agents pourront utiliser une fois la connexion active.</p>
				<ToolsList tools={provider.tools} />
			</BlockStack>
		</SettingsPage>
	)
}
