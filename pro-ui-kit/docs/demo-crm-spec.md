# Pro UI Kit — Demo CRM "Forge"

> Application de gestion commerciale complète.
> Chaque écran est mappé sur un pattern du kit et showcases des composants spécifiques.

---

## Data Model

```
Company (entreprise)
├── id, name, domain, industry, size, revenue, address, city, country
├── tags[], source, assignedTo (user)
├── status: prospect | client | churned | inactive
├── createdAt, updatedAt
│
├── contacts[] ──── Contact (personne)
│                   ├── id, firstName, lastName, email, phone, jobTitle, linkedin
│                   ├── isPrimary (contact principal)
│                   ├── tags[], lastContactedAt
│                   └── createdAt, updatedAt
│
├── deals[] ─────── Deal (opportunité)
│                   ├── id, title, description
│                   ├── amount, currency, probability
│                   ├── stage: qualification | proposal | negotiation | closing | won | lost
│                   ├── expectedCloseDate, actualCloseDate
│                   ├── lostReason? (si perdu)
│                   ├── assignedTo (user), companyId, contactId
│                   ├── dealLines[] ── DealLine
│                   │                  ├── productId, quantity, unitPrice, discount
│                   │                  └── total (computed)
│                   └── createdAt, updatedAt
│
├── activities[] ── Activity (interaction)
│                   ├── id, type: call | email | meeting | task | note
│                   ├── subject, description
│                   ├── date, duration (minutes)
│                   ├── contactId?, dealId?, companyId
│                   ├── assignedTo (user)
│                   ├── completed (boolean)
│                   └── createdAt
│
└── quotes[] ────── Quote (devis)
                    ├── id, reference (auto: DEV-2025-0042)
                    ├── status: draft | sent | accepted | rejected | expired
                    ├── dealId, companyId, contactId
                    ├── validUntil
                    ├── quoteLines[] ── QuoteLine
                    │                   ├── productId, description, quantity
                    │                   ├── unitPrice, discount, taxRate
                    │                   └── totalHT, totalTTC (computed)
                    ├── subtotal, totalDiscount, totalHT, totalTax, totalTTC
                    ├── notes, terms
                    └── createdAt, updatedAt

Product (catalogue)
├── id, name, reference, description, category
├── unitPrice, taxRate
├── active (boolean)
└── createdAt, updatedAt

User (utilisateur interne)
├── id, firstName, lastName, email, avatar
├── role: admin | manager | sales
└── teamId?

Team
├── id, name, managerId
└── members[] (users)
```

---

## Écrans complets

### 1. Dashboard (`/`)

**Pattern** : `dashboard.md`
**Composants** : PageHeader, StatsGrid, ChartCard, DataGrid (mini), ActivityTimeline

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   "Tableau de bord"                          [Période: 30 jours]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ StatsGrid (4 colonnes)                                           │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐   │
│ │ Pipeline     │ Deals gagnés │ CA ce mois   │ Taux conv.   │   │
│ │ €1.2M       │ 23           │ €145K        │ 32%          │   │
│ │ ▲ 8% ░░████ │ ▲ 12% ░░███ │ ▼ 3% █████░ │ ▲ 5% ░░████ │   │
│ └──────────────┴──────────────┴──────────────┴──────────────┘   │
│                                                                  │
│ ┌────────────────────────────┬───────────────────────────────┐   │
│ │ ChartCard                  │ ChartCard                     │   │
│ │ "Pipeline par étape"       │ "CA mensuel"                  │   │
│ │ (bar chart horizontal)     │ (line chart 12 mois)          │   │
│ │ Qualification ████ 12      │                 ╱\            │   │
│ │ Proposition   ██████ 18    │    ╱\     ╱\  ╱  \           │   │
│ │ Négociation   ███ 8        │ ──╱  \───╱  ╲╱    \──        │   │
│ │ Closing       ██ 5         │                               │   │
│ └────────────────────────────┴───────────────────────────────┘   │
│                                                                  │
│ ┌────────────────────────────┬───────────────────────────────┐   │
│ │ "Deals à closer ce mois"  │ "Activité récente"            │   │
│ │ DataGrid (mini, 5 lignes) │ ActivityTimeline               │   │
│ │                            │                               │   │
│ │ Acme Corp   €45K  Closing  │ • Marie a gagné Acme (€45K)  │   │
│ │ TechStart   €22K  Négoc.   │ • Paul a créé un deal BioTech│   │
│ │ BigRetail   €120K Closing  │ • Appel avec Jean @ DataFlow │   │
│ │ DataFlow    €18K  Négoc.   │ • Devis envoyé à BigRetail   │   │
│ │ BioTech     €35K  Qualif.  │ • Nouveau contact importé    │   │
│ │           [Voir tout →]    │              [Voir tout →]    │   │
│ └────────────────────────────┴───────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Données spécifiques** :
- StatsGrid : pipeline total (somme deals actifs), deals won ce mois, CA réalisé, taux de conversion (won / total clôturés)
- "Deals à closer" : filtre deals avec expectedCloseDate dans le mois, triés par montant desc
- "Activité récente" : dernières 10 activités toutes ressources confondues

