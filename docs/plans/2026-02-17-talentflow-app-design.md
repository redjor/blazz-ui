# TalentFlow — Design Document

> **Date:** 2026-02-17
> **Status:** Approved
> **Goal:** Build TalentFlow, a mini ATS (Applicant Tracking System) demo app using the Warm theme to showcase kit adaptability beyond CRM.

---

## Concept

TalentFlow is a 3-page recruitment app that proves the Pro UI Kit works for any data-heavy domain, not just CRM. It uses the **Warm** theme (amber accent, cream surfaces) and reuses the same block components as Forge CRM.

**User persona:** Marie Dubois, Responsable RH, marie.dubois@talentflow.io

---

## Pages

| Page | Route | Blocks Used |
|------|-------|-------------|
| Dashboard | `/examples/talentflow/dashboard` | PageHeader, StatsGrid, ChartCard (x2) |
| Candidats | `/examples/talentflow/candidates` | PageHeader, DataTable (custom preset) |
| Offres | `/examples/talentflow/jobs` | PageHeader, DataTable (custom preset) |

### Dashboard

4 KPIs:
- Postes ouverts (Briefcase icon)
- Candidatures ce mois (Users icon)
- Entretiens cette semaine (Calendar icon)
- Taux d'embauche (TrendingUp icon)

2 charts:
- Line chart: candidatures recues par mois (6 mois)
- Bar chart: pipeline candidats par etape (Nouveau, Screening, Entretien, Technique, Offre, Embauche)

### Candidats (DataTable)

Columns: Nom (linked), Poste vise, Etape (badge), Source, Date candidature, Score (progress-like)

Etapes: `new` | `screening` | `interview` | `technical` | `offer` | `hired` | `rejected`

Views: Tous, Nouveaux, En entretien, Offre envoyee, Embauches

### Offres d'emploi (DataTable)

Columns: Titre du poste, Departement, Lieu, Nb candidats, Statut (badge), Date publication

Statuts: `open` | `closed` | `draft`

---

## Architecture

### Route structure

```
app/(examples)/examples/talentflow/
  layout.tsx          ← TalentFlow layout (copies CRM pattern)
  dashboard/page.tsx  ← Dashboard
  candidates/page.tsx ← Candidats list
  jobs/page.tsx       ← Offres list
```

### Navigation

**Sidebar config:** `config/talentflow-navigation.ts`

```
TalentFlow
  ├── Tableau de bord  → /examples/talentflow/dashboard
  ├── Candidats        → /examples/talentflow/candidates
  └── Offres d'emploi  → /examples/talentflow/jobs
```

**Top bar:** Add "TalentFlow" section in the switcher (Docs | CRM | TalentFlow). Extend `activeSection` type to include `"talentflow"`.

### Data

**File:** `lib/sample-data/talentflow.ts`

Types:
- `Candidate` — id, firstName, lastName, email, position, stage, source, score, appliedAt
- `Job` — id, title, department, location, candidateCount, status, publishedAt
- `TalentflowStats` — openPositions, applicationsThisMonth, interviewsThisWeek, hireRate + trends

Data volumes: ~25 candidates, ~8 jobs, dashboard stats, chart data.

### DataTable presets

Two new presets in `components/features/data-table/presets/`:
- `talentflow-candidates.tsx` — columns, views, row actions for candidates
- `talentflow-jobs.tsx` — columns, views, row actions for jobs

---

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `lib/sample-data/talentflow.ts` | Create | Types + mock data (candidates, jobs, stats, charts) |
| `config/talentflow-navigation.ts` | Create | Sidebar navigation config |
| `components/features/data-table/presets/talentflow-candidates.tsx` | Create | Candidates DataTable preset |
| `components/features/data-table/presets/talentflow-jobs.tsx` | Create | Jobs DataTable preset |
| `components/features/data-table/presets/index.ts` | Modify | Export new presets |
| `app/(examples)/examples/talentflow/layout.tsx` | Create | TalentFlow layout |
| `app/(examples)/examples/talentflow/dashboard/page.tsx` | Create | Dashboard page |
| `app/(examples)/examples/talentflow/candidates/page.tsx` | Create | Candidates list page |
| `app/(examples)/examples/talentflow/jobs/page.tsx` | Create | Jobs list page |
| `components/layout/app-top-bar.tsx` | Modify | Add TalentFlow to section switcher |

Zero changes to existing components — same blocks, different data.
