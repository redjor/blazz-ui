import { Alert, AlertTitle, AlertDescription } from "@blazz/ui/components/ui/alert"

export function AlertPreview() {
  return (
    <div className="space-y-2 max-w-md">
      <Alert>
        <AlertTitle>Default alert</AlertTitle>
        <AlertDescription>This is a default alert message.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    </div>
  )
}
