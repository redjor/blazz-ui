// apps/docs/src/data/components/dialog.ts
import type { ComponentData } from "../types"

export const dialogData: ComponentData = {
	name: "Dialog",
	category: "ui",
	description: "Modal dialog avec overlay, header, body et footer.",
	docPath: "/docs/components/ui/dialog",
	imports: {
		path: "@blazz/ui/components/ui/dialog",
		named: ["Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter", "DialogClose"],
	},
	props: [
		{ name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Callback au changement d'état.",
		},
		{ name: "defaultOpen", type: "boolean", description: "État initial (usage non-contrôlé)." },
	],
	gotchas: [
		"DialogTrigger uses render prop: `<DialogTrigger render={<Button />}>Open</DialogTrigger>` — never asChild",
		"DialogClose in forms: use explicit onClick to reset form state, not as button wrapper",
		"DialogContent size prop: 'sm' (default, 384px) | 'md' (512px) | 'lg' (672px) | 'xl' (896px) | 'full' (1152px)",
		"Buttons go in <DialogFooter> — never in a custom div. DialogFooter handles layout, gap, and background.",
		"Cancel button needs type='button' to prevent accidental form submit",
	],
	canonicalExample: `<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
}
