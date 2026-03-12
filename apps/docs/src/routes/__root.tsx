/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { BlazzProvider } from "@blazz/ui/lib/license-context"
import appCss from "~/styles/globals.css?url"

const BLAZZ_DEV_LICENSE = "BLAZZ-PRO-BLAZZDEV-20271231-569bc77c0666d084"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Blazz UI" },
      { name: "description", content: "Pro UI Kit — AI-native components for data-heavy apps" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        children: `(function(){try{var m=document.cookie.match(/theme=(\\w+)/);var t=m?m[1]:'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-['Inter',sans-serif] antialiased">
        <BlazzProvider licenseKey={BLAZZ_DEV_LICENSE}>
          {children}
        </BlazzProvider>
        <Scripts />
      </body>
    </html>
  )
}
