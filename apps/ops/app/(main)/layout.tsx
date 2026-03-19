import { OpsCommandPalette } from "@/components/ops-command-palette"
import { OpsFrame } from "@/components/ops-frame"
import { RouteGuard } from "@/components/route-guard"
import { FeatureFlagsProvider } from "@/lib/feature-flags-context"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard>
			<FeatureFlagsProvider>
				<OpsFrame>
					<RouteGuard>{children}</RouteGuard>
				</OpsFrame>
				<OpsCommandPalette />
			</FeatureFlagsProvider>
		</AuthGuard>
	)
}
