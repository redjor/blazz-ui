# App Shell Patterns Documentation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remplacer les 6 stubs "Documentation coming soon" du groupe App Shell par des pages de doc complètes (format léger : usage snippets + props table + related).

**Architecture:** Chaque fichier de route existant est écrasé avec sa version documentée. Le pattern est identique à `apps/docs/src/routes/_docs/docs/components/ui/button.tsx` : loader TanStack pour le highlight code + DocPage + DocSection + DocExampleClient + DocPropsTable + DocRelated. Pas de live preview interactif — les patterns App Shell sont des layouts full-page, donc `DocExampleClient` reçoit un simple placeholder visuel structurel.

**Tech Stack:** TanStack Router (`createFileRoute`, `useLoaderData`), `highlightCode` (Shiki via serveur), composants docs (`DocPage`, `DocSection`, `DocExampleClient`, `DocPropsTable`, `DocRelated`)

---

## Référence rapide

**Pattern de base (copier de `button.tsx`) :**

```tsx
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
  { key: "basic", code: `...` },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/COMPONENT")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: ComponentPage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const props: DocProp[] = [ ... ]

function ComponentPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/COMPONENT" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="..." subtitle="..." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient title="..." code={examples[0].code} highlightedCode={html("basic")}>
          {/* Placeholder visuel */}
          <LayoutPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={props} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated items={[...]} />
      </DocSection>
    </DocPage>
  )
}
```

**Placeholder visuel réutilisable (copier dans chaque fichier) :**
```tsx
function LayoutPlaceholder({ type = "sidebar" }: { type?: "sidebar" | "topbar" | "fullframe" }) {
  if (type === "topbar") {
    return (
      <div className="h-12 rounded border border-dashed border-edge-subtle bg-raised/50 flex items-center px-4 text-xs text-fg-muted">
        Header bar
      </div>
    )
  }
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
```

**Vérification dev :** `pnpm dev:docs` (port 3100)

---

