# Tiptap Editor Enhancements — Design

## Objectif

Ajouter 3 features au Tiptap editor de apps/ops : drag handles, couleur/surlignage, tables.

## 1. Drag Handles (custom ProseMirror)

- Poignee `⠿` au hover a gauche de chaque bloc (paragraph, heading, list, blockquote, code, image, table)
- Bouton `+` au-dessus pour inserer un bloc (ouvre le slash menu a cette position)
- Drag & drop via ProseMirror natif (pas @dnd-kit)
- Apparait au mouseenter, disparait au mouseleave

## 2. Couleur / Surlignage

- Extensions : `@tiptap/extension-color` + `@tiptap/extension-text-style` + `@tiptap/extension-highlight`
- Bubble menu : 2 nouveaux boutons apres le separateur
  - Couleur texte : popover 8 couleurs + reset
  - Surlignage : popover 6 couleurs pastel + reset
- Couleurs alignees sur tokens oklch existants

## 3. Tables

- Extensions : `@tiptap/extension-table` + `@tiptap/extension-table-row` + `@tiptap/extension-table-header` + `@tiptap/extension-table-cell`
- Slash menu : "Tableau" insere un 3x3
- Bubble menu contextuel dans table : ajouter/supprimer ligne, ajouter/supprimer colonne, supprimer tableau
- CSS bordures et sizing

## Hors scope

- Pas de colonnes/layout multi-colonnes
- Pas de redimensionnement de colonnes (drag resize)
- Pas de fusion de cellules
