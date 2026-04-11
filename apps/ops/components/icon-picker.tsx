"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import { useState } from "react"
import { getIcon, getIconColorClasses, ICON_COLORS, ICON_SET } from "@/lib/icon-palette"

// ---------------------------------------------------------------------------
// ColorPicker — rangée de 8 pastilles
// ---------------------------------------------------------------------------

interface ColorPickerProps {
	value: string
	onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
	return (
		<InlineStack gap="100" wrap>
			{ICON_COLORS.map((c) => (
				<button
					key={c.id}
					type="button"
					onClick={() => onChange(c.id)}
					className={`size-6 rounded-full border-2 transition-all ${c.bg} ${value === c.id ? "border-fg scale-110" : "border-transparent"}`}
					title={c.label}
					aria-label={c.label}
					aria-pressed={value === c.id}
				/>
			))}
		</InlineStack>
	)
}

// ---------------------------------------------------------------------------
// IconPicker — grille 8 colonnes d'icônes
// ---------------------------------------------------------------------------

interface IconPickerProps {
	value: string
	onChange: (icon: string) => void
	color: string
}

export function IconPicker({ value, onChange, color }: IconPickerProps) {
	const colorClasses = getIconColorClasses(color)

	return (
		<div className="grid grid-cols-8 gap-1">
			{ICON_SET.map((item) => {
				const isSelected = value === item.id
				return (
					<button
						key={item.id}
						type="button"
						onClick={() => onChange(item.id)}
						className={`flex items-center justify-center size-8 rounded-md transition-all ${
							isSelected ? `bg-muted ring-1 ring-edge ${colorClasses.text}` : "text-fg-muted hover:bg-card hover:text-fg-secondary"
						}`}
						title={item.label}
						aria-label={item.label}
						aria-pressed={isSelected}
					>
						<item.icon className="size-4" />
					</button>
				)
			})}
		</div>
	)
}

// ---------------------------------------------------------------------------
// IconPickerTile — preview read-only, utilisée dans le trigger du popover
// et partout où on veut afficher l'état courant du picker
// ---------------------------------------------------------------------------

interface IconPickerTileProps {
	icon?: string
	color?: string
	size?: "sm" | "md"
}

export function IconPickerTile({ icon, color, size = "md" }: IconPickerTileProps) {
	const Icon = getIcon(icon) ?? getIcon("folder")!
	const classes = getIconColorClasses(color)
	const sizeCls = size === "md" ? "size-10" : "size-8"
	const iconCls = size === "md" ? "size-5" : "size-4"
	return (
		<span className={`inline-flex items-center justify-center rounded-md ${sizeCls} ${classes.bg}`}>
			<Icon className={`${iconCls} ${classes.text}`} />
		</span>
	)
}

// ---------------------------------------------------------------------------
// IconPickerField — trigger en tuile + popover avec les deux pickers
// ---------------------------------------------------------------------------

interface IconPickerFieldProps {
	icon?: string
	color?: string
	onIconChange: (icon: string) => void
	onColorChange: (color: string) => void
	/** aria-label du bouton trigger, default : "Choisir une icône et une couleur" */
	ariaLabel?: string
}

export function IconPickerField({ icon, color, onIconChange, onColorChange, ariaLabel = "Choisir une icône et une couleur" }: IconPickerFieldProps) {
	const [open, setOpen] = useState(false)
	const resolvedIcon = icon ?? "folder"
	const resolvedColor = color ?? "zinc"

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger type="button" aria-label={ariaLabel} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand">
				<IconPickerTile icon={resolvedIcon} color={resolvedColor} size="md" />
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[320px] p-3">
				<BlockStack gap="300">
					<BlockStack gap="150">
						<p className="text-xs font-medium text-fg-muted">Couleur</p>
						<ColorPicker value={resolvedColor} onChange={onColorChange} />
					</BlockStack>
					<BlockStack gap="150">
						<p className="text-xs font-medium text-fg-muted">Icône</p>
						<IconPicker
							value={resolvedIcon}
							color={resolvedColor}
							onChange={(id) => {
								onIconChange(id)
								setOpen(false)
							}}
						/>
					</BlockStack>
				</BlockStack>
			</PopoverContent>
		</Popover>
	)
}