---

### 2. Entreprises — Liste (`/companies`)

**Pattern** : `resource-list.md`
**Composants** : PageHeader, FilterBar, DataGrid, BulkActionBar, EmptyState

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   Dashboard > Entreprises                                        │
│   "Entreprises" (2 847)               [Importer] [+ Nouvelle]   │
├──────────────────────────────────────────────────────────────────┤
│ FilterBar                                                        │
│ [🔍 Rechercher...] [Statut ▾] [Secteur ▾] [Taille ▾] [Assigné ▾] [✕ Reset] │
├──────────────────────────────────────────────────────────────────┤
│ DataGrid                                                         │
│ ☐ │ Entreprise      │ Secteur    │ Taille  │ CA estimé │ Statut   │ Assigné    │ Dernier contact │
│───┼─────────────────┼────────────┼─────────┼───────────┼──────────┼────────────┼─────────────────│
│ ☐ │ Acme Corp       │ Tech       │ 50-200  │ €2.5M     │ 🟢 Client│ Marie D.   │ Il y a 2 jours  │
│ ☐ │ BigRetail SAS   │ Retail     │ 500+    │ €45M      │ 🟡 Prosp.│ Paul M.    │ Il y a 1 sem.   │
│ ☐ │ DataFlow Inc    │ Data       │ 10-50   │ €800K     │ 🟢 Client│ Marie D.   │ Aujourd'hui     │
│ ☐ │ BioTech Labs    │ Santé      │ 200-500 │ €12M      │ 🟡 Prosp.│ Jean K.    │ Il y a 3 jours  │
│ ☐ │ CloudNine       │ SaaS       │ 10-50   │ €1.2M     │ 🔴 Inact.│ —          │ Il y a 6 mois   │
│   │                 │            │         │           │          │            │                 │
│   │                                                   1–25 sur 2 847  < Page 1/114 > │
├──────────────────────────────────────────────────────────────────┤
│ BulkActionBar (quand sélection)                                  │
│   3 sélectionnés    [Assigner à...] [Changer statut] [Exporter] [Supprimer] │
└──────────────────────────────────────────────────────────────────┘
```

**Colonnes DataGrid** : 8 colonnes (nom cliquable, secteur, taille, CA estimé, statut badge, assigné avatar+nom, dernier contact relatif, actions menu)
**Filtres** : search (nom/domaine), statut (multi-select), secteur (multi-select), taille (select), assigné (select users)
**Bulk actions** : assigner en masse, changer statut, exporter CSV, supprimer avec confirmation
**Tri serveur** : nom, CA, statut, dernier contact

---

### 3. Entreprise — Détail (`/companies/[id]`)

**Pattern** : `resource-detail.md`
**Composants** : PageHeader, DetailPanel, FieldGrid, Tabs, DataGrid (embedded), ActivityTimeline

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   Dashboard > Entreprises > Acme Corp                            │
│   "Acme Corp"  🟢 Client                    [Modifier] [Suppr.] │
├──────────────────────────────────────────────────────────────────┤
│ Tabs                                                             │
│   [Résumé]  [Contacts (4)]  [Deals (3)]  [Activités (12)]  [Devis (2)]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Tab: Résumé                                                      │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Section "Informations"                                       │ │
│ │ ┌────────────────┬────────────────┬────────────────┐         │ │
│ │ │ Nom            │ Secteur        │ Taille         │         │ │
│ │ │ Acme Corp      │ Tech           │ 50-200         │         │ │
│ │ ├────────────────┼────────────────┼────────────────┤         │ │
│ │ │ CA estimé      │ Site web       │ Source         │         │ │
│ │ │ €2.5M          │ acme.com       │ Salon 2024    │         │ │
│ │ ├────────────────┴────────────────┴────────────────┤         │ │
│ │ │ Adresse                                          │         │ │
│ │ │ 42 rue de Rivoli, 75001 Paris, France            │         │ │
│ │ └──────────────────────────────────────────────────┘         │ │
│ │                                                              │ │
│ │ Section "Commercial"                                         │ │
│ │ ┌────────────────┬────────────────┬────────────────┐         │ │
│ │ │ Assigné à      │ Tags           │ Statut         │         │ │
│ │ │ 👤 Marie D.    │ #VIP #tech     │ 🟢 Client      │         │ │
│ │ ├────────────────┼────────────────┼────────────────┤         │ │
│ │ │ Créé le        │ Modifié le     │ Dernier contact│         │ │
│ │ │ 15/03/2024     │ 12/01/2025     │ Il y a 2 jours │         │ │
│ │ └────────────────┴────────────────┴────────────────┘         │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Tab: Contacts                                                    │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Mini DataGrid                                [+ Ajouter]     │ │
│ │ Nom           │ Poste          │ Email            │ Principal│ │
│ │ Jean Dupont   │ CTO            │ jean@acme.com    │ ⭐       │ │
│ │ Marie Martin  │ DG             │ marie@acme.com   │          │ │
│ │ Paul Roche    │ Resp. achats   │ paul@acme.com    │          │ │
│ │ Lisa Chen     │ Dev Lead       │ lisa@acme.com    │          │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Tab: Deals                                                       │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Mini DataGrid                                [+ Nouveau deal]│ │
│ │ Titre              │ Montant  │ Étape       │ Close prévue   │ │
│ │ Licence annuelle   │ €45K     │ 🔵 Closing  │ 28/02/2025     │ │
│ │ Extension équipe   │ €22K     │ 🟡 Négoc.   │ 15/03/2025     │ │
│ │ Formation          │ €8K      │ 🟢 Gagné    │ 10/01/2025     │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Tab: Activités                                                   │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [+ Log activité]    Filtre: [Tout ▾]                         │ │
│ │                                                              │ │
│ │ ActivityTimeline                                             │ │
│ │ ● 12 jan — 📞 Appel avec Jean Dupont (15 min)               │ │
│ │           "Discussion renouvellement licence. OK pour +2ans" │ │
│ │ ● 10 jan — 📧 Email envoyé à Marie Martin                   │ │
│ │           "Proposition commerciale envoyée"                  │ │
│ │ ● 08 jan — 📅 RDV avec Jean Dupont (1h)                     │ │
│ │           "Démo produit v2. Très intéressés."                │ │
│ │ ● 05 jan — 📝 Note interne par Marie D.                     │ │
│ │           "Potentiel upsell formation équipe dev"            │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4. Deals — Pipeline Kanban (`/deals`)

**Pattern** : nouveau pattern `pipeline-kanban.md`
**Composants** : PageHeader, FilterBar, KanbanBoard (nouveau), DataGrid (vue alternative)

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   "Pipeline"  (€1.2M total)        [Vue: Kanban | Table] [+ Deal]│
├──────────────────────────────────────────────────────────────────┤
│ FilterBar                                                        │
│ [🔍 Rechercher...] [Assigné ▾] [Montant min ▾] [Close prévue ▾]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ KanbanBoard (scroll horizontal)                                  │
│                                                                  │
│ Qualification (5)  Proposition (8)  Négociation (4)  Closing (3) │
│ €89K               €234K            €156K            €187K       │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌────────────┐
│ │ BioTech Labs │  │ RetailMax    │  │ TechStart    │ │ Acme Corp  │
│ │ €35K         │  │ €65K         │  │ €22K         │ │ €45K       │
│ │ 👤 Jean K.   │  │ 👤 Paul M.   │  │ 👤 Marie D.  │ │ 👤 Marie D.│
│ │ Close: 15/03 │  │ Close: 28/02 │  │ Close: 10/03 │ │ Close: 28/02│
│ │ 60%          │  │ 40%          │  │ 70%          │ │ 90%        │
│ ├──────────────┤  ├──────────────┤  ├──────────────┤ ├────────────┤
│ │ NovaCorp     │  │ DataFlow     │  │ MegaCorp     │ │ BigRetail  │
│ │ €12K         │  │ €18K         │  │ €89K         │ │ €120K      │
│ │ 👤 Paul M.   │  │ 👤 Marie D.  │  │ 👤 Jean K.   │ │ 👤 Paul M. │
│ │ Close: 20/03 │  │ Close: 05/03 │  │ Close: 30/03 │ │ Close: 15/02│
│ │ 30%          │  │ 50%          │  │ 60%          │ │ 85%        │
│ └──────────────┘  ├──────────────┤  └──────────────┘ └────────────┘
│                   │ CloudApp     │                                │
│                   │ €28K         │                                │
│                   │ ...          │                                │
│                   └──────────────┘                                │
│                                                                  │
│ Drag & drop pour changer d'étape                                 │
└──────────────────────────────────────────────────────────────────┘
```

