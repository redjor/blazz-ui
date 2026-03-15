import { Outlet, createRootRoute } from "@tanstack/react-router"
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
        <Outlet />
      </body>
    </html>
  )
}
