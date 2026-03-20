import { Faq } from "~/components/landing/faq"
import { FeaturesGrid } from "~/components/landing/features-grid"
import { Footer } from "~/components/landing/footer"
import { Hero } from "~/components/landing/hero"
import { Navbar } from "~/components/landing/navbar"
import { Pricing } from "~/components/landing/pricing"
import { RoiCalculator } from "~/components/landing/roi-calculator"
import { StatsBar } from "~/components/landing/stats-bar"

export default function Home() {
	return (
		<div className="min-h-screen bg-app">
			<Navbar />
			<Hero />
			<StatsBar />
			<FeaturesGrid />
			<RoiCalculator />
			<Pricing />
			<Faq />
			<Footer />
		</div>
	)
}
