import type { Config } from "tailwindcss"

export default {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"../../dist/**/*.{js,mjs}",
	],
	theme: {
		extend: {
			// Polaris Spacing Scale
			spacing: {
				"p-0": "var(--p-space-0)",
				"p-025": "var(--p-space-025)",
				"p-050": "var(--p-space-050)",
				"p-1": "var(--p-space-100)",
				"p-1.5": "var(--p-space-150)",
				"p-2": "var(--p-space-200)",
				"p-3": "var(--p-space-300)",
				"p-4": "var(--p-space-400)",
				"p-5": "var(--p-space-500)",
				"p-6": "var(--p-space-600)",
				"p-8": "var(--p-space-800)",
				"p-10": "var(--p-space-1000)",
				"p-12": "var(--p-space-1200)",
				"p-16": "var(--p-space-1600)",
				"p-20": "var(--p-space-2000)",
				"p-24": "var(--p-space-2400)",
				"p-28": "var(--p-space-2800)",
				"p-32": "var(--p-space-3200)",
			},

			// Polaris Border Radius
			borderRadius: {
				"p-none": "var(--p-border-radius-0)",
				"p-sm": "var(--p-border-radius-050)",
				p: "var(--p-border-radius-100)",
				"p-md": "var(--p-border-radius-150)",
				"p-lg": "var(--p-border-radius-200)",
				"p-xl": "var(--p-border-radius-300)",
				"p-2xl": "var(--p-border-radius-400)",
				"p-3xl": "var(--p-border-radius-500)",
				"p-4xl": "var(--p-border-radius-750)",
				"p-full": "var(--p-border-radius-full)",
			},

			// Polaris Shadows
			boxShadow: {
				"p-none": "var(--p-shadow-0)",
				"p-sm": "var(--p-shadow-100)",
				p: "var(--p-shadow-200)",
				"p-md": "var(--p-shadow-300)",
				"p-lg": "var(--p-shadow-400)",
				"p-xl": "var(--p-shadow-500)",
				"p-2xl": "var(--p-shadow-600)",
				"p-bevel": "var(--p-shadow-bevel-100)",
				"p-inset": "var(--p-shadow-inset-100)",
				"p-inset-lg": "var(--p-shadow-inset-200)",
				"p-button": "var(--p-shadow-button)",
				"p-button-hover": "var(--p-shadow-button-hover)",
				"p-button-active": "var(--p-shadow-button-inset)",
				"p-button-primary": "var(--p-shadow-button-primary)",
				"p-button-primary-hover": "var(--p-shadow-button-primary-hover)",
				"p-button-primary-active": "var(--p-shadow-button-primary-inset)",
			},

			// Polaris Typography
			fontSize: {
				"p-xs": ["var(--p-font-size-275)", { lineHeight: "var(--p-font-line-height-300)" }],
				"p-sm": ["var(--p-font-size-300)", { lineHeight: "var(--p-font-line-height-400)" }],
				"p-base": ["var(--p-font-size-325)", { lineHeight: "var(--p-font-line-height-500)" }],
				"p-md": ["var(--p-font-size-350)", { lineHeight: "var(--p-font-line-height-500)" }],
				"p-lg": ["var(--p-font-size-400)", { lineHeight: "var(--p-font-line-height-600)" }],
				"p-xl": ["var(--p-font-size-500)", { lineHeight: "var(--p-font-line-height-600)" }],
				"p-2xl": ["var(--p-font-size-600)", { lineHeight: "var(--p-font-line-height-800)" }],
				"p-3xl": ["var(--p-font-size-750)", { lineHeight: "var(--p-font-line-height-1000)" }],
				"p-4xl": ["var(--p-font-size-900)", { lineHeight: "var(--p-font-line-height-1200)" }],
			},

			fontWeight: {
				"p-regular": "var(--p-font-weight-regular)", // 450
				"p-medium": "var(--p-font-weight-medium)", // 550
				"p-semibold": "var(--p-font-weight-semibold)", // 650
				"p-bold": "var(--p-font-weight-bold)", // 700
			},

			// Polaris Colors
			colors: {
				p: {
					bg: {
						DEFAULT: "var(--p-color-bg)",
						surface: "var(--p-color-bg-surface)",
						"surface-hover": "var(--p-color-bg-surface-hover)",
						"surface-active": "var(--p-color-bg-surface-active)",
						"surface-secondary": "var(--p-color-bg-surface-secondary)",
						"surface-tertiary": "var(--p-color-bg-surface-tertiary)",
					},
					fill: {
						DEFAULT: "var(--p-color-bg-fill)",
						hover: "var(--p-color-bg-fill-hover)",
						active: "var(--p-color-bg-fill-active)",
						secondary: "var(--p-color-bg-fill-secondary)",
						tertiary: "var(--p-color-bg-fill-tertiary)",
						brand: "var(--p-color-bg-fill-brand)",
						"brand-hover": "var(--p-color-bg-fill-brand-hover)",
					},
					text: {
						DEFAULT: "var(--p-color-text)",
						secondary: "var(--p-color-text-secondary)",
						disabled: "var(--p-color-text-disabled)",
						brand: "var(--p-color-text-brand)",
						"on-fill": "var(--p-color-text-brand-on-bg-fill)",
					},
					border: {
						DEFAULT: "var(--p-color-border)",
						hover: "var(--p-color-border-hover)",
						secondary: "var(--p-color-border-secondary)",
						focus: "var(--p-color-border-focus)",
					},
					icon: {
						DEFAULT: "var(--p-color-icon)",
						hover: "var(--p-color-icon-hover)",
						secondary: "var(--p-color-icon-secondary)",
					},
					// Semantic colors
					info: {
						surface: "var(--p-color-bg-surface-info)",
						fill: "var(--p-color-bg-fill-info)",
						text: "var(--p-color-text-info)",
						border: "var(--p-color-border-info)",
						icon: "var(--p-color-icon-info)",
					},
					success: {
						surface: "var(--p-color-bg-surface-success)",
						fill: "var(--p-color-bg-fill-success)",
						text: "var(--p-color-text-success)",
						border: "var(--p-color-border-success)",
						icon: "var(--p-color-icon-success)",
					},
					warning: {
						surface: "var(--p-color-bg-surface-warning)",
						fill: "var(--p-color-bg-fill-warning)",
						text: "var(--p-color-text-warning)",
						border: "var(--p-color-border-warning)",
						icon: "var(--p-color-icon-warning)",
					},
					caution: {
						surface: "var(--p-color-bg-surface-caution)",
						fill: "var(--p-color-bg-fill-caution)",
						text: "var(--p-color-text-caution)",
						border: "var(--p-color-border-caution)",
						icon: "var(--p-color-icon-caution)",
					},
					critical: {
						surface: "var(--p-color-bg-surface-critical)",
						fill: "var(--p-color-bg-fill-critical)",
						text: "var(--p-color-text-critical)",
						border: "var(--p-color-border-critical)",
						icon: "var(--p-color-icon-critical)",
					},
				},
			},

			// Polaris Motion
			transitionDuration: {
				"p-0": "var(--p-motion-duration-0)",
				"p-50": "var(--p-motion-duration-50)",
				"p-100": "var(--p-motion-duration-100)",
				"p-150": "var(--p-motion-duration-150)",
				"p-200": "var(--p-motion-duration-200)",
				"p-250": "var(--p-motion-duration-250)",
				"p-300": "var(--p-motion-duration-300)",
			},

			transitionTimingFunction: {
				"p-ease": "var(--p-motion-ease)",
				"p-ease-in": "var(--p-motion-ease-in)",
				"p-ease-out": "var(--p-motion-ease-out)",
				"p-ease-in-out": "var(--p-motion-ease-in-out)",
			},
		},
	},
	plugins: [],
} satisfies Config
