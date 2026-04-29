"use client"

import { useEffect, useRef } from "react"
import { User, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SourceCards } from "./source-cards"
import type { Message } from "@/types/chat"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Message[]
  streamingContent?: string
  isStreaming?: boolean
}

export function MessageList({ messages, streamingContent, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bot className="size-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Bienvenido a Bot003 Seteloee</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hazme una pregunta sobre los documentos disponibles
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-col gap-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isStreaming && streamingContent && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{streamingContent}</p>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </ScrollArea>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-muted text-muted-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div className={cn("flex-1 space-y-2", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p className="whitespace-pre-wrap m-0">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <SourceCards sources={message.sources} />
        )}
      </div>
    </div>
  )
}
