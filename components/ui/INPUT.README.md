# Input

Un composant de champ de saisie texte accessible et stylisé pour tous types d'entrées utilisateur.

## Import

```tsx
import { Input } from '@/components/ui/input'
```

## Usage Basique

```tsx
<Input placeholder="Entrez votre texte..." />
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Type HTML d'input (text, email, password, number, tel, url, etc.) |
| `placeholder` | `string` | - | Texte placeholder |
| `value` | `string` | - | Valeur contrôlée |
| `defaultValue` | `string` | - | Valeur par défaut (uncontrolled) |
| `disabled` | `boolean` | `false` | Désactive l'input |
| `required` | `boolean` | `false` | Champ requis |
| `readOnly` | `boolean` | `false` | Lecture seule |
| `onChange` | `(e: ChangeEvent) => void` | - | Handler de changement |
| `className` | `string` | - | Classes CSS additionnelles |

Le composant accepte toutes les props standard de l'élément HTML `<input>`.

### Types Supportés

```tsx
<Input type="text" />        // Texte standard
<Input type="email" />       // Email avec validation
<Input type="password" />    // Mot de passe masqué
<Input type="number" />      // Nombres uniquement
<Input type="tel" />         // Numéro de téléphone
<Input type="url" />         // URL
<Input type="search" />      // Recherche
<Input type="date" />        // Sélecteur de date
<Input type="time" />        // Sélecteur d'heure
<Input type="file" />        // Upload de fichier
```

## Exemples

### Exemple 1: Input Contrôlé

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nom</Label>
      <Input
        id="name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Votre nom..."
      />
      <p className="text-sm text-muted-foreground">
        Vous avez tapé: {value}
      </p>
    </div>
  )
}
```

### Exemple 2: Input avec Validation

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

function ValidatedInput() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email requis')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Email invalide')
    } else {
      setError('')
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          validateEmail(e.target.value)
        }}
        aria-invalid={!!error}
        placeholder="vous@example.com"
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
```

### Exemple 3: Input avec react-hook-form

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  username: z.string().min(3, 'Minimum 3 caractères'),
})

function FormInput() {
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Nom d'utilisateur</Label>
      <Input
        id="username"
        {...register('username')}
        aria-invalid={!!errors.username}
        placeholder="john_doe"
      />
      {errors.username && (
        <p className="text-sm text-destructive">
          {errors.username.message}
        </p>
      )}
    </div>
  )
}
```

### Exemple 4: Input de Recherche avec Icône

```tsx
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Rechercher..."
        className="pl-8"
      />
    </div>
  )
}
```

### Exemple 5: Input File Upload

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

function FileUpload() {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Upload fichier</Label>
      <div className="flex gap-2">
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button type="button">
          <Upload className="mr-2" />
          Upload
        </Button>
      </div>
    </div>
  )
}
```

## Accessibilité

### ARIA Attributes

- **`aria-invalid`**: Automatiquement appliqué si erreur de validation
- **`aria-required`**: Appliqué si prop `required={true}`
- **`aria-readonly`**: Appliqué si prop `readOnly={true}`
- **`aria-describedby`**: À utiliser pour lier messages d'erreur ou d'aide

```tsx
<Input
  id="email"
  aria-invalid={hasError}
  aria-describedby="email-error"
  aria-required="true"
/>
{hasError && (
  <p id="email-error" className="text-sm text-destructive">
    {errorMessage}
  </p>
)}
```

### Labels

**Toujours associer un Label à l'Input:**

```tsx
// ✅ Bon - label associé
<Label htmlFor="email">Email</Label>
<Input id="email" />

// ❌ Mauvais - pas de label
<Input placeholder="Email" />
```

### Clavier

| Touche | Action |
|--------|--------|
| `Tab` | Déplace le focus vers/depuis l'input |
| `Shift+Tab` | Déplace le focus en arrière |
| `Enter` | Soumet le formulaire (si dans un form) |
| `Esc` | Efface le contenu (type="search") |

### Focus

- L'input affiche un ring de focus visible (WCAG 2.1 AA compliant)
- Ring de focus en cas d'erreur (rouge) via `aria-invalid`
- Les inputs désactivés ne reçoivent pas le focus

## Styling

### Personnalisation avec className

```tsx
<Input className="max-w-xs" placeholder="Input avec largeur max" />

