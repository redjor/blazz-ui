import { Switch } from "@blazz/ui/components/ui/switch"
import { Label } from "@blazz/ui/components/ui/label"

export function SwitchPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch id="s1" defaultChecked />
        <Label htmlFor="s1">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s2" />
        <Label htmlFor="s2">Disabled feature</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="s3" disabled />
        <Label htmlFor="s3" className="text-fg-subtle">Disabled</Label>
      </div>
    </div>
  )
}
