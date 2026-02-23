import { Button } from "@/components/ui/button"

export function ButtonPreview() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Default</Button>
        <Button size="sm" variant="outline">Outline</Button>
        <Button size="sm" variant="secondary">Secondary</Button>
        <Button size="sm" variant="ghost">Ghost</Button>
        <Button size="sm" variant="destructive">Destructive</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="xs">XS</Button>
        <Button size="sm">SM</Button>
        <Button>MD</Button>
        <Button size="lg">LG</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
      </div>
    </div>
  )
}
