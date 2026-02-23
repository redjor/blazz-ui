"use client"

import * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@/components/features/navigation-tabs"
import { OrgMenu, type Organization } from "@/components/blocks/org-menu"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { TabBar } from "@/components/layout/tab-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { crmNavigationConfig } from "@/config/crm-navigation"
import { titleFromPathname } from "@/lib/tab-utils"
import { useFrameLayout } from "@/lib/use-frame-layout"

const demoOrganizations: Organization[] = [
	{ id: "forge", name: "Forge CRM", slug: "forge-crm", plan: "Pro" },
	{ id: "acme", name: "Acme Corp", slug: "acme-corp", plan: "Free" },
	{ id: "startup", name: "StartupXYZ", slug: "startup-xyz", plan: "Team" },
]

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	const [activeOrg, setActiveOrg] = React.useState(demoOrganizations[0])
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
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
				activeSection="crm"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={crmNavigationConfig} />
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
