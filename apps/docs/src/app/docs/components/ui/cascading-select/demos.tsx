"use client"

import { CascadingSelect, type CascadingSelectNode } from "@blazz/ui/components/ui/cascading-select"
import { Label } from "@blazz/ui/components/ui/label"
import * as React from "react"

const PRODUCT_CATEGORIES: CascadingSelectNode[] = [
	{
		id: "boissons",
		label: "Boissons",
		children: [
			{
				id: "alcools",
				label: "Alcools",
				children: [
					{ id: "aperitifs", label: "Apéritifs" },
					{ id: "vins", label: "Vins" },
					{ id: "bieres", label: "Bières" },
				],
			},
			{ id: "eaux", label: "Eaux" },
			{ id: "jus", label: "Jus de fruits" },
			{ id: "sodas", label: "Sodas & Soft drinks" },
		],
	},
	{
		id: "alimentation",
		label: "Alimentation",
		children: [
			{
				id: "frais",
				label: "Frais",
				children: [
					{ id: "viandes", label: "Viandes" },
					{ id: "poissons", label: "Poissons" },
					{ id: "produits-laitiers", label: "Produits laitiers" },
				],
			},
			{ id: "epicerie", label: "Épicerie" },
			{ id: "surgeles", label: "Surgelés" },
		],
	},
	{
		id: "electronique",
		label: "Électronique",
		children: [
			{ id: "smartphones", label: "Smartphones" },
			{ id: "ordinateurs", label: "Ordinateurs" },
			{ id: "audio", label: "Audio" },
		],
	},
]

const GEOGRAPHIC: CascadingSelectNode[] = [
	{
		id: "france",
		label: "France",
		children: [
			{
				id: "ile-de-france",
				label: "Île-de-France",
				children: [
					{ id: "paris", label: "Paris" },
					{ id: "versailles", label: "Versailles" },
				],
			},
			{
				id: "paca",
				label: "PACA",
				children: [
					{ id: "marseille", label: "Marseille" },
					{ id: "nice", label: "Nice" },
				],
			},
		],
	},
	{
		id: "belgique",
		label: "Belgique",
		children: [
			{ id: "bruxelles", label: "Bruxelles" },
			{ id: "liege", label: "Liège" },
		],
	},
]

export function DefaultDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[300px]">
			<CascadingSelect nodes={PRODUCT_CATEGORIES} value={value} onValueChange={setValue} placeholder="Select a category..." />
		</div>
	)
}

export function WithLabelDemo() {
	const [value, setValue] = React.useState("aperitifs")
	return (
		<div className="w-[300px] space-y-1.5">
			<Label>
				Category <span className="text-negative">*</span>
			</Label>
			<CascadingSelect nodes={PRODUCT_CATEGORIES} value={value} onValueChange={setValue} placeholder="Select a category..." />
		</div>
	)
}

export function GeographicDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[300px]">
			<CascadingSelect nodes={GEOGRAPHIC} value={value} onValueChange={setValue} placeholder="Select a region..." />
		</div>
	)
}