**Vue alternative table** : switch vers un DataGrid classique avec colonnes (titre, entreprise, montant, étape, probabilité, close prévue, assigné, dernière activité)

---

### 5. Deal — Détail (`/deals/[id]`)

**Pattern** : `resource-detail.md` + `StatusFlow`
**Composants** : PageHeader, StatusFlow, DetailPanel, FieldGrid, DataGrid (lignes de deal), ActivityTimeline

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   Pipeline > Acme Corp — Licence annuelle                        │
│   "Licence annuelle"  €45 000            [Modifier] [Créer devis]│
├──────────────────────────────────────────────────────────────────┤
│ StatusFlow                                                       │
│   ✅ Qualif. → ✅ Proposition → ✅ Négociation → 🔵 Closing → ○ Gagné │
│                                                [Marquer gagné ▾] │
│                                          (dropdown: Gagné / Perdu)│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Grid 2 colonnes                                                  │
│ ┌──────────────────────────────┬─────────────────────────────┐   │
│ │ Section "Deal"               │ Section "Lignes"            │   │
│ │ ┌──────────┬──────────┐      │                             │   │
│ │ │ Montant  │ Proba.   │      │ Produit       │ Qté │ Prix  │   │
│ │ │ €45 000  │ 90%      │      │ Licence Pro   │  25 │ €1500 │   │
│ │ ├──────────┼──────────┤      │ Support Gold  │   1 │ €7500 │   │
│ │ │ Close    │ Assigné  │      │               │     │       │   │
│ │ │ 28/02/25 │ Marie D. │      │ Total HT: €45 000          │   │
│ │ ├──────────┼──────────┤      │ TVA 20%:   €9 000           │   │
│ │ │ Entreprise│ Contact │      │ Total TTC: €54 000          │   │
│ │ │ Acme Corp │ J.Dupont│      │                             │   │
│ │ └──────────┴──────────┘      │ [+ Ajouter une ligne]       │   │
│ │                              │                             │   │
│ └──────────────────────────────┴─────────────────────────────┘   │
│                                                                  │
│ Section "Activités"                                              │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ [+ Log activité]                                             │ │
│ │ ● 12 jan — 📞 Appel closing (15 min) — Jean Dupont          │ │
│ │ ● 08 jan — 📅 Démo v2 (1h) — Jean Dupont, Marie Martin     │ │
│ │ ● 03 jan — 📧 Envoi proposition — Jean Dupont               │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

