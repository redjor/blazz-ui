import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/thumbnail")({
  component: ThumbnailLayout,
})

function ThumbnailLayout() {
  return (
    <div className="bg-surface">
      <Outlet />
    </div>
  )
}
