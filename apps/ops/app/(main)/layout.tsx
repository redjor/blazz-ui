import { OpsFrame } from "@/components/ops-frame"
import { AuthGuard } from "./auth-guard"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuard>
			<OpsFrame>{children}</OpsFrame>
		</AuthGuard>
	)
}
