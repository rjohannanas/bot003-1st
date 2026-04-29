"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChatSession, Message } from "@/types/chat"

const STORAGE_KEY = "bot003-chat-sessions"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function generateTitle(firstMessage: string): string {
  const truncated = firstMessage.slice(0, 40)
  return truncated.length < firstMessage.length ? `${truncated}...` : truncated
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatSession[]
        setSessions(parsed)
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id)
        }
      } catch {
        console.error("Failed to parse stored sessions")
      }
    }
    setIsLoaded(true)
  }, [])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    }
  }, [sessions, isLoaded])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null

  const createSession = useCallback((): string => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "Nueva conversacion",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    return newSession.id
  }, [])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId)
      return filtered
    })
    setActiveSessionId((current) => {
      if (current === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId)
        return remaining.length > 0 ? remaining[0].id : null
      }
      return current
    })
  }, [sessions])

  const addMessage = useCallback((sessionId: string, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    }

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session

        const updatedMessages = [...session.messages, newMessage]
        const shouldUpdateTitle =
          session.title === "Nueva conversacion" &&
          message.role === "user" &&
          session.messages.length === 0

        return {
          ...session,
          messages: updatedMessages,
          title: shouldUpdateTitle ? generateTitle(message.content) : session.title,
          updatedAt: Date.now(),
        }
      })
    )

    return newMessage
  }, [])

  const updateLastAssistantMessage = useCallback(
    (sessionId: string, content: string, sources?: Message["sources"]) => {
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== sessionId) return session

          const messages = [...session.messages]
          const lastIndex = messages.length - 1

          if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
            messages[lastIndex] = {
              ...messages[lastIndex],
              content,
              sources: sources || messages[lastIndex].sources,
            }
          }

          return {
            ...session,
            messages,
            updatedAt: Date.now(),
          }
        })
      )
    },
    []
  )

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoaded,
    setActiveSessionId,
    createSession,
    deleteSession,
    addMessage,
    updateLastAssistantMessage,
  }
}
