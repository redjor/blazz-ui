import { Badge } from "@blazz/ui/components/ui/badge"

export function SandboxPreview() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <p className="text-sm text-fg-muted">Composant cobaye — Claude réécrit ce fichier pour les tests</p>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="positive">Positive</Badge>
        <Badge variant="negative">Negative</Badge>
        <Badge variant="caution">Caution</Badge>
        <Badge variant="inform">Inform</Badge>
      </div>
    </div>
  )
}