<Input className="font-mono" placeholder="Font monospace" />

<Input className="text-lg" placeholder="Texte plus grand" />
```

### Data Slot

Le composant utilise `data-slot="input"` pour le ciblage CSS:

```css
[data-slot="input"] {
  /* Styles custom */
}
```

### États

L'input supporte automatiquement:
- **Focus**: Ring bleu
- **Error**: Ring rouge (via `aria-invalid`)
- **Disabled**: Opacité réduite, curseur not-allowed
- **ReadOnly**: Pas de ring de focus

### Dark Mode

L'input supporte automatiquement le dark mode via les classes Tailwind `dark:`.

```tsx
{/* Fonctionne automatiquement en dark mode */}
<Input placeholder="Auto dark mode" />
```

## Common Errors & Solutions

### Erreur: "Input non contrôlé devient contrôlé"

**Cause**: Changement de undefined vers une valeur ou vice-versa.

**Solution**:
```tsx
// ✅ Bon - initialiser avec string vide
const [value, setValue] = useState('')
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// ❌ Mauvais - undefined initial
const [value, setValue] = useState()
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Erreur: "Validation ne fonctionne pas"

**Cause**: Oubli de `aria-invalid` ou validation côté client uniquement.

**Solution**:
```tsx
<Input
  aria-invalid={!!error}  // Important pour styling
  type="email"            // Validation HTML5
/>
```

### Erreur: "Input file styling cassé"

**Cause**: Le styling du bouton file natif est difficile à customiser.

**Solution**: Masquer l'input et utiliser un label clickable:
```tsx
<Label htmlFor="file" className="cursor-pointer">
  <Button type="button" variant="outline">
    Choisir fichier
  </Button>
</Label>
<Input
  id="file"
  type="file"
  className="hidden"
  onChange={handleFileChange}
/>
```

## Best Practices

### ✅ À Faire

1. **Toujours utiliser un Label associé**
   ```tsx
   <Label htmlFor="name">Nom</Label>
   <Input id="name" />
   ```

2. **Placeholder informatif mais pas de label**
   ```tsx
   <Input placeholder="Ex: john@example.com" />  {/* ✅ Exemple */}
   <Input placeholder="Email" />                 {/* ❌ Pas un label */}
   ```

3. **aria-invalid pour erreurs**
   ```tsx
   <Input aria-invalid={!!error} />
   ```

4. **Type approprié selon usage**
   ```tsx
   <Input type="email" />     // Pour emails
   <Input type="tel" />       // Pour téléphones
   <Input type="number" />    // Pour nombres
   ```

5. **Validation côté client ET serveur**
   ```tsx
   // Client: validation instantanée
   <Input onChange={validate} />

   // Serveur: validation finale
   onSubmit={(data) => api.validate(data)}
   ```

### ❌ À Éviter

1. **Input sans label**
   ```tsx
   {/* ❌ Pas accessible */}
   <Input />

   {/* ✅ Accessible */}
   <Label htmlFor="input">Label</Label>
   <Input id="input" />
   ```

2. **Placeholder comme label**
   ```tsx
   {/* ❌ Mauvais - disparaît à la saisie */}
   <Input placeholder="Nom complet" />

   {/* ✅ Bon - label visible */}
   <Label>Nom complet</Label>
   <Input placeholder="Ex: Jean Dupont" />
   ```

3. **Validation uniquement visuelle**
   ```tsx
   {/* ❌ Mauvais - pas accessible */}
   <Input className={error ? 'border-red-500' : ''} />

   {/* ✅ Bon - avec ARIA */}
   <Input
     aria-invalid={!!error}
     aria-describedby="error-msg"
   />
   {error && <p id="error-msg">{error}</p>}
   ```

## Related Components

- **[Label](#)** - Label de formulaire associé
- **[Textarea](#)** - Input multi-ligne
- **[Form](#)** - Wrapper formulaire avec react-hook-form
- **[Select](#)** - Sélection dropdown

## Technical Details

- **Base**: `@base-ui/react/input`
- **Styling**: Tailwind CSS
- **Data Attribute**: `data-slot="input"`
- **Dark Mode**: Automatique via CSS variables
- **Accessibility**: WCAG 2.1 AA compliant

---

**Fichier source**: `/components/ui/input.tsx`
**Dernière mise à jour**: 2026-01-19
