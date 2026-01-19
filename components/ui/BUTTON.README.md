# Button

Un composant bouton polyvalent qui déclenche des actions et des événements avec plusieurs variants visuels et tailles.

## Import

```tsx
import { Button } from '@/components/ui/button'
```

## Usage Basique

```tsx
<Button>Click me</Button>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | Style visuel du bouton |
| `size` | `'default' \| 'xs' \| 'sm' \| 'lg' \| 'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Taille du bouton |
| `disabled` | `boolean` | `false` | Désactive le bouton |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Type HTML du bouton |
| `className` | `string` | - | Classes CSS additionnelles |
| `children` | `React.ReactNode` | - | Contenu du bouton |
| `onClick` | `(event: React.MouseEvent) => void` | - | Handler de clic |

Le composant accepte également toutes les props standard de l'élément HTML `<button>`.

### Variants

#### `default` - Bouton primaire
Action principale de la page. Fond bleu avec texte blanc.

```tsx
<Button variant="default">Save Changes</Button>
```

#### `outline` - Bouton contour
Action secondaire. Transparent avec bordure.

```tsx
<Button variant="outline">Cancel</Button>
```

#### `secondary` - Bouton secondaire
Action alternative. Fond gris avec texte foncé.

```tsx
<Button variant="secondary">View Details</Button>
```

#### `ghost` - Bouton fantôme
Action subtile. Transparent sans bordure.

```tsx
<Button variant="ghost">Skip</Button>
```

#### `destructive` - Bouton destructif
Actions dangereuses ou destructives. Fond rouge.

```tsx
<Button variant="destructive">Delete Account</Button>
```

#### `link` - Bouton lien
Styled comme un lien. Souligné au hover.

```tsx
<Button variant="link">Learn More</Button>
```

### Sizes

| Size | Height | Use Case |
|------|--------|----------|
| `xs` | 24px (h-6) | Très petits boutons dans interfaces denses |
| `sm` | 28px (h-7) | Boutons compacts dans tables ou cartes |
| `default` | 32px (h-8) | Taille standard pour la plupart des cas |
| `lg` | 36px (h-9) | Boutons proéminents ou actions principales |
| `icon` | 32x32px | Bouton icône uniquement (taille standard) |
| `icon-xs` | 24x24px | Bouton icône extra petit |
| `icon-sm` | 28x28px | Bouton icône petit |
| `icon-lg` | 36x36px | Bouton icône large |

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

## Exemples

### Exemple 1: Boutons d'Actions de Formulaire

```tsx
import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'

function FormActions() {
  return (
    <div className="flex gap-2">
      <Button type="submit" variant="default">
        <Save className="mr-2" />
        Save Changes
      </Button>
      <Button type="button" variant="outline" onClick={() => console.log('Cancel')}>
        <X className="mr-2" />
        Cancel
      </Button>
    </div>
  )
}
```

### Exemple 2: Boutons avec Loading State

```tsx
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await submitForm()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSubmit} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 animate-spin" />}
      {isLoading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
```

### Exemple 3: Boutons Icône Uniquement

```tsx
import { Button } from '@/components/ui/button'
import { Settings, Trash2, Edit } from 'lucide-react'

function IconButtons() {
  return (
    <div className="flex gap-2">
      <Button size="icon" variant="ghost" aria-label="Settings">
        <Settings />
      </Button>
      <Button size="icon" variant="outline" aria-label="Edit">
        <Edit />
      </Button>
      <Button size="icon" variant="destructive" aria-label="Delete">
        <Trash2 />
      </Button>
    </div>
  )
}
```

### Exemple 4: Boutons dans un Dialog

```tsx
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function ConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Exemple 5: Groupe de Boutons

```tsx
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline } from 'lucide-react'

function TextFormatting() {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button size="sm" variant="outline" className="rounded-r-none">
        <Bold />
      </Button>
      <Button size="sm" variant="outline" className="rounded-none border-l-0">
        <Italic />
      </Button>
      <Button size="sm" variant="outline" className="rounded-l-none border-l-0">
        <Underline />
      </Button>
    </div>
  )
}
```

## Accessibilité

### ARIA Attributes

Le composant supporte automatiquement:
- `role="button"` (appliqué par Base UI)
- `aria-disabled="true"` quand `disabled={true}`
- `aria-expanded` pour boutons contrôlant du contenu expandable
- `aria-pressed` pour boutons toggle

**Pour les boutons icône uniquement, toujours ajouter `aria-label`:**

```tsx
// ✅ Bon
<Button size="icon" aria-label="Delete item">
  <Trash2 />
</Button>

// ❌ Mauvais - pas accessible
<Button size="icon">
  <Trash2 />
</Button>
```

### Clavier

| Touche | Action |
|--------|--------|
| `Tab` | Déplace le focus vers/depuis le bouton |
| `Space` | Active le bouton |
| `Enter` | Active le bouton (dans les formulaires) |

### Focus

- Le bouton affiche un ring de focus visible (WCAG 2.1 AA compliant)
- Utilise `focus-visible:ring` pour focus clavier uniquement
- Les boutons désactivés ne reçoivent pas le focus

## Styling

### Personnalisation avec className

```tsx
<Button className="w-full">
  Full Width Button
