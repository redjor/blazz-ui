import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"

export function InputPreview() {
  return (
    <div className="space-y-3 max-w-xs">
      <div className="space-y-1">
        <Label htmlFor="demo-input">Label</Label>
        <Input id="demo-input" placeholder="Default input" />
      </div>
      <Input placeholder="Disabled" disabled />
      <Input placeholder="With value" defaultValue="Hello world" />
    </div>
  )
}
