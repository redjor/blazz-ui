# Templates

Templates réutilisables pour démarrer rapidement vos pages et composants avec les meilleures pratiques du projet.

## Structure

```
templates/
├── pages/              # Templates de pages complètes
│   ├── simple-list.tsx
│   ├── data-table-page.tsx
│   ├── form-page.tsx
│   ├── dashboard-page.tsx
│   ├── settings-page.tsx
│   └── auth-login.tsx
└── components/         # Templates de composants réutilisables
    ├── crud-dialog.tsx
    ├── stats-card.tsx
    ├── bulk-actions-bar.tsx
    └── filters-panel.tsx
```

## Validation

Pour s'assurer que les templates sont conformes:

### 1. Vérification TypeScript

```bash
# Vérifier tous les templates
npx tsc --noEmit templates/**/*.tsx

# Vérifier un template spécifique
npx tsc --noEmit templates/pages/simple-list.tsx
```

### 2. Vérification du Build

```bash
# Tester que les templates n'ont pas d'erreurs de build
npm run build
```

### 3. Linter

```bash
# Vérifier le code quality
npm run lint
```

## Utilisation Rapide

```bash
# Copier un template
cp templates/pages/simple-list.tsx app/(frame)/my-page/page.tsx

# Ou avec le CLI
npx tsx scripts/blazz-cli.ts create page my-page --template simple-list
```
