import { Text } from "@blazz/ui/components/ui/text"

export function TextPreview() {
  return (
    <div className="space-y-2">
      <Text variant="heading-xl">Heading XL</Text>
      <Text variant="heading-lg">Heading LG</Text>
      <Text variant="heading-md">Heading MD</Text>
      <Text variant="heading-sm">Heading SM</Text>
      <Text variant="body-lg">Body large text for emphasis.</Text>
      <Text variant="body-md">Body medium — default reading text.</Text>
      <Text variant="body-sm">Body small for secondary content.</Text>
      <Text variant="body-sm" tone="muted">Muted tone for timestamps.</Text>
      <Text variant="body-sm" tone="success">Success tone.</Text>
      <Text variant="body-sm" tone="danger">Danger tone.</Text>
    </div>
  )
}
