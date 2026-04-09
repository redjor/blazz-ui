import { CodeDemo } from "~/components/landing/code-demo"
import { Faq } from "~/components/landing/faq"
import { FeaturesGrid } from "~/components/landing/features-grid"
import { Footer } from "~/components/landing/footer"
import { Hero } from "~/components/landing/hero"
import { Navbar } from "~/components/landing/navbar"
import { Pricing } from "~/components/landing/pricing"
import { SocialProof } from "~/components/landing/social-proof"
import { ThemeShowcase } from "~/components/landing/theme-showcase"
import { WhyTeamsBuy } from "~/components/landing/why-teams-buy"

export default function Home() {
	return (
		<main className="min-h-screen bg-page">
			<Navbar />
			<Hero />
			<SocialProof />
			<FeaturesGrid />
			<CodeDemo />
			<ThemeShowcase />
			<WhyTeamsBuy />
			<Pricing />
			<Faq />
			<Footer />
		</main>
	)
}
