import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@blazz/ui/components/ui/card"

export function CardPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description with secondary text.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input placeholder="Type something..." />
        <p className="text-xs text-fg-muted">
          This is muted text inside the card content area.
        </p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-fg-subtle">Footer</span>
        <Button size="sm" className="ml-auto">Save</Button>
      </CardFooter>
    </Card>
  )
}
