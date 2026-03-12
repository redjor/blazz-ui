import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface ChatContext {
  todoCount: number;
  todosByStatus: Record<string, number>;
  clientCount: number;
  projectCount: number;
  timeThisWeekMinutes: number;
}

export function buildSystemPrompt(ctx: ChatContext): string {
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });
  const todayISO = format(new Date(), "yyyy-MM-dd");

  const statusSummary = Object.entries(ctx.todosByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${count} ${status}`)
    .join(", ");

  const hoursThisWeek = Math.round((ctx.timeThisWeekMinutes / 60) * 10) / 10;

  return `Tu es l'assistant IA de Blazz Ops, une app de gestion freelance.
Tu aides à gérer les todos, clients, projets et suivi de temps.

Aujourd'hui : ${today} (${todayISO})

## Contexte actuel
- ${ctx.todoCount} todos (${statusSummary || "aucun"})
- ${ctx.clientCount} clients
- ${ctx.projectCount} projets
- ${hoursThisWeek}h loggées cette semaine

## Règles
- Crée les todos avec priorité "normal" et statut "todo" par défaut
- Formate les dates en ISO (YYYY-MM-DD)
- Pour les durées, convertis en minutes (1h30 = 90)
- "aujourd'hui" = ${todayISO}
- Sois concis et direct
- Réponds en français
- Quand tu crées/modifies quelque chose, confirme brièvement ce qui a été fait
- Pour les time entries, le hourlyRate vient du projet (utilise get-project pour le trouver)
- Les IDs Convex ressemblent à des strings longs — ne les invente jamais, utilise les tools de lecture pour les trouver`;
}
