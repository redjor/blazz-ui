# Règles d'Accessibilité

Ce document décrit les règles importantes d'accessibilité et les erreurs courantes à éviter dans notre codebase.

## 🚨 Règles Critiques

### 1. Pas de boutons imbriqués (Nested Buttons)

**Problème:** Mettre un bouton à l'intérieur d'un autre bouton est invalide en HTML et crée des problèmes d'accessibilité majeurs.

**Composants concernés:**
- `DropdownMenuTrigger` - Déjà un bouton
- `DialogTrigger` - Déjà un bouton
- `PopoverTrigger` - Déjà un bouton
- `TooltipTrigger` - Déjà un bouton
- `AlertDialogTrigger` - Déjà un bouton

#### ❌ INCORRECT

```tsx
// NE PAS FAIRE - Bouton dans un bouton
<DropdownMenuTrigger>
  <Button variant="outline">Actions</Button>
</DropdownMenuTrigger>

// NE PAS FAIRE - render prop avec Button
<DropdownMenuTrigger
  render={<Button variant="outline">Actions</Button>}
/>
```

#### ✅ CORRECT

```tsx
// Option 1: Utiliser asChild pour composer
<DropdownMenuTrigger asChild>
  <Button variant="outline">Actions</Button>
</DropdownMenuTrigger>

// Option 2: Styler le trigger directement
<DropdownMenuTrigger className="px-4 py-2 rounded-lg bg-primary text-white">
  Actions
</DropdownMenuTrigger>

// Option 3: Utiliser un élément HTML standard avec asChild
<DropdownMenuTrigger asChild>
  <button type="button" className="custom-class">
    Actions
  </button>
</DropdownMenuTrigger>
```

### 2. Utilisation de asChild

La prop `asChild` permet de composer des composants sans créer d'éléments imbriqués. Le trigger fusionnera ses props avec l'enfant au lieu de le wrapper.

**Quand utiliser asChild:**
- ✅ Quand vous voulez appliquer le style d'un composant Button
- ✅ Quand vous voulez utiliser un élément custom comme trigger
- ✅ Quand vous avez besoin de contrôle total sur l'élément rendu

**Quand NE PAS utiliser asChild:**
- ❌ Si vous mettez un composant qui est déjà un bouton et que vous ne voulez pas le composer
- ❌ Si vous voulez juste styler le trigger (utilisez className directement)

## 🔍 Comment Détecter ces Erreurs

### Inspection du DOM
Ouvrez les DevTools et cherchez:
```html
<!-- INVALIDE - bouton dans bouton -->
<button>
  <button>Actions</button>
</button>
```

### Validation HTML
Utilisez un validateur HTML qui signalera "Button element must not appear as a descendant of the button element"

### Lighthouse / axe DevTools
Ces outils d'accessibilité détecteront les boutons imbriqués automatiquement.

## 📋 Checklist pour Code Review

Lors de la revue de code, vérifiez:

- [ ] Aucun `<Button>` à l'intérieur d'un trigger sans `asChild`
- [ ] Pas d'utilisation de `render` prop avec des Buttons
- [ ] Les triggers utilisent soit `asChild` soit `className` directement
- [ ] Pas de boutons imbriqués dans le DOM final

## 🛠️ Configuration ESLint (Futur)

Pour automatiser la détection de ces erreurs, nous pouvons ajouter une règle ESLint custom:

```js
// .eslintrc.js
{
  "rules": {
    "no-nested-interactive": "error" // Détecte les éléments interactifs imbriqués
  }
}
```

## 📚 Ressources

- [WAI-ARIA Authoring Practices - Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [MDN - Button Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [Radix UI - Composition avec asChild](https://www.radix-ui.com/primitives/docs/guides/composition)

## 🔄 Historique des Corrections

- **2026-02-01**: Correction de `data-table-actions-bar.tsx` - Remplacement de `render` prop par `asChild`
- **2026-02-01**: Ajout de documentation sur `DropdownMenuTrigger`
