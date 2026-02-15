# Pro UI Kit — Stratégie Complète

## 1. Positionnement Produit

### Pitch
"Le starter kit où tu décris ce que tu veux, et l'IA le construit correctement du premier coup."

Kit de composants React/Next.js AI-native pour applications professionnelles data-heavy : back-offices, CRM, ERP, outils internes.

### Cible
Lead Techs, dev seniors en ESN, équipes internes, freelances senior qui construisent des apps métier. Pas des indie hackers SaaS.

### Insight marché
Des milliers d'entreprises paient Salesforce 150€/user/mois (90K€/an pour 50 users). Un Lead Tech avec Pro UI Kit à 599€ peut vibe coder 80% de ça en 2-3 semaines. Le ROI est immédiat et évident.

---

## 2. Architecture Technique — Base UI

### Pourquoi quitter shadcn

- Tout le monde utilise shadcn → look reconnaissable en 1 seconde → impossible de vendre premium
- shadcn impose des opinions visuelles qu'il faut overrider → on se bat contre les defaults
- Un Lead Tech qui voit du shadcn se dit "je peux faire ça moi-même" → pas de valeur perçue

### Pourquoi Base UI

- Base UI v1 sorti le 11 décembre 2025, 35 composants accessibles
- Créé par les auteurs de Radix, Floating UI et Material UI
- Zéro style imposé → contrôle total de chaque pixel
- WCAG compliant out of the box → argument technique pour grands comptes
- Soutien long terme par MUI (équipe dédiée) → stabilité garantie
- Package : `@base-ui/react`

### Stack technique

```
Couche comportement :  @base-ui/react (v1.2)
Couche styling :       Tailwind CSS v4
Couche design tokens : CSS custom properties (25 variables)
Couche composants :    Primitives Pro UI (Button, Input, etc.)
Couche blocks :        Blocks métier (DataGrid, FilterBar, etc.)
Couche app :           Next.js 15 (App Router), React 19, TypeScript
```

Dépendances complémentaires :
- react-hook-form + zod (formulaires)
- TanStack Table (DataGrid)
- @dnd-kit/core (Kanban drag & drop)
- Recharts (graphiques)
- Lucide Icons
- Prisma + PostgreSQL (démo CRM)

### Mapping Base UI → Pro UI Kit

| Besoin Pro UI Kit | Composant Base UI | Notes |
|---|---|---|
| Button | `Button` | Avec loading, icon, variants |
| Input | `Input`, `Field` | Field gère label + error |
| Select | `Select` | Searchable à builder dessus |
| Checkbox | `Checkbox` | |
| Radio | `RadioGroup` | |
| Switch | `Switch` | |
| Dialog / Modal | `Dialog` | Pour ConfirmDialog aussi |
| Sheet (side panel) | `Dialog` | Avec animation slide |
| Popover | `Popover` | |
| Tooltip | `Tooltip` | |
| Tabs | `Tabs` | |
| Menu / Dropdown | `Menu` | Row actions dans DataGrid |
| Toast | `Toast` | |
| Alert | `AlertDialog` | Actions destructives |
| Collapsible | `Collapsible` | Pour FormSection |
| Slider | `Slider` | Filtres range |
| Progress | `Progress` | Import, uploads |
| Separator | `Separator` | |
| Toggle | `Toggle` | Vue Kanban/Table |
| Scroll Area | `ScrollArea` | Kanban colonnes |

Composants construits from scratch (pas dans Base UI) :
- **DataGrid** (TanStack Table + styling custom)
- **KanbanBoard** (@dnd-kit + styling custom)
- **Charts / ChartCard** (Recharts + wrapper)
- **Command Palette** (composant custom)
- **Tous les blocks métier** (PageHeader, FilterBar, DetailPanel, etc.)

---

## 3. Design System

### Principes fondateurs

1. **Dense ET beau** — Montrer beaucoup de données sans ressembler à Excel. Référence : Linear, Vercel Dashboard.
2. **Desktop-first** — Les apps pro sont utilisées sur desktop. Le responsive est secondaire.
3. **Thème-agnostique** — Le client change 15 variables CSS et il a son branding.
4. **Aucun style reconnaissable** — Pas de "shadcn look", pas de "Material look". Un look propre à Pro UI Kit.

### Design Tokens (25 variables)

