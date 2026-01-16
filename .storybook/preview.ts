import type { Preview } from "@storybook/nextjs-vite"
import "../app/globals.css"

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
			expanded: true, // Expand controls by default
		},
		docs: {
			toc: true, // Table of contents in docs
		},
		backgrounds: {
			default: "light",
			values: [
				{ name: "light", value: "#ffffff" },
				{ name: "dark", value: "#0a0a0a" },
			],
		},
		viewport: {
			viewports: {
				mobile1: {
					name: "Mobile (375px)",
					styles: { width: "375px", height: "667px" },
				},
				tablet: {
					name: "Tablet (768px)",
					styles: { width: "768px", height: "1024px" },
				},
				desktop: {
					name: "Desktop (1440px)",
					styles: { width: "1440px", height: "900px" },
				},
			},
		},
	},
	globalTypes: {
		theme: {
			description: "Global theme for components",
			defaultValue: "light",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: ["light", "dark"],
				dynamicTitle: true,
			},
		},
	},
}

export default preview
