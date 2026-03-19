import { OpsCommandPalette } from "@/components/ops-command-palette"
import { OpsFrame } from "@/components/ops-frame"
import { RouteGuard } from "@/components/route-guard"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard>
			<OpsFrame>
				<RouteGuard>{children}</RouteGuard>
			</OpsFrame>
			<OpsCommandPalette />
		</AuthGuard>
	)
}
