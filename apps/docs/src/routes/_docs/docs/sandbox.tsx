import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { SandboxPreview } from "~/components/docs/sandbox-preview"

const getSandboxReport = createServerFn({ method: "GET" }).handler(async () => {
  const { fileURLToPath } = await import("node:url")
  const { default: path } = await import("node:path")
  const { default: fs } = await import("node:fs/promises")
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const reportPath = path.resolve(__dirname, "../../../../sandbox-report.md")
  return fs.readFile(reportPath, "utf-8").catch(
    () => "Aucun rapport — lance `/blazz-audit` sur `sandbox-preview.tsx` d'abord."
  )
})

export const Route = createFileRoute("/_docs/docs/sandbox")({
  loader: async () => {
    const report = await getSandboxReport()
    return { report }
  },
  component: SandboxPage,
})

function SandboxPage() {
  const { report } = useLoaderData({ from: "/_docs/docs/sandbox" })

  return (
    <div className="flex h-full">
      {/* Panneau gauche — composant rendu */}
      <div className="flex-[3] overflow-y-auto border-r border-container bg-surface">
        <div className="p-4 border-b border-container">
          <p className="text-xs font-mono text-fg-muted">sandbox-preview.tsx</p>
        </div>
        <SandboxPreview />
      </div>

      {/* Panneau droit — rapport audit */}
      <div className="flex-[2] overflow-y-auto bg-raised">
        <div className="p-4 border-b border-container">
          <p className="text-xs font-mono text-fg-muted">sandbox-report.md</p>
        </div>
        <pre className="p-6 whitespace-pre-wrap font-mono text-sm text-fg leading-relaxed">
          {report}
        </pre>
      </div>
    </div>
  )
}
