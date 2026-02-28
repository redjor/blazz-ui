import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
  {
    key: "with-sidebar",
    code: `import { DashboardLayout } from "@blazz/ui/components/patterns/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navbar={<MyNavbar />}
      sidebar={<MySidebar />}
      showSidebar={true}
    >
      {children}
    </DashboardLayout>
  )
}`,
  },
  {
    key: "without-sidebar",
    code: `import { DashboardLayout } from "@blazz/ui/components/patterns/dashboard-layout"

export default function FullWidthLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navbar={<MyNavbar />}
      showSidebar={false}
    >
      {children}
    </DashboardLayout>
  )
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/dashboard-layout")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: DashboardLayoutPage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const dashboardLayoutProps: DocProp[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Contenu principal.",
  },
  {
    name: "navbar",
    type: "React.ReactNode",
    description: "Header/navbar rendu en haut.",
  },
  {
    name: "sidebar",
    type: "React.ReactNode",
    description: "Sidebar rendue à gauche si showSidebar est true.",
  },
  {
    name: "showSidebar",
    type: "boolean",
    default: "true",
    description: "Affiche ou masque la sidebar.",
  },
  {
    name: "sidebarWidth",
    type: "string",
    default: '"20.5rem"',
    description: "Largeur CSS de la sidebar.",
  },
  {
    name: "bgColor",
    type: "string",
    default: '"bg-bb-dark-green"',
    description: "Couleur de fond de l'application (visible dans l'arrondi en haut).",
  },
  {
    name: "className",
    type: "string",
    description: "Classes CSS supplémentaires.",
  },
]

function LayoutPlaceholder() {
  return (
    <div className="flex h-32 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
      <div className="w-32 shrink-0 border-r border-dashed border-edge-subtle bg-raised/50 flex items-center justify-center">
        Sidebar
      </div>
      <div className="flex-1 flex items-center justify-center bg-surface">
        Main content
      </div>
    </div>
  )
}

function DashboardLayoutPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/dashboard-layout" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="Dashboard Layout" subtitle="Layout alternatif bas niveau : navbar fixe + sidebar optionnelle + zone de contenu. Alternative à AppFrame pour des layouts sur mesure." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Avec sidebar"
          code={examples[0].code}
          highlightedCode={html("with-sidebar")}
        >
          <LayoutPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Sans sidebar"
          description="Passer showSidebar={false} pour un layout pleine largeur."
          code={examples[1].code}
          highlightedCode={html("without-sidebar")}
        >
          <div className="h-32 rounded border border-dashed border-edge-subtle bg-surface flex items-center justify-center text-xs text-fg-muted">
            Full width content
          </div>
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={dashboardLayoutProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Frame",
              href: "/docs/components/patterns/app-frame",
              description: "Shell complet recommandé — intègre sidebar, top bar et mobile.",
            },
            {
              title: "Layout Frame",
              href: "/docs/components/patterns/layout-frame",
              description: "Brique flexbox encore plus bas niveau.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