### 6. Deal — Création/Édition (`/deals/new`, `/deals/[id]/edit`)

**Pattern** : `resource-create-edit.md`
**Composants** : PageHeader, FormSection, FieldGrid, FormField, DealLinesEditor (nouveau)

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   Pipeline > Nouveau deal                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ FormSection "Informations" (open)                                │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ Titre *              │ Montant estimé *                      │ │
│ │ [________________]   │ [________] €                          │ │
│ │                      │                                       │ │
│ │ Entreprise *         │ Contact principal                     │ │
│ │ [Acme Corp     ▾🔍]  │ [Jean Dupont      ▾]                  │ │
│ │ (searchable select)  │ (filtré par entreprise sélectionnée)  │ │
│ │                      │                                       │ │
│ │ Étape *              │ Probabilité                           │ │
│ │ [Qualification ▾]    │ [30] %  (auto-rempli selon étape)     │ │
│ │                      │                                       │ │
│ │ Date de closing      │ Assigné à *                           │ │
│ │ [📅 15/03/2025]       │ [Marie D.         ▾]                  │ │
│ │                      │                                       │ │
│ │ Description                                                  │ │
│ │ [__________________________________________]                 │ │
│ │ [__________________________________________]                 │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ FormSection "Lignes du deal"                                     │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ DealLinesEditor (table éditable)                             │ │
│ │ Produit           │ Quantité │ Prix unit. │ Remise │ Total   │ │
│ │ [Licence Pro  ▾🔍] │ [25    ] │ €1 500    │ [0] %  │ €37 500 │ │
│ │ [Support Gold ▾🔍] │ [1     ] │ €7 500    │ [0] %  │ €7 500  │ │
│ │ [+ Ajouter une ligne]                                        │ │
│ │                                                              │ │
│ │                              Sous-total HT:    €45 000       │ │
│ │                              Remise totale:         €0       │ │
│ │                              Total HT:         €45 000       │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ─────────────────────────────────────────────────────── (sticky) │
│                                         [Annuler] [Créer le deal]│
└──────────────────────────────────────────────────────────────────┘
```

**Champs conditionnels** :
- Contact filtré par l'entreprise sélectionnée
- Probabilité auto-remplie selon l'étape (qualification=20%, proposition=40%, etc.) mais éditable
- Prix unitaire auto-rempli depuis le catalogue produit mais éditable

---

### 7. Contacts — Liste (`/contacts`)

**Pattern** : `resource-list.md`

Colonnes : nom (lien), entreprise (lien), poste, email, téléphone, tags, dernier contact, assigné
Filtres : search, entreprise, tags, sans activité depuis X jours
Spécificité : filtre "contacts dormants" (pas d'activité > 30j) en vue sauvegardée

---

### 8. Contact — Détail (`/contacts/[id]`)

**Pattern** : `resource-detail.md`

Tabs : Résumé (infos + entreprise liée), Activités (timeline filtrée sur ce contact), Deals (deals où ce contact est impliqué)

---

### 9. Devis — Liste (`/quotes`)

**Pattern** : `resource-list.md`

Colonnes : référence, entreprise, deal, montant TTC, statut (draft/sent/accepted/rejected/expired), créé le, valide jusqu'au
Filtres : search, statut, montant min/max, date
Actions : dupliquer, envoyer, télécharger PDF

---

### 10. Devis — Détail & Éditeur (`/quotes/[id]`)

**Pattern** : mix `resource-detail.md` + `resource-create-edit.md`
**Composants** : StatusFlow, QuoteEditor (nouveau), PDF preview

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   Devis > DEV-2025-0042                                          │
│   "DEV-2025-0042"  🟡 Envoyé         [Modifier] [PDF] [Envoyer] │
├──────────────────────────────────────────────────────────────────┤
│ StatusFlow                                                       │
│   ✅ Brouillon → 🔵 Envoyé → ○ Accepté                          │
│                               ○ Refusé                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ SplitView                                                        │
│ ┌─────────────────────────┬──────────────────────────────────┐   │
│ │ Infos devis             │ Aperçu PDF                       │   │
│ │                         │ ┌──────────────────────────────┐ │   │
│ │ Entreprise: Acme Corp   │ │ ┌────────────────────────┐   │ │   │
│ │ Contact: Jean Dupont    │ │ │ LOGO        FORGE CRM  │   │ │   │
│ │ Deal: Licence annuelle  │ │ │                        │   │ │   │
│ │ Valide jusqu'au: 28/02  │ │ │ DEVIS DEV-2025-0042   │   │ │   │
│ │                         │ │ │                        │   │ │   │
│ │ Lignes:                 │ │ │ Produit  Qté  Prix     │   │ │   │
│ │ ┌────────────────────┐  │ │ │ Lic Pro   25  €37 500  │   │ │   │
│ │ │ Licence Pro │ €37.5K│ │ │ │ Support    1  €7 500   │   │ │   │
│ │ │ Support     │ €7.5K │ │ │ │                        │   │ │   │
│ │ └────────────────────┘  │ │ │ Total HT:    €45 000   │   │ │   │
│ │                         │ │ │ TVA 20%:      €9 000   │   │ │   │
│ │ Conditions:             │ │ │ Total TTC:   €54 000   │   │ │   │
│ │ Paiement 30 jours...    │ │ └────────────────────────┘   │ │   │
│ │                         │ └──────────────────────────────┘ │   │
│ └─────────────────────────┴──────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

### 11. Produits / Catalogue (`/products`)

**Pattern** : `resource-list.md` + `resource-create-edit.md`

Colonnes : référence, nom, catégorie, prix HT, taux TVA, actif (switch toggle)
Formulaire simple : 8 champs, pas de multi-step
Spécificité : toggle actif/inactif directement dans la table (inline action)

---

### 12. Import de contacts (`/contacts/import`)

**Pattern** : `resource-import.md`

Showcase complet du wizard d'import :
- Upload CSV (export LinkedIn, fichier salon, base existante)
- Mapping : "First Name" → prénom, "Company" → entreprise
- Validation : emails invalides, doublons détectés (par email)
- Résultat : 2 847 importés, 23 doublons ignorés, 5 erreurs

---

### 13. Reporting (`/reports`)

**Pattern** : nouveau pattern `reporting.md`
**Composants** : PageHeader, FilterBar (période + filtres), ChartCard (multiples), DataGrid

```
┌──────────────────────────────────────────────────────────────────┐
│ PageHeader                                                       │
│   "Rapports"                     [Période: Jan-Déc 2025] [Export]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Tabs: [Pipeline] [Performance] [Activités] [Prévisions]         │
│                                                                  │
│ Tab: Pipeline                                                    │
│ ┌────────────────────────────┬───────────────────────────────┐   │
│ │ "Funnel de conversion"     │ "Valeur pipeline par mois"    │   │
│ │ Qualif.  ████████████ 100% │                               │   │
│ │ Propos.  ████████░░░░  65% │    ╱\    ╱──╲                 │   │
│ │ Négoc.   █████░░░░░░░  42% │ ──╱  \──╱    \──             │   │
│ │ Closing  ███░░░░░░░░░  28% │                               │   │
│ │ Gagné    ██░░░░░░░░░░  18% │                               │   │
│ └────────────────────────────┴───────────────────────────────┘   │
│                                                                  │
│ Tab: Performance                                                 │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ DataGrid — "Performance par commercial"                      │ │
│ │ Commercial │ Deals créés │ Deals gagnés │ CA │ Taux │ Panier │ │
│ │ Marie D.   │ 34          │ 12           │€180K│ 35%  │ €15K   │ │
│ │ Paul M.    │ 28          │ 8            │€120K│ 29%  │ €15K   │ │
│ │ Jean K.    │ 22          │ 9            │€95K │ 41%  │ €10.5K │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Tab: Prévisions                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ "Forecast CA" (weighted pipeline = montant × probabilité)    │ │
│ │                                                              │ │
│ │ Fév 2025:  █████████████████████  €187K (forecast)           │ │
│ │ Mar 2025:  ████████████████       €134K (forecast)           │ │
│ │ Avr 2025:  █████████              €78K  (forecast)           │ │
│ └──────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

