import { Badge } from "@blazz/ui/components/ui/badge"

export function SandboxPreview() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <p className="text-sm text-fg-muted">Composant cobaye — Claude réécrit ce fichier pour les tests</p>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="critical">Critical</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="info">Info</Badge>
      </div>
    </div>
  )
}
