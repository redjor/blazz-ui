---
name: blazz-audit
description: Auditer un fichier Blazz UI (composant ou page) pour conformité aux conventions du projet — code patterns, design tokens, architecture
user-invocable: true
---

# Blazz Audit Skill

Analyse un fichier ou un extrait de code et produit un rapport inline ✅/❌ de conformité aux conventions Blazz UI. Ne corrige rien — rapport uniquement.

## Invocation

```
/blazz-audit packages/ui/src/components/ui/badge.tsx
/blazz-audit apps/docs/src/routes/_docs.contacts.tsx
/blazz-audit [coller le code directement dans le prompt]
```

## Ce que fait ce skill

1. Lit le fichier cible (ou utilise le code fourni directement)
2. Lit `ai/rules.md` pour les conventions courantes du projet
3. Recherche un composant similaire dans `packages/ui/src/components/ui/` comme référence
4. Produit un rapport structuré ✅/❌ — sans modifier aucun fichier

## Processus interne

### Phase 1 — Lecture

**Cette phase est bloquante. Ne pas produire de rapport avant de l'avoir complétée.**

1. Lire le fichier cible (chemin fourni) ou capturer le code collé
2. Lire `ai/rules.md` pour les règles à jour du projet
3. Lire `apps/docs/src/styles/globals.css` pour confirmer les tokens disponibles
4. Identifier la nature du fichier : composant primitif, composant métier, page, layout
5. Trouver un composant de référence similaire dans `packages/ui/src/components/ui/` et le lire

```bash
# Exemples d'exploration
ls packages/ui/src/components/ui/
# Lire un composant proche du besoin, ex: card.tsx, button.tsx, badge.tsx
```

### Phase 2 — Analyse

Vérifier chaque point de la checklist suivante :

**Code**
- Présence de `React.forwardRef` → toujours une erreur
- Pattern utilisé : `React.ComponentProps`, CVA + ComponentProps, Base UI primitive, ou `useRender`
- Présence de `data-slot` sur l'élément racine
- Absence de `any` TypeScript explicite ou implicite
- Imports : pas de `@/components/layout/`, pas de `@/components/features/` (supprimés)
- Package Base UI : `@base-ui/react` (pas `@base-ui-components/react`)
- Chemin de `cn` : `../../lib/utils` pour les composants dans `ui/`, pas `@/lib/utils`

**Design tokens**
- Aucune couleur Tailwind hardcodée : `bg-white`, `bg-gray-*`, `bg-blue-*`, `text-black`, `text-gray-*`, etc.
- Aucun token shadcn : `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-foreground`, `bg-secondary`, `ring-ring`, etc.
- Tokens Blazz utilisés pour les surfaces : `bg-surface`, `bg-raised`, `bg-panel`
- Tokens Blazz utilisés pour le texte : `text-fg`, `text-fg-muted`, `text-brand-fg`
- Tokens Blazz utilisés pour les bordures : `border-container`, `border-separator`
- Cas `text-white` : acceptable uniquement sur fond coloré (`bg-inform text-white`, `bg-negative text-white`) — à signaler si sur fond neutre ou inconnu

**Architecture (pages uniquement)**
- Directive `"use client"` justifiée (hooks ou event handlers présents)
- Pas de `useEffect` + `fetch` pour le chargement de données initial — utiliser un Server Component avec fetch asynchrone
- Formulaires : `react-hook-form` + `zod` (pas de `useState` gérant les champs de formulaire)
- 4 états si fetch de données : Skeleton / Empty / Error / Success

### Phase 3 — Rapport

Produire le rapport dans ce format exact :

```
## Audit Blazz UI — [nom du fichier ou "code fourni"]

### Code
✅/❌ Pattern correct : React.ComponentProps ou Base UI primitive (pas forwardRef)
✅/❌ useRender si render prop nécessaire
✅/❌ data-slot présent sur l'élément racine
✅/❌ TypeScript strict (pas de `any`)
✅/❌ Imports corrects (pas de chemins obsolètes @/components/layout/...)
✅/❌ Package Base UI correct (@base-ui/react, pas @base-ui-components/react)

### Design tokens
✅/❌ Aucune couleur Tailwind hardcodée (bg-white, bg-blue-500, text-black...)
✅/❌ Aucun token shadcn (bg-primary, text-primary-foreground, bg-muted...)
✅/❌ Design tokens oklch utilisés (bg-surface, text-fg, border-container, bg-brand...)

### Architecture (pages uniquement — ignorer pour composants purs)
✅/❌ Server Component par défaut ('use client' justifié si présent)
✅/❌ Formulaires : react-hook-form + zod (pas de useState pour les forms)
✅/❌ 4 états si fetch de données : Skeleton / Empty / Error / Success

### Suggestions
[numérotées, avec numéro de ligne si possible]
[Si aucune : "Aucune non-conformité détectée."]
```

## Règles auditées

