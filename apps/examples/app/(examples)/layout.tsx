"use client"

import * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@blazz/ui/components/patterns/navigation-tabs"
import { OrgMenu, type Organization } from "@blazz/ui/components/blocks/org-menu"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/patterns/frame-context"
import { TabBar } from "@blazz/ui/components/patterns/tab-bar"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { crmSidebarConfig, crmNavigationConfig } from "@/config/crm-navigation"
import { titleFromPathname } from "@blazz/ui/lib/tab-utils"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"

const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? ""

const sections = [
	{ id: "docs", label: "Docs", href: `${docsUrl}/docs/components` },
	{ id: "crm", label: "CRM", href: "/examples/crm/dashboard" },
	{ id: "talentflow", label: "TalentFlow", href: "/examples/talentflow/dashboard" },
	{ id: "stockbase", label: "StockBase", href: "/examples/stockbase/dashboard" },
]

const demoOrganizations: Organization[] = [
	{ id: "forge", name: "Forge CRM", slug: "forge-crm", plan: "Pro" },
	{ id: "acme", name: "Acme Corp", slug: "acme-corp", plan: "Free" },
	{ id: "startup", name: "StartupXYZ", slug: "startup-xyz", plan: "Team" },
]

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
	const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	const [activeOrg, setActiveOrg] = React.useState(demoOrganizations[0])
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				sidebarConfig={crmSidebarConfig}
				navigation={crmNavigationConfig}
				sidebarHeader={
					<OrgMenu
						organizations={demoOrganizations}
						activeOrganization={activeOrg}
						onSelect={setActiveOrg}
						onCreate={() => {}}
					/>
				}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				sections={sections}
				activeSection="crm"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={crmNavigationConfig} open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<NavigationTabsProvider storageKey="blazz-crm-tabs">
				<CrmLayoutInner>{children}</CrmLayoutInner>
			</NavigationTabsProvider>
		</FrameProvider>
	)
}
