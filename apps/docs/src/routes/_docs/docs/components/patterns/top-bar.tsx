import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
  {
    key: "breadcrumbs",
    code: `import { TopBar } from "@blazz/ui/components/patterns/top-bar"

export function MyTopBar() {
  return (
    <TopBar
      breadcrumbs={[
        { label: "Contacts", href: "/contacts" },
        { label: "Jane Dupont" },
      ]}
    />
  )
}`,
  },
  {
    key: "with-actions",
    code: `import { TopBar } from "@blazz/ui/components/patterns/top-bar"
import { Button } from "@blazz/ui/components/ui/button"

export function MyTopBarWithActions() {
  return (
    <TopBar
      title="Contacts"
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>Add Contact</Button>
        </>
      }
    />
  )
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/top-bar")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: TopBarPage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const topBarProps: DocProp[] = [
  {
    name: "breadcrumbs",
    type: "{ label: string; href?: string }[]",
    description: "Fil d'Ariane contextuel. Le dernier item est rendu sans lien.",
  },
  {
    name: "title",
    type: "string",
    description: "Titre affiché si aucun breadcrumb n'est fourni.",
  },
  {
    name: "actions",
    type: "React.ReactNode",
    description: "Boutons d'action alignés à droite.",
  },
  {
    name: "onToggleSidebar",
    type: "() => void",
    description: "Si fourni, affiche un bouton hamburger sur mobile pour toggle la sidebar.",
  },
  {
    name: "className",
    type: "string",
    description: "Classes CSS supplémentaires.",
  },
]

function ContentBarPlaceholder() {
  return (
    <div className="h-12 rounded border border-dashed border-edge-subtle bg-surface flex items-center px-4 text-xs text-fg-muted gap-2">
      <span>Contacts</span>
      <span>/</span>
      <span className="font-medium text-fg">Jane Dupont</span>
      <div className="ml-auto flex gap-2">
        <div className="h-7 w-16 rounded border border-dashed border-edge-subtle flex items-center justify-center">Export</div>
        <div className="h-7 w-24 rounded bg-brand/20 flex items-center justify-center">Add Contact</div>
      </div>
    </div>
  )
}

function TopBarPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/top-bar" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="Top Bar" subtitle="Header de zone de contenu : breadcrumbs contextuels et actions. Complémentaire à AppTopBar qui est le header global." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Avec breadcrumbs"
          description="Rendu en bas de la top bar globale, sur chaque page de contenu."
          code={examples[0].code}
          highlightedCode={html("breadcrumbs")}
        >
          <ContentBarPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Avec titre et actions"
          description="Utiliser title si vous n'avez pas de fil d'Ariane."
          code={examples[1].code}
          highlightedCode={html("with-actions")}
        >
          <ContentBarPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={topBarProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Top Bar",
              href: "/docs/components/patterns/app-top-bar",
              description: "Header global de l'application (logo, sections, search).",
            },
            {
              title: "App Frame",
              href: "/docs/components/patterns/app-frame",
              description: "Shell complet qui compose TopBar avec sidebar et navigation.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
