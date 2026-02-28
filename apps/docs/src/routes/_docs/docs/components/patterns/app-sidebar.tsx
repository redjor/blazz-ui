import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
  {
    key: "basic",
    code: `import { AppSidebar } from "@blazz/ui/components/patterns/app-sidebar"
import { LayoutGrid, Users, Settings } from "lucide-react"

const config = {
  user: { name: "Jane Dupont", email: "jane@acme.com", role: "Admin" },
  navigation: [
    {
      id: "main",
      title: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
        { title: "Contacts", url: "/contacts", icon: Users },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ],
}

export function MySidebar() {
  return <AppSidebar config={config} />
}`,
  },
  {
    key: "with-header",
    code: `import { AppSidebar } from "@blazz/ui/components/patterns/app-sidebar"

// config est le même objet SidebarConfig que dans l'exemple précédent
// OrgSwitcher est votre propre composant de sélection d'organisation
export function MySidebarWithOrg() {
  return (
    <AppSidebar
      config={config}
      header={<OrgSwitcher />}
    />
  )
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/app-sidebar")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: AppSidebarPage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const appSidebarProps: DocProp[] = [
  {
    name: "config",
    type: "SidebarConfig",
    required: true,
    description: "Configuration de la sidebar : user (name, email, role) + navigation (sections et items).",
  },
  {
    name: "header",
    type: "React.ReactNode",
    description: "Slot rendu au-dessus de la navigation. Typiquement un OrgSwitcher.",
  },
]

function SidebarPlaceholder() {
  return (
    <div className="h-40 w-48 rounded border border-dashed border-edge-subtle bg-raised/50 flex flex-col p-3 gap-2 text-xs text-fg-muted">
      <div className="h-6 rounded bg-surface flex items-center px-2">Dashboard</div>
      <div className="h-6 rounded bg-brand/10 flex items-center px-2 text-brand">Contacts ←</div>
      <div className="h-6 rounded bg-surface flex items-center px-2">Settings</div>
    </div>
  )
}

function AppSidebarPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/app-sidebar" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="App Sidebar" subtitle="Sidebar hiérarchique pilotée par un objet SidebarConfig. Supporte les sections, sous-items collapsibles, et le footer utilisateur." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Usage basique"
          description="Passer un SidebarConfig avec user et navigation."
          code={examples[0].code}
          highlightedCode={html("basic")}
        >
          <SidebarPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Avec header slot"
          description="Le slot header apparaît en haut de la sidebar, avant la navigation."
          code={examples[1].code}
          highlightedCode={html("with-header")}
        >
          <SidebarPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={appSidebarProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Frame",
              href: "/docs/components/patterns/app-frame",
              description: "Shell complet qui compose AppSidebar avec AppTopBar.",
            },
            {
              title: "Layout Frame",
              href: "/docs/components/patterns/layout-frame",
              description: "Brique flexbox si vous avez besoin d'un layout custom.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