### Task 1 : App Frame

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/app-frame.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
    code: `import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { sidebarConfig } from "@/config/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame sidebarConfig={sidebarConfig}>
      {children}
    </AppFrame>
  )
}`,
  },
  {
    key: "full",
    code: `import * as React from "react"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { sidebarConfig } from "@/config/navigation"

const sections = [
  { id: "showcase", label: "Showcase", href: "/showcase" },
  { id: "crm", label: "CRM", href: "/crm" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = React.useState(false)

  return (
    <AppFrame
      sidebarConfig={sidebarConfig}
      sections={sections}
      activeSection="showcase"
      onOpenCommandPalette={() => setCmdOpen(true)}
      minimalTopBar={false}
      sidebarHeader={<OrgSwitcher />}
    >
      {children}
    </AppFrame>
  )
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/app-frame")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: AppFramePage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const appFrameProps: DocProp[] = [
  {
    name: "sidebarConfig",
    type: "SidebarConfig",
    description: "Configuration complète de la sidebar (user, navigation). Requis si navigation n'est pas fourni.",
  },
  {
    name: "navigation",
    type: "NavigationSection[]",
    description: "Shortcut pour passer uniquement la navigation sans le reste du SidebarConfig.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Contenu principal de l'application.",
  },
  {
    name: "sidebarHeader",
    type: "React.ReactNode",
    description: "Slot rendu en haut de la sidebar, avant la navigation. Typiquement un OrgSwitcher.",
  },
  {
    name: "sidebarFooter",
    type: "React.ReactNode",
    description: "Slot rendu en bas de la sidebar.",
  },
  {
    name: "tabBar",
    type: "React.ReactNode",
    description: "Barre de navigation bas de page (mobile).",
  },
  {
    name: "sections",
    type: "TopBarSection[]",
    description: "Liens de navigation de sections affichés dans la top bar.",
  },
  {
    name: "activeSection",
    type: "string",
    description: "ID de la section active — surligne le bon lien dans la top bar.",
  },
  {
    name: "onOpenCommandPalette",
    type: "() => void",
    description: "Callback déclenché au clic sur la barre de recherche. Connecter à CommandPalette.",
  },
  {
    name: "minimalTopBar",
    type: "boolean",
    default: "false",
    description: "Masque les notifications et le user menu dans la top bar.",
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

function AppFramePage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/app-frame" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="App Frame" subtitle="Shell d'application complet : sidebar + top bar + gestion mobile. Point d'entrée recommandé pour la plupart des applications." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Usage basique"
          description="Passer un SidebarConfig suffit pour avoir une app fonctionnelle."
          code={examples[0].code}
          highlightedCode={html("basic")}
        >
          <LayoutPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Avec sections et command palette"
          description="Activer la navigation multi-sections dans la top bar et connecter la command palette."
          code={examples[1].code}
          highlightedCode={html("full")}
        >
          <LayoutPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={appFrameProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Sidebar",
              href: "/docs/components/patterns/app-sidebar",
              description: "Sidebar hiérarchique utilisée en interne par AppFrame.",
            },
            {
              title: "App Top Bar",
              href: "/docs/components/patterns/app-top-bar",
              description: "Header global utilisé en interne par AppFrame.",
            },
            {
              title: "Layout Frame",
              href: "/docs/components/patterns/layout-frame",
              description: "Brique flexbox bas niveau si vous avez besoin d'un layout custom.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/app-frame`.
Attendu : page avec titre "App Frame", 2 snippets de code collapsibles, table de props, section Related.

**Step 3 : Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/app-frame.tsx
git commit -m "docs(patterns): add App Frame documentation"
```

---

### Task 2 : App Sidebar

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/app-sidebar.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/app-sidebar`.

**Step 3 : Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/app-sidebar.tsx
git commit -m "docs(patterns): add App Sidebar documentation"
```

---

### Task 3 : App Top Bar

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/app-top-bar.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
    code: `import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

export function MyTopBar() {
  return <AppTopBar />
}`,
  },
  {
    key: "with-sections",
    code: `import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

const sections = [
  { id: "app", label: "App", href: "/app" },
  { id: "docs", label: "Docs", href: "/docs" },
]

export function MyTopBarWithNav() {
  return (
    <AppTopBar
      sections={sections}
      activeSection="app"
      onOpenCommandPalette={() => setOpen(true)}
      user={{ name: "Jane", email: "jane@acme.com", role: "Admin" }}
    />
  )
}`,
  },
  {
    key: "minimal",
    code: `import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

// Mode minimal : masque notifications et user menu
// Utile pour les pages docs, marketing, ou apps simples
export function MinimalTopBar() {
  return <AppTopBar minimal />
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/app-top-bar")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: AppTopBarPage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const appTopBarProps: DocProp[] = [
  {
    name: "sections",
    type: "TopBarSection[]",
    description: "Navigation de sections affichée entre le logo et la barre de recherche. Chaque section a { id, label, href }.",
  },
  {
    name: "activeSection",
    type: "string",
    description: "ID de la section active — surligne le lien correspondant.",
  },
  {
    name: "onOpenCommandPalette",
    type: "() => void",
    description: "Callback au clic sur la barre de recherche.",
  },
  {
    name: "onOpenMobileMenu",
    type: "() => void",
    description: "Callback au clic sur le hamburger mobile.",
  },
  {
    name: "minimal",
    type: "boolean",
    default: "false",
    description: "Masque notifications et user menu. Conserve uniquement logo, sections et thème.",
  },
  {
    name: "user",
    type: "{ name: string; email: string; avatar?: string; role?: string }",
    description: "Données utilisateur affichées dans le user menu.",
  },
  {
    name: "className",
    type: "string",
    description: "Classes CSS supplémentaires.",
  },
]

function TopBarPlaceholder() {
  return (
    <div className="h-12 rounded border border-dashed border-edge-subtle bg-raised/50 flex items-center px-4 text-xs text-fg-muted gap-4">
      <span>Logo</span>
      <span className="flex gap-2 text-brand">App · Docs</span>
      <div className="flex-1 mx-4 h-7 rounded border border-dashed border-edge-subtle flex items-center px-3">Search...</div>
      <span>Theme · Notifs · User</span>
    </div>
  )
}

function AppTopBarPage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/app-top-bar" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="App Top Bar" subtitle="Header global de l'application : logo, navigation de sections, barre de recherche, thème, notifications et user menu." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Usage basique"
          code={examples[0].code}
          highlightedCode={html("basic")}
        >
          <TopBarPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Avec sections"
          description="Afficher un switcher de sections entre le logo et la barre de recherche."
          code={examples[1].code}
          highlightedCode={html("with-sections")}
        >
          <TopBarPlaceholder />
        </DocExampleClient>
        <DocExampleClient
          title="Mode minimal"
          description="Masque les notifications et le user menu. Adapté aux pages docs ou marketing."
          code={examples[2].code}
          highlightedCode={html("minimal")}
        >
          <TopBarPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={appTopBarProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Frame",
              href: "/docs/components/patterns/app-frame",
              description: "Shell complet qui compose AppTopBar avec AppSidebar.",
            },
            {
              title: "Top Bar",
              href: "/docs/components/patterns/top-bar",
              description: "Header de zone de contenu avec breadcrumbs et actions.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/app-top-bar`.

**Step 3 : Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/app-top-bar.tsx
git commit -m "docs(patterns): add App Top Bar documentation"
```

---

### Task 4 : Top Bar

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/top-bar.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/top-bar`.

**Step 3 : Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/top-bar.tsx
git commit -m "docs(patterns): add Top Bar documentation"
```

---

### Task 5 : Dashboard Layout

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/dashboard-layout.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/dashboard-layout`.

**Step 3 : Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/dashboard-layout.tsx
git commit -m "docs(patterns): add Dashboard Layout documentation"
```

---

### Task 6 : Layout Frame

**Fichier :** `apps/docs/src/routes/_docs/docs/components/patterns/layout-frame.tsx`

**Step 1 : Écrire le fichier complet**

```tsx
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
    code: `import { LayoutFrame } from "@blazz/ui/components/patterns/layout-frame"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutFrame
      topBar={<MyTopBar />}
      sidebar={<MySidebar />}
    >
      {children}
    </LayoutFrame>
  )
}`,
  },
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/layout-frame")({
  loader: async () => {
    const highlighted = await Promise.all(
      examples.map(async (ex) => ({
        key: ex.key,
        html: await highlightCode({ data: { code: ex.code } }),
      }))
    )
    return { highlighted }
  },
  component: LayoutFramePage,
})

