"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocHero } from "@/components/docs/doc-hero"
import {
	Conversation,
	ConversationContent,
} from "@blazz/ui/components/ai/chat/conversation"
import { Message, MessageContent } from "@blazz/ui/components/ai/chat/message"
import {
	Reasoning,
	ReasoningTrigger,
	ReasoningContent,
} from "@blazz/ui/components/ai/reasoning/reasoning"
import {
	Sources,
	SourcesTrigger,
	SourcesContent,
	Source,
} from "@blazz/ui/components/ai/reasoning/sources"
import { Suggestions, Suggestion } from "@blazz/ui/components/ai/chat/suggestion"
import {
	PromptInput,
	PromptInputTextarea,
	PromptInputFooter,
	PromptInputSubmit,
} from "@blazz/ui/components/ai/chat/prompt-input"

const toc = [{ id: "full-demo", title: "Full Demo" }]

const mockMessages = [
	{
		id: "1",
		role: "user" as const,
		content:
			"Comment puis-je optimiser les performances de mon application React ?",
	},
	{
		id: "2",
		role: "assistant" as const,
		content:
			"Voici plusieurs strategies pour ameliorer les performances de votre application React :\n\n**1. Memoisation des composants**\nUtilisez `React.memo()` pour eviter les re-renders inutiles des composants dont les props ne changent pas.\n\n**2. Code splitting**\nDivisez votre bundle avec `React.lazy()` et `Suspense` pour ne charger que le code necessaire.\n\n**3. Virtualisation des listes**\nPour les longues listes, utilisez `react-window` ou `@tanstack/virtual` pour ne rendre que les elements visibles.",
		hasReasoning: true,
	},
	{
		id: "3",
		role: "user" as const,
		content:
			"Et pour le state management, quelles sont les meilleures pratiques ?",
	},
	{
		id: "4",
		role: "assistant" as const,
		content:
			"Le choix depend de la complexite de votre application :\n\n- **Etat local** : `useState` + `useReducer` pour l'etat des composants\n- **Etat serveur** : TanStack Query ou SWR pour les donnees fetchees\n- **Etat global** : Zustand (leger) ou Jotai (atomique) plutot que Redux\n- **Etat URL** : `nuqs` pour synchroniser les filtres avec l'URL",
		hasSources: true,
	},
]

const mockSuggestions = [
	"Quels outils de profiling utiliser ?",
	"Comment optimiser les images ?",
	"Parle-moi de React Server Components",
]

const mockSources = [
	{ title: "React Documentation - Performance", href: "https://react.dev/learn/render-and-commit" },
	{ title: "TanStack Query - Overview", href: "https://tanstack.com/query/latest" },
	{ title: "Zustand - Getting Started", href: "https://zustand-demo.pmnd.rs/" },
]

export default function ConversationPage() {
	return (
		<DocPage
			title="Conversation"
			subtitle="A complete chat interface combining messages, reasoning, sources, suggestions, and prompt input into a cohesive conversational experience."
			toc={toc}
		>
			<DocHero className="p-0 overflow-hidden">
				<div className="flex h-[600px] w-full flex-col rounded-xl border border-edge bg-surface">
					<Conversation>
						<ConversationContent className="gap-6 p-6">
							{/* Message 1: User */}
							<Message from="user">
								<MessageContent>{mockMessages[0].content}</MessageContent>
							</Message>

							{/* Message 2: Assistant with Reasoning */}
							<Message from="assistant">
								<Reasoning defaultOpen={false} duration={12}>
									<ReasoningTrigger />
									<ReasoningContent>
										L'utilisateur demande des conseils sur les performances React.
										Je vais couvrir la memoisation, le code splitting et la virtualisation
										car ce sont les trois leviers les plus impactants pour une application
										React standard. Je vais aussi mentionner React.memo, useMemo et useCallback
										comme outils de memoisation principaux.
									</ReasoningContent>
								</Reasoning>
								<MessageContent>
									<div className="space-y-3">
										<p>Voici plusieurs strategies pour ameliorer les performances de votre application React :</p>
										<p><strong>1. Memoisation des composants</strong></p>
										<p>Utilisez <code className="rounded bg-raised px-1.5 py-0.5 text-xs">React.memo()</code> pour eviter les re-renders inutiles des composants dont les props ne changent pas.</p>
										<p><strong>2. Code splitting</strong></p>
										<p>Divisez votre bundle avec <code className="rounded bg-raised px-1.5 py-0.5 text-xs">React.lazy()</code> et <code className="rounded bg-raised px-1.5 py-0.5 text-xs">Suspense</code> pour ne charger que le code necessaire.</p>
										<p><strong>3. Virtualisation des listes</strong></p>
										<p>Pour les longues listes, utilisez <code className="rounded bg-raised px-1.5 py-0.5 text-xs">react-window</code> ou <code className="rounded bg-raised px-1.5 py-0.5 text-xs">@tanstack/virtual</code> pour ne rendre que les elements visibles.</p>
									</div>
								</MessageContent>
							</Message>

							{/* Message 3: User */}
							<Message from="user">
								<MessageContent>{mockMessages[2].content}</MessageContent>
							</Message>

							{/* Message 4: Assistant with Sources */}
							<Message from="assistant">
								<MessageContent>
									<div className="space-y-3">
										<p>Le choix depend de la complexite de votre application :</p>
										<ul className="list-inside list-disc space-y-1">
											<li><strong>Etat local</strong> : <code className="rounded bg-raised px-1.5 py-0.5 text-xs">useState</code> + <code className="rounded bg-raised px-1.5 py-0.5 text-xs">useReducer</code> pour l'etat des composants</li>
											<li><strong>Etat serveur</strong> : TanStack Query ou SWR pour les donnees fetchees</li>
											<li><strong>Etat global</strong> : Zustand (leger) ou Jotai (atomique) plutot que Redux</li>
											<li><strong>Etat URL</strong> : <code className="rounded bg-raised px-1.5 py-0.5 text-xs">nuqs</code> pour synchroniser les filtres avec l'URL</li>
										</ul>
									</div>
								</MessageContent>
								<Sources>
									<SourcesTrigger count={3} />
									<SourcesContent>
										{mockSources.map((source) => (
											<Source
												key={source.href}
												href={source.href}
												title={source.title}
											/>
										))}
									</SourcesContent>
								</Sources>
							</Message>
						</ConversationContent>
					</Conversation>

					{/* Input area */}
					<div className="border-t border-edge p-4">
						<div className="mb-3">
							<Suggestions>
								{mockSuggestions.map((s) => (
									<Suggestion key={s} suggestion={s} onClick={() => {}} />
								))}
							</Suggestions>
						</div>
						<PromptInput onSubmit={() => {}}>
							<PromptInputTextarea placeholder="Posez votre question..." />
							<PromptInputFooter>
								<div />
								<PromptInputSubmit />
							</PromptInputFooter>
						</PromptInput>
					</div>
				</div>
			</DocHero>
		</DocPage>
	)
}
