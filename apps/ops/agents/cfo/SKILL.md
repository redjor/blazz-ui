# Modes opératoires

## audit
> Vérifier la cohérence des factures vs transactions Qonto.
Tools: qonto_transactions, list_invoices, list_time_entries, create_note
Prompt: "Auditer les factures et transactions du mois de {mois}. Vérifier la cohérence, signaler les écarts."

## forecast
> Projeter la trésorerie sur N mois.
Tools: qonto_balance, list_projects, list_recurring_expenses, treasury_forecast
Prompt: "Projeter la trésorerie sur {horizon} mois. Alerter si le solde descend sous {seuil} €."

## optimize
> Identifier les dépenses inutiles et opportunités.
Tools: qonto_transactions, list_invoices, list_recurring_expenses, create_note
Prompt: "Analyser les dépenses des 3 derniers mois. Identifier les abonnements inutiles, retards clients, et opportunités d'économie."