const toc = [
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props" },
  { id: "related", title: "Related" },
]

const layoutFrameProps: DocProp[] = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Contenu principal (zone scrollable).",
  },
  {
    name: "topBar",
    type: "React.ReactNode",
    required: true,
    description: "Header fixe en haut — ne scrolle jamais.",
  },
  {
    name: "sidebar",
    type: "React.ReactNode",
    required: true,
    description: "Sidebar à largeur fixe (240px) avec scroll indépendant.",
  },
  {
    name: "className",
    type: "string",
    description: "Classes CSS supplémentaires appliquées à la zone main.",
  },
]

function LayoutPlaceholder() {
  return (
    <div className="flex flex-col h-32 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
      <div className="h-8 shrink-0 border-b border-dashed border-edge-subtle bg-raised/50 flex items-center px-3">
        Top bar
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-28 shrink-0 border-r border-dashed border-edge-subtle bg-raised/30 flex items-center justify-center">
          Sidebar
        </div>
        <div className="flex-1 flex items-center justify-center bg-surface">
          Main content
        </div>
      </div>
    </div>
  )
}

function LayoutFramePage() {
  const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/layout-frame" })
  const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

  return (
    <DocPage title="Layout Frame" subtitle="Brique flexbox bas niveau : topBar fixe + sidebar + main scrollable indépendamment. Utilisez AppFrame pour la plupart des cas." toc={toc}>
      <DocSection id="usage" title="Usage">
        <DocExampleClient
          title="Usage simple"
          description="Structure h-screen avec topBar, sidebar et main. Chaque zone scrolle indépendamment."
          code={examples[0].code}
          highlightedCode={html("basic")}
        >
          <LayoutPlaceholder />
        </DocExampleClient>
      </DocSection>
      <DocSection id="props" title="Props">
        <DocPropsTable props={layoutFrameProps} />
      </DocSection>
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            {
              title: "App Frame",
              href: "/docs/components/patterns/app-frame",
              description: "Shell complet recommandé — intègre sidebar, top bar et gestion mobile.",
            },
            {
              title: "Dashboard Layout",
              href: "/docs/components/patterns/dashboard-layout",
              description: "Layout alternatif avec navbar + sidebar + style rounded.",
            },
          ]}
        />
      </DocSection>
    </DocPage>
  )
}
```

**Step 2 : Vérifier dans le navigateur**

Aller sur `http://localhost:3100/docs/components/patterns/layout-frame`.

**Step 3 : Commit final**

```bash
git add apps/docs/src/routes/_docs/docs/components/patterns/layout-frame.tsx
git commit -m "docs(patterns): add Layout Frame documentation"
```

---

## Checklist de vérification finale

- [ ] Toutes les 6 pages chargent sans erreur
- [ ] Les snippets de code sont syntaxiquement colorés (Shiki)
- [ ] Les tables de props affichent toutes les colonnes (Prop / Type / Default / Description)
- [ ] Les sections Related ont des liens fonctionnels
- [ ] La sidebar des docs est cohérente avec les pages (navigation active)
- [ ] Pas de `"Documentation coming soon."` restant dans le groupe App Shell