### 14. Settings (`/settings`)

**Pattern** : `settings-admin.md`
**Composants** : Tabs vertical, FormSection, DataGrid (users)

Tabs latéraux :
- **Équipe** : DataGrid des users, invitations, rôles (admin/manager/sales)
- **Pipeline** : Configurer les étapes du pipeline (nom, couleur, probabilité par défaut)
- **Produits** : Lien vers /products
- **Emails** : Templates d'emails (devis envoyé, relance, etc.)
- **Import/Export** : Lien vers /contacts/import + export global
- **Mon compte** : Profil, mot de passe, notifications

---

## Mapping écrans → patterns du kit

| Écran | Pattern | Composants clés showcasés |
|---|---|---|
| Dashboard | `dashboard.md` | StatsGrid, ChartCard, DataGrid mini, ActivityTimeline |
| Companies list | `resource-list.md` | DataGrid (8 cols), FilterBar (5 filtres), BulkActionBar |
| Company detail | `resource-detail.md` | DetailPanel, FieldGrid, Tabs, DataGrid embedded, ActivityTimeline |
| Company create/edit | `resource-create-edit.md` | FormSection, FieldGrid, FormField |
| Deals pipeline | NOUVEAU `pipeline-kanban.md` | KanbanBoard, FilterBar, toggle vue |
| Deal detail | `resource-detail.md` | StatusFlow, DetailPanel, DealLinesEditor |
| Deal create/edit | `resource-create-edit.md` | FormField conditionnel, DealLinesEditor, calculs |
| Contacts list | `resource-list.md` | DataGrid, vues sauvegardées |
| Contact detail | `resource-detail.md` | Tabs, embedded DataGrids |
| Quotes list | `resource-list.md` | DataGrid avec actions (PDF, envoyer) |
| Quote detail | mix detail+edit | StatusFlow, SplitView, PDF preview |
| Products | `resource-list.md` + edit | Inline toggle, CRUD simple |
| Import contacts | `resource-import.md` | ImportWizard complet |
| Reporting | NOUVEAU `reporting.md` | ChartCard multiples, funnel, forecast |
| Settings | `settings-admin.md` | Tabs vertical, permissions, config |

