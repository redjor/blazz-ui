# BlazzTime iOS — Todos Reader App

## Goal

App iPhone/iPad SwiftUI native pour consulter ses todos Blazz Ops. Lecture seule, style Linear mobile (fond noir, liste flat, pill filters). Partage le code réseau avec l'app macOS BlazzTime existante.

## Architecture

Un seul projet Xcode `BlazzTime` avec targets additionnels :

```
BlazzTime/
├── Shared/                  ← code partagé macOS + iOS
│   ├── ConvexClient.swift   ← HTTP client (existant, déplacé)
│   ├── AuthManager.swift    ← Keychain token (existant, déplacé)
│   ├── Models.swift         ← TodoItem, Project, Category (existant, déplacé)
│   └── LoginWebView.swift   ← WebView OAuth Google (adapté iOS)
├── BlazzTime/               ← macOS menu bar app (existant)
├── BlazzTimeWidget/         ← macOS widget (existant)
├── BlazzTimeIOS/            ← NOUVEAU — app iPhone/iPad
│   ├── BlazzTimeIOSApp.swift
│   ├── TodayView.swift
│   ├── AllTodosView.swift
│   ├── TodoDetailView.swift
│   ├── TodoRowView.swift
│   ├── StatusCircleView.swift
│   ├── PillFilterView.swift
│   └── LoginView.swift
└── project.yml              ← xcodegen spec (nouveau target iOS)
```

**Targets Xcode :**
- `BlazzTime` — macOS app (existant)
- `BlazzTimeWidget` — macOS widget (existant)
- `BlazzTimeIOS` — iPhone/iPad app (nouveau)
- `BlazzTimeTests` — tests (existant)

## Tech Stack

- SwiftUI (iOS 17+)
- URLSession → Convex HTTP API (`POST /api/query`)
- Keychain Services pour le token auth
- WKWebView pour Google OAuth login
- Pas de dépendances externes

## Data Flow

```
Convex Backend (HTTPS)
    ↕ POST /api/query
ConvexClient.swift (Shared/)
    ↕
@Observable TodoStore
    ↕
SwiftUI Views
```

**Endpoints Convex utilisés :**
- `todos:list` — toutes les tâches (filtrage côté client par status)
- `todos:listByDate` — tâches du jour (date = YYYY-MM-DD)
- `todos:listAllTags` — tags pour affichage

**Refresh :** Pull-to-refresh uniquement. Pas de WebSocket/polling pour le MVP.

## Ecrans

### 1. LoginView

Plein écran, fond noir.
- Logo Blazz centré
- Bouton "Se connecter avec Google" — pill blanc, texte noir
- Ouvre WKWebView avec la page login Convex
- Capture le token JWT depuis localStorage → Keychain

### 2. TodayView (onglet principal)

Style Linear mobile — fond noir pur, liste flat.

**Header :**
- Large title : "Aujourd'hui" (`.largeTitle.bold`, blanc)
- Sous-titre : "mer. 12 mars — 5 tâches" (`.subheadline`, `opacity(0.5)`)

**Liste :**
- Groupée par priorité : sections "Urgent", "High", "Normal", "Low"
- Section header : texte caption gris
- Chaque ligne (`TodoRowView`) :
  - Icône priorité `!` colorée (rouge/orange/bleu/gris) — 16px
  - Cercle status (`StatusCircleView`) — 18px
  - Texte todo `.body` blanc, 1 ligne max
  - Espacement vertical 16px entre items
- Fond noir, pas de cards, pas de séparateurs

**Status circles (comme Linear) :**
- `triage` : cercle outline gris pointillé
- `todo` : cercle outline blanc
- `in_progress` : cercle demi-rempli jaune
- `blocked` : cercle rouge barré
- `done` : cercle vert plein avec checkmark

**Etats :**
- Empty : icône checkmark.circle.fill vert + "Rien pour aujourd'hui"
- Erreur : message rouge + bouton "Réessayer"
- Loading : ProgressView natif

**Pull-to-refresh** natif iOS.

### 3. AllTodosView (second onglet)

**Header :**
- Large title : "Tâches" (`.largeTitle.bold`)

**Pill filters** (scroll horizontal) :
- Toutes | Triage | Todo | In Progress | Blocked | Done
- Sélectionné : fond blanc, texte noir, coins arrondis 20px
- Non sélectionné : fond transparent, texte gris `opacity(0.5)`

**Liste :**
- Même `TodoRowView` que TodayView
- Filtrée par le pill sélectionné
- Triée par priorité (urgent → low)

### 4. TodoDetailView (tap sur une ligne)

Navigation push (`.navigationDestination`).

**Layout :**
- Back button cercle noir (natif NavigationStack)
- Titre todo `.title.bold` blanc
- Barre metadata (HStack, scroll horizontal) :
  - Pill status (fond teinté + texte)
  - Pill priorité (icône + texte)
  - Pill projet (si `projectId` présent)
- Description complète `.body` `opacity(0.7)` (si présente)
- Tags en pills gris (si présents)
- Due date en `.caption` gris (si présente)

### 5. Tab Bar

2 onglets, fond noir translucide :
- "Aujourd'hui" — `sun.max`
- "Tâches" — `checklist`

Tint color : blanc.

## Style visuel

Inspiré de Linear mobile :

| Element | Value |
|---------|-------|
| Background | `Color.black` (noir pur OLED) |
| Text primary | `Color.white` |
| Text secondary | `Color.white.opacity(0.5)` |
| Text tertiary | `Color.white.opacity(0.3)` |
| Priority urgent | `Color.red` |
| Priority high | `Color.orange` |
| Priority normal | `Color.blue` |
| Priority low | `Color.gray` |
| Pill selected | fond blanc, texte noir |
| Pill unselected | fond transparent, texte gris |
| Row height | ~56px |
| Row spacing | 16px vertical |
| Section spacing | 24px |
| Corner radius pills | 20px |
| Font title | SF Pro `.largeTitle.bold` |
| Font body | SF Pro `.body` |
| Font caption | SF Pro `.caption` |

**Pas de cards, pas de bordures.** Séparation par espacement uniquement.

## Auth

Même flow que BlazzTime macOS :
1. WKWebView charge `https://rightful-guineapig-376.eu-west-1.convex.cloud` login page
2. User se connecte via Google OAuth
3. JS bridge capture le JWT depuis localStorage
4. Token stocké dans Keychain (service: `dev.blazz.blazztime`, account: `convex-token`)
5. Toutes les requêtes HTTP incluent `Authorization: Bearer <token>`

Le Keychain est partagé entre macOS et iOS via le même `keychain-access-groups`.

## Scope V1 (lecture seule)

**Inclus :**
- Login Google OAuth
- Vue aujourd'hui (todos du jour)
- Vue toutes les tâches (avec filtre status)
- Détail todo
- Pull-to-refresh
- Support iPhone + iPad

**Exclus (V2+) :**
- Swipe pour changer status
- Création/édition de todos
- Widget iOS
- Push notifications
- Offline cache
- Time tracking
