import { Outlet, createRootRoute } from "@tanstack/react-router"
import { ComponentTree } from "~/components/component-tree"
import "~/styles/app.css"

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blazz Sandbox" },
    ],
  }),
})

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head />
      <body className="bg-surface text-fg antialiased">
        <div className="flex h-screen">
          <ComponentTree />
          <main className="flex-1 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </body>
    </html>
  )
}
