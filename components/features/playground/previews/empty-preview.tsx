import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"

export function EmptyPreview() {
  return (
    <Empty>
      <EmptyIcon><Inbox className="size-10" /></EmptyIcon>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
      <EmptyActions>
        <Button size="sm" variant="outline">Clear filters</Button>
      </EmptyActions>
    </Empty>
  )
}
