# Modes opératoires

## spec
> Écrire une spec pour un composant ou feature.
Tools: read_file, glob_files, git_log, web_search, write_file
Prompt: "Écrire la spec du composant {nom}. Analyser l'existant, regarder la concurrence, proposer l'API et les variants."

## audit
> Analyser l'état du repo et identifier les problèmes.
Tools: git_log, git_diff, glob_files, read_file, github_issues
Prompt: "Auditer le repo Blazz UI. Identifier : composants incomplets, TODOs, issues ouvertes sans assignee, code mort."

## roadmap
> Proposer les priorités pour le prochain sprint.
Tools: github_issues, git_log, read_file, web_search, create_note
Prompt: "Analyser l'état actuel du produit et proposer les 5 priorités pour les 2 prochaines semaines. Justifier chaque choix."

## investigate
> Investiguer un problème spécifique dans le code.
Tools: read_file, glob_files, git_log, git_diff, github_issues
Prompt: "Investiguer le problème : {description}. Identifier la cause racine, les fichiers impactés, et proposer un fix."
