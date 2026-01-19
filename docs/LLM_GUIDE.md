# Guide LLM - Développer Blazz UI avec Claude Code

Ce guide explique comment utiliser Blazz UI App avec Claude Code et autres assistants IA pour une productivité maximale. Blazz UI est le premier boilerplate React conçu spécifiquement pour le développement assisté par IA.

## Table des Matières

1. [Pourquoi Blazz UI est LLM-Friendly](#pourquoi-blazz-ui-est-llm-friendly)
2. [Configuration Initiale](#configuration-initiale)
3. [Agents Disponibles](#agents-disponibles)
4. [Skills Custom](#skills-custom)
5. [Patterns de Prompts Efficaces](#patterns-de-prompts-efficaces)
6. [Exemples de Commandes](#exemples-de-commandes)
7. [Workflows Recommandés](#workflows-recommandés)
8. [Best Practices LLM](#best-practices-llm)
9. [Étendre les Agents & Skills](#étendre-les-agents--skills)
10. [Troubleshooting](#troubleshooting)

---

## Pourquoi Blazz UI est LLM-Friendly

### Architecture Compréhensible

Blazz UI est structuré pour être facilement compris par les LLMs:

**✅ Organisation Logique**
- Dossiers nommés clairement (`components/ui`, `components/features`, `components/layout`)
- Structure prévisible et cohérente
- Séparation claire des responsabilités

**✅ Patterns Cohérents**
- Tous les composants suivent le même pattern (forwardRef, CVA, data-slots)
- Conventions de nommage uniformes
- Composition over configuration

**✅ Documentation Exhaustive**
- Chaque composant a sa documentation
- Exemples d'utilisation abondants
- Guide architecture détaillé
- Types TypeScript explicites

**✅ Code Auto-Documenté**
- Types TypeScript stricts
- Interfaces explicites pour toutes les props
- Commentaires là où nécessaire
- Nommage descriptif

### Avantages pour le Développement IA

1. **Génération de Code Précise**: Les LLMs peuvent générer du code correct du premier coup
2. **Context Reduction**: Documentation structurée réduit le contexte nécessaire
3. **Patterns Réutilisables**: Les LLMs apprennent rapidement les patterns du projet
4. **Moins d'Erreurs**: Architecture cohérente = moins de bugs générés
5. **Refactoring Sûr**: Les LLMs peuvent refactorer sans casser l'API

---

## Configuration Initiale

### 1. Configuration Claude Code

Blazz UI inclut une configuration préoptimisée pour Claude Code dans `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev:*)",
      "Bash(npm run build:*)",
      "Bash(ls:*)",
      "WebSearch",
      "Bash(npm install:*)",
      "Bash(npx shadcn@latest add:*)",
      "Bash(curl:*)"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": [
    "DeepGraph React MCP"
  ]
}
```

### 2. Agents Globaux

Agents disponibles globalement dans `~/.claude/agents/`:

- `api-documenter.md` - Documentation API/OpenAPI
- `context-manager.md` - Gestion contexte multi-agents
- `architect-reviewer.md` - Review architecture
- `ui-ux-designer.md` - Design UI/UX

### 3. Agent Blazz UI

Agent spécialisé pour ce projet: `~/.claude/agents/blazz-ui-assistant.md`

Cet agent connaît:
- Tous les composants Blazz UI
- Les patterns de développement
- La structure du projet
- Les conventions de code
- Les templates disponibles

---

## Agents Disponibles

### Blazz UI Assistant

**Agent spécialisé pour Blazz UI**

```markdown
# Utilisation
Simplement mentionner "Utilise l'agent Blazz UI" dans votre prompt

# Capacités
- Création de pages avec composants Blazz UI
- Implémentation CRUD avec DataTable
- Construction de formulaires react-hook-form + Zod
- Composition de layouts
- Ajout de nouveaux composants UI
- Styling avec Tailwind & CSS variables
```

**Quand l'utiliser:**
- ✅ Créer une nouvelle page
- ✅ Implémenter un CRUD
- ✅ Ajouter un formulaire
- ✅ Créer un composant UI
- ✅ Personnaliser le layout

**Exemple:**
```
Utilise l'agent Blazz UI pour créer une page de gestion des utilisateurs
avec un DataTable, filtres de recherche, et dialog de création/édition.
```

### Context Manager

**Pour projets complexes (>10k tokens)**

```markdown
# Utilisation
Automatiquement invoqué pour grands projets

# Capacités
- Gestion contexte multi-agents
- Distribution de contexte minimal
- Mémorisation décisions importantes
- Coordination entre agents
```

**Quand l'utiliser:**
- ✅ Projet avec 50+ fichiers
- ✅ Refactoring large
- ✅ Migration complexe
- ✅ Tâches multi-étapes

### Architect Reviewer

**Review architecture et patterns**

```markdown
# Utilisation
Demander explicitement une review

# Capacités
- Vérification patterns SOLID
- Détection dépendances circulaires
- Validation cohérence architecture
- Identification problèmes scaling
```

**Quand l'utiliser:**
- ✅ Après ajout feature majeure
- ✅ Avant merge PR importante
- ✅ Refactoring architecture
- ✅ Audit qualité code

**Exemple:**
```
Utilise l'architect reviewer pour analyser mes changements
dans le système de gestion des produits
```

### UI/UX Designer

**Design de composants et interfaces**

```markdown
# Utilisation
Pour design de nouvelles interfaces

# Capacités
- Wireframing
- Design system
- Prototypage
- Accessibilité
- User research
```

**Quand l'utiliser:**
- ✅ Nouveau composant complexe
- ✅ Refonte UI
- ✅ Design system
- ✅ Amélioration UX

---

## Skills Custom

### /blazz-new-page

**Créer une nouvelle page avec composants Blazz UI**

```bash
/blazz-new-page
```

**Ce que fait ce skill:**
1. Crée `page.tsx` dans `app/`
2. Utilise `DashboardLayout` ou `Frame`
3. Ajoute composant `Page` avec header
4. Inclut composants UI pertinents
5. Enregistre dans navigation si nécessaire

**Exemple d'utilisation:**
```
/blazz-new-page

Créer une page "/analytics" avec:
- Title: "Tableaux de Bord"
- 3 cards de métriques (revenus, utilisateurs, commandes)
- Graphique de tendances
- Table des dernières transactions
```

**Résultat:**
- Fichier créé: `app/(frame)/analytics/page.tsx`
- Navigation mise à jour dans `config/navigation.ts`
- Composants importés et utilisés correctement

### /blazz-new-component

**Générer un nouveau composant UI suivant les conventions**

```bash
/blazz-new-component
```

**Ce que fait ce skill:**
1. Crée dossier dans `/components/ui/`
2. Implémente avec `forwardRef`
3. Ajoute variants avec CVA
4. Inclut `data-slot` attributes
5. Ajoute ARIA attributes
6. Crée `README.md` documentation
7. Génère Storybook story

**Exemple d'utilisation:**
```
/blazz-new-component

Créer un composant "StatusBadge" avec:
- Variants: success, warning, error, info
- Sizes: sm, default, lg
- Optional icon à gauche
- Dismissible avec X button
```

**Résultat:**
- `components/ui/status-badge/status-badge.tsx`
- `components/ui/status-badge/status-badge.stories.tsx`
- `components/ui/status-badge/STATUS_BADGE.README.md`
- Export ajouté dans `components/ui/index.ts`

### /blazz-crud-page

**Générer une page CRUD complète avec DataTable**

```bash
/blazz-crud-page
```

**Ce que fait ce skill:**
1. Crée page avec DataTable
2. Configure colonnes avec types
3. Ajoute Create/Edit Dialog
4. Implémente Delete confirmation
5. Génère formulaire react-hook-form + Zod
6. Ajoute bulk actions
7. Configure filtrage et recherche

**Exemple d'utilisation:**
```
/blazz-crud-page

Créer CRUD pour entité "Product":
- Champs: name, description, price, category, stock, active
- Filtres: category (select), active (boolean), price (range)
- Bulk actions: activer, désactiver, supprimer
- Validation: name (required, min 3), price (positive), stock (integer)
```

**Résultat:**
- Page complète avec DataTable
- Dialog Create/Edit avec formulaire validé
- Colonnes configurées avec sorting
- Filtres fonctionnels
- Bulk actions implémentées
- Types TypeScript

---

## Patterns de Prompts Efficaces

### Principe: Be Specific

**❌ Mauvais:**
```
Crée une page de produits
```

**✅ Bon:**
```
Crée une page de gestion des produits (/products) avec:
- DataTable avec colonnes: image, nom, catégorie, prix, stock, statut
- Filtres: catégorie (select), statut (active/inactive), fourchette de prix
- Actions par ligne: éditer, dupliquer, supprimer
- Action bulk: exporter CSV, changer statut
- Dialog de création/édition avec formulaire validé (Zod)
- Champs: nom (required, min 3 chars), description (optional),
  prix (required, positive number), catégorie (select),
  stock (required, integer >= 0), image (upload), actif (boolean)
```

### Référencer les Composants

**❌ Éviter:**
```
Ajoute un modal de confirmation
```

**✅ Préférer:**
```
Ajoute un Dialog (composant Blazz UI) avec AlertDialog pattern pour
confirmer la suppression. Utilise les composants AlertDialogHeader,
AlertDialogTitle, AlertDialogDescription, AlertDialogFooter avec
boutons Cancel (variant="outline") et Delete (variant="destructive").
```

### Spécifier les Patterns

**❌ Flou:**
```
Fait un formulaire pour créer un utilisateur
```

**✅ Précis:**
```
Crée un formulaire avec react-hook-form et zod validation pour créer
un utilisateur. Utilise les composants Form, FormField, FormItem,
FormLabel, FormControl, FormMessage de Blazz UI.

Champs:
- email (Input type="email", required, validation email)
- password (Input type="password", required, min 8 chars)
- role (Select, options: admin/user/viewer, required)
- active (Switch, default true)

Button Submit avec variant="default" et disabled pendant soumission.
Afficher toast success après création.
```

### Inclure le Context Business

**❌ Manque de contexte:**
```
Ajoute une table de commandes
```

**✅ Avec contexte:**
```
Ajoute un DataTable pour les commandes d'un e-commerce B2C.

Colonnes:
- N° commande (lien vers détail)
- Client (nom + email en subtitle)
- Date (format relatif "il y a 2h")
- Total (format currency €)
- Statut (Badge avec couleurs: pending=yellow, processing=blue,
  shipped=purple, delivered=green, cancelled=red)
- Actions (dropdown: voir détail, marquer expédié, annuler, rembourser)

Filtres:
- Statut (multi-select)
- Date range
- Client (search)
- Montant min/max

Vues prédéfinies:
- "En attente" (status=pending)
- "À expédier" (status=processing)
- "Expédiées aujourd'hui" (shipped + today)
```

---

## Exemples de Commandes

### Créer une Page Simple

```
Utilise l'agent Blazz UI pour créer une page dashboard (/dashboard) avec:

1. PageHeader avec titre "Tableau de Bord" et description
2. Grid 3 colonnes avec cards de métriques:
   - Total Revenus (icon: DollarSign, valeur: €45,230, trend: +12%)
   - Utilisateurs Actifs (icon: Users, valeur: 1,234, trend: +5%)
   - Commandes (icon: ShoppingCart, valeur: 856, trend: -3%)
3. Card avec graphique placeholder (use div avec "Chart placeholder")
4. Card avec liste des dernières activités (5 items)

Utilise les composants Page, Card, Badge de Blazz UI.
```

### Implémenter un CRUD Complet

```
/blazz-crud-page

Entité: Customer (client)

Champs:
- name: string (required, min 2 chars)
- email: string (required, email format)
- phone: string (optional, phone format)
- company: string (optional)
- status: enum (active, inactive, blocked)
- tier: enum (bronze, silver, gold, platinum)
- createdAt: Date
- totalOrders: number
- totalSpent: number (currency)

DataTable colonnes:
- Avatar avec initiales
- Nom + email (subtitle)
- Entreprise
- Tier (Badge avec couleurs: bronze=gray, silver=slate, gold=yellow, platinum=purple)
- Statut (Badge)
- Total dépensé (format currency)
- Nombre commandes
- Date inscription (format relatif)
- Actions (dropdown)

Filtres:
- Statut (multi-select)
- Tier (multi-select)
- Date d'inscription (date range)
- Total dépensé (range slider)
- Recherche (name, email, company)

Vues prédéfinies:
- "Clients Actifs" (status=active)
- "VIP" (tier=gold OR tier=platinum)
- "Inactifs" (status=inactive)
- "Nouveaux" (createdAt >= -30 days)

Form validation avec Zod, utilise react-hook-form, styled avec Blazz UI components.
```

### Ajouter un Composant Custom

```
/blazz-new-component

Nom: PriceInput

Description: Input spécialisé pour saisie de prix avec:
- Symbole de devise (€ par défaut, prop "currency")
- Formatage automatique (séparateurs milliers)
- Validation min/max
- Support decimal (2 places par défaut)
- Variants: default, error
- Sizes: sm, default, lg

Props:
- value: number
- onChange: (value: number) => void
- currency: string (default "€")
- min: number (default 0)
- max: number (optional)
- decimals: number (default 2)
- variant: "default" | "error"
- size: "sm" | "default" | "lg"
- disabled: boolean
- placeholder: string

Styling: base sur composant Input de Blazz UI
Use CVA pour variants
Add proper ARIA attributes
Include keyboard support (arrow up/down pour incrémenter)
```

### Personnaliser le Layout

```
Modifie DashboardLayout pour ajouter:

1. Top bar avec:
   - Logo (left)
   - Command Palette trigger (center, ⌘K)
   - Notifications icon avec badge (right)
   - User menu avec dropdown (right)

2. Sidebar avec:
   - Company logo + name (top)
   - Navigation sections depuis config
   - User profile (bottom) avec:
     - Avatar
     - Name + role
     - Dropdown: Settings, Logout

3. Main content avec:
   - Breadcrumb (top)
   - Page content (scrollable)

Utilise les composants existants: AppTopBar, AppSidebar, Navbar, etc.
Garde la structure actuelle mais enrichis les features.
```

### Implémenter une Feature Complète

```
Implémente un système de notifications dans Blazz UI:

1. Type TypeScript pour Notification:
   - id, title, description, type (info/success/warning/error),
   - read (boolean), createdAt (Date), actionUrl (optional)

2. Context NotificationContext avec:
   - notifications: Notification[]
   - unreadCount: number
   - addNotification(notification)
   - markAsRead(id)
   - markAllAsRead()
   - deleteNotification(id)

3. Hook useNotifications() qui retourne le context

4. Composant NotificationBell:
   - Icon bell avec badge de count
   - Popover qui ouvre liste notifications
   - Chaque notification: titre, description, temps relatif, bouton mark read
   - Footer: "Mark all as read", "View all"
   - Empty state si pas de notifications

5. Composant NotificationItem:
   - Card avec icon selon type
   - Title + description
   - Timestamp relatif
   - Dot si unread
   - Action button si actionUrl
   - Delete button

6. Intégration dans AppTopBar

Use Blazz UI components: Popover, Badge, Button, Card, Separator
Styling cohérent avec design system
Add animations (subtle)
```

---

## Workflows Recommandés

### Workflow 1: Démarrer un Nouveau Projet

```bash
# 1. Cloner et setup
git clone <repo> mon-projet
cd mon-projet
npm install
cp .env.example .env.local

# 2. Demander à Claude
"Configure ce projet Blazz UI pour mon cas d'usage:
- Nom: [Mon App]
- Type: [SaaS B2B / Dashboard Admin / Tool interne]
- Features principales: [liste]
- Navigation: [sections]
- Couleurs: [primaire, secondary]

Mets à jour:
- app.config.ts
- navigation.ts
- globals.css (couleurs)
- Layout metadata
"

# 3. Générer les pages principales
"/blazz-new-page pour chaque page principale"

# 4. Implémenter les CRUDs
"/blazz-crud-page pour chaque entité"

# 5. Personnaliser
"Ajuste les layouts / Ajoute features custom"
```

### Workflow 2: Ajouter une Feature

```bash
# 1. Décrire la feature
"Je veux ajouter [feature description détaillée]"

# 2. Demander un plan
"Utilise l'agent Blazz UI pour me faire un plan d'implémentation
avec les étapes, fichiers à créer/modifier, et composants à utiliser"

# 3. Review du plan
[Valider ou ajuster le plan]

# 4. Implémentation
"Implémente le plan étape par étape"

# 5. Test
"Ajoute les tests pour cette feature"

# 6. Documentation
"Documente cette feature dans le README"
```

### Workflow 3: Refactoring

```bash
# 1. Identifier le scope
"Je veux refactorer [composant/module] pour [raison]"

# 2. Analyse d'impact
"Utilise l'architect reviewer pour analyser l'impact de ce refactoring"

# 3. Plan de migration
"Crée un plan de migration étape par étape qui ne casse rien"

# 4. Implémentation progressive
"Implémente étape 1"
"Test que tout fonctionne"
"Implémente étape 2"
...

# 5. Cleanup
"Supprime l'ancien code et mets à jour la documentation"
```

### Workflow 4: Debug

```bash
# 1. Décrire le problème
"J'ai une erreur: [erreur complète]
Dans le composant: [fichier]
Quand je fais: [actions]"

# 2. Analyse
Claude analyse le code et identifie la cause

# 3. Fix
"Corrige le bug en suivant les patterns Blazz UI"

# 4. Test
"Ajoute un test qui vérifie que ce bug ne reviendra pas"
```

---

## Best Practices LLM

### 1. Fournir du Contexte

**Toujours inclure:**
- Objectif business de la feature
- Cas d'usage utilisateur
- Contraintes techniques
- Composants existants à réutiliser

**Exemple:**
```
Context: Application SaaS de gestion de projets pour équipes 5-50 personnes.
Users: Chefs de projet, développeurs, clients.
Use case: Un chef de projet doit pouvoir créer un nouveau projet et
inviter des membres d'équipe avec des rôles spécifiques.

Crée une page de création de projet avec...
```

### 2. Référencer les Patterns

**Toujours mentionner:**
```
"Utilise le pattern DataTable comme dans /products"
"Suis le style du formulaire dans /auth/login"
"Base-toi sur le Card component existant"
```

### 3. Spécifier les Variants

**Au lieu de:**
```
"Ajoute un bouton rouge"
```

**Dire:**
```
"Ajoute un Button avec variant='destructive'"
```

### 4. Inclure les Validations

**Toujours spécifier:**
```
Validation Zod:
- name: string, required, min 3 chars, max 50 chars
- email: string, required, email format, unique
- age: number, optional, min 18, max 120
- website: string, optional, URL format
```

### 5. Demander des Tests

**Après implémentation:**
```
"Ajoute maintenant les tests Vitest pour ce composant avec:
- Test de render
- Test des variants
- Test des interactions utilisateur
- Test d'accessibilité (ARIA)"
```

### 6. Itérer Progressivement

**Au lieu d'un prompt géant, diviser:**
```
Étape 1: "Crée la structure de la page"
Étape 2: "Ajoute le DataTable avec colonnes de base"
Étape 3: "Implémente les filtres"
Étape 4: "Ajoute le dialog de création"
Étape 5: "Connecte à l'API"
```

---

## Étendre les Agents & Skills

### Créer un Nouvel Agent

Fichier: `~/.claude/agents/mon-agent.md`

```markdown
---
name: mon-agent
model: sonnet
---

# Mon Agent Spécialisé

Description de l'agent...

## Capacités

- Capacité 1
- Capacité 2

## Contexte Projet

[Info sur Blazz UI nécessaire pour cet agent]

## Patterns

[Patterns spécifiques que cet agent doit connaître]

## Tools Access

- Read, Write, Edit
- Bash
- Autres outils nécessaires
```

### Créer un Nouveau Skill

Fichier: `.claude/skills/mon-skill.md`

```markdown
---
name: mon-skill
description: Description courte du skill
user-invocable: true
agent: blazz-ui-assistant
---

# Mon Skill

Description détaillée...

## Input Attendu

- Paramètre 1
- Paramètre 2

## Étapes d'Exécution

1. Étape 1
2. Étape 2
3. Étape 3

## Output

Ce que le skill produit

## Exemple

\`\`\`bash
/mon-skill

Input example...
\`\`\`
```

### Configurer les Permissions

`.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(ma-commande:*)",
      "Write(/mon/chemin/**)",
      "WebSearch"
    ],
    "deny": [
      "Bash(rm:*)"
    ]
  }
}
```

---

## Troubleshooting

### Claude ne comprend pas la structure

**Solution:**
```
"Lis d'abord le fichier /docs/ARCHITECTURE.md pour comprendre
la structure du projet, puis [ta demande]"
```

### Le code généré ne suit pas les patterns

**Solution:**
```
"Regarde comment le composant Button est implémenté dans
/components/ui/button/button.tsx et suis exactement ce pattern
pour créer [ton composant]"
```

### Les imports sont incorrects

**Solution:**
```
"Utilise les path aliases TypeScript:
- @/components/ui pour les composants UI
- @/hooks pour les hooks
- @/lib/utils pour les utilitaires
- @/types pour les types"
```

### Composant non accessible

**Solution:**
```
"Ajoute les attributs ARIA nécessaires:
- aria-label pour les boutons sans texte
- aria-expanded pour les éléments expandables
- aria-haspopup pour les menus
- role approprié
Réfère-toi au composant Dialog pour exemple d'accessibilité"
```

### Dark mode ne fonctionne pas

**Solution:**
```
"Utilise les CSS variables du design system au lieu de couleurs hardcodées:
- bg-background au lieu de bg-white
- text-foreground au lieu de text-black
- border-border au lieu de border-gray-200
Vérifie globals.css pour toutes les variables disponibles"
```

---

## Ressources

- [Documentation Architecture](ARCHITECTURE.md)
- [Liste Composants](COMPONENTS.md)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Guide Prompting Anthropic](https://docs.anthropic.com/prompting)

---

**Dernière mise à jour**: 2026-01-19

**Construit avec ❤️ pour les équipes qui développent avec l'IA**
