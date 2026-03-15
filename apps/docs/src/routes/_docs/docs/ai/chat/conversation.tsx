import { Conversation, ConversationContent } from "@blazz/pro/components/ai/chat/conversation"
import { Message, MessageContent } from "@blazz/pro/components/ai/chat/message"
import {
	PromptInput,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from "@blazz/pro/components/ai/chat/prompt-input"
import { Suggestion, Suggestions } from "@blazz/pro/components/ai/chat/suggestion"
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@blazz/pro/components/ai/reasoning/reasoning"
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "@blazz/pro/components/ai/reasoning/sources"
import { createFileRoute } from "@tanstack/react-router"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"

export const Route = createFileRoute("/_docs/docs/ai/chat/conversation")({
	component: ConversationPage,
})

const toc = [{ id: "full-demo", title: "Full Demo" }]

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

function ConversationPage() {
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
							<Message from="user">
								<MessageContent>
									Comment puis-je optimiser les performances de mon application React ?
								</MessageContent>
							</Message>

							<Message from="assistant">
								<Reasoning defaultOpen={false} duration={12}>
									<ReasoningTrigger />
									<ReasoningContent>
										L'utilisateur demande des conseils sur les performances React. Je vais couvrir
										la memoisation, le code splitting et la virtualisation car ce sont les trois
										leviers les plus impactants pour une application React standard.
									</ReasoningContent>
								</Reasoning>
								<MessageContent>
									<div className="space-y-3">
										<p>
											Voici plusieurs strategies pour ameliorer les performances de votre
											application React :
										</p>
										<p>
											<strong>1. Memoisation des composants</strong>
										</p>
										<p>
											Utilisez{" "}
											<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">React.memo()</code>{" "}
											pour eviter les re-renders inutiles.
										</p>
										<p>
											<strong>2. Code splitting</strong>
										</p>
										<p>
											Divisez votre bundle avec{" "}
											<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">React.lazy()</code>{" "}
											et <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">Suspense</code>.
										</p>
										<p>
											<strong>3. Virtualisation des listes</strong>
										</p>
										<p>
											Pour les longues listes, utilisez{" "}
											<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">react-window</code>{" "}
											ou{" "}
											<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">
												@tanstack/virtual
											</code>
											.
										</p>
									</div>
								</MessageContent>
							</Message>

							<Message from="user">
								<MessageContent>
									Et pour le state management, quelles sont les meilleures pratiques ?
								</MessageContent>
							</Message>

							<Message from="assistant">
								<MessageContent>
									<div className="space-y-3">
										<p>Le choix depend de la complexite de votre application :</p>
										<ul className="list-inside list-disc space-y-1">
											<li>
												<strong>Etat local</strong> :{" "}
												<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">useState</code> +{" "}
												<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">useReducer</code>
											</li>
											<li>
												<strong>Etat serveur</strong> : TanStack Query ou SWR
											</li>
											<li>
												<strong>Etat global</strong> : Zustand ou Jotai
											</li>
											<li>
												<strong>Etat URL</strong> :{" "}
												<code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">nuqs</code>
											</li>
										</ul>
									</div>
								</MessageContent>
								<Sources>
									<SourcesTrigger count={3} />
									<SourcesContent>
										{mockSources.map((source) => (
											<Source key={source.href} href={source.href} title={source.title} />
										))}
									</SourcesContent>
								</Sources>
							</Message>
						</ConversationContent>
					</Conversation>

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