```css
:root {
  /* Surfaces */
  --bg-app: oklch(0.145 0.005 285);
  --bg-surface: oklch(0.178 0.005 285);
  --bg-raised: oklch(0.215 0.005 285);
  --bg-overlay: oklch(0.25 0.005 285);

  /* Borders */
  --border-default: oklch(0.3 0.005 285 / 0.5);
  --border-subtle: oklch(0.3 0.005 285 / 0.25);

  /* Text */
  --text-primary: oklch(0.985 0 0);
  --text-secondary: oklch(0.65 0.01 285);
  --text-muted: oklch(0.5 0.01 285);

  /* Accent (la seule couleur à changer pour re-themer) */
  --accent: oklch(0.637 0.174 259);
  --accent-hover: oklch(0.58 0.174 259);
  --accent-foreground: oklch(0.985 0 0);

  /* Semantic */
  --success: oklch(0.6 0.18 145);
  --warning: oklch(0.7 0.15 70);
  --destructive: oklch(0.6 0.2 25);
  --info: oklch(0.55 0.2 265);

  /* Density — le différenciateur enterprise */
  --row-height: 40px;
  --cell-padding-x: 12px;
  --cell-padding-y: 8px;
  --input-height: 32px;
  --section-gap: 24px;
  --sidebar-width: 240px;
  --sidebar-collapsed: 64px;
}
```

### Thèmes pré-packagés

**Slate (dark, défaut flagship)**
- Background quasi-noir, accent bleu
- Le hero des screenshots et vidéos marketing
- Vibe : Linear, Vercel, Railway

**Corporate (light, grands comptes)**
- Background blanc cassé, accent bleu navy
- Pour les entreprises qui veulent du "sérieux"
- Vibe : Notion, Stripe Dashboard

**Warm (light, relation client)**
- Background crème, tons chauds
- Pour les apps orientées relation humaine (RH, CRM)
- Vibe : Intercom, HelpScout

Switching de thème : un seul attribut `data-theme` sur le `<html>`.

### Typographie

Police unique : **Inter** (conçue pour les interfaces, supporte les tabular numbers).

```
Display     : Inter 600, 24px, -0.025em tracking
Heading     : Inter 600, 18px, -0.02em
Subheading  : Inter 500, 14px, -0.01em
Body        : Inter 400, 14px
Body small  : Inter 400, 13px         ← le workhorse des tables
Caption     : Inter 500, 11px, uppercase, 0.05em tracking
Mono        : JetBrains Mono 400, 13px ← IDs, codes, références
```

Règle critique : `font-variant-numeric: tabular-nums` sur toutes les colonnes de chiffres.

### Micro-détails premium

- **Borders subtiles, pas de box-shadow** — Cards avec border 1px opacity 10-15%, pas d'ombre
- **Transitions 150ms ease-out** — Partout, mais imperceptibles. Jamais 300ms, jamais de bounce
- **Status badges avec dot** — `● Actif` pas un badge coloré plein. Référence : Linear
- **Row hover subtil** — Pas un background-color brutal, un highlight léger
- **Empty states illustrés** — Icône + message + CTA, jamais du texte seul
- **Chiffres formatés** — Séparateur de milliers, symbole monétaire, alignés à droite
- **Valeurs manquantes** — Affichées "—", jamais vide

### Densité enterprise

La différence fondamentale avec les kits SaaS. Comparaison :

| Élément | SaaS classique (shadcn) | Pro UI Kit (enterprise) |
|---|---|---|
| Row height table | 56px | 40px |
| Font size table | 14px | 13px |
| Cell padding | 16px | 8px 12px |
| Input height | 40px | 32px |
| Sidebar width | 280px | 240px (64px collapsed) |
| Section gap | 32px | 24px |
| Badge padding | 4px 12px | 2px 8px |

Plus d'information par écran, sans sacrifier la lisibilité.

---

## 4. Demo App : Forge CRM

### Concept
Replica d'un CRM complet pour showcaser le kit. 15 écrans couvrant tous les patterns.

Spec complète dans `docs/demo-crm-spec.md`.

### Apps secondaires (marketing only)

En plus de Forge CRM (100% implémenté), 4 apps avec juste 2 pages chacune (dashboard + liste) pour prouver l'adaptabilité :

| App | Domaine | Thème | Pages |
|---|---|---|---|
| **Forge CRM** | Gestion commerciale | Slate (dark) | 15 écrans complets |
| **PulseOps** | Interventions terrain | Corporate (light) | Dashboard + liste interventions |
| **TalentFlow** | Recrutement (ATS) | Warm | Dashboard + pipeline candidats |
| **StockBase** | Gestion d'inventaire | Slate (dark) | Dashboard + catalogue produits |
| **TeamDesk** | Helpdesk / Support | Corporate (light) | Dashboard + liste tickets |

