# Pattern : Select avec items dynamiques (Base UI)

## Le problème

Base UI `Select.Root` utilise un rendu lazy pour le popup : les `SelectItem` ne sont montés que quand le dropdown est ouvert. Au premier rendu d'un Select avec une valeur présélectionnée, `Select.Value` ne trouve aucun `ItemText` enregistré et affiche la valeur brute (ex : un ID Convex au lieu du nom du projet).

Le `label` sur `<SelectItem>` **ne résout pas** ce problème — il sert uniquement à l'accessibilité clavier.

## La solution : prop `items` sur `<Select>`

Passer `items: Array<{ value: string, label: string }>` à `Select.Root`. Base UI utilise ce tableau pour alimenter `Select.Value` **indépendamment du rendu du popup**.

```tsx
// ✅ CORRECT — affiche le label même à l'ouverture initiale
<Select
  value={projectId}
  onValueChange={setProjectId}
  items={[
    { value: "", label: "Aucun" },
    ...projects.map((p) => ({ value: p._id, label: p.name })),
  ]}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Projet (optionnel)" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">Aucun</SelectItem>
    {projects.map((p) => (
      <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
    ))}
  </SelectContent>
</Select>

// ❌ INCORRECT — label sur SelectItem ne contrôle PAS l'affichage du trigger
<Select value={projectId} onValueChange={setProjectId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Projet (optionnel)" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="" label="Aucun">Aucun</SelectItem>
    {projects.map((p) => (
      <SelectItem key={p._id} value={p._id} label={p.name}>{p.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Items statiques

Même principe pour les items fixes (ex : statuts, priorités) :

```tsx
const PRIORITY_ITEMS = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
]

<Select value={priority} onValueChange={setPriority} items={PRIORITY_ITEMS}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Priorité" />
  </SelectTrigger>
  <SelectContent>
    {PRIORITY_ITEMS.map((item) => (
      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Règle

> **TOUJOURS passer `items` à `<Select>` dès que les labels différent des valeurs.**
> Pour les items dynamiques (depuis une API/DB), construire le tableau inline ou via `useMemo`.
