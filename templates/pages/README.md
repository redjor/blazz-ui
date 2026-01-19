# Templates de Pages - Blazz UI

Templates réutilisables pour démarrer rapidement vos pages.

## Utilisation

1. **Copier le template** vers votre page
2. **Remplacer les TODOs** avec vos données
3. **Adapter au besoin** (styling, features, etc.)

## Templates Disponibles

### 1. simple-list.tsx
**Liste simple avec cards**

- Grid responsive de cards
- Barre de recherche
- Actions par card (edit, delete)
- Bouton création

**Copier vers**: `app/(frame)/[your-path]/page.tsx`

---

### 2. data-table-page.tsx
**Page avec DataTable enterprise**

- DataTable avec sorting, filtering, pagination
- Row selection & bulk actions
- Dialog Create/Edit
- Recherche globale

**Copier vers**: `app/(frame)/[your-path]/page.tsx`

---

### 3. form-page.tsx
**Formulaire multi-étapes**

- react-hook-form + Zod validation
- Navigation entre étapes
- Progress indicator
- Sauvegarde temporaire

**Copier vers**: `app/(frame)/[your-path]/page.tsx`

---

### 4. dashboard-page.tsx
**Dashboard avec métriques**

- Cards de statistiques
- Graphiques (placeholder)
- Liste récente
- Actions rapides

**Copier vers**: `app/(frame)/dashboard/page.tsx`

---

### 5. settings-page.tsx
**Page paramètres avec tabs**

- Navigation par tabs
- Formulaires de configuration
- Sections multiples
- Sauvegarde par section

**Copier vers**: `app/(frame)/settings/page.tsx`

---

### 6. auth-login.tsx
**Page de connexion**

- Formulaire login
- Validation
- Messages d'erreur
- Link mot de passe oublié

**Copier vers**: `app/auth/login/page.tsx`

---

## Avec l'Agent LLM

Vous pouvez aussi utiliser les skills:

```bash
# Générer une nouvelle page basée sur ces templates
/blazz-new-page
"Créer une page [type] en me basant sur le template [nom]"
```

L'agent comprendra les patterns et adaptera le template à vos besoins.

---

**Dernière mise à jour**: 2026-01-19
