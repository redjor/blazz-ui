"use client";

import { Suggestion, Suggestions } from "@blazz/ui/components/ai/chat/suggestion";

const suggestions = [
  "Mes todos du jour",
  "Crée un todo pour demain",
  "Résumé de la semaine",
  "Combien d'heures cette semaine ?",
  "Liste mes projets actifs",
];

interface ChatSuggestionsProps {
  onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <Suggestions>
      {suggestions.map((text) => (
        <Suggestion key={text} onClick={() => onSelect(text)}>
          {text}
        </Suggestion>
      ))}
    </Suggestions>
  );
}
