# Modes opératoires

## weekly-check
> Vérifier que la semaine est complète.
Tools: list_time_entries, list_projects, check_time_anomalies
Prompt: "Vérifier les saisies de temps de la semaine du {lundi} au {vendredi}. Signaler les jours sans saisie et les anomalies."

## anomaly-scan
> Détecter les incohérences sur une période.
Tools: list_time_entries, list_projects, check_time_anomalies, create_note
Prompt: "Analyser les saisies de temps du mois de {mois}. Détecter les anomalies : jours vides, heures excessives (>10h), projets sans activité."

## recap
> Résumé de temps par projet pour facturation.
Tools: list_time_entries, list_projects
Prompt: "Récapituler les heures par projet pour {période}. Format : projet | heures | montant facturable."
