import { OpsFrame } from "@/components/ops-frame"

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return <OpsFrame>{children}</OpsFrame>
}
