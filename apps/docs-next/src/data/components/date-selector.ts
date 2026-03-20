// apps/docs/src/data/components/date-selector.ts
import type { ComponentData } from "../types"

export const dateSelectorData: ComponentData = {
	name: "DateSelector",
	category: "ui",
	description: "Sélecteur de date avec calendrier popup. Remplace <input type='date'>.",
	docPath: "/docs/components/ui/date-selector",
	imports: {
		path: "@blazz/ui/components/ui/date-selector",
		named: ["DateSelector", "DateRangeSelector"],
	},
	props: [
		{ name: "value", type: "Date | undefined", description: "Date sélectionnée." },
		{
			name: "onValueChange",
			type: "(date: Date | undefined) => void",
			description: "Callback au changement.",
		},
		{
			name: "placeholder",
			type: "string",
			default: '"Pick a date"',
			description: "Texte placeholder.",
		},
		{
			name: "formatStr",
			type: "string",
			default: '"PPP"',
			description: "Format date-fns pour l'affichage (ex: 'dd/MM/yyyy').",
		},
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive le sélecteur." },
	],
	gotchas: [
		"NEVER use <input type='date'> — always use DateSelector",
		"Value is Date object, not string — with react-hook-form store as string and convert: `value={watch('date') ? parseISO(watch('date')) : undefined}`",
		"With react-hook-form: `onValueChange={(d) => setValue('date', d ? format(d, 'yyyy-MM-dd') : '')}`",
		"For date ranges use DateRangeSelector with from/to/onRangeChange props — not two DateSelectors",
	],
	canonicalExample: `import { parseISO, format } from "date-fns"

<DateSelector
  value={watch("date") ? parseISO(watch("date")) : undefined}
  onValueChange={(d) => setValue("date", d ? format(d, "yyyy-MM-dd") : "")}
  placeholder="Pick a date"
  formatStr="dd/MM/yyyy"
/>`,
}