Sur la landing page, un switcher d'app permet de voir les 5 démos. Message implicite : "Un kit. Des dizaines d'apps possibles."

---

## 5. Pricing

### Grille tarifaire

```
PRO UI KIT — Core                         299€
  40+ composants, 7 patterns, SKILL.md, 3 thèmes
  Usage : 1 dev solo

PRO UI KIT — Complete                      599€
  Core + Forge CRM demo complète
  + seed data + Prisma schema
  + patterns bonus (import, reporting, kanban)
  Usage : équipe jusqu'à 5 devs

PRO UI KIT — Enterprise                   999€
  Complete + support email 3 mois
  + 1h de call onboarding
  + usage illimité devs
```

One-shot, pas d'abonnement. Les devs détestent les abonnements pour du code source.

### Add-ons (6+ mois post-launch)

```
Pack RH           +199€  — Gestion employés, congés, notes de frais
Pack Logistique   +199€  — Stock, commandes, expéditions
Pack Support      +199€  — Tickets, SLA, knowledge base
Pack Analytics    +149€  — Dashboards avancés, exports, scheduling
```

Chaque pack = 5-8 pages supplémentaires + patterns spécifiques. Chaque sortie = événement de communication.

---

## 6. Stratégie Marketing

### Pilier 1 : Le contenu qui vend (gratuit)

**Vidéo flagship (priorité absolue)**
5-8 min : "Je construis un CRM complet en 30 minutes avec l'IA"
- Terminal ouvert, Claude Code, prompts, pages qui se construisent en temps réel
- Accéléré aux bons moments, ralenti sur les "wow"
- Déclinaisons : version longue YouTube, clips 60s Twitter/X et LinkedIn, GIFs pour le README

**Threads Twitter/X (1/semaine minimum)**
Toujours le même angle : "J'ai vibe codé [X] en [Y] minutes"
Exemples :
- "J'ai vibe codé un pipeline commercial drag & drop en 12 minutes"
- "Import de 5000 contacts depuis un CSV en 8 minutes de dev"
- "Un dashboard opérationnel avec 4 KPIs et 3 graphiques en 15 minutes"
- "Mon kit génère des formulaires de 40 champs avec validation en une seule commande"
Chaque thread → lien landing page. Pas de hard sell.

**Comparaisons directes**
Contenu très partageable : "Salesforce vs vibe codé avec Pro UI Kit"

| | Salesforce | Pro UI Kit |
|---|---|---|
| Coût année 1 (50 users) | 90 000€ | 599€ + temps dev |
| Personnalisation | Limité | Totale |
| Propriété du code | Non | Oui |
| Vendor lock-in | Oui | Non |
| Time to deploy | 3-6 mois | 2-4 semaines |

### Pilier 2 : Distribution

**Où sont les acheteurs :**
- Twitter/X dev FR et EN (communauté Next.js, React, AI dev)
- LinkedIn (CTO, VP Engineering, décideurs techniques FR)
- r/nextjs, r/reactjs (devs qui cherchent des solutions)
- Discord : serveurs Next.js, shadcn, Claude/Anthropic, Cursor
- IndieHackers (récit entrepreneurial)

**Drip launch en 3 temps :**

1. **Teasing (2-3 semaines avant)** — Vidéos de build en temps réel, pas de lien, pas de prix. Waitlist email.
2. **Early Access (1 semaine)** — 50-100 personnes à 149€ (au lieu de 299€). Feedback, témoignages, fixes.
3. **Launch public** — Twitter thread, LinkedIn, Product Hunt, Reddit. Avec témoignages early adopters.

### Pilier 3 : Arguments de vente clés

**"Pas du shadcn"**
Trois mots qui attirent l'attention. Beaucoup de devs sont fatigués du "shadcn look". Positionnement comme alternative premium.

**"Construit sur Base UI"**
Section landing page :
```
"Construit sur Base UI, pas sur shadcn."

Pro UI Kit utilise les primitives headless Base UI (par les créateurs
de Radix et Material UI) comme fondation. Zéro style imposé, zéro
compromis. Chaque composant est designé from scratch pour les apps
professionnelles data-heavy.

✓ Accessibilité WCAG 2.1 AA native
✓ Aucun style à overrider
✓ Thème personnalisable en 5 minutes
✓ Un look unique, pas "encore du shadcn"
```

