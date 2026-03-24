# Color Tuner — Dev Tool for apps/ops

> Design doc validé le 23 mars 2026.

## Goal
Bouton discret (palette icon) fixed en bas à droite de l'app ops. Ouvre un Sheet avec tous les design tokens oklch groupés par catégorie. Chaque token = swatch + 3 sliders (L/C/H). Changements live sur la page. Bouton Copy CSS pour exporter les tokens modifiés.

## Tokens éditables (6 groupes)

| Groupe | Tokens |
|--------|--------|
| Surfaces | `--surface-base`, `--surface-top` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted` |
| Borders | `--border-default`, `--border-subtle` |
| Accent | `--accent`, `--accent-hover`, `--accent-foreground` |
| Semantic | `--success`, `--warning`, `--destructive`, `--info` |
| Chart | `--chart-1` → `--chart-5` |

## Comportement
- Parse oklch initiales via `getComputedStyle(document.documentElement)`
- Sliders: L (0→1, step 0.005), C (0→0.4, step 0.005), H (0→360, step 1)
- Override live via `document.documentElement.style.setProperty()`
- Reset = remove overrides
- Copy CSS = clipboard des tokens modifiés uniquement
- Respecte light/dark (lit les valeurs du mode actif)
- Pas de persistence

## Fichiers
- `apps/ops/components/color-tuner.tsx` — Sheet + contrôles
- `apps/ops/app/(main)/layout.tsx` — ajouter le trigger button
