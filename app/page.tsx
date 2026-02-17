import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatsBar } from "@/components/landing/stats-bar"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { AppShowcase } from "@/components/landing/app-showcase"
import { RoiCalculator } from "@/components/landing/roi-calculator"
import { Pricing } from "@/components/landing/pricing"
import { Faq } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function Home() {
	return (
		<div className="min-h-screen bg-app">
			<Navbar />
			<Hero />
			<StatsBar />
			<FeaturesGrid />
			<AppShowcase />
			<RoiCalculator />
			<Pricing />
			<Faq />
			<Footer />
		</div>
	)
}