</Button>

<Button className="min-w-[200px]">
  Minimum Width Button
</Button>
```

### Data Slot

Le composant utilise `data-slot="button"` pour le ciblage CSS:

```css
[data-slot="button"] {
  /* Styles custom */
}
```

### Dark Mode

Tous les variants supportent automatiquement le dark mode via les classes Tailwind `dark:`.

```tsx
{/* Fonctionne automatiquement en dark mode */}
<Button variant="default">Auto Dark Mode</Button>
```

## Common Errors & Solutions

### Erreur: "Button n'est pas cliquable"

**Cause**: Le bouton est désactivé ou recouvert par un autre élément.

**Solution**:
```tsx
// Vérifiez l'état disabled
<Button disabled={false}>Clickable</Button>

// Vérifiez le z-index si recouvert
<Button className="z-10">Clickable</Button>
```

### Erreur: "onClick ne se déclenche pas"

**Cause**: Propagation d'événement stoppée ou bouton dans un formulaire.

**Solution**:
```tsx
// Empêcher submit de formulaire
<Button type="button" onClick={handleClick}>
  Click Me
</Button>

// Gérer la propagation
<Button onClick={(e) => {
  e.stopPropagation()
  handleClick()
}}>
  Click Me
</Button>
```

### Erreur: "Icon mal aligné"

**Cause**: Icon sans classe de taille ou espacement incorrect.

**Solution**:
```tsx
// ✅ Bon - icon s'adapte automatiquement
<Button>
  <Save className="mr-2" />
  Save
</Button>

// ❌ Éviter - taille hardcodée
<Button>
  <Save className="w-4 h-4 mr-2" />
  Save
</Button>
```

### Erreur: "Bouton pas accessible"

**Cause**: Bouton icône sans label ou mauvais type.

**Solution**:
```tsx
// ✅ Bon
<Button size="icon" aria-label="Delete">
  <Trash2 />
</Button>

// ✅ Bon - avec texte visible
<Button>
  <Trash2 className="mr-2" />
  Delete
</Button>
```

## Best Practices

### ✅ À Faire

1. **Utiliser des labels clairs et orientés action**
   ```tsx
   <Button>Save Changes</Button> {/* ✅ Clair */}
   <Button>OK</Button> {/* ❌ Vague */}
   ```

2. **Une seule action primaire par section**
   ```tsx
   <div>
     <Button variant="default">Save</Button>
     <Button variant="outline">Cancel</Button>
   </div>
   ```

3. **Ajouter aria-label pour icônes seules**
   ```tsx
   <Button size="icon" aria-label="Settings">
     <Settings />
   </Button>
   ```

4. **Utiliser le bon variant selon l'importance**
   - `default`: Action primaire
   - `outline`: Action secondaire
   - `ghost`: Action tertiaire
   - `destructive`: Action dangereuse

5. **Désactiver pendant les actions async**
   ```tsx
   <Button disabled={isLoading}>
     {isLoading ? 'Loading...' : 'Submit'}
   </Button>
   ```

### ❌ À Éviter

1. **Trop de boutons primaires**
   ```tsx
   {/* ❌ Mauvais */}
   <Button variant="default">Save</Button>
   <Button variant="default">Cancel</Button>

   {/* ✅ Bon */}
   <Button variant="default">Save</Button>
   <Button variant="outline">Cancel</Button>
   ```

2. **Boutons sans action**
   ```tsx
   {/* ❌ Mauvais - pas de onClick */}
   <Button>Click Me</Button>

   {/* ✅ Bon */}
   <Button onClick={() => console.log('Clicked')}>Click Me</Button>
   ```

3. **Utiliser Button pour la navigation**
   ```tsx
   {/* ❌ Mauvais */}
   <Button onClick={() => router.push('/page')}>Go</Button>

   {/* ✅ Bon */}
   <Link href="/page">
     <Button>Go</Button>
   </Link>
   ```

4. **Oublier le type dans les formulaires**
   ```tsx
   {/* ❌ Mauvais - soumet le formulaire par défaut */}
   <Button onClick={handleAction}>Action</Button>

   {/* ✅ Bon */}
   <Button type="button" onClick={handleAction}>Action</Button>
   ```

## Related Components

- **[Link](#)** - Pour la navigation entre pages
- **[Dropdown Menu](#)** - Bouton déclenchant un menu
- **[Dialog](#)** - Bouton ouvrant une dialog
- **[Popover](#)** - Bouton ouvrant un popover

## Technical Details

- **Base**: `@base-ui/react/button`
- **Styling**: CVA (Class Variance Authority) + Tailwind CSS
- **Data Attribute**: `data-slot="button"`
- **Dark Mode**: Automatique via classes Tailwind
- **Accessibility**: WCAG 2.1 AA compliant

---

**Fichier source**: `/components/ui/button.tsx`
**Storybook**: `/components/ui/button.stories.tsx`
**Dernière mise à jour**: 2026-01-19
