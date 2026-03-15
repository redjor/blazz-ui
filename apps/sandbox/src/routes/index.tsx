import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">Blazz Sandbox</h1>
      <p className="text-fg-muted">Select a component from the sidebar.</p>
    </div>
  )
}