| Catégorie | Règle | Explication |
|---|---|---|
| Code | React.ComponentProps ou Base UI (jamais forwardRef) | Pattern réel du kit depuis janv 2026 |
| Code | data-slot présent | Requis pour le système de slot |
| Code | Pas de any TypeScript | Strictness requise |
| Code | Imports corrects | @/components/layout/ supprimé en fév 2026 |
| Code | @base-ui/react (pas @base-ui-components/react) | Nom exact du package installé |
| Tokens | Pas de bg-white, bg-blue-500, text-black seuls | Utiliser les tokens oklch |
| Tokens | Pas de bg-primary, text-primary-foreground | Tokens shadcn, non utilisés dans ce kit |
| Tokens | bg-surface, text-fg, border-container pour surfaces neutres | Tokens du design system |
| Architecture | Server Component sauf si hooks/events | ai/rules.md §1 |
| Architecture | react-hook-form + zod pour formulaires | ai/rules.md §4 |
| Architecture | Skeleton + Empty + Error + Success | ai/rules.md §6 |

## Exemples d'erreurs courantes

### 1. forwardRef (obsolète)

```tsx
// INCORRECT — forwardRef supprimé depuis React 19 + Base UI
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />
  }
)
Button.displayName = "Button"

// CORRECT — React.ComponentProps ou Base UI primitive
function Button({ className, variant, size, ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### 2. Couleurs Tailwind hardcodées

```tsx
// INCORRECT — couleurs Tailwind directes
<div className="bg-white text-gray-900 border border-gray-200">
  <span className="text-blue-600 font-medium">Label</span>
</div>

// CORRECT — tokens oklch du design system
<div className="bg-surface text-fg border border-container">
  <span className="text-brand-fg font-medium">Label</span>
</div>
```

### 3. Tokens shadcn résiduels

```tsx
// INCORRECT — tokens shadcn, non utilisés dans ce kit
<div className="bg-primary text-primary-foreground hover:bg-primary/90">
  <p className="text-muted-foreground">Description</p>
</div>

// CORRECT — tokens Blazz
<div className="bg-brand text-brand-fg hover:bg-brand-hover">
  <p className="text-fg-muted">Description</p>
</div>
```

### 4. Mauvais nom de package Base UI

```tsx
// INCORRECT — nom de package obsolète
import { Button } from "@base-ui-components/react/button"
import { Dialog } from "@base-ui-components/react/dialog"

// CORRECT — nom exact du package installé
import { Button } from "@base-ui/react/button"
import { Dialog } from "@base-ui/react/dialog"
```

### 5. Import depuis un dossier supprimé

```tsx
// INCORRECT — @/components/layout/ supprimé en fév 2026
import { AppFrame } from "@/components/layout/app-frame"
import { AppSidebar } from "@/components/layout/app-sidebar"

// CORRECT — import depuis le package ou patterns
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { AppSidebar } from "@blazz/ui/components/patterns/app-sidebar"
```

### 6. Fetch de données côté client (pages)

```tsx
// INCORRECT — useEffect + fetch pour données initiales
"use client"
export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    fetch("/api/contacts").then(r => r.json()).then(setContacts)
  }, [])
  return <DataTable data={contacts} />
}

// CORRECT — Server Component avec fetch asynchrone
export default async function ContactsPage() {
  const contacts = await getContacts()
  return <DataTable data={contacts} />
}
```

### 7. Formulaire sans react-hook-form

```tsx
// INCORRECT — useState pour gérer les champs de formulaire
"use client"
export default function CreateContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const handleSubmit = async (e) => { /* ... */ }
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </form>
  )
}

// CORRECT — react-hook-form + zod
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1), email: z.string().email() })

export default function CreateContactForm() {
  const form = useForm({ resolver: zodResolver(schema) })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="name" render={({ field }) => <Input {...field} />} />
        <FormField name="email" render={({ field }) => <Input {...field} />} />
      </form>
    </Form>
  )
}
```

### 8. text-white : cas acceptable vs erreur

```tsx
// ACCEPTABLE — text-white intentionnel sur fond coloré
<div className="bg-inform text-white">Info message</div>
<div className="bg-negative text-white">Error message</div>
<div className="bg-brand text-white">Action button</div>

// A SIGNALER — text-white sur fond neutre ou inconnu
<div className="bg-surface text-white">  // text-white illisible sur surface neutre
<div className="text-white">             // sans contexte de fond coloré
```

## Limites de l'audit

Ce skill **ne fait pas** :

- **Aucune correction automatique** — le rapport est en lecture seule, il revient à l'humain d'appliquer les corrections
- **Pas d'analyse de logique métier** — seule la conformité aux conventions est vérifiée
- **Pas de vérification de compilation TypeScript** — les erreurs de type subtiles ne sont pas détectées sans `tsc`
- **Pas d'audit d'accessibilité complet** — ARIA et support clavier ne sont pas analysés en profondeur
- **Pas d'analyse des tests** — la présence ou qualité des tests n'est pas vérifiée
- **Pas de vérification des exports** — l'audit ne vérifie pas si le composant est correctement exporté depuis `packages/ui/src/index.ts`
- **Pas d'analyse de performance** — memoization, bundle size, etc. hors scope

---

**Version**: 1.0
**Last Updated**: 2026-02-28
