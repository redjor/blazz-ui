import { Divider } from "@/components/ui/divider"

export function DividerPreview() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-fg-muted mb-2">Default</p>
        <Divider />
      </div>
      <div>
        <p className="text-xs text-fg-muted mb-2">Secondary</p>
        <Divider borderColor="secondary" />
      </div>
      <div>
        <p className="text-xs text-fg-muted mb-2">Thick (100)</p>
        <Divider borderWidth="100" />
      </div>
    </div>
  )
}