**"Enterprise-grade accessibility"**
Pour les grands comptes avec exigences WCAG → débloque des budgets.

**Le calcul ROI**
Comparateur interactif sur la landing :
```
[50] utilisateurs × [150€] / mois × [12] mois = 90 000€/an
"Ou 599€ une fois + votre équipe de dev."
```

### Landing page — Structure

```
Section 1 — Hero
  "Arrêtez de payer Salesforce.
   Vibe codez votre app métier en 2 semaines."
  [Vidéo autoplay : build de Forge CRM en accéléré]
  [Voir la démo live]  [Acheter — à partir de 299€]

Section 2 — Switcher multi-apps
  Les 5 previews d'apps avec tabs cliquables
  "Un kit. Des dizaines d'apps possibles."

Section 3 — Calculateur ROI
  Comparateur interactif Salesforce vs Pro UI Kit

Section 4 — Composants
  Grille visuelle des composants avec hover preview

Section 5 — Vidéo complète
  "20 minutes pour construire un CRM complet"

Section 6 — Témoignages (post-launch)

Section 7 — Pricing (3 tiers)

Section 8 — FAQ
```

---

## 7. Projections Revenue

### Scénario conservateur — Année 1

```
Mois 1-2  : Build + teasing, pas de revenus
Mois 3    : Early access 50 × 149€              =   7 450€
Mois 4    : Launch 80 × 399€ (mix core+complete) =  31 920€
Mois 5-8  : Croisière 30/mois × 450€ moyenne     =  54 000€
Mois 9-12 : + add-ons, 40/mois × 500€ moyenne    =  80 000€
                                           TOTAL ≈  173 000€
```

Scénario pessimiste : 50-70K€
Scénario optimiste (vidéo virale) : 250K€+

### Revenus récurrents

Les add-ons (packs verticaux) créent de la récurrence sans abonnement. Chaque pack sorti = pic de ventes sur le pack + ventes du kit core.

---

## 8. Erreurs à éviter

1. **Lancer trop tôt** — Si Forge CRM n'est pas spectaculaire, ne pas lancer. Première impression = seule impression.
2. **Négliger le design** — Le kit sera jugé sur l'apparence en 3 secondes. Si ça ressemble à du shadcn par défaut, personne ne paie.
3. **Pas de contenu régulier** — Un lancement sans suivi meurt en 2 semaines. 1 thread/post par semaine minimum pendant 6 mois.
4. **Construire sans audience** — Le marketing commence AVANT le produit. Tweeter pendant le build.
5. **Over-engineer le meta-système** — Les tags, registries, scoring sont de la plomberie interne. Le client achète des composants et des patterns, pas une taxonomie.

---

## 9. Actions immédiates

### Business (maintenant)
- [ ] Créer le compte Twitter @ProUIKit ou @blazz_dev
- [ ] Acheter le domaine (prouikit.com ou prouikit.dev)
- [ ] Landing page waitlist (email capture simple)
- [ ] Commencer à poster du contenu sur le vibe coding d'apps pro

### Technique (Phase 1)
- [ ] Setup Next.js 15 + Tailwind v4 + Base UI
- [ ] Implémenter les design tokens (25 variables CSS)
- [ ] Construire les primitives sur Base UI (Button, Input, Select, Badge, Dialog, Tabs, etc.)
- [ ] Appliquer la densité enterprise sur chaque primitive

### Technique (Phase 2)
- [ ] Implémenter les blocks métier (DataGrid, FilterBar, PageHeader, etc.)
- [ ] Implémenter les layouts (DashboardLayout, AuthLayout)
- [ ] Construire Forge CRM (15 écrans)
- [ ] Seed data réaliste

### Marketing (Phase 3)
- [ ] Vidéo flagship "CRM en 30 minutes"
- [ ] Threads Twitter (1/semaine)
- [ ] Landing page complète
- [ ] Early access (50-100 personnes à 149€)
- [ ] Launch public

---

## 10. Fichiers de référence

- `ai/SKILL.md` — Instructions IA, conventions, architecture
- `ai/components.md` — Catalogue composants avec API
- `ai/rules.md` — Règles obligatoires
- `ai/patterns/` — Patterns de pages complets
- `docs/demo-crm-spec.md` — Spec Forge CRM (15 écrans)
- `PROMPT_CLAUDE_CODE.md` — Prompt pour continuer dans Claude Code
