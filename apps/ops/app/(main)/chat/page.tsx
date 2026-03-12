"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@blazz/ui/components/ai/chat/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@blazz/ui/components/ai/chat/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@blazz/ui/components/ai/chat/prompt-input";
import { PageHeader } from "@blazz/ui/components/blocks/page-header";
import { Button } from "@blazz/ui/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { RotateCcw } from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { ChatSuggestions } from "@/components/chat/chat-suggestions";
import { ChatToolHandler } from "@/components/chat/chat-tool-handler";

export default function ChatPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    setMessages,
    addToolResult,
    error,
  } = useChat({
    api: "/api/chat",
    maxSteps: 5,
    onError: (err) => {
      toast.error("Erreur chat : " + err.message);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const text = (formData.get("message") as string)?.trim();
      if (!text) return;
      sendMessage({ text });
      e.currentTarget.reset();
    },
    [sendMessage]
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      sendMessage({ text });
    },
    [sendMessage]
  );

  const handleClear = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Chat">
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <RotateCcw className="size-3.5" />
            Effacer
          </Button>
        )}
      </PageHeader>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="max-w-3xl mx-auto px-4">
          {messages.length === 0 && (
            <ConversationEmptyState>
              <div className="text-center space-y-4">
                <h2 className="text-lg font-semibold text-fg">
                  Comment puis-je t&apos;aider ?
                </h2>
                <p className="text-sm text-fg-subtle">
                  Je peux gérer tes todos, clients, projets et temps.
                </p>
                <ChatSuggestions onSelect={handleSuggestion} />
              </div>
            </ConversationEmptyState>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              from={message.role as "user" | "assistant"}
            >
              <MessageContent>
                {message.parts.map((part, i) => {
                  if (part.type === "text" && part.text) {
                    return (
                      <MessageResponse key={`text-${i}`}>
                        {part.text}
                      </MessageResponse>
                    );
                  }
                  // Handle tool invocation parts (type starts with "tool-")
                  if (
                    "toolCallId" in part &&
                    "state" in part &&
                    part.state === "input-available"
                  ) {
                    return (
                      <ChatToolHandler
                        key={part.toolCallId}
                        toolName={part.type.replace("tool-", "")}
                        args={(part as any).input ?? {}}
                        toolCallId={part.toolCallId}
                        addToolResult={addToolResult}
                      />
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-edge bg-surface px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <form ref={formRef} onSubmit={handleSubmit}>
            <PromptInput>
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder="Demande-moi quelque chose..."
                  disabled={isStreaming}
                />
                <PromptInputFooter>
                  <PromptInputSubmit
                    status={isStreaming ? "streaming" : "ready"}
                    onStop={stop}
                  />
                </PromptInputFooter>
              </PromptInputBody>
            </PromptInput>
          </form>
        </div>
      </div>
    </div>
  );
}
