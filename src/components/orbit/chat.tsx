import { useCallback, useRef, useState } from "react";
import { Braces, GitBranch, Paperclip, SquareTerminal, Sparkle } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { IconButton } from "@/components/orbit/icon-button";
import { INITIAL_MESSAGES, MODELS, type ChatMessage } from "@/lib/orbit-data";

const CANNED_REPLY = `Here's the guarded version — it bails out before the write when the bucket is empty, and reports the retry window so callers can back off intelligently:

\`\`\`ts
const allowed = await bucket.take(req.cost);

if (!allowed) {
  return new Response("Too many requests", {
    status: 429,
    headers: { "Retry-After": String(bucket.retryAfterSeconds()) },
  });
}
\`\`\`

I'd pair this with a metric on rejection count per key — that's usually the first thing you want when someone reports being throttled.`;

export function OrbitChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready");
  const [model, setModel] = useState(MODELS[0]!.id);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const streamReply = useCallback(() => {
    const id = crypto.randomUUID();
    setStatus("submitted");

    timers.current.push(
      setTimeout(() => {
        setStatus("streaming");
        setMessages((prev) => [...prev, { id, role: "assistant", content: "" }]);

        const words = CANNED_REPLY.split(" ");
        words.forEach((word, index) => {
          timers.current.push(
            setTimeout(() => {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === id
                    ? {
                        ...message,
                        content:
                          message.content + (index === 0 ? word : ` ${word}`),
                      }
                    : message,
                ),
              );
              if (index === words.length - 1) setStatus("ready");
            }, index * 18),
          );
        });
      }, 650),
    );
  }, []);

  const handleSubmit = useCallback(
    (message: PromptInputMessage, event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const text = message.text?.trim();
      if (!text || status !== "ready") return;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: text },
      ]);
      streamReply();
      form.reset();
    },
    [status, streamReply],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-6 pb-6 pt-6">
          {messages.map((message) => (
            <Message key={message.id} from={message.role} className="max-w-full">
              <MessageContent
                className={
                  message.role === "user"
                    ? "bubble-gradient max-w-[78%] rounded-2xl border border-border/60 px-4 py-2.5 text-[14px] leading-relaxed text-bubble-foreground shadow-soft"
                    : "text-[15px] leading-7 text-foreground"
                }
              >
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Shimmer className="text-sm">Reading the repository…</Shimmer>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl px-6 pb-6">
        <PromptInput
          onSubmit={handleSubmit}
          className="panel-glass rounded-3xl shadow-lifted"
        >
          <PromptInputTextarea
            placeholder="Ask Orbit to refactor, explain, or ship something…"
            className="min-h-[76px] bg-transparent text-[14px] leading-relaxed"
          />
          <PromptInputFooter className="gap-2 border-none px-2 pb-2">
            <PromptInputTools className="gap-0.5">
              <IconButton label="Attach files" side="top">
                <Paperclip />
              </IconButton>
              <IconButton label="Insert code snippet" side="top">
                <Braces />
              </IconButton>
              <IconButton label="Run in terminal" side="top">
                <SquareTerminal />
              </IconButton>
              <IconButton label="Branch context" side="top">
                <GitBranch />
              </IconButton>
              <IconButton label="Auto plan" side="top">
                <Sparkle />
              </IconButton>
            </PromptInputTools>

            <div className="ml-auto flex items-center gap-2">
              <PromptInputSelect value={model} onValueChange={setModel}>
                <PromptInputSelectTrigger className="h-8 rounded-xl border border-border/70 bg-card/60 text-xs">
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent className="rounded-2xl">
                  {MODELS.map((item) => (
                    <PromptInputSelectItem key={item.id} value={item.id}>
                      {item.label}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
              <PromptInputSubmit status={status} className="rounded-xl" />
            </div>
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Orbit runs agentic edits in a sandbox. Review diffs before merging.
        </p>
      </div>
    </div>
  );
}
