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
// NE PAS FAIRE - Bouton dans un bouton (enfant direct)
<DropdownMenuTrigger>
  <Button variant="outline">Actions</Button>
</DropdownMenuTrigger>
```

#### ✅ CORRECT

```tsx
// Option 1: Utiliser render prop avec un composant
<DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />

// Option 2: Utiliser render prop avec SidebarMenuButton
<DropdownMenuTrigger
  render={
    <SidebarMenuButton size="lg">
      Content
    </SidebarMenuButton>
  }
/>

// Option 3: Styler le trigger directement avec className
<DropdownMenuTrigger className="px-4 py-2 rounded-lg bg-primary text-white">
  Actions
</DropdownMenuTrigger>

// Option 4: Utiliser un élément HTML avec render
<DropdownMenuTrigger
  render={
    <button type="button" className="custom-class">
      Actions
    </button>
  }
/>
```

### 2. Utilisation de render prop

La prop `render` permet de composer des composants en clonant l'élément fourni et en fusionnant ses props avec celles du trigger.

**Pourquoi utiliser render:**
- ✅ Clone et fusionne les props au lieu de créer des éléments imbriqués
- ✅ Permet d'utiliser des composants Button, SidebarMenuButton, etc.
- ✅ Évite automatiquement les boutons imbriqués

**Exemples d'utilisation:**
```tsx
// Avec Button
<DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />

// Avec composant custom
<DropdownMenuTrigger render={<SidebarMenuButton>Menu</SidebarMenuButton>} />

// Avec élément HTML
<DropdownMenuTrigger render={<button type="button">Click</button>} />
```

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

- [ ] Aucun `<Button>` à l'intérieur d'un trigger (utiliser `render` prop)
- [ ] Tous les triggers utilisent `render` prop pour les composants boutons
- [ ] Pas de boutons imbriqués dans le DOM final
- [ ] Tous les `DropdownMenuLabel` sont à l'intérieur de `DropdownMenuGroup`

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

### 3. Composants Bouton Personnalisés

Les composants personnalisés qui rendent des boutons (comme `SidebarMenuButton`, `MenuButton`, etc.) fonctionnent parfaitement avec la prop `render`:

```tsx
// ✅ CORRECT - render clone et fusionne
<DropdownMenuTrigger
  render={
    <SidebarMenuButton size="lg">
      Content
    </SidebarMenuButton>
  }
/>
```

Le trigger clone `SidebarMenuButton` et fusionne ses props, créant un seul bouton au final.

### 4. DropdownMenuLabel doit être dans DropdownMenuGroup

**Problème:** Base UI (la bibliothèque sous-jacente) requiert que `DropdownMenuLabel` soit utilisé à l'intérieur de `DropdownMenuGroup`.

**Erreur:** `Base UI: MenuGroupRootContext is missing. Menu group parts must be used within <Menu.Group>.`

#### ❌ INCORRECT

```tsx
// NE PAS FAIRE - Label en dehors du groupe
<DropdownMenuContent>
  <DropdownMenuLabel>My Account</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuItem>Profile</DropdownMenuItem>
</DropdownMenuContent>
```

#### ✅ CORRECT

```tsx
// FAIRE - Label dans un groupe
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

## 🔄 Historique des Corrections

- **2026-02-01**: Migration vers `render` prop pour tous les triggers
- **2026-02-01**: Correction de `data-table-actions-bar.tsx` - Utilisation de `render` prop
- **2026-02-01**: Correction de `sidebar-user.tsx` - Utilisation de `render` prop avec `SidebarMenuButton`
- **2026-02-01**: Mise à jour de la documentation pour recommander `render` au lieu de `asChild`
- **2026-02-01**: Correction de `dropdown-menu/page.tsx` - Wrapping de tous les `DropdownMenuLabel` dans `DropdownMenuGroup`
- **2026-02-01**: Ajout de la règle 4: `DropdownMenuLabel` doit être dans `DropdownMenuGroup`