## Nouveaux composants à créer pour la démo

| Composant | Description |
|---|---|
| **KanbanBoard** | Board drag & drop avec colonnes, cards, totaux par colonne |
| **DealLinesEditor** | Table éditable inline (produit, qté, prix, remise) avec calculs auto |
| **QuotePreview** | Aperçu PDF d'un devis dans un iframe/canvas |
| **FunnelChart** | Graphique en entonnoir pour les taux de conversion |
| **ForecastChart** | Bar chart horizontal avec valeurs pondérées (montant × proba) |
| **SavedViews** | Sélecteur de vues sauvegardées pour FilterBar |
| **InlineEdit** | Champ éditable au clic dans une table (pour toggle, statut rapide) |
| **QuickLogActivity** | Formulaire compact pour logger un appel/email/note rapidement |

## Seed Data

La démo doit avoir des données réalistes :

- **50 entreprises** (noms crédibles, secteurs variés, mix statuts)
- **120 contacts** (répartis sur les entreprises, 2-3 par entreprise)
- **35 deals** (répartis sur les étapes du pipeline, montants entre €5K et €200K)
- **200 activités** (appels, emails, RDV sur les 3 derniers mois)
- **15 devis** (liés aux deals, mix statuts)
- **20 produits** (licences, services, formation, support)
- **5 users** (2 sales, 1 manager, 1 admin, 1 sales junior)
